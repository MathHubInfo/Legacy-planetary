#!/bin/bash

BASE_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Building JOBAD Doc ..."

python $BASE_PATH/deps/PythonMarkdownCompiler/md-render2.py --render md  -t "[%] - JOBAD Documentation" -s sitemap.md --header $BASE_PATH/config/doc_header.txt -st "Index" -sh $BASE_PATH/../doc/md $BASE_PATH/../doc/html
echo "OK"
exit 0