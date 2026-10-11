import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

// Find variable assignments like iO=[...], or around books:iO
const idx = content.indexOf('books:iO');
if (idx !== -1) {
  console.log("Found books:iO in bundle at:", idx);
  console.log(content.slice(idx - 300, idx + 300));
}

// Let's search for "iO" assignment using regex
const regex = /iO\s*=\s*\[/g;
let match = regex.exec(content);
if (match) {
  console.log("Found iO = [ at:", match.index);
  console.log(content.slice(match.index - 50, match.index + 2000));
}

const regex2 = /sO\s*=\s*\[/g;
let match2 = regex2.exec(content);
if (match2) {
  console.log("Found sO = [ at:", match2.index);
  console.log(content.slice(match2.index - 50, match2.index + 2000));
}
