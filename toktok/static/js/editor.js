let initialFiles = [
  "website/cedar/README.md",
];

let icons = {
  file :
      "https://cdn4.iconfinder.com/data/icons/6x16-free-application-icons/16/List.png",
  dir : null
};

let pads = {};
let cms = {};

function makeJsTree(parents, data) {
  return Object.entries(data)
      .map(entry => {
        let path = parents.concat(entry[0]);
        let children = makeJsTree(path, entry[1]);
        return {
          text : entry[0],
          children : children,
          path : path.join("/"),
          icon : children.length !== 0 ? icons.dir : icons.file,
        };
      })
      .sort((a, b) => {
        let aIsDir = a.children.length !== 0;
        let bIsDir = b.children.length !== 0;
        if (aIsDir === bIsDir) {
          return a.text.localeCompare(b.text);
        }
        return aIsDir ? -1 : 1;
      });
}

function mangle(path) {
  return path.replace(/_/g, "_U").replace(/\./g, "_D").replace(/\//g, "_S");
}

function demangle(key) {
  return key.replace(/_D/g, ".").replace(/_S/g, "/").replace(/_U/g, "_");
}

function getRef(file) {
  console.log("Loading key:", mangle(file));
  return firebase.database().ref(mangle(file));
}

function detectMode(path) {
  if (path.endsWith(".c") || path.endsWith(".cpp") || path.endsWith(".h")) {
    return "text/x-c++src";
  }
  if (path.endsWith(".md")) {
    return "text/x-markdown";
  }
  return null;
}

function loadFile(path) {
  let ref = getRef(path);
  let codeId = 'code-' + ref.key;
  let linkId = 'ref-' + codeId;

  let container = document.getElementById(codeId);
  if (container) {
    console.log("Already have element:", codeId);
  } else {
    $('#tabs').append("<div id='" + codeId + "' data-key='" + ref.key +
                      "'></div>");
    $('#tabs-list')
        .append(
            "<li><a id='" + linkId + "' href='#" + codeId + "'>" + path +
            "<span class='ui-icon ui-icon-close' role='presentation'>Close</span>" +
            "</a></li>");

    cms[ref.key] = CodeMirror(document.getElementById(codeId), {
      foldGutter : true,
      gutters : [ "CodeMirror-linenumbers", "CodeMirror-foldgutter" ],
      autoCloseBrackets : true,
      lineNumbers : true,
      lineWrapping : false,
      matchBrackets : true,
      showTrailingSpace : true,
      highlightSelectionMatches : true,
      indentUnit : 4,
      inputStyle : "contenteditable",
      extraKeys : {"Ctrl-Space" : "autocomplete"},
      mode : detectMode(path)
    });
    pads[codeId] = Firepad.fromCodeMirror(ref, cms[ref.key]);

    console.log("Created new element:", codeId);
    $("#tabs").tabs("refresh");
    $("#tabs").tabs({
      activate : (event, ui) => {
        let key = ui.newPanel.attr('data-key');
        window.location.hash = '#' + key;
        cms[key].refresh();
      }
    });
  }

  return linkId;
}

function openFile(path) {
  let linkId = loadFile(path);
  document.getElementById(linkId).click();
}

$(() => {
  // Set up firebase connection.
  firebase.initializeApp({
    apiKey : "AIzaSyC_JdByNm-E1CAJUkePsr-YJZl7W77oL3g",
    authDomain : "firepad-tests.firebaseapp.com",
    databaseURL : "https://firepad-tests.firebaseio.com"
  });

  // Set up build output window.
  firebase.database().ref("bazel_out").on('value', snapshot => {
    document.getElementById('output-container').innerHTML = snapshot.val();
  });

  // Set up file picker.
  firebase.database().ref("file_list").on('value', snapshot => {
    // Build tree from the file list.
    let tree = {};
    snapshot.val().forEach(file => {
      var parent = tree;
      file.split("/").forEach(c => {
        if (!parent[c])
          parent[c] = {};
        parent = parent[c];
      });
    });

    let jstree = $('#file-list').jstree(true);
    if (jstree) {
      console.log("reloading file tree");
      jstree.settings.core.data = makeJsTree([], tree);
      jstree.refresh();
    } else {
      $('#file-list').jstree({core : {data : makeJsTree([], tree)}})
    }
  });

  // Global CodeMirror settings.
  CodeMirror.commands.autocomplete = cm => {
    cm.showHint({hint : CodeMirror.hint.anyword});
  };

  // Initialise the navigation tabs at the top.
  let tabs = $("#tabs").tabs();
  // Close icon: removing the tab on click
  tabs.on("click", "span.ui-icon-close", function() {
    var panelId = $(this).closest("li").remove().attr("aria-controls");
    console.log("removing tab:", panelId);
    $("#" + panelId).remove();
    pads[panelId].dispose();
    delete pads[panelId];
    tabs.tabs("refresh");
  });

  $('#file-list').on('changed.jstree', (e, data) => {
    if (data.node && data.node.children.length === 0) {
      openFile(data.node.original.path);
    }
  });

  initialFiles.forEach(loadFile);

  window.addEventListener("hashchange", event => {
    openFile(demangle(window.location.hash.slice(1)));
  });

  if (window.location.hash !== "") {
    openFile(demangle(window.location.hash.slice(1)));
  } else {
    openFile("README.md");
  }

  $(window).keydown(event => {
    if (event.ctrlKey && event.keyCode == 87) {
      $('.ui-tab.ui-state-active .ui-icon-close').click();
      event.preventDefault();
    }
  });
});
