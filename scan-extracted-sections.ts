import fs from 'fs';
import path from 'path';

const dir = 'extracted-sections';
const files = fs.readdirSync(dir);

for (const file of files) {
  if (file.endsWith('.js')) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`--- ${file} (first 400 chars) ---`);
    console.log(content.slice(0, 400));
  }
}
