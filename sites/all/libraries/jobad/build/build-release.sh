#!/bin/bash

BASE_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


basedir=$BASE_PATH/../
destdir=$BASE_PATH/release/

mkdir -p $destdir

# JS Builting config
build="$destdir"JOBAD.js
buildmin="$destdir"JOBAD.min.js
sourcedirjs="$basedir"js

# CSS Building config
buildc="$destdir"JOBAD.css
sourcedirc="$basedir"css

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


cat $BASE_PATH/config/dev_header.js | sed -e "s/\${BUILD_TIME}/$(date -R)/" > $build

while read filename
do
	echo "/* start <$filename> */" >> $build
	cat $sourcedirjs/$filename >> $build
	echo "/* end   <$filename> */" >> $build
done < "$BASE_PATH/config/js.txt"

cat $BASE_PATH/config/dev_footer.js | sed -e "s/\${BUILD_TIME}/$(date -R)/" >> $build

echo "OK"


printf "Preparing compilation with Closure Compiler ... "

echo "" > $buildmin.tmp
cat $build >> $buildmin.tmp

echo "OK"

printf "Compiling minimized version ... "

cat $BASE_PATH/config/min_header.js | sed -e "s/\${BUILD_TIME}/$(date -R)/" > $buildmin

python $BASE_PATH/deps/closurecompilerpy/closureCompiler.py -s $buildmin.tmp >> $buildmin

cat $BASE_PATH/config/min_footer.js | sed -e "s/\${BUILD_TIME}/$(date -R)/" >> $buildmin

RETVAL=$?
[ $RETVAL -eq 0 ] && echo "OK"
[ $RETVAL -ne 0 ] && echo "FAIL" && rm $buildmin


echo "Done. Building CSS file ..."
cat $BASE_PATH/config/css_header.css | sed -e "s/\${BUILD_TIME}/$(date -R)/" > $buildc
while read filename
do
	echo "/* start <$filename> */" >> $buildc
	cat $sourcedirc/$filename >> $buildc
	echo "/* end   <$filename> */" >> $buildc
done < "$BASE_PATH/config/css.txt"

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

