import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const vars = ['Wr', 'sm', 'Qr', 'am', 'uO'];
for (const v of vars) {
  const index = content.indexOf(`const ${v}=`);
  const index2 = content.indexOf(` ${v}=`);
  const finalIdx = index !== -1 ? index : index2;
  if (finalIdx !== -1) {
    console.log(`Found ${v} at index ${finalIdx}`);
    console.log(content.slice(finalIdx - 10, finalIdx + 150));
  } else {
    // Try to find any match for variable definition
    const regex = new RegExp(`\\s+${v}\\s*=\\s*["'][^"']+["']`, 'g');
    const m = regex.exec(content);
    if (m) {
      console.log(`Found regex match for ${v}:`, m[0]);
    } else {
      console.log(`Variable ${v} definition NOT found`);
    }
  }
}
