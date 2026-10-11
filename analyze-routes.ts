import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

console.log('--- Analyzing routing structures ---');

// Search for react-router paths or route definitions
// e.g. path: "/services/..."
const pathRegex = /path:\s*["']([^"']+)["']/g;
let match;
const paths = new Set<string>();
while ((match = pathRegex.exec(content)) !== null) {
  paths.add(match[1]);
}

console.log('Found path definitions in route objects:', Array.from(paths));

// Let's print sections in the code that define routes
console.log('\nScanning for routing config blocks:');
const routeKeywords = ['createBrowserRouter', 'RouterProvider', 'useRoutes', 'routes ='];
for (const kw of routeKeywords) {
  const index = content.indexOf(kw);
  if (index !== -1) {
    console.log(`Keyword "${kw}" found at ${index}`);
    console.log(content.slice(Math.max(0, index - 200), Math.min(content.length, index + 800)));
    console.log('='.repeat(50));
  }
}

// In case it's a simple path switcher or single component React Router
const exactNavPaths = [
  '/', '/about/our-story', '/about/our-team', '/about/why-choose-us', 
  '/testimonials', '/about/awards', '/contact', 
  '/services/ghost-writing', '/services/book-writing', '/services/memoir-writing',
  '/services/biography-writing', '/services/childrens-book-writing',
  '/services/proofreading', '/services/copy-editing', '/services/developmental-editing',
  '/services/book-formatting', '/services/self-publishing', '/services/ebook-publishing',
  '/services/isbn-copyright', '/services/print-on-demand', '/services/author-website',
  '/services/book-cover-design', '/services/social-media-marketing', '/services/book-trailer',
  '/services/audiobook-production', '/portfolio', '/pricing/writing', '/pricing/editing',
  '/pricing/publishing', '/pricing/marketing', '/pricing/combo', '/blog'
];

console.log('\n--- Checking for page-content blocks in the JS bundle ---');
// Let's search inside the JS for page definitions or titles
const uniqueTitles = [
  'Ghost Writing', 'Memoir Writing', 'Biography Writing', 'Children\'s Book Writing',
  'Proofreading', 'Copy Editing', 'Developmental Editing', 'Book Formatting',
  'Self Publishing', 'eBook Publishing', 'ISBN & Copyright', 'Print-on-Demand',
  'Author Website', 'Book Cover Design', 'Social Media Marketing', 'Book Trailer',
  'Audiobook Production', 'Writing Packages', 'Editing Packages', 'Publishing Packages',
  'Marketing Packages', 'Combo Packages', 'Our Story', 'Our Team', 'Why Choose Us',
  'Awards & Recognition'
];

for (const title of uniqueTitles) {
  const index = content.indexOf(`"${title}"`);
  const index2 = content.indexOf(`'${title}'`);
  const finalIdx = index !== -1 ? index : index2;
  if (finalIdx !== -1) {
    console.log(`Title "${title}" found in code at index ${finalIdx}`);
  } else {
    // Check search case insensitive
    const lowerIdx = content.toLowerCase().indexOf(title.toLowerCase());
    if (lowerIdx !== -1) {
      console.log(`Title "${title}" found in lowercase search at index ${lowerIdx}`);
    } else {
      console.log(`Title "${title}" NOT found`);
    }
  }
}
