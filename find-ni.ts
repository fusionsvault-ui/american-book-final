import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const key = 'function ni(';
const idx = content.indexOf(key);
if (idx !== -1) {
  console.log('Found ni definition at:', idx);
  console.log(content.slice(idx, idx + 2500));
} else {
  console.log('ni definition not found in standard form.');
}
