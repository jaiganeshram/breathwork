/**
 * ============================================================================
 * PRANAVEDA - FIREBASE REAL-TIME CLOUD SYNC ENGINE (breathwork-c5371)
 * ============================================================================
 * Firestore is the source of truth for practice history across devices.
 * localStorage is only an offline cache:
 *  - Sessions confirmed in the cloud are marked `synced: true`.
 *  - Local sessions without that flag are pending uploads and are pushed up.
 *  - Synced sessions that disappear from the cloud were deleted on another
 *    device, so they are removed locally too.
 * ============================================================================
 */

(function () {
    "use strict";

    const FIREBASE_CONFIG = {
        apiKey: "AIzaSyC8lAP_MhLMQLoKXttRhA6KnpU6ihdVq2M",
        authDomain: "breathwork-c5371.firebaseapp.com",
        projectId: "breathwork-c5371",
        storageBucket: "breathwork-c5371.firebasestorage.app",
        messagingSenderId: "719227509437",
        appId: "1:719227509437:web:aeae0e0179030b145bb5d4",
        measurementId: "G-XWCJYPL1D6"
    };

    const COLLECTION = "breathingSessions";
    const STORAGE_KEY = "breathingSessions";
    const MAX_SESSIONS = 150;

    function docIdFor(isoDate) {
        return "session_" + String(isoDate || "").replace(/[^a-zA-Z0-9]/g, "_");
    }

    function toCloudEntry(s) {
        const iso = s.date || new Date().toISOString();
        return {
            id: docIdFor(iso),
            pattern: s.pattern || "4–6 Relaxation",
            duration: Number(s.duration) || 1,
            cycles: Number(s.cycles) || 0,
            mindWanders: Number(s.mindWanders) || 0,
            rating: Number(s.rating) || 5,
            date: iso,
            clientDate: s.clientDate || new Date(iso).toLocaleDateString(),
            clientTime: s.clientTime || new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };
    }

    function readLocal() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        } catch (e) {
            return [];
        }
    }

    function writeLocal(list) {
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_SESSIONS)));
        if (typeof window.loadStats === "function") {
            window.loadStats();
        }
    }

    class FirebaseSyncMaster {
        constructor() {
            this.app = null;
            this.auth = null;
            this.db = null;
            this.unsubscribeSnapshot = null;
            this.isInitialized = false;
            this.isReady = false;
        }

        init() {
            if (typeof firebase === "undefined") {
                console.warn("Firebase SDK not loaded, running in local mode.");
                return;
            }

            try {
                this.app = firebase.apps && firebase.apps.length
                    ? firebase.app()
                    : firebase.initializeApp(FIREBASE_CONFIG);

                if (typeof firebase.firestore === "function") {
                    this.db = firebase.firestore();
                }
                this.isInitialized = true;

                if (typeof firebase.auth === "function") {
                    this.auth = firebase.auth();
                    // Firestore rules usually require an authenticated user, so only
                    // start listening once anonymous sign-in has completed.
                    this.auth.onAuthStateChanged((user) => {
                        if (user) {
                            this.onReady();
                        }
                    });
                    this.auth.signInAnonymously().catch((err) => {
                        console.warn("Firebase anonymous auth notice:", err.message);
                        this.onReady();
                    });
                } else {
                    this.onReady();
                }
            } catch (e) {
                console.error("Firebase init error:", e);
            }
        }

        onReady() {
            if (this.isReady) return;
            this.isReady = true;
            this.listenToFirestore();
        }

        listenToFirestore() {
            if (!this.db) return;

            try {
                if (this.unsubscribeSnapshot) {
                    this.unsubscribeSnapshot();
                }

                this.unsubscribeSnapshot = this.db.collection(COLLECTION)
                    .orderBy("date", "desc")
                    .limit(MAX_SESSIONS)
                    .onSnapshot((snapshot) => {
                        const cloudSessions = [];
                        snapshot.forEach((doc) => {
                            const data = doc.data();
                            cloudSessions.push({ ...toCloudEntry(data), id: doc.id, synced: true });
                        });
                        this.mergeCloudIntoLocal(cloudSessions);
                    }, (err) => {
                        console.warn("Firestore snapshot notice (Permission/offline):", err.message);
                    });
            } catch (e) {
                console.warn("Firestore listen error:", e);
            }
        }

        mergeCloudIntoLocal(cloudSessions) {
            const cloudDates = new Set(cloudSessions.map((s) => s.date));
            const pending = readLocal().filter((s) => !s.synced && s.date && !cloudDates.has(s.date));

            writeLocal([...cloudSessions, ...pending]);

            if (pending.length > 0) {
                this.syncLocalToFirestore(pending);
            }
        }

        async saveSession(sessionData) {
            if (!this.db || !sessionData) return;
            const entry = toCloudEntry(sessionData);
            try {
                await this.db.collection(COLLECTION).doc(entry.id).set(entry, { merge: true });
            } catch (e) {
                console.warn("Firestore save session notice:", e.message);
            }
        }

        async deleteSessionFromCloud(sessionDate) {
            if (!this.db || !sessionDate) return;
            try {
                await this.db.collection(COLLECTION).doc(docIdFor(sessionDate)).delete();
            } catch (e) {
                console.warn("Firestore delete session notice:", e.message);
            }
        }

        async deleteSessionsFromCloud(sessionDates) {
            if (!this.db || !Array.isArray(sessionDates) || !sessionDates.length) return;
            try {
                const batch = this.db.batch();
                sessionDates.forEach((d) => {
                    batch.delete(this.db.collection(COLLECTION).doc(docIdFor(d)));
                });
                await batch.commit();
            } catch (e) {
                console.warn("Firestore batch delete notice:", e.message);
            }
        }

        async clearAllFromCloud() {
            if (!this.db) return;
            try {
                const snapshot = await this.db.collection(COLLECTION).get();
                const batch = this.db.batch();
                snapshot.forEach((doc) => batch.delete(doc.ref));
                await batch.commit();
            } catch (e) {
                console.warn("Firestore clear notice:", e.message);
            }
        }

        async syncLocalToFirestore(localSessions) {
            if (!this.db || !Array.isArray(localSessions) || !localSessions.length) return;
            try {
                const batch = this.db.batch();
                localSessions.slice(0, 100).forEach((s) => {
                    const entry = toCloudEntry(s);
                    batch.set(this.db.collection(COLLECTION).doc(entry.id), entry, { merge: true });
                });
                await batch.commit();
            } catch (e) {
                console.warn("Firestore batch sync notice:", e.message);
            }
        }

        syncLocalSessionsToCloud() {
            const pending = readLocal().filter((s) => !s.synced);
            return this.syncLocalToFirestore(pending);
        }

        async pullFromCloud() {
            if (!this.db) return;
            try {
                const snapshot = await this.db.collection(COLLECTION).orderBy("date", "desc").limit(MAX_SESSIONS).get();
                const list = [];
                snapshot.forEach((doc) => list.push({ ...toCloudEntry(doc.data()), id: doc.id, synced: true }));
                this.mergeCloudIntoLocal(list);
            } catch (e) {
                console.warn("Firestore pull notice:", e.message);
            }
        }
    }

    if (typeof window !== "undefined") {
        window.PranaFirebase = new FirebaseSyncMaster();

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => {
                window.PranaFirebase.init();
            });
        } else {
            window.PranaFirebase.init();
        }
    } else if (typeof global !== "undefined") {
        global.PranaFirebase = new FirebaseSyncMaster();
    }
})();
