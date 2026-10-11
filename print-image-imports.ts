import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const imageVars = ['Wr', 'sm', 'Qr', 'Mh', 'am', 'iS'];

console.log('--- FINDING IMAGE ASSET URIs ---');
for (const iv of imageVars) {
  // Let's search inside the bundle for "const iv =" or "iv="
  const match1 = content.indexOf(`const ${iv}=`);
  const match2 = content.indexOf(`${iv}=`);
  const match3 = content.indexOf(`${iv}="`);
  
  console.log(`Variable: ${iv}`);
  if (match3 !== -1) {
    console.log(content.slice(match3, match3 + 100));
  } else if (match1 !== -1) {
    console.log(content.slice(match1, match1 + 100));
  } else if (match2 !== -1) {
    console.log(content.slice(match2, match2 + 100));
  } else {
    // General lookup
    const reg = new RegExp(`\\b${iv}\\s*=`, 'g');
    const m = reg.exec(content);
    if (m) {
      console.log('Regex found at:', m.index);
      console.log(content.slice(m.index, m.index + 100));
    } else {
      console.log('Not found');
    }
  }
}
