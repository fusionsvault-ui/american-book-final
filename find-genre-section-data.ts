import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

console.log("=== SCANNING FOR GENRE SECTION WORDS ===");
// Let's search for "every American genre" or "Every Voice Has a Genre"
const matchString = "We Write Across Every American";
const index = content.indexOf(matchString);
if (index !== -1) {
  console.log(`Found "${matchString}" near index`, index);
  console.log(content.slice(index - 1500, index + 3500));
} else {
  console.log(`Could not find "${matchString}" directly.`);
  // What about just searching for "Genre" or "genres"
  const tagPos = content.indexOf("Every Voice Has a Genre");
  if (tagPos !== -1) {
    console.log(`Found "Every Voice Has a Genre" at`, tagPos);
    console.log(content.slice(tagPos - 500, tagPos + 2500));
  }
}
