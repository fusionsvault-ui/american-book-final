import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const index = content.indexOf('const rO=');
const index2 = content.indexOf(' rO=');
const finalIdx = index !== -1 ? index : index2;
if (finalIdx !== -1) {
  console.log(`Found rO at index ${finalIdx}`);
  console.log(content.slice(finalIdx - 10, finalIdx + 2000));
} else {
  console.log("No rO definition found in bundle");
}
