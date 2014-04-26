#!/bin/bash

BASE_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


destdir=$BASE_PATH/release/

mkdir -p $destdir

# JS Builting config
buildmin="$destdir"JOBAD.min.js
buildtmp="$destdir"JOBAD.min.js.tmp


printf "Compiling JS Release Version ..."

node $BASE_PATH/build-js-min.js

RETVAL=$?
[ $RETVAL -ne 0 ] && echo "FAIL" && exit 1

cat $BASE_PATH/config/min_header.js | sed -e "s/\${BUILD_TIME}/$(date -R)/" > $buildmin

cat $buildtmp >> $buildmin

cat $BASE_PATH/config/min_footer.js | sed -e "s/\${BUILD_TIME}/$(date -R)/" >> $buildmin

rm $buildtmp

echo "OK"

exit 0