import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const publicDir = path.resolve('public');
const assetsDir = path.resolve('public/assets');

console.log('--- Starting Image Compression and WebP Conversion ---');

function convertToWebP(srcPath, destPath, scale = '1200:-1', quality = 80) {
  try {
    const cmd = `ffmpeg -y -i "${srcPath}" -vf "scale=${scale}" -c:v libwebp -quality ${quality} "${destPath}" 2>/dev/null`;
    execSync(cmd);
    const oldSize = fs.statSync(srcPath).size;
    const newSize = fs.statSync(destPath).size;
    console.log(`[WEBP] ${path.basename(srcPath)} (${(oldSize / 1024).toFixed(0)}KB) -> ${path.basename(destPath)} (${(newSize / 1024).toFixed(0)}KB)`);
  } catch (err) {
    console.error(`Failed to convert ${srcPath}:`, err.message);
  }
}

function compressPngInPlace(filePath, maxWidth = 1200) {
  try {
    const tmp = `${filePath}.tmp.png`;
    const cmd = `convert "${filePath}" -resize "${maxWidth}>" -strip -quality 82 "${tmp}" && mv "${tmp}" "${filePath}"`;
    execSync(cmd);
    const newSize = fs.statSync(filePath).size;
    console.log(`[PNG-OPT] ${path.basename(filePath)} optimized to ${(newSize / 1024).toFixed(0)}KB`);
  } catch (err) {
    console.error(`Failed to optimize PNG ${filePath}:`, err.message);
  }
}

// 1. Convert and optimize authors
for (let i = 1; i <= 6; i++) {
  const p = path.join(publicDir, `author-${i}.png`);
  if (fs.existsSync(p)) {
    convertToWebP(p, path.join(publicDir, `author-${i}.webp`), '400:400', 82);
    compressPngInPlace(p, 400);
  }
}

// 2. Convert and optimize background images
const bgFiles = ['bg-hero', 'bg-concerned', 'bg-cta', 'bg-gallery', 'bg-process', 'bg-steps'];
for (const bg of bgFiles) {
  const p = path.join(publicDir, `${bg}.png`);
  if (fs.existsSync(p)) {
    convertToWebP(p, path.join(publicDir, `${bg}.webp`), '1280:-1', 75);
    compressPngInPlace(p, 1280);
  }
}

// 3. Convert assets/*.png
const assetPngs = [
  'writing-desk-CeaHrFGY.png',
  'hero-1-BCRMWL0r.png',
  'hero-2-CMx4LXdS.png',
  'hero-3-DOROJ8Qu.png',
  'beasts-DBDRH50F.png',
  'literary-BrcDpQdZ.png',
  'scifi-u55kilzw.png',
];
for (const a of assetPngs) {
  const p = path.join(assetsDir, a);
  if (fs.existsSync(p)) {
    const webpName = a.replace(/\.png$/, '.webp');
    convertToWebP(p, path.join(assetsDir, webpName), '1000:-1', 78);
    compressPngInPlace(p, 1000);
  }
}

// 4. Convert genre PNGs
const genrePngs = fs.readdirSync(publicDir).filter(f => f.startsWith('genre-') && f.endsWith('.png'));
for (const g of genrePngs) {
  const p = path.join(publicDir, g);
  const webpName = g.replace(/\.png$/, '.webp');
  convertToWebP(p, path.join(publicDir, webpName), '600:-1', 80);
  compressPngInPlace(p, 600);
}

// 5. Convert large JPGs
const jpgs = fs.readdirSync(publicDir).filter(f => f.endsWith('.jpg'));
for (const j of jpgs) {
  const p = path.join(publicDir, j);
  const webpName = j.replace(/\.jpg$/, '.webp');
  convertToWebP(p, path.join(publicDir, webpName), '700:-1', 80);
}

console.log('--- Image Compression Finished ---');
