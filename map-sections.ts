import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('extracted-sections');
console.log('--- MAPPING EXTRACTED SECTION FUNCTIONS TO DOMAIN ROLES ---');

for (const file of files) {
  const code = fs.readFileSync(path.join('extracted-sections', file), 'utf8');
  
  // Look for text, classes, headings, or tags
  const h2Matches = [...code.matchAll(/children:["']([^"']+)["']/g)].map(m => m[1]);
  const classMatches = [...code.matchAll(/className:["']([^"']+)["']/g)].map(m => m[1]);
  
  // Let's print out what key phrases are present in the component text to identify it
  const textStrings = [...code.matchAll(/"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g)]
    .map(m => m[0].replace(/['"]/g, ''))
    .filter(s => s.length > 5 && !s.includes(':') && !s.includes('/') && !s.includes('-'));

  const shortHeading = textStrings.find(s => s.length > 10 && s.length < 50) || '';
  
  console.log(`\nFile: ${file}`);
  console.log(`- Sample text: "${shortHeading}"`);
  console.log(`- Key headings/words inside:`, textStrings.slice(0, 8));
}
