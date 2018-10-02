---
title: Pull Requests
permalink: pulls.html
menu_index: 2
navicon: fas fa-code-branch
js-includes: [pr-table.js]
---

Click on a PR number (the # column) to see the pull request on GitHub. Click
on the branch to enter Reviewable.io and do a code review.

<table>
    <tr><th colspan="2">Icon legend</th></tr>
    <tr>
      <td>clean</td>
      <td>&#x2705;</td>
    </tr>
    <tr>
      <td>behind</td>
      <td>&#x1f4a4;</td>
    </tr>
    <tr>
      <td>blocked</td>
      <td>&#x1f6a7;</td>
    </tr>
    <tr>
      <td>dirty</td>
      <td>&#x274c;</td>
    </tr>
    <tr>
      <td>unknown</td>
      <td>&#x231b;</td>
    </tr>
    <tr>
      <td>unstable</td>
      <td>&#x1f6a7;</td>
    </tr>
</table>

<div>
  <p>Loading Pull requests...</p>
  <noscript>
    <p>Actually, we're not loading anything.
    This page requires JavaScript to download the data for the PR table.
    Please enable JavaScript and reload the page.</p>

    <p>Alternatively, you can view the PRs for each repository on its page
    under the <a href="https://github.com/TokTok">TokTok organisation</a> on
    Github.</p>
  </noscript>
</div>
{: .tables-wrapper}

<div>
  <a href="javascript:reloadPrTable()">&#8634;</a>
</div>
{: .pr-reload}

{% comment %}
  .pr-reload is the reload button. &#8634; is a reload symbol.
{% endcomment %}
