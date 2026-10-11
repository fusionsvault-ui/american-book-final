import fs from 'fs';
import path from 'path';

const pagesDir = 'extracted-pages';
const files = fs.readdirSync(pagesDir);

console.log('--- SCANNING PAGE LEVEL COMPONENTS ---');
for (const file of files) {
  if (file === 'Home.js') continue;
  const filePath = path.join(pagesDir, file);
  const code = fs.readFileSync(filePath, 'utf8');
  console.log(`\n================= PAGE: ${file} (Length: ${code.length}) =================`);
  
  // Find strings
  const textStrings = [...code.matchAll(/"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g)]
    .map(m => m[0].replace(/['"]/g, ''))
    .filter(s => s.length > 15 && !s.includes(':') && !s.includes('/') && !s.includes('-') && !s.includes('\\'));

  console.log('Sample content strings:');
  console.log(textStrings.slice(0, 8));

  // Check state and references
  const useStateMatch = code.match(/useState/g);
  console.log(`Uses useState: ${useStateMatch ? useStateMatch.length : 0}`);

  // Print first 800 characters to see imports/renders
  console.log('Code starting block:');
  console.log(code.slice(0, 1000));
}
