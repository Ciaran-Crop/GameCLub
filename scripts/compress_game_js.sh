#! /usr/bin/bash

JS_DIR=/home/acs/acapp/game/static/superperson/js
JS_DIST=${JS_DIR}/dist
JS_SRC=${JS_DIR}/src

find $JS_SRC -type f -name '*.js' | sort | xargs cat > ${JS_DIST}/game.js
