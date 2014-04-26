#!/bin/bash

# Updates the gh-pages branch
# Requires a network connection
# Automatically clones the repository in /tmp, so make sure you have space. 

cd /tmp
git clone --recursive -b gh-pages https://github.com/KWARC/jobad jobad
cd jobad

cd dev
git checkout dev
git pull
cd ..

cd stable
git checkout stable
git pull
cd ..

git add dev stable
echo "Update complete, status: "
git status
echo "Press <ENTER> key to continue"
read MSG

git commit -m "$MSG"
git push
cd /tmp
rm -r -f /tmp/jobad
