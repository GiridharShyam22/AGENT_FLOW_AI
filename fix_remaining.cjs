const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, 'docs', 'PROJECT_ROADMAP.md'),
  path.join(__dirname, 'docs', 'DESIGN_SYSTEM.md'),
  path.join(__dirname, 'QUICKSTART.md'),
  path.join(__dirname, 'example_usage.py'),
  path.join(__dirname, 'run_evaluation.py')
];

files.forEach(fullPath => {
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;
    
    if (/TechFlow/g.test(content) || /Techflow/g.test(content) || /TECHFLOW/g.test(content)) {
      content = content.replace(/TechFlow/g, 'AgentFlow');
      content = content.replace(/Techflow/g, 'AgentFlow');
      content = content.replace(/TECHFLOW/g, 'AGENTFLOW');
      changed = true;
    }
    
    if (changed) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Fixed ${fullPath}`);
    }
  }
});
