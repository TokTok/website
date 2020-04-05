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

RUN addgroup -S builder && adduser -SDH -G builder builder
USER builder

COPY toktok /home/builder/build/toktok/
#COPY Makefile /home/builder/build/
COPY entrypoint.sh /home/builder/

COPY --chown=builder:builder toktok/spec.md.dist /home/builder/build/toktok/
RUN ["make", "toktok/spec.md"]

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
