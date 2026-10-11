import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const index = content.indexOf('We Will Work With You To Find Your Voice');
if (index !== -1) {
  console.log("Found voice section around index", index);
  console.log(content.substring(index - 200, index + 3500));
}
