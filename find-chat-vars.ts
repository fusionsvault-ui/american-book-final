import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const vars = ['un', 'pf', 'xO', 'gs', 'gf'];

console.log('--- FINDING CHAT VARIABLES ---');
for (const v of vars) {
  const match1 = content.search(new RegExp(`const ${v}\\s*=`, 'g'));
  const match2 = content.search(new RegExp(`\\b${v}\\s*=`, 'g'));
  const idx = match1 !== -1 ? match1 : match2;
  
  if (idx !== -1) {
    console.log(`Variable: ${v} found near index ${idx}:`);
    console.log(content.slice(Math.max(0, idx - 50), Math.min(content.length, idx + 800)));
    console.log('='.repeat(80));
  } else {
    console.log(`Variable: ${v} not found.`);
  }
}
