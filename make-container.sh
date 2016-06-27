#!/bin/bash

export GIT_DIR=$(git rev-parse --show-toplevel)

cd $GIT_DIR;
docker build -t cron-php7-rewrite .
