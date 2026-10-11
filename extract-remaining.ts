import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

console.log('--- SCANNING FOR ADDITIONAL ASSETS ---');

// 1. EXTRACT COMBO PACKAGES
// Let's find "Combo" inside the pricing object "DO" or near it.
const comboIdx = content.indexOf('Combo:');
if (comboIdx !== -1) {
  console.log('Found Combo packages data at:', comboIdx);
  console.log(content.slice(comboIdx, comboIdx + 1200));
} else {
  // Try lowercase search
  const comboIdx2 = content.toLowerCase().indexOf('combo:[');
  if (comboIdx2 !== -1) {
    console.log('Found combo:[ at:', comboIdx2);
    console.log(content.slice(comboIdx2, comboIdx2 + 1000));
  } else {
    // Check if combo is just missing from the main DO object
    console.log('Combo package list not found explicitly in DO. Let\'s print more from DO:');
    const doIdx = content.indexOf('const DO=');
    if (doIdx !== -1) {
      console.log(content.slice(doIdx, doIdx + 4000));
    }
  }
}

// 2. EXTRACT PORTFOLIO ITEMS
// Let's print some text from the portfolio page. Let's find "const mO=" or find what array represents the book portfolio.
// Let's search for "portfolio" or "bestseller" or "biography" in the portfolio component "function da()" or "CO()".
const portIdx = content.indexOf('"portfolio-page"');
if (portIdx !== -1) {
  console.log('\nPortfolio context found around "portfolio-page":');
  console.log(content.slice(portIdx - 500, portIdx + 1500));
}

// Search for the portfolio items array itself!
// Portfolio items usually have properties like title, author, genre, img, description or tags.
// Let's search for "author-1.jpg" or "book-1.png" or "Business Memoir".
const bizMemoirIdx = content.indexOf('"Business Memoir"');
if (bizMemoirIdx !== -1) {
  console.log('\nFound "Business Memoir" index at', bizMemoirIdx);
  console.log(content.slice(bizMemoirIdx - 300, bizMemoirIdx + 1200));
}

// 3. EXTRACT BLOG POSTS
// Blog posts usually have title, excerpt, date, author, image, readTime.
// Let's search for "readTime" or blogger text.
const blogSearchIdx = content.indexOf('readTime');
if (blogSearchIdx !== -1) {
  console.log('\nFound "readTime" context for blogs at', blogSearchIdx);
  console.log(content.slice(blogSearchIdx - 400, blogSearchIdx + 1600));
}
