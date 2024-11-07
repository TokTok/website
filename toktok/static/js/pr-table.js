// Polyfill for replaceWith for IE, Firefox < v49, and Safari
// from: https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/replaceWith()/replaceWith().md
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty("replaceWith")) {
      return;
    }
    Object.defineProperty(item, "replaceWith", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function replaceWith() {
        var argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment();

        argArr.forEach(function (argItem) {
          var isNode = argItem instanceof Node;
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
        });

        this.parentNode.replaceChild(docFrag, this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

function escapeHTML(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
}

function reloadPrTable() {
  var start = new Date();

  var reloadButton = document.querySelector(".pr-reload");
  var reloadButtonClass = reloadButton.className;
  reloadButton.className += " pr-reloading";

  var requestHeaders = new Headers();
  var requestInit = { method: "GET",
                      headers: requestHeaders,
                      mode: "cors",
                      cache: "default" };

  var stateIcon = {
    clean: "&#x2705;",
    behind: "&#x1f4a4;",
    blocked: "&#x1f6a7;",
    draft: "&#x1f4dd;",
    dirty: "&#x274c;",
    unknown: "&#x231b;",
    unstable: "&#x1f6a7;",
  };

  fetch("https://github-tools.onrender.com/hello/pulls", requestInit)
  .then(function(response) { return response.json(); })
  .then(function(json) {
    var newRepoSection = document.createElement("div");
    newRepoSection.className = "tables-wrapper"

    for (var i = 0; i < json.length; i++) {
      if (json[i].length > 0) {
        var repoTitle = document.createElement("h2");
        repoTitle.innerHTML = json[i][0].prRepoName;
        newRepoSection.appendChild(repoTitle);

        var prTable = document.createElement("table");
        prTable.className = "pr-table"
        var prHeaders = document.createElement("tr");
        prHeaders.innerHTML =
          "<th>" + "#"         + "</th>" +
          "<th>" + "Branch"    + "</th>" +
          "<th>" + "Title"     + "</th>" +
          "<th>" + "State"     + "</th>" +
          "<th>" + "Reviewers" + "</th>";
        prTable.appendChild(prHeaders);

        for (var j = 0; j < json[i].length; j++) {
          var listItem = document.createElement("tr");
          var reviewableBranch =
            "<a href='https://reviewable.io/reviews/toktok/" + json[i][j].prRepoName +
            "/" + json[i][j].prNumber + "'>" +
            escapeHTML(json[i][j].prBranch).replace(/_/g, "_<wbr>") +
            "</a>";

          var githubNumber =
            " <a href='https://github.com/TokTok/" + json[i][j].prRepoName +
            "/pull/" + json[i][j].prNumber + "'>" +
            json[i][j].prNumber + "</a>";

          // Insert <wbr> tags after _ characters for neater word-wrapping.
          var titleWithTooltip =
            "<div class='tooltip'>" +
            escapeHTML(json[i][j].prTitle).replace(/_/g, "_<wbr>") +
            "&#8203;<span class='tooltiptext'>" + escapeHTML(json[i][j].prUser) + "</span>" +
            "</div>";

          var dayInMs = 24*60*60*1000;
          var ageInDays = Math.round((Date.now() - Date.parse(json[i][j].prCreated)) / dayInMs);
          var stateWithTooltip =
            "<div class='tooltip'>" + stateIcon[json[i][j].prState] +
            "&#8203;<span class='tooltiptext'>Created " + ageInDays +
            (ageInDays == 1 ? " day ago." : " days ago.") +
            "</span>" + "</div>";

          listItem.innerHTML =
            "<td>" + githubNumber                      + "</td>" +
            "<td>" + reviewableBranch                  + "</td>" +
            "<td>" + titleWithTooltip                  + "</td>" +
            "<td>" + stateWithTooltip                  + "</td>" +
            "<td>" + json[i][j].prReviewers.join(", ") + "</td>";

          prTable.appendChild(listItem);
        }
        newRepoSection.appendChild(prTable);
      }
    }
    var repoSection = document.querySelector(".tables-wrapper");
    repoSection.replaceWith(newRepoSection);
    reloadButton.className = reloadButtonClass;
    var end = new Date();
    var deltaTime = end.getTime() - start.getTime();
    console.log("PR table took %s seconds to load.", (deltaTime)/1000.0);
  });
}

reloadPrTable();
