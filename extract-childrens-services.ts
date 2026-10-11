import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

// The SERVICES array is compiled as an array of objects. Let's find "childrens-book-writing" and print the whole object around it.
const jsonStartIdx = content.indexOf('slug:"childrens-book-writing"');
if (jsonStartIdx !== -1) {
  console.log("Found childrens-book-writing in bundle!");
  // Search for the boundaries of this object. Let's print about 3000 chars around it.
  console.log(content.slice(jsonStartIdx - 100, jsonStartIdx + 3000));
} else {
  console.log("No childrens-book-writing slug found in bundle");
}
