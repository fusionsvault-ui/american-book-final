import fs from 'fs';

async function fetchAssets() {
  try {
    console.log('Fetching JS bundle...');
    const jsUrl = 'https://american-book-founderszip--devwork65.replit.app/assets/index-DF5lKMCe.js';
    const jsResponse = await fetch(jsUrl);
    const jsText = await jsResponse.text();
    
    // Write JS to a file for analysis
    fs.writeFileSync('replit-bundle.js', jsText);
    console.log('JS bundle saved to replit-bundle.js. Length:', jsText.length);

    console.log('Fetching CSS bundle...');
    const cssUrl = 'https://american-book-founderszip--devwork65.replit.app/assets/index-CjPfD4df.css';
    const cssResponse = await fetch(cssUrl);
    const cssText = await cssResponse.text();
    fs.writeFileSync('replit-style.css', cssText);
    console.log('CSS bundle saved to replit-style.css. Length:', cssText.length);
  } catch (error) {
    console.error('Error fetching assets:', error);
  }
}

fetchAssets();
