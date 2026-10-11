import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

console.log('--- SCANNING ROUTE PATH COMPONENTS ---');

const paths = [
  '/',                    '/about',
  '/about/our-story',     '/about/our-team',
  '/about/why-choose-us', '/about/awards',
  '/services',            '/services/:slug',
  '/portfolio',           '/pricing',
  '/pricing/writing',     '/pricing/editing',
  '/pricing/publishing',  '/pricing/marketing',
  '/pricing/combo',       '/blog',
  '/contact',             '/testimonials'
];

for (const path of paths) {
  const index = content.indexOf(`path:"${path}"`);
  const index2 = content.indexOf(`path: "${path}"`);
  const finalIdx = index !== -1 ? index : index2;
  
  if (finalIdx !== -1) {
    console.log(`Path "${path}" found in route list at index ${finalIdx}`);
    console.log(content.slice(Math.max(0, finalIdx - 100), Math.min(content.length, finalIdx + 500)));
    console.log('-'.repeat(60));
  } else {
    // Let's do a search for just the path string in route-like context
    console.log(`Path "${path}" not found in explicit "path: 'url'" form. Searching general...`);
  }
}
