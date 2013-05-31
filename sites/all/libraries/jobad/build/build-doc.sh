#!/bin/bash

echo "JOBAD Doc build script"

echo "Checking build requirements ..."

printf "Python ... "

if which python >/dev/null; then
	echo "OK"
else
	echo "FAIL"
	echo "Abort: Python not found. "
	echo "You might want to apt-get install python"
	exit 1
fi

printf "markdown2 ... "
python -c "import markdown2" 2> /dev/null
RETVAL=$?
[ $RETVAL -eq 0 ] && echo "OK"
[ $RETVAL -ne 0 ] && echo "FAIL" && echo "Abort: Python module markdown2 not found. " && exit 1

printf "pygments ... "
python -c "import pygments" 2> /dev/null
RETVAL=$?
[ $RETVAL -eq 0 ] && echo "OK"
[ $RETVAL -ne 0 ] && echo "FAIL" && echo "Abort: Python module pygments not found. " && exit 1

printf "BeautifulSoup 4 ... "
python -c "from bs4 import BeautifulSoup" 2> /dev/null
RETVAL=$?
[ $RETVAL -eq 0 ] && echo "OK"
[ $RETVAL -ne 0 ] && echo "FAIL" && echo "Abort: Python module BeautifulSoup 4 not found. " && exit 

printf "Cleaning up previous build ..."
rm -r ../doc/html
echo "OK"
echo "Building JOBAD Doc ..."

python deps/PythonMarkdownCompiler/md-render2.py --render md  -t "[%] - JOBAD Documentation" -s sitemap.md --header config/doc_header.txt -st "Index" -sh ../doc/md ../doc/html
echo "OK"
exit 0
