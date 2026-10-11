import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const regex = /gO\s*=\s*\[/g;
const match = regex.exec(content);
if (match) {
  console.log("Found gO loose at:", match.index);
  console.log(content.slice(match.index - 50, match.index + 1100));
} else {
  console.log("No gO definition found");
}
