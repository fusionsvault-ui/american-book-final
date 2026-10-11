import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

// Search for the carousel books jR or alternative variables
const jR_index = content.indexOf('The Silent Witness');
if (jR_index !== -1) {
  console.log("=== FIRST ROW BOOKS ===");
  console.log(content.substring(jR_index - 100, jR_index + 1600));
}

const NR_index = content.indexOf('Midnight in Manhattan');
if (NR_index !== -1) {
  console.log("\n=== SECOND ROW BOOKS ===");
  console.log(content.substring(NR_index - 100, NR_index + 1600));
}
