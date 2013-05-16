#!/bin/bash

mkdir -p "release"
basedir=../
destdir=release/

build="$destdir"JOBAD.js
buildmin="$destdir"JOBAD.min.js
sourcedir="$basedir"js

echo "JOBAD build script "

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

printf "Compiling development version ... "


cat config/dev_header.js | sed -e "s/\${BUILD_TIME}/$(date -R)/" > $build

while read filename
do
	echo "/* start <$filename> */" >> $build
	cat $sourcedir/$filename >> $build
	echo "/* end   <$filename> */" >> $build
done < "./config/files.txt"

cat config/dev_footer.js | sed -e "s/\${BUILD_TIME}/$(date -R)/" >> $build

echo "OK"


printf "Preparing compilation with Closure Compiler ... "

echo "" > $buildmin.tmp
cat $build >> $buildmin.tmp

echo "OK"

printf "Compiling minimized version ... "

cat config/min_header.js | sed -e "s/\${BUILD_TIME}/$(date -R)/" > $buildmin

python ./deps/closurecompilerpy/closureCompiler.py -s $buildmin.tmp >> $buildmin

cat config/min_footer.js | sed -e "s/\${BUILD_TIME}/$(date -R)/" >> $buildmin

RETVAL=$?
[ $RETVAL -eq 0 ] && echo "OK"
[ $RETVAL -ne 0 ] && echo "FAIL" && rm $buildmin

echo "Done. Copying additional files ..."
while IFS=$'\t' read -r -a readData
do
	source="$basedir""${readData[0]}"
	dest="$destdir""${readData[1]}"
	
	echo $source " => " $dest
	cp $source $dest

done < "./config/copies.txt"

printf "Done. "

printf "Cleaning up ... "

rm $buildmin.tmp

echo "OK"

echo ""
echo "Build finished. "

echo "Development version built successfully. "
[ $RETVAL -eq 0 ] && echo "Minimized version built successfully. "
[ $RETVAL -ne 0 ] && echo "Minimized version built failed. "

exit 0

