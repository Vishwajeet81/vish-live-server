// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const { spawn } = require("child_process");
const open = require("open").default;
let serverProcess = null;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

function startServer(serverPath, projectPath, statusBarItem) {
  // Display a message box to the user
  vscode.window.showInformationMessage("Starting Vish Live Server...");
  serverProcess = spawn("node", [serverPath, projectPath]);
  serverProcess.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  serverProcess.stderr.on("data", (data) => {
    console.error(data.toString());
  });
  serverProcess.on("close", () => {
    serverProcess = null;

    statusBarItem.text = "$(broadcast) Go Live";
    statusBarItem.command = "vish-live-server.goLive";

    console.log("Server stopped");
  });
}
function activate(context) {
  const serverPath = path.join(context.extensionPath, "server.js");
  const projectPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100,
  );

  statusBarItem.text = "$(broadcast) Go Live";
  statusBarItem.command = "vish-live-server.goLive";
  statusBarItem.show();
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "vish-live-server" is now active!',
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "vish-live-server.goLive",
    async function (uri) {
      let relativePath = null;
      let urlPath = null;
      if (!uri) {
        const editor = vscode.window.activeTextEditor;
        console.log(editor);
        if (!editor) {
          vscode.window.showErrorMessage("No active files");
          return;
        }
        uri = editor.document.uri;
      }
      console.log("Extension : ", path.extname(uri.fsPath));
      if (path.extname(uri.fsPath) != ".html") {
        vscode.window.showErrorMessage("Select Html file only!");
        return;
      }
      relativePath = path.relative(projectPath, uri.fsPath);
      urlPath = relativePath.replace(/\\/g, "/");
      console.log("URI:", uri);
      if (serverProcess) {
        await open("http://localhost:5000/" + urlPath);
        vscode.window.showInformationMessage(
          "Vish Live Server is already running.",
        );
        return;
      }
      // The code you place here will be executed every time your command is executed

      console.log(serverPath);
      console.log(projectPath);
      if (!serverProcess) {
        startServer(serverPath, projectPath, statusBarItem);
        statusBarItem.text = "$(debug-stop) Stop Live";
        statusBarItem.command = "vish-live-server.stop";

        setTimeout(async () => {
          await open("http://localhost:5000/" + urlPath);
        }, 500);
      } else {
        return vscode.window.showInformationMessage(
          "Vish Live Server is already running.",
        );
      }
    },
  );
  const disposable2 = vscode.commands.registerCommand(
    "vish-live-server.stop",
    function () {
      if (!serverProcess) {
        vscode.window.showInformationMessage("No Live Server is running.");
        return;
      }

      serverProcess.kill();
      statusBarItem.text = "$(broadcast) Go Live";
      statusBarItem.command = "vish-live-server.goLive";
    },
  );

  const previewDisposable = vscode.commands.registerCommand(
    "vish-live-server.preview",
    function () {
      if (!serverProcess) {
        startServer(serverPath, projectPath, statusBarItem);
      } else {
        vscode.window.showInformationMessage(
          "Vish Live Server is running already",
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
        src="http://localhost:5000">
    </iframe>
</body>
</html>
      `;
    },
  );

  context.subscriptions.push(
    disposable,
    disposable2,
    statusBarItem,
    previewDisposable,
  );
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
