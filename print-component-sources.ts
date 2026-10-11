import fs from 'fs';

const content = fs.readFileSync('replit-bundle.js', 'utf8');

const components = {
  Home: { fn: 'wO()', keyword: 'function wO()' },
  About: { fn: 'Dr()', keyword: 'function Dr()' },
  ServicesList: { fn: 'AO()', keyword: 'function AO()' },
  ServiceDetails: { fn: 'CO()', keyword: 'function CO()' },
  Portfolio: { fn: 'RO()', keyword: 'function RO()' },
  Pricing: { fn: 'da()', keyword: 'function da()' },
  Blog: { fn: 'zO()', keyword: 'function zO()' },
  Contact: { fn: '_O()', keyword: 'function _O()' },
  Testimonials: { fn: 'LO()', keyword: 'function LO()' },
  NotFound: { fn: 'uw()', keyword: 'function uw()' },
  Header: { fn: 'fw()', keyword: 'function fw()' },
  QuoteModal: { fn: 'ni(', keyword: 'function ni(' },
  Footer: { fn: 'Footer', keyword: 'footer' } // We will search context of 'footer' tags
};

console.log('--- EXTRACTING COMPONENT CODE BLOCKS ---');

for (const [name, info] of Object.entries(components)) {
  const index = content.indexOf(info.keyword);
  if (index !== -1) {
    console.log(`\n=================== Component: ${name} (${info.keyword}) ===================`);
    console.log(`Found index: ${index}`);
    // Grab about 12000 characters from index or trace to next function if possible
    // Let's print out the first 2000 chars of each component to analyze its content
    console.log(content.slice(index, index + 3000));
  } else {
    console.log(`\nComponent "${name}" with keyword "${info.keyword}" NOT found. Checking direct alias...`);
    // Try without function e.g. "const "+fn
    const aliasKeyword = `const ${info.fn}`;
    const aliasIndex = content.indexOf(aliasKeyword);
    if (aliasIndex !== -1) {
      console.log(`Found alias index: ${aliasIndex}`);
      console.log(content.slice(aliasIndex, aliasIndex + 3000));
    }
  }
}
