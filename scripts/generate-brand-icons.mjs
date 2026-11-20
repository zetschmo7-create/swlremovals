/**
 * Builds the SWL favicon set from the gold house emblem in the logo.
 * Full wordmark is illegible at tab size — icons are house-on-brand-green only.
 */
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const logoPath = resolve(root, "public/images/sw-london-removals-logo.webp");
const brandGreen = { r: 15, g: 61, b: 46, alpha: 1 }; // #0F3D2E

/** Crop the map+house emblem from the horizontal logo band. */
async function extractEmblem() {
  const { data, info } = await sharp(logoPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width;
  const h = info.height;
  const cols = new Array(w).fill(0);
  let minY = h;
  let maxY = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const a = data[(y * w + x) * 4 + 3];
      if (a > 20) {
        cols[x] += 1;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  let start = -1;
  let end = -1;
  for (let x = 0; x < w; x++) {
    if (cols[x] > 10) {
      start = x;
      break;
    }
  }
  for (let x = start; x < w; x++) {
    let gap = 0;
    for (let k = x; k < w && cols[k] < 5; k++) gap += 1;
    if (gap > 30) {
      end = x - 1;
      break;
    }
  }
  if (start < 0 || end <= start) {
    throw new Error("Could not locate house emblem in logo");
  }

  const left = start;
  const top = minY;
  const width = end - start + 1;
  const height = maxY - minY + 1;

  const { data: emblemData, info: emblemInfo } = await sharp(logoPath)
    .extract({ left, top, width, height })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Logo canvas is black outside the emblem — make that transparent.
  for (let i = 0; i < emblemData.length; i += 4) {
    const r = emblemData[i];
    const g = emblemData[i + 1];
    const b = emblemData[i + 2];
    if (r < 25 && g < 25 && b < 25) emblemData[i + 3] = 0;
  }

  return sharp(emblemData, {
    raw: {
      width: emblemInfo.width,
      height: emblemInfo.height,
      channels: 4,
    },
  }).png();
}

async function iconPng(size, emblemPng, padRatio = 0.12) {
  const pad = Math.round(size * padRatio);
  const inner = Math.max(1, size - pad * 2);
  const resized = await sharp(emblemPng)
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: brandGreen,
    },
  })
    .composite([{ input: resized, gravity: "centre" }])
    .png()
    .toBuffer();
}

function icoFromPngs(pngs) {
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  let offset = 6 + count * 16;
  const entries = pngs.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...pngs.map((item) => item.png)]);
}

async function writePng(relativePath, png) {
  const path = resolve(root, relativePath);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, png);
  const meta = await sharp(png).metadata();
  console.log(relativePath, `${meta.width}x${meta.height}`, png.length);
}

const emblemPng = await (await extractEmblem()).toBuffer();

const icoSizes = [16, 32, 48];
const icoPngs = [];
for (const size of icoSizes) {
  // Slightly tighter padding at the smallest size so the house stays readable.
  const padRatio = size <= 16 ? 0.08 : 0.12;
  icoPngs.push({ size, png: await iconPng(size, emblemPng, padRatio) });
}
const ico = icoFromPngs(icoPngs);
writeFileSync(resolve(root, "src/app/favicon.ico"), ico);
console.log("src/app/favicon.ico", ico.length);

// Also publish under /public so /favicon.ico and touch requests stay consistent.
writeFileSync(resolve(root, "public/favicon.ico"), ico);
console.log("public/favicon.ico", ico.length);

const icon48 = await iconPng(48, emblemPng);
await writePng("src/app/icon.png", icon48);

const apple = await iconPng(180, emblemPng, 0.1);
await writePng("src/app/apple-icon.png", apple);
await writePng("public/apple-touch-icon.png", apple);

const retired = [
  resolve(root, "src/app/icon1.png"),
  resolve(root, "src/app/icon.svg"),
];
for (const path of retired) {
  if (existsSync(path)) {
    unlinkSync(path);
    console.log("removed", path);
  }
}
