/* ==========================================================================
   PRANAVEDA - AUDIO SYNTHESIZER (WEB AUDIO API)
   ========================================================================== */
class AudioEngine {
    constructor() {
        this.ctx = null;
        this.ambientGain = null;
        this.ambientSource = null;
        this.currentAmbient = 'off';
        this.noiseBuffer = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
            this.createNoiseBuffer();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    createNoiseBuffer() {
        const bufferSize = this.ctx.sampleRate * 2;
        this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = this.noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            // Pink noise approximation for gentle natural sound
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5;
        }
    }

    playSingingBowl(freq = 432) {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        
        // Multi-harmonic rich overtone synthesis
        const harmonics = [1, 2.01, 3.02, 4.8];
        const gains = [0.45, 0.25, 0.12, 0.05];

        harmonics.forEach((h, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq * h, now);
            
            // Exponential decay envelope
            gain.gain.setValueAtTime(gains[index], now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(now);
            osc.stop(now + 3.2);
        });
    }

    playCrystalTingsha() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(2048, now);
        osc.frequency.exponentialRampToValueAtTime(1024, now + 2.0);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 2.0);
    }

    playChakraTone(freq) {
        if (bellSelect && bellSelect.value === 'off') return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        
        // Pure resonant fundamental + harmonic for crystal chakra resonance
        [1, 2].forEach((mult, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq * mult, now);
            
            const vol = i === 0 ? 0.22 : 0.08;
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(vol, now + 0.15);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(now);
            osc.stop(now + 3.8);
        });
    }

    startAmbient(type) {
        this.stopAmbient();
        if (type === 'off') return;
        this.init();
        if (!this.ctx) return;

        this.currentAmbient = type;
        const now = this.ctx.currentTime;

        if (type === 'om') {
            // 432Hz Om Binaural Drone
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const filter = this.ctx.createBiquadFilter();
            this.ambientGain = this.ctx.createGain();

            osc1.type = 'sawtooth';
            osc1.frequency.setValueAtTime(108, now); // Sub-harmonic of 432Hz
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(216, now);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(220, now);

            this.ambientGain.gain.setValueAtTime(0.001, now);
            this.ambientGain.gain.linearRampToValueAtTime(0.12, now + 2.0);

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(this.ambientGain);
            this.ambientGain.connect(this.ctx.destination);

            osc1.start(now);
            osc2.start(now);
            this.ambientSource = [osc1, osc2];
        } else if (type === 'ocean' || type === 'rain') {
            // Noise-based ocean / rain generator
            const noise = this.ctx.createBufferSource();
            noise.buffer = this.noiseBuffer;
            noise.loop = true;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(type === 'ocean' ? 300 : 800, now);
            filter.Q.setValueAtTime(type === 'ocean' ? 1.0 : 0.4, now);

            this.ambientGain = this.ctx.createGain();
            this.ambientGain.gain.setValueAtTime(0.001, now);
            this.ambientGain.gain.linearRampToValueAtTime(type === 'ocean' ? 0.18 : 0.1, now + 2.0);

            // Modulate filter for wave swoosh
            if (type === 'ocean') {
                const lfo = this.ctx.createOscillator();
                const lfoGain = this.ctx.createGain();
                lfo.frequency.setValueAtTime(0.1, now); // 10s wave cycle
                lfoGain.gain.setValueAtTime(250, now);
                lfo.connect(lfoGain);
                lfoGain.connect(filter.frequency);
                lfo.start(now);
                this.ambientSource = [noise, lfo];
            } else {
                this.ambientSource = [noise];
            }

            noise.connect(filter);
            filter.connect(this.ambientGain);
            this.ambientGain.connect(this.ctx.destination);
            noise.start(now);
        }
    }

    stopAmbient() {
        if (this.ambientGain && this.ctx) {
            const now = this.ctx.currentTime;
            this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
            setTimeout(() => {
                if (this.ambientSource) {
                    if (Array.isArray(this.ambientSource)) {
                        this.ambientSource.forEach(s => { try { s.stop(); } catch(e){} });
                    }
                    this.ambientSource = null;
                }
            }, 900);
        }
    }
}

const audio = new AudioEngine();

/* ==========================================================================
   DOM ELEMENTS & APP STATE
   ========================================================================== */
const breathSphere = document.getElementById("breathSphere");
const phaseText = document.getElementById("phaseText");
const secondsText = document.getElementById("secondsText");
const cycleText = document.getElementById("cycleText");
const totalTimeText = document.getElementById("totalTime");
const progressBar = document.getElementById("progressBar");

const patternSelect = document.getElementById("pattern");
const durationSelect = document.getElementById("duration");
const ambientSelect = document.getElementById("ambientSound");
const bellSelect = document.getElementById("bellSound");

const techniqueInfo = document.getElementById("techniqueInfo");
const techniqueBadge = document.getElementById("techniqueBadge");
const customPattern = document.getElementById("customPattern");
const nostrilGuide = document.getElementById("nostrilGuide");
const nostrilLeft = document.getElementById("nostrilLeft");
const nostrilRight = document.getElementById("nostrilRight");
const mettaGuide = document.getElementById("mettaGuide");
const visGuide = document.getElementById("visGuide");
const visIcon = document.getElementById("visIcon");
const chakraGuide = document.getElementById("chakraGuide");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const mindBtn = document.getElementById("mindBtn");

const ratingModal = document.getElementById("ratingModal");
const saveRatingBtn = document.getElementById("saveRatingBtn");
const guideModal = document.getElementById("guideModal");
const guideBtn = document.getElementById("guideBtn");
const closeGuideBtn = document.getElementById("closeGuideBtn");

const zenBtn = document.getElementById("zenBtn");
const zenExitBtn = document.getElementById("zenExitBtn");
const themeBtn = document.getElementById("themeBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

const historyDiv = document.getElementById("history");
const historyActions = document.getElementById("historyActions");
const toggleAllGroupsBtn = document.getElementById("toggleAllGroupsBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const exportCsvBtn = document.getElementById("exportCsvBtn");

/* STATE */
let phases = [];
let phaseIndex = 0;
let phaseRemaining = 0;
let totalSeconds = 600;
let remainingTotal = 600;
let cycleCount = 0;
let mindWanders = 0;
let running = false;
let timer = null;
let selectedRating = null;
let pendingSession = null;

/* TECHNIQUE DESCRIPTIONS */
const techniqueDetails = {
    "anapanasati": {
        badge: "🧘 Mindful Breath Awareness",
        info: "💡 <b>Anapanasati (Mindfulness of In-and-Out Breath):</b> Do not control or force the breath. Simply observe the natural sensation of each inhalation and exhalation at the entrance of the nostrils with calm, non-judgmental presence."
    },
    "metta": {
        badge: "💖 5-Stage Loving-Kindness Prayer",
        info: "💡 <b>Metta Bhavana (The Buddha's 5 Loving-Kindness Prayers):</b> Heart-centered meditation with no forced breathing. Focus your heart and silently recite goodwill prayers for 5 people/groups: <b>1. Me (Oneself)</b> → <b>2. A Loved One</b> → <b>3. A Neutral Person</b> → <b>4. A Conflicted Person</b> → <b>5. All Living Beings</b> in the world."
    },
    "chakra_all": {
        badge: "🌈 7-Chakra Kundalini Flow",
        info: "💡 <b>Complete 7-Chakra Alignment:</b> Ascend through the 7 energy vortexes along the spine using their primordial Bija Mantras: <b>🔴 LAM (Root)</b> → <b>🟠 VAM (Sacral)</b> → <b>🟡 RAM (Solar)</b> → <b>🟢 YAM (Heart)</b> → <b>🔵 HAM (Throat)</b> → <b>🟣 OM (Third Eye)</b> → <b>👑 AUM (Crown)</b>."
    },
    "chakra_root": {
        badge: "🔴 Root Chakra (Muladhara)",
        info: "💡 <b>Muladhara Sadhana (Mantra: LAM):</b> Focus at the base of the spine. Chanting <i>LAM</i> grounds your energy, dissolves existential fear, and establishes physical vitality, safety, and unwavering stability."
    },
    "chakra_sacral": {
        badge: "🟠 Sacral Chakra (Svadhisthana)",
        info: "💡 <b>Svadhisthana Sadhana (Mantra: VAM):</b> Focus below the navel. Chanting <i>VAM</i> awakens creative passion, emotional fluidity, sensual balance, and inner joy."
    },
    "chakra_solar": {
        badge: "🟡 Solar Plexus (Manipura)",
        info: "💡 <b>Manipura Sadhana (Mantra: RAM):</b> Focus at the upper abdomen/navel. Chanting <i>RAM</i> (or <i>RUM</i>) ignites digestive fire, iron willpower, self-confidence, and personal mastery."
    },
    "chakra_heart": {
        badge: "🟢 Heart Chakra (Anahata)",
        info: "💡 <b>Anahata Sadhana (Mantra: YAM):</b> Focus at the center of the chest. Chanting <i>YAM</i> (or <i>YUM</i>) dissolves emotional pain and grief, expanding unconditional love, empathy, and deep forgiveness."
    },
    "chakra_throat": {
        badge: "🔵 Throat Chakra (Vishuddha)",
        info: "💡 <b>Vishuddha Sadhana (Mantra: HAM):</b> Focus at the throat center. Chanting <i>HAM</i> (or <i>HUM</i>) purifies self-expression, releases suppression, and enables speaking your truth with clarity."
    },
    "chakra_thirdeye": {
        badge: "🟣 Third Eye (Ajna)",
        info: "💡 <b>Ajna Sadhana (Mantra: OM):</b> Focus between the eyebrows. Chanting <i>OM</i> sharpens intuition, clears mental fog, balances the cerebral hemispheres, and awakens higher perception."
    },
    "chakra_crown": {
        badge: "👑 Crown Chakra (Sahasrara)",
        info: "💡 <b>Sahasrara Sadhana (Mantra: AUM / Silence):</b> Focus at the crown of the head. Chanting <i>AUM</i> unites individual consciousness with universal oneness, peace, and spiritual bliss."
    },
    "vis_success": {
        badge: "🏆 Manifestation & Breakthrough",
        info: "💡 <b>Positive Breakthrough (Sankalpa Siddhi):</b> Mentally rehearse and visualize a major positive event or goal successfully accomplished. Feel the triumphant joy, celebrations, handshakes, and deep gratitude to imprint success in your nervous system."
    },
    "vis_goodnews": {
        badge: "💌 Joyful News & Blessings",
        info: "💡 <b>Receiving Good News (Subha Samachara):</b> Vividly visualize receiving an unexpected, wonderfully uplifting phone call, email, or blessing. Experience the sudden wave of relief, excitement, and heartfelt thankfulness."
    },
    "vis_harmony": {
        badge: "🌈 Harmony & Reconciliation",
        info: "💡 <b>Positive Reunion (Maitri Milana):</b> Envision a heartwarming, positive gathering or conversation where all differences dissolve into laughter, mutual respect, understanding, and warm joyful connection."
    },
    "vis_sun": {
        badge: "☀️ Solar Prana & Vitality",
        info: "💡 <b>Surya Dhyana (Golden Sunshine Meditation):</b> Visualize the radiant morning sun illuminating your third eye, washing golden healing light through your entire body, banishing fatigue and anxiety, and filling you with vibrant solar prana."
    },
    "vis_deity": {
        badge: "🛕 Sacred Grace & Protection",
        info: "💡 <b>Ishta Devata (Sacred Divine Presence):</b> Bring to mind your chosen sacred deity, golden statue, or formless divine light at your heart lotus. Receive blessings of supreme peace, unshakeable protection, and divine grace."
    },
    "vis_lotus": {
        badge: "🪷 Heart Awakening & Purity",
        info: "💡 <b>Hridaya Kamala (Blooming Heart Lotus):</b> Envision a luminous, thousand-petaled lotus unfolding gently in the center of your chest, releasing divine fragrance and filling your heart with pure, unconditional love."
    },
    "vis_cosmos": {
        badge: "🌌 Cosmic Vastness & Silence",
        info: "💡 <b>Akasha Dhyana (Cosmic Space Meditation):</b> Expand your awareness into the vast, silent night sky sprinkled with glistening diamond stars. All worldly tension dissolves into the infinite cosmos."
    },
    "vis_ocean": {
        badge: "🌊 Emotional Cleansing & Flow",
        info: "💡 <b>Samudra Dhyana (Ocean of Serenity):</b> Visualize sitting beside a calm turquoise ocean. As warm, clear waves roll in and out, feel them washing away mental fatigue, negative emotions, and bodily tension."
    },
    "vis_mountain": {
        badge: "🏔️ Unshakable Poise & Grounding",
        info: "💡 <b>Meru Dhyana (Mountain Meditation):</b> Visualize a mighty, snow-capped sacred mountain standing serene and unmoved amidst passing storms and winds. Cultivate unshakable inner poise and strength."
    },
    "anulom": {
        badge: "🌙 Ida & ☀️ Pingala Balance",
        info: "💡 <b>Anulom Vilom (Nadi Shodhana):</b> Purifies the solar and lunar energy channels. Practice with <i>Vishnu Mudra</i> using your right thumb and ring finger."
    },
    "bhramari": {
        badge: "🐝 Vibrational Calming",
        info: "💡 <b>Bhramari:</b> Inhale deeply, then create a gentle humming sound like a honeybee on exhalation. Activates the vagus nerve and soothes the mind."
    },
    "kapalbhati": {
        badge: "🔥 Prana Fire & Detox",
        info: "💡 <b>Kapalabhati:</b> Rhythmic active exhalations with passive inhalations. Cleanses the respiratory channels and awakens mental vigor."
    },
    "sheetali": {
        badge: "❄️ Cooling Breath",
        info: "💡 <b>Sheetali:</b> Roll your tongue into a tube and inhale cool air through it. Retain softly, then exhale warm air gently through both nostrils."
    },
    "ujjayi": {
        badge: "🌊 Whispering Ocean",
        info: "💡 <b>Ujjayi:</b> Gentle diaphragmatic breath with a soft throat constriction. Produces an oceanic sound that anchors your awareness."
    },
    "4-6": {
        badge: "🌿 Vagal Relaxation",
        info: "💡 <b>4–6 Ratio:</b> Extended exhalation triggers parasympathetic relaxation, lowering stress hormones."
    },
    "box": {
        badge: "🔲 Sama Vritti (Box)",
        info: "💡 <b>Equal Flow (4-4-4-4):</b> Creates absolute mental equilibrium and sharp laser focus."
    },
    "4-7-8": {
        badge: "💤 Natural Tranquilizer",
        info: "💡 <b>4-7-8 Rhythm:</b> Calms racing thoughts and induces peaceful rest."
    },
    "5-5": {
        badge: "🧘 Heart Coherence",
        info: "💡 <b>5–5 Resonance:</b> 6 breaths per minute optimizes Heart Rate Variability (HRV)."
    },
    "custom": {
        badge: "⚙️ Custom Sadhana",
        info: "💡 <b>Custom Ratio:</b> Craft your personalized Puraka (Inhale), Kumbhaka (Hold), and Rechaka (Exhale) sequence."
    }
};

/* ==========================================================================
   PRANAYAMA SEQUENCES BUILDER
   ========================================================================== */
function getPattern() {
    const selected = patternSelect.value;

    if (selected === "anapanasati") {
        // Mindful natural breath observation: Gentle natural inhale -> Gentle natural exhale
        return [
            { name: "OBSERVE IN-BREATH", seconds: 4, scale: 1.45, color: "var(--accent-cyan)", glow: "var(--accent-glow)" },
            { name: "OBSERVE OUT-BREATH", seconds: 5, scale: 1.0, color: "var(--accent-purple)", glow: "var(--accent-purple-glow)" }
        ];
    }

    if (selected === "metta") {
        // The Buddha's 5 Loving-Kindness Prayers (Mettā Bhāvanā):
        // 1. Me (Oneself)
        // 2. A Loved One / Benefactor
        // 3. A Neutral Person
        // 4. A Conflicted Person
        // 5. All Living Beings in the World
        return [
            // Stage 1: Me (Oneself)
            { name: "1. ME (ONESELF): BRING YOURSELF TO MIND", seconds: 4, scale: 1.35, color: "var(--accent-rose)", glow: "rgba(214, 100, 127, 0.4)", mettaStage: 1 },
            { name: "1. ME: \"May I be happy, peaceful & safe\"", seconds: 6, scale: 1.0, color: "var(--accent-rose)", glow: "rgba(214, 100, 127, 0.3)", mettaStage: 1 },

            // Stage 2: Loved One / Benefactor
            { name: "2. LOVED ONE: VISUALIZE A LOVED ONE", seconds: 4, scale: 1.35, color: "var(--accent-gold)", glow: "var(--accent-gold-glow)", mettaStage: 2 },
            { name: "2. LOVED ONE: \"May you be joyful, healthy & safe\"", seconds: 6, scale: 1.0, color: "var(--accent-gold)", glow: "var(--accent-gold-glow)", mettaStage: 2 },

            // Stage 3: Neutral Person
            { name: "3. NEUTRAL: VISUALIZE AN ACQUAINTANCE", seconds: 4, scale: 1.35, color: "var(--accent-cyan)", glow: "var(--accent-glow)", mettaStage: 3 },
            { name: "3. NEUTRAL: \"May you live with ease & peace\"", seconds: 6, scale: 1.0, color: "var(--accent-cyan)", glow: "var(--accent-glow)", mettaStage: 3 },

            // Stage 4: Conflicted / Difficult Person
            { name: "4. CONFLICTED: BRING TO MIND & FORGIVE", seconds: 4, scale: 1.35, color: "var(--accent-purple)", glow: "var(--accent-purple-glow)", mettaStage: 4 },
            { name: "4. CONFLICTED: \"May you find peace & healing\"", seconds: 6, scale: 1.0, color: "var(--accent-purple)", glow: "var(--accent-purple-glow)", mettaStage: 4 },

            // Stage 5: All Living Beings in the World
            { name: "5. ALL WORLD: EXPAND GOODWILL TO ALL BEINGS", seconds: 4, scale: 1.45, color: "#2ea879", glow: "rgba(46, 168, 121, 0.4)", mettaStage: 5 },
            { name: "5. ALL WORLD: \"May all beings be happy & free\"", seconds: 6, scale: 1.0, color: "#2ea879", glow: "rgba(46, 168, 121, 0.3)", mettaStage: 5 }
        ];
    }

    if (selected === "chakra_all") {
        // Complete 7-Chakra Alignment (Muladhara to Sahasrara): LAM VAM RAM YAM HAM OM AUM
        return [
            // 1. Root Chakra (Muladhara) - LAM
            { name: "1. ROOT (BASE OF SPINE): FOCUS & GROUND", seconds: 4, scale: 1.35, color: "#dc2626", glow: "rgba(220, 38, 38, 0.55)", chakraStage: 1, visIcon: "🔴", chakraFreq: 396 },
            { name: "1. ROOT MANTRA: \"LAM... LAM... LAM...\"", seconds: 6, scale: 1.0, color: "#dc2626", glow: "rgba(220, 38, 38, 0.45)", chakraStage: 1, visIcon: "🔴", chakraFreq: 396 },

            // 2. Sacral Chakra (Svadhisthana) - VAM
            { name: "2. SACRAL (PELVIC AREA): EMOTIONAL FLOW", seconds: 4, scale: 1.35, color: "#ea580c", glow: "rgba(234, 88, 12, 0.55)", chakraStage: 2, visIcon: "🟠", chakraFreq: 417 },
            { name: "2. SACRAL MANTRA: \"VAM... VAM... VAM...\"", seconds: 6, scale: 1.0, color: "#ea580c", glow: "rgba(234, 88, 12, 0.45)", chakraStage: 2, visIcon: "🟠", chakraFreq: 417 },

            // 3. Solar Plexus (Manipura) - RAM
            { name: "3. SOLAR PLEXUS (NAVEL): WILLPOWER & POWER", seconds: 4, scale: 1.35, color: "#eab308", glow: "rgba(234, 179, 8, 0.55)", chakraStage: 3, visIcon: "🟡", chakraFreq: 528 },
            { name: "3. SOLAR MANTRA: \"RAM... RAM... RAM...\"", seconds: 6, scale: 1.0, color: "#eab308", glow: "rgba(234, 179, 8, 0.45)", chakraStage: 3, visIcon: "🟡", chakraFreq: 528 },

            // 4. Heart Chakra (Anahata) - YAM
            { name: "4. HEART (CHEST CENTER): LOVE & HEALING", seconds: 4, scale: 1.35, color: "#10b981", glow: "rgba(16, 185, 129, 0.55)", chakraStage: 4, visIcon: "🟢", chakraFreq: 639 },
            { name: "4. HEART MANTRA: \"YAM... YAM... YAM...\"", seconds: 6, scale: 1.0, color: "#10b981", glow: "rgba(16, 185, 129, 0.45)", chakraStage: 4, visIcon: "🟢", chakraFreq: 639 },

            // 5. Throat Chakra (Vishuddha) - HAM
            { name: "5. THROAT (THROAT CENTER): TRUTH & EXPRESSION", seconds: 4, scale: 1.35, color: "#06b6d4", glow: "rgba(6, 182, 212, 0.55)", chakraStage: 5, visIcon: "🔵", chakraFreq: 741 },
            { name: "5. THROAT MANTRA: \"HAM... HAM... HAM...\"", seconds: 6, scale: 1.0, color: "#06b6d4", glow: "rgba(6, 182, 212, 0.45)", chakraStage: 5, visIcon: "🔵", chakraFreq: 741 },

            // 6. Third Eye Chakra (Ajna) - OM
            { name: "6. THIRD EYE (MID-EYEBROW): INTUITION & CLARITY", seconds: 4, scale: 1.35, color: "#6366f1", glow: "rgba(99, 102, 241, 0.55)", chakraStage: 6, visIcon: "🟣", chakraFreq: 852 },
            { name: "6. THIRD EYE MANTRA: \"OM... OM... OM...\"", seconds: 6, scale: 1.0, color: "#6366f1", glow: "rgba(99, 102, 241, 0.45)", chakraStage: 6, visIcon: "🟣", chakraFreq: 852 },

            // 7. Crown Chakra (Sahasrara) - AUM
            { name: "7. CROWN (TOP OF HEAD): ONENESS & BLISS", seconds: 4, scale: 1.45, color: "#a855f7", glow: "rgba(168, 85, 247, 0.6)", chakraStage: 7, visIcon: "👑", chakraFreq: 963 },
            { name: "7. CROWN MANTRA: \"AUM... SILENT PEACE...\"", seconds: 6, scale: 1.0, color: "#a855f7", glow: "rgba(168, 85, 247, 0.45)", chakraStage: 7, visIcon: "👑", chakraFreq: 963 }
        ];
    }

    if (selected === "chakra_root") {
        return [
            { name: "1. ROOT: FOCUS AT BASE OF SPINE", seconds: 4, scale: 1.35, color: "#dc2626", glow: "rgba(220, 38, 38, 0.55)", chakraStage: 1, visIcon: "🔴", chakraFreq: 396 },
            { name: "1. CHANT: \"LAM... (I Am Safe & Grounded)\"", seconds: 6, scale: 1.0, color: "#dc2626", glow: "rgba(220, 38, 38, 0.45)", chakraStage: 1, visIcon: "🔴", chakraFreq: 396 }
        ];
    }

    if (selected === "chakra_sacral") {
        return [
            { name: "2. SACRAL: FOCUS BELOW NAVEL", seconds: 4, scale: 1.35, color: "#ea580c", glow: "rgba(234, 88, 12, 0.55)", chakraStage: 2, visIcon: "🟠", chakraFreq: 417 },
            { name: "2. CHANT: \"VAM... (I Am Creative & Flowing)\"", seconds: 6, scale: 1.0, color: "#ea580c", glow: "rgba(234, 88, 12, 0.45)", chakraStage: 2, visIcon: "🟠", chakraFreq: 417 }
        ];
    }

    if (selected === "chakra_solar") {
        return [
            { name: "3. SOLAR PLEXUS: FOCUS AT NAVEL", seconds: 4, scale: 1.35, color: "#eab308", glow: "rgba(234, 179, 8, 0.55)", chakraStage: 3, visIcon: "🟡", chakraFreq: 528 },
            { name: "3. CHANT: \"RAM... (I Am Powerful & Confident)\"", seconds: 6, scale: 1.0, color: "#eab308", glow: "rgba(234, 179, 8, 0.45)", chakraStage: 3, visIcon: "🟡", chakraFreq: 528 }
        ];
    }

    if (selected === "chakra_heart") {
        return [
            { name: "4. HEART: FOCUS AT CHEST CENTER", seconds: 4, scale: 1.35, color: "#10b981", glow: "rgba(16, 185, 129, 0.55)", chakraStage: 4, visIcon: "🟢", chakraFreq: 639 },
            { name: "4. CHANT: \"YAM... (I Am Loving & Open-Hearted)\"", seconds: 6, scale: 1.0, color: "#10b981", glow: "rgba(16, 185, 129, 0.45)", chakraStage: 4, visIcon: "🟢", chakraFreq: 639 }
        ];
    }

    if (selected === "chakra_throat") {
        return [
            { name: "5. THROAT: FOCUS AT THROAT CENTER", seconds: 4, scale: 1.35, color: "#06b6d4", glow: "rgba(6, 182, 212, 0.55)", chakraStage: 5, visIcon: "🔵", chakraFreq: 741 },
            { name: "5. CHANT: \"HAM... (I Speak My Truth Clearly)\"", seconds: 6, scale: 1.0, color: "#06b6d4", glow: "rgba(6, 182, 212, 0.45)", chakraStage: 5, visIcon: "🔵", chakraFreq: 741 }
        ];
    }

    if (selected === "chakra_thirdeye") {
        return [
            { name: "6. THIRD EYE: FOCUS AT MID-EYEBROW", seconds: 4, scale: 1.35, color: "#6366f1", glow: "rgba(99, 102, 241, 0.55)", chakraStage: 6, visIcon: "🟣", chakraFreq: 852 },
            { name: "6. CHANT: \"OM... (I Am Intuitive & Clear)\"", seconds: 6, scale: 1.0, color: "#6366f1", glow: "rgba(99, 102, 241, 0.45)", chakraStage: 6, visIcon: "🟣", chakraFreq: 852 }
        ];
    }

    if (selected === "chakra_crown") {
        return [
            { name: "7. CROWN: FOCUS AT TOP OF HEAD", seconds: 4, scale: 1.45, color: "#a855f7", glow: "rgba(168, 85, 247, 0.6)", chakraStage: 7, visIcon: "👑", chakraFreq: 963 },
            { name: "7. CHANT: \"AUM... (I Am One With Universal Peace)\"", seconds: 6, scale: 1.0, color: "#a855f7", glow: "rgba(168, 85, 247, 0.45)", chakraStage: 7, visIcon: "👑", chakraFreq: 963 }
        ];
    }

    if (selected === "vis_success") {
        // Positive Incident: Breakthrough & Victory (Sankalpa Siddhi)
        return [
            { name: "1. SET THE SCENE: Visualize your major positive breakthrough unfolding", seconds: 6, scale: 1.25, color: "#f59e0b", glow: "rgba(245, 158, 11, 0.5)", visStage: 1, visIcon: "🏆" },
            { name: "2. SEE DETAILS: See smiling faces, handshakes & congratulations", seconds: 6, scale: 1.35, color: "#fbbf24", glow: "rgba(251, 191, 36, 0.55)", visStage: 2, visIcon: "🏆" },
            { name: "3. FEEL THE EMOTION: Triumphant joy, relief & deep gratitude fill your chest", seconds: 6, scale: 1.45, color: "#f59e0b", glow: "rgba(245, 158, 11, 0.6)", visStage: 3, visIcon: "🏆" },
            { name: "4. ANCHOR SUCCESS: Feel deep certainty that this positive reality is yours", seconds: 6, scale: 1.2, color: "#d97706", glow: "rgba(217, 119, 6, 0.45)", visStage: 4, visIcon: "🏆" }
        ];
    }

    if (selected === "vis_goodnews") {
        // Positive Incident: Joyful News & Blessings (Subha Samachara)
        return [
            { name: "1. INCOMING NEWS: Visualize receiving an unexpected, joyful positive message", seconds: 6, scale: 1.25, color: "#10b981", glow: "rgba(16, 185, 129, 0.5)", visStage: 1, visIcon: "💌" },
            { name: "2. SEE THE WORDS: Read the wonderful good news & hear celebratory words", seconds: 6, scale: 1.35, color: "#34d399", glow: "rgba(52, 211, 153, 0.55)", visStage: 2, visIcon: "💌" },
            { name: "3. OVERFLOWING JOY: A glorious wave of happiness & relief floods your heart", seconds: 6, scale: 1.45, color: "#10b981", glow: "rgba(16, 185, 129, 0.6)", visStage: 3, visIcon: "💌" },
            { name: "4. EMBRACE ABUNDANCE: Rest in profound thankfulness, lightness & peace", seconds: 6, scale: 1.2, color: "#059669", glow: "rgba(5, 150, 105, 0.45)", visStage: 4, visIcon: "💌" }
        ];
    }

    if (selected === "vis_harmony") {
        // Positive Incident: Harmony & Warm Connection (Maitri Milana)
        return [
            { name: "1. GATHERING: Visualize meeting with people in warm, heartfelt harmony", seconds: 6, scale: 1.25, color: "#ec4899", glow: "rgba(236, 72, 153, 0.5)", visStage: 1, visIcon: "🌈" },
            { name: "2. EYE CONNECTION: See kind eyes, radiant smiles & relaxed comfortable posture", seconds: 6, scale: 1.35, color: "#f472b6", glow: "rgba(244, 114, 182, 0.55)", visStage: 2, visIcon: "🌈" },
            { name: "3. FEEL HARMONY: All past tension melts completely into laughter & mutual ease", seconds: 6, scale: 1.45, color: "#ec4899", glow: "rgba(236, 72, 153, 0.6)", visStage: 3, visIcon: "🌈" },
            { name: "4. RADIANT BOND: Rest in sweet unity, peace, and deep human connection", seconds: 6, scale: 1.2, color: "#db2777", glow: "rgba(219, 39, 119, 0.45)", visStage: 4, visIcon: "🌈" }
        ];
    }

    if (selected === "vis_sun") {
        // Surya Dhyana: Golden Sunshine & Inner Vitality
        return [
            { name: "1. INVOKE: Visualize the radiant Golden Sun rising before you", seconds: 6, scale: 1.25, color: "#f59e0b", glow: "rgba(245, 158, 11, 0.5)", visStage: 1, visIcon: "☀️" },
            { name: "2. FEEL WARMTH: Golden rays touch your forehead & chest", seconds: 6, scale: 1.35, color: "#fbbf24", glow: "rgba(251, 191, 36, 0.55)", visStage: 2, visIcon: "☀️" },
            { name: "3. ABSORB LIGHT: Divine solar prana energizes every single cell", seconds: 6, scale: 1.45, color: "#f59e0b", glow: "rgba(245, 158, 11, 0.6)", visStage: 3, visIcon: "☀️" },
            { name: "4. RADIATE: You are shining bright, warm & full of vitality", seconds: 6, scale: 1.2, color: "#d97706", glow: "rgba(217, 119, 6, 0.45)", visStage: 4, visIcon: "☀️" }
        ];
    }

    if (selected === "vis_deity") {
        // Ishta Devata: Sacred Divine Presence & Golden Statue
        return [
            { name: "1. INVOCATION: Bring the Sacred Divine Presence to your heart", seconds: 6, scale: 1.25, color: "#eab308", glow: "rgba(234, 179, 8, 0.5)", visStage: 1, visIcon: "🛕" },
            { name: "2. SACRED FORM: See the serene, compassionate golden visage", seconds: 6, scale: 1.35, color: "#fbbf24", glow: "rgba(251, 191, 36, 0.55)", visStage: 2, visIcon: "🛕" },
            { name: "3. RECEIVE GRACE: White-gold shower of divine blessings & peace", seconds: 6, scale: 1.45, color: "#eab308", glow: "rgba(234, 179, 8, 0.6)", visStage: 3, visIcon: "🛕" },
            { name: "4. ONENESS: Rest safe, protected & enveloped in eternal love", seconds: 6, scale: 1.2, color: "#ca8a04", glow: "rgba(202, 138, 4, 0.45)", visStage: 4, visIcon: "🛕" }
        ];
    }

    if (selected === "vis_lotus") {
        // Hridaya Kamala: Blooming Heart Lotus
        return [
            { name: "1. HEART SPACE: Rest awareness gently at your heart center", seconds: 6, scale: 1.25, color: "#ec4899", glow: "rgba(236, 72, 153, 0.5)", visStage: 1, visIcon: "🪷" },
            { name: "2. LOTUS BLOOM: See a luminous sacred lotus unfolding soft petals", seconds: 6, scale: 1.35, color: "#f472b6", glow: "rgba(244, 114, 182, 0.55)", visStage: 2, visIcon: "🪷" },
            { name: "3. RADIATE LOVE: Sweet fragrance & divine warmth fill your being", seconds: 6, scale: 1.45, color: "#ec4899", glow: "rgba(236, 72, 153, 0.6)", visStage: 3, visIcon: "🪷" },
            { name: "4. PURE STILLNESS: Your heart is completely crystal-clear & free", seconds: 6, scale: 1.2, color: "#db2777", glow: "rgba(219, 39, 119, 0.45)", visStage: 4, visIcon: "🪷" }
        ];
    }

    if (selected === "vis_cosmos") {
        // Akasha Dhyana: Cosmic Starlight & Sky
        return [
            { name: "1. EXPAND: Look into the infinite boundless dark blue night sky", seconds: 6, scale: 1.25, color: "#8b5cf6", glow: "rgba(139, 92, 246, 0.5)", visStage: 1, visIcon: "🌌" },
            { name: "2. STARLIGHT: See countless gleaming diamond stars shimmering", seconds: 6, scale: 1.35, color: "#a78bfa", glow: "rgba(167, 139, 250, 0.55)", visStage: 2, visIcon: "🌌" },
            { name: "3. DISSOLVE: All thoughts & tension dissolve into cosmic silence", seconds: 6, scale: 1.45, color: "#8b5cf6", glow: "rgba(139, 92, 246, 0.6)", visStage: 3, visIcon: "🌌" },
            { name: "4. BOUNDLESS: You are as vast, serene & eternal as the universe", seconds: 6, scale: 1.2, color: "#7c3aed", glow: "rgba(124, 58, 237, 0.45)", visStage: 4, visIcon: "🌌" }
        ];
    }

    if (selected === "vis_ocean") {
        // Samudra Dhyana: Ocean of Serenity & Healing Waters
        return [
            { name: "1. OCEAN VIEW: Visualize crystal-clear turquoise ocean waters", seconds: 6, scale: 1.25, color: "#06b6d4", glow: "rgba(6, 182, 212, 0.5)", visStage: 1, visIcon: "🌊" },
            { name: "2. GENTLE WAVES: Warm crystal water softly rolling over your feet", seconds: 6, scale: 1.35, color: "#22d3ee", glow: "rgba(34, 211, 238, 0.55)", visStage: 2, visIcon: "🌊" },
            { name: "3. WASH AWAY: The wave draws away all stress, fatigue & worry", seconds: 6, scale: 1.45, color: "#06b6d4", glow: "rgba(6, 182, 212, 0.6)", visStage: 3, visIcon: "🌊" },
            { name: "4. STILL WATERS: Rest in perfect stillness, clarity & peace", seconds: 6, scale: 1.2, color: "#0891b2", glow: "rgba(8, 145, 178, 0.45)", visStage: 4, visIcon: "🌊" }
        ];
    }

    if (selected === "vis_mountain") {
        // Meru Dhyana: Mountain of Stillness & Unshakable Strength
        return [
            { name: "1. MAJESTIC FORM: Visualize a grand, snow-capped sacred mountain", seconds: 6, scale: 1.25, color: "#10b981", glow: "rgba(16, 185, 129, 0.5)", visStage: 1, visIcon: "🏔️" },
            { name: "2. ROOTED BASE: Feel your body grounded like solid granite rock", seconds: 6, scale: 1.35, color: "#34d399", glow: "rgba(52, 211, 153, 0.55)", visStage: 2, visIcon: "🏔️" },
            { name: "3. WEATHER STORMS: Clouds & winds pass, but mountain is unmoved", seconds: 6, scale: 1.45, color: "#10b981", glow: "rgba(16, 185, 129, 0.6)", visStage: 3, visIcon: "🏔️" },
            { name: "4. UNSHAKABLE: Rest in supreme dignity, stillness & quiet strength", seconds: 6, scale: 1.2, color: "#059669", glow: "rgba(5, 150, 105, 0.45)", visStage: 4, visIcon: "🏔️" }
        ];
    }

    if (selected === "anulom") {
        // Alternate nostril sequence: Inhale L -> Hold -> Exhale R -> Inhale R -> Hold -> Exhale L
        return [
            { name: "INHALE LEFT", seconds: 4, scale: 1.6, color: "var(--accent-cyan)", glow: "var(--accent-glow)", nostril: "left" },
            { name: "HOLD (KUMBHAKA)", seconds: 4, scale: 1.6, color: "var(--accent-gold)", glow: "var(--accent-gold-glow)", nostril: "both" },
            { name: "EXHALE RIGHT", seconds: 4, scale: 1.0, color: "var(--accent-purple)", glow: "var(--accent-purple-glow)", nostril: "right" },
            { name: "INHALE RIGHT", seconds: 4, scale: 1.6, color: "var(--accent-cyan)", glow: "var(--accent-glow)", nostril: "right" },
            { name: "HOLD (KUMBHAKA)", seconds: 4, scale: 1.6, color: "var(--accent-gold)", glow: "var(--accent-gold-glow)", nostril: "both" },
            { name: "EXHALE LEFT", seconds: 4, scale: 1.0, color: "var(--accent-purple)", glow: "var(--accent-purple-glow)", nostril: "left" }
        ];
    }

    if (selected === "bhramari") {
        return [
            { name: "DEEP INHALE", seconds: 4, scale: 1.65, color: "var(--accent-cyan)", glow: "var(--accent-glow)" },
            { name: "HUMMING EXHALE", seconds: 8, scale: 1.0, color: "var(--accent-purple)", glow: "var(--accent-purple-glow)" }
        ];
    }

    if (selected === "kapalbhati") {
        return [
            { name: "PUMP EXHALE", seconds: 1, scale: 1.15, color: "var(--accent-gold)", glow: "var(--accent-gold-glow)" },
            { name: "PASSIVE INHALE", seconds: 1, scale: 1.35, color: "var(--accent-cyan)", glow: "var(--accent-glow)" }
        ];
    }

    if (selected === "sheetali") {
        return [
            { name: "COOL INHALE", seconds: 5, scale: 1.65, color: "var(--accent-cyan)", glow: "var(--accent-glow)" },
            { name: "HOLD SOFTLY", seconds: 3, scale: 1.5, color: "var(--accent-gold)", glow: "var(--accent-gold-glow)" },
            { name: "WARM EXHALE", seconds: 6, scale: 1.0, color: "var(--accent-purple)", glow: "var(--accent-purple-glow)" }
        ];
    }

    if (selected === "ujjayi") {
        return [
            { name: "OCEAN INHALE", seconds: 5, scale: 1.65, color: "var(--accent-cyan)", glow: "var(--accent-glow)" },
            { name: "OCEAN EXHALE", seconds: 5, scale: 1.0, color: "var(--accent-purple)", glow: "var(--accent-purple-glow)" }
        ];
    }

    if (selected === "4-6") {
        return [
            { name: "INHALE", seconds: 4, scale: 1.65, color: "var(--accent-cyan)", glow: "var(--accent-glow)" },
            { name: "EXHALE", seconds: 6, scale: 1.0, color: "var(--accent-purple)", glow: "var(--accent-purple-glow)" }
        ];
    }

    if (selected === "box") {
        return [
            { name: "INHALE", seconds: 4, scale: 1.65, color: "var(--accent-cyan)", glow: "var(--accent-glow)" },
            { name: "HOLD (IN)", seconds: 4, scale: 1.65, color: "var(--accent-gold)", glow: "var(--accent-gold-glow)" },
            { name: "EXHALE", seconds: 4, scale: 1.0, color: "var(--accent-purple)", glow: "var(--accent-purple-glow)" },
            { name: "HOLD (OUT)", seconds: 4, scale: 1.0, color: "var(--accent-rose)", glow: "rgba(214, 100, 127, 0.35)" }
        ];
    }

    if (selected === "4-7-8") {
        return [
            { name: "INHALE", seconds: 4, scale: 1.65, color: "var(--accent-cyan)", glow: "var(--accent-glow)" },
            { name: "HOLD", seconds: 7, scale: 1.5, color: "var(--accent-gold)", glow: "var(--accent-gold-glow)" },
            { name: "EXHALE", seconds: 8, scale: 1.0, color: "var(--accent-purple)", glow: "var(--accent-purple-glow)" }
        ];
    }

    if (selected === "5-5") {
        return [
            { name: "INHALE", seconds: 5, scale: 1.65, color: "var(--accent-cyan)", glow: "var(--accent-glow)" },
            { name: "EXHALE", seconds: 5, scale: 1.0, color: "var(--accent-purple)", glow: "var(--accent-purple-glow)" }
        ];
    }

    if (selected === "custom") {
        const inh = Math.max(1, Number(document.getElementById("customInhale").value) || 4);
        const h1 = Math.max(0, Number(document.getElementById("customHold1").value) || 0);
        const exh = Math.max(1, Number(document.getElementById("customExhale").value) || 4);
        const h2 = Math.max(0, Number(document.getElementById("customHold2").value) || 0);

        const list = [];
        list.push({ name: "INHALE", seconds: inh, scale: 1.65, color: "var(--accent-cyan)", glow: "var(--accent-glow)" });
        if (h1 > 0) list.push({ name: "HOLD (IN)", seconds: h1, scale: 1.65, color: "var(--accent-gold)", glow: "var(--accent-gold-glow)" });
        list.push({ name: "EXHALE", seconds: exh, scale: 1.0, color: "var(--accent-purple)", glow: "var(--accent-purple-glow)" });
        if (h2 > 0) list.push({ name: "HOLD (OUT)", seconds: h2, scale: 1.0, color: "var(--accent-rose)", glow: "rgba(214, 100, 127, 0.35)" });
        return list;
    }

    return [];
}

/* TIME FORMATTING */
function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

/* ==========================================================================
   ANIMATION & PHASE RUNNER
   ========================================================================== */
function animateSphere(scale, duration, color, glow) {
    document.documentElement.style.setProperty('--phase-color', color);
    document.documentElement.style.setProperty('--phase-glow', glow);
    breathSphere.style.transition = `transform ${duration}s ease-in-out`;
    requestAnimationFrame(() => {
        breathSphere.style.transform = `scale(${scale})`;
    });
}

function playPhaseBell() {
    const bellType = bellSelect.value;
    if (bellType === 'bowl') audio.playSingingBowl(432);
    else if (bellType === 'bell') audio.playCrystalTingsha();
}

function updatePhase() {
    if (!phases.length) return;
    const curr = phases[phaseIndex];
    phaseRemaining = curr.seconds;

    phaseText.textContent = curr.name;
    secondsText.textContent = Math.ceil(phaseRemaining);

    // Update Nostril guide if applicable
    if (curr.nostril) {
        nostrilGuide.classList.add("active");
        nostrilLeft.classList.toggle("active", curr.nostril === "left" || curr.nostril === "both");
        nostrilRight.classList.toggle("active", curr.nostril === "right" || curr.nostril === "both");
    } else {
        nostrilGuide.classList.remove("active");
    }

    // Update Metta 5-Stage visual guide if applicable
    if (curr.mettaStage) {
        mettaGuide.classList.add("active");
        for (let i = 1; i <= 5; i++) {
            const pill = document.getElementById(`mettaStage${i}`);
            if (pill) pill.classList.toggle("active", curr.mettaStage === i);
        }
    } else {
        mettaGuide.classList.remove("active");
    }

    // Update Visualization 4-Stage Guide & Icon if applicable
    if (curr.visStage) {
        visGuide.classList.add("active");
        for (let i = 1; i <= 4; i++) {
            const pill = document.getElementById(`visStage${i}`);
            if (pill) pill.classList.toggle("active", curr.visStage === i);
        }
        if (curr.visIcon) {
            visIcon.textContent = curr.visIcon;
            visIcon.style.display = "block";
        } else {
            visIcon.style.display = "none";
        }
    } else {
        visGuide.classList.remove("active");
        if (!curr.chakraStage) visIcon.style.display = "none";
    }

    // Update Chakra 7-Stage visual guide if applicable
    if (curr.chakraStage) {
        chakraGuide.classList.add("active");
        for (let i = 1; i <= 7; i++) {
            const pill = document.getElementById(`chakraStage${i}`);
            if (pill) pill.classList.toggle("active", curr.chakraStage === i);
        }
        if (curr.visIcon) {
            visIcon.textContent = curr.visIcon;
            visIcon.style.display = "block";
        }
    } else {
        chakraGuide.classList.remove("active");
    }

    animateSphere(curr.scale, curr.seconds, curr.color, curr.glow);
    if (curr.chakraFreq && bellSelect.value !== 'off') {
        audio.playChakraTone(curr.chakraFreq);
    } else {
        playPhaseBell();
    }
}

function nextPhase() {
    phaseIndex++;
    if (phaseIndex >= phases.length) {
        phaseIndex = 0;
        cycleCount++;
        cycleText.textContent = `Cycle ${cycleCount}`;
    }
    updatePhase();
}

function tick() {
    if (!running) return;

    remainingTotal--;
    totalTimeText.textContent = formatTime(remainingTotal);

    const elapsed = totalSeconds - remainingTotal;
    const pct = Math.min(100, (elapsed / totalSeconds) * 100);
    progressBar.style.width = `${pct}%`;

    if (phaseRemaining > 1) {
        phaseRemaining--;
        secondsText.textContent = Math.ceil(phaseRemaining);
    } else {
        nextPhase();
    }

    if (remainingTotal <= 0) {
        completeSession();
    }
}

function startSession() {
    if (running) return;

    audio.init();
    audio.startAmbient(ambientSelect.value);

    if (!phases.length) {
        phases = getPattern();
        if (!phases.length) {
            alert("Please configure a valid breathing ratio.");
            return;
        }
    }

    running = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;

    if (phaseRemaining <= 0) {
        updatePhase();
    }

    timer = setInterval(tick, 1000);
}

function pauseSession() {
    if (!running) return;
    running = false;
    clearInterval(timer);
    timer = null;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    audio.stopAmbient();
}

function resetSession() {
    clearInterval(timer);
    timer = null;
    running = false;
    audio.stopAmbient();

    totalSeconds = Number(durationSelect.value) * 60;
    remainingTotal = totalSeconds;
    phases = getPattern();
    phaseIndex = 0;
    phaseRemaining = 0;
    cycleCount = 0;
    mindWanders = 0;

    startBtn.disabled = false;
    pauseBtn.disabled = true;

    nostrilGuide.classList.remove("active");
    mettaGuide.classList.remove("active");
    visGuide.classList.remove("active");
    chakraGuide.classList.remove("active");
    visIcon.style.display = "none";

    phaseText.textContent = "READY";
    secondsText.textContent = Math.ceil(totalSeconds / 60);
    cycleText.textContent = "Cycle 0";
    totalTimeText.textContent = formatTime(totalSeconds);
    progressBar.style.width = "0%";
    mindBtn.textContent = "🧠 Mind Wandered (0)";

    breathSphere.style.transition = "none";
    breathSphere.style.transform = "scale(1)";
    void breathSphere.offsetWidth;
}

function completeSession() {
    pauseSession();
    remainingTotal = 0;
    totalTimeText.textContent = "00:00";
    progressBar.style.width = "100%";

    breathSphere.style.transition = "transform 0.8s ease";
    breathSphere.style.transform = "scale(1)";
    phaseText.textContent = "COMPLETE";
    secondsText.textContent = "✓";

    if (bellSelect.value !== 'off') {
        audio.playSingingBowl(528); // 528Hz Solfeggio frequency for completion
    }

    pendingSession = {
        date: new Date().toISOString(),
        duration: Number(durationSelect.value),
        pattern: patternSelect.value,
        mindWanders,
        rating: null
    };

    ratingModal.classList.add("show");
}

/* ==========================================================================
   EVENT HANDLERS & RATINGS
   ========================================================================== */
// Preferences Persistence (Combobox always defaults to 4-6 deep relaxation)
patternSelect.value = "4-6";
localStorage.setItem("pranaveda_pattern", "4-6");
const initialDetails = techniqueDetails["4-6"];
techniqueBadge.textContent = initialDetails.badge;
techniqueInfo.innerHTML = `<div>${initialDetails.info}</div>`;
customPattern.classList.remove("show");

const savedAmbient = localStorage.getItem("pranaveda_ambientSound") || "off";
const savedBell = localStorage.getItem("pranaveda_bellSound") || "off";
ambientSelect.value = savedAmbient;
bellSelect.value = savedBell;

breathSphere.addEventListener("click", () => {
    if (running) pauseSession();
    else startSession();
});

startBtn.addEventListener("click", startSession);
pauseBtn.addEventListener("click", pauseSession);
resetBtn.addEventListener("click", resetSession);

mindBtn.addEventListener("click", () => {
    if (!running) return;
    mindWanders++;
    mindBtn.textContent = `🧠 Mind Wandered (${mindWanders})`;
});

// Dynamic Technique Info Update
patternSelect.addEventListener("change", () => {
    const val = patternSelect.value;
    localStorage.setItem("pranaveda_pattern", val);
    customPattern.classList.toggle("show", val === "custom");
    
    const details = techniqueDetails[val] || techniqueDetails["4-6"];
    techniqueBadge.textContent = details.badge;
    techniqueInfo.innerHTML = `<div>${details.info}</div>`;
    
    if (!running) resetSession();
});

durationSelect.addEventListener("change", () => {
    if (!running) resetSession();
});

ambientSelect.addEventListener("change", () => {
    localStorage.setItem("pranaveda_ambientSound", ambientSelect.value);
    if (running) {
        audio.startAmbient(ambientSelect.value);
    }
});

bellSelect.addEventListener("change", () => {
    localStorage.setItem("pranaveda_bellSound", bellSelect.value);
});

// Rating Modal Logic
document.querySelectorAll(".rating-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".rating-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedRating = Number(btn.dataset.rating);
    });
});

saveRatingBtn.addEventListener("click", () => {
    if (pendingSession) {
        pendingSession.rating = selectedRating || 5;
        const sessions = getSessions();
        sessions.push(pendingSession);
        localStorage.setItem("breathingSessions", JSON.stringify(sessions));
        pendingSession = null;
        selectedRating = null;
    }
    ratingModal.classList.remove("show");
    resetSession();
    loadStats();
});

/* ==========================================================================
   DATA, STATS, ACHIEVEMENTS & DATE-WISE SESSION HISTORY
   ========================================================================== */
let collapsedDateGroups = new Set();

function getSessions() {
    return JSON.parse(localStorage.getItem("breathingSessions") || "[]");
}

function getLocalDateKey(date) {
    const d = (date instanceof Date) ? date : new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function dateKey(date) {
    return getLocalDateKey(date);
}

function calculateStreak(sessions) {
    if (!sessions.length) return 0;
    const dates = new Set(sessions.map(s => dateKey(s.date)).filter(Boolean));
    let streak = 0;
    const current = new Date();
    
    // If no session recorded today yet, check yesterday to keep streak active
    const todayKey = dateKey(current);
    if (!dates.has(todayKey)) {
        const yesterday = new Date(current);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = dateKey(yesterday);
        if (!dates.has(yesterdayKey)) {
            return 0;
        }
        current.setDate(current.getDate() - 1);
    }
    
    while (true) {
        const key = dateKey(current);
        if (!dates.has(key)) break;
        streak++;
        current.setDate(current.getDate() - 1);
    }
    return streak;
}

function getPatternDisplayName(val) {
    const names = {
        "anapanasati": "Anapanasati (Mindful Breath)",
        "metta": "Metta Bhavana (Loving-Kindness)",
        "chakra_all": "7-Chakra Alignment (LAM to OM)",
        "chakra_root": "Root Chakra (LAM)",
        "chakra_sacral": "Sacral Chakra (VAM)",
        "chakra_solar": "Solar Plexus (RAM)",
        "chakra_heart": "Heart Chakra (YAM)",
        "chakra_throat": "Throat Chakra (HAM)",
        "chakra_thirdeye": "Third Eye (OM)",
        "chakra_crown": "Crown Chakra (AUM)",
        "vis_success": "Positive Breakthrough (Victory)",
        "vis_goodnews": "Positive Incident (Good News)",
        "vis_harmony": "Positive Harmony (Connection)",
        "vis_sun": "Surya Dhyana (Golden Sun)",
        "vis_deity": "Ishta Devata (Divine Presence)",
        "vis_lotus": "Hridaya Kamala (Heart Lotus)",
        "vis_cosmos": "Akasha Dhyana (Cosmic Sky)",
        "vis_ocean": "Samudra Dhyana (Ocean Calm)",
        "vis_mountain": "Meru Dhyana (Mountain Stillness)",
        "anulom": "Anulom Vilom",
        "bhramari": "Bhramari",
        "kapalbhati": "Kapalabhati",
        "sheetali": "Sheetali",
        "ujjayi": "Ujjayi",
        "4-6": "4–6 Relaxation",
        "box": "Sama Vritti (Box)",
        "4-7-8": "4–7–8 Reset",
        "5-5": "5–5 Coherence",
        "custom": "Custom Ratio"
    };
    return names[val] || val;
}

function formatGroupDate(dateKeyStr, sampleDate) {
    if (!dateKeyStr || dateKeyStr === 'unknown') {
        return { title: 'Other Sessions', isToday: false, isYesterday: false, subLabel: '' };
    }
    const todayStr = dateKey(new Date());
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    const yesterdayStr = dateKey(yest);

    const d = sampleDate || new Date(dateKeyStr + 'T00:00:00');
    const isValid = !isNaN(d.getTime());
    const formattedFull = isValid 
        ? d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
        : dateKeyStr;

    if (dateKeyStr === todayStr) {
        return { title: 'Today', isToday: true, isYesterday: false, subLabel: formattedFull };
    } else if (dateKeyStr === yesterdayStr) {
        return { title: 'Yesterday', isToday: false, isYesterday: true, subLabel: formattedFull };
    } else {
        return { title: formattedFull, isToday: false, isYesterday: false, subLabel: '' };
    }
}

function loadStats() {
    const sessions = getSessions();
    const today = dateKey(new Date());
    const todaySessions = sessions.filter(s => dateKey(s.date) === today);
    const totalMinutes = sessions.reduce((sum, s) => sum + Number(s.duration || 0), 0);
    const rated = sessions.filter(s => Number(s.rating) > 0);
    const avgCalm = rated.length ? (rated.reduce((sum, s) => sum + Number(s.rating), 0) / rated.length).toFixed(1) : "-";
    const totalWanders = sessions.reduce((sum, s) => sum + Number(s.mindWanders || 0), 0);
    const streak = calculateStreak(sessions);

    document.getElementById("todaySessions").textContent = todaySessions.length;
    document.getElementById("totalMinutes").textContent = totalMinutes;
    document.getElementById("totalSessions").textContent = sessions.length;
    document.getElementById("avgCalm").textContent = avgCalm;
    document.getElementById("totalWanders").textContent = totalWanders;
    document.getElementById("streakBadge").textContent = `🔥 ${streak} Day Streak`;

    // Milestones
    document.getElementById("badge1").classList.toggle("unlocked", sessions.length >= 1);
    document.getElementById("badge2").classList.toggle("unlocked", streak >= 3);
    document.getElementById("badge3").classList.toggle("unlocked", totalMinutes >= 50);
    document.getElementById("badge4").classList.toggle("unlocked", totalMinutes >= 100);
    document.getElementById("badge5").classList.toggle("unlocked", sessions.some(s => s.mindWanders === 0));

    // History Table
    if (!sessions.length) {
        historyActions.style.display = "none";
        historyDiv.innerHTML = `
            <div class="empty-history">
                <div class="empty-history-icon">🍃</div>
                <div>No sessions recorded yet. Begin your first Pranayama practice above!</div>
            </div>
        `;
        return;
    }

    historyActions.style.display = "flex";

    // Map each session with originalIndex so deletions reference exact index
    const sessionsWithIndex = sessions.map((s, idx) => ({ ...s, originalIndex: idx }));

    // Group by dateKey
    const groupsMap = {};
    sessionsWithIndex.forEach(s => {
        const key = dateKey(s.date) || 'unknown';
        if (!groupsMap[key]) {
            groupsMap[key] = {
                key: key,
                sampleDate: new Date(s.date),
                items: []
            };
        }
        groupsMap[key].items.push(s);
    });

    // Sort dates in reverse chronological order (newest date first)
    const sortedKeys = Object.keys(groupsMap).sort((a, b) => {
        if (a === 'unknown') return 1;
        if (b === 'unknown') return -1;
        return b.localeCompare(a);
    });

    // Update toggle all button text
    if (toggleAllGroupsBtn) {
        const allCollapsed = sortedKeys.length > 0 && sortedKeys.every(k => collapsedDateGroups.has(k));
        toggleAllGroupsBtn.innerHTML = allCollapsed ? "⮞ Expand All" : "⮟ Collapse All";
    }

    // Build Date Groups HTML
    let html = `<div class="history-groups-list">`;

    sortedKeys.forEach(k => {
        const grp = groupsMap[k];
        // Sort items inside group by timestamp descending (most recent first)
        grp.items.sort((a, b) => {
            const timeA = new Date(a.date).getTime() || 0;
            const timeB = new Date(b.date).getTime() || 0;
            return timeB - timeA;
        });

        const dateMeta = formatGroupDate(k, grp.sampleDate);
        const dayMinutes = grp.items.reduce((sum, s) => sum + Number(s.duration || 0), 0);
        const dayWanders = grp.items.reduce((sum, s) => sum + Number(s.mindWanders || 0), 0);
        const dayRated = grp.items.filter(s => Number(s.rating) > 0);
        const dayAvgCalm = dayRated.length ? (dayRated.reduce((sum, s) => sum + Number(s.rating), 0) / dayRated.length).toFixed(1) : null;
        const isCollapsed = collapsedDateGroups.has(k);

        html += `
            <div class="history-date-group ${isCollapsed ? 'collapsed' : ''}" id="dateGroup-${k}">
                <div class="date-group-header" onclick="toggleDateGroup('${k}')">
                    <div class="date-group-left">
                        <span class="date-group-toggle-icon">▼</span>
                        <div class="date-group-title">
                            <span>📅 ${dateMeta.title}</span>
                            ${dateMeta.isToday ? `<span class="date-badge date-badge-today">Today</span>` : ''}
                            ${dateMeta.isYesterday ? `<span class="date-badge date-badge-yesterday">Yesterday</span>` : ''}
                        </div>
                        ${dateMeta.subLabel ? `<span class="date-group-sublabel">${dateMeta.subLabel}</span>` : ''}
                    </div>

                    <div class="date-group-right">
                        <div class="date-group-meta">
                            <span class="date-summary-pill" title="Sessions completed on this date">
                                🪷 ${grp.items.length} ${grp.items.length === 1 ? 'session' : 'sessions'}
                            </span>
                            <span class="date-summary-pill" title="Total practice duration on this date">
                                ⏱️ ${dayMinutes}m
                            </span>
                            ${dayAvgCalm ? `
                            <span class="date-summary-pill" title="Average calmness score">
                                😌 ${dayAvgCalm}/5
                            </span>` : ''}
                            ${dayWanders > 0 ? `
                            <span class="date-summary-pill" title="Total mind wander events">
                                🧠 ${dayWanders}
                            </span>` : ''}
                        </div>
                        <button class="btn-delete-group" title="Delete all records for ${dateMeta.title}" onclick="event.stopPropagation(); deleteDateGroup('${k}', '${dateMeta.title}')">
                            🗑️
                        </button>
                    </div>
                </div>

                <div class="date-group-content">
                    <div class="table-wrapper">
                        <table class="session-table">
                            <thead>
                                <tr>
                                    <th style="width: 105px;">Time</th>
                                    <th>Technique</th>
                                    <th>Duration</th>
                                    <th>Mind Wanders</th>
                                    <th>Calmness</th>
                                    <th style="width: 45px; text-align: center;"></th>
                                </tr>
                            </thead>
                            <tbody>
                                ${grp.items.map(s => {
                                    const d = new Date(s.date);
                                    const isValid = !isNaN(d.getTime());
                                    const timeStr = isValid ? d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '—';
                                    const ratingNum = Number(s.rating) || 0;
                                    const stars = ratingNum > 0 ? '★'.repeat(ratingNum) + '☆'.repeat(5 - ratingNum) : '';

                                    return `
                                        <tr>
                                            <td>
                                                <div style="font-weight: 600; font-size: 12.5px; color: var(--text-primary);">${timeStr}</div>
                                            </td>
                                            <td>
                                                <span class="pill pill-pattern">${getPatternDisplayName(s.pattern)}</span>
                                            </td>
                                            <td>
                                                <span class="pill pill-duration">⏱ ${s.duration} min</span>
                                            </td>
                                            <td>
                                                <span class="pill pill-wanders">🧠 ${s.mindWanders ?? 0}</span>
                                            </td>
                                            <td>
                                                ${ratingNum > 0
                                                    ? `<span class="rating-stars" title="${ratingNum}/5">${stars}<span class="rating-score">(${ratingNum}/5)</span></span>`
                                                    : `<span style="color: var(--text-muted);">—</span>`
                                                }
                                            </td>
                                            <td style="text-align: center;">
                                                <button class="btn-delete-row" title="Delete session" onclick="deleteSession(${s.originalIndex})">
                                                    ✕
                                                </button>
                                            </td>
                                        </tr>
                                    `;
                                }).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    historyDiv.innerHTML = html;
}

window.toggleDateGroup = function(key) {
    if (collapsedDateGroups.has(key)) {
        collapsedDateGroups.delete(key);
    } else {
        collapsedDateGroups.add(key);
    }
    const grpEl = document.getElementById(`dateGroup-${key}`);
    if (grpEl) {
        grpEl.classList.toggle("collapsed", collapsedDateGroups.has(key));
    }
    const sessions = getSessions();
    const allKeys = [...new Set(sessions.map(s => dateKey(s.date)).filter(Boolean))];
    if (toggleAllGroupsBtn && allKeys.length) {
        const allCollapsed = allKeys.every(k => collapsedDateGroups.has(k));
        toggleAllGroupsBtn.innerHTML = allCollapsed ? "⮞ Expand All" : "⮟ Collapse All";
    }
};

function toggleAllDateGroups() {
    const sessions = getSessions();
    const allKeys = [...new Set(sessions.map(s => dateKey(s.date)).filter(Boolean))];
    if (!allKeys.length) return;
    const allCollapsed = allKeys.every(k => collapsedDateGroups.has(k));
    if (allCollapsed) {
        collapsedDateGroups.clear();
    } else {
        allKeys.forEach(k => collapsedDateGroups.add(k));
    }
    loadStats();
}
window.toggleAllDateGroups = toggleAllDateGroups;

if (toggleAllGroupsBtn) {
    toggleAllGroupsBtn.addEventListener("click", toggleAllDateGroups);
}

window.deleteDateGroup = function(dateKeyStr, title) {
    if (confirm(`Are you sure you want to delete all Pranayama sessions recorded on ${title}?`)) {
        const sessions = getSessions();
        const updated = sessions.filter(s => (dateKey(s.date) || 'unknown') !== dateKeyStr);
        localStorage.setItem("breathingSessions", JSON.stringify(updated));
        collapsedDateGroups.delete(dateKeyStr);
        loadStats();
    }
};

window.deleteSession = function(index) {
    const sessions = getSessions();
    if (index >= 0 && index < sessions.length) {
        sessions.splice(index, 1);
        localStorage.setItem("breathingSessions", JSON.stringify(sessions));
        loadStats();
    }
};

clearHistoryBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your entire Pranayama history?")) {
        localStorage.removeItem("breathingSessions");
        collapsedDateGroups.clear();
        loadStats();
    }
});

exportCsvBtn.addEventListener("click", () => {
    const sessions = getSessions();
    if (!sessions.length) return;
    let csv = "Date,Time,Technique,Duration_Minutes,Mind_Wanders,Calmness_Rating\n";
    sessions.forEach(s => {
        const d = new Date(s.date);
        const dateStr = !isNaN(d.getTime()) ? d.toLocaleDateString() : s.date;
        const timeStr = !isNaN(d.getTime()) ? d.toLocaleTimeString() : '';
        csv += `"${dateStr}","${timeStr}","${getPatternDisplayName(s.pattern)}",${s.duration},${s.mindWanders || 0},${s.rating || ''}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pranaveda_history_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
});

/* ==========================================================================
   ZEN MODE, MODALS, GUIDE & DARK MODE
   ========================================================================== */
zenBtn.addEventListener("click", () => document.body.classList.add("zen-mode"));
zenExitBtn.addEventListener("click", () => document.body.classList.remove("zen-mode"));

guideBtn.addEventListener("click", () => guideModal.classList.add("show"));
closeGuideBtn.addEventListener("click", () => guideModal.classList.remove("show"));
guideModal.addEventListener("click", (e) => {
    if (e.target === guideModal) guideModal.classList.remove("show");
});

document.querySelectorAll(".guide-title").forEach(title => {
    title.addEventListener("click", () => {
        const content = title.nextElementSibling;
        content.classList.toggle("show");
    });
});

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark") ? "1" : "0");
});

if (localStorage.getItem("darkMode") === "1") {
    document.body.classList.add("dark");
}

fullscreenBtn.addEventListener("click", async () => {
    try {
        if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
        else await document.exitFullscreen();
    } catch (e) {
        console.log("Fullscreen not supported");
    }
});

/* KEYBOARD SHORTCUTS */
document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
    if (e.code === "Space") {
        e.preventDefault();
        if (running) pauseSession();
        else startSession();
    } else if (e.key.toLowerCase() === "r") {
        resetSession();
    } else if (e.key.toLowerCase() === "m") {
        mindBtn.click();
    } else if (e.key === "Escape") {
        document.body.classList.remove("zen-mode");
        guideModal.classList.remove("show");
        ratingModal.classList.remove("show");
    }
});

/* INITIALIZATION */
function init() {
    totalSeconds = Number(durationSelect.value) * 60;
    remainingTotal = totalSeconds;
    phases = getPattern();
    totalTimeText.textContent = formatTime(totalSeconds);
    secondsText.textContent = Math.ceil(totalSeconds / 60);
    loadStats();
}

init();
