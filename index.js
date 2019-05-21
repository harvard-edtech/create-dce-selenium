const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import helpers
const print = require('./helpers/print');
const copyTo = require('./helpers/copyTo');
const getPackageJSON = require('./helpers/getPackageJSON');
const writePackageJSON = require('./helpers/writePackageJSON');

/* eslint-disable no-console */

// Prep command executor
const exec = (command) => {
  return execSync(command, { stdio: 'inherit' });
};

const currDir = process.env.PWD;

print.title('Initializing DCE Selenium Testing');

console.log('\nThis\'ll just take a moment.\n');

// Install dependencies
print.subtitle('Installing dependencies...');
exec('npm install --save-dev dce-selenium mocha');
console.log('dependencies installed\n');

// Add selenium script
print.subtitle('Updating test script in package.json')
const newPackageJSON = getPackageJSON();
const scripts = newPackageJSON.scripts || {};
scripts.selenium = 'node ./node_modules/dce-selenium/run';
newPackageJSON.scripts = scripts;
writePackageJSON(newPackageJSON);
console.log('package.json updated\n');

// Create test folder
print.subtitle('Creating test/ folder');
exec('mkdir -p test');
console.log('test/ folder created\n');

// Add eslint rules
print.subtitle('Adding ESLint rules for testing');
copyTo(
  path.join(__dirname, '.eslintrc.json'),
  path.join(currDir, 'test', '.eslintrc.json')
);
console.log('/test/.eslintrc.json file create\n');

// Update .gitignore
print.subtitle('Updating .gitignore');
const gitignoreFilename = path.join(currDir, 'test', '.gitignore');
let gitignore = (
  fs.existsSync(gitignoreFilename)
    ? fs.readFileSync(gitignoreFilename, 'utf-8')
    : ''
);
gitignore += (gitignore.length > 0 ? '\n' : '');
gitignore += '# Ignore snapshots\nsnapshots/';
fs.writeFileSync(gitignoreFilename, gitignore, 'utf-8');
console.log('.gitignore updated');

console.log('\n');

print.title('Done!');

console.log('\nMake sure your code editor is set up to enforce ESLint rules.');
