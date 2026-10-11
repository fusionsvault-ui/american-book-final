import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const subFns = ['dw', 'dk', 'vD', 'xD', 'wD', 'SD', 'aO', 'oO', 'lO', 'cO', 'fO', 'pO', 'yO', 'vO', 'aS', 'rS', 'oS'];

fs.mkdirSync('extracted-sections', { recursive: true });

for (const fn of subFns) {
  const reg = new RegExp(`function\\s+${fn}\\s*\\(`, 'g');
  const match = reg.exec(content);
  if (match) {
    const startIdx = match.index;
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
      console.log(`Extracted section function ${fn}. Length: ${functionBlock.length}`);
      fs.writeFileSync(`extracted-sections/${fn}.js`, functionBlock);
    }
  } else {
    // Try as a variable or other formats
    console.log(`Failed to find section function: ${fn}`);
  }
}
