import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const vars = ['iO', 'sO'];
for (const v of vars) {
  const index = content.indexOf(`const ${v}=`);
  const index2 = content.indexOf(` ${v}=`);
  const finalIdx = index !== -1 ? index : index2;
  if (finalIdx !== -1) {
    console.log(`Found ${v} at index ${finalIdx}`);
    console.log(content.slice(finalIdx - 10, finalIdx + 1100));
  } else {
    console.log(`No ${v} definition found in bundle`);
  }
}
