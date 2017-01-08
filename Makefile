WEB_NAME := toktok.github.io

ifneq ($(GITHUB_TOKEN),)
WEB_REPO := https://$(GITHUB_TOKEN)@github.com/TokTok/$(WEB_NAME)
else
WEB_REPO := git@github.com:TokTok/$(WEB_NAME)
endif

toktok-site: $(shell which jekyll) $(shell find toktok -type f)
	rm -rf $@
	cd toktok && jekyll build && mv _site ../$@

upload: toktok-site
	test -d $(WEB_NAME) || git clone --depth=1 $(WEB_REPO)
	rm -rf $(WEB_NAME)/*
	mv toktok-site/* $(WEB_NAME)/
	rmdir toktok-site
	cd $(WEB_NAME) && git add -A .
	cd $(WEB_NAME) && git commit -a --amend -m'Updated website'
	cd $(WEB_NAME) && git push --force
