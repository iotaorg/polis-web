#!/bin/bash

export GIT_DIR=$(git rev-parse --show-toplevel)
export MYIP=$(ip route get 8.8.8.8 | head -1 | cut -d' ' -f8)

docker run -d -p 5050:80 --add-host=api_server:$MYIP --name website-php-7 -v "$GIT_DIR":/var/www/html cron-php7-rewrite
