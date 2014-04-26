#!/bin/bash

BASE_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


sourcedir=$BASE_PATH/../css/libs/*
destdir=$BASE_PATH/release/libs/css/

printf "Building CSS Libs ..."

rm -rf destdir
mkdir -p $destdir

cp -r $sourcedir $destdir

while read filename
do
	rm -rf $destdir/$filename
done < "$BASE_PATH/config/css-libs.txt"

node $BASE_PATH/build-css-libs.js

RETVAL=$?
[ $RETVAL -ne 0 ] && echo "FAIL" && exit 1

echo "OK"
exit 0