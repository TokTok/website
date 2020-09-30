# Website

The new website with something better than Yst. (also, change the title)

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

■ The follwing make targets are available: 

- `make_all`: build the complete website including external content.
- `make_changelog`: download changelogs (included in `all`)
- `make_roadmap`: download roadmaps (included in `all`)
- `make_spec`: download and parse the spec with pandoc (included in `all`)
- `make_lint`: run markdown linter `mdl`
- `make_check`: run linkchecker
