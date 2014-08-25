#!/bin/bash
APP_NAME="QueensSSOSaver"
BUILD_DIR="_build"
BUILD_FILES=( \
    "jquery-2.0.3.js" \
    "JQueryRC4.js" \
    "LICENSE" \
    "login.js" \
    "manifest.json" \
    "README.md" \
    "redirect.js" \
    )

rm $BUILD_DIR/ -r
mkdir $BUILD_DIR/$APP_NAME -p

# copy into a folder that can be loaded as an unpacked extension
for file in ${BUILD_FILES[*]}; do
	cp $file $BUILD_DIR/$APP_NAME/
done

# compress for uploading
zip $BUILD_DIR/$APP_NAME.zip ${BUILD_FILES[*]}
