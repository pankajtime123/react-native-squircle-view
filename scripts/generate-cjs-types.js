const fs = require('fs');
const path = require('path');

const moduleDir = path.join(__dirname, '../lib/typescript/module');
const cjsDir = path.join(__dirname, '../lib/typescript/commonjs');

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

function copyDtsAsDcts(sourceDir, targetDir) {
  if (!fs.existsSync(sourceDir)) {
    console.error(`Source directory not found: ${sourceDir}`);
    return;
  }

  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const files = walk(sourceDir).filter((f) => f.endsWith('.d.ts'));
  
  files.forEach((file) => {
    const relativePath = path.relative(sourceDir, file);
    const targetPath = path.join(targetDir, relativePath.replace(/\.d\.ts$/, '.d.cts'));
    
    // Create target subdirectories if needed
    const targetSubdir = path.dirname(targetPath);
    if (!fs.existsSync(targetSubdir)) {
      fs.mkdirSync(targetSubdir, { recursive: true });
    }

    // Read the .d.ts file
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace .js extensions with .cjs in import/export statements
    content = content.replace(
      /((?:import|export)\s+[\s\S]*?\s+from\s+['"])(\.\.?\/[^'"]+\.js)(['"])/g,
      (match, p1, p2, p3) => {
        return `${p1}${p2.replace(/\.js$/, '.cjs')}${p3}`;
      }
    );
    
    // Write as .d.cts
    fs.writeFileSync(targetPath, content, 'utf8');
    console.log(`Generated: ${path.relative(path.join(__dirname, '..'), targetPath)}`);
  });
}

console.log('Generating CommonJS type declarations (.d.cts files)...');
copyDtsAsDcts(moduleDir, cjsDir);
console.log('Done!');

// Made with Bob
