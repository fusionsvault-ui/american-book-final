import fs from 'fs';

console.log("=== vD.js ===");
try {
  console.log(fs.readFileSync('extracted-sections/vD.js', 'utf8'));
} catch (e) {
  console.error(e);
}

console.log("=== fO.js ===");
try {
  console.log(fs.readFileSync('extracted-sections/fO.js', 'utf8'));
} catch (e) {
  console.error(e);
}
