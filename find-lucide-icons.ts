import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

// Icons are usually imported from 'lucide-react' compiled as something or defined
// Let's search inside the bundle for "yh=" or similar definition of these icons
const iconsToFind = ['yh', 'Pt', 'Wv', 'AA', 'yc'];

console.log('--- FINDING ICON DEFINITIONS ---');

for (const icon of iconsToFind) {
  const definitions = [
    `const ${icon}=`,
    `${icon}=`,
    `function ${icon}(`
  ];
  
  let found = false;
  for (const def of definitions) {
    const idx = content.indexOf(def);
    if (idx !== -1) {
      console.log(`Matched def "${def}" for icon "${icon}" at index ${idx}:`);
      console.log(content.slice(idx, idx + 400));
      found = true;
      break;
    }
  }
  
  if (!found) {
    // Search general instances of icon var as a variable in assignment
    const reg = new RegExp(`\\b${icon}\\s*=`, 'g');
    const match = reg.exec(content);
    if (match) {
      console.log(`Matched general pattern for "${icon}" at index ${match.index}:`);
      console.log(content.slice(match.index, match.index + 400));
    } else {
      console.log(`Icon "${icon}" not found in standard assignments.`);
    }
  }
}
