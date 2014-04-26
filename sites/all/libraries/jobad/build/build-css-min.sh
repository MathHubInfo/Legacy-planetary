#!/bin/bash

BASE_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


destdir=$BASE_PATH/release/

mkdir -p $destdir

# JS Builting config
buildmin="$destdir"JOBAD.min.css
buildtmp="$destdir"JOBAD.min.css.tmp


printf "Compiling CSS Release Version ..."

node $BASE_PATH/build-css-min.js

RETVAL=$?
[ $RETVAL -ne 0 ] && echo "FAIL" && exit 1

cat $BASE_PATH/config/min_header.css | sed -e "s/\${BUILD_TIME}/$(date -R)/" > $buildmin

cat $buildtmp >> $buildmin

cat $BASE_PATH/config/min_footer.css | sed -e "s/\${BUILD_TIME}/$(date -R)/" >> $buildmin

rm $buildtmp

echo "OK"

exit 0