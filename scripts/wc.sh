#! /usr/bin/env bash

find . ! -path '*.pyc' ! -path '*/dist/*' ! -path '*splendor_match/*' ! -path '*splendor_save/*' ! -path '*/images/*' ! -path '*__init__.py' ! -path '*migrations*' ! -path '*media*' ! -path './static/*' ! -path './.git/*' ! -path './acapp/*' ! -path '*manage.py' ! -path '*.git*' ! -path '*db.*' ! -path '*.md*' ! -path './match_service/superperson/src/match_server*'  -type 'f' | xargs cat | wc -l


