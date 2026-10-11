import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const key = 'function Hi(';
const idx = content.indexOf(key);
if (idx !== -1) {
  console.log('Found Hi component at:', idx);
  console.log(content.slice(idx, idx + 2000));
} else {
  // Try lowercase or search
  console.log('Hi component not found in standard "function Hi(" format.');
  const idX2 = content.indexOf('Hi=');
  if (idX2 !== -1) {
    console.log(content.slice(idX2, idX2 + 2000));
  }
}
