const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'Breathing_Exercise.html');
const content = fs.readFileSync(htmlPath, 'utf8');

const scriptCode = fs.readFileSync(path.join(__dirname, 'breathing.js'), 'utf8');

const vm = require('vm');
const domMock = {
    window: {},
    document: {
        getElementById: (id) => {
            return {
                value: '4',
                textContent: '',
                innerHTML: '',
                classList: { add: ()=>{}, remove: ()=>{}, toggle: ()=>{} },
                style: { setProperty: ()=>{} },
                addEventListener: ()=>{}
            };
        },
        querySelectorAll: () => [],
        addEventListener: () => {}
    },
    localStorage: { getItem: () => null, setItem: () => {} },
    AudioContext: class { createOscillator(){ return { connect(){}, start(){}, stop(){} }; } createGain(){ return { gain: { setValueAtTime(){}, linearRampToValueAtTime(){}, exponentialRampToValueAtTime(){} }, connect(){} }; } },
    setInterval: () => {},
    clearInterval: () => {},
    requestAnimationFrame: (cb) => cb(),
    console: console
};

const context = vm.createContext(domMock);
vm.runInContext(scriptCode, context);

// Now test each pattern
const selectMatch = content.match(/<select id="pattern">([\s\S]*?)<\/select>/);
const optMatches = [...selectMatch[1].matchAll(/value="([^"]+)"/g)].map(m => m[1]);

let hasError = false;
optMatches.forEach(val => {
    vm.runInContext(`patternSelect.value = "${val}";`, context);
    const phases = vm.runInContext(`getPattern()`, context);
    if (!phases || !phases.length) {
        console.error(`FAILED: ${val} returned empty phases!`);
        hasError = true;
    } else {
        console.log(`PASSED: ${val} -> ${phases.length} phases`);
    }
});

if (!hasError) {
    console.log("\nALL 29 PATTERNS RETURNED VALID PHASES SUCCESSFULLY!");
}
