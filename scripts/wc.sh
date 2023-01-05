#! /usr/bin/env bash

find . ! -path '*.pyc' ! -path '*/dist/*' ! -path '*splendor_match/*' ! -path '*splendor_save/*' ! -path '*/images/*' ! -path '*__init__.py' ! -path '*migrations*' ! -path '*media*' ! -path './static/*' ! -path './.git/*' ! -path './acapp/*' ! -path '*manage.py' ! -path '*.git*' ! -path '*db.*' ! -path '*.md*' ! -path './match_service/superperson/src/match_server*' ! -path '*assets*'   -type 'f' |xargs cat | wc -l

git log --format='%aN' | sort -u | while read name; do echo -en "$name\\t"; git log --author="$name" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -; done
