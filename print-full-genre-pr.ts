import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

// Find PR defined near index 461000
const index = content.indexOf('We Write Across Every American Genre');
if (index !== -1) {
  // Let's print the preceding text where PR is defined
  console.log(content.substring(index - 2000, index));
} else {
  console.log("Not found.");
}
