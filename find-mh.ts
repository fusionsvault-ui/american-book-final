import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

// Find variable definitions for Mh
// Usually, imports are at the top or like: import Mh from "..." or const Mh = "/assets/..."
const regex = /([a-zA-Z0-5_]+)\s*=\s*"\/assets\/[a-zA-Z0-9_-]+\.png"/g;
let match;
while ((match = regex.exec(content)) !== null) {
  if (match[1] === 'Mh' || match[0].includes('beasts')) {
    console.log("Found match:", match[0]);
  }
}

// Let's also search around "const Mh" or similar in the whole file
const index = content.indexOf('Mh=');
if (index !== -1) {
  console.log("Found Mh= at", index);
  console.log(content.slice(index - 100, index + 200));
}

const index2 = content.indexOf(' Mh ');
if (index2 !== -1) {
  console.log("Found Mh space at", index2);
  console.log(content.slice(index2 - 100, index2 + 100));
}

// Search for beasts in the file
const beastsIndex = content.indexOf('beasts');
if (beastsIndex !== -1) {
  console.log("Found beasts in bundle at:", beastsIndex);
  console.log(content.slice(beastsIndex - 200, beastsIndex + 200));
}
