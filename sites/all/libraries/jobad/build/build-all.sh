#!/bin/bash

BASE_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

$BASE_PATH/build-release.sh
$BASE_PATH/build-templates.sh
$BASE_PATH/build-doc.sh