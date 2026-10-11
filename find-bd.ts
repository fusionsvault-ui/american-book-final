import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const key = 'const bD=';
const idx = content.indexOf(key);
if (idx !== -1) {
  console.log('Found bD definition at:', idx);
  console.log(content.slice(idx, idx + 2000));
} else {
  console.log('bD definition not found.');
  const idx2 = content.indexOf('bD=');
  if (idx2 !== -1) {
    console.log(content.slice(idx2 - 100, idx2 + 1000));
  }
}
