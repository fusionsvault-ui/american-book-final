import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const keys = ["Control Your Work, Share Your Voice", "Control Your Work", "Become a Published Author", "Become A Published Author", "Keep 100% Royalties", "Tired of surrendering publishing rights"];
for (const k of keys) {
  const index = content.toLowerCase().indexOf(k.toLowerCase());
  if (index !== -1) {
    console.log(`Found "${k}" at index:`, index);
    console.log("Surrounding code:");
    console.log(content.slice(Math.max(0, index - 500), index + 1500));
    break;
  }
}
