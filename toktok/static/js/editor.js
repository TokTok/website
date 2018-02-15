let initialFiles = [
  "README.md",
  "c-toxcore/toxcore/group.c",
  "c-toxcore/toxcore/group.h",
  "c-toxcore/toxcore/tox.c",
  "c-toxcore/toxcore/tox.h",
];

let icons = {
  file :
      "https://cdn4.iconfinder.com/data/icons/6x16-free-application-icons/16/List.png",
  dir : null
};

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
  let codeId = 'code:' + ref.key;
  let linkId = 'ref:' + codeId;

  let container = document.getElementById(codeId);
  if (container) {
    console.log("Already have element:", codeId);
  } else {
    $('#tabs').append("<div id='" + codeId + "' data-key='" + ref.key +
                      "'></div>");
    $('#tabs-list')
        .append("<li><a id='" + linkId + "' href='#" + codeId + "'>" + path +
                "</a></li>");

    Firepad.fromCodeMirror(ref, CodeMirror(document.getElementById(codeId), {
                             lineNumbers : true,
                             lineWrapping : false,
                             matchBrackets : true,
                             indentUnit : 4,
                             mode : detectMode(path)
                           }));

    console.log("Created new element:", codeId);
    $("#tabs").tabs("refresh");
    $("#tabs").tabs({
      activate : (event, ui) => {
        window.location.hash = '#' + ui.newPanel.attr('data-key');
      }
    });
  }

  return linkId;
}

function openFile(path) {
  let linkId = loadFile(path);
  document.getElementById(linkId).click();
}

$(function() {
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

  // Initialise the navigation tabs at the top.
  $("#tabs").tabs();

  $('#file-list').on('changed.jstree', (e, data) => {
    if (data.node && data.node.original.children !== 0) {
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
});
