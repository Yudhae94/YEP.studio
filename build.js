const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const output = path.join(root, "dist");
const files = [
  "index.html",
  "404.html",
  "styles.css",
  "css/components/menu.css",
  "css/components/buttons.css",
  "script.js",
  "theme-init.js",
  "_headers",
  "logo-icon.png",
  "logo-lockup.png",
  "logo-wordmark.png",
];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const file of files) {
  const destination = path.join(output, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(root, file), destination);
}

console.log(`Built ${files.length} static files into dist/.`);
