const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.join(__dirname, '..', 'index.html');
const scriptCode = fs.readFileSync(path.join(__dirname, 'breathing.js'), 'utf8');

// Set up dates
const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

const yest = new Date(now);
yest.setDate(yest.getDate() - 1);
const yesterdayStr = `${yest.getFullYear()}-${pad(yest.getMonth() + 1)}-${pad(yest.getDate())}`;

const twoDaysAgo = new Date(now);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const twoDaysAgoStr = `${twoDaysAgo.getFullYear()}-${pad(twoDaysAgo.getMonth() + 1)}-${pad(twoDaysAgo.getDate())}`;

const mockSessions = [
    { date: `${todayStr}T10:00:00.000Z`, duration: 5, pattern: 'box', rating: 5, mindWanders: 0 },
    { date: `${yesterdayStr}T14:30:00.000Z`, duration: 10, pattern: '4-7-8', rating: 4, mindWanders: 1 },
    { date: `${twoDaysAgoStr}T09:15:00.000Z`, duration: 15, pattern: 'anulom', rating: 5, mindWanders: 2 }
];

const elements = {};
function getOrCreateElem(id) {
    if (!elements[id]) {
        elements[id] = {
            id,
            value: '',
            textContent: '',
            innerHTML: '',
            classList: {
                classes: new Set(),
                add(c) { this.classes.add(c); },
                remove(c) { this.classes.delete(c); },
                toggle(c, force) {
                    if (force !== undefined) {
                        if (force) this.classes.add(c);
                        else this.classes.delete(c);
                        return force;
                    }
                    if (this.classes.has(c)) { this.classes.delete(c); return false; }
                    this.classes.add(c); return true;
                },
                contains(c) { return this.classes.has(c); }
            },
            style: { display: '', setProperty() {} },
            addEventListener(evt, fn) { this[`on_${evt}`] = fn; }
        };
    }
    return elements[id];
}

const domMock = {
    window: {},
    document: {
        getElementById: (id) => getOrCreateElem(id),
        querySelectorAll: () => [],
        addEventListener: () => {}
    },
    localStorage: {
        store: {
            breathingSessions: JSON.stringify(mockSessions),
            pranaveda_allow_delete: 'off'
        },
        getItem(k) { return this.store[k] || null; },
        setItem(k, v) { this.store[k] = String(v); },
        removeItem(k) { delete this.store[k]; }
    },
    AudioContext: class {
        createOscillator() { return { connect() {}, start() {}, stop() {} }; }
        createGain() { return { gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
    },
    setInterval: () => {},
    clearInterval: () => {},
    requestAnimationFrame: (cb) => cb(),
    console: console,
    confirm: () => true
};

const context = vm.createContext(domMock);
vm.runInContext(scriptCode, context);

console.log('=== TEST 1: Initial loadStats rendering ===');
const historyHtml = elements['history'].innerHTML;

// Check that dateGroup for today does NOT have collapsed class in HTML
const todayRegex = new RegExp(`id="dateGroup-${todayStr}"[^>]*class="([^"]*)"`);
const yestRegex = new RegExp(`id="dateGroup-${yesterdayStr}"[^>]*class="([^"]*)"`);
const twoDaysRegex = new RegExp(`id="dateGroup-${twoDaysAgoStr}"[^>]*class="([^"]*)"`);

const todayMatch = historyHtml.match(new RegExp(`class="([^"]*)"\\s+id="dateGroup-${todayStr}"`)) || historyHtml.match(todayRegex);
const yestMatch = historyHtml.match(new RegExp(`class="([^"]*)"\\s+id="dateGroup-${yesterdayStr}"`)) || historyHtml.match(yestRegex);
const twoDaysMatch = historyHtml.match(new RegExp(`class="([^"]*)"\\s+id="dateGroup-${twoDaysAgoStr}"`)) || historyHtml.match(twoDaysRegex);

console.log(`Today (${todayStr}) class: "${todayMatch ? todayMatch[1] : 'NOT FOUND'}"`);
console.log(`Yesterday (${yesterdayStr}) class: "${yestMatch ? yestMatch[1] : 'NOT FOUND'}"`);
console.log(`Two days ago (${twoDaysAgoStr}) class: "${twoDaysMatch ? twoDaysMatch[1] : 'NOT FOUND'}"`);

if (todayMatch && !todayMatch[1].includes('collapsed')) {
    console.log('✅ PASS: Today is OPEN (not collapsed) by default.');
} else {
    console.error('❌ FAIL: Today should not be collapsed.');
    process.exit(1);
}

if (yestMatch && yestMatch[1].includes('collapsed')) {
    console.log('✅ PASS: Yesterday is COLLAPSED by default.');
} else {
    console.error('❌ FAIL: Yesterday should be collapsed.');
    process.exit(1);
}

if (twoDaysMatch && twoDaysMatch[1].includes('collapsed')) {
    console.log('✅ PASS: Two days ago is COLLAPSED by default.');
} else {
    console.error('❌ FAIL: Two days ago should be collapsed.');
    process.exit(1);
}

console.log(`Toggle All button text: "${elements['toggleAllGroupsBtn'].innerHTML}"`);
if (elements['toggleAllGroupsBtn'].innerHTML.includes('Expand All')) {
    console.log('✅ PASS: Toggle All button shows "Expand All" because past days are collapsed.');
} else {
    console.error('❌ FAIL: Toggle All button should offer "Expand All".');
    process.exit(1);
}

console.log('\n=== TEST 2: User manually toggles Yesterday to open it ===');
// Register dateGroup elements in mock so classList toggle can be checked
getOrCreateElem(`dateGroup-${yesterdayStr}`).classList.add('collapsed');
getOrCreateElem(`dateGroup-${twoDaysAgoStr}`).classList.add('collapsed');

vm.runInContext(`window.toggleDateGroup('${yesterdayStr}')`, context);
const yestElem = getOrCreateElem(`dateGroup-${yesterdayStr}`);
if (!yestElem.classList.contains('collapsed')) {
    console.log('✅ PASS: Yesterday is now OPEN after user toggled it.');
} else {
    console.error('❌ FAIL: Yesterday should be uncollapsed after toggle.');
    process.exit(1);
}

console.log('\n=== TEST 3: loadStats re-run preserves user opened Yesterday ===');
vm.runInContext(`loadStats()`, context);
const reHistoryHtml = elements['history'].innerHTML;
const reYestMatch = reHistoryHtml.match(new RegExp(`class="([^"]*)"\\s+id="dateGroup-${yesterdayStr}"`));
if (reYestMatch && !reYestMatch[1].includes('collapsed')) {
    console.log('✅ PASS: Yesterday remains OPEN after loadStats re-run.');
} else {
    console.error('❌ FAIL: Yesterday should remain open.');
    process.exit(1);
}

console.log('\n=== TEST 4: toggleAllDateGroups expands all, then collapses all ===');
vm.runInContext(`window.toggleAllDateGroups()`, context);
console.log(`After expand all: "${elements['toggleAllGroupsBtn'].innerHTML}"`);
if (elements['toggleAllGroupsBtn'].innerHTML.includes('Collapse All')) {
    console.log('✅ PASS: Button toggled to "Collapse All".');
} else {
    console.error('❌ FAIL: Button should be "Collapse All".');
    process.exit(1);
}

vm.runInContext(`window.toggleAllDateGroups()`, context);
console.log(`After collapse all: "${elements['toggleAllGroupsBtn'].innerHTML}"`);
if (elements['toggleAllGroupsBtn'].innerHTML.includes('Expand All')) {
    console.log('✅ PASS: Button toggled back to "Expand All".');
} else {
    console.error('❌ FAIL: Button should be "Expand All".');
    process.exit(1);
}

console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
