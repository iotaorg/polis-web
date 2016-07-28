#!/bin/bash

export GIT_DIR=$(git rev-parse --show-toplevel)
export MYIP=$(ip route get 8.8.8.8 | head -1 | cut -d' ' -f8)

docker kill polis-php
docker rm polis-php
docker run -d -p 5050:80 --add-host=api_server:$MYIP --name polis-php -v "$GIT_DIR":/var/www/html cron-php7-rewrite
