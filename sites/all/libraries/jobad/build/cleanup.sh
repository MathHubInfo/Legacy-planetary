#!/bin/bash

# This script will do more cleanup. 

BASE_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

css_libs_path="$BASE_PATH/../css/libs/"

while read filename
do
	if [ ${filename: -5} == ".less" ] ; then
		# Remove the less CSS
		rm -f "$css_libs_path$filename.css"
	fi;
done < "$BASE_PATH/config/css-libs.txt"
