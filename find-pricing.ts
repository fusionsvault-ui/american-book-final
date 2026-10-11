import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

console.log('--- Scanning pricing detail blocks ---');

// Search for keywords like '"Starter"' or '"Professional"' or '"Standard"' or '"Elite"'
// to find where the packages arrays are declared.
const searchKeywords = ['"Starter"', '"Professional"', '"Elite"', '"Standard"'];
for (const kw of searchKeywords) {
  const index = content.indexOf(kw);
  if (index !== -1) {
    console.log(`Keyword ${kw} found at index ${index}`);
    console.log(content.slice(Math.max(0, index - 300), Math.min(content.length, index + 1500)));
    console.log('='.repeat(80));
  }
}
