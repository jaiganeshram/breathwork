const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'Breathing_Exercise.html');
const content = fs.readFileSync(htmlPath, 'utf8');

const regex = /<select id="pattern">([\s\S]*?)<\/select>/;
const selectMatch = content.match(regex);
if (!selectMatch) {
    console.log("No select found");
    process.exit(1);
}

const optMatches = [...selectMatch[1].matchAll(/value="([^"]+)"/g)].map(m => m[1]);
console.log("Total pattern options found in HTML:", optMatches.length);

const scriptCode = fs.readFileSync(path.join(__dirname, 'breathing.js'), 'utf8');

optMatches.forEach(val => {
    // Check if val is handled in getPattern
    const hasBranch = scriptCode.includes(`"${val}"`) || scriptCode.includes(`'${val}'`);
    console.log(`Option: ${val} -> referenced in script: ${hasBranch}`);
});
