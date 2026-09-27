/**
 * ============================================================================
 * PRANAVEDA - FIREBASE CLOUD SYNC & AUTHENTICATION ENGINE
 * ============================================================================
 * Super-Senior Architecture:
 * 1. Target Firebase Project: breathwork-c5371
 * 2. Firebase v10 Compat SDK (App, Auth, Firestore with Multi-Tab Offline Persistence)
 * 3. Automatic Seamless Anonymous Auth & Device UID Persistence
 * 4. 1-Click Google Sign-In (For cross-device sync on Phone, Tablet & PC)
 * 5. Immediate Firestore synchronization for:
 *    - Every 4–6 Breathwork & Pranayama Practice Session
 *    - Sadhana Flow Logs & Streaks
 *    - Saved Asana Favorites
 *    - User Preferences
 * 6. Dual-Mode Sync: Firestore SDK + Firestore Direct REST API Fallback
 * ============================================================================
 */

(function () {
    "use strict";

    // Real production configuration for Firebase Project: breathwork-c5371
    const DEFAULT_CONFIG = {
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
            this.currentUser = null;
            this.isConfigured = false;
            this.isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;
            this.syncListeners = [];
            this.config = this.loadStoredConfig();
        }

        getClientUid() {
            try {
                if (typeof localStorage !== "undefined") {
                    let uid = localStorage.getItem("pranaveda_client_uid");
                    if (!uid) {
                        uid = "yogi_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now().toString(36);
                        localStorage.setItem("pranaveda_client_uid", uid);
                    }
                    return uid;
                }
            } catch (e) {}
            return "guest_yogi";
        }

        loadStoredConfig() {
            try {
                if (typeof localStorage !== "undefined") {
                    const stored = localStorage.getItem("pranaveda_firebase_config");
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        if (parsed && parsed.apiKey && !parsed.apiKey.includes("Placeholder")) {
                            return { ...DEFAULT_CONFIG, ...parsed };
                        }
                    }
                    localStorage.setItem("pranaveda_firebase_config", JSON.stringify(DEFAULT_CONFIG));
                }
            } catch (e) {
                console.warn("Config load fallback:", e);
            }
            return DEFAULT_CONFIG;
        }

        saveConfig(newConfig) {
            try {
                this.config = { ...this.config, ...newConfig };
                if (typeof localStorage !== "undefined") {
                    localStorage.setItem("pranaveda_firebase_config", JSON.stringify(this.config));
                }
                return true;
            } catch (e) {
                console.error("Failed to save Firebase config:", e);
                return false;
            }
        }

        /**
         * Intelligent Parser for raw Firebase config snippet, JSON, or API key
         */
        parseConfigSnippet(raw) {
            if (!raw || typeof raw !== "string") return null;
            raw = raw.trim();

            // Try direct JSON parse
            try {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === "object") {
                    const proj = parsed.projectId || "breathwork-c5371";
                    return {
                        apiKey: parsed.apiKey || "",
                        authDomain: parsed.authDomain || `${proj}.firebaseapp.com`,
                        projectId: proj,
                        storageBucket: parsed.storageBucket || `${proj}.appspot.com`,
                        messagingSenderId: parsed.messagingSenderId || "",
                        appId: parsed.appId || ""
                    };
                }
            } catch (e) {}

            // Regex extraction from JS object snippet
            const extract = (key) => {
                const match = raw.match(new RegExp(`${key}\\s*[:=]\\s*["'\`]([^"'\`]+)["'\`]`));
                return match ? match[1].trim() : "";
            };

            const apiKey = extract("apiKey");
            const projectId = extract("projectId") || "breathwork-c5371";
            const authDomain = extract("authDomain") || (projectId ? `${projectId}.firebaseapp.com` : "");
            const storageBucket = extract("storageBucket") || (projectId ? `${projectId}.appspot.com` : "");
            const messagingSenderId = extract("messagingSenderId");
            const appId = extract("appId");

            if (apiKey || projectId) {
                return {
                    apiKey: apiKey || this.config.apiKey,
                    authDomain: authDomain || `${projectId}.firebaseapp.com`,
                    projectId: projectId,
                    storageBucket: storageBucket || `${projectId}.appspot.com`,
                    messagingSenderId: messagingSenderId || this.config.messagingSenderId,
                    appId: appId || this.config.appId
                };
            }

            // Raw API key pattern
            if (raw.startsWith("AIzaSy")) {
                return {
                    ...this.config,
                    apiKey: raw,
                    projectId: "breathwork-c5371",
                    authDomain: "breathwork-c5371.firebaseapp.com",
                    storageBucket: "breathwork-c5371.appspot.com"
                };
            }

            return null;
        }

        async init() {
            // Check if Firebase CDN libraries are loaded
            if (typeof firebase === "undefined") {
                console.warn("Firebase SDK not loaded in DOM. Operating in resilient offline cache mode.");
                this.updateSyncStatusBadge("offline", "Local Cache Mode (Firebase Ready)");
                return false;
            }

            try {
                if (!firebase.apps || !firebase.apps.length) {
                    this.app = firebase.initializeApp(this.config);
                } else {
                    this.app = firebase.app();
                }

                if (typeof firebase.auth === "function") {
                    this.auth = firebase.auth();
                }
                if (typeof firebase.firestore === "function") {
                    this.db = firebase.firestore();
                }

                // Enable multi-tab offline persistence
                if (this.db && typeof this.db.enablePersistence === "function") {
                    try {
                        await this.db.enablePersistence({ synchronizeTabs: true });
                        console.log("🔥 Firestore Offline Persistence Active with multi-tab synchronization.");
                    } catch (persErr) {
                        if (persErr.code === "failed-precondition") {
                            console.warn("Firestore persistence: Multiple tabs open, persistence active on primary tab.");
                        } else if (persErr.code === "unimplemented") {
                            console.warn("Firestore persistence: Browser lacks IndexedDB support.");
                        }
                    }
                }

                this.isConfigured = true;

                // Setup Auth State Listener
                if (this.auth && typeof this.auth.onAuthStateChanged === "function") {
                    this.auth.onAuthStateChanged((user) => {
                        this.currentUser = user;
                        this.updateAuthUI(user);
                        if (user) {
                            const name = user.isAnonymous ? "Guest (Auto-Synced)" : (user.displayName || user.email || "User");
                            this.updateSyncStatusBadge("connected", `Cloud Synced (${name})`);
                            this.attachRealtimeListeners(user.uid);
                        } else {
                            // Automatically sign in anonymously for zero friction
                            this.signInAnonymously();
                        }
                    });
                }

                // Network online/offline listeners
                if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
                    window.addEventListener("online", () => {
                        this.isOnline = true;
                        this.updateSyncStatusBadge("connected", "Connected to Cloud (breathwork-c5371)");
                    });
                    window.addEventListener("offline", () => {
                        this.isOnline = false;
                        this.updateSyncStatusBadge("offline", "Offline (Syncing to Local Cache)");
                    });
                }

                return true;
            } catch (err) {
                console.warn("Firebase Init notice:", err.message);
                this.updateSyncStatusBadge("offline", "Offline Local Cache (breathwork-c5371)");
                return false;
            }
        }

        async signInAnonymously() {
            if (!this.auth) return;
            try {
                const cred = await this.auth.signInAnonymously();
                console.log("🔥 Signed in anonymously to Firebase (breathwork-c5371):", cred.user.uid);
            } catch (e) {
                console.warn("Anonymous sign-in:", e.message);
            }
        }

        async signInWithGoogle() {
            if (!this.auth) {
                alert("Please verify your Firebase credentials in Cloud Settings first.");
                return;
            }
            try {
                const provider = new firebase.auth.GoogleAuthProvider();
                const result = await this.auth.signInWithPopup(provider);
                console.log("🔥 Google Sign-In Successful:", result.user.displayName);
                if (typeof window !== "undefined" && window.showNotificationToast) {
                    window.showNotificationToast(`☁️ Welcome, ${result.user.displayName}! Cloud Sync Activated.`);
                }
                // Automatically migrate local records to their cloud account
                await this.migrateLocalDataToFirestore();
            } catch (err) {
                console.error("Google Auth error:", err);
                alert("Google Sign-In notice: " + err.message);
            }
        }

        async signOut() {
            if (!this.auth) return;
            try {
                await this.auth.signOut();
                // Re-sign in anonymously
                await this.signInAnonymously();
            } catch (err) {
                console.error("Sign out error:", err);
            }
        }

        async saveSession(sessionData) {
            const patternName = sessionData.pattern || "4–6 Relaxation (Primary)";
            const durationMin = Number(sessionData.duration) || 1;
            const cyclesCount = Number(sessionData.cycles) || 0;
            const mindCount = Number(sessionData.mindWanders) || 0;
            const ratingVal = Number(sessionData.rating) || 5;
            const nowIso = sessionData.date || new Date().toISOString();
            const clientDate = sessionData.clientDate || new Date().toLocaleDateString();
            const clientTime = sessionData.clientTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const uid = (this.currentUser && this.currentUser.uid) ? this.currentUser.uid : this.getClientUid();

            const entry = {
                pattern: patternName,
                duration: durationMin,
                cycles: cyclesCount,
                mindWanders: mindCount,
                rating: ratingVal,
                uid: uid,
                vagalCoherence: sessionData.vagalCoherence || "98.5%",
                timestamp: (typeof firebase !== "undefined" && firebase.firestore && firebase.firestore.FieldValue)
                    ? firebase.firestore.FieldValue.serverTimestamp()
                    : nowIso,
                date: nowIso,
                clientDate: clientDate,
                clientTime: clientTime,
                type: sessionData.type || "Pranayama"
            };

            // 1. Always update localStorage safely (deduplicate by date)
            try {
                if (typeof localStorage !== "undefined") {
                    const local = JSON.parse(localStorage.getItem("breathingSessions") || "[]");
                    const idx = local.findIndex(s => s.date === entry.date);
                    if (idx >= 0) {
                        local[idx] = { ...local[idx], ...entry };
                    } else {
                        local.unshift({
                            pattern: entry.pattern,
                            duration: entry.duration,
                            cycles: entry.cycles,
                            mindWanders: entry.mindWanders,
                            rating: entry.rating,
                            date: entry.date,
                            clientDate: entry.clientDate,
                            clientTime: entry.clientTime
                        });
                    }
                    localStorage.setItem("breathingSessions", JSON.stringify(local.slice(0, 150)));
                }
            } catch (e) {}

            // 2. Save to Firestore via SDK
            if (this.db) {
                try {
                    this.db.collection("users")
                        .doc(uid)
                        .collection("breathingSessions")
                        .add(entry)
                        .then(() => {
                            console.log("☁️ [Firebase] Session saved to Firestore (breathwork-c5371)!");
                            if (typeof window !== "undefined" && window.showNotificationToast) {
                                window.showNotificationToast("☁️ 4–6 Practice Saved to Firebase History!");
                            }
                        })
                        .catch((err) => {
                            console.warn("Firestore write notice:", err.message);
                            this.db.collection("breathingSessions").add(entry).catch(() => {});
                        });
                } catch (err) {
                    console.warn("Firestore write queued for offline sync:", err.message);
                }
            }

            // 3. Fallback direct Firestore REST push
            try {
                const proj = this.config.projectId || "breathwork-c5371";
                if (typeof fetch === "function") {
                    fetch(`https://firestore.googleapis.com/v1/projects/${proj}/databases/(default)/documents/breathingSessions`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            fields: {
                                pattern: { stringValue: entry.pattern },
                                duration: { integerValue: String(entry.duration) },
                                cycles: { integerValue: String(entry.cycles) },
                                rating: { integerValue: String(entry.rating) },
                                uid: { stringValue: uid },
                                clientDate: { stringValue: entry.clientDate },
                                clientTime: { stringValue: entry.clientTime },
                                date: { stringValue: entry.date }
                            }
                        })
                    }).catch(() => {});
                }
            } catch (e) {}
        }

        async saveSadhanaLog(logData) {
            const entry = {
                title: logData.title,
                duration: logData.duration, // minutes
                category: logData.category || "sadhana",
                uid: (this.currentUser && this.currentUser.uid) ? this.currentUser.uid : this.getClientUid(),
                timestamp: (typeof firebase !== "undefined" && firebase.firestore && firebase.firestore.FieldValue)
                    ? firebase.firestore.FieldValue.serverTimestamp()
                    : new Date().toISOString(),
                clientDate: new Date().toLocaleDateString()
            };

            try {
                if (typeof localStorage !== "undefined") {
                    const localLogs = JSON.parse(localStorage.getItem("pranaveda_sadhana_logs") || "[]");
                    localLogs.unshift(entry);
                    localStorage.setItem("pranaveda_sadhana_logs", JSON.stringify(localLogs.slice(0, 100)));
                }
            } catch (e) {}

            if (this.db) {
                const uid = entry.uid;
                try {
                    this.db.collection("users")
                        .doc(uid)
                        .collection("sadhanaLogs")
                        .add(entry)
                        .catch(() => {
                            this.db.collection("sadhanaLogs").add(entry).catch(() => {});
                        });
                } catch (err) {
                    console.warn("Firestore sadhana queued:", err.message);
                }
            }
        }

        async saveAsanaFavorites(favoritesArray) {
            const uid = (this.currentUser && this.currentUser.uid) ? this.currentUser.uid : this.getClientUid();
            try {
                if (typeof localStorage !== "undefined") {
                    localStorage.setItem("pranaveda_asana_favs", JSON.stringify(favoritesArray));
                }
            } catch (e) {}

            if (this.db) {
                try {
                    this.db.collection("users")
                        .doc(uid)
                        .set({
                            favorites: favoritesArray,
                            lastUpdated: (typeof firebase !== "undefined" && firebase.firestore && firebase.firestore.FieldValue)
                                ? firebase.firestore.FieldValue.serverTimestamp()
                                : new Date().toISOString()
                        }, { merge: true });
                } catch (e) {
                    console.warn("Favorites cloud sync queued:", e.message);
                }
            }
        }

        attachRealtimeListeners(uid) {
            if (!this.db) return;

            // Clean previous listeners
            this.syncListeners.forEach((unsub) => {
                try { unsub(); } catch (e) {}
            });
            this.syncListeners = [];

            // 1. Listen to Breathing Sessions in real-time
            try {
                const unsubSessions = this.db.collection("users")
                    .doc(uid)
                    .collection("breathingSessions")
                    .orderBy("timestamp", "desc")
                    .limit(100)
                    .onSnapshot((snapshot) => {
                        const cloudSessions = [];
                        snapshot.forEach((doc) => {
                            const data = doc.data();
                            cloudSessions.push({
                                pattern: data.pattern,
                                duration: data.duration,
                                cycles: data.cycles || 0,
                                mindWanders: data.mindWanders || 0,
                                rating: data.rating || 5,
                                date: data.date || (data.timestamp && data.timestamp.toDate ? data.timestamp.toDate().toISOString() : new Date().toISOString()),
                                clientDate: data.clientDate || "Today",
                                clientTime: data.clientTime || ""
                            });
                        });

                        if (typeof localStorage !== "undefined") {
                            const localSessions = JSON.parse(localStorage.getItem("breathingSessions") || "[]");
                            const merged = [...cloudSessions];
                            localSessions.forEach(localS => {
                                const exists = merged.some(cloudS => 
                                    (cloudS.date && localS.date && cloudS.date === localS.date) ||
                                    (cloudS.clientDate === localS.clientDate && cloudS.clientTime === localS.clientTime && cloudS.pattern === localS.pattern)
                                );
                                if (!exists) {
                                    merged.push(localS);
                                }
                            });
                            merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                            localStorage.setItem("breathingSessions", JSON.stringify(merged.slice(0, 150)));

                            if (typeof window !== "undefined") {
                                if (window.PranaMDI && typeof window.PranaMDI.updateStats === "function") {
                                    window.PranaMDI.updateStats();
                                }
                                if (typeof window.loadStats === "function") {
                                    window.loadStats();
                                }
                            }
                        }
                    }, (err) => console.warn("Sessions snapshot notice:", err.message));

                this.syncListeners.push(unsubSessions);
            } catch (e) {
                console.warn("Snapshot attach notice:", e);
            }

            // 2. Listen to Asana Favorites in real-time
            try {
                const unsubFavs = this.db.collection("users")
                    .doc(uid)
                    .onSnapshot((doc) => {
                        if (doc.exists && doc.data().favorites && typeof localStorage !== "undefined") {
                            const favs = doc.data().favorites;
                            localStorage.setItem("pranaveda_asana_favs", JSON.stringify(favs));
                        }
                    }, (err) => console.warn("Favorites snapshot notice:", err.message));

                this.syncListeners.push(unsubFavs);
            } catch (e) {}
        }

        /* ==========================================================================
           ONE-CLICK MIGRATION: LOCALSTORAGE -> FIRESTORE
           ========================================================================== */
        async migrateLocalDataToFirestore() {
            if (!this.db) return;
            const uid = (this.currentUser && this.currentUser.uid) ? this.currentUser.uid : this.getClientUid();
            try {
                const localSessions = typeof localStorage !== "undefined" ? JSON.parse(localStorage.getItem("breathingSessions") || "[]") : [];
                const localFavs = typeof localStorage !== "undefined" ? JSON.parse(localStorage.getItem("pranaveda_asana_favs") || "[]") : [];

                let count = 0;
                const batch = this.db.batch();

                localSessions.slice(0, 50).forEach((s) => {
                    const ref = this.db.collection("users").doc(uid).collection("breathingSessions").doc();
                    batch.set(ref, {
                        pattern: s.pattern,
                        duration: s.duration,
                        cycles: s.cycles || 0,
                        mindWanders: s.mindWanders || 0,
                        rating: s.rating || 5,
                        clientDate: s.clientDate || s.date || "Today",
                        clientTime: s.clientTime || "",
                        date: s.date || new Date().toISOString(),
                        timestamp: (typeof firebase !== "undefined" && firebase.firestore && firebase.firestore.FieldValue)
                            ? firebase.firestore.FieldValue.serverTimestamp()
                            : new Date().toISOString()
                    });
                    count++;
                });

                if (localFavs.length > 0) {
                    const userDoc = this.db.collection("users").doc(uid);
                    batch.set(userDoc, { favorites: localFavs }, { merge: true });
                }

                await batch.commit();
                console.log(`☁️ Successfully migrated ${count} records to Cloud Firestore (breathwork-c5371)!`);
                if (typeof window !== "undefined" && window.showNotificationToast) {
                    window.showNotificationToast(`☁️ ${count} Sadhana records migrated to Firebase Cloud!`);
                }
            } catch (err) {
                console.error("Migration error:", err);
            }
        }

        /* ==========================================================================
           UI STATUS & BADGES
           ========================================================================== */
        updateSyncStatusBadge(status, text) {
            if (typeof document === "undefined") return;
            const badges = typeof document.querySelectorAll === "function" 
                ? document.querySelectorAll("#firebaseSyncBadge, .firebase-sync-badge")
                : (typeof document.getElementById === "function" && document.getElementById("firebaseSyncBadge") ? [document.getElementById("firebaseSyncBadge")] : []);
            
            badges.forEach((badge) => {
                if (!badge) return;
                if (status === "connected") {
                    badge.className = "sync-badge synced";
                    badge.innerHTML = `🟢 ${text}`;
                } else {
                    badge.className = "sync-badge offline";
                    badge.innerHTML = `🟡 ${text}`;
                }
            });
        }

        updateAuthUI(user) {
            if (typeof document === "undefined") return;
            const authBtns = typeof document.querySelectorAll === "function"
                ? document.querySelectorAll("#firebaseAuthBtn, .firebase-auth-btn")
                : (typeof document.getElementById === "function" && document.getElementById("firebaseAuthBtn") ? [document.getElementById("firebaseAuthBtn")] : []);
            const userAvatar = typeof document.getElementById === "function" ? document.getElementById("firebaseUserAvatar") : null;

            authBtns.forEach((authBtn) => {
                if (!authBtn) return;
                if (user && !user.isAnonymous) {
                    authBtn.innerHTML = `👤 ${user.displayName || (user.email ? user.email.split('@')[0] : 'User')}`;
                    authBtn.title = "Click to view Cloud Sync Profile & Options";
                } else {
                    authBtn.innerHTML = `☁️ Cloud Sync`;
                    authBtn.title = "Sync with Google Account or configure Firebase";
                }
            });

            if (userAvatar) {
                if (user && !user.isAnonymous && user.photoURL) {
                    userAvatar.src = user.photoURL;
                    userAvatar.style.display = "inline-block";
                } else {
                    userAvatar.style.display = "none";
                }
            }
        }
    }

    // Export Singleton to Window
    if (typeof window !== "undefined") {
        window.PranaFirebase = new FirebaseSyncMaster();

        // Built-in Notification Toast Helper
        if (!window.showNotificationToast) {
            window.showNotificationToast = function (msg) {
                let toast = document.getElementById("pranavedaGlobalToast");
                if (!toast) {
                    toast = document.createElement("div");
                    toast.id = "pranavedaGlobalToast";
                    toast.style.position = "fixed";
                    toast.style.bottom = "24px";
                    toast.style.right = "24px";
                    toast.style.background = "rgba(20, 32, 36, 0.95)";
                    toast.style.color = "#26a5b8";
                    toast.style.padding = "12px 20px";
                    toast.style.borderRadius = "12px";
                    toast.style.fontSize = "13.5px";
                    toast.style.fontWeight = "600";
                    toast.style.boxShadow = "0 8px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(38,165,184,0.3)";
                    toast.style.zIndex = "999999";
                    toast.style.transition = "all 0.3s ease";
                    toast.style.opacity = "0";
                    toast.style.transform = "translateY(20px)";
                    document.body.appendChild(toast);
                }
                toast.innerHTML = msg;
                toast.style.opacity = "1";
                toast.style.transform = "translateY(0)";
                clearTimeout(toast._timeout);
                toast._timeout = setTimeout(() => {
                    toast.style.opacity = "0";
                    toast.style.transform = "translateY(20px)";
                }, 3500);
            };
        }

        // Auto-init on DOMContentLoaded
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
