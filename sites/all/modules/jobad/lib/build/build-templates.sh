#!/bin/bash

template_dir="../examples/templates"
template_build_dir="../examples/build"
demos_md_dest="../doc/md/demos.md"


rm -r -f $template_build_dir
mkdir $template_build_dir

jobad_base=".\/..\/..\/.."
jobad_script_full=""
while read filename
do
	jobad_script_full="$jobad_script_full<script src='$jobad_base\/js\/$filename'><\/script>\n"

done < "./config/files.txt"

jobad_release="<script src='$jobad_base\/build\/release\/JOBAD.min.js'><\/script>\n"
jobad_dev="<script src='$jobad_base\/build\/release\/JOBAD.js'><\/script>\n"
jobad_templates=""

echo "Building JOBAD templates..."

while IFS=$'\t' read -r -a readData
do
	template=${readData[0]}
	desc=${readData[1]}
	echo "Building Template: $template"
	mkdir "$template_build_dir/$template"
	jobad_templates="$jobad_templates\* $template - $desc\n"

	cat "$template_dir/$template.html" | sed -e "s/\${JOBAD_BASE}/$jobad_base/" -e "s/\${JS_INCLUDE}/$jobad_script_full/" -e "s/\${BUILD_COMMENTS}/<!-- This file has been generated automatically. Any changes will be overwritten. -->/"> "$template_build_dir/$template/unbuilt.html"
	echo "Wrote $template/unbuilt.html"

	cat "$template_dir/$template.html" | sed -e "s/\${JOBAD_BASE}/$jobad_base/" -e "s/\${JS_INCLUDE}/$jobad_release/" -e "s/\${BUILD_COMMENTS}/<!-- This file has been generated automatically. Any changes will be overwritten. -->/"> "$template_build_dir/$template/release.html"
	echo "Wrote $template/release.html"

	cat "$template_dir/$template.html" | sed -e "s/\${JOBAD_BASE}/$jobad_base/" -e "s/\${JS_INCLUDE}/$jobad_dev/" -e "s/\${BUILD_COMMENTS}/<!-- This file has been generated automatically. Any changes will be overwritten. -->\n/"> "$template_build_dir/$template/dev.html"
	echo "Wrote $template/dev.html"

	jobad_templates="$jobad_templates\t\* \[Release version\]\(.\/..\/..\/examples\/build\/$template\/release.html\)\n"	
	jobad_templates="$jobad_templates\t\* \[Development version\]\(.\/..\/..\/examples\/build\/$template\/dev.html\)\n"
	jobad_templates="$jobad_templates\t\* \[Unbuilt version\]\(.\/..\/..\/examples\/build\/$template\/unbuilt.html\)\n"

done < "./config/templates.txt"
echo "Writing demos.md ..."
cat "$template_dir/demos.md" | sed -e "s/\${JOBAD_TEMPLATES}/$jobad_templates/" > "$demos_md_dest"
echo "Templates build finished. "

