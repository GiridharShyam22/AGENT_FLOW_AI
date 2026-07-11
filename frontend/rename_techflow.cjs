const fs = require('fs');
const path = require('path');

const directories = [
  path.join(__dirname, 'src'),
  path.join(__dirname, '..', 'backend'),
  path.join(__dirname, '..', 'data')
];
const filesToCheck = [
  path.join(__dirname, 'index.html'),
  path.join(__dirname, '..', 'README.md')
];

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '__pycache__' && file !== 'venv') {
        processDirectory(fullPath);
      }
    } else if (/\.(js|jsx|css|html|md|py|json)$/.test(fullPath)) {
      replaceInFile(fullPath);
    }
  });
}

function replaceInFile(fullPath) {
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  if (/TechFlow/g.test(content)) {
    content = content.replace(/TechFlow/g, 'AgentFlow');
    changed = true;
  }
  if (/techflow/g.test(content)) {
    content = content.replace(/techflow/g, 'agentflow');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated ${fullPath}`);
  }
}

directories.forEach(processDirectory);
filesToCheck.forEach(replaceInFile);
console.log("Done.");
