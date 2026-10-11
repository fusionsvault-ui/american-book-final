import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const keys = ['mO', 'hO'];
for (const k of keys) {
  const index = content.indexOf(`const ${k}=`);
  const index2 = content.indexOf(` ${k}=`);
  const finalIdx = index !== -1 ? index : index2;
  if (finalIdx !== -1) {
    console.log(`Found ${k} at ${finalIdx}`);
    console.log(content.slice(finalIdx - 10, finalIdx + 1100));
  } else {
    // try looser scan
    const r = new RegExp(`${k}\\s*=\\s*\\[`, 'g');
    const match = r.exec(content);
    if (match) {
      console.log(`Found ${k} loose at ${match.index}`);
      console.log(content.slice(match.index - 50, match.index + 1100));
    } else {
      console.log(`No definition of ${k} found`);
    }
  }
}
