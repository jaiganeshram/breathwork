/**
 * ============================================================================
 * PRANAVEDA - FIREBASE REAL-TIME CLOUD SYNC ENGINE (breathwork-c5371)
 * ============================================================================
 * True Multi-Device Firebase Firestore Synchronization:
 * 1. Connects directly to Google Firebase project `breathwork-c5371`
 * 2. Real-time `onSnapshot` listener syncs history instantly across ALL laptops & mobiles
 * 3. Saving a practice writes to `breathingSessions` collection in Firestore
 * 4. Deleting a practice deletes the document from Firestore
 * 5. Offline persistence with localStorage caching
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

    class FirebaseSyncMaster {
        constructor() {
            this.app = null;
            this.auth = null;
            this.db = null;
            this.unsubscribeSnapshot = null;
            this.isInitialized = false;
        }

        init() {
            if (typeof firebase === "undefined") {
                console.warn("Firebase SDK not loaded, running in local mode.");
                return;
            }

            try {
                if (!firebase.apps || !firebase.apps.length) {
                    this.app = firebase.initializeApp(FIREBASE_CONFIG);
                } else {
                    this.app = firebase.app();
                }

                if (typeof firebase.firestore === "function") {
                    this.db = firebase.firestore();
                }

                if (typeof firebase.auth === "function") {
                    this.auth = firebase.auth();
                    this.auth.signInAnonymously().catch((err) => {
                        console.warn("Firebase anonymous auth notice:", err.message);
                    });
                }

                this.isInitialized = true;
                this.listenToFirestore();
            } catch (e) {
                console.error("Firebase init error:", e);
            }
        }

        listenToFirestore() {
            if (!this.db) return;

            try {
                if (this.unsubscribeSnapshot) {
                    this.unsubscribeSnapshot();
                }

                this.unsubscribeSnapshot = this.db.collection("breathingSessions")
                    .orderBy("date", "desc")
                    .limit(150)
                    .onSnapshot((snapshot) => {
                        const cloudSessions = [];
                        snapshot.forEach((doc) => {
                            const data = doc.data();
                            cloudSessions.push({
                                id: doc.id,
                                pattern: data.pattern || "4–6 Relaxation",
                                duration: Number(data.duration) || 1,
                                cycles: Number(data.cycles) || 0,
                                mindWanders: Number(data.mindWanders) || 0,
                                rating: Number(data.rating) || 5,
                                date: data.date || new Date().toISOString(),
                                clientDate: data.clientDate || "",
                                clientTime: data.clientTime || ""
                            });
                        });

                        if (cloudSessions.length > 0) {
                            localStorage.setItem("breathingSessions", JSON.stringify(cloudSessions));
                            if (typeof window.loadStats === "function") {
                                window.loadStats();
                            }
                        } else {
                            // If cloud has 0 sessions but local has sessions, sync local to cloud once
                            const local = JSON.parse(localStorage.getItem("breathingSessions") || "[]");
                            if (local.length > 0) {
                                this.syncLocalToFirestore(local);
                            }
                        }
                    }, (err) => {
                        console.warn("Firestore snapshot notice (Permission/offline):", err.message);
                    });
            } catch (e) {
                console.warn("Firestore listen error:", e);
            }
        }

        async saveSession(sessionData) {
            const patternName = sessionData.pattern || "4–6 Relaxation";
            const durationMin = Number(sessionData.duration) || 1;
            const cyclesCount = Number(sessionData.cycles) || 0;
            const mindCount = Number(sessionData.mindWanders) || 0;
            const ratingVal = Number(sessionData.rating) || 5;
            const nowIso = sessionData.date || new Date().toISOString();
            const clientDate = sessionData.clientDate || new Date().toLocaleDateString();
            const clientTime = sessionData.clientTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const docId = "session_" + nowIso.replace(/[^a-zA-Z0-9]/g, "_");
            const entry = {
                id: docId,
                pattern: patternName,
                duration: durationMin,
                cycles: cyclesCount,
                mindWanders: mindCount,
                rating: ratingVal,
                date: nowIso,
                clientDate: clientDate,
                clientTime: clientTime
            };

            // 1. Write to Firestore if connected
            if (this.db) {
                try {
                    await this.db.collection("breathingSessions").doc(docId).set(entry, { merge: true });
                } catch (e) {
                    console.warn("Firestore save session notice:", e.message);
                }
            }
        }

        async deleteSessionFromCloud(sessionDate) {
            if (!this.db || !sessionDate) return;
            const docId = "session_" + sessionDate.replace(/[^a-zA-Z0-9]/g, "_");
            try {
                await this.db.collection("breathingSessions").doc(docId).delete();
            } catch (e) {
                console.warn("Firestore delete session notice:", e.message);
            }
        }

        async clearAllFromCloud() {
            if (!this.db) return;
            try {
                const snapshot = await this.db.collection("breathingSessions").get();
                const batch = this.db.batch();
                snapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });
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
                    const iso = s.date || new Date().toISOString();
                    const docId = "session_" + iso.replace(/[^a-zA-Z0-9]/g, "_");
                    const ref = this.db.collection("breathingSessions").doc(docId);
                    batch.set(ref, {
                        id: docId,
                        pattern: s.pattern || "4–6 Relaxation",
                        duration: Number(s.duration) || 1,
                        cycles: Number(s.cycles) || 0,
                        mindWanders: Number(s.mindWanders) || 0,
                        rating: Number(s.rating) || 5,
                        date: iso,
                        clientDate: s.clientDate || "",
                        clientTime: s.clientTime || ""
                    }, { merge: true });
                });
                await batch.commit();
            } catch (e) {
                console.warn("Firestore batch sync notice:", e.message);
            }
        }

        async pullFromCloud() {
            if (this.db) {
                try {
                    const snapshot = await this.db.collection("breathingSessions").orderBy("date", "desc").limit(150).get();
                    const list = [];
                    snapshot.forEach((doc) => {
                        list.push(doc.data());
                    });
                    if (list.length > 0) {
                        localStorage.setItem("breathingSessions", JSON.stringify(list));
                        if (typeof window.loadStats === "function") {
                            window.loadStats();
                        }
                    }
                } catch (e) {
                    console.warn("Firestore pull notice:", e.message);
                }
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
