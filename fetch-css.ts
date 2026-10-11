import fs from 'fs';

async function main() {
  try {
    const cssUrl = 'https://american-founders-replica-2--ekaterinasergey.replit.app/assets/index-Byd-E5_A.css';
    console.log('Fetching CSS...');
    const res = await fetch(cssUrl);
    const cssText = await res.text();
    fs.writeFileSync('replit-style.css', cssText);
    console.log('Saved css, length:', cssText.length);
    
    // Search for colors like gold or cream or navy
    // Navy, Gold and Cream can be represented as hex or rgb values.
    // Let's search if they are defined as tailwind custom colors in the variables block.
    const variables = [];
    const lines = cssText.split('\n');
    
    // Look for lines containing color custom properties
    console.log('Scanning CSS variables...');
    let count = 0;
    for (const line of lines) {
      if (line.includes('--') && (line.includes('#') || line.includes('rgb') || line.includes('hsl'))) {
        variables.push(line.trim());
        count++;
        if (count < 60) {
          console.log(line.trim());
        }
      }
    }
  } catch(e) {
    console.error('Error fetching css', e);
  }
}

main();
