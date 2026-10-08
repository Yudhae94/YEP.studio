// Generator og-image.png (1200x630) untuk preview sosial media KENZ.STUDIO.
// Dibuat tanpa dependensi eksternal: menulis PNG sungguhan lewat zlib Node.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const W = 1200;
const H = 630;

// ---------------------------------------------------------------- raster core
const px = new Uint8Array(W * H * 4); // RGBA

const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);
const mix = (a, b, t) => a + (b - a) * t;

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 4;
  const sa = a / 255;
  px[i] = clamp(mix(px[i], r, sa));
  px[i + 1] = clamp(mix(px[i + 1], g, sa));
  px[i + 2] = clamp(mix(px[i + 2], b, sa));
  px[i + 3] = 255;
}

const hex = (h) => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

const gradStops = [
  [0.0, hex("#0a1030")],
  [0.55, hex("#071029")],
  [1.0, hex("#000c34")],
];

function bgColor(x, y) {
  // gradasi diagonal lembut
  const t = (x / W) * 0.35 + (y / H) * 0.65;
  let a = gradStops[0];
  let b = gradStops[gradStops.length - 1];
  for (let i = 0; i < gradStops.length - 1; i++) {
    if (t >= gradStops[i][0] && t <= gradStops[i + 1][0]) {
      a = gradStops[i];
      b = gradStops[i + 1];
      break;
    }
  }
  const span = b[0] - a[0] || 1;
  const k = (t - a[0]) / span;
  return [mix(a[1][0], b[1][0], k), mix(a[1][1], b[1][1], k), mix(a[1][2], b[1][2], k)];
}

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const [r, g, b] = bgColor(x, y);
    setPixel(x, y, r, g, b, 255);
  }
}

// --------------------------------------------------------------- glow accents
function radialGlow(cx, cy, radius, color, strength) {
  for (let y = Math.max(0, cy - radius); y < Math.min(H, cy + radius); y++) {
    for (let x = Math.max(0, cx - radius); x < Math.min(W, cx + radius); x++) {
      const d = Math.hypot(x - cx, y - cy) / radius;
      if (d >= 1) continue;
      const falloff = (1 - d) * (1 - d);
      const i = (y * W + x) * 4;
      const a = falloff * strength;
      px[i] = clamp(mix(px[i], color[0], a));
      px[i + 1] = clamp(mix(px[i + 1], color[1], a));
      px[i + 2] = clamp(mix(px[i + 2], color[2], a));
    }
  }
}

radialGlow(170, 120, 520, hex("#ff8a00"), 0.5);   // aura emas kiri-atas
radialGlow(1080, 560, 460, hex("#ffd900"), 0.32);  // aura kuning kanan-bawah
radialGlow(980, 90, 380, hex("#46c7ff"), 0.16);    // aksen biru teknologi

// ------------------------------------------------------------------- grid lines
const grid = hex("#3a4160");
for (let x = 0; x < W; x += 60) {
  for (let y = 0; y < H; y++) {
    const i = (y * W + x) * 4;
    px[i] = clamp(mix(px[i], grid[0], 0.12));
    px[i + 1] = clamp(mix(px[i + 1], grid[1], 0.12));
    px[i + 2] = clamp(mix(px[i + 2], grid[2], 0.12));
  }
}
for (let y = 0; y < H; y += 60) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    px[i] = clamp(mix(px[i], grid[0], 0.1));
    px[i + 1] = clamp(mix(px[i + 1], grid[1], 0.1));
    px[i + 2] = clamp(mix(px[i + 2], grid[2], 0.1));
  }
}

// ----------------------------------------------------------------- gold wordmark
// Wordmark "KENZ.STUDIO" digambar dari bitmap font besar (5x7) yang diskalakan,
// lalu diberi gradasi emas-oranye khas brand.
const FONT = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01110", "10001", "10000", "10111", "10001", "10001", "01110"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "11001", "10101", "10011", "10011", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "11011", "10001"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
  ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
};

function drawText(text, startX, startY, scale, colorFn) {
  let x = startX;
  for (const ch of text) {
    const glyph = FONT[ch] || FONT[" "];
    // gambar dulu, lalu geser berdasarkan lebar glyph yang sebenarnya
    for (let row = 0; row < glyph.length; row++) {
      for (let col = 0; col < glyph[row].length; col++) {
        if (glyph[row][col] !== "1") continue;
        for (let dy = 0; dy < scale; dy++) {
          for (let dx = 0; dx < scale; dx++) {
            const pxx = x + col * scale + dx;
            const pyy = startY + row * scale + dy;
            setPixel(pxx, pyy, ...colorFn(pxx, pyy));
          }
        }
      }
    }
    const tracked = widthOf();
    x += (Math.max(tracked, 2) + 1) * scale;
  }
  return x;
}

// Lebar glyph seragam 5 kolom (kecuali spasi), jadi kelipatan konsisten.
function widthOf() {
  return 5;
}

// hitung lebar blok teks dengan skala tertentu
function textWidth(text, scale) {
  let cols = 0;
  for (let i = 0; i < text.length; i++) cols += Math.max(widthOf(), 2) + 1;
  return (cols - 1) * scale;
}

// gradasi emas: oranye -> kuning -> putih -> kuning -> oranye (seperti --brand-grad)
const goldStops = [
  [0.0, hex("#ff8a00")],
  [0.22, hex("#ffd900")],
  [0.48, hex("#fff7d6")],
  [0.72, hex("#ffd900")],
  [1.0, hex("#ff8a00")],
];
function goldAt(t) {
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  let a = goldStops[0];
  let b = goldStops[goldStops.length - 1];
  for (let i = 0; i < goldStops.length - 1; i++) {
    if (t >= goldStops[i][0] && t <= goldStops[i + 1][0]) {
      a = goldStops[i];
      b = goldStops[i + 1];
      break;
    }
  }
  const span = b[0] - a[0] || 1;
  const k = (t - a[0]) / span;
  return [clamp(mix(a[1][0], b[1][0], k)), clamp(mix(a[1][1], b[1][1], k)), clamp(mix(a[1][2], b[1][2], k)), 255];
}

const MARK = "KENZ.STUDIO";
const markScale = 13;
const markWidth = textWidth(MARK, markScale);
const markX = Math.round((W - markWidth) / 2);
const markY = 235;
drawText(MARK, markX, markY, markScale, (x) => goldAt((x - markX) / markWidth));

// garis aksen bawah wordmark
const underlineY = markY + 7 * markScale + 26;
for (let x = markX; x < markX + markWidth; x++) {
  for (let y = underlineY; y < underlineY + 4; y++) {
    const c = goldAt((x - markX) / markWidth);
    setPixel(x, y, c[0], c[1], c[2], 255);
  }
}

// ---------------------------------------------------------------- text bawah
const TAG = "ALL-IN-ONE DIGITAL STUDIO";
const tagScale = 4;
const tagWidth = textWidth(TAG, tagScale);
const tagX = Math.round((W - tagWidth) / 2);
drawText(TAG, tagX, 440, tagScale, () => [186, 192, 220, 255]);

const SUB = "KARAWANG . JAWA BARAT . INDONESIA";
const subScale = 3;
const subWidth = textWidth(SUB, subScale);
const subX = Math.round((W - subWidth) / 2);
drawText(SUB, subX, 505, subScale, () => [126, 133, 168, 255]);

// bingkai tipis
const frame = hex("#ffd900");
for (let x = 0; x < W; x++) {
  for (const y of [0, 1, H - 2, H - 1]) setPixel(x, y, frame[0], frame[1], frame[2], 130);
}
for (let y = 0; y < H; y++) {
  for (const x of [0, 1, W - 2, W - 1]) setPixel(x, y, frame[0], frame[1], frame[2], 130);
}

// -------------------------------------------------------------- PNG encoder
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcInput = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcInput) >>> 0, 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

const raw = Buffer.alloc((W * 4 + 1) * H);
let p = 0;
for (let y = 0; y < H; y++) {
  raw[p++] = 0; // filter none
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    raw[p++] = px[i];
    raw[p++] = px[i + 1];
    raw[p++] = px[i + 2];
    raw[p++] = px[i + 3];
  }
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 6; // color type RGBA
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

const outPath = path.join(__dirname, "..", "og-image.png");
fs.writeFileSync(outPath, png);
console.log(`Wrote ${outPath} (${W}x${H}, ${(png.length / 1024).toFixed(1)} KB)`);
