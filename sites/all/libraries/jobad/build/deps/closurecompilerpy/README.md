# ClosureCompilerPy
A client to the [Google Closure Compiler](https://developers.google.com/closure/compiler/) written in Python. 

## Usage
```
usage: closureCompiler.py [-h] [--quiet] [--url [URL [URL ...]]]
                          [-o OUTPUT_FILE]
                          [--whitespace | --simple | --advanced]
                          [--js-externs [CODE_OR_FILENAME [CODE_OR_FILENAME ...]]]
                          [--externs-url [URL [URL ...]]]
                          [--exclude-default-externs] [--pretty-print]
                          [--print-input-delimiter] [--use-closure-library]
                          [FILENAME [FILENAME ...]]

A client to the Google Closure Compiler located at http://closure-
compiler.appspot.com.

optional arguments:
  -h, --help            show this help message and exit
  --quiet, -q           Supress any messages.

INPUT & OUTPUT:
  FILENAME              Input file(s). If no input is specefied. If nothing is
                        specefied, stdin is used.
  --url [URL [URL ...]], -u [URL [URL ...]]
                        Input file(s). Must be a url.
  -o OUTPUT_FILE        Output File. Defaults to STDOUT.

Compression Level:
  The degree of compression and optimization to apply to your JavaScript.

  --whitespace, -w      WHITESPACE_ONLY. Just removes whitespace and comments
                        from your JavaScript.
  --simple, -s          SIMPLE_OPTIMIZATIONS. Performs compression and
                        optimization that does not interfere with the
                        interaction between the compiled JavaScript and other
                        JavaScript. This level renames only local variables.
                        Default.
  --advanced, -a        ADVANCED_OPTIMIZATIONS. Achieves the highest level of
                        compression by renaming symbols in your JavaScript.
                        When using ADVANCED_OPTIMIZATIONS compilation you must
                        perform extra steps to preserve references to external
                        symbols.

ADVANCED_OPTIMIZATIONS Options:
  Configuring ADVANCED_OPTIMIZATIONS compression level.

  --js-externs [CODE_OR_FILENAME [CODE_OR_FILENAME ...]]
                        The value of this parameter must be JavaScript code
                        that declares function names or other symbols. Use js-
                        externs to preserve symbols that are defined outside
                        of the code you are compiling. May also be a file.
  --externs-url [URL [URL ...]]
                        The value of this parameter must be the URL of a file
                        containing JavaScript that declares function names or
                        other symbols. The symbols declared in this file are
                        preserved in exactly the same way as symbols listed
                        directly in the js_externs parameter.
  --exclude-default-externs
                        By default, the Closure Compiler service uses a
                        standard externs file that declares common externally
                        defined symbols like document and all its methods. If
                        you do NOT want to use this file, include this
                        parameter.

Other Compiler Options:
  --pretty-print, -p    If set, the Closure Compiler service adds line breaks
                        and indentation to its output code to make the code
                        easier for humans to read.
  --print-input-delimiter, -d
                        If the request contains a formatting parameter with a
                        value of print_input_delimiter, the Closure Compiler
                        service adds a separator between the compiler outputs
                        for each file you compile.
  --use-closure-library, -c
                        If you give the use-closure-library parameter a value
                        of true, the compiler looks for goog.require()
                        statements in the source code and supplies the Closure
                        Library code requested by any such statements. It also
                        performs optimizations designed specifically for
                        Closure Library code.
```
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
