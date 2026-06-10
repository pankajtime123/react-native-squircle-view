const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../lib/typescript/module');

function walk(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      files = files.concat(walk(filePath));
    } else {
      files.push(filePath);
    }
  });
  return files;
}

if (fs.existsSync(targetDir)) {
  const files = walk(targetDir).filter((f) => f.endsWith('.d.ts'));
  files.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace relative imports and exports
    const newContent = content.replace(
      /((?:import|export)\s+[\s\S]*?\s+from\s+['"])(\.\.?\/[^'"]+)(['"])/g,
      (match, p1, p2, p3) => {
        // Only append extension/index if it doesn't already have one
        if (!p2.endsWith('.js') && !p2.endsWith('.json') && !p2.match(/\.[a-zA-Z0-9]+$/)) {
          const targetPath = path.resolve(path.dirname(file), p2);
          if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
            return `${p1}${p2}/index.js${p3}`;
          }
          return `${p1}${p2}.js${p3}`;
        }
        return match;
      }
    );

    if (newContent !== content) {
      fs.writeFileSync(file, newContent, 'utf8');
      console.log(`Fixed extensions in: ${path.relative(targetDir, file)}`);
    }
  });
} else {
  console.error(`Directory not found: ${targetDir}`);
}
