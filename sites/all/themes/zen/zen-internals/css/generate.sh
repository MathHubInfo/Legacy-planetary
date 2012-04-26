#!/bin/sh

# This script is used by the MAINTAINER to make copies of the stylesheets for
# the base Zen theme from the stylesheets in the STARTERKIT.

rm *.css;
for FILENAME in ../../STARTERKIT/css/*.css; do
  cp ../../STARTERKIT/css/$FILENAME .;
done

# Don't need the core reference.
rm drupal7-reference.css;

rm ../images/*;
for FILENAME in ../../STARTERKIT/images/*; do
  cp ../../STARTERKIT/css/$FILENAME ../images/;
done
