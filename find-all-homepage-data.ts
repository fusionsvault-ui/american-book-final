import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

console.log("=== CHECKING CUSTOM ASSET STRINGS ===");
// Let's find all occurrences of webp, png, jpeg, jpg files
const assetRegex = /\/[\w\-]+\.(?:png|jpg|jpeg|webp|svg)/g;
const matches = Array.from(new Set(content.match(assetRegex) || []));
console.log(`Found ${matches.length} matches. Sample elements:`);
console.log(matches.filter(m => !m.includes('node_modules')).slice(0, 100));

// Let's search for "genre" inside the bundle specifically for elements in Genreselections or the genreSection variable names
console.log("\n=== GENRE SECTION SEARCH ===");
let pos = 0;
while (true) {
  pos = content.indexOf('genre', pos);
  if (pos === -1) break;
  // Let's print around 'genre' when it is accompanied by an array or object
  const fragment = content.substring(pos - 100, pos + 400);
  if (fragment.includes('[') || fragment.includes('{') || fragment.includes(':')) {
    console.log(`Match near pos ${pos}:`);
    console.log(fragment);
    console.log("-----------------------");
  }
  pos += 1000; // Skip forward a bit
}

// Let's also look for carousel images or other books
console.log("\n=== BOOK IMAGES SEARCH ===");
const bookKeywords = ['The Silent Witness', 'Golden Hour', 'The Dragon\'s Blade', 'beasts', 'literary'];
for (const kw of bookKeywords) {
  const index = content.indexOf(kw);
  if (index !== -1) {
    console.log(`Keyword "${kw}" found around:`);
    console.log(content.slice(index - 150, index + 400));
  }
}
