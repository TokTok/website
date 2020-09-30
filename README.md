# website

The new website with something better than Yst (also, change the title)

## Development

To work on the website you need the following things:

- Jekyll and mdl via ruby gems: `gem install jekyll mdl guard-livereload`. You
  might need ruby development headers for this to work:
  `apt-get install ruby-dev`. Also in case of trouble
  [this](https://github.com/jekyll/jekyll/issues/5165#issuecomment-236341627)
  may help (install `gem install bundler`). `mdl` is optional for linting the
  markdown.
- pandoc, version 1.10 or higher (optional for building the spec).

  Install it via `apt-get install pandoc`, or `cabal install pandoc`, if you
  prefer the haskell way of doing it (this may take a while to install though).
  See <http://pandoc.org/installing.html> for other methods.

- linkchecker via `apt-get install linkchecker` (optional for link checking).

The follwing make targets are available:

1. `make all`: build the complete website including external content.
2. `make changelog`: download changelogs (included in `all`).
3. `make roadmap`: download roadmaps (included in `all`).
4. `make spec`: download and parse the spec with pandoc (included in `all`).
5. `make lint`: run markdown linter `mdl`.
6. `make check`: run linkchecker.
