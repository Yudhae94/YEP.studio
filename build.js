const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const output = path.join(root, "dist");
const files = [
  "index.html",
  "styles.css",
  "script.js",
  "logo-icon.png",
  "logo-lockup.png",
  "logo-wordmark.png",
];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(output, file));
}

console.log(`Built ${files.length} static files into dist/.`);
