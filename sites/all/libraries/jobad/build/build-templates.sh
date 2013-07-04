#!/bin/bash

BASE_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"


template_dir="$BASE_PATH/../examples/templates"
template_build_dir="$BASE_PATH/../examples/build"
doc_md_source="$BASE_PATH/../doc/dynamic/"
doc_md_dest="$BASE_PATH/../doc/md/"


rm -r -f $template_build_dir
mkdir $template_build_dir

jobad_base=".\/..\/..\/.."
jobad_script_full=""
joabd_script_dev_full=""

while read filename
do
	jobad_script_full="$jobad_script_full<script src='$jobad_base\/js\/$filename'><\/script>\n"
	jobad_script_dev_full="$jobad_script_dev_full	<script src='js\/$filename'><\/script>\n"
done < "$BASE_PATH/config/js.txt"
jobad_script_full="${jobad_script_full%??}"
jobad_script_dev_full="${jobad_script_dev_full%??}"

jobad_css_full=""
jobad_css_dev_full=""
while read filename
do
	jobad_css_full="$jobad_css_full<link rel='stylesheet' type='text/css' href='$jobad_base\/css\/$filename'>\n"
	jobad_cssdev_full="$jobad_cssdev_full	<link rel=\"stylesheet\" type=\"text/css\" href=\"css\/$filename\">\n"
done < "$BASE_PATH/config/css.txt"
jobad_css_full="${jobad_css_full%??}"
jobad_cssdev_full="${jobad_cssdev_full%??}"

jobad_release="<script src='$jobad_base\/build\/release\/JOBAD.min.js'><\/script>\n"
jobad_dev="<script src='$jobad_base\/build\/release\/JOBAD.js'><\/script>\n"
jobad_css="<link rel='stylesheet' type='text/css' href='$jobad_base\/build\/release\/JOBAD.css'>"
jobad_templates=""

echo "Building JOBAD templates..."

while IFS=$'\t' read -r -a readData
do
	template=${readData[0]}
	desc=${readData[1]}
	echo "Building Template: $template"
	mkdir "$template_build_dir/$template"
	jobad_templates="$jobad_templates\* $template - $desc\n"

	cat "$template_dir/$template.html" | sed \
		-e "s%\${JOBAD_BASE}%$jobad_base%" \
		-e "s%\${JS_INCLUDE}%$jobad_script_full%" \
		-e "s%\${CSS_INCLUDE}%$jobad_css_full%" \
		-e "s%\${BUILD_COMMENTS}%<!-- This file has been generated automatically. Any changes will be overwritten. -->%" \
	> "$template_build_dir/$template/unbuilt.html"
	echo "Wrote $template/unbuilt.html"

	cat "$template_dir/$template.html" | sed \
		-e "s%\${JOBAD_BASE}%$jobad_base%" \
		-e "s%\${JS_INCLUDE}%$jobad_release%" \
		-e "s%\${CSS_INCLUDE}%$jobad_css%" \
		-e "s%\${BUILD_COMMENTS}%<!-- This file has been generated automatically. Any changes will be overwritten. -->%" \
	> "$template_build_dir/$template/release.html"
	echo "Wrote $template/release.html"

	cat "$template_dir/$template.html" | sed \
		-e "s%\${JOBAD_BASE}%$jobad_base%" \
		-e "s%\${JS_INCLUDE}%$jobad_dev%" \
		-e "s%\${CSS_INCLUDE}%$jobad_css%" \
		-e "s%\${BUILD_COMMENTS}%<!-- This file has been generated automatically. Any changes will be overwritten. -->\n%" \
	> "$template_build_dir/$template/dev.html"
	echo "Wrote $template/dev.html"

	jobad_templates="$jobad_templates\t\* \[Release version\]\(.\/..\/..\/examples\/build\/$template\/release.html\)\n"	
	jobad_templates="$jobad_templates\t\* \[Development version\]\(.\/..\/..\/examples\/build\/$template\/dev.html\)\n"
	jobad_templates="$jobad_templates\t\* \[Unbuilt version\]\(.\/..\/..\/examples\/build\/$template\/unbuilt.html\)\n"

done < "$BASE_PATH/config/templates.txt"
echo "Writing dynamic templates..."
for fname in $(cd $doc_md_source; find -type f); do
	echo "$fname"
 	cat "$doc_md_source/$fname" | sed \
		-e "s/\${JOBAD_TEMPLATES}/$jobad_templates/" \
		-e "s%\${JS_INCLUDE}%$jobad_script_dev_full%" \
		-e "s%\${CSS_INCLUDE}%$jobad_cssdev_full%" \
	> "$doc_md_dest/$fname"
done

echo "Templates build finished. "

