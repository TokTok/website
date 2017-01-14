---
layout: default
title: Home
permalink: index.html
menu_index: 1
---

We are a **focused** effort to bring high quality privacy enhancing software
to everybody.

![TokTok Android client](static/img/toktok/chat-small.png)

# Current focus

Focus means we work on a small set of projects (one or two at a time) and
concentrate all our work on getting those projects finished completely before
moving on to the next target.

Our current focus is:

-   Create a [full specification](spec.html) of the Tox protocol.
-   Create a free [executable model](https://github.com/TokTok/hs-toxcore) of
    that protocol.
-   Slowly improve the existing Tox protocol
    [implementation](https://github.com/TokTok/c-toxcore) written in C. We
    build new releases with mostly cleanups, minor bugfixes, and small
    non-intrusive features.

A new implementation in Rust is [in progress](https://github.com/zetok/tox).
It evolves together with the model and is tested against the specification.

Neither the Tox protocol nor the implementation have undergone peer review,
and its exact security properties and network behaviour are not
well-understood, yet. We are actively working on improving that situation.
Until said peer review, Tox is not recommended for use cases that require
proven, high-assurance security. If you find any potential security issues,
don't hesitate to report them on the [bug
tracker](https://github.com/TokTok/c-toxcore/issues).

# Contact us

If you're interested in what we're doing, feel free to stop by on IRC in
[#toktok on Freenode](irc://irc.freenode.net/#toktok). Feel free to stick
around and discuss TokTok related topics. If you do join, please stay on topic
and respect other people.

# Get started

[Collection of resources for developers.](get-started.html)

# Build status

You can file bug reports against one of the TokTok projects on GitHub. Build
status and test coverage of all projects can be viewed on this page.

<table>
  <tr>
    <th>Project</th>
    <th>Build Status</th>
    <th>Coverage</th>
    <th>Issues</th>
    <th>PRs</th>
  </tr>
  {% comment %}
  The capture line is here because of a bug in Jekyll or something. :(
  {% endcomment %}
  {% for repo in site.data.repos %}
  {% capture repo_name %}{{ repo.name }}{% endcapture %}
  {% include repository.html name=repo_name %}
  {% endfor %}
</table>
