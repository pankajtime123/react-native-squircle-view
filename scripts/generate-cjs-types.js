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

function copyDtsForCjs(sourceDir, targetDir) {
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
    const targetPath = path.join(targetDir, relativePath);
    
    // Create target subdirectories if needed
    const targetSubdir = path.dirname(targetPath);
    if (!fs.existsSync(targetSubdir)) {
      fs.mkdirSync(targetSubdir, { recursive: true });
    }

    // Read the .d.ts file
    let content = fs.readFileSync(file, 'utf8');
    
    // Keep .js extensions as-is for CommonJS .d.ts files
    // (They reference the .js files which Node treats as CJS due to no "type": "module")
    
    // Write as .d.ts (not .d.cts)
    fs.writeFileSync(targetPath, content, 'utf8');
    console.log(`Generated: ${path.relative(path.join(__dirname, '..'), targetPath)}`);
  });
}

console.log('Generating CommonJS type declarations (.d.ts files)...');
copyDtsForCjs(moduleDir, cjsDir);
console.log('Done!');

// Made with Bob
