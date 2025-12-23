const fs = require('fs');
const path = require('path');

// Get the desired file name from the command line arguments
const fileName = process.argv[2];

if (!fileName) {
  console.error('Please provide a file name for the new MDX file.');
  console.log('Usage: node create-mdx.js <file-name>');
  process.exit(1);
}

// Define the paths
const templatePath = path.join(__dirname, 'template.mdx');
const outputPath = path.join(process.cwd(), 'blog/2025', `${fileName}.mdx`);

// Ensure the `docs` directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read the template content
const templateContent = fs.readFileSync(templatePath, 'utf8');

// Write the content to the new file
fs.writeFileSync(outputPath, templateContent, 'utf8');

console.log(`Successfully created a new MDX file at: ${outputPath}`);