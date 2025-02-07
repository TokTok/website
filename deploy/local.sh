#!/usr/bin/env bash

set -eux -o pipefail

docker build -t toxchat/toktok.github.io:latest .
docker run --rm -it -p 8080:8080 -e PORT=8080 toxchat/toktok.github.io:latest
