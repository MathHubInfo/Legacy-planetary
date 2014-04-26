#/usr/bin/env python

import os, sys, shutil, argparse, urlparse, posixpath, re, markdown2
from bs4 import BeautifulSoup


#Find the first heading of some html. 
def find_title(html, alt=''):
	parsed = BeautifulSoup(html)
	i = 1
	while(i<7):
		h = parsed.findAll("h"+str(i))
		if(len(h) > 0):
			return h[0].get_text()
		i=i+1
	return alt
# Render a bunch of code. 
def md_render(code):
	return markdown2.markdown(code, extras=["footnotes", "fenced-code-blocks", "code-friendly"])

#Creates a relative url from http://stackoverflow.com/questions/7469573/how-to-construct-relative-url-given-two-absolute-urls-in-python
def relative_url(destination, source):
    u_dest = urlparse.urlsplit(destination)
    u_src = urlparse.urlsplit(source)

    _uc1 = urlparse.urlunsplit(u_dest[:2]+tuple('' for i in range(3)))
    _uc2 = urlparse.urlunsplit(u_src[:2]+tuple('' for i in range(3)))

    if _uc1 != _uc2:
        ## This is a different domain
        return destination

    _relpath = posixpath.relpath(u_dest.path, posixpath.dirname(u_src.path))

    return urlparse.urlunsplit(('', '', _relpath, u_dest.query, u_dest.fragment))

def update_link(target, me, doc, warn):
	reltarget = urlparse.urljoin(doc[me]["org"], target)
	parsed = urlparse.urlparse(reltarget)
	path = parsed.path
	query = parsed.query
	fragment = parsed.fragment
	if path == "/" or parsed.scheme == 'http' or parsed.scheme == 'https':
		return target
	else:
		# find path in doc
		for key in doc:
			if doc[key]["org"]==path:
				res = relative_url(doc[key]["target"], doc[me]["target"])
				if query != "":
					res += "?"+query
				if fragment != "":
					res += "#"+fragment
				return res
	if warn:
		print "[!] Unresolved local reference: '"+target+"' in '"+doc[me]["org"]+"'"
	return target

def replace_link(match, me, doc, warn):
	return "<a href=\""+update_link(match.group(1), me, doc, warn)

def resolve_links(me, doc, warn):
	html = doc[me]["render"]
	return re.sub(r'<a href=[\'"]?([^\'" >]+)', lambda x: replace_link(x, me, doc, warn), html)

#Remove doubles from a list in a quick and fancy way
# Source: http://www.peterbe.com/plog/uniqifiers-benchmark
def f7(seq):
    seen = set()
    seen_add = seen.add
    return [ x for x in seq if x not in seen and not seen_add(x)]

# Trys to read a file
def try_read(name):
	try:
		f = open(name)
		in_code = f.read()
		f.close()
	except IOError as e:
		print "[!] FATAL (READ): I/O error({0}): {1}".format(e.errno, e.strerror)
		sys.exit(1)
	except:
		print "[!] FATAL (READ): Unexpected error:", sys.exc_info()[0]
		sys.exit(1)
	return in_code

#Trys to write a file. 
def try_write(output_file, code):
	try:
		directory = os.path.dirname(output_file)

		if not os.path.exists(directory):
			os.makedirs(directory)

		f=open(output_file, 'w+')
		f.write(code)
		f.close()
	except IOError as e:
		print "[!] FATAL (WRITE): I/O error({0}): {1}".format(e.errno, e.strerror)
		sys.exit(1)
	except:
		print "[!] FATAL (WRITE): Unexpected error:", sys.exc_info()[0]
		sys.exit(1)

#Adds a new code file to the list
def add_code(dic, base, path, output, source, index='index', alt_title="", ext="html"):
	newCode = {"source": source, "render":md_render(source), "org": os.path.relpath(path, base)}
	newCode["title"] = find_title(newCode["render"], alt_title)
	rpath,e = os.path.splitext(os.path.relpath(path, base))
	plist = [rpath]
	plist2 = []
	p = rpath
	opth,f = os.path.split(p)
	while 1:
		p,f=os.path.split(p)

		if f!="":
			if(p!=''):
				plist.insert(0, p+"/"+index)
				plist2.insert(0, os.path.relpath(p+"/"+index+"."+ext, opth))
			else:
				plist.insert(0, index)
				plist2.insert(0, os.path.relpath(index+"."+ext, opth))
		else:
			break
	newCode["path"] = f7(plist)
	newCode["pathH"] = f7(plist2)
	newCode["target"] = os.path.join(output, rpath+"."+ext)
	newCode["targetR"] = rpath+"."+ext
	dic[rpath] = newCode
	return dic
#wrapper function for above
def iterate_file(base, out_folder, in_file, dic, index, alt_title, ext):
	dic = add_code(dic, base, in_file, out_folder, try_read(in_file), index, alt_title, ext)
	return dic
	
#iterate over a folder. 
def iterate_folder(base, in_folder, out_folder, dic, render_extensions, copycond, index, alt_title, ext):
	for obj in os.listdir(in_folder):
		if os.path.isfile(os.path.join(in_folder, obj)):
			fn, fe = os.path.splitext(obj)
			if(fe[1:] in render_extensions or "*" in render_extensions):	
				dic = iterate_file(base, out_folder, os.path.join(in_folder, obj), dic, index, alt_title, ext)
				print "[R] "+os.path.join(in_folder, obj)
			elif copycond(fe[1:]):
				inp = os.path.join(in_folder, obj)
				outp = os.path.join(out_folder, fn+fe)
				shutil.copy(inp, outp)
				print "[C] "+inp

		else:
			dic = iterate_folder(base, os.path.join(in_folder, obj), out_folder, dic, render_extensions, copycond, index, alt_title, ext)
	return dic

#Makes the navigational menu
def make_nav(dic, key, prefix, suffix):
	me = dic[key]["path"]
	mpath = []
	for i in range(len(me)-1):
		member = me[i]
		try:
			til = dic[member]["title"]
			mpath.append("["+til+"]("+dic[key]["pathH"][i]+")")
		except:
			print "[!] Missing index File: "+member
			mpath.append(member)
	mpath.append("**"+dic[key]["title"]+"**")
	dic[key]["render"] = md_render(' > '.join(mpath) + "\n")+prefix+dic[key]["render"]+suffix
	return dic

#Creates the output surrounding the actual rendering. 
def output(dic, key, body_only = False, css = True, header = "", match_title="%"):
	me = dic[key]
	output = ""
	if not body_only:
		output += """<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>"""
		output += match_title.replace("%", me["title"])
		output +="""</title>"""
		if css:
			output+= """
		<style type="text/css">
"""+get_css()+"""
		</style>"""

		output += header
		output += """
	</head>
	<body>
"""

	output += me["render"]

	if not body_only:
		output += """
	</body>
</html>"""

	try_write(me["target"], output)


#Parse a text either a file or a text. 
def text_or_file(text):
	if text == "":
		return text
	if os.path.isfile(text):
		return try_read(text)
	return text

def make_sitemap(base, output, index, alt_title, ext, filename, hardcopy, title, dic):
	if filename in dic: 
		del dic[filename]

	myPth = os.path.join(base, filename)
	pth,f = os.path.split(myPth)
	targetH = os.path.join(base, filename)
	rpath = os.path.relpath(targetH, base)

	code = "# "+title+"\n\n"
	codeH = "# "+title+"\n\n" 

	dic = add_code(dic, base, targetH, output, code, index, alt_title, ext)

	dic_keys = sorted(dic.keys())

	

	for key in dic_keys:
		code += "* ["+dic[key]["title"]+"]("+relative_url(dic[key]["org"], rpath)+") ("+dic[key]["targetR"]+")\n"
		codeH += "* ["+dic[key]["title"]+"]("+relative_url(dic[key]["org"], rpath)+") ("+dic[key]["org"]+")\n"

	if hardcopy:
		
		print "[SH] "+targetH
		try_write(targetH, codeH)


	print "[S] "+targetH
	dic = add_code(dic, base, targetH, output, code, index, alt_title, ext)
			
	
	 
		


# Main Function running the logic
def main_run(infolder, outfolder, enable_nav, render_extensions, copycond, index, body_only, css, header, prefix, suffix, alt_title, ext, r_links, warn_links, match_title, sitemap, sitemap_hardcopy, sitemap_title):
	header = text_or_file(header)
	prefix = text_or_file(prefix)
	suffix = text_or_file(suffix)
	dic = iterate_folder(infolder, infolder, outfolder, {}, render_extensions, copycond, index, alt_title, ext)

	if sitemap != "":
		make_sitemap(infolder, outfolder, index, alt_title, ext, sitemap, sitemap_hardcopy, sitemap_title, dic)
	
	
	for key in dic:
		if r_links:
			dic[key]["render"] = resolve_links(key, dic, warn_links)
		if enable_nav:
			dic = make_nav(dic, key, prefix, suffix)
		else:
			dic[key]["render"] = prefix+dic[key]["render"]+suffix
			
		output(dic, key, body_only, css, header, match_title)

# Main Arg parsing function
def main(cargs):
	parser = argparse.ArgumentParser(description='Python Markdown Compiler')

	group0 = parser.add_argument_group('Location', 'Where to find the source, where to put the rendered files. ')

	group0.add_argument('INFOLDER', nargs=1, help='Input folder. ')
	group0.add_argument('OUTFOLDER', nargs=1, help='Output folder. Will be created if it does not exist. ')
	group0.add_argument('--extension', '-e', nargs=1, help='Extension of output files. Default: "html". ', dest="ext", default=["html"], metavar="EXTENSION")

	group1 = parser.add_argument_group('File Selection', 'Which files to render, which to copy. ')

	group1.add_argument('--render', '-r', help='Extensions to render. * is a wildcat and means everything. (Default: ["", "txt", "md"])', nargs='*', dest='RENDER', metavar="EXTENSION", default=["", "txt", "md"])

	copygroup = group1.add_mutually_exclusive_group()

	copygroup.add_argument('--copy', '-c', help='Extensions to copy. * is a wildcat and means everything. (Default: [])', nargs='*', dest='COPY_INCLUDE', metavar="EXTENSION", default=[])

	copygroup.add_argument('--no-copy', '-nc', help='Extensions to exclude from copying. (Default: [])', nargs='*', dest='COPY_EXCLUDE', metavar="EXTENSION", default=[])

	groups = parser.add_argument_group('Sitemap & Navigation', 'How to create navigation and sitemap. ')

	groups.add_argument('--no-nav', '-nn', dest='enable_nav', action='store_const',
                   const=False, default=True,
                   help='Do not render the navigation menu. ')

	groups.add_argument('--nav-index', '-i', help='Navigation Index Filename. Default: "index". ', nargs=1, dest='NAV_INDEX', metavar="INDEX_FILE", default=["index"])	

	groups.add_argument('--sitemap', '-s', help='Create a sitemap as internal reference to FILENAME. Will overwrite any existing file of the same name. ', nargs=1, dest='SITEMAP_FN', metavar="FILENAME", default=[""])
	groups.add_argument('--sitemap-hardcopy', '-sh', help='Write an md version of the sidebar into the source directory. ', dest="SITEMAP_HC", action="store_true", default=False)
	groups.add_argument('--sitemap-title', '-st', help='Sitemap title. Default: "Sitemap". ', nargs=1, dest='SITEMAP_TITLE', metavar="SITEMAP_TITLE", default=["Sitemap"])


	group2 = parser.add_argument_group('HTML Content', 'What to generate in the html')
	
	group2.add_argument('--body-only', '-b', action='store_const', const=True, default=False, dest="BODY_ONLY", help="Generate HTML body only. ")
	group2.add_argument('--no-css', '-u', action='store_const', const=False, default=True, dest="MAKE_CSS", help="Do not include stylesheet. ")

	group2.add_argument('--no-resolve-links', '-nl', dest="RESOLVE_LINKS", help="Do not resolve local links. ", default=True, action="store_false")
	group2.add_argument('--no-resolve-warnings', '-q', dest="LINK_WARN", help="Do not warn about undefined local links. ", default=True, action="store_false")


	group2.add_argument('--header', '-he', nargs=1, dest="HEADER", metavar="HEADER", help="Include a file or a string in the header. ", default=[""])
	group2.add_argument('--body-prefix', '-pre', nargs=1, dest="BODY_PREFIX", metavar="BODY_PREFIX", help="Include a file or a string before the content in the body. ", default=[""])
	group2.add_argument('--body-suffix', '-suf', nargs=1, dest="BODY_SUFFIX", metavar="BODY_SUFFIX", help="Include a file or a string after the content in the body. ", default=[""])

	group2.add_argument('--title', '-t', nargs=1, dest="MATCH_TITLE", metavar="TITLE", help="Title to use for documents. %% will be replace with the actual title. ", default=["%"])
	group2.add_argument('--fallback-title', '-ft', nargs=1, dest="ALT_TITLE", metavar="TITLE", help="Title to use for document in case no heading is found. ", default=[""])

	args = parser.parse_args()

	if len(args.COPY_INCLUDE) == 0 and len(args.COPY_EXCLUDE) == 0:
		copycond = lambda x: False
	elif len(args.COPY_INCLUDE) == 0:
		copycond = lambda x: not x in args.COPY_EXCLUDE
	elif "*" in args.COPY_INCLUDE:
		copycond = lambda x: True
	else:
		copycond = lambda x: x in args.COPY_INCLUDE

	
	if(os.path.isdir(args.INFOLDER[0])):
		if(not os.path.isdir(args.OUTFOLDER[0])):
			try:
				os.makedirs(args.OUTFOLDER[0])
			except:
				print "[!] FATAL: Can't create output folder (Enough permissions?)"
				sys.exit(1)
		main_run(args.INFOLDER[0], args.OUTFOLDER[0], args.enable_nav, args.RENDER, copycond, args.NAV_INDEX[0], args.BODY_ONLY, args.MAKE_CSS, args.HEADER[0], args.BODY_PREFIX[0], args.BODY_SUFFIX[0], args.ALT_TITLE[0], args.ext[0], args.RESOLVE_LINKS, args.LINK_WARN, args.MATCH_TITLE[0], args.SITEMAP_FN[0], args.SITEMAP_HC, args.SITEMAP_TITLE[0])
	else:
		print "[!] FATAL: INFOLDER is not a directory. "
		
			
#CSS code stuff
def get_css():
	css_code = """/* Basic styles https://gist.github.com/cpatuzzo/3331384 */
		body {
		  font-family: Helvetica, arial, sans-serif;
		  font-size: 14px;
		  line-height: 1.6;
		  padding-top: 10px;
		  padding-bottom: 10px;
		  background-color: white;
		  padding: 30px;
		  color: #333;
		}
		 
		body > *:first-child {
		  margin-top: 0 !important;
		}
		 
		body > *:last-child {
		  margin-bottom: 0 !important;
		}
		 
		a {
		  color: #4183C4;
		  text-decoration: none;
		}
		 
		a.absent {
		  color: #cc0000;
		}
		 
		a.anchor {
		  display: block;
		  padding-left: 30px;
		  margin-left: -30px;
		  cursor: pointer;
		  position: absolute;
		  top: 0;
		  left: 0;
		  bottom: 0;
		}
		 
		h1, h2, h3, h4, h5, h6 {
		  margin: 20px 0 10px;
		  padding: 0;
		  font-weight: bold;
		  -webkit-font-smoothing: antialiased;
		  cursor: text;
		  position: relative;
		}
		 
		h2:first-child, h1:first-child, h1:first-child + h2, h3:first-child, h4:first-child, h5:first-child, h6:first-child {
		  margin-top: 0;
		  padding-top: 0;
		}
		 
		h1:hover a.anchor, h2:hover a.anchor, h3:hover a.anchor, h4:hover a.anchor, h5:hover a.anchor, h6:hover a.anchor {
		  text-decoration: none;
		}
		 
		h1 tt, h1 code {
		  font-size: inherit;
		}
		 
		h2 tt, h2 code {
		  font-size: inherit;
		}
		 
		h3 tt, h3 code {
		  font-size: inherit;
		}
		 
		h4 tt, h4 code {
		  font-size: inherit;
		}
		 
		h5 tt, h5 code {
		  font-size: inherit;
		}
		 
		h6 tt, h6 code {
		  font-size: inherit;
		}
		 
		h1 {
		  font-size: 28px;
		  color: black;
		}
		 
		h2 {
		  font-size: 24px;
		  border-bottom: 1px solid #cccccc;
		  color: black;
		}
		 
		h3 {
		  font-size: 18px;
		}
		 
		h4 {
		  font-size: 16px;
		}
		 
		h5 {
		  font-size: 14px;
		}
		 
		h6 {
		  color: #777777;
		  font-size: 14px;
		}
		 
		p, blockquote, ul, ol, dl, table, pre {
		  margin: 15px 0;
		}

		li {
		  margin: 7px 0;		
		}
		 
		hr {
		  border: 0 none;
		  color: #cccccc;
		  height: 4px;
		  padding: 0;
		}
		 
		body > h2:first-child {
		  margin-top: 0;
		  padding-top: 0;
		}
		 
		body > h1:first-child {
		  margin-top: 0;
		  padding-top: 0;
		}
		 
		body > h1:first-child + h2 {
		  margin-top: 0;
		  padding-top: 0;
		}
		 
		body > h3:first-child, body > h4:first-child, body > h5:first-child, body > h6:first-child {
		  margin-top: 0;
		  padding-top: 0;
		}
		 
		a:first-child h1, a:first-child h2, a:first-child h3, a:first-child h4, a:first-child h5, a:first-child h6 {
		  margin-top: 0;
		  padding-top: 0;
		}
		 
		h1 p, h2 p, h3 p, h4 p, h5 p, h6 p {
		  margin-top: 0;
		}
		 
		li p.first {
		  display: inline-block;
		}
		 
		ul, ol {
		  padding-left: 30px;
		}
		 
		ul :first-child, ol :first-child {
		  margin-top: 0;
		}
		 
		ul :last-child, ol :last-child {
		  margin-bottom: 0;
		}
		 
		dl {
		  padding: 0;
		}
		 
		dl dt {
		  font-size: 14px;
		  font-weight: bold;
		  font-style: italic;
		  padding: 0;
		  margin: 15px 0 5px;
		}
		 
		dl dt:first-child {
		  padding: 0;
		}
		 
		dl dt > :first-child {
		  margin-top: 0;
		}
		 
		dl dt > :last-child {
		  margin-bottom: 0;
		}
		 
		dl dd {
		  margin: 0 0 15px;
		  padding: 0 15px;
		}
		 
		dl dd > :first-child {
		  margin-top: 0;
		}
		 
		dl dd > :last-child {
		  margin-bottom: 0;
		}
		 
		blockquote {
		  border-left: 4px solid #dddddd;
		  padding: 0 15px;
		  color: #777777;
		}
		 
		blockquote > :first-child {
		  margin-top: 0;
		}
		 
		blockquote > :last-child {
		  margin-bottom: 0;
		}
		 
		table {
		  padding: 0;
		}
		table tr {
		  border-top: 1px solid #cccccc;
		  background-color: white;
		  margin: 0;
		  padding: 0;
		}
		 
		table tr:nth-child(2n) {
		  background-color: #f8f8f8;
		}
		 
		table tr th {
		  font-weight: bold;
		  border: 1px solid #cccccc;
		  text-align: left;
		  margin: 0;
		  padding: 6px 13px;
		}
		 
		table tr td {
		  border: 1px solid #cccccc;
		  text-align: left;
		  margin: 0;
		  padding: 6px 13px;
		}
		 
		table tr th :first-child, table tr td :first-child {
		  margin-top: 0;
		}
		 
		table tr th :last-child, table tr td :last-child {
		  margin-bottom: 0;
		}
		 
		img {
		  max-width: 100%;
		}
		 
		span.frame {
		  display: block;
		  overflow: hidden;
		}
		 
		span.frame > span {
		  border: 1px solid #dddddd;
		  display: block;
		  float: left;
		  overflow: hidden;
		  margin: 13px 0 0;
		  padding: 7px;
		  width: auto;
		}
		 
		span.frame span img {
		  display: block;
		  float: left;
		}
		 
		span.frame span span {
		  clear: both;
		  color: #333333;
		  display: block;
		  padding: 5px 0 0;
		}
		 
		span.align-center {
		  display: block;
		  overflow: hidden;
		  clear: both;
		}
		 
		span.align-center > span {
		  display: block;
		  overflow: hidden;
		  margin: 13px auto 0;
		  text-align: center;
		}
		 
		span.align-center span img {
		  margin: 0 auto;
		  text-align: center;
		}
		 
		span.align-right {
		  display: block;
		  overflow: hidden;
		  clear: both;
		}
		 
		span.align-right > span {
		  display: block;
		  overflow: hidden;
		  margin: 13px 0 0;
		  text-align: right;
		}
		 
		span.align-right span img {
		  margin: 0;
		  text-align: right;
		}
		 
		span.float-left {
		  display: block;
		  margin-right: 13px;
		  overflow: hidden;
		  float: left;
		}
		 
		span.float-left span {
		  margin: 13px 0 0;
		}
		 
		span.float-right {
		  display: block;
		  margin-left: 13px;
		  overflow: hidden;
		  float: right;
		}
		 
		span.float-right > span {
		  display: block;
		  overflow: hidden;
		  margin: 13px auto 0;
		  text-align: right;
		}
		 
		code, tt {
		  margin: 0 2px;
		  padding: 0 5px;
		  white-space: nowrap;
		  border: 1px solid #eaeaea;
		  background-color: #f8f8f8;
		  border-radius: 3px;
		}
		 
		pre code {
		  margin: 0;
		  padding: 0;
		  white-space: pre;
		  border: none;
		  background: transparent;
		}
		 
		.highlight pre {
		  background-color: #f8f8f8;
		  border: 1px solid #cccccc;
		  font-size: 13px;
		  line-height: 19px;
		  overflow: auto;
		  padding: 6px 10px;
		  border-radius: 3px;
		}
		 
		pre {
		  background-color: #f8f8f8;
		  border: 1px solid #cccccc;
		  font-size: 13px;
		  line-height: 19px;
		  overflow: auto;
		  padding: 6px 10px;
		  border-radius: 3px;
		}
		 
		pre code, pre tt {
		  background-color: transparent;
		  border: none;
		}
		
		/* Syntax Highlights */
		.hll { background-color: #ffffcc }
		.c { color: #999988; font-style: italic } /* Comment */
		.err { color: #a61717; background-color: #e3d2d2 } /* Error */
		.k { color: #000000; font-weight: bold } /* Keyword */
		.o { color: #000000; font-weight: bold } /* Operator */
		.cm { color: #999988; font-style: italic } /* Comment.Multiline */
		.cp { color: #999999; font-weight: bold; font-style: italic } /* Comment.Preproc */
		.c1 { color: #999988; font-style: italic } /* Comment.Single */
		.cs { color: #999999; font-weight: bold; font-style: italic } /* Comment.Special */
		.gd { color: #000000; background-color: #ffdddd } /* Generic.Deleted */
		.ge { color: #000000; font-style: italic } /* Generic.Emph */
		.gr { color: #aa0000 } /* Generic.Error */
		.gh { color: #999999 } /* Generic.Heading */
		.gi { color: #000000; background-color: #ddffdd } /* Generic.Inserted */
		.go { color: #888888 } /* Generic.Output */
		.gp { color: #555555 } /* Generic.Prompt */
		.gs { font-weight: bold } /* Generic.Strong */
		.gu { color: #aaaaaa } /* Generic.Subheading */
		.gt { color: #aa0000 } /* Generic.Traceback */
		.kc { color: #000000; font-weight: bold } /* Keyword.Constant */
		.kd { color: #000000; font-weight: bold } /* Keyword.Declaration */
		.kn { color: #000000; font-weight: bold } /* Keyword.Namespace */
		.kp { color: #000000; font-weight: bold } /* Keyword.Pseudo */
		.kr { color: #000000; font-weight: bold } /* Keyword.Reserved */
		.kt { color: #445588; font-weight: bold } /* Keyword.Type */
		.m { color: #009999 } /* Literal.Number */
		.s { color: #d01040 } /* Literal.String */
		.na { color: #008080 } /* Name.Attribute */
		.nb { color: #0086B3 } /* Name.Builtin */
		.nc { color: #445588; font-weight: bold } /* Name.Class */
		.no { color: #008080 } /* Name.Constant */
		.nd { color: #3c5d5d; font-weight: bold } /* Name.Decorator */
		.ni { color: #800080 } /* Name.Entity */
		.ne { color: #990000; font-weight: bold } /* Name.Exception */
		.nf { color: #990000; font-weight: bold } /* Name.Function */
		.nl { color: #990000; font-weight: bold } /* Name.Label */
		.nn { color: #555555 } /* Name.Namespace */
		.nt { color: #000080 } /* Name.Tag */
		.nv { color: #008080 } /* Name.Variable */
		.ow { color: #000000; font-weight: bold } /* Operator.Word */
		.w { color: #bbbbbb } /* Text.Whitespace */
		.mf { color: #009999 } /* Literal.Number.Float */
		.mh { color: #009999 } /* Literal.Number.Hex */
		.mi { color: #009999 } /* Literal.Number.Integer */
		.mo { color: #009999 } /* Literal.Number.Oct */
		.sb { color: #d01040 } /* Literal.String.Backtick */
		.sc { color: #d01040 } /* Literal.String.Char */
		.sd { color: #d01040 } /* Literal.String.Doc */
		.s2 { color: #d01040 } /* Literal.String.Double */
		.se { color: #d01040 } /* Literal.String.Escape */
		.sh { color: #d01040 } /* Literal.String.Heredoc */
		.si { color: #d01040 } /* Literal.String.Interpol */
		.sx { color: #d01040 } /* Literal.String.Other */
		.sr { color: #009926 } /* Literal.String.Regex */
		.s1 { color: #d01040 } /* Literal.String.Single */
		.ss { color: #990073 } /* Literal.String.Symbol */
		.bp { color: #999999 } /* Name.Builtin.Pseudo */
		.vc { color: #008080 } /* Name.Variable.Class */
		.vg { color: #008080 } /* Name.Variable.Global */
		.vi { color: #008080 } /* Name.Variable.Instance */
		.il { color: #009999 } /* Literal.Number.Integer.Long */"""
	return css_code

if __name__ == "__main__":
	main(sys.argv)
