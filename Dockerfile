FROM ubuntu:20.04

ENV DEBIAN_FRONTEND="noninteractive"

# hadolint ignore=DL3008
RUN apt-get update && apt-get install -y --no-install-recommends \
 build-essential \
 curl \
 git \
 graphviz \
 make \
 pandoc \
 python3 \
 python3-bs4 \
 python3-pip \
 python3-requests \
 python3-urllib3 \
 python3-xdg \
 ruby \
 ruby-dev \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*
# hadolint ignore=DL3013
RUN pip install --no-cache-dir LinkChecker

RUN ["gem", "install", "--no-document", "jekyll", "guard-livereload", "mdl"]

RUN groupadd -r -g 1000 builder \
 && useradd --no-log-init -r -g builder -u 1000 builder

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
RUN ["make", "check"]

WORKDIR /home/builder/build/toktok-site
ENTRYPOINT ["/home/builder/entrypoint.sh"]
