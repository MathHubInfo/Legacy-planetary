# Python Markdown Compiler
Batch compiling markdown files to html using python-markdown2. Tested with Python 2.7. 
## Usage
There are 2 versions available. 
### md-render
Intended for highlighting single files. 

```
usage: md-render.py [-h] [-o OUTPUT_FILE] [--title TITLE] [--no-css]
                    [--body-only] [--header HEADER]
                    [--body-prefix BODY_PREFIX] [--body-suffix BODY_SUFFIX]
                    INPUT_FILE

Python Markdown Compiler

positional arguments:
  INPUT_FILE            Input file.

optional arguments:
  -h, --help            show this help message and exit
  -o OUTPUT_FILE        Output File. Defaults to STDOUT.
  --title TITLE, -t TITLE
                        Use a custom html title.
  --no-css, -u          Do not include stylesheet.
  --body-only, -b       Generate HTML body only.
  --header HEADER, -he HEADER
                        Include a file or a string in the header.
  --body-prefix BODY_PREFIX, -pre BODY_PREFIX
                        Include a file or a string before the content in the
                        body.
  --body-suffix BODY_SUFFIX, -suf BODY_SUFFIX
                        Include a file or a string after the content in the
                        body.
```

### md-render2
Intended for batch processing bigger directories. 

```
usage: md-render2.py [-h] [--extension EXTENSION]
                     [--render [EXTENSION [EXTENSION ...]]]
                     [--copy [EXTENSION [EXTENSION ...]] | --no-copy
                     [EXTENSION [EXTENSION ...]]] [--no-nav]
                     [--nav-index INDEX_FILE] [--sitemap FILENAME]
                     [--sitemap-hardcopy] [--sitemap-title SITEMAP_TITLE]
                     [--body-only] [--no-css] [--no-resolve-links]
                     [--no-resolve-warnings] [--header HEADER]
                     [--body-prefix BODY_PREFIX] [--body-suffix BODY_SUFFIX]
                     [--title TITLE] [--fallback-title TITLE]
                     INFOLDER OUTFOLDER

Python Markdown Compiler

optional arguments:
  -h, --help            show this help message and exit

Location:
  Where to find the source, where to put the rendered files.

  INFOLDER              Input folder.
  OUTFOLDER             Output folder. Will be created if it does not exist.
  --extension EXTENSION, -e EXTENSION
                        Extension of output files. Default: "html".

File Selection:
  Which files to render, which to copy.

  --render [EXTENSION [EXTENSION ...]], -r [EXTENSION [EXTENSION ...]]
                        Extensions to render. * is a wildcat and means
                        everything. (Default: ["", "txt", "md"])
  --copy [EXTENSION [EXTENSION ...]], -c [EXTENSION [EXTENSION ...]]
                        Extensions to copy. * is a wildcat and means
                        everything. (Default: [])
  --no-copy [EXTENSION [EXTENSION ...]], -nc [EXTENSION [EXTENSION ...]]
                        Extensions to exclude from copying. (Default: [])

Sitemap & Navigation:
  How to create navigation and sitemap.

  --no-nav, -nn         Do not render the navigation menu.
  --nav-index INDEX_FILE, -i INDEX_FILE
                        Navigation Index Filename. Default: "index".
  --sitemap FILENAME, -s FILENAME
                        Create a sitemap as internal reference to FILENAME.
                        Will overwrite any existing file of the same name.
  --sitemap-hardcopy, -sh
                        Write an md version of the sidebar into the source
                        directory.
  --sitemap-title SITEMAP_TITLE, -st SITEMAP_TITLE
                        Sitemap title. Default: "Sitemap".

HTML Content:
  What to generate in the html

  --body-only, -b       Generate HTML body only.
  --no-css, -u          Do not include stylesheet.
  --no-resolve-links, -nl
                        Do not resolve local links.
  --no-resolve-warnings, -q
                        Do not warn about undefined local links.
  --header HEADER, -he HEADER
                        Include a file or a string in the header.
  --body-prefix BODY_PREFIX, -pre BODY_PREFIX
                        Include a file or a string before the content in the
                        body.
  --body-suffix BODY_SUFFIX, -suf BODY_SUFFIX
                        Include a file or a string after the content in the
                        body.
  --title TITLE, -t TITLE
                        Title to use for documents. % will be replace with the
                        actual title.
  --fallback-title TITLE, -ft TITLE
                        Title to use for document in case no heading is found.

```

## Dependencies

* [python-markdown2](https://github.com/trentm/python-markdown2)
	* Install: `pip install markdown2`, `pypm install markdown2` or `easy_install markdown2`
	* License: [MIT License](https://github.com/trentm/python-markdown2/blob/master/LICENSE.txt)
	* for syntax highlighting you might want to install `pygments`. 

* [BeautifulSoup](http://www.crummy.com/software/BeautifulSoup/)
	* Install: `pip install beautifulsoup4`, `easy_install beautifulsoup4` or the package `beautifulsoup4` in some recent verions of debian / ubuntu
	* License: MIT license

* `argparse`  module

## License
		    DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
		            Version 2, December 2004

	 Copyright (C) 2013 Tom Wiesing <tkw01536@gmail.com>

	 Everyone is permitted to copy and distribute verbatim or modified
	 copies of this license document, and changing it is allowed as long
	 as the name is changed.

		    DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
	   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

	  0. You just DO WHAT THE FUCK YOU WANT TO.
