import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

// Let's search for the variable dm. It seems to be an array of services.
// Let's look for definitions around "Ghost Writing" in the javascript to find where it is declared.
const ghostIdx = content.indexOf('"Ghost Writing"');
if (ghostIdx !== -1) {
  console.log('Found "Ghost Writing" at', ghostIdx);
  console.log('Printing surrounding context:');
  console.log(content.slice(Math.max(0, ghostIdx - 200), ghostIdx + 3000));
}

// Let's also look for portfolio data or pricing data. Let's look for "3,400+ books" or similar constants.
const bookPubIdx = content.indexOf('"3,400+ books ghostwritten"');
if (bookPubIdx !== -1) {
  console.log('\nFound key stat at', bookPubIdx);
  console.log(content.slice(Math.max(0, bookPubIdx - 500), bookPubIdx + 1500));
}

// Let's search for the logo / navbar brand
const brandIdx = content.indexOf('American Book Founders');
if (brandIdx !== -1) {
  console.log('\nFound Brand index:', brandIdx);
}
