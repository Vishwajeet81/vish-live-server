const vscode = require("vscode");
const path = require("path");
const { spawn } = require("child_process");
const open = require("open").default;
let serverProcess = null;
let PORT = null;
/**
 * @param {vscode.ExtensionContext} context
 */

//Utility Custom Methods
function setInitialStatusBarItems(alignment, text, command, priority) {
  const statusBarItem = vscode.window.createStatusBarItem(alignment, priority);
  statusBarItem.text = text;
  statusBarItem.command = command;
  statusBarItem.show();
  return statusBarItem;
}

function setStatusBarItems(statusBarItem, text, command) {
  statusBarItem.text = text;
  statusBarItem.command = command;
}

function verifyHtmlFile(uri) {
  if (path.extname(uri.fsPath) != ".html") {
    return false;
  }
  return true;
}

function isUriPassedByNode(uri) {
  if (!uri) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No active files");
      return false;
    }
    return editor.document.uri;
  }
  return uri;
}

function makeFinalUrlPath(projectPath, uri) {
  const relativePath = path.relative(projectPath, uri.fsPath);
  return relativePath.replace(/\\/g, "/");
}

function isServerExists() {
  if (!serverProcess) {
    return false;
  }
  return true;
}

function startServer(serverPath, projectPath, statusBar) {
  return new Promise((resolve, reject) => {
    vscode.window.showInformationMessage("Starting Vish Live Server...");

    serverProcess = spawn("node", [serverPath, projectPath]);
    serverProcess.stdout.on("data", (data) => {
      console.log(data.toString());
      if (data.toString().includes("PORT=")) {
        console.log("true");
        PORT = Number(data.toString().split("=").slice(1).toString());
        console.log("PORT", PORT);
        resolve();
      }
    });

    serverProcess.stderr.on("data", (data) => {
      console.log("STDERR");
      console.error(data.toString());
      vscode.window.showErrorMessage(data.toString());
    });

    serverProcess.on("close", () => {
      serverProcess = null;

      setStatusBarItems(
        statusBar,
        "$(broadcast) Go Live",
        "vish-live-server.goLive",
      );

      console.log("Server stopped");
      reject("Server not running..");
    });
  });
}

// Lifecycle of extension starts from here
function activate(context) {
  const serverPath = path.join(context.extensionPath, "server.js");
  const projectPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

  const statusBar = setInitialStatusBarItems(
    vscode.StatusBarAlignment.Right,
    "$(broadcast) Go Live",
    "vish-live-server.goLive",
    100,
  );

  console.log(
    'Congratulations, your extension "vish-live-server" is now active!',
  );

  const disposable = vscode.commands.registerCommand(
    "vish-live-server.goLive",
    async function (uri) {
      let urlPath = null;

      if (isUriPassedByNode(uri)) {
        uri = isUriPassedByNode(uri);
      } else {
        return;
      }

      if (!verifyHtmlFile(uri)) {
        vscode.window.showErrorMessage("Select Html file only!");
        return;
      }

      urlPath = makeFinalUrlPath(projectPath, uri);

      if (isServerExists()) {
        console.log(PORT);
        await open(`http://localhost:${PORT}/` + urlPath);
        vscode.window.showInformationMessage(
          "Vish Live Server is already running.",
        );
        return;
      }

      console.log(serverPath);
      console.log(projectPath);
      if (!isServerExists()) {
        try {
          await startServer(serverPath, projectPath, statusBar);
          setStatusBarItems(
            statusBar,
            "$(debug-stop) Stop Live",
            "vish-live-server.stop",
          );

          await open(`http://localhost:${PORT}/` + urlPath);
        } catch (err) {
          setStatusBarItems(
            statusBar,
            "$(broadcast) Go Live",
            "vish-live-server.goLive",
          );

          console.log("ERROR HAI : ", err);
          vscode.window.showErrorMessage(err);
          return;
        }
      }
    },
  );

  const disposable2 = vscode.commands.registerCommand(
    "vish-live-server.stop",
    function () {
      if (!isServerExists()) {
        vscode.window.showInformationMessage("No Live Server is running.");
        return;
      }

      serverProcess.kill();
      setStatusBarItems(
        statusBar,
        "$(broadcast) Go Live",
        "vish-live-server.goLive",
      );
    },
  );

  const previewDisposable = vscode.commands.registerCommand(
    "vish-live-server.preview",
    async function () {
      if (!isServerExists()) {
        try {
          await startServer(serverPath, projectPath, statusBar);
        } catch (err) {
          setStatusBarItems(
            statusBar,
            "$(broadcast) Go Live",
            "vish-live-server.goLive",
          );

          vscode.window.showErrorMessage(err);
          return;
        }
      } else {
        vscode.window.showInformationMessage(
          "Live Server is already running. Opening in browser...",
        );
      }
      const panel = vscode.window.createWebviewPanel(
        "preview",
        "Vish Live Preview",
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
        },
      );

      panel.webview.html = `
         <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background:white;
        }

        iframe {
            width: 100%;
            height: 100vh;
            border: none;
        }
    </style>
</head>

<body>
    <iframe
        src="http://localhost:${PORT}">
    </iframe>
</body>
</html>
      `;
    },
  );

  context.subscriptions.push(
    disposable,
    disposable2,
    statusBar,
    previewDisposable,
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
