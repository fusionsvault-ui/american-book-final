import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const comboIdx = content.indexOf('"/pricing/combo"');
if (comboIdx !== -1) {
  console.log('Combo route string found at:', comboIdx);
  console.log(content.slice(comboIdx - 500, comboIdx + 1500));
} else {
  console.log('No direct "/pricing/combo" route found');
}
