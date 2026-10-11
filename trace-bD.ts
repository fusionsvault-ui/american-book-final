import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const index = content.indexOf('const bD=');
const index2 = content.indexOf(' bD=');
const finalIdx = index !== -1 ? index : index2;
if (finalIdx !== -1) {
  console.log(`Found bD at index ${finalIdx}`);
  console.log(content.slice(finalIdx - 10, finalIdx + 1100));
} else {
  console.log("No bD definition found in bundle");
}
