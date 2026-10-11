import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const index = content.indexOf('function dk(');
if (index !== -1) {
  console.log("Found function dk( at index:", index);
  console.log("--- HOMEPAGE COMPONENT ---");
  console.log(content.slice(index, index + 16000));
} else {
  console.log("function dk( not found");
}
