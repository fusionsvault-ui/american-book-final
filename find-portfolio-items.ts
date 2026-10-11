import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

console.log('Searching for portfolio vars in Replit bundle...');

// Find where kO and MO are declared
const kOIdx = content.indexOf('const kO=');
if (kOIdx !== -1) {
  console.log('Found const kO= declaration!');
  console.log(content.slice(kOIdx, kOIdx + 4000));
} else {
  console.log('const kO= not found explicitly.');
  const moIdx = content.indexOf('const MO=');
  if (moIdx !== -1) {
    console.log('Found const MO= declaration:', content.slice(moIdx - 500, moIdx + 1500));
  }
}

// Let's look for book lists.
const bookKeywords = ['"The Innovators Journal"', '"James Carter"', '"Amara Williams"'];
for (const kw of bookKeywords) {
  const idx = content.indexOf(kw);
  if (idx !== -1) {
    console.log(`Keyword "${kw}" found at ${idx}`);
    console.log(content.slice(idx - 100, idx + 800));
    console.log('='.repeat(80));
  }
}
