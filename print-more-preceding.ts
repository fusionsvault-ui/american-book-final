import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const index = content.indexOf('We Write Across Every American Genre');
if (index !== -1) {
  // Let's print 4000 characters before the heading to capture the entire array
  console.log(content.substring(index - 2500, index));
}
