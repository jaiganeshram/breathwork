const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("=== Testing PranaVeda Master MDI Portal ===");

// 1. Check index.html exists and contains necessary IDs
const indexPath = path.join(__dirname, '..', 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');

const requiredIds = [
    'particlesCanvas',
    'realtimeClock',
    'muhurtaName',
    'heroGreeting',
    'statStreak',
    'statMinutes',
    'statSessions',
    'statFavs',
    'statVitality',
    'verseSanskrit',
    'nextVerseBtn',
    'quickBreathSection',
    'quickBreathBtn',
    'quickBreathOrb',
    'quickPhaseTimer',
    'quickPhaseName',
    'quickCyclesCount',
    'quickTotalTimer',
    'soundSanctuarySection',
    'chakraGrid',
    'omDroneToggle',
    'pinkNoiseToggle',
    'stopAllAudioBtn',
    'nowPlayingAudio',
    'routinesSection',
    'routinesGrid',
    'routineModal',
    'routineModalCloseBtn',
    'routineModalPlayBtn',
    'routineModalNextBtn',
    'routineModalPrevBtn',
    'asanaGalleryContainer',
    'mdiWorkspaceContainer',
    'mdiTabPranayama',
    'mdiTabAsanas',
    'mdiSplitViewBtn',
    'mdiIframePrimary',
    'mdiIframeSecondary',
    'journalTableBody',
    'themeToggleBtn'
];

let missingIds = [];
requiredIds.forEach(id => {
    if (!indexHtml.includes(`id="${id}"`)) {
        missingIds.push(id);
    }
});

if (missingIds.length > 0) {
    console.error("❌ Missing IDs in index.html:", missingIds);
} else {
    console.log("✅ All 39 core interactive IDs verified in index.html");
}

// 2. Test js/mdi.js syntax with VM
const mdiScript = fs.readFileSync(path.join(__dirname, 'mdi.js'), 'utf8');

const mockWindow = {
    AudioContext: class {
        createOscillator() { return { type: '', frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; }
        createGain() { return { gain: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, value: 0.5 }, connect: () => {} }; }
        createBuffer() { return { getChannelData: () => new Float32Array(100) }; }
        createBufferSource() { return { buffer: null, loop: false, connect: () => {}, start: () => {}, stop: () => {} }; }
        createBiquadFilter() { return { type: '', frequency: { setValueAtTime: () => {} }, connect: () => {} }; }
        get currentTime() { return 0; }
        get destination() { return {}; }
        get state() { return 'running'; }
        get sampleRate() { return 44100; }
        resume() { return Promise.resolve(); }
    },
    webkitAudioContext: null,
    innerWidth: 1920,
    innerHeight: 1080,
    addEventListener: () => {},
    scrollTo: () => {},
    open: () => {},
    PranaMDI: {}
};

const mockElements = {};
function getOrCreateMockElement(id) {
    if (!mockElements[id]) {
        mockElements[id] = {
            id,
            innerHTML: '',
            textContent: '',
            value: '1',
            checked: false,
            src: '',
            style: {},
            classList: {
                add: () => {},
                remove: () => {},
                contains: () => false,
                toggle: () => {}
            },
            addEventListener: () => {},
            querySelectorAll: () => [],
            querySelector: () => null,
            getContext: () => ({
                clearRect: () => {},
                beginPath: () => {},
                arc: () => {},
                fill: () => {}
            }),
            offsetTop: 100
        };
    }
    return mockElements[id];
}

const mockDocument = {
    body: {
        classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
        appendChild: () => {}
    },
    getElementById: (id) => getOrCreateMockElement(id),
    querySelectorAll: (sel) => [],
    querySelector: (sel) => null,
    createElement: (tag) => getOrCreateMockElement(tag),
    addEventListener: () => {}
};

const mockStorage = {
    store: {},
    getItem: (k) => mockStorage.store[k] || null,
    setItem: (k, v) => { mockStorage.store[k] = v; },
    removeItem: (k) => { delete mockStorage.store[k]; }
};

const context = vm.createContext({
    window: mockWindow,
    document: mockDocument,
    localStorage: mockStorage,
    console,
    setTimeout: (fn) => fn(),
    clearTimeout: () => {},
    setInterval: () => 1,
    clearInterval: () => {},
    Math,
    parseInt,
    parseFloat,
    Date,
    JSON,
    requestAnimationFrame: () => {},
    Set,
    Array
});

try {
    vm.runInContext(mdiScript, context);
    console.log("✅ js/mdi.js loaded and executed cleanly with zero syntax/runtime errors!");
} catch (e) {
    console.error("❌ Error executing mdi.js:", e);
}
