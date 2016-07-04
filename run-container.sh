#!/bin/bash

export GIT_DIR=$(git rev-parse --show-toplevel)

docker run -d -p 5050:80 --rm --name website-php-7 -v "$GIT_DIR":/var/www/html cron-php7-rewrite
