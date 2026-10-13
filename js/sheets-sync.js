/**
 * PranaVeda - Google Sheets cloud sync.
 * The sheet (via an Apps Script web app) is the source of truth; localStorage
 * is an offline cache. Exposed as window.PranaFirebase so existing callers in
 * breathing.js / asanas.js keep working unchanged.
 */
(function () {
    "use strict";

    const STORAGE_KEY = "breathingSessions";
    const MAX_SESSIONS = 150;

    function idFor(isoDate) {
        return "session_" + String(isoDate || "").replace(/[^a-zA-Z0-9]/g, "_");
    }

    function toCloudEntry(s) {
        const iso = s.date || new Date().toISOString();
        return {
            id: idFor(iso),
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

    class SheetsSync {
        constructor() {
            this.config = {};
            this.pendingDeletes = new Set();
            this.pollTimer = null;
            this.inFlightPull = null;
        }

        get enabled() {
            return Boolean(this.config.url);
        }

        init() {
            this.config = window.PRANA_SHEETS_CONFIG || {};
            if (!this.enabled) {
                console.warn("Google Sheets sync disabled: set url in js/sheets-config.js");
                return;
            }

            this.pullFromCloud();

            const interval = Number(this.config.pollIntervalMs) || 20000;
            this.pollTimer = setInterval(() => {
                if (document.visibilityState === "visible") this.pullFromCloud();
            }, interval);

            document.addEventListener("visibilitychange", () => {
                if (document.visibilityState === "visible") this.pullFromCloud();
            });
            window.addEventListener("online", () => this.pullFromCloud());
        }

        async request(payload) {
            const res = await fetch(this.config.url, {
                method: "POST",
                // text/plain keeps this a "simple" request, avoiding a CORS preflight Apps Script can't answer.
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({ ...payload, secret: this.config.secret || "" })
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error || "Sheets request failed");
            return data.sessions || [];
        }

        mergeCloudIntoLocal(cloudRaw) {
            const cloudSessions = cloudRaw
                .filter((s) => s && s.date && !this.pendingDeletes.has(s.id))
                .map((s) => ({ ...toCloudEntry(s), synced: true }));
            const cloudDates = new Set(cloudSessions.map((s) => s.date));
            const pending = readLocal().filter((s) => !s.synced && s.date && !cloudDates.has(s.date));

            writeLocal([...cloudSessions, ...pending]);
            return pending;
        }

        async pullFromCloud() {
            if (!this.enabled) return;
            if (this.inFlightPull) return this.inFlightPull;

            const url = this.config.url + (this.config.url.includes("?") ? "&" : "?") +
                "secret=" + encodeURIComponent(this.config.secret || "");

            this.inFlightPull = (async () => {
                try {
                    const res = await fetch(url);
                    const data = await res.json();
                    if (!data.ok) throw new Error(data.error || "Sheets pull failed");
                    const pending = this.mergeCloudIntoLocal(data.sessions || []);
                    if (pending.length) await this.upsert(pending);
                } catch (e) {
                    console.warn("Google Sheets pull notice:", e.message);
                } finally {
                    this.inFlightPull = null;
                }
            })();
            return this.inFlightPull;
        }

        async upsert(sessions) {
            if (!this.enabled || !sessions.length) return;
            try {
                const cloud = await this.request({ action: "upsert", sessions: sessions.map(toCloudEntry) });
                this.mergeCloudIntoLocal(cloud);
            } catch (e) {
                console.warn("Google Sheets save notice:", e.message);
            }
        }

        saveSession(sessionData) {
            if (!sessionData) return;
            return this.upsert([sessionData]);
        }

        syncLocalSessionsToCloud() {
            return this.upsert(readLocal().filter((s) => !s.synced));
        }

        async deleteSessionsFromCloud(sessionDates) {
            if (!this.enabled || !Array.isArray(sessionDates) || !sessionDates.length) return;
            const ids = sessionDates.map(idFor);
            ids.forEach((id) => this.pendingDeletes.add(id));
            try {
                const cloud = await this.request({ action: "delete", ids });
                ids.forEach((id) => this.pendingDeletes.delete(id));
                this.mergeCloudIntoLocal(cloud);
            } catch (e) {
                console.warn("Google Sheets delete notice:", e.message);
            }
        }

        deleteSessionFromCloud(sessionDate) {
            if (!sessionDate) return;
            return this.deleteSessionsFromCloud([sessionDate]);
        }

        async clearAllFromCloud() {
            if (!this.enabled) return;
            try {
                await this.request({ action: "clear" });
            } catch (e) {
                console.warn("Google Sheets clear notice:", e.message);
            }
        }

        saveAsanaFavorites() {
            // Asana favorites stay device-local; only breathing logs sync to the sheet.
        }
    }

    window.PranaFirebase = new SheetsSync();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => window.PranaFirebase.init());
    } else {
        window.PranaFirebase.init();
    }
})();
