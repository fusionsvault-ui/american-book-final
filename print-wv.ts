import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const idx = content.indexOf('function Wv(');
if (idx !== -1) {
  console.log(content.slice(idx, idx + 2000));
} else {
  console.log('not found');
}
