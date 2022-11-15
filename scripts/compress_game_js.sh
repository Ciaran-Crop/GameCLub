#! /usr/bin/bash

#if [ $# -lt 2 ]; then
#    echo Usage: ${0} game superperson
#    exit 1
#fi
JS_DIR=/home/acs/acapp/game/static/superperson/js
JS_DIST=${JS_DIR}/dist
JS_SRC=${JS_DIR}/src

find $JS_SRC -type f -name '*.js' | sort | xargs cat | terser -c -m > ${JS_DIST}/game.js

JS_DIR=/home/acs/acapp/gameclub/static/gameclub/js
JS_DIST=${JS_DIR}/dist
JS_SRC=${JS_DIR}/src
echo ${JS_DIR}

find $JS_SRC -type f -name '*.js' | sort | xargs cat | terser -c -m > ${JS_DIST}/gameclub.js
echo yes | python3 manage.py collectstatic
