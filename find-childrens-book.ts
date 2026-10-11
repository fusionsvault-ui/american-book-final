import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const index = content.indexOf('childrens-book-writing');
if (index !== -1) {
  console.log("Found childrens-book-writing at", index);
  // Find surrounding definitions or data representation
  console.log(content.slice(index - 500, index + 3500));
} else {
  console.log("childrens-book-writing not found in bundle");
}
