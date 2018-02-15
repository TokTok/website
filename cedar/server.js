// https://github.com/firebase/firepad/issues/251
global.window = {};

// Our firepad user id, to avoid acting on our own updates to files.
// Cedar IDE = Coder IDE, with vowels shifted.
const USER_ID = "cedar-server";
const ROOT_DIR = process.env.HOME + "/code/toktok-stack";

let ansi_to_html = require('ansi-to-html');
let firepad = require('firepad');
let firebase = require('firebase');
let fs = require('fs');
let child_process = require('child_process');

// Initialize Firebase.
let config = {
  apiKey : "AIzaSyC_JdByNm-E1CAJUkePsr-YJZl7W77oL3g",
  authDomain : "firepad-tests.firebaseapp.com",
  databaseURL : "https://firepad-tests.firebaseio.com"
};
firebase.initializeApp(config);

function execLines(cmd, args) {
  return child_process
      .execFileSync(cmd, args, {
        cwd : ROOT_DIR,
        encoding : "utf8",
      })
      .trim()
      .split("\n");
}

firebase.database()
    .ref("file_list")
    .set(execLines("git", [
           "submodule", "foreach", '--quiet',
           'git ls-files | sed -e "s|^|$PWD/|;s|' + ROOT_DIR + '/||"'
         ]).concat(execLines("git", [ "ls-files" ])));

function getFileRef(file) {
  let mangled =
      (file.replace(/_/g, "_U").replace(/\./g, "_D").replace(/\//g, "_S"));
  console.log("Loading key:", mangled);
  return firebase.database().ref(mangled);
}

let initialFiles = [
  "README.md",
  "c-toxcore/toxcore/group.c",
  "c-toxcore/toxcore/group.h",
  "c-toxcore/toxcore/tox.c",
  "c-toxcore/toxcore/tox.h",
];

let ansi = new ansi_to_html();
var buildRunning = false;
function runBuild() {
  if (buildRunning) {
    console.log("build already running; not starting another one");
    return;
  }
  console.log("starting a new build");
  buildRunning = true;
  let bazel = child_process.spawn("bazel", [ "build", "//..." ], {
    cwd : ROOT_DIR,
  });

  let output = firebase.database().ref("bazel_out");
  var bazelLog = "";
  function updateLog(chunk) {
    bazelLog += chunk;
    console.log("updating build log:", bazelLog.length, "bytes");
    output.set(ansi.toHtml(bazelLog));
  }
  bazel.stdout.setEncoding('utf8');
  bazel.stdout.on('data', updateLog);
  bazel.stderr.setEncoding('utf8');
  bazel.stderr.on('data', updateLog);
  bazel.on('exit', () => buildRunning = false);
}

function setupSave(path, ref, pad) {
  var lastUpdate = 0;
  var saveTimer = null;

  ref.on('value', snapshot => {
    let update =
        Object.values(snapshot.val().history).sort((a, b) => b.t - a.t)[0];
    if (update.t <= lastUpdate || update.a == USER_ID) {
      return;
    }
    console.log("new update at timestamp", update.t, "from", update.a);
    lastUpdate = update.t;

    if (saveTimer !== null) {
      clearTimeout(saveTimer);
    }
    saveTimer = setTimeout(() => {
      console.log("fetching data for", path);
      pad.getText(contents => {
        console.log("writing", contents.length, "bytes to", path);
        fs.writeFile("../../" + path, contents, err => {
          if (err) {
            console.log("error", err, "while writing", path);
          } else {
            console.log("done writing", path);
            runBuild();
          }
        });
      });
    }, 5000);
  });
}

initialFiles.forEach(path => {
  let ref = getFileRef(path);
  let pad = new firepad.Headless(ref);
  pad.firebaseAdapter_.setUserId(USER_ID);

  fs.readFile("../../" + path, "utf8", (err, contents) => {
    pad.setText(contents, (err, committed) => {
      if (err) {
        console.log("error", err, "while loading", path);
      } else {
        console.log("done loading", path);
        setupSave(path, ref, pad);
      }
    });
  });
});

// Run initial build.
runBuild();
