#!/bin/bash

file_path=$1
commit_date="REACT_APP_LAST_COMMIT_DATE=$(git log -1 --format=%aI --date=iso-strict)"

if [ ! -f $file_path ]; then
  touch $file_path
fi

if grep -q "^REACT_APP_LAST_COMMIT_DATE=" $file_path; then
  sed -i '' "s/^REACT_APP_LAST_COMMIT_DATE=.*/$commit_date/" $file_path
else
  if [ -n "$(tail -c 1 $file_path)" ]; then
    echo "" >> $file_path
  fi
  echo "$commit_date" >> $file_path
fi
