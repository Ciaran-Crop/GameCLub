#! /usr/bin/bash

if [ $# -lt 1 ]; then
    echo Usage: ${0} game/gameclub
    exit 1
fi

case $1 in
    "game")
        JS_DIR=/home/acs/acapp/game/static/superperson/js
        JS_DIST=${JS_DIR}/dist
        JS_SRC=${JS_DIR}/src
        find $JS_SRC -type f -name '*.js' | sort | xargs cat | terser -c -m > ${JS_DIST}/game.js
        echo yes | python3 manage.py collectstatic
        ;;
    "gameclub")
        JS_DIR=/home/acs/acapp/gameclub/static/gameclub/js
        JS_DIST=${JS_DIR}/dist
        JS_SRC=${JS_DIR}/src

        find $JS_SRC -type f -name '*.js' | sort | xargs cat | terser -c -m > ${JS_DIST}/gameclub.js
        CSS_DIR=/home/acs/acapp/gameclub/static/gameclub/css
        CSS_DIST=${CSS_DIR}/dist
        CSS_SRC=${CSS_DIR}/src
        find $CSS_SRC -type f -name '*.css' | sort | xargs cat > ${CSS_DIST}/gameclub.css

        echo yes | python3 manage.py collectstatic
        ;;
    "splendor")
        JS_DIR=/home/acs/acapp/Splendor/static/splendor/js
        JS_DIST=${JS_DIR}/dist
        JS_SRC=${JS_DIR}/src

        find $JS_SRC -type f -name '*.js' | sort | xargs cat | terser -c -m > ${JS_DIST}/splendor.js
        CSS_DIR=/home/acs/acapp/Splendor/static/splendor/css
        CSS_DIST=${CSS_DIR}/dist
        CSS_SRC=${CSS_DIR}/src
        find $CSS_SRC -type f -name '*.css' | sort | xargs cat > ${CSS_DIST}/splendor.css

        echo yes | python3 manage.py collectstatic
        ;;
    *)
        echo "NO~~~~~~~~~~~~~~~~~~~!!!!!!!!!!!!!!!!!!"
esac
