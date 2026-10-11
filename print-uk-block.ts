import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const key = 'const uk=';
const idx = content.indexOf(key);
if (idx !== -1) {
  console.log('Found "const uk=" at:', idx);
  console.log(content.slice(idx, idx + 1000));
} else {
  // Try lowercase or search
  console.log('uk definition not found in standard const uk= format. Searching "uk="...');
  const idx2 = content.indexOf('uk=');
  if (idx2 !== -1) {
    console.log(content.slice(idx2 - 100, idx2 + 1000));
  }
}
