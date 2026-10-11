import fs from 'fs';

try {
  const content = fs.readFileSync('extracted-pages/ServiceDetails.js', 'utf8');
  console.log("File length:", content.length);
  console.log("Start of ServiceDetails.js:");
  console.log(content.slice(0, 2000));
  console.log("End of ServiceDetails.js:");
  console.log(content.slice(-2000));
} catch (e) {
  console.error(e);
}
