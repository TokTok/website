WEB_NAME := toktok.github.io

ifneq ($(GITHUB_TOKEN),)
WEB_REPO := https://$(GITHUB_TOKEN)@github.com/TokTok/$(WEB_NAME)
else
WEB_REPO := git@github.com:TokTok/$(WEB_NAME)
endif

#
# build the website with jekyll
#
toktok-site: $(shell which jekyll) $(shell find toktok -type f) changelog roadmap spec
	rm -rf $@
	cd toktok && jekyll build && mv _site ../$@

#
# single pages, generated from external content
#
changelog: toktok/changelog/c-toxcore.md
roadmap: toktok/roadmap/c-toxcore.md
toktok/%/c-toxcore.md: toktok/%/c-toxcore.md.dist
	cp $< $@
	curl https://git-critique.herokuapp.com/hello/$* >> $@

spec: toktok/spec.md
toktok/spec.md: hs-toxcore $(shell find hs-toxcore -name "*.lhs" 2> /dev/null)
	cp $@.dist $@
	cp -a hs-toxcore/res toktok/
	! which pandoc || {			\
	  cd hs-toxcore;			\
	  for i in `find . -name "*.lhs"`; do	\
	    sed -i -e 's/\.lhs\}/.tex}/' $$i;	\
	    mv $$i $${i%.lhs}.tex;		\
	  done;					\
	  pandoc				\
	    -f latex+lhs			\
	    -t gfm				\
	    src/Network/Tox.tex 		\
	    | sed -e '/```.*literate/,/```/d'	\
	  >> ../$@;				\
	  find . -name "*.lhs" -delete;		\
	  git checkout .;			\
	}
	grep Introduction $@

.PHONY: hs-toxcore
hs-toxcore:
	if [ -d $@ ]; then \
		cd $@ && if [ -e .git -a "$$(git rev-parse --abbrev-ref HEAD)" != "HEAD" ]; then git pull; fi; \
	else \
		git clone --depth=1 https://github.com/TokTok/hs-toxcore $@; \
	fi

#
# deployment tasks
#
lint:
	mdl -i -w -s .md-style.rb $$(find toktok -name "*.md" \
		-and -not -wholename "toktok/spec.md" \
		-and -not -wholename "toktok/changelog/c-toxcore.md" \
		-and -not -wholename "toktok/roadmap/c-toxcore.md")

check:
	mkdir -p ~/.linkchecker/
	echo "[filtering]" > ~/.linkchecker/linkcheckerrc
	echo "ignorewarnings=ignore-url,http-robots-denied,https-certificate-error" >> ~/.linkchecker/linkcheckerrc
	linkchecker --ignore-url "https://toktok.ltd.*" --ignore-url "https://msgpack.org.*" --ignore-url "https://travis-ci.org.*" --ignore-url "irc://.*" --ignore-url "^javascript:" toktok-site

upload: toktok-site
	@test -d $(WEB_NAME) || git clone --depth=1 $(WEB_REPO)
	rm -rf $(WEB_NAME)/*
	mv toktok-site/* $(WEB_NAME)/
	rmdir toktok-site
	cd $(WEB_NAME) && git add -A .
	cd $(WEB_NAME) && git commit --amend --reset-author -m'Updated website'
	cd $(WEB_NAME) && git push --force --quiet
