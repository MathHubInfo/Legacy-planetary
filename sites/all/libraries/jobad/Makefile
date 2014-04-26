# Makefile for JOBAD

# Build everything
all: deps js css libs templates doc
clean: clean-templates clean-doc clean-release
libs: js-libs css-libs

# Get the dependencies
deps: npmdeps pipdeps
clean-deps:
	rm -rf node_modules
npmdeps:
	node build/npm-install-deps.js
pipdeps:
	pip install markdown2 pygments beautifulsoup4 # To build the doc

# Templates
templates:
	bash build/build-templates.sh
clean-templates:
	rm -rf examples/build
	bash build/cleanup.sh

# Documentation
doc: pipdeps
	bash build/build-doc.sh
clean-doc:
	rm -rf doc/html 

# Just Build the release version
release: js css
clean-release:
	rm -rf build/release 

# JavaScript
js: js-dev js-min js-libs

js-dev: 
	bash build/build-js.sh
js-min: npmdeps js-dev
	bash build/build-js-min.sh
js-libs:
	node build/build-js-libs.js

# CSS
css: css-dev css-min css-libs

css-dev: 
	bash build/build-css.sh
css-min: npmdeps css-dev
	bash build/build-css-min.sh
css-libs:
	bash build/build-css-libs.sh