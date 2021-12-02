FROM ubuntu:22.04

ENV DEBIAN_FRONTEND="noninteractive"

# hadolint ignore=DL3008
RUN apt-get update && apt-get install -y --no-install-recommends \
 build-essential \
 curl \
 git \
 make \
 pandoc \
 python3 \
 python3-bs4 \
 python3-dnspython \
 python3-requests \
 python3-urllib3 \
 python3-xdg \
 ruby \
 ruby-dev \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*
RUN curl -s -o linkchecker.deb http://ftp.debian.org/debian/pool/main/l/linkchecker/linkchecker_10.0.1-2_amd64.deb \
 && dpkg -i linkchecker.deb \
 && rm linkchecker.deb

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
