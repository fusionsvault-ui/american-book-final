import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const idx = content.indexOf('const uA=');
if (idx !== -1) {
  console.log('Found uA at:', idx);
  console.log(content.slice(idx, idx + 400));
} else {
  const idx2 = content.indexOf('uA=');
  if (idx2 !== -1) {
    console.log(content.slice(idx2 - 100, idx2 + 400));
  }
}
