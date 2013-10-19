#!/bin/bash

BASE_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


basedir=$BASE_PATH/../
destdir=$BASE_PATH/release/

mkdir -p $destdir

# JS Builting config
build="$destdir"JOBAD.js
sourcedirjs="$basedir"js

printf "Compiling JS Development Version ..."

cat $BASE_PATH/config/dev_header.js | sed -e "s/\${BUILD_TIME}/$(date -R)/" > $build

while read filename
do
	echo "/* start <$filename> */" >> $build
	cat $sourcedirjs/$filename >> $build
	echo "/* end   <$filename> */" >> $build
done < "$BASE_PATH/config/js.txt"

cat $BASE_PATH/config/dev_footer.js | sed -e "s/\${BUILD_TIME}/$(date -R)/" >> $build

echo "OK"