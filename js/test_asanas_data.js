const fs = require('fs');
const path = require('path');
const vm = require('vm');

const scriptContent = fs.readFileSync(path.join(__dirname, 'asanas.js'), 'utf8');

const window = {
    AudioContext: class {
        createOscillator() { return { type: '', frequency: { setValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
        createGain() { return { gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} }; }
        get currentTime() { return 0; }
        get destination() { return {}; }
        get state() { return 'running'; }
        resume() { return Promise.resolve(); }
    },
    webkitAudioContext: null,
    location: { href: '' }
};
const document = {
    body: { classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} } },
    getElementById: (id) => ({ innerHTML: '', textContent: '', classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} }, style: {}, addEventListener: () => {} }),
    querySelectorAll: () => []
};
const localStorage = { getItem: () => null, setItem: () => {} };
const context = vm.createContext({ window, document, localStorage, console, setTimeout, clearTimeout, setInterval, clearInterval, Math, parseInt, JSON });

const wrapped = scriptContent + '\n;({ ASANAS, ROUTINES, SURYA_STEPS });';
const result = vm.runInContext(wrapped, context);

console.log('Total ASANAS loaded:', result.ASANAS.length);

for (const key of Object.keys(result.ROUTINES)) {
    const routine = result.ROUTINES[key];
    console.log('\n=== Routine:', routine.title, `(${routine.meta}) ===`);
    routine.poses.forEach((p, i) => {
        const asana = result.ASANAS.find(a => a.id === p.id);
        if (!asana) {
            console.error('  ERROR: Asana not found for pose ID:', p.id);
        } else {
            console.log(`  Pose ${i+1}: ${asana.sanskrit} (${asana.english}) -> ${asana.image ? '📸 ' + asana.image : '📐 Dedicated SVG Geometry'}`);
        }
    });
}
