import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const key = 'const vh=';
const idx = content.indexOf(key);
if (idx !== -1) {
  console.log('Found vh definition:', content.slice(idx, idx + 400));
} else {
  const idx2 = content.indexOf('vh=');
  if (idx2 !== -1) {
    console.log(content.slice(idx2 - 100, idx2 + 1000));
  }
}
