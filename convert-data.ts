import fs from 'fs';

async function main() {
  try {
    const jsContent = fs.readFileSync('extracted-services.js', 'utf8');
    
    // In extracted-services.js, the text is: "export const services = [...]"
    // Since it's clean JS, we can parse it, or we can just make sure it's valid TS
    // Let's copy it and add proper typescript types for the services list!
    
    let tsContent = `// Services Catalog Data
export interface ServiceProcessStep {
  step: string;
  desc: string;
}

export interface ServiceExample {
  title: string;
  desc: string;
}

export interface ServiceItem {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  img: string;
  gallery: string[];
  description: string;
  benefits: string[];
  process: ServiceProcessStep[];
  examples: ServiceExample[];
  results: string[];
  faq: Array<{ q: string; a: string }>;
  relatedServices: string[];
}

`;

    // Let's replace the export const services text from the extracted-services.js
    // We want to make sure we clean any minified syntax that might cause issue, though it's usually just clean object literals.
    const arrayStart = jsContent.indexOf('[');
    const arrayEnd = jsContent.lastIndexOf(']') + 1;
    const arrayBody = jsContent.slice(arrayStart, arrayEnd);
    
    tsContent += `export const SERVICES: ServiceItem[] = ${arrayBody};\n`;

    fs.mkdirSync('src/data', { recursive: true });
    fs.writeFileSync('src/data/servicesData.ts', tsContent);
    console.log('Services data successfully written to src/data/servicesData.ts!');
  } catch (err) {
    console.error('Error during catalog conversion:', err);
  }
}

main();
