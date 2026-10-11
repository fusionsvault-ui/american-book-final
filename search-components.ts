import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const targetFunctions = [
  { name: 'Home', fn: 'wO' },
  { name: 'About', fn: 'Dr' },
  { name: 'ServicesList', fn: 'AO' },
  { name: 'ServiceDetails', fn: 'CO' },
  { name: 'Portfolio', fn: 'RO' },
  { name: 'Pricing', fn: 'da' },
  { name: 'Blog', fn: 'zO' },
  { name: 'Contact', fn: '_O' },
  { name: 'Testimonials', fn: 'LO' },
  { name: 'NotFound', fn: 'uw' },
  { name: 'HeaderNav', fn: 'fw' },
  { name: 'QuoteModal', fn: 'ni' }
];

fs.mkdirSync('extracted-pages', { recursive: true });

for (const tf of targetFunctions) {
  // Let's search for 'function wO(' or 'function wO{' or 'function wO(' or similar
  const reg = new RegExp(`function\\s+${tf.fn}\\s*\\(`, 'g');
  const match = reg.exec(content);
  if (match) {
    const startIdx = match.index;
    
    // Trace brace matching to find the full function block!
    const funcHeaderEnd = content.indexOf('{', startIdx);
    if (funcHeaderEnd !== -1) {
      let braceCount = 1;
      let pos = funcHeaderEnd + 1;
      while (braceCount > 0 && pos < content.length) {
        if (content[pos] === '{') braceCount++;
        if (content[pos] === '}') braceCount--;
        pos++;
      }
      
      const functionBlock = content.slice(startIdx, pos);
      console.log(`Extracted component ${tf.name} (${tf.fn}). Length: ${functionBlock.length}`);
      fs.writeFileSync(`extracted-pages/${tf.name}.js`, functionBlock);
    }
  } else {
    // Check if it's declared in another format, e.g. "const wO="
    const constReg = new RegExp(`const\\s+${tf.fn}\\s*=`, 'g');
    const constMatch = constReg.exec(content);
    if (constMatch) {
       console.log(`Found ${tf.name} as const starting at: ${constMatch.index}`);
    } else {
       console.log(`Could not find ${tf.name} (${tf.fn}) via regex in bundle.`);
    }
  }
}
