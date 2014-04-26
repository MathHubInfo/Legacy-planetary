#!/usr/bin/python

import httplib, urllib, sys, json, argparse, os


parser = argparse.ArgumentParser(description='A client to the Google Closure Compiler located at http://closure-compiler.appspot.com. ')


parser.add_argument('--quiet', '-q', action="store_false", default=True, help="Supress any messages. ", dest="show_msgs")


inout = parser.add_argument_group('INPUT & OUTPUT')
inout.add_argument('FILENAME', nargs="*", help='Input file(s). If no input is specefied. If nothing is specefied, stdin is used. ', default=[])
inout.add_argument('--url', '-u', nargs="*", help='Input file(s). Must be a url. ', metavar="URL", default=[], dest="URL")
inout.add_argument('-o', nargs=1, default=[""], help="Output File. Defaults to STDOUT. ", metavar="OUTPUT_FILE", dest="OUTPUT_FILE")


level = parser.add_argument_group('Compression Level', 'The degree of compression and optimization to apply to your JavaScript. ').add_mutually_exclusive_group()
level.add_argument('--whitespace', '-w', action='store_const', dest="level", default=1, const=0, help="WHITESPACE_ONLY. Just removes whitespace and comments from your JavaScript. ")
level.add_argument('--simple', '-s', action='store_const', dest="level", const=1,  help="SIMPLE_OPTIMIZATIONS. Performs compression and optimization that does not interfere with the interaction between the compiled JavaScript and other JavaScript. This level renames only local variables. Default. ")
level.add_argument('--advanced', '-a', action='store_const', dest="level", const=2, help="ADVANCED_OPTIMIZATIONS. Achieves the highest level of compression by renaming symbols in your JavaScript. When using ADVANCED_OPTIMIZATIONS compilation you must perform extra steps to preserve references to external symbols. ")

aopts = parser.add_argument_group('ADVANCED_OPTIMIZATIONS Options', 'Configuring ADVANCED_OPTIMIZATIONS compression level. ')
aopts.add_argument('--js-externs', nargs='*', help='The value of this parameter must be JavaScript code that declares function names or other symbols. Use js-externs to preserve symbols that are defined outside of the code you are compiling. May also be a file. ', dest='js_externs', metavar='CODE_OR_FILENAME', default=[])
aopts.add_argument('--externs-url', nargs='*', help='The value of this parameter must be the URL of a file containing JavaScript that declares function names or other symbols. The symbols declared in this file are preserved in exactly the same way as symbols listed directly in the js_externs parameter. ', dest='js_externs_url', metavar='URL', default=[])
aopts.add_argument('--exclude-default-externs', action='store_true', dest="exclude_default_externs", default=False, help="By default, the Closure Compiler service uses a standard externs file that declares common externally defined symbols like document and all its methods. If you do NOT want to use this file, include this parameter. ")

others = parser.add_argument_group('Other Compiler Options')
others.add_argument('--pretty-print', '-p', action='store_true', dest="pretty_print", default=False, help="If set, the Closure Compiler service adds line breaks and indentation to its output code to make the code easier for humans to read. ")
others.add_argument('--print-input-delimiter', '-d', action='store_true', dest="print_input_delimiter", default=False, help="If the request contains a formatting parameter with a value of print_input_delimiter, the Closure Compiler service adds a separator between the compiler outputs for each file you compile. ")
others.add_argument('--use-closure-library', '-c', action='store_true', dest="use_closure", default=False, help="If you give the use-closure-library parameter a value of true, the compiler looks for goog.require() statements in the source code and supplies the Closure Library code requested by any such statements. It also performs optimizations designed specifically for Closure Library code. ")



args = parser.parse_args()

def error(msg):
	if args.show_msgs:
		sys.stderr.write(msg+"\n")

levels = ["WHITESPACE_ONLY", "SIMPLE_OPTIMIZATIONS", "ADVANCED_OPTIMIZATIONS"]

try:
	params = [
		('compilation_level', levels[args.level]),
		('output_format', 'json'),
		('output_info', 'compiled_code'),
		('output_info', 'errors')
	]

	in_data = ""
	if len(args.FILENAME) == 0:
		in_data = sys.stdin.read()
	else:
		for fn in args.FILENAME:
			try:
				with open(fn, "r") as in_file:
					in_data +=""+in_file.read()+"\n"
			except:
				error("error: Can't read Input file '"+fn+"'. ")
				sys.exit(1)

	params.append(('js_code', in_data))


	for u in args.URL:
		params.append(('code_url', u))


	extern_data = ""
	for i in args.js_externs:
		if os.path.isfile(i):
			try:
				with open(i, "r") as in_file:
					extern_data += in_file.read()+"\n"
			except:
				error("error: Can't read Externs file '"+fn+"'. ")
				sys.exit(1)
		else:
			extern_data += i+"\n"

	params.append(('js_externs', in_data))

	for u in args.js_externs_url:
		params.append(('js_externs_url', u))

	if args.pretty_print == True and args.print_input_delimiter :
		params.append(('formatting', 'pretty_print,print_input_delimiter'))
	elif args.pretty_print == True:
		params.append(('formatting', 'pretty_print'))
	elif args.print_input_delimiter == True:
		params.append(('formatting', 'print_input_delimiter'))
	

	if args.use_closure == True:
		params.append(('use_closure_library', True))

	if args.exclude_default_externs == True:
		params.append(('exclude_default_externs', True))

	params = urllib.urlencode(params)

	# Always use the following value for the Content-type header.
	try:
		headers = { "Content-type": "application/x-www-form-urlencoded" }
		conn = httplib.HTTPConnection('closure-compiler.appspot.com')
		conn.request('POST', '/compile', params, headers)
		response = conn.getresponse()
	except:
		error("error: Connection to API failed. ")
		sys.exit(1)

	try:
		data = json.load(response)
		conn.close()
	except Exception as e:
		error("error: No response received from API. Check your network connection. ")
		sys.exit(1)


	if "errors" in data:
		error("error: Compilation errors occured. ")
		for err in data["errors"]:
			error(err["error"])
		sys.exit(1)
	else:

		if "warnings" in data:
			for err in data["warnings"]:
				error(err["warning"])
			sys.exit(1)

		if args.OUTPUT_FILE[0] == "":
			print data["compiledCode"]
		else:
			try:
				with open(args.OUTPUT_FILE[0], "w") as out_file:
					out_file.write(data["compiledCode"])
	    			
			except:
				error("error: Failed to write to output file. ")
				sys.exit(1)
		sys.exit(0)
except KeyboardInterrupt:
	error("error: KeyboardInterrupt. Aborting. ")
	sys.exit(1)
