console.log("Program Started");

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypt = require("crypto");
const { WebSocketServer } = require("ws");
const PORT = 5000;

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",

  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",

  ".txt": "text/plain",

  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
};
let rootDirectory = process.argv[2] || path.resolve("./public");
fs.watch(rootDirectory, { recursive: true }, (eventType, filename) => {
  console.log(eventType, filename);
  Array.from(wss.clients).forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send("reload");
    }
  });
});

const server = http.createServer(async (req, res) => {
  try {
    const requestUrl = req.url.replace(/^\/+/, "/");
    const url = new URL(requestUrl, `http://${req.headers.host}`);

    const filePath = decodeURIComponent(
      url.pathname === "/" ? "/index.html" : url.pathname,
    );

    let resolvedPath = path.resolve(rootDirectory, "." + filePath);

    const ext = path.extname(resolvedPath);

    if (!resolvedPath.startsWith(rootDirectory + path.sep)) {
      res.statusCode = 403;

      return res.end("Invalid Url");
    }
    // const fileData = await fs.readFile(resolvedPath);
    if (req.url === "/live-reload.js") {
      
      const js = await fs.promises.readFile(
        path.join(__dirname, "live-reload.js"),
      );
 
      res.writeHead(200, {
        "content-type": "application/javascript",
      });
      return res.end(js);
    }
    if (ext === ".html") {
      const html = await fs.promises.readFile(resolvedPath);
      const stringHtml = html.toString();
      const modifiedHtml = stringHtml.replace(
        "</body>",
        "<!-- Code injected by vish-live-server --> <script src ='/live-reload.js'></script></body>",
      );
      res.writeHead(200, {
        "content-type": "text/html",
      });
      return res.end(modifiedHtml);
    }
    if (req.headers.range) {
      const stat = await fs.promises.stat(resolvedPath);

      const fileSize = stat.size;
      const rangeItems = req.headers.range.split("=").slice(-1);

      const startVal = Number(rangeItems[0].split("-")[0]);
      const endVal = rangeItems[0].split("-")[1]
        ? Number(rangeItems[0].split("-")[1])
        : fileSize - 1;

      if (
        Number.isNaN(startVal) ||
        Number.isNaN(endVal) ||
        startVal > endVal ||
        startVal >= fileSize
      ) {
        res.writeHead(416, {
          "Content-Range": `bytes */${fileSize}`,
        });

        return res.end();
      }

      const partialFileStream = fs.createReadStream(resolvedPath, {
        start: startVal,
        end: endVal,
      });
      res.writeHead(206, {
        "content-type": MIME_TYPES[ext] || "application/octet-stream",
        "accept-ranges": "bytes",
        "content-range": `bytes ${startVal}-${endVal}/${fileSize}`,
        "content-length": endVal - startVal + 1,
      });
      partialFileStream.on("error", (err) => {
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end("Internal Server Error");
        } else {
          res.destroy(err);
        }
      });
      partialFileStream.pipe(res);
    } else {
      const fileStream = fs.createReadStream(resolvedPath);
      res.writeHead(200, {
        "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
        "accept-ranges": "bytes",
      });
      fileStream.pipe(res);

      fileStream.on("error", (err) => {
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end("Internal Server Error");
        } else {
          res.destroy(err);
        }
      });
    }
  } catch (err) {
    if (err.code == "ENOENT") {
      res.statusCode = 404;
      return res.end(`<p>${err.message}</p>`);
    } else if (err.code == "EPERM" || err.code == "EACCES") {
      res.statusCode = 403;
      return res.end(`<p>${err.message}</p>`);
    } else {
      res.statusCode = 500;
      return res.end(`<p>${err.message}</p>`);
    }
  }
});

const wss = new WebSocketServer({
  server,
});

wss.on("connection", (socket, request) => {
  console.log("Client connected");

  socket.on("close", () => {
    console.log("Client Disconnected");
  });
});
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
