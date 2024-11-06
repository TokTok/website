FROM alpine:3.20.0

# hadolint ignore=DL3018
RUN ["apk", "add", "--no-cache", \
 "curl", \
 "g++", \
 "gcc", \
 "git", \
 "graphviz", \
 "jekyll", \
 "make", \
 "pandoc", \
 "py3-pip", \
 "python3"]
RUN python3 -m venv /path/to/venv
# hadolint ignore=DL3013
RUN . /path/to/venv/bin/activate \
 && pip install --no-cache-dir LinkChecker

RUN ["gem", "install", "--no-document", "guard-livereload", "mdl"]

RUN addgroup -S builder && adduser -SDH -G builder builder

WORKDIR /home/builder/build
COPY toktok /home/builder/build/toktok/
COPY Makefile /home/builder/build/
COPY entrypoint.sh /home/builder/

RUN ["chown", "-R", "builder:builder", "/home/builder"]
USER builder

RUN ["make", "hs-toxcore"]
RUN ["make", "toktok-site"]

COPY .md-style.rb /home/builder/build/
RUN ["make", "lint"]
RUN . /path/to/venv/bin/activate \
 && make check

WORKDIR /home/builder/build/toktok-site
ENTRYPOINT ["/home/builder/entrypoint.sh"]
