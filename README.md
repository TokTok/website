# website

The TokTok website at <https://toktok.ltd>, built with Jekyll from `toktok/`.
Each push to master deploys it to GitHub Pages, which serves toktok.ltd, and to
Netlify, which also shows a preview of each pull request.

## Development

To work on the website you need the following things:

- Jekyll and mdl via ruby gems: `gem install jekyll mdl guard-livereload`.
- pandoc, for the spec page, which `make` builds from hs-toxcore.
- LinkChecker via pip, for `make check`.

`make toktok-site` builds the site into `toktok-site/`, and `make lint` and
`make check` check its Markdown and links. To build it as CI does and serve it
at <http://localhost:8080>, run `deploy/local.sh` (needs Docker).
