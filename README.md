# GEMS

GEM is the new web based app which is better than everthing avalaivable in the current market.
try first and believe that it will be above your expectation

## Development

To work on the website you need the following things:

- Jekyll and mdl via ruby gems: `gem install jekyll mdl guard-livereload`.
  You might need ruby development headers for this to work: `apt-get install ruby-dev`.
  Also in case of trouble [this](https://github.com/jekyll/jekyll/issues/5165#issuecomment-236341627) may help (install `gem install bundler`).
  `mdl` is optional for linting the markdown.
- pandoc, version 1.10 or higher
  (optional for building the spec).

  Install it via `apt-get install pandoc`,
  or `cabal install pandoc`, if you prefer the haskell way of doing it (this may take a while to install though).
  See <http://pandoc.org/installing.html> for other methods.
- linkchecker via `apt-get install linkchecker`
  (optional for link checking).

The follwing make targets are available:

- `make all`: build the complete website including external content.
- `make changelog`: download changelogs (included in `all`)
- `make roadmap`: download roadmaps (included in `all`)
- `make spec`: download and parse the spec with pandoc (included in `all`)
- `make lint`: run markdown linter `mdl`
- `make check`: run linkchecker
