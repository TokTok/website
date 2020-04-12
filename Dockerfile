FROM ubuntu:22.04

ENV DEBIAN_FRONTEND="noninteractive"

# hadolint ignore=DL3008
RUN apt-get update && apt-get install -y --no-install-recommends \
 curl \
 git \
 make \
 pandoc \
 python-is-python3 \
 python3 \
 python3-bs4 \
 python3-dnspython \
 python3-requests \
 python3-urllib3 \
 python3-xdg \
 ruby \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* \
 && curl -s -o linkchecker.deb http://ftp.debian.org/debian/pool/main/l/linkchecker/linkchecker_10.0.1-2_amd64.deb \
 && dpkg -i linkchecker.deb \
 && rm linkchecker.deb

RUN ["mkdir", "/usr/local/nvm"]
ENV NVM_DIR=/usr/local/nvm \
    NODE_VERSION=14.18.2

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash \
 && . $NVM_DIR/nvm.sh \
 && nvm install $NODE_VERSION \
 && nvm alias default $NODE_VERSION \
 && nvm use default

ENV NODE_PATH=$NVM_DIR/v$NODE_VERSION/lib/node_modules \
    PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN ["gem", "install", "--no-document", "mdl"]

RUN groupadd -r -g 1000 builder \
 && useradd --no-log-init -r -g builder -u 1000 builder

COPY toktok /home/builder/build/toktok/
#COPY Makefile /home/builder/build/
COPY entrypoint.sh /home/builder/

RUN ["chown", "-R", "builder:builder", "/home/builder"]
USER builder

#RUN ["make", "hs-toxcore"]
#RUN ["make", "toktok-site"]

#COPY .md-style.rb /home/builder/build/
#RUN ["make", "lint"]
#RUN ["make", "check"]
WORKDIR /home/builder/build/toktok
RUN ["npm", "install"]
RUN ["npm", "run", "build"]

WORKDIR /home/builder/build/toktok/public/
ENTRYPOINT ["/home/builder/entrypoint.sh"]
