import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

// Let's find arrays by searching of specific properties

// 1. SERVICES
console.log('Finding services declarations...');
// The array of services starts around 'slug:"ghost-writing"'
const serviceStartIdx = content.indexOf('slug:"ghost-writing"');
if (serviceStartIdx !== -1) {
  // Let's find the bracket starting before 'slug:"ghost-writing"'
  const beforeSnippet = content.slice(serviceStartIdx - 300, serviceStartIdx);
  const openBracketIdx = beforeSnippet.lastIndexOf('[');
  const startPos = serviceStartIdx - 300 + openBracketIdx;
  
  // Let's trace matching closing bracket
  let bracketCount = 1;
  let currentPos = startPos + 1;
  while (bracketCount > 0 && currentPos < content.length) {
    if (content[currentPos] === '[') bracketCount++;
    if (content[currentPos] === ']') bracketCount--;
    currentPos++;
  }
  
  const servicesArrayText = content.slice(startPos, currentPos);
  console.log('Successfully extracted services array text! Length:', servicesArrayText.length);
  fs.writeFileSync('extracted-services.js', 'export const services = ' + servicesArrayText);
}

// 2. PRICING PACKAGES
console.log('Finding pricing declarations...');
// Let's search for "Writing Packages" or "Starter" or "Premium"
const pricingIdx = content.indexOf('"Writing Packages"');
if (pricingIdx !== -1) {
  console.log('Context of pricing at:', pricingIdx);
  console.log(content.slice(pricingIdx - 200, pricingIdx + 1000));
}

// Search for other arrays:
const blogIdx = content.indexOf('"How to Write a Bestselling Memoir"');
if (blogIdx !== -1) {
  console.log('\nFound blog index:', blogIdx);
  console.log(content.slice(blogIdx - 200, blogIdx + 2000));
} else {
  // Try another blog keyword
  const blogIdx2 = content.indexOf('blog:[');
  if (blogIdx2 !== -1) {
    console.log('blog:[ found at', blogIdx2);
  }
}

// portfolio
const portfolioIdx = content.indexOf('portfolio:[');
if (portfolioIdx !== -1) {
  console.log('portfolio:[ found at', portfolioIdx);
} else {
  // Let's see if there are portfolio item lists
  const portIdx = content.indexOf('"Business & Entrepreneurship"');
  if (portIdx !== -1) {
    console.log('Portfolio context found at:', portIdx);
    console.log(content.slice(portIdx - 200, portIdx + 1000));
  }
}

// testimonials
const testIdx = content.indexOf('Sarah Johnson');
if (testIdx !== -1) {
  console.log('Testimonials context found at:', testIdx);
  console.log(content.slice(testIdx - 200, testIdx + 1000));
}
