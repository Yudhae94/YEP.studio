const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const host = "127.0.0.1";
const port = Number(process.env.PORT || 5500);
const files = new Map([
  ["/", "index.html"],
  ["/index.html", "index.html"],
  ["/404.html", "404.html"],
  ["/styles.css", "styles.css"],
  ["/css/components/menu.css", "css/components/menu.css"],
  ["/css/components/buttons.css", "css/components/buttons.css"],
  ["/script.js", "script.js"],
  ["/theme-init.js", "theme-init.js"],
  ["/logo-icon.png", "logo-icon.png"],
  ["/logo-lockup.png", "logo-lockup.png"],
  ["/logo-wordmark.png", "logo-wordmark.png"],
  ["/team-yep.png", "team-yep.png"],
  ["/team-gilang.png", "team-gilang.png"],
]);
const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
};

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid port number between 1 and 65535.");
}

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }

  let pathname;
  try {
    pathname = new URL(request.url, `http://${host}`).pathname;
  } catch {
    response.writeHead(400);
    response.end("Invalid request URL");
    return;
  }

  const file = files.get(pathname);
  if (!file) {
    fs.readFile(path.join(__dirname, "404.html"), (error, content) => {
      if (error) {
        console.error("Could not read 404.html:", error);
        response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Could not read project file");
        return;
      }

      response.writeHead(404, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      response.end(request.method === "HEAD" ? undefined : content);
    });
    return;
  }

  fs.readFile(path.join(__dirname, file), (error, content) => {
    if (error) {
      console.error(`Could not read ${file}:`, error);
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Could not read project file");
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(file)],
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(request.method === "HEAD" ? undefined : content);
  });
});

server.listen(port, host, () => {
  console.log(`KENZ.STUDIO is available at http://localhost:${port}`);
});
