import fs from 'fs';

// Let's analyze the replit-bundle.js
const content = fs.readFileSync('replit-bundle.js', 'utf8');

console.log('Finding prominent texts in JS...');

// Look for JSX components and patterns
// Let's search for certain segments of text to understand the layout
const searchTerms = [
  'America\'s #1',
  'ghostwriting',
  'royalties',
  'packages',
  'pricing',
  'testimonial',
  'FAQ',
  'contact',
  'publishing',
  'Cover Design',
  'satisfaction',
  'American Book Founders'
];

console.log('\n--- TERM SEARCH DETAILS ---');
for (const term of searchTerms) {
  const index = content.indexOf(term);
  if (index !== -1) {
    console.log(`Term "${term}" found at index ${index}`);
    // Print around the occurrence
    const start = Math.max(0, index - 300);
    const end = Math.min(content.length, index + 500);
    console.log(`Context around "${term}":`);
    console.log(content.slice(start, end));
    console.log('-'.repeat(50));
  } else {
    console.log(`Term "${term}" not found.`);
  }
}

// Let's scan for standard routes, page links, or sections if there's router info
console.log('Scanning for route elements or main components...');
const navTerms = ['Home', 'About', 'Services', 'Pricing', 'Contact', 'Portfolio'];
for (const nav of navTerms) {
  const matches = [...content.matchAll(new RegExp(`"${nav}"|'${nav}'`, 'g'))];
  if (matches.length > 0) {
    console.log(`Navigation term "${nav}" matches: ${matches.length}`);
  }
}
