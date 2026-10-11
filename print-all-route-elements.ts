import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const targetIdx = content.indexOf('path:"/about/our-story"');
if (targetIdx !== -1) {
  console.log('--- ROUTER SWITCH BLOCK ---');
  console.log(content.slice(targetIdx - 300, targetIdx + 1500));
} else {
  console.log('Not found');
}
