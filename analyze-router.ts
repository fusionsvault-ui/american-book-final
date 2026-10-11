import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

// Search for routing configurations
// Look for route path mappings in the file
// Find where "/about/our-story" is mentioned in a small snippet
const index = content.indexOf('"/about/our-story"');
if (index !== -1) {
  console.log('Context of "/about/our-story":');
  console.log(content.slice(Math.max(0, index - 400), Math.min(content.length, index + 2000)));
} else {
  console.log('"/about/our-story" not found in quotes');
}

// Search for dynamic services
const idxServices = content.indexOf('"/services/:slug"');
if (idxServices !== -1) {
  console.log('\nContext of "/services/:slug":');
  console.log(content.slice(Math.max(0, idxServices - 400), Math.min(content.length, idxServices + 1500)));
}
