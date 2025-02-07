REPOS :=		\
	c-toxcore	\
	qTox

#
# build the website with jekyll
#
toktok-site: $(shell which jekyll) $(shell find toktok -type f) changelog spec
	rm -rf $@
	cd toktok && jekyll build && mv _site ../$@

#
# single pages, generated from external content
#
changelog: $(patsubst %,toktok/changelog/%.md,$(REPOS))
toktok/changelog/%.md: toktok/changelog/_template.md
	sed -e 's/@REPO@/$*/g' $< > $@
	curl "https://raw.githubusercontent.com/TokTok/$*/refs/heads/master/CHANGELOG.md" \
		| sed -E -e 's/\[(\w*)\]([^(])/(\1)\2/' \
		>> $@

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
	    | sed -e '/``` haskell/,/```/d'	\
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
