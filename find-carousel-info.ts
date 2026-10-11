import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const index = content.indexOf("Discover The Many Manuscripts From Thriving Publishing Authors");
if (index !== -1) {
  console.log("Found Discover index at:", index);
  // Let's print out the preceding 5000 characters from replit-bundle.js
  // that will contain the definition of p0, iO, sO, etc.
  console.log("--- BEFORE SECTION ---");
  console.log(content.slice(index - 4000, index));
  console.log("--- AFTER SECTION ---");
  console.log(content.slice(index, index + 3000));
} else {
  console.log("Text not found");
}
