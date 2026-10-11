import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const index = content.indexOf('Become A Published Author this year');
if (index !== -1) {
  console.log("Found homepage index around:", index);
  console.log("--- HOMEPAGE COMPONENT ---");
  // Let's print about 20,000 characters from index-3000 to find the whole component
  console.log(content.slice(index - 2000, index + 15000));
} else {
  console.log("homepage header text not found");
}
