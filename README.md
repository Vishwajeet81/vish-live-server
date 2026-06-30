# Vish Live Server

A lightweight **VS Code Live Server extension** built completely **from scratch using Node.js** without Express or any existing live server libraries.

This project was created to deeply understand how Live Server works internally—from serving files with the HTTP module to implementing WebSocket-based live reload and integrating everything into a VS Code extension.

---

## ✨ Features

- ⚡ Start a local development server with one click
- 🔄 Live Reload using WebSockets
- 🌐 Automatically opens your default browser
- 📄 Injects the Live Reload client into HTML automatically
- 🖱️ Right-click any HTML file → **Go Live**
- 📌 Status Bar integration (Go Live / Stop Live)
- 🛑 Stop server directly from VS Code
- 📂 Serves the current workspace
- 📁 Supports nested HTML files
- 📺 Supports HTTP Range Requests (video/audio streaming)
- 🔒 Prevents Directory Traversal attacks
- 🎯 Built without Express

---

## 🚀 Demo

> Coming Soon

GIFs and screenshots will be added soon.

---

## 📦 Installation

Install the extension from the Visual Studio Code Marketplace.

Or install manually:

1. Download the `.vsix` package.
2. Open VS Code.
3. Open the Command Palette (`Ctrl + Shift + P`).
4. Select **Extensions: Install from VSIX...**
5. Choose the downloaded `.vsix` file.

---

## 🚀 Usage

### Start the server

- Click **Go Live** from the Status Bar

OR

- Right-click any HTML file in the Explorer
- Select **Go Live**

Your browser will automatically open.

---

### Stop the server

Click **Stop Live** from the Status Bar.

---

## 🏗️ Built From Scratch

Unlike many simple Live Server clones, this project implements the core functionality manually.

### HTTP Server

- Native Node.js HTTP module
- Static file serving
- MIME type detection
- Stream-based file serving

### Live Reload

- WebSocket server
- Automatic HTML injection
- Browser reload on file changes
- File watching using `fs.watch()`

### Performance

- Streams for large files
- HTTP Range Requests
- Efficient file serving

### Security

- Directory Traversal protection
- Safe path resolution
- Restricted file access to workspace

### VS Code Extension

- Status Bar integration
- Explorer Context Menu
- Automatic browser launch
- Child Process management

---

## 📂 Project Structure

```text
.
├── extension.js
├── server.js
├── live-reload.js
├── package.json
├── images/
├── README.md
└── LICENSE
```

---

## 🛠️ Technologies Used

- Node.js
- VS Code Extension API
- HTTP
- WebSocket (`ws`)
- JavaScript

---

## 📌 Current Features

- [x] HTTP Server
- [x] Static File Serving
- [x] Live Reload
- [x] WebSocket Integration
- [x] HTML Injection
- [x] Status Bar
- [x] Explorer Context Menu
- [x] Auto Browser Launch
- [x] Stop Server
- [x] Range Requests
- [x] MIME Types
- [x] Directory Traversal Protection

---

## 🚧 Roadmap

- [ ] Auto Port Detection
- [ ] Custom Port Settings
- [ ] Custom Browser Support
- [ ] Better Error Messages
- [ ] Multiple Workspace Support
- [ ] File Ignore Patterns
- [ ] Marketplace Improvements

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome.

If you find a bug or have an idea for a new feature, feel free to open an issue.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Vishwajeet Bera**

GitHub:
https://github.com/Vishwajeet81

If you found this project useful, consider giving it a ⭐ on GitHub!