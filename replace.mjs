import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .replace(/Band 7/g, 'Band 9')
    .replace(/band 7/g, 'band 9')
    .replace(/Band 6 towards Band 9/g, 'Band 7 towards Band 9')
    .replace(/Band 6 to Band 9/g, 'Band 7 to Band 9')
    .replace(/Band 6/g, 'Band 7.5'); // just in case

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedCount++;
    console.log('Updated: ' + file);
  }
});

console.log(`Replaced text in ${changedCount} files.`);
