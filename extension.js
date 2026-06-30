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
function activate(context) {
  const serverPath = path.join(context.extensionPath, "server.js");
  const projectPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
  let relativePath = null;
  let urlPath = null;
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

      // Display a message box to the user
      vscode.window.showInformationMessage("Starting Vish Live Server...");

      console.log(serverPath);
      console.log(projectPath);
      serverProcess = spawn("node", [serverPath, projectPath]);
      statusBarItem.text = "$(debug-stop) Stop Live";
      statusBarItem.command = "vish-live-server.stop";

      setTimeout(async () => {
        await open("http://localhost:5000/" + urlPath);
      }, 500);
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
  console.log(context.extensionPath);
  console.log(vscode.workspace.workspaceFolders);
  context.subscriptions.push(disposable, disposable2, statusBarItem);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
