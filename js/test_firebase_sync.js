const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log("=== Testing Firebase Cloud Sync Engine ===");

const scriptPath = path.join(__dirname, 'firebase-sync.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

const mockFirebase = {
    apps: [],
    initializeApp: (cfg) => ({ name: '[DEFAULT]', options: cfg }),
    app: () => ({}),
    auth: () => ({
        onAuthStateChanged: (cb) => cb({ uid: 'test-uid-123', isAnonymous: true }),
        signInAnonymously: () => Promise.resolve({ user: { uid: 'anon-123', isAnonymous: true } }),
        signInWithPopup: () => Promise.resolve({ user: { uid: 'google-123', displayName: 'Yogi User' } }),
        signOut: () => Promise.resolve()
    }),
    firestore: () => ({
        enablePersistence: () => Promise.resolve(),
        collection: (col) => ({
            doc: (id) => ({
                collection: (subCol) => ({
                    add: (doc) => Promise.resolve({ id: 'doc-123' }),
                    orderBy: () => ({
                        limit: () => ({
                            onSnapshot: (cb) => cb([])
                        })
                    })
                }),
                set: (data, opts) => Promise.resolve(),
                onSnapshot: (cb) => cb({ exists: true, data: () => ({ favorites: [] }) })
            })
        }),
        batch: () => ({
            set: () => {},
            commit: () => Promise.resolve()
        })
    })
};
mockFirebase.firestore.FieldValue = {
    serverTimestamp: () => 'SERVER_TIMESTAMP'
};

const mockWindow = {
    addEventListener: () => {},
    localStorage: {
        store: {},
        getItem: (k) => mockWindow.localStorage.store[k] || null,
        setItem: (k, v) => { mockWindow.localStorage.store[k] = v; }
    },
    navigator: { onLine: true },
    firebase: mockFirebase,
    showNotificationToast: () => {}
};

const mockDocument = {
    addEventListener: (evt, cb) => { if (evt === 'DOMContentLoaded') cb(); },
    getElementById: () => ({
        className: '',
        innerHTML: '',
        textContent: '',
        style: {}
    })
};

const context = vm.createContext({
    window: mockWindow,
    document: mockDocument,
    localStorage: mockWindow.localStorage,
    navigator: mockWindow.navigator,
    firebase: mockFirebase,
    console,
    Date,
    JSON,
    Array,
    Set
});

try {
    vm.runInContext(scriptContent, context);
    console.log("✅ js/firebase-sync.js successfully loaded & initialized with zero errors!");
} catch (e) {
    console.error("❌ Firebase sync test error:", e);
    process.exit(1);
}
