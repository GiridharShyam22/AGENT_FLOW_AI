const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = [
  { regex: /#4F8CFF/gi, replacement: '#FFFFFF' }, // Primary blue -> White
  { regex: /#7C5CFF/gi, replacement: '#A0A0A0' }, // Purple -> Light grey
  { regex: /#00D4FF/gi, replacement: '#888888' }, // Cyan -> Grey
  { regex: /#22C55E/gi, replacement: '#FFFFFF' }, // Green -> White
  { regex: /rgba\(\s*79\s*,\s*140\s*,\s*255\s*,/gi, replacement: 'rgba(255, 255, 255,' },
  { regex: /rgba\(\s*124\s*,\s*92\s*,\s*255\s*,/gi, replacement: 'rgba(255, 255, 255,' },
  { regex: /rgba\(\s*0\s*,\s*212\s*,\s*255\s*,/gi, replacement: 'rgba(255, 255, 255,' }
];

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (/\.(css|jsx|js)$/.test(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      replacements.forEach(({ regex, replacement }) => {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          changed = true;
        }
      });

      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  });
}

processDirectory(directoryPath);
console.log("Done.");
