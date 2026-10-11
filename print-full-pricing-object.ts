import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const doIdx = content.indexOf('const DO={');
if (doIdx !== -1) {
  // Let's print 5000 characters from constraints
  console.log('--- ENTIRE DO OBJECT ---');
  console.log(content.slice(doIdx, doIdx + 5000));
} else {
  console.log('"const DO={" not found. Searching "DO={"...');
  const doIdx2 = content.indexOf('DO={');
  if (doIdx2 !== -1) {
    console.log(content.slice(doIdx2, doIdx2 + 5000));
  }
}
