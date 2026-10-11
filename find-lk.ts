import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const key = 'function lk(';
const idx = content.indexOf(key);
if (idx !== -1) {
  console.log('Found lk definition at:', idx);
  console.log(content.slice(idx, idx + 1500));
} else {
  console.log('lk definition not found in standard form.');
  const idx2 = content.indexOf('const lk=');
  if (idx2 !== -1) {
    console.log(content.slice(idx2, idx2 + 1500));
  }
}
