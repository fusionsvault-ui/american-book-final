import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

// Find occurrences of "Concerned About Your" or "Attack of the Beasts"
const idx = content.indexOf('Concerned About');
if (idx !== -1) {
  console.log("Found Concerned About at:", idx);
  console.log(content.slice(idx - 500, idx + 1500));
} else {
  console.log("Concerned About not found");
}
