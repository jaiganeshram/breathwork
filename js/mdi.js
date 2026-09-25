/**
 * ============================================================================
 * PRANAVEDA - MASTER DOCUMENT INTERFACE (MDI) CONTROLLER & WELLNESS ENGINE
 * ============================================================================
 * Super-Senior Architecture:
 * 1. Vedic Audio Synthesizer (Web Audio API - Chimes, Solfeggio Tones, Om Drone, Ambient Noise)
 * 2. Real-Time Vedic Prahar / Muhurta Clock & Ayurvedic Dosha Advisor
 * 3. Daily Sacred Wisdom & Yoga Sutra Shloka Engine
 * 4. Live Interactive Quick-Breather Engine (Visualizer, Audio Guidance & Logging)
 * 5. 7-Chakra Energy Center & Solfeggio Sound Bath Sanctuary
 * 6. Interactive Sadhana Routine Flow Engine (Step-by-step sequential practice runner)
 * 7. MDI Multi-Document Window Manager (Tabs, Split-Screen Dual Panes, Iframe Controls)
 * 8. Asana & Posture Compendium Showcase with HD Photography
 * 9. Unified Sadhana Analytics, Streaks & LocalStorage Synchronization
 * 10. Ambient Prana Particles Canvas
 * ============================================================================
 */

(function () {
    "use strict";

    /* ==========================================================================
       1. VEDIC AUDIO ENGINE (Pure Web Audio API Synthesizer)
       ========================================================================== */
    class VedicAudioMaster {
        constructor() {
            this.ctx = null;
            this.ambientGain = null;
            this.ambientNodes = {};
            this.activeChakraOsc = null;
            this.activeChakraGain = null;
            this.masterVolume = 0.8;
            this.droneGain = null;
            this.droneOscs = [];
        }

        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                }
            }
            if (this.ctx && this.ctx.state === "suspended") {
                this.ctx.resume();
            }
        }

        playBell(freq = 432, duration = 3.5, type = "bowl") {
            try {
                this.init();
                if (!this.ctx) return;
                const now = this.ctx.currentTime;

                if (type === "ting-sha") {
                    // High-frequency crystal chime
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(2048, now);
                    osc.frequency.exponentialRampToValueAtTime(1024, now + 2.2);

                    gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now);
                    osc.stop(now + 2.2);
                    return;
                }

                // Rich multi-harmonic Tibetan singing bowl
                const harmonics = [1, 2.02, 3.03, 4.2];
                const weights = [0.45, 0.22, 0.12, 0.05];

                harmonics.forEach((h, idx) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(freq * h, now);
                    osc.frequency.exponentialRampToValueAtTime((freq * h) * 0.998, now + duration);

                    gain.gain.setValueAtTime(0.001, now);
                    gain.gain.linearRampToValueAtTime(weights[idx] * this.masterVolume, now + 0.06);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

                    osc.connect(gain);
                    gain.connect(this.ctx.destination);

                    osc.start(now);
                    osc.stop(now + duration);
                });
            } catch (err) {
                console.warn("Audio bell issue:", err);
            }
        }

        playChakraFrequency(freq, onStopCallback) {
            try {
                this.init();
                if (!this.ctx) return;

                this.stopChakraFrequency();

                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, now);

                // Gentle fade in
                gain.gain.setValueAtTime(0.0001, now);
                gain.gain.linearRampToValueAtTime(0.28 * this.masterVolume, now + 0.4);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);

                this.activeChakraOsc = osc;
                this.activeChakraGain = gain;
            } catch (err) {
                console.warn("Chakra tone error:", err);
            }
        }

        stopChakraFrequency() {
            if (this.activeChakraOsc && this.activeChakraGain && this.ctx) {
                try {
                    const now = this.ctx.currentTime;
                    this.activeChakraGain.gain.setValueAtTime(this.activeChakraGain.gain.value, now);
                    this.activeChakraGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
                    this.activeChakraOsc.stop(now + 0.55);
                } catch (e) {
                    // Ignore stop errors if already stopped
                }
                this.activeChakraOsc = null;
                this.activeChakraGain = null;
            }
        }

        toggleOmDrone(enable, volume = 0.25) {
            this.init();
            if (!this.ctx) return;

            if (!enable) {
                if (this.droneGain) {
                    const now = this.ctx.currentTime;
                    this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
                    this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
                    setTimeout(() => {
                        this.droneOscs.forEach(o => { try { o.stop(); } catch(e){} });
                        this.droneOscs = [];
                        this.droneGain = null;
                    }, 1050);
                }
                return;
            }

            if (this.droneGain) return; // already active

            const now = this.ctx.currentTime;
            this.droneGain = this.ctx.createGain();
            this.droneGain.gain.setValueAtTime(0.0001, now);
            this.droneGain.gain.linearRampToValueAtTime(volume * this.masterVolume, now + 1.5);
            this.droneGain.connect(this.ctx.destination);

            // Sacred 108Hz / 136.1Hz (Om frequency) harmonic cluster
            const freqs = [108, 136.1, 216, 272.2, 432];
            this.droneOscs = freqs.map((f, i) => {
                const osc = this.ctx.createOscillator();
                const subGain = this.ctx.createGain();
                osc.type = i % 2 === 0 ? "sine" : "triangle";
                osc.frequency.setValueAtTime(f, now);
                subGain.gain.setValueAtTime(0.2 / (i + 1), now);
                osc.connect(subGain);
                subGain.connect(this.droneGain);
                osc.start(now);
                return osc;
            });
        }

        toggleAmbientPinkNoise(enable, volume = 0.15) {
            this.init();
            if (!this.ctx) return;

            if (!enable) {
                if (this.ambientNodes.pinkGain) {
                    const now = this.ctx.currentTime;
                    this.ambientNodes.pinkGain.gain.setValueAtTime(this.ambientNodes.pinkGain.gain.value, now);
                    this.ambientNodes.pinkGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
                    setTimeout(() => {
                        try { this.ambientNodes.pinkSource.stop(); } catch(e){}
                        this.ambientNodes.pinkSource = null;
                        this.ambientNodes.pinkGain = null;
                    }, 850);
                }
                return;
            }

            if (this.ambientNodes.pinkGain) return;

            const bufferSize = this.ctx.sampleRate * 2;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
                b6 = white * 0.115926;
            }

            const source = this.ctx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;

            const filter = this.ctx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(800, this.ctx.currentTime);

            const gain = this.ctx.createGain();
            const now = this.ctx.currentTime;
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.linearRampToValueAtTime(volume * this.masterVolume, now + 1.2);

            source.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            source.start(now);

            this.ambientNodes.pinkSource = source;
            this.ambientNodes.pinkGain = gain;
        }
    }

    const audio = new VedicAudioMaster();

    /* ==========================================================================
       2. VEDIC MUHURTA & AYURVEDIC DOSHA CLOCK
       ========================================================================== */
    const VEDIC_PRAHARS = [
        {
            name: "Brahma Muhurta",
            sanskrit: "பிரம்ம முஹூர்த்தம்",
            startHour: 3.5, // 03:30
            endHour: 5.5,   // 05:30
            energy: "Supreme Sattva (Divine Clarity)",
            dosha: "Vata Transition to Sattva",
            recommendation: "Deep Meditation, Anapanasati, Higher Pranayama & Sacred Chanting.",
            accent: "#8b6bc7"
        },
        {
            name: "Pratah Sandhya (Dawn)",
            sanskrit: "ப்ராத: ஸந்த்யா",
            startHour: 5.5,
            endHour: 8.5,
            energy: "Awakening Solar Fire (Tejas)",
            dosha: "Kapha Energy Rising",
            recommendation: "Surya Namaskar 12-Flow, Kapalabhati, Bhastrika & Chest-opening Asanas.",
            accent: "#e5a93c"
        },
        {
            name: "Sangava (Morning Active)",
            sanskrit: "ஸங்க³வ",
            startHour: 8.5,
            endHour: 12.0,
            energy: "Dynamic Manifestation",
            dosha: "Kapha / Pitta Balance",
            recommendation: "Standing Balances (Tree, Warrior II), 5-5 Coherent Calm & Focus breath.",
            accent: "#26a5b8"
        },
        {
            name: "Madhyahna (Midday Solar Peak)",
            sanskrit: "மத்⁴யாஹ்னம்",
            startHour: 12.0,
            endHour: 15.5,
            energy: "Pitta Digestive Agni",
            dosha: "Peak Pitta (Fire & Heat)",
            recommendation: "Cooling Sitali / Sitkari breath, gentle seated twists, mindful digestion.",
            accent: "#e05d5d"
        },
        {
            name: "Aparahna (Afternoon Serenity)",
            sanskrit: "அபராஹ்னம்",
            startHour: 15.5,
            endHour: 18.0,
            energy: "Grounding Prana",
            dosha: "Vata Rising",
            recommendation: "Nadi Shodhana Alternate Nostril Breath, Trikonasana, spinal elongation.",
            accent: "#2ea879"
        },
        {
            name: "Sayam Sandhya (Sunset Twilight)",
            sanskrit: "ஸாயம் ஸந்த்யா",
            startHour: 18.0,
            endHour: 20.5,
            energy: "Introspective Calm",
            dosha: "Sattva & Kapha Transition",
            recommendation: "4-7-8 Relaxation, Paschimottanasana, Metta Bhavana loving kindness.",
            accent: "#d6647f"
        },
        {
            name: "Pradosha / Ratri (Evening Rest)",
            sanskrit: "ப்ரதோஷம் / ராத்ரி",
            startHour: 20.5,
            endHour: 23.5,
            energy: "Deep Restoration & Yoga Nidra",
            dosha: "Kapha Calming",
            recommendation: "Viparita Karani (Legs-Up-Wall), Balasana, Chandra Bhedana & 432Hz Sound Bath.",
            accent: "#5a78c5"
        },
        {
            name: "Nisitha (Midnight Silence)",
            sanskrit: "நிஶீதம்",
            startHour: 23.5,
            endHour: 27.5, // 03:30 next day
            energy: "Sacred Silence & Cellular Repair",
            dosha: "Deep Vata/Pitta Rest",
            recommendation: "Deep restful sleep, silent diaphragmatic breath, restorative renewal.",
            accent: "#434f64"
        }
    ];

    function getCurrentPrahar() {
        const now = new Date();
        let currentDecimalHour = now.getHours() + now.getMinutes() / 60;
        if (currentDecimalHour < 3.5) {
            currentDecimalHour += 24; // Handle after midnight
        }

        for (const prahar of VEDIC_PRAHARS) {
            if (currentDecimalHour >= prahar.startHour && currentDecimalHour < prahar.endHour) {
                return prahar;
            }
        }
        return VEDIC_PRAHARS[0];
    }

    function updateMuhurtaClock() {
        const prahar = getCurrentPrahar();
        const now = new Date();

        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateString = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

        const clockEl = document.getElementById("realtimeClock");
        const muhurtaNameEl = document.getElementById("muhurtaName");
        const muhurtaSanskritEl = document.getElementById("muhurtaSanskrit");
        const muhurtaEnergyEl = document.getElementById("muhurtaEnergy");
        const muhurtaRecEl = document.getElementById("muhurtaRec");
        const heroGreetingEl = document.getElementById("heroGreeting");

        if (clockEl) clockEl.textContent = `${timeString} • ${dateString}`;
        if (muhurtaNameEl) muhurtaNameEl.textContent = prahar.name;
        if (muhurtaSanskritEl) muhurtaSanskritEl.textContent = prahar.sanskrit;
        if (muhurtaEnergyEl) muhurtaEnergyEl.textContent = prahar.energy;
        if (muhurtaRecEl) muhurtaRecEl.textContent = prahar.recommendation;

        if (heroGreetingEl) {
            const h = now.getHours();
            let greetingPrefix = "Namaste & Pranam";
            if (h >= 3 && h < 6) greetingPrefix = "Auspicious Brahma Muhurta";
            else if (h >= 6 && h < 12) greetingPrefix = "Shubha Prabhat (Blessed Morning)";
            else if (h >= 12 && h < 17) greetingPrefix = "Shubha Madhyahna (Radiant Afternoon)";
            else if (h >= 17 && h < 21) greetingPrefix = "Shubha Sandhya (Peaceful Evening)";
            else greetingPrefix = "Shanta Ratri (Restful Night)";
            heroGreetingEl.textContent = `${greetingPrefix} — Welcome to PranaVeda Master Portal`;
        }
    }

    /* ==========================================================================
       3. SACRED VEDIC WISDOM & YOGA SUTRAS
       ========================================================================== */
    const SACRED_VERSES = [
        {
            sanskrit: "யோகஶ்சித்த விருத்தி நிரோதஹ் ॥ 1.2 ॥",
            translit: "Yogaś citta-vṛtti-nirodhaḥ",
            source: "Patanjali Yoga Sutras 1.2",
            meaning: "Yoga is the stilling and intentional mastery of the fluctuations of the mind.",
            insight: "When the mind's waves become calm like a crystal lake, the true inner Self shines through untouched."
        },
        {
            sanskrit: "தஸ்மின் ஸதி ஶ்வாஸப்ரஶ்வாஸயோர் கதிவிச்சேத³ஹ் ப்ராணாயாமஹ் ॥ 2.49 ॥",
            translit: "Tasmin sati śvāsa-praśvāsayor gati-vicchedaḥ prāṇāyāmaḥ",
            source: "Patanjali Yoga Sutras 2.49",
            meaning: "Pranayama is the conscious regulation and stilling of the motion of inhalation and exhalation.",
            insight: "By mastering the golden thread of the breath, you unlock direct command over life-force and nervous equilibrium."
        },
        {
            sanskrit: "ஸ்திர ஸுக²ம் ஆஸனம் ॥ 2.46 ॥",
            translit: "Sthira-sukham āsanam",
            source: "Patanjali Yoga Sutras 2.46",
            meaning: "Posture (Asana) should be steady, grounded, and imbued with ease and joyful lightness.",
            insight: "True posture is never rigid strain; it is an effortless balance of firm foundation and spacious inner ease."
        },
        {
            sanskrit: "சலே வாதே சலம் சித்தம் நிஶ்சலே நிஶ்சலம் பவேத் ॥ 2.2 ॥",
            translit: "Cale vāte calaṁ cittaṁ niścale niścalaṁ bhavet",
            source: "Hatha Yoga Pradipika 2.2",
            meaning: "When the breath moves, the mind wanders. When the breath is still, the mind attains immovable stillness.",
            insight: "Breath and consciousness are two wings of the same bird. Steady one, and the other settles instantly."
        },
        {
            sanskrit: "ஸமத்வம் யோக³ உச்யதே ॥ 2.48 ॥",
            translit: "Samatvaṁ yoga ucyate",
            source: "Bhagavad Gita 2.48",
            meaning: "Equanimity, balance, and centered poise in all states of life is declared to be Yoga.",
            insight: "Neither clinging to joy nor collapsing in trial—centered in the quiet witness within."
        },
        {
            sanskrit: "ஶரீரம் ஆத்³யம் க²லு த⁴ர்மஸாத⁴னம் ॥",
            translit: "Śarīram ādyaṁ khalu dharma-sādhanam",
            source: "Kalidasa - Kumarasambhava",
            meaning: "The physical body is verily the primal and sacred instrument for fulfilling spiritual purpose.",
            insight: "Nourish the temple of the body through pure posture, vital prana, and conscious stillness."
        }
    ];

    let currentVerseIdx = 0;

    function renderSacredVerse(idx) {
        const verse = SACRED_VERSES[idx % SACRED_VERSES.length];
        const sEl = document.getElementById("verseSanskrit");
        const tEl = document.getElementById("verseTranslit");
        const mEl = document.getElementById("verseMeaning");
        const srcEl = document.getElementById("verseSource");
        const inEl = document.getElementById("verseInsight");

        if (sEl) sEl.textContent = verse.sanskrit;
        if (tEl) tEl.textContent = verse.translit;
        if (mEl) mEl.textContent = `"${verse.meaning}"`;
        if (srcEl) srcEl.textContent = `— ${verse.source}`;
        if (inEl) inEl.textContent = `💡 Yogic Insight: ${verse.insight}`;
    }

    function setupVerseNavigation() {
        const nextBtn = document.getElementById("nextVerseBtn");
        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                currentVerseIdx = (currentVerseIdx + 1) % SACRED_VERSES.length;
                renderSacredVerse(currentVerseIdx);
                audio.playBell(528, 2.0, "ting-sha");
            });
        }
        // Daily deterministic verse
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        currentVerseIdx = dayOfYear % SACRED_VERSES.length;
        renderSacredVerse(currentVerseIdx);
    }

    /* ==========================================================================
       4. QUICK PRANA BREATH ENGINE (In-Dashboard Interactive Orb)
       ========================================================================== */
    let wakeLock = null;
    async function requestWakeLock() {
        if ('wakeLock' in navigator) {
            try {
                wakeLock = await navigator.wakeLock.request('screen');
            } catch (e) {
                // Ignore wakeLock errors on unsupported browsers
            }
        }
    }
    function releaseWakeLock() {
        if (wakeLock) {
            try { wakeLock.release(); } catch(e){}
            wakeLock = null;
        }
    }

    function triggerHaptic(type = "phase") {
        if ("vibrate" in navigator) {
            try {
                if (type === "inhale") navigator.vibrate([45]);
                else if (type === "exhale") navigator.vibrate([85]);
                else if (type === "hold") navigator.vibrate([25, 40, 25]);
                else navigator.vibrate([40]);
            } catch (e) {}
        }
    }

    const QUICK_PATTERNS = {
        "4-6": {
            name: "4–6 Deep Relaxation (Your Primary Daily Breath)",
            ratio: [4, 0, 6, 0],
            desc: "★ Your Primary Daily Practice: 4s Inhale and extended 6s Exhale triggers immediate vagus nerve activation, lowers heart rate, and melts mental fatigue.",
            color: "var(--accent-cyan)",
            glow: "rgba(38, 165, 184, 0.55)"
        },
        "box": {
            name: "Sama Vritti (Box 4-4-4-4)",
            ratio: [4, 4, 4, 4],
            desc: "Equal balancing of parasympathetic and sympathetic nervous systems.",
            color: "var(--accent-cyan)",
            glow: "rgba(38, 165, 184, 0.45)"
        },
        "4-7-8": {
            name: "4-7-8 Parasympathetic Vagal Melt",
            ratio: [4, 7, 8, 0],
            desc: "Natural tranquilizer for the nervous system, rapidly lowers heart rate.",
            color: "var(--accent-purple)",
            glow: "rgba(139, 107, 199, 0.45)"
        },
        "5-5": {
            name: "5-5 Heart Coherence (0.1 Hz)",
            ratio: [5, 0, 5, 0],
            desc: "Optimal HRV resonance, aligns blood pressure and brainwave rhythms.",
            color: "var(--accent-green)",
            glow: "rgba(46, 168, 121, 0.45)"
        },
        "energize": {
            name: "Solar Vitality (2-1-4-1)",
            ratio: [2, 1, 4, 1],
            desc: "Quick focus activator and morning prana ignition.",
            color: "var(--accent-gold)",
            glow: "rgba(229, 169, 60, 0.45)"
        }
    };

    let quickBreathState = {
        isRunning: false,
        timer: null,
        patternKey: "4-6",
        phaseIndex: 0, // 0: inhale, 1: hold full, 2: exhale, 3: hold empty
        phaseTimeRemaining: 4,
        cyclesCompleted: 0,
        secondsTotal: 0,
        sessionStartTime: 0
    };

    const PHASE_NAMES = ["Inhale Prana", "Hold (Antara Kumbhaka)", "Exhale Slowly", "Hold (Bahya Kumbhaka)"];

    function setQuickPattern(key) {
        if (!QUICK_PATTERNS[key]) return;
        quickBreathState.patternKey = key;
        const pat = QUICK_PATTERNS[key];
        const descEl = document.getElementById("quickPatternDesc");
        if (descEl) descEl.textContent = pat.desc;

        if (!quickBreathState.isRunning) {
            quickBreathState.phaseIndex = 0;
            quickBreathState.phaseTimeRemaining = pat.ratio[0];
            updateQuickBreathVisuals();
        }
    }

    function toggleQuickBreath() {
        if (quickBreathState.isRunning) {
            stopQuickBreath();
        } else {
            startQuickBreath();
        }
    }

    function startQuickBreath() {
        audio.init();
        requestWakeLock();
        quickBreathState.isRunning = true;
        quickBreathState.sessionStartTime = Date.now();
        quickBreathState.cyclesCompleted = 0;
        quickBreathState.secondsTotal = 0;

        const pat = QUICK_PATTERNS[quickBreathState.patternKey];
        quickBreathState.phaseIndex = 0;
        quickBreathState.phaseTimeRemaining = pat.ratio[0];

        const btn = document.getElementById("quickBreathBtn");
        if (btn) {
            btn.innerHTML = "⏸️ Pause Practice";
            btn.classList.add("active-pulse");
        }

        audio.playBell(432, 2.5, "bowl");
        triggerHaptic("inhale");
        updateQuickBreathVisuals();

        quickBreathState.timer = setInterval(tickQuickBreath, 1000);
    }

    function tickQuickBreath() {
        if (!quickBreathState.isRunning) return;

        quickBreathState.secondsTotal++;
        quickBreathState.phaseTimeRemaining--;

        const pat = QUICK_PATTERNS[quickBreathState.patternKey];

        if (quickBreathState.phaseTimeRemaining <= 0) {
            // Advance phase
            let nextPhase = (quickBreathState.phaseIndex + 1) % 4;
            // Skip 0-duration phases
            while (pat.ratio[nextPhase] === 0) {
                nextPhase = (nextPhase + 1) % 4;
            }

            if (nextPhase === 0) {
                quickBreathState.cyclesCompleted++;
                const countEl = document.getElementById("quickCyclesCount");
                if (countEl) countEl.textContent = quickBreathState.cyclesCompleted;
            }

            quickBreathState.phaseIndex = nextPhase;
            quickBreathState.phaseTimeRemaining = pat.ratio[nextPhase];

            // Sound cue & haptic vibration for phase change
            // Sound cue & haptic vibration for phase change
            if (nextPhase === 0) {
                audio.playBell(528, 2.5, "bowl"); // Inhale
                triggerHaptic("inhale");
            } else if (nextPhase === 2) {
                audio.playBell(396, 2.5, "bowl"); // Exhale
                triggerHaptic("exhale");
            } else {
                audio.playBell(432, 1.5, "ting-sha"); // Holds
                triggerHaptic("hold");
            }
        }

        updateQuickBreathVisuals();
    }

    function updateQuickBreathVisuals() {
        const orb = document.getElementById("quickBreathOrb");
        const phaseNameEl = document.getElementById("quickPhaseName");
        const phaseTimerEl = document.getElementById("quickPhaseTimer");
        const totalTimerEl = document.getElementById("quickTotalTimer");
        const pat = QUICK_PATTERNS[quickBreathState.patternKey];

        if (phaseNameEl) phaseNameEl.textContent = PHASE_NAMES[quickBreathState.phaseIndex];
        if (phaseTimerEl) phaseTimerEl.textContent = `${quickBreathState.phaseTimeRemaining}s`;

        if (totalTimerEl) {
            const m = Math.floor(quickBreathState.secondsTotal / 60);
            const s = quickBreathState.secondsTotal % 60;
            totalTimerEl.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }

        if (orb) {
            const maxDuration = pat.ratio[quickBreathState.phaseIndex] || 1;
            orb.style.transition = `all ${quickBreathState.isRunning ? 1.0 : 0.4}s ease-in-out`;

            if (quickBreathState.phaseIndex === 0) {
                // Inhale: Expand
                orb.style.transform = "scale(1.45)";
                orb.style.boxShadow = `0 0 45px ${pat.glow}, inset 0 0 25px ${pat.glow}`;
                orb.style.borderColor = pat.color;
            } else if (quickBreathState.phaseIndex === 1) {
                // Hold Full: Pulsate steady high
                orb.style.transform = "scale(1.48)";
                orb.style.boxShadow = `0 0 60px ${pat.glow}, inset 0 0 35px ${pat.glow}`;
            } else if (quickBreathState.phaseIndex === 2) {
                // Exhale: Contract
                orb.style.transform = "scale(0.85)";
                orb.style.boxShadow = `0 0 20px ${pat.glow}, inset 0 0 10px ${pat.glow}`;
            } else {
                // Hold Empty: Small steady
                orb.style.transform = "scale(0.80)";
                orb.style.boxShadow = `0 0 10px rgba(0,0,0,0.2)`;
            }
        }
    }

    function stopQuickBreath() {
        if (!quickBreathState.isRunning) return;
        releaseWakeLock();
        quickBreathState.isRunning = false;
        clearInterval(quickBreathState.timer);
        quickBreathState.timer = null;

        const btn = document.getElementById("quickBreathBtn");
        if (btn) {
            btn.innerHTML = "▶️ Start Breathing";
            btn.classList.remove("active-pulse");
        }

        const orb = document.getElementById("quickBreathOrb");
        if (orb) {
            orb.style.transform = "scale(1)";
            orb.style.boxShadow = "none";
        }

        const phaseNameEl = document.getElementById("quickPhaseName");
        if (phaseNameEl) phaseNameEl.textContent = "Ready to Begin";

        // Log session to LocalStorage if practiced >= 30 seconds
        if (quickBreathState.secondsTotal >= 30) {
            logCompletedSession("Pranayama Quick-Breath", Math.round(quickBreathState.secondsTotal / 60) || 1, quickBreathState.patternKey);
            showNotificationToast(`✨ Beautiful practice! ${quickBreathState.secondsTotal}s logged to your Sadhana history.`);
        }
    }

    /* ==========================================================================
       5. 7-CHAKRA RESONANCE & SOLFEGGIO SOUND SANCTUARY
       ========================================================================== */
    const CHAKRAS = [
        {
            id: "root",
            name: "Muladhara (Root)",
            sanskrit: "மூலாதாரம்",
            freq: 396,
            note: "UT",
            seed: "LAM",
            color: "#e05d5d",
            element: "Earth (Prithvi)",
            location: "Base of Spine",
            benefit: "Grounding, Physical Security, Dissolving Fear & Anxiety"
        },
        {
            id: "sacral",
            name: "Svadhisthana (Sacral)",
            sanskrit: "ஸ்வாதிஷ்டானம்",
            freq: 417,
            note: "RE",
            seed: "VAM",
            color: "#e5a93c",
            element: "Water (Jala)",
            location: "Pelvis / Lower Abdomen",
            benefit: "Creative Flow, Emotional Ease, Adaptability & Sensuality"
        },
        {
            id: "solar",
            name: "Manipura (Solar Plexus)",
            sanskrit: "மணிபூரகம்",
            freq: 528,
            note: "MI (Miracle)",
            seed: "RAM",
            color: "#f5c542",
            element: "Fire (Agni)",
            location: "Navel / Solar Plexus",
            benefit: "Willpower, Transformation, Vital Energy & Inner Strength"
        },
        {
            id: "heart",
            name: "Anahata (Heart)",
            sanskrit: "அனாஹதம்",
            freq: 639,
            note: "FA",
            seed: "YAM",
            color: "#2ea879",
            element: "Air (Vayu)",
            location: "Center of Chest",
            benefit: "Unconditional Love, Compassion, Forgiveness & Harmony"
        },
        {
            id: "throat",
            name: "Vishuddha (Throat)",
            sanskrit: "விசுத்தி",
            freq: 741,
            note: "SOL",
            seed: "HAM",
            color: "#26a5b8",
            element: "Ether / Space (Akasha)",
            location: "Throat Center",
            benefit: "Authentic Expression, Truth, Clear Communication & Intuition"
        },
        {
            id: "third-eye",
            name: "Ajna (Third Eye)",
            sanskrit: "ஆக்ஞா",
            freq: 852,
            note: "LA",
            seed: "OM",
            color: "#8b6bc7",
            element: "Pure Light (Jyoti)",
            location: "Between Eyebrows",
            benefit: "Spiritual Vision, Deep Insight, Clarity & Transcendence"
        },
        {
            id: "crown",
            name: "Sahasrara (Crown)",
            sanskrit: "ஸஹஸ்ராரம்",
            freq: 963,
            note: "SI",
            seed: "AUM",
            color: "#d6647f",
            element: "Pure Consciousness (Brahman)",
            location: "Crown of the Head",
            benefit: "Divine Connection, Oneness, Enlightenment & Eternal Peace"
        }
    ];

    let activeChakraId = null;

    function renderChakraButtons() {
        const container = document.getElementById("chakraGrid");
        if (!container) return;

        container.innerHTML = CHAKRAS.map(c => `
            <div class="chakra-card ${activeChakraId === c.id ? 'active' : ''}" data-id="${c.id}" style="--c-accent: ${c.color}">
                <div class="chakra-header">
                    <div class="chakra-badge" style="background: ${c.color}22; color: ${c.color}; border: 1px solid ${c.color}44;">
                        ${c.freq} Hz • ${c.note}
                    </div>
                    <span class="chakra-seed">${c.seed}</span>
                </div>
                <h4 class="chakra-title">${c.name}</h4>
                <div class="chakra-sanskrit">${c.sanskrit}</div>
                <div class="chakra-loc">📍 ${c.location} • 🌀 ${c.element}</div>
                <p class="chakra-benefit">${c.benefit}</p>
                <div class="chakra-actions">
                    <button class="chakra-play-btn ${activeChakraId === c.id ? 'playing' : ''}" data-freq="${c.freq}">
                        ${activeChakraId === c.id ? '⏹️ Stop Tone' : '▶️ Play Resonance'}
                    </button>
                </div>
            </div>
        `).join("");

        // Event delegation
        container.querySelectorAll(".chakra-card").forEach(card => {
            card.addEventListener("click", (e) => {
                const id = card.getAttribute("data-id");
                toggleChakraResonance(id);
            });
        });
    }

    function toggleChakraResonance(id) {
        const chakra = CHAKRAS.find(c => c.id === id);
        if (!chakra) return;

        if (activeChakraId === id) {
            audio.stopChakraFrequency();
            activeChakraId = null;
            const nowPlayingEl = document.getElementById("nowPlayingAudio");
            if (nowPlayingEl) nowPlayingEl.textContent = "Silent Sanctuary";
        } else {
            activeChakraId = id;
            audio.playChakraFrequency(chakra.freq);
            const nowPlayingEl = document.getElementById("nowPlayingAudio");
            if (nowPlayingEl) nowPlayingEl.textContent = `Resonating: ${chakra.name} (${chakra.freq} Hz Solfeggio)`;
            audio.playBell(chakra.freq, 3.0, "bowl");
        }
        renderChakraButtons();
    }

    function setupSoundControls() {
        const omDroneToggle = document.getElementById("omDroneToggle");
        const pinkNoiseToggle = document.getElementById("pinkNoiseToggle");
        const stopAllAudioBtn = document.getElementById("stopAllAudioBtn");
        const masterVolumeSlider = document.getElementById("masterVolumeSlider");

        if (omDroneToggle) {
            omDroneToggle.addEventListener("change", (e) => {
                audio.toggleOmDrone(e.target.checked);
            });
        }

        if (pinkNoiseToggle) {
            pinkNoiseToggle.addEventListener("change", (e) => {
                audio.toggleAmbientPinkNoise(e.target.checked);
            });
        }

        if (stopAllAudioBtn) {
            stopAllAudioBtn.addEventListener("click", () => {
                audio.stopChakraFrequency();
                audio.toggleOmDrone(false);
                audio.toggleAmbientPinkNoise(false);
                activeChakraId = null;
                if (omDroneToggle) omDroneToggle.checked = false;
                if (pinkNoiseToggle) pinkNoiseToggle.checked = false;
                renderChakraButtons();
                const nowPlayingEl = document.getElementById("nowPlayingAudio");
                if (nowPlayingEl) nowPlayingEl.textContent = "Silent Sanctuary";
            });
        }

        if (masterVolumeSlider) {
            masterVolumeSlider.addEventListener("input", (e) => {
                audio.masterVolume = parseFloat(e.target.value);
            });
        }
    }

    /* ==========================================================================
       6. INTERACTIVE SADHANA ROUTINE FLOW RUNNER
       ========================================================================== */
    const MASTER_ROUTINES = [
        {
            id: "sunrise-vitality",
            title: "Surya Sunrise Vitality Flow",
            subtitle: "Awaken Agni, Spinal Mobility & Prana Focus",
            durationMinutes: 15,
            level: "All Levels",
            category: "energizing",
            icon: "☀️",
            description: "A complete morning sadhana combining classical Surya Namaskar movements, cleansing Kapalabhati, and coherent heart breathing.",
            steps: [
                { title: "Centering in Padmasana (Lotus)", type: "Posture", duration: 120, cue: "Sit tall with spine aligned, hands in Chin Mudra. Observe the natural breath.", image: "images/padmasana.jpg" },
                { title: "12-Step Classical Surya Namaskar", type: "Flow", duration: 300, cue: "Flow rhythmically through all 12 sun salutation postures with synchronized breath.", image: "images/adho_mukha_svanasana.jpg" },
                { title: "Kapalabhati (Skull Shining Breath)", type: "Pranayama", duration: 180, cue: "Active forceful exhalations from lower belly, effortless passive inhalations.", image: "images/padmasana.jpg" },
                { title: "5-5 Coherent Heart Pranayama", type: "Pranayama", duration: 180, cue: "Inhale 5s, exhale 5s. Feel deep alignment between heart rate and nervous system.", image: "images/tadasana.jpg" },
                { title: "Savasana Integration & Om Chime", type: "Restoration", duration: 120, cue: "Lie completely still. Let the awakened prana distribute through all 72,000 nadis.", image: "images/viparita_karani.jpg" }
            ]
        },
        {
            id: "vagus-melt",
            title: "Vagus Nerve & Anxiety Dissolver",
            subtitle: "Parasympathetic Reset & Deep Surrender",
            durationMinutes: 12,
            level: "Gentle",
            category: "calming",
            icon: "🌿",
            description: "Melt chronic nervous tension, lower cortisol, and trigger the mammalian relaxation response with soothing forward bends and 4-7-8 breathing.",
            steps: [
                { title: "Balasana (Child's Pose)", type: "Posture", duration: 180, cue: "Rest forehead on mat. Inhale deep into back ribs, sigh out tension on exhalation.", image: "images/balasana.jpg" },
                { title: "Paschimottanasana (Seated Forward Bend)", type: "Posture", duration: 180, cue: "Hinge from hips, extend heart forward. Allow hamstrings and lumbar spine to lengthen.", image: "images/paschimottanasana.jpg" },
                { title: "4-7-8 Deep Vagal Pranayama", type: "Pranayama", duration: 240, cue: "Inhale nose 4s, hold gently 7s, exhale completely through mouth with whoosh 8s.", image: "images/padmasana.jpg" },
                { title: "528Hz Solar Heart Sound Immersion", type: "Sound", duration: 120, cue: "Breathe in the golden 528Hz miracle frequency. Feel inner tranquility solidify.", image: "images/baddha_konasana.jpg" }
            ]
        },
        {
            id: "deep-sleep-nidra",
            title: "Deep Sleep & Yoga Nidra Gate",
            subtitle: "Spinal Decompression & Mind Stillness",
            durationMinutes: 18,
            level: "Restorative",
            category: "sleep",
            icon: "🌙",
            description: "Prepare the body and subtle nervous channels for deep restorative delta-wave sleep with inversions and cooling left-nostril breath.",
            steps: [
                { title: "Viparita Karani (Legs-Up-The-Wall)", type: "Posture", duration: 300, cue: "Elevate legs against wall. Reverses venous blood flow and calms the adrenal glands.", image: "images/viparita_karani.jpg" },
                { title: "Baddha Konasana (Bound Butterfly)", type: "Posture", duration: 240, cue: "Soles of feet together, knees relax outward. Release stored emotional tension in hips.", image: "images/baddha_konasana.jpg" },
                { title: "Chandra Bhedana (Moon Breathing)", type: "Pranayama", duration: 240, cue: "Inhale exclusively through left nostril (cooling Ida nadi), exhale through right.", image: "images/padmasana.jpg" },
                { title: "432Hz Tibetan Singing Bowl Nidra", type: "Meditation", duration: 300, cue: "Surrender the physical body into weightless calm. Transition into natural sleep.", image: "images/balasana.jpg" }
            ]
        },
        {
            id: "warrior-focus",
            title: "Spine Power & Laser Drishti",
            subtitle: "Rooted Strength, Balance & Mental Clarity",
            durationMinutes: 16,
            level: "Intermediate",
            category: "strength",
            icon: "⚡",
            description: "Build unwavering physical poise and cognitive focus with grounding standing warrior postures and alternate nostril cleansing.",
            steps: [
                { title: "Tadasana to Vrikshasana (Tree Pose)", type: "Posture", duration: 240, cue: "Root firmly into earth. Fix Drishti on single unmoving point ahead.", image: "images/vrikshasana.jpg" },
                { title: "Virabhadrasana II (Warrior II)", type: "Posture", duration: 240, cue: "Deep 90-degree front knee bend, arms expansive, gaze over front fingertips with calm resolve.", image: "images/virabhadrasana2.jpg" },
                { title: "Utthita Trikonasana (Triangle)", type: "Posture", duration: 240, cue: "Lateral spinal extension. Expand chest toward sky and breathe steadily.", image: "images/trikonasana.jpg" },
                { title: "Nadi Shodhana (Channel Purification)", type: "Pranayama", duration: 240, cue: "Harmonize pingala and ida channels with alternate nostril rhythm.", image: "images/padmasana.jpg" }
            ]
        }
    ];

    let currentRoutineState = {
        routine: null,
        stepIndex: 0,
        secondsRemaining: 0,
        isRunning: false,
        timer: null
    };

    function renderRoutineCards() {
        const container = document.getElementById("routinesGrid");
        if (!container) return;

        container.innerHTML = MASTER_ROUTINES.map(r => `
            <div class="routine-card" data-id="${r.id}">
                <div class="routine-card-header">
                    <span class="routine-icon">${r.icon}</span>
                    <span class="routine-badge">${r.durationMinutes} Mins • ${r.level}</span>
                </div>
                <h3 class="routine-title">${r.title}</h3>
                <div class="routine-sub">${r.subtitle}</div>
                <p class="routine-desc">${r.description}</p>
                <div class="routine-steps-preview">
                    ${r.steps.map((s, idx) => `
                        <div class="step-pill"><b>${idx + 1}.</b> ${s.title} (${Math.round(s.duration / 60)}m)</div>
                    `).join("")}
                </div>
                <div class="routine-footer">
                    <button class="icon-btn primary start-routine-btn" data-id="${r.id}">
                        ▶️ Start Practice Flow
                    </button>
                </div>
            </div>
        `).join("");

        container.querySelectorAll(".start-routine-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                launchRoutineModal(id);
            });
        });
    }

    function launchRoutineModal(routineId) {
        const routine = MASTER_ROUTINES.find(r => r.id === routineId);
        if (!routine) return;

        currentRoutineState.routine = routine;
        currentRoutineState.stepIndex = 0;
        currentRoutineState.secondsRemaining = routine.steps[0].duration;
        currentRoutineState.isRunning = false;

        const modal = document.getElementById("routineModal");
        if (!modal) return;

        updateRoutineModalUI();
        modal.classList.add("show");
        audio.playBell(432, 2.5, "bowl");
    }

    function updateRoutineModalUI() {
        const r = currentRoutineState.routine;
        if (!r) return;
        const step = r.steps[currentRoutineState.stepIndex];

        const titleEl = document.getElementById("routineModalTitle");
        const stepCounterEl = document.getElementById("routineModalStepCounter");
        const stepNameEl = document.getElementById("routineModalStepName");
        const stepTypeEl = document.getElementById("routineModalStepType");
        const stepCueEl = document.getElementById("routineModalStepCue");
        const stepTimerEl = document.getElementById("routineModalTimer");
        const stepImgEl = document.getElementById("routineModalImage");
        const progressBarEl = document.getElementById("routineModalProgressBar");
        const playBtn = document.getElementById("routineModalPlayBtn");

        if (titleEl) titleEl.textContent = r.title;
        if (stepCounterEl) stepCounterEl.textContent = `Step ${currentRoutineState.stepIndex + 1} of ${r.steps.length}`;
        if (stepNameEl) stepNameEl.textContent = step.title;
        if (stepTypeEl) stepTypeEl.textContent = step.type;
        if (stepCueEl) stepCueEl.textContent = step.cue;
        if (stepImgEl) stepImgEl.src = step.image || "images/padmasana.jpg";

        const m = Math.floor(currentRoutineState.secondsRemaining / 60);
        const s = currentRoutineState.secondsRemaining % 60;
        if (stepTimerEl) stepTimerEl.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

        if (progressBarEl) {
            const pct = ((currentRoutineState.stepIndex) / r.steps.length) * 100;
            progressBarEl.style.width = `${pct}%`;
        }

        if (playBtn) {
            playBtn.innerHTML = currentRoutineState.isRunning ? "⏸️ Pause Step" : "▶️ Start Step";
        }
    }

    function toggleRoutineTimer() {
        if (currentRoutineState.isRunning) {
            pauseRoutineTimer();
        } else {
            startRoutineTimer();
        }
    }

    function startRoutineTimer() {
        audio.init();
        currentRoutineState.isRunning = true;
        updateRoutineModalUI();
        audio.playBell(528, 2.0, "bowl");

        currentRoutineState.timer = setInterval(() => {
            currentRoutineState.secondsRemaining--;
            if (currentRoutineState.secondsRemaining <= 0) {
                // Advance step
                audio.playBell(741, 3.0, "ting-sha");
                if (currentRoutineState.stepIndex + 1 < currentRoutineState.routine.steps.length) {
                    currentRoutineState.stepIndex++;
                    currentRoutineState.secondsRemaining = currentRoutineState.routine.steps[currentRoutineState.stepIndex].duration;
                    updateRoutineModalUI();
                } else {
                    // Completed!
                    finishRoutine();
                }
            } else {
                updateRoutineModalUI();
            }
        }, 1000);
    }

    function pauseRoutineTimer() {
        currentRoutineState.isRunning = false;
        clearInterval(currentRoutineState.timer);
        currentRoutineState.timer = null;
        updateRoutineModalUI();
    }

    function nextRoutineStep() {
        if (!currentRoutineState.routine) return;
        if (currentRoutineState.stepIndex + 1 < currentRoutineState.routine.steps.length) {
            currentRoutineState.stepIndex++;
            currentRoutineState.secondsRemaining = currentRoutineState.routine.steps[currentRoutineState.stepIndex].duration;
            updateRoutineModalUI();
            audio.playBell(528, 1.5, "bowl");
        } else {
            finishRoutine();
        }
    }

    function prevRoutineStep() {
        if (!currentRoutineState.routine) return;
        if (currentRoutineState.stepIndex > 0) {
            currentRoutineState.stepIndex--;
            currentRoutineState.secondsRemaining = currentRoutineState.routine.steps[currentRoutineState.stepIndex].duration;
            updateRoutineModalUI();
        }
    }

    function finishRoutine() {
        pauseRoutineTimer();
        const r = currentRoutineState.routine;
        audio.playBell(432, 4.0, "bowl");

        logCompletedSession(`Sadhana Flow: ${r.title}`, r.durationMinutes, "flow");
        showNotificationToast(`🎉 Sadhana Completed! Blessed journey: ${r.title} logged to your practice journal.`);

        const modal = document.getElementById("routineModal");
        if (modal) modal.classList.remove("show");
    }

    function setupRoutineModalEvents() {
        const modal = document.getElementById("routineModal");
        const closeBtn = document.getElementById("routineModalCloseBtn");
        const playBtn = document.getElementById("routineModalPlayBtn");
        const nextBtn = document.getElementById("routineModalNextBtn");
        const prevBtn = document.getElementById("routineModalPrevBtn");

        if (closeBtn && modal) {
            closeBtn.addEventListener("click", () => {
                pauseRoutineTimer();
                modal.classList.remove("show");
            });
        }

        if (playBtn) playBtn.addEventListener("click", toggleRoutineTimer);
        if (nextBtn) nextBtn.addEventListener("click", nextRoutineStep);
        if (prevBtn) prevBtn.addEventListener("click", prevRoutineStep);
    }

    /* ==========================================================================
       7. MDI MULTI-DOCUMENT WINDOW MANAGER & DOCK (Desktop-Class Multi-Doc Studio)
       ========================================================================== */
    const MDI_DOCS = {
        "pranayama": {
            id: "pranayama",
            title: "🌬️ Pranayama & Breathwork Studio",
            url: "Breathing_Exercise.html",
            icon: "🌬️"
        },
        "asanas": {
            id: "asanas",
            title: "🧘 Yoga Asanas Studio",
            url: "Asanas.html",
            icon: "🧘"
        }
    };

    let activeMdiTab = "pranayama";
    let isSplitView = false;

    function initMdiWindowManager() {
        const mdiToggleBtn = document.getElementById("mdiModeToggleBtn");
        const mdiWorkspace = document.getElementById("mdiWorkspaceContainer");
        const dashboardView = document.getElementById("dashboardMainView");

        const tabPranayama = document.getElementById("mdiTabPranayama");
        const tabAsanas = document.getElementById("mdiTabAsanas");
        const splitToggleBtn = document.getElementById("mdiSplitViewBtn");
        const mdiMaximizeBtn = document.getElementById("mdiMaximizeBtn");
        const mdiRefreshBtn = document.getElementById("mdiRefreshBtn");
        const mdiPopoutBtn = document.getElementById("mdiPopoutBtn");
        const mdiCloseWorkspaceBtn = document.getElementById("mdiCloseWorkspaceBtn");

        const iframePrimary = document.getElementById("mdiIframePrimary");
        const iframeSecondary = document.getElementById("mdiIframeSecondary");
        const splitContainer = document.getElementById("mdiSplitContainer");

        if (mdiToggleBtn) {
            mdiToggleBtn.addEventListener("click", () => {
                const isWorkspaceActive = mdiWorkspace.classList.contains("active");
                if (isWorkspaceActive) {
                    closeMdiWorkspace();
                } else {
                    openMdiWorkspace("pranayama");
                }
            });
        }

        if (mdiCloseWorkspaceBtn) {
            mdiCloseWorkspaceBtn.addEventListener("click", closeMdiWorkspace);
        }

        if (tabPranayama) {
            tabPranayama.addEventListener("click", () => switchMdiTab("pranayama"));
        }

        if (tabAsanas) {
            tabAsanas.addEventListener("click", () => switchMdiTab("asanas"));
        }

        if (splitToggleBtn) {
            splitToggleBtn.addEventListener("click", toggleSplitView);
        }

        if (mdiRefreshBtn) {
            mdiRefreshBtn.addEventListener("click", () => {
                if (iframePrimary) iframePrimary.src = iframePrimary.src;
                if (iframeSecondary && isSplitView) iframeSecondary.src = iframeSecondary.src;
                showNotificationToast("🔄 MDI Workspace reloaded");
            });
        }

        if (mdiMaximizeBtn) {
            mdiMaximizeBtn.addEventListener("click", () => {
                mdiWorkspace.classList.toggle("maximized");
                mdiMaximizeBtn.innerHTML = mdiWorkspace.classList.contains("maximized") ? "🗗 Restore" : "🗖 Maximize";
            });
        }

        if (mdiPopoutBtn) {
            mdiPopoutBtn.addEventListener("click", () => {
                const url = activeMdiTab === "asanas" ? "Asanas.html" : "Breathing_Exercise.html";
                window.open(url, "_blank", "width=1200,height=800");
            });
        }

        // Direct launchers from Chamber cards
        document.querySelectorAll("[data-launch-mdi]").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const docId = btn.getAttribute("data-launch-mdi");
                openMdiWorkspace(docId);
            });
        });
    }

    function openMdiWorkspace(docId = "pranayama") {
        const mdiWorkspace = document.getElementById("mdiWorkspaceContainer");
        const dashboardView = document.getElementById("dashboardMainView");
        const mdiToggleBtn = document.getElementById("mdiModeToggleBtn");

        if (!mdiWorkspace) return;

        mdiWorkspace.classList.add("active");
        if (mdiToggleBtn) {
            mdiToggleBtn.innerHTML = "🏛️ Return to Hub";
            mdiToggleBtn.classList.add("active-nav");
        }

        switchMdiTab(docId);
        window.scrollTo({ top: mdiWorkspace.offsetTop - 20, behavior: 'smooth' });
    }

    function closeMdiWorkspace() {
        const mdiWorkspace = document.getElementById("mdiWorkspaceContainer");
        const mdiToggleBtn = document.getElementById("mdiModeToggleBtn");

        if (!mdiWorkspace) return;
        mdiWorkspace.classList.remove("active");
        if (mdiToggleBtn) {
            mdiToggleBtn.innerHTML = "🖥️ MDI Multi-Studio";
            mdiToggleBtn.classList.remove("active-nav");
        }
    }

    function switchMdiTab(docId) {
        activeMdiTab = docId;
        const iframePrimary = document.getElementById("mdiIframePrimary");
        const tabPranayama = document.getElementById("mdiTabPranayama");
        const tabAsanas = document.getElementById("mdiTabAsanas");
        const activeTitleEl = document.getElementById("mdiActiveWindowTitle");

        if (tabPranayama) tabPranayama.classList.toggle("active", docId === "pranayama");
        if (tabAsanas) tabAsanas.classList.toggle("active", docId === "asanas");

        if (iframePrimary) {
            const targetUrl = docId === "asanas" ? "Asanas.html" : "Breathing_Exercise.html";
            if (!iframePrimary.src.includes(targetUrl)) {
                iframePrimary.src = targetUrl;
            }
        }

        if (activeTitleEl) {
            activeTitleEl.textContent = docId === "asanas" ? "Yoga Asana Studio (MDI Document 1)" : "Pranayama Breathwork Studio (MDI Document 1)";
        }
    }

    function toggleSplitView() {
        isSplitView = !isSplitView;
        const splitContainer = document.getElementById("mdiSplitContainer");
        const splitToggleBtn = document.getElementById("mdiSplitViewBtn");
        const iframeSecondary = document.getElementById("mdiIframeSecondary");

        if (splitContainer) {
            splitContainer.classList.toggle("split-active", isSplitView);
        }

        if (splitToggleBtn) {
            splitToggleBtn.innerHTML = isSplitView ? "🗔 Single View" : "⧉ Dual Split View";
        }

        if (iframeSecondary && isSplitView) {
            // Put other app in secondary pane
            iframeSecondary.src = activeMdiTab === "asanas" ? "Breathing_Exercise.html" : "Asanas.html";
        }
    }

    /* ==========================================================================
       8. ASANA SHOWCASE & GALLERY CAROUSEL
       ========================================================================== */
    const SHOWCASE_ASANAS = [
        { id: "padmasana", name: "Padmasana", dev: "பத்மாசனம்", eng: "Lotus Pose", cat: "seated", chakra: "Sahasrara & Muladhara", img: "images/padmasana.jpg", benefit: "Classical posture for pranayama, stabilizes pelvis, calms mind and directs prana up sushumna." },
        { id: "vrikshasana", name: "Vrikshasana", dev: "விருக்ஷாசனம்", eng: "Tree Pose", cat: "standing", chakra: "Ajna (Third Eye)", img: "images/vrikshasana.jpg", benefit: "Develops laser drishti focus, strengthens ankles, stretches inner groins and cultivates poise." },
        { id: "trikonasana", name: "Utthita Trikonasana", dev: "உத்தித திரிகோணாசனம்", eng: "Extended Triangle", cat: "standing", chakra: "Manipura", img: "images/trikonasana.jpg", benefit: "Spacious lateral spinal stretch, expands chest capacity and relieves hamstring tightness." },
        { id: "virabhadrasana2", name: "Virabhadrasana II", dev: "வீரபத்ராசனம் 2", eng: "Warrior II", cat: "standing", chakra: "Muladhara & Manipura", img: "images/virabhadrasana2.jpg", benefit: "Fosters heroic stamina, opens hips, strengthens quadriceps and builds unshakable resolve." },
        { id: "adho_mukha_svanasana", name: "Adho Mukha Svanasana", dev: "அதோ முக ஸ்வானாசனம்", eng: "Downward-Facing Dog", cat: "inversion", chakra: "Vishuddha & Ajna", img: "images/adho_mukha_svanasana.jpg", benefit: "Decompresses vertebral discs, calms nervous system and energizes the entire body." },
        { id: "bhujangasana", name: "Bhujangasana", dev: "புஜங்காசனம்", eng: "Cobra Pose", cat: "backbend", chakra: "Anahata (Heart)", img: "images/bhujangasana.jpg", benefit: "Invigorates the heart, expands lung volume, strengthens spine and stimulates digestive agni." },
        { id: "balasana", name: "Balasana", dev: "பாலாசனம்", eng: "Child's Pose", cat: "restorative", chakra: "Ajna", img: "images/balasana.jpg", benefit: "Sacred surrender posture, massages abdominal organs, calms adrenal fatigue and relieves stress." },
        { id: "chakrasana", name: "Chakrasana", dev: "சக்ராசனம்", eng: "Wheel Pose", cat: "backbend", chakra: "All 7 Chakras", img: "images/chakrasana.jpg", benefit: "Profound spine rejuvenation, tones thyroid, expands cardiovascular vitality and dispels lethargy." },
        { id: "sirsasana", name: "Salamba Sirsasana", dev: "சாலாம்ப சீர்ஷாசனம்", eng: "Headstand (King of Poses)", cat: "inversion", chakra: "Sahasrara", img: "images/sirsasana.jpg", benefit: "Increases cerebral blood supply, revitalizes pituitary and pineal glands, cultivates courage." },
        { id: "viparita_karani", name: "Viparita Karani", dev: "விபரீத கரணி", eng: "Legs-Up-The-Wall", cat: "restorative", chakra: "Vishuddha", img: "images/viparita_karani.jpg", benefit: "Deep restorative relief for tired legs, lymphatic drainage, facilitates profound sleep." }
    ];

    let activeAsanaFilter = "all";

    function renderAsanaGallery() {
        const container = document.getElementById("asanaGalleryContainer");
        if (!container) return;

        const filtered = SHOWCASE_ASANAS.filter(a => {
            if (activeAsanaFilter === "all") return true;
            return a.cat === activeAsanaFilter;
        });

        container.innerHTML = filtered.map(a => `
            <div class="asana-card" data-id="${a.id}">
                <div class="asana-img-wrap">
                    <img src="${a.img}" alt="${a.name} (${a.eng})" loading="lazy" onerror="this.src='images/padmasana.jpg'">
                    <span class="asana-cat-badge">${a.cat.toUpperCase()}</span>
                </div>
                <div class="asana-info">
                    <div class="asana-header-row">
                        <h4 class="asana-sanskrit">${a.name}</h4>
                        <span class="asana-dev">${a.dev}</span>
                    </div>
                    <div class="asana-eng">${a.eng}</div>
                    <div class="asana-chakra">🌀 ${a.chakra}</div>
                    <p class="asana-benefit">${a.benefit}</p>
                    <div class="asana-actions">
                        <a href="Asanas.html?pose=${a.id}" class="icon-btn small primary" title="View Alignment & Full Guide in Studio">
                            🔍 Studio Guide
                        </a>
                        <button class="icon-btn small" onclick="window.PranaMDI.quickPoseTimer('${a.name}', 30)">
                            ⏱️ 30s Hold
                        </button>
                    </div>
                </div>
            </div>
        `).join("");
    }

    function setupAsanaGalleryFilters() {
        document.querySelectorAll(".gallery-filter-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".gallery-filter-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                activeAsanaFilter = btn.getAttribute("data-filter");
                renderAsanaGallery();
            });
        });
    }

    /* ==========================================================================
       9. SADHANA ANALYTICS, STREAKS & LOCALSTORAGE SYNC
       ========================================================================== */
    function getStoredBreathingSessions() {
        try {
            return JSON.parse(localStorage.getItem("breathingSessions") || "[]");
        } catch (e) {
            return [];
        }
    }

    function getStoredAsanaFavorites() {
        try {
            return JSON.parse(localStorage.getItem("pranaveda_asana_favs") || "[]");
        } catch (e) {
            return [];
        }
    }

    function getStoredSadhanaLogs() {
        try {
            return JSON.parse(localStorage.getItem("pranaveda_sadhana_logs") || "[]");
        } catch (e) {
            return [];
        }
    }

    function logCompletedSession(title, durationMin, category = "general") {
        try {
            const logs = getStoredSadhanaLogs();
            const newEntry = {
                id: Date.now(),
                title: title,
                duration: durationMin,
                category: category,
                timestamp: new Date().toISOString(),
                dateStr: new Date().toLocaleDateString()
            };
            logs.unshift(newEntry);
            localStorage.setItem("pranaveda_sadhana_logs", JSON.stringify(logs.slice(0, 100)));

            // Also increment breathingSessions for compatibility
            const breathSessions = getStoredBreathingSessions();
            breathSessions.unshift({
                pattern: title,
                duration: durationMin * 60,
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            localStorage.setItem("breathingSessions", JSON.stringify(breathSessions.slice(0, 100)));

            // Sync to Firebase Cloud Firestore
            if (window.PranaFirebase) {
                window.PranaFirebase.saveSession({
                    pattern: title,
                    duration: durationMin * 60,
                    type: category
                });
                window.PranaFirebase.saveSadhanaLog({
                    title: title,
                    duration: durationMin,
                    category: category
                });
            }

            updateSadhanaStatsUI();
        } catch (err) {
            console.error("Session log error:", err);
        }
    }

    function calculateStreak() {
        const logs = getStoredSadhanaLogs();
        const breathSessions = getStoredBreathingSessions();

        const allDates = new Set();
        logs.forEach(l => {
            if (l.dateStr) allDates.add(l.dateStr);
        });
        breathSessions.forEach(s => {
            if (s.date) allDates.add(s.date);
        });

        if (allDates.size === 0) return 1; // Welcome streak

        let streak = 0;
        let checkDate = new Date();

        for (let i = 0; i < 60; i++) {
            const str = checkDate.toLocaleDateString();
            if (allDates.has(str)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else if (i === 0) {
                // If today is not logged yet, check if yesterday was logged
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        return Math.max(streak, 1);
    }

    function updateSadhanaStatsUI() {
        const logs = getStoredSadhanaLogs();
        const breathSessions = getStoredBreathingSessions();
        const asanaFavs = getStoredAsanaFavorites();

        let totalMinutes = 0;
        breathSessions.forEach(s => {
            totalMinutes += Math.round((s.duration || 60) / 60);
        });
        logs.forEach(l => {
            totalMinutes += (l.duration || 1);
        });

        const streak = calculateStreak();
        const totalSessions = breathSessions.length + logs.length;

        const streakEl = document.getElementById("statStreak");
        const minutesEl = document.getElementById("statMinutes");
        const sessionsEl = document.getElementById("statSessions");
        const favsEl = document.getElementById("statFavs");
        const vitalityEl = document.getElementById("statVitality");

        if (streakEl) streakEl.textContent = `${streak} Days`;
        if (minutesEl) minutesEl.textContent = `${totalMinutes} Mins`;
        if (sessionsEl) sessionsEl.textContent = totalSessions;
        if (favsEl) favsEl.textContent = asanaFavs.length;

        // Dynamic Prana Vitality Index (60% base + up to 40% from practice)
        const vitality = Math.min(100, 65 + Math.min(35, totalSessions * 3 + streak * 2));
        if (vitalityEl) vitalityEl.textContent = `${vitality}%`;

        // Render Recent Journal
        renderRecentJournal();
    }

    function renderRecentJournal() {
        const tableBody = document.getElementById("journalTableBody");
        if (!tableBody) return;

        const breathSessions = getStoredBreathingSessions();
        const logs = getStoredSadhanaLogs();

        const combined = [
            ...logs.map(l => ({ title: l.title, duration: `${l.duration} min`, date: l.dateStr || new Date(l.timestamp).toLocaleDateString(), type: "🌿 Sadhana" })),
            ...breathSessions.slice(0, 10).map(s => ({ title: `Pranayama: ${s.pattern}`, duration: `${Math.round(s.duration / 60)} min`, date: `${s.date} ${s.time || ''}`, type: "🌬️ Breath" }))
        ].slice(0, 6);

        if (combined.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 24px;">No sadhana logged yet. Start your first practice above!</td></tr>`;
            return;
        }

        tableBody.innerHTML = combined.map(item => `
            <tr>
                <td><b>${item.title}</b></td>
                <td><span class="pill pill-pattern">${item.type}</span></td>
                <td>⏱️ ${item.duration}</td>
                <td>📅 ${item.date}</td>
            </tr>
        `).join("");
    }

    /* ==========================================================================
       10. THEME MANAGEMENT & SYNCHRONIZATION
       ========================================================================== */
    function initThemeSync() {
        const themeToggleBtn = document.getElementById("themeToggleBtn");
        const savedTheme = localStorage.getItem("pranaveda_theme") || (localStorage.getItem("darkMode") === "1" ? "dark" : "light");

        if (savedTheme === "dark") {
            document.body.classList.add("dark");
            if (themeToggleBtn) themeToggleBtn.innerHTML = "☀️ Light Mode";
        } else {
            document.body.classList.remove("dark");
            if (themeToggleBtn) themeToggleBtn.innerHTML = "🌙 Dark Mode";
        }

        if (themeToggleBtn) {
            themeToggleBtn.addEventListener("click", () => {
                document.body.classList.toggle("dark");
                const isDark = document.body.classList.contains("dark");
                themeToggleBtn.innerHTML = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
                localStorage.setItem("pranaveda_theme", isDark ? "dark" : "light");
                localStorage.setItem("darkMode", isDark ? "1" : "0");
            });
        }
    }

    /* ==========================================================================
       11. AMBIENT PRANA PARTICLES CANVAS
       ========================================================================== */
    function initParticlesCanvas() {
        const canvas = document.getElementById("particlesCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const count = Math.min(width > 768 ? 45 : 22, 50);

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2.2 + 0.6,
                speedX: (Math.random() - 0.5) * 0.35,
                speedY: (Math.random() - 0.5) * 0.35,
                alpha: Math.random() * 0.5 + 0.15,
                color: Math.random() > 0.5 ? "38, 165, 184" : "229, 169, 60"
            });
        }

        function renderParticles() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
                ctx.fill();
            });

            requestAnimationFrame(renderParticles);
        }

        renderParticles();
    }

    /* ==========================================================================
       12. NOTIFICATION TOAST & UTILITIES
       ========================================================================== */
    function showNotificationToast(msg) {
        let toast = document.getElementById("pranavedaToast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "pranavedaToast";
            toast.className = "pranaveda-toast";
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3800);
    }

    /* ==========================================================================
       13. GLOBAL PRANAMDI CONTROLLER API
       ========================================================================== */
    window.PranaMDI = {
        audio: audio,
        setQuickPattern: setQuickPattern,
        toggleQuickBreath: toggleQuickBreath,
        start46Breathing: () => {
            setQuickPattern("4-6");
            document.querySelectorAll(".quick-pattern-pill").forEach(p => {
                p.classList.toggle("active", p.getAttribute("data-pattern") === "4-6");
            });
            const section = document.getElementById("quickBreathSection");
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            if (!quickBreathState.isRunning) {
                startQuickBreath();
            }
            showNotificationToast("🌊 4–6 Deep Relaxation Breathwork Activated (Inhale 4s • Exhale 6s)");
        },
        updateStats: updateSadhanaStatsUI,
        openMdiWorkspace: openMdiWorkspace,
        closeMdiWorkspace: closeMdiWorkspace,
        launchRoutineModal: launchRoutineModal,
        quickPoseTimer: (poseName, seconds = 30) => {
            audio.playBell(528, 2.0, "bowl");
            showNotificationToast(`🧘 ${poseName} Timer started for ${seconds} seconds.`);
            let remaining = seconds;
            const t = setInterval(() => {
                remaining--;
                if (remaining <= 0) {
                    clearInterval(t);
                    audio.playBell(741, 3.5, "ting-sha");
                    showNotificationToast(`✨ ${poseName} complete! Well done.`);
                    logCompletedSession(`Asana Hold: ${poseName}`, 1, "asana");
                }
            }, 1000);
        }
    };

    /* ==========================================================================
       14. APP INITIALIZATION (DOM CONTENT LOADED)
       ========================================================================== */
    document.addEventListener("DOMContentLoaded", () => {
        initThemeSync();
        initParticlesCanvas();
        updateMuhurtaClock();
        setInterval(updateMuhurtaClock, 10000); // update every 10s

        setupVerseNavigation();
        renderChakraButtons();
        setupSoundControls();
        renderRoutineCards();
        setupRoutineModalEvents();
        initMdiWindowManager();
        renderAsanaGallery();
        setupAsanaGalleryFilters();
        updateSadhanaStatsUI();

        // Quick Breather pattern selector buttons
        document.querySelectorAll(".quick-pattern-pill").forEach(pill => {
            pill.addEventListener("click", () => {
                document.querySelectorAll(".quick-pattern-pill").forEach(p => p.classList.remove("active"));
                pill.classList.add("active");
                const pat = pill.getAttribute("data-pattern");
                setQuickPattern(pat);
            });
        });

        const quickBreathBtn = document.getElementById("quickBreathBtn");
        if (quickBreathBtn) {
            quickBreathBtn.addEventListener("click", toggleQuickBreath);
        }

        // Keyboard navigation
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                const routineModal = document.getElementById("routineModal");
                if (routineModal && routineModal.classList.contains("show")) {
                    pauseRoutineTimer();
                    routineModal.classList.remove("show");
                }
            }
        });

        console.log("🕉️ PranaVeda Master MDI Portal & Wellness Engine Initialized Successfully.");
    });

})();
