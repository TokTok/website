#!/bin/sh

set -eux

exec python3 -m http.server "$PORT"
