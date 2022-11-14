#! /usr/bin/bash

if [ $# -lt 2 ]; then
    echo Usage: ${0} game superperson
    exit 1
fi
JS_DIR=/home/acs/acapp/${1}/static/${2}/js
JS_DIST=${JS_DIR}/dist
JS_SRC=${JS_DIR}/src

find $JS_SRC -type f -name '*.js' | sort | xargs cat | terser -c -m > ${JS_DIST}/game.js
echo yes | python3 manage.py collectstatic
