/* Membuat gambar profil tim (placeholder) dari inisial nama.
   Jalankan: node tools/make-team-avatars.js
   Ganti team-yep.png / team-gilang.png dengan foto asli kapan saja. */

const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const SIZE = 240;
const SS = 3; // supersampling untuk tepi halus
const BIG = SIZE * SS;
const CENTER = BIG / 2;
const RADIUS = BIG / 2 - 2;

const FONT = {
  Y: [
    "10001",
    "10001",
    "01010",
    "00100",
    "00100",
    "00100",
    "00100",
  ],
  E: [
    "11111",
    "10000",
    "10000",
    "11110",
    "10000",
    "10000",
    "11111",
  ],
  P: [
    "11110",
    "10001",
    "10001",
    "11110",
    "10000",
    "10000",
    "10000",
  ],
  G: [
    "01110",
    "10001",
    "10000",
    "10111",
    "10001",
    "10001",
    "01110",
  ],
  I: [
    "111",
    "010",
    "010",
    "010",
    "010",
    "010",
    "111",
  ],
  L: [
    "100",
    "100",
    "100",
    "100",
    "100",
    "100",
    "111",
  ],
  A: [
    "01110",
    "10001",
    "10001",
    "11111",
    "10001",
    "10001",
    "10001",
  ],
  N: [
    "10001",
    "11001",
    "10101",
    "10101",
    "10011",
    "10001",
    "10001",
  ],
};

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

const crc32 = (buffer) => {
  let crc = -1;
  for (let i = 0; i < buffer.length; i += 1) {
    crc = CRC_TABLE[(crc ^ buffer[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ -1) >>> 0;
};

const chunk = (type, data) => {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([length, typeAndData, crc]);
};

const writePng = (filePath, width, height, rgba) => {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);

  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const png = Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);

  fs.writeFileSync(filePath, png);
};

const hexToRgb = (hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

const renderAvatar = (glyphs, [from, to]) => {
  const rgbA = hexToRgb(from);
  const rgbB = hexToRgb(to);

  // susun glyph menjadi peta piksel di tengah kanvas
  const glyphsTotal = glyphs.reduce((total, glyph) => total + glyph.pattern[0].length, 0);
  const gap = 1;
  const cellsWide = glyphsTotal + gap * (glyphs.length - 1);
  const cellsHigh = glyphs[0].pattern.length;
  const cell = Math.floor((BIG * 0.44) / cellsWide);
  const glyphW = cell * cellsWide;
  const glyphH = cell * cellsHigh;
  const startX = CENTER - glyphW / 2;
  const startY = CENTER - glyphH / 2;

  const mask = new Uint8Array(BIG * BIG);
  let cursor = 0;

  glyphs.forEach((glyph, index) => {
    const glyphCellW = glyph.pattern[0].length;
    for (let row = 0; row < glyph.pattern.length; row += 1) {
      for (let col = 0; col < glyphCellW; col += 1) {
        if (glyph.pattern[row][col] !== "1") {
          continue;
        }
        const x0 = Math.round(startX + (cursor + col) * cell);
        const y0 = Math.round(startY + row * cell);
        for (let y = y0; y < y0 + cell; y += 1) {
          for (let x = x0; x < x0 + cell; x += 1) {
            if (x >= 0 && x < BIG && y >= 0 && y < BIG) {
              mask[y * BIG + x] = 1;
            }
          }
        }
      }
    }
    cursor += glyphCellW + (index < glyphs.length - 1 ? gap : 0);
  });

  const rgba = Buffer.alloc(SIZE * SIZE * 4);
  const samples = SS * SS;

  for (let y = 0; y < SIZE; y += 1) {
    for (let x = 0; x < SIZE; x += 1) {
      let inside = 0;
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;

      for (let sy = 0; sy < SS; sy += 1) {
        for (let sx = 0; sx < SS; sx += 1) {
          const bx = x * SS + sx;
          const by = y * SS + sy;
          const dx = bx + 0.5 - CENTER;
          const dy = by + 0.5 - CENTER;

          if (dx * dx + dy * dy > RADIUS * RADIUS) {
            continue;
          }

          inside += 1;

          if (mask[by * BIG + bx]) {
            rSum += 255;
            gSum += 255;
            bSum += 255;
          } else {
            const t = (dy + RADIUS) / (RADIUS * 2);
            rSum += rgbA[0] + (rgbB[0] - rgbA[0]) * t;
            gSum += rgbA[1] + (rgbB[1] - rgbA[1]) * t;
            bSum += rgbA[2] + (rgbB[2] - rgbA[2]) * t;
          }
        }
      }

      const offset = (y * SIZE + x) * 4;
      const count = inside || 1;

      rgba[offset] = Math.round(rSum / count);
      rgba[offset + 1] = Math.round(gSum / count);
      rgba[offset + 2] = Math.round(bSum / count);
      rgba[offset + 3] = Math.round((inside / samples) * 255);
    }
  }

  return rgba;
};

const glyph = (pattern) => ({ pattern });

const outputs = [
  {
    file: "team-yep.png",
    glyphs: [glyph(FONT.Y), glyph(FONT.E), glyph(FONT.P)],
    gradient: ["#ff8a00", "#7c4dff"],
  },
  {
    file: "team-gilang.png",
    glyphs: [glyph(FONT.G), glyph(FONT.I), glyph(FONT.L)],
    gradient: ["#22c3ff", "#0c7b46"],
  },
];

const root = path.join(__dirname, "..");

outputs.forEach(({ file, glyphs, gradient }) => {
  const rgba = renderAvatar(glyphs, gradient);
  writePng(path.join(root, file), SIZE, SIZE, rgba);
  console.log(`Created ${file}`);
});
