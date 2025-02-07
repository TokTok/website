FROM alpine:3.21

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
USER builder

WORKDIR /home/builder/build
COPY --chown=builder:builder Makefile /home/builder/build/
COPY --chown=builder:builder entrypoint.sh /home/builder/

COPY --chown=builder:builder toktok/spec.md.dist /home/builder/build/toktok/
RUN ["make", "toktok/spec.md"]

COPY --chown=builder:builder toktok/ /home/builder/build/toktok/
RUN ["make", "toktok-site"]

COPY .md-style.rb /home/builder/build/
RUN ["make", "lint"]
RUN . /path/to/venv/bin/activate \
 && make check \
 && mv toktok-site _site

WORKDIR /home/builder/build/_site
ENTRYPOINT ["/home/builder/entrypoint.sh"]
