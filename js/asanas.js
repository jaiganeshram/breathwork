/* ==========================================================================
   AUDIO ENGINE (Singing Bowl Chimes)
   ========================================================================== */
class VedicAudio {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playSingingBowl(freq = 432, duration = 3.5) {
        try {
            this.init();
            if (!this.ctx) return;
            const now = this.ctx.currentTime;
            
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.998, now + duration);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.35, now + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + duration);
        } catch (e) {
            console.warn("Audio chime note:", e);
        }
    }
}
const audio = new VedicAudio();

/* ==========================================================================
   SVG VECTOR ART GENERATOR FOR 35 ASANAS (Fallback & Alignment geometry)
   ========================================================================== */
function getAsanaSVG(id) {
    const color = "var(--accent-cyan)";
    const gold = "var(--accent-gold)";
    const headColor = "var(--accent-purple)";

    switch (id) {
        case "tadasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="50" cy="18" r="8" fill="${headColor}" stroke="none"/>
                <line x1="50" y1="26" x2="50" y2="58"/>
                <line x1="50" y1="32" x2="36" y2="54"/>
                <line x1="50" y1="32" x2="64" y2="54"/>
                <line x1="50" y1="58" x2="45" y2="92"/>
                <line x1="50" y1="58" x2="55" y2="92"/>
                <line x1="30" y1="94" x2="70" y2="94" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "vrikshasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="50" cy="20" r="7" fill="${headColor}" stroke="none"/>
                <path d="M50 28 L38 18 L50 8 L62 18 L50 28"/>
                <line x1="50" y1="28" x2="50" y2="58"/>
                <line x1="50" y1="58" x2="50" y2="92"/>
                <path d="M50 58 L32 68 L49 68"/>
                <line x1="35" y1="94" x2="65" y2="94" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "trikonasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="68" cy="38" r="7" fill="${headColor}" stroke="none"/>
                <line x1="50" y1="52" x2="25" y2="88"/>
                <line x1="50" y1="52" x2="75" y2="88"/>
                <line x1="50" y1="52" x2="68" y2="44"/>
                <line x1="75" y1="86" x2="68" y2="44"/>
                <line x1="68" y1="44" x2="62" y2="12"/>
                <line x1="15" y1="90" x2="85" y2="90" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "virabhadrasana1":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="50" cy="22" r="7" fill="${headColor}" stroke="none"/>
                <line x1="50" y1="30" x2="42" y2="10"/>
                <line x1="50" y1="30" x2="58" y2="10"/>
                <line x1="50" y1="30" x2="48" y2="56"/>
                <path d="M48 56 L68 62 L68 88"/>
                <line x1="48" y1="56" x2="22" y2="88"/>
                <line x1="15" y1="90" x2="85" y2="90" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "virabhadrasana2":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="50" cy="24" r="7" fill="${headColor}" stroke="none"/>
                <line x1="20" y1="34" x2="80" y2="34"/>
                <line x1="50" y1="32" x2="50" y2="56"/>
                <path d="M50 56 L72 58 L72 88"/>
                <line x1="50" y1="56" x2="24" y2="88"/>
                <line x1="15" y1="90" x2="85" y2="90" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "utkatasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="42" cy="18" r="7" fill="${headColor}" stroke="none"/>
                <line x1="42" y1="26" x2="62" y2="10"/>
                <line x1="42" y1="26" x2="68" y2="14"/>
                <line x1="42" y1="26" x2="34" y2="52"/>
                <line x1="34" y1="52" x2="54" y2="58"/>
                <line x1="54" y1="58" x2="48" y2="88"/>
                <line x1="25" y1="90" x2="75" y2="90" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "garudasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="50" cy="18" r="7" fill="${headColor}" stroke="none"/>
                <path d="M50 26 L42 36 L56 36 L50 24"/>
                <line x1="50" y1="26" x2="50" y2="54"/>
                <path d="M50 54 L44 68 L54 74 L48 88"/>
                <line x1="30" y1="90" x2="70" y2="90" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "uttanasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="36" cy="74" r="7" fill="${headColor}" stroke="none"/>
                <line x1="52" y1="40" x2="52" y2="88"/>
                <line x1="52" y1="40" x2="38" y2="68"/>
                <line x1="40" y1="64" x2="48" y2="88"/>
                <line x1="25" y1="90" x2="75" y2="90" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "padmasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="50" cy="22" r="8" fill="${headColor}" stroke="none"/>
                <line x1="50" y1="30" x2="50" y2="65"/>
                <path d="M50 36 L28 56 L32 74"/>
                <path d="M50 36 L72 56 L68 74"/>
                <path d="M30 76 Q50 64 70 76 Q50 88 30 76"/>
                <line x1="20" y1="84" x2="80" y2="84" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "sukhasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="50" cy="24" r="7.5" fill="${headColor}" stroke="none"/>
                <line x1="50" y1="32" x2="50" y2="66"/>
                <path d="M50 38 L30 54 L36 72"/>
                <path d="M50 38 L70 54 L64 72"/>
                <path d="M26 76 L74 76"/>
                <line x1="20" y1="82" x2="80" y2="82" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "vajrasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="46" cy="22" r="7.5" fill="${headColor}" stroke="none"/>
                <line x1="46" y1="30" x2="46" y2="60"/>
                <line x1="46" y1="36" x2="58" y2="58"/>
                <path d="M46 60 L62 62 L36 78 L60 78"/>
                <line x1="25" y1="82" x2="75" y2="82" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "paschimottanasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="68" cy="56" r="7" fill="${headColor}" stroke="none"/>
                <line x1="26" y1="74" x2="82" y2="74"/>
                <path d="M26 74 L46 60 L62 58"/>
                <line x1="56" y1="62" x2="80" y2="72"/>
                <line x1="20" y1="80" x2="88" y2="80" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "baddha_konasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="50" cy="24" r="7.5" fill="${headColor}" stroke="none"/>
                <line x1="50" y1="32" x2="50" y2="64"/>
                <path d="M50 38 L36 58 L50 74"/>
                <path d="M50 38 L64 58 L50 74"/>
                <path d="M50 64 L26 68 L50 76 L74 68 Z"/>
                <line x1="20" y1="82" x2="80" y2="82" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "gomukhasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="50" cy="22" r="7" fill="${headColor}" stroke="none"/>
                <line x1="50" y1="30" x2="50" y2="62"/>
                <path d="M50 34 L56 16 L48 38 L52 50 L44 58"/>
                <path d="M36 68 Q50 58 64 68 Q50 76 36 68"/>
                <line x1="25" y1="82" x2="75" y2="82" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "ardha_matsyendrasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="50" cy="22" r="7" fill="${headColor}" stroke="none"/>
                <line x1="50" y1="30" x2="50" y2="62"/>
                <path d="M50 36 L66 48 L46 64"/>
                <line x1="48" y1="62" x2="48" y2="44"/>
                <path d="M32 74 L68 74"/>
                <line x1="20" y1="80" x2="80" y2="80" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "janu_sirsasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="64" cy="54" r="7" fill="${headColor}" stroke="none"/>
                <line x1="28" y1="74" x2="82" y2="74"/>
                <path d="M28 74 L40 68 L48 74"/>
                <path d="M28 74 L46 60 L60 56"/>
                <line x1="54" y1="60" x2="80" y2="72"/>
                <line x1="20" y1="80" x2="88" y2="80" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "bhujangasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="34" cy="30" r="7.5" fill="${headColor}" stroke="none"/>
                <line x1="48" y1="74" x2="86" y2="74"/>
                <path d="M86 74 L48 74 Q36 68 34 38"/>
                <line x1="36" y1="44" x2="42" y2="74"/>
                <line x1="20" y1="78" x2="90" y2="78" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "dhanurasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="28" cy="34" r="7" fill="${headColor}" stroke="none"/>
                <path d="M32 38 Q50 82 78 44"/>
                <line x1="34" y1="44" x2="72" y2="44"/>
                <line x1="20" y1="80" x2="85" y2="80" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "shalabhasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="26" cy="46" r="7" fill="${headColor}" stroke="none"/>
                <path d="M30 50 Q50 68 84 46"/>
                <line x1="36" y1="56" x2="68" y2="58"/>
                <line x1="18" y1="74" x2="85" y2="74" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "ustrasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="36" cy="28" r="7.5" fill="${headColor}" stroke="none"/>
                <line x1="64" y1="56" x2="64" y2="80"/>
                <path d="M64 56 Q52 48 38 32"/>
                <line x1="42" y1="36" x2="64" y2="76"/>
                <line x1="30" y1="84" x2="80" y2="84" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "setu_bandhasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="24" cy="68" r="7" fill="${headColor}" stroke="none"/>
                <path d="M28 70 Q48 34 72 52"/>
                <line x1="72" y1="52" x2="76" y2="74"/>
                <line x1="28" y1="72" x2="62" y2="72"/>
                <line x1="15" y1="78" x2="85" y2="78" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "chakrasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="30" cy="58" r="6.5" fill="${headColor}" stroke="none"/>
                <path d="M32 68 Q50 18 72 68"/>
                <line x1="32" y1="68" x2="28" y2="74"/>
                <line x1="72" y1="68" x2="76" y2="74"/>
                <line x1="18" y1="78" x2="85" y2="78" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "cat_cow":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="28" cy="40" r="7" fill="${headColor}" stroke="none"/>
                <path d="M34 46 Q52 58 70 48"/>
                <line x1="36" y1="50" x2="36" y2="76"/>
                <line x1="70" y1="48" x2="70" y2="76"/>
                <line x1="20" y1="80" x2="85" y2="80" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "adho_mukha_svanasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="34" cy="56" r="7" fill="${headColor}" stroke="none"/>
                <line x1="24" y1="74" x2="52" y2="34"/>
                <line x1="52" y1="34" x2="78" y2="74"/>
                <line x1="15" y1="78" x2="88" y2="78" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "sarvangasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="50" cy="74" r="7" fill="${headColor}" stroke="none"/>
                <line x1="50" y1="70" x2="50" y2="18"/>
                <path d="M50 56 L38 68 L50 72"/>
                <line x1="25" y1="80" x2="75" y2="80" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "halasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="56" cy="72" r="7" fill="${headColor}" stroke="none"/>
                <path d="M54 68 L54 36 L24 68"/>
                <line x1="56" y1="70" x2="80" y2="70"/>
                <line x1="18" y1="76" x2="85" y2="76" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "matsyasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="28" cy="68" r="7" fill="${headColor}" stroke="none"/>
                <path d="M32 70 Q44 48 60 70 L84 70"/>
                <line x1="44" y1="62" x2="48" y2="72"/>
                <line x1="18" y1="76" x2="88" y2="76" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "sirsasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="50" cy="76" r="7" fill="${headColor}" stroke="none"/>
                <line x1="50" y1="70" x2="50" y2="16"/>
                <path d="M38 76 L50 68 L62 76"/>
                <line x1="25" y1="82" x2="75" y2="82" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "navasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="34" cy="38" r="7" fill="${headColor}" stroke="none"/>
                <line x1="38" y1="44" x2="50" y2="68"/>
                <line x1="50" y1="68" x2="74" y2="38"/>
                <line x1="46" y1="52" x2="68" y2="52"/>
                <line x1="30" y1="78" x2="70" y2="78" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "bakasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="32" cy="48" r="7" fill="${headColor}" stroke="none"/>
                <line x1="48" y1="46" x2="48" y2="74"/>
                <path d="M38 52 Q56 36 68 56"/>
                <path d="M68 56 L54 48"/>
                <line x1="25" y1="78" x2="75" y2="78" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "balasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="32" cy="62" r="7" fill="${headColor}" stroke="none"/>
                <path d="M36 66 Q52 46 68 62 L74 72"/>
                <line x1="38" y1="68" x2="64" y2="70"/>
                <line x1="20" y1="76" x2="85" y2="76" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "viparita_karani":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="30" cy="74" r="7" fill="${headColor}" stroke="none"/>
                <line x1="34" y1="74" x2="68" y2="74"/>
                <line x1="68" y1="74" x2="68" y2="24"/>
                <line x1="72" y1="18" x2="72" y2="82" stroke="${gold}" stroke-width="2"/>
                <line x1="20" y1="80" x2="80" y2="80" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "supta_matsyendrasana":
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="28" cy="52" r="7" fill="${headColor}" stroke="none"/>
                <line x1="32" y1="54" x2="76" y2="54"/>
                <path d="M56 54 L62 72 L46 72"/>
                <line x1="42" y1="36" x2="42" y2="70"/>
                <line x1="18" y1="78" x2="88" y2="78" stroke="${gold}" stroke-width="2"/>
            </svg>`;

        case "shavasana":
        default:
            return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="26" cy="60" r="7" fill="${headColor}" stroke="none"/>
                <line x1="32" y1="62" x2="82" y2="62"/>
                <line x1="44" y1="56" x2="64" y2="56"/>
                <line x1="18" y1="70" x2="90" y2="70" stroke="${gold}" stroke-width="2"/>
            </svg>`;
    }
}

/* ==========================================================================
   COMPREHENSIVE ASANA KNOWLEDGE DATABASE (35 Asanas with Real Images)
   ========================================================================== */
const ASANAS = [
    {
        id: "tadasana",
        sanskrit: "Tadasana",
        devanagari: "தாடாசனம்",
        english: "Mountain Pose",
        category: "standing",
        level: "Beginner",
        chakra: "Muladhara (Root)",
        target: "Posture, Spine, Core, Feet Arch",
        image: "images/tadasana.jpg",
        holdDefault: 30,
        snippet: "The foundational blueprint of all standing asanas. Establishes grounded posture, spinal alignment, and centered awareness.",
        breathCue: "Inhale to lengthen the crown upward; exhale to ground firmly through the four corners of your feet.",
        steps: [
            "Stand tall with big toes touching and heels slightly apart, or feet hip-width distance.",
            "Lift and spread your toes, then place them softly back onto the mat to distribute weight evenly.",
            "Engage your thigh muscles, draw your kneecaps gently upward, and tuck your tailbone slightly.",
            "Lengthen your spine, roll shoulders back and down, letting arms rest beside your torso with palms facing forward.",
            "Keep chin parallel to the ground and soften your gaze (Drishti) at eye level. Hold steadily."
        ],
        benefits: [
            "Improves posture and spinal elongation.",
            "Strengthens thighs, knees, ankles, and core muscles.",
            "Reduces flat feet and balances body weight distribution.",
            "Calms nervous system and instills mental stability."
        ],
        contraindications: "Recent foot injuries, severe insomnia, or acute low blood pressure.",
        modifications: "Place feet hip-width apart for greater balance stability, or practice back against a wall."
    },
    {
        id: "vrikshasana",
        sanskrit: "Vrikshasana",
        devanagari: "விருக்ஷாசனம்",
        english: "Tree Pose",
        category: "standing",
        level: "Beginner",
        chakra: "Ajna (Third Eye) & Muladhara",
        target: "Hips, Balance, Ankles, Core",
        image: "images/vrikshasana.jpg",
        holdDefault: 30,
        snippet: "A sacred balancing posture that mimics the graceful steadiness of a tree, cultivating laser focus and hip flexibility.",
        breathCue: "Breathe slowly and rhythmically; inhale as you raise your arms and lengthen upward.",
        steps: [
            "Begin in Tadasana. Shift weight onto your left foot, rooting firmly into the earth.",
            "Bend your right knee and place the sole of your right foot on your inner left calf or inner thigh (never on the knee joint).",
            "Bring your hands together at your heart in Anjali Mudra (Prayer).",
            "Fix your gaze (Drishti) on an unmoving point in front of you.",
            "Once steady, slowly raise your arms overhead like branching boughs. Hold for 30 seconds, then switch sides."
        ],
        benefits: [
            "Strengthens thighs, calves, ankles, and spinal column.",
            "Stretches groins and inner thighs, chest and shoulders.",
            "Improves physical balance, concentration, and proprioception.",
            "Relieves sciatica and strengthens pelvic stabilizers."
        ],
        contraindications: "High blood pressure (keep arms at chest instead of overhead), vertigo, or recent knee surgery.",
        modifications: "Rest the right toes lightly on the floor with heel touching the ankle like a kickstand."
    },
    {
        id: "trikonasana",
        sanskrit: "Utthita Trikonasana",
        devanagari: "உத்தித திரிகோணாசனம்",
        english: "Extended Triangle Pose",
        category: "standing",
        level: "Beginner",
        chakra: "Manipura (Solar Plexus)",
        target: "Hamstrings, Groin, Hips, Spine",
        image: "images/trikonasana.jpg",
        holdDefault: 30,
        snippet: "Expands the ribcage, stretches hamstrings and relieves back stiffness through geometric lateral alignment.",
        breathCue: "Inhale to reach horizontally forward; exhale to descend hand to shin, ankle, or floor.",
        steps: [
            "Stand with feet wide apart (approx. 3.5 to 4 feet). Turn right foot 90° outward, left foot 15° inward.",
            "Inhale and extend arms parallel to the floor, shoulder blades relaxed.",
            "Exhale and reach your torso far to the right over your right leg, pivoting at the hip crease.",
            "Rest your right hand on your shin, ankle, yoga block, or the floor outside your right foot.",
            "Stretch your left arm straight up toward the sky. Turn head gently to gaze at your top left thumb."
        ],
        benefits: [
            "Stretches and strengthens the hamstrings, groins, and hips.",
            "Opens chest and shoulders, increasing breathing capacity.",
            "Stimulates abdominal organs, aiding digestion.",
            "Helps relieve stress, anxiety, and mild sciatica."
        ],
        contraindications: "Neck injury (gaze forward or down rather than up), low blood pressure, or acute diarrhea.",
        modifications: "Use a yoga block under the lower hand to prevent collapsing into the side ribs."
    },
    {
        id: "virabhadrasana1",
        sanskrit: "Virabhadrasana I",
        devanagari: "வீரபத்ராசனம் 1",
        english: "Warrior I Pose",
        category: "standing",
        level: "Beginner",
        chakra: "Manipura & Anahata",
        target: "Thighs, Hip Flexors, Chest, Lungs",
        image: null,
        holdDefault: 30,
        snippet: "A powerful standing lunge named after the mythical warrior Virabhadra, awakening courage, focus, and lower-body strength.",
        breathCue: "Inhale as you raise arms and lift your ribcage; exhale as you sink deeper into your front knee.",
        steps: [
            "From standing, step your left foot back about 3.5 to 4 feet. Angle back foot 45° outward.",
            "Square your hips forward toward the front of your mat.",
            "Bend your front right knee to a 90° angle, aligning knee directly above ankle.",
            "Inhale, sweep both arms up alongside your ears with palms facing or touching.",
            "Lift through the heart, soften shoulders, and gaze softly upward. Repeat on the left side."
        ],
        benefits: [
            "Strengthens shoulders, arms, back muscles, calves, and ankles.",
            "Deeply stretches the psoas, hip flexors, chest, and lungs.",
            "Builds mental stamina, focus, and grounded confidence."
        ],
        contraindications: "High blood pressure, severe heart conditions, or recent shoulder/knee injuries.",
        modifications: "Lift the back heel off the mat into High Lunge if squaring hips causes knee discomfort."
    },
    {
        id: "virabhadrasana2",
        sanskrit: "Virabhadrasana II",
        devanagari: "வீரபத்ராசனம் 2",
        english: "Warrior II Pose",
        category: "standing",
        level: "Beginner",
        chakra: "Svadhisthana & Manipura",
        target: "Hips, Groin, Thighs, Shoulders",
        image: "images/virabhadrasana2.jpg",
        holdDefault: 30,
        snippet: "Embodies fierce calm, opening the pelvic bowl and toning the thighs while anchoring the mind in the present moment.",
        breathCue: "Inhale to broaden across collarbones; exhale to ground through both feet equally.",
        steps: [
            "Stand with feet wide (approx. 4 feet). Turn right foot out 90°, left foot angled slightly inward.",
            "Extend arms out horizontally at shoulder height, active through fingertips.",
            "Bend right knee to 90°, ensuring knee tracks directly over middle toe.",
            "Keep torso centered and vertical—do not lean forward over the right thigh.",
            "Gaze with laser focus over the middle finger of your right hand. Hold and switch sides."
        ],
        benefits: [
            "Deeply opens hips, groins, and chest.",
            "Tones legs, buttocks, and strengthens core stabilizers.",
            "Stimulates abdominal organs and enhances circulatory stamina."
        ],
        contraindications: "Recent hip replacement, neck injury (keep head centered looking straight forward).",
        modifications: "Shorten your stance or decrease the depth of the front knee bend."
    },
    {
        id: "utkatasana",
        sanskrit: "Utkatasana",
        devanagari: "உத்கடாசனம்",
        english: "Chair Pose (Fierce Pose)",
        category: "standing",
        level: "Beginner",
        chakra: "Muladhara & Manipura",
        target: "Quadriceps, Glutes, Core, Spine",
        image: null,
        holdDefault: 30,
        snippet: "Ignites inner digestive fire (Agni) and builds exceptional isometric strength across the quads and lower back.",
        breathCue: "Inhale to sweep arms upward; exhale to sit back and down as if into an imaginary chair.",
        steps: [
            "Stand in Tadasana with feet together or hip-width.",
            "Inhale and raise arms alongside ears, palms facing inward.",
            "Exhale and bend knees deeply, shifting weight into heels and sending hips back.",
            "Keep chest lifted and spine long, drawing lower belly in toward spine.",
            "Ensure knees do not project excessively past toes. Hold for 30 seconds."
        ],
        benefits: [
            "Strengthens ankles, calves, thighs, and spine.",
            "Stimulates abdominal organs, diaphragm, and heart.",
            "Helps correct posture and reduces flat feet."
        ],
        contraindications: "Headache, low blood pressure, or acute knee pain.",
        modifications: "Place a yoga block between thighs and squeeze gently to engage adductors."
    },
    {
        id: "garudasana",
        sanskrit: "Garudasana",
        devanagari: "கருடாசனம்",
        english: "Eagle Pose",
        category: "standing",
        level: "Intermediate",
        chakra: "Ajna & Muladhara",
        target: "Shoulders, Upper Back, Hips, Ankles",
        image: null,
        holdDefault: 30,
        snippet: "A compact twisting balance that decompresses major joints and channels razor-sharp concentration.",
        breathCue: "Breathe steadily into the space between your shoulder blades while balancing.",
        steps: [
            "From standing, bend both knees slightly. Lift right thigh and cross it over left thigh.",
            "Hook right toes behind left calf if flexible, or squeeze thighs tightly together.",
            "Extend arms forward. Cross left arm over right at elbows, bend elbows, and wrap forearms to touch palms.",
            "Lift elbows to shoulder height and draw fingers away from face.",
            "Sink hips lower while keeping spine upright. Gaze at thumbs."
        ],
        benefits: [
            "Opens the back of the pelvis and outer hips.",
            "Stretches shoulders, upper back, and rotator cuffs.",
            "Improves neuromuscular coordination and ankle strength."
        ],
        contraindications: "Severe knee arthritis or recent wrist/shoulder injury.",
        modifications: "Touch wrapped toes to the floor like a kickstand, or give yourself a bear hug instead of wrapping arms."
    },
    {
        id: "uttanasana",
        sanskrit: "Padahastasana / Uttanasana",
        devanagari: "உத்தானாசனம் / பாதஹஸ்தாசனம்",
        english: "Standing Forward Bend",
        category: "standing",
        level: "Beginner",
        chakra: "Svadhisthana & Ajna",
        target: "Hamstrings, Calves, Spine, Neck",
        image: null,
        holdDefault: 30,
        snippet: "Reverses gravitational stress on the spinal cord, cools the brain, and lengthens posterior fascia.",
        breathCue: "Inhale to lengthen the spine; exhale to fold deeply from the hip joints.",
        steps: [
            "Stand in Tadasana with hands on hips.",
            "Exhale and hinge forward from hip joints (not the waist), keeping spine long.",
            "Let hands rest on the mat, shins, or hold opposite elbows.",
            "Relax neck, crown of head dropping freely toward the floor.",
            "Keep a micro-bend in knees if hamstrings are tight."
        ],
        benefits: [
            "Calms the brain and helps relieve stress and mild depression.",
            "Stretches hamstrings, calves, and hips.",
            "Stimulates liver and kidneys and improves digestion."
        ],
        contraindications: "Late-term pregnancy, acute disc herniation, or glaucoma.",
        modifications: "Bend knees generously and rest chest on thighs to protect lumbar spine."
    },
    {
        id: "padmasana",
        sanskrit: "Padmasana",
        devanagari: "பத்மாசனம்",
        english: "Lotus Pose",
        category: "seated",
        level: "Advanced",
        chakra: "Sahasrara & Muladhara",
        target: "Hips, Pelvis, Spine, Knees",
        image: "images/padmasana.jpg",
        holdDefault: 60,
        snippet: "The supreme classical meditation posture. Creates an impenetrable energetic triangle, locking Prana within the central Sushumna Nadi.",
        breathCue: "Slow, serene Pranayama breathing (e.g. 4-6 ratio) through both nostrils.",
        steps: [
            "Sit on the floor with spine erect and legs extended forward in Dandasana.",
            "Bend right knee, cradle the foot, and place the right foot high on the left thigh with sole facing up.",
            "Bend left knee, gently lift left foot across, and place it high on the right thigh.",
            "Rest hands on knees in Chin or Jnana Mudra (index touching thumb).",
            "Lengthen spine upward, close eyes softly, and anchor attention at Third Eye or Heart."
        ],
        benefits: [
            "Directs prana through Sushumna Nadi for deep spiritual meditation.",
            "Increases circulation to pelvis, lumbar spine, and abdominal organs.",
            "Develops unwavering seated posture and mental stillness."
        ],
        contraindications: "Meniscus tears, sciatica, knee injuries, or stiff ankles.",
        modifications: "Practice Ardha Padmasana (Half Lotus) or Sukhasana with a cushion under sit bones."
    },
    {
        id: "sukhasana",
        sanskrit: "Sukhasana",
        devanagari: "சுகாசனம்",
        english: "Easy Pose (Decent Pose)",
        category: "seated",
        level: "Beginner",
        chakra: "Anahata (Heart)",
        target: "Hips, Spine, Shoulders, Inner Calm",
        image: null,
        holdDefault: 60,
        snippet: "Accessible cross-legged meditation seat that brings comfort (Sukha) and effortless vertical spine alignment.",
        breathCue: "Deep diaphragmatic belly breathing, feeling ribs expand 360 degrees.",
        steps: [
            "Sit comfortably on mat or folded blanket.",
            "Cross your shins, slipping each foot under the opposite knee.",
            "Balance your weight evenly across your two sit bones.",
            "Rest hands on knees with palms facing down for grounding or up for receptivity.",
            "Elongate the neck, relax facial muscles, and breathe smoothly."
        ],
        benefits: [
            "Promotes grounded tranquility and mental clarity.",
            "Lengthens spine and encourages natural lumbar curve.",
            "Ideal foundation for daily Pranayama breathwork practice."
        ],
        contraindications: "Recent knee injury (sit on a chair with feet flat if needed).",
        modifications: "Elevate hips by sitting on a yoga block or firm meditation zafu cushion."
    },
    {
        id: "vajrasana",
        sanskrit: "Vajrasana",
        devanagari: "வஜ்ராசனம்",
        english: "Thunderbolt / Diamond Pose",
        category: "seated",
        level: "Beginner",
        chakra: "Manipura & Kanda",
        target: "Digestion, Quads, Ankles, Sciatic Nerve",
        image: null,
        holdDefault: 60,
        snippet: "The only asana traditionally prescribed right after meals to enhance digestive fire (Jatharagni) and prevent acid reflux.",
        breathCue: "Natural abdominal rhythmic breathing.",
        steps: [
            "Kneel on the floor with knees together and big toes touching behind you.",
            "Lower your buttocks so you are sitting comfortably in the bowl created by your heels.",
            "Place palms flat on your thighs just above knees.",
            "Keep spine tall, chin level, and shoulders relaxed.",
            "Close your eyes and breathe quietly for 1 to 5 minutes."
        ],
        benefits: [
            "Significantly boosts digestion and prevents bloating/constipation.",
            "Alleviates lower back tension and strengthens pelvic muscles.",
            "Calms mind and regulates circulatory flow to abdominal viscera."
        ],
        contraindications: "Severe knee arthritis, ankle sprain, or heel spurs.",
        modifications: "Place a rolled towel under your ankles or a yoga block between your feet beneath sit bones."
    },
    {
        id: "paschimottanasana",
        sanskrit: "Paschimottanasana",
        devanagari: "பஸ்சிமோத்தானாசனம்",
        english: "Seated Forward Bend",
        category: "seated",
        level: "Beginner",
        chakra: "Svadhisthana & Manipura",
        target: "Entire Posterior Chain, Hamstrings, Spine",
        image: "images/paschimottanasana.jpg",
        holdDefault: 45,
        snippet: "Stretches the entire back body ('Paschima') from heels to crown, massaging internal organs and quieting a racing mind.",
        breathCue: "Inhale to lengthen spine upward; exhale to surrender forward into the fold.",
        steps: [
            "Sit in Dandasana with legs extended straight forward and toes active pointing up.",
            "Inhale, raise both arms overhead, extending through spine and ribcage.",
            "Exhale and hinge from hips, reaching forward to grasp shins, ankles, or outer feet.",
            "Keep neck in line with spine rather than aggressively pulling with arms.",
            "With each exhale, soften into the stretch. Hold for 30–60 seconds."
        ],
        benefits: [
            "Stretches spine, hamstrings, and calves intensely.",
            "Massages abdominal organs (liver, pancreas, kidneys), aiding insulin response.",
            "Relieves fatigue, headache, and menstrual discomfort."
        ],
        contraindications: "Severe lumbar disc herniation, sciatica flare-ups, asthma.",
        modifications: "Loop a yoga strap around the balls of the feet and keep knees softly bent."
    },
    {
        id: "baddha_konasana",
        sanskrit: "Baddha Konasana",
        devanagari: "பத்த கோணாசனம்",
        english: "Bound Angle / Butterfly Pose",
        category: "seated",
        level: "Beginner",
        chakra: "Svadhisthana & Muladhara",
        target: "Groin, Inner Thighs, Hips, Pelvic Floor",
        image: "images/baddha_konasana.jpg",
        holdDefault: 45,
        snippet: "A restorative hip opener that stimulates pelvic circulation, relieves reproductive tension, and improves hip mobility.",
        breathCue: "Inhale to broaden chest; exhale to gently release knees toward the floor.",
        steps: [
            "Sit with spine upright and bend knees, pulling heels close to your pelvis.",
            "Press the soles of your feet firmly together and let knees fall open to sides.",
            "Clasp feet or big toes with both hands, lengthening your spine.",
            "Gently pulse knees or remain still, letting gravity open the groin.",
            "Optionally hinge slightly forward with a flat back for deeper hip stretch."
        ],
        benefits: [
            "Stimulates abdominal organs, ovaries, prostate gland, and kidneys.",
            "Improves pelvic blood circulation and relieves menstrual cramps.",
            "Alleviates sciatic discomfort and tight inner thighs."
        ],
        contraindications: "Groin or acute knee injuries (support knees with blocks).",
        modifications: "Place yoga blocks or folded blankets under outer thighs for gentle support."
    },
    {
        id: "gomukhasana",
        sanskrit: "Gomukhasana",
        devanagari: "கோமுகாசனம்",
        english: "Cow Face Pose",
        category: "seated",
        level: "Intermediate",
        chakra: "Anahata & Vishuddha",
        target: "Shoulders, Rotator Cuff, Triceps, Outer Hips",
        image: null,
        holdDefault: 30,
        snippet: "Deep dual-action posture that simultaneously opens tight shoulder rotator cuffs and outer hip glutes.",
        breathCue: "Inhale deep into the armpit and chest; exhale releasing shoulder tension.",
        steps: [
            "Sit and stack your right knee directly over your left knee, feet pointing back alongside hips.",
            "Raise right arm overhead, bend elbow, and drop right hand between shoulder blades.",
            "Reach left arm out, bend elbow behind lower back, and reach up to clasp fingers of right hand.",
            "If fingers meet, lock them; keep spine tall and head lifting upright against right forearm.",
            "Hold for 30 seconds, then switch arm and leg configuration."
        ],
        benefits: [
            "Relieves chronic shoulder stiffness, frozen shoulder, and tight latissimus dorsi.",
            "Deeply stretches outer hips, gluteus medius, and IT band.",
            "Encourages expansive thoracic breathing."
        ],
        contraindications: "Severe rotator cuff tears or acute knee injuries.",
        modifications: "Hold a yoga strap or towel between hands if fingers cannot clasp behind the back."
    },
    {
        id: "ardha_matsyendrasana",
        sanskrit: "Ardha Matsyendrasana",
        devanagari: "அர்த்த மத்ச்யேந்திராசனம்",
        english: "Half Lord of the Fishes Pose",
        category: "seated",
        level: "Intermediate",
        chakra: "Manipura (Solar Plexus)",
        target: "Spinal Column, Liver, Kidneys, Obliques",
        image: null,
        holdDefault: 30,
        snippet: "A detoxifying spinal rotation named after sage Matsyendra, revitalizing spinal discs and stimulating inner viscera.",
        breathCue: "Inhale to lengthen the spine taller; exhale to deepen the twist from the lower ribcage.",
        steps: [
            "Sit with legs extended. Bend left knee and place left foot flat on the floor outside the right hip.",
            "Bend right knee and fold right foot close to the left buttocks on the floor.",
            "Place left hand on the floor behind your sacrum for support.",
            "Inhale, lift right arm tall; exhale, twist left and hook right elbow outside left knee.",
            "Gaze gently over the left shoulder without straining the neck. Repeat on right side."
        ],
        benefits: [
            "Restores elasticity to intervertebral discs and stimulates spinal nerves.",
            "Massages digestive organs, enhancing peristalsis and liver detox.",
            "Relieves lower back stiffness and mild sciatica."
        ],
        contraindications: "Severe back injuries, spinal disc herniation, or pregnancy (2nd/3rd trimester).",
        modifications: "Keep the bottom leg extended straight instead of folded."
    },
    {
        id: "janu_sirsasana",
        sanskrit: "Janu Sirsasana",
        devanagari: "ஜானு சீர்ஷாசனம்",
        english: "Head-to-Knee Pose",
        category: "seated",
        level: "Beginner",
        chakra: "Svadhisthana & Manipura",
        target: "Hamstrings, Groin, Spine, Kidneys",
        image: null,
        holdDefault: 30,
        snippet: "An asymmetrical calming forward fold that grounds energy, soothes the heart, and gently stretches back body.",
        breathCue: "Inhale to rotate chest toward straight leg; exhale to drape torso forward.",
        steps: [
            "Sit with legs extended. Bend right knee and place right sole against inner left thigh.",
            "Inhale, raise arms and turn torso slightly toward the extended left leg.",
            "Exhale and fold forward over left leg, holding shin, ankle, or foot with both hands.",
            "Keep left foot flexed and shoulders level with the floor.",
            "Breathe deeply for 30 seconds, then switch sides."
        ],
        benefits: [
            "Calms nervous system and reduces anxiety and mild fatigue.",
            "Stretches hamstrings, groins, and lateral lower back.",
            "Stimulates kidneys and liver."
        ],
        contraindications: "Severe hamstring tear, acute asthma, or knee injury.",
        modifications: "Place a blanket under the bent knee or use a strap around the extended foot."
    },
    {
        id: "bhujangasana",
        sanskrit: "Bhujangasana",
        devanagari: "புஜங்காசனம்",
        english: "Cobra Pose",
        category: "backbend",
        level: "Beginner",
        chakra: "Anahata (Heart)",
        target: "Spine, Chest, Lungs, Shoulders",
        image: "images/bhujangasana.jpg",
        holdDefault: 30,
        snippet: "The quintessential prone backbend that opens the heart space, strengthens spinal extensors, and combats slouching.",
        breathCue: "Inhale as you peel chest up from the floor; exhale softly while holding.",
        steps: [
            "Lie prone on your stomach with legs extended and tops of feet pressing into mat.",
            "Place palms flat on the floor directly beneath your shoulders, hugging elbows close to your ribs.",
            "Press pubic bone firmly into mat and engage glutes and thighs.",
            "Inhale, press palms lightly and lift chest off the mat using back muscles rather than arm force.",
            "Keep shoulders rolled back and down away from ears. Gaze forward or slightly up."
        ],
        benefits: [
            "Strengthens the entire spinal column and deep back extensors.",
            "Opens chest and lungs, helping alleviate respiratory conditions.",
            "Stimulates abdominal organs and firms buttocks."
        ],
        contraindications: "Back injury, carpal tunnel syndrome, headache, or pregnancy.",
        modifications: "Practice Sphinx Pose (forearms on floor) for a milder, supported lower-back curve."
    },
    {
        id: "dhanurasana",
        sanskrit: "Dhanurasana",
        devanagari: "தனுராசனம்",
        english: "Bow Pose",
        category: "backbend",
        level: "Intermediate",
        chakra: "Manipura & Anahata",
        target: "Abdomen, Chest, Spine, Quadriceps",
        image: null,
        holdDefault: 20,
        snippet: "Shapes the body into an archer's bow, balancing on the abdomen and igniting the entire metabolic core.",
        breathCue: "Inhale to kick feet back and lift chest higher off the mat.",
        steps: [
            "Lie on your stomach with arms alongside torso and feet hip-width.",
            "Bend knees and bring heels as close to buttocks as possible.",
            "Reach back with both hands and firmly hold ankles (not toes).",
            "Inhale, kick your shins back into your hands, lifting thighs and chest off the floor.",
            "Balance on your belly, keep neck neutral, and breathe steadily for 15–20 seconds."
        ],
        benefits: [
            "Deeply stretches the entire front body, ankles, thighs, groin, and abdomen.",
            "Massages abdominal organs, curing constipation and sluggish digestion.",
            "Strengthens back muscles and improves spinal mobility."
        ],
        contraindications: "High or low blood pressure, hernia, peptic ulcers, or neck injuries.",
        modifications: "Hold ankles with yoga straps if hands cannot reach directly."
    },
    {
        id: "shalabhasana",
        sanskrit: "Shalabhasana",
        devanagari: "சலபாசனம்",
        english: "Locust Pose",
        category: "backbend",
        level: "Beginner",
        chakra: "Muladhara & Manipura",
        target: "Glutes, Lower Back, Hamstrings, Shoulders",
        image: null,
        holdDefault: 20,
        snippet: "A gravity-defying back extension that builds exceptional posterior muscular endurance without wrist compression.",
        breathCue: "Inhale as you simultaneously lift head, chest, arms, and legs off the mat.",
        steps: [
            "Lie prone on your stomach with arms resting alongside body, palms facing down.",
            "Inhale and lift your head, chest, arms, and legs completely off the floor.",
            "Reach actively through toes and fingertips, keeping legs straight and parallel.",
            "Gaze slightly forward, keeping back of neck long.",
            "Hold for 15–30 seconds, then exhale and lower slowly to the mat."
        ],
        benefits: [
            "Strengthens muscles of the spine, buttocks, and backs of the thighs.",
            "Helps relieve stress and improves posture by counteracting sitting.",
            "Stimulates abdominal organs."
        ],
        contraindications: "Headache, serious back injuries, or pregnancy.",
        modifications: "Lift only the upper body or only one leg at a time."
    },
    {
        id: "ustrasana",
        sanskrit: "Ustrasana",
        devanagari: "உஷ்ட்ராசனம்",
        english: "Camel Pose",
        category: "backbend",
        level: "Intermediate",
        chakra: "Anahata & Vishuddha",
        target: "Chest, Throat, Quadriceps, Spine",
        image: null,
        holdDefault: 30,
        snippet: "An expansive kneeling backbend that breaks emotional armor, opens the thoracic ribcage, and frees the vocal pathway.",
        breathCue: "Inhale into the fullness of the chest; exhale to surrender hips forward.",
        steps: [
            "Kneel on the mat with knees hip-width apart and thighs perpendicular to floor.",
            "Place hands on lower back/sacrum with fingers pointing down.",
            "Inhale, press hips forward, lift chest upward toward the ceiling.",
            "Lean back slowly. If comfortable, reach hands back to hold heels or ankles.",
            "Keep thighs vertical, open throat gently, and hold for 20–30 seconds."
        ],
        benefits: [
            "Expands respiratory lung capacity and opens the throat/thyroid.",
            "Stretches the entire anterior body, quads, and deep hip flexors.",
            "Improves spinal flexibility and relieves fatigue."
        ],
        contraindications: "High/low blood pressure, migraine, severe neck or lumbar pathology.",
        modifications: "Tuck toes to elevate heels higher, or keep hands firmly on lower back."
    },
    {
        id: "setu_bandhasana",
        sanskrit: "Setu Bandhasana",
        devanagari: "சேது பந்தாசனம்",
        english: "Bridge Pose",
        category: "backbend",
        level: "Beginner",
        chakra: "Vishuddha (Throat) & Manipura",
        target: "Glutes, Hamstrings, Spine, Thyroid",
        image: null,
        holdDefault: 45,
        snippet: "A rejuvenating semi-inversion that calms the central nervous system, stimulates the thyroid, and strengthens the posterior chain.",
        breathCue: "Inhale to press feet into floor and lift hips higher; exhale to stabilize.",
        steps: [
            "Lie on your back with knees bent and feet flat on the floor, hip-width apart.",
            "Bring heels close enough that fingertips can lightly brush them.",
            "Press feet and arms into the floor, inhale, and lift hips upward toward the ceiling.",
            "Clasp hands under your pelvis and roll shoulder blades underneath you.",
            "Keep thighs parallel and chin tucked slightly toward sternum. Hold for 30–60 seconds."
        ],
        benefits: [
            "Stimulates thyroid gland and helps regulate metabolism.",
            "Strengthens gluteus maximus, hamstrings, and erector spinae.",
            "Relieves symptoms of menopause, menstrual pain, and insomnia."
        ],
        contraindications: "Neck injuries (avoid turning head while in this pose).",
        modifications: "Place a yoga block under the sacrum for a restorative, passive Bridge pose."
    },
    {
        id: "chakrasana",
        sanskrit: "Chakrasana / Urdhva Dhanurasana",
        devanagari: "சக்ராசனம் / ஊர்த்வ தனுராசனம்",
        english: "Wheel Pose (Upward-Facing Bow)",
        category: "backbend",
        level: "Advanced",
        chakra: "All 7 Chakras (Kundalini activation)",
        target: "Total Spine, Shoulders, Wrists, Core, Legs",
        image: "images/chakrasana.jpg",
        holdDefault: 20,
        snippet: "The supreme full-body wheel backbend. Floods the nervous system with vitality, clears lethargy, and builds immense resilience.",
        breathCue: "Inhale powerfully into the ribcage; maintain smooth, unhurried breathing.",
        steps: [
            "Lie on your back with knees bent and feet flat, hip-distance apart.",
            "Place hands on the floor beside your ears with fingers pointing toward your shoulders.",
            "Press firmly into feet and hands, inhale, and lift your body off the mat into an upward arch.",
            "Straighten arms and legs as much as comfortable, letting head hang naturally.",
            "Hold for 15–30 seconds, then slowly tuck chin to chest and lower shoulders to mat."
        ],
        benefits: [
            "Increases total energy and counters depression and fatigue.",
            "Strengthens arms, wrists, legs, buttocks, and spine.",
            "Stretches chest, lungs, and abdominal wall thoroughly."
        ],
        contraindications: "Carpal tunnel syndrome, high blood pressure, heart conditions, or pregnancy.",
        modifications: "Practice Setu Bandhasana (Bridge) or use a wall for hand support."
    },
    {
        id: "cat_cow",
        sanskrit: "Marjaryasana-Bitilasana",
        devanagari: "மார்ஜர்யாசனம்-பிதிலாசனம்",
        english: "Cat-Cow Dynamic Flow",
        category: "backbend",
        level: "Beginner",
        chakra: "Svadhisthana & Anahata",
        target: "Spine, Pelvis, Neck, Core",
        image: null,
        holdDefault: 60,
        snippet: "The universal spinal warm-up. Harmonizes inhalation and exhalation with gentle flexion and extension of every vertebra.",
        breathCue: "Inhale to arch into Cow; Exhale to round into Cat.",
        steps: [
            "Start on hands and knees in Tabletop pose with wrists under shoulders and knees under hips.",
            "Inhale (Cow Pose): Drop belly toward mat, lift chest, tailbone, and gaze toward ceiling.",
            "Exhale (Cat Pose): Press floor away, round spine upward toward sky, and tuck chin to chest.",
            "Continue flowing smoothly between Cat and Cow with the natural rhythm of your breath for 1–2 minutes."
        ],
        benefits: [
            "Lubricates intervertebral discs and warms the entire spine.",
            "Massages kidneys, adrenal glands, and reproductive organs.",
            "Coordinates breath with physical movement, calming mental agitation."
        ],
        contraindications: "Severe neck injury (keep neck in line with torso rather than lifting high).",
        modifications: "Place a folded blanket under knees if you experience knee pressure."
    },
    {
        id: "adho_mukha_svanasana",
        sanskrit: "Adho Mukha Svanasana",
        devanagari: "அதோ முக ஸ்வானாசனம்",
        english: "Downward-Facing Dog",
        category: "inversion",
        level: "Beginner",
        chakra: "Ajna & Sahasrara",
        target: "Shoulders, Hamstrings, Calves, Core",
        image: "images/adho_mukha_svanasana.jpg",
        holdDefault: 45,
        snippet: "The quintessential yoga inversion. Decompresses the lumbar spine while delivering fresh oxygenated blood to the brain.",
        breathCue: "Exhale deeply as you press hips back and up toward the ceiling.",
        steps: [
            "Start on all fours. Spread fingers wide, pressing through knuckles and index finger bases.",
            "Tuck toes, exhale, and lift knees off floor, reaching sit bones high toward sky.",
            "Lengthen through arms and spine, forming an inverted 'V' shape.",
            "Pedal heels gently or press them toward the mat without locking knees.",
            "Relax head between upper arms, gazing toward navel or between feet."
        ],
        benefits: [
            "Energizes the body and relieves fatigue.",
            "Deeply stretches shoulders, hamstrings, calves, and hands.",
            "Strengthens arms and legs while gently decompressing the spine."
        ],
        contraindications: "Carpal tunnel syndrome, detached retina, or late-stage pregnancy.",
        modifications: "Bend knees generously to prioritize a long, straight spine over flat heels."
    },
    {
        id: "sarvangasana",
        sanskrit: "Salamba Sarvangasana",
        devanagari: "சாலாம்ப சர்வாங்காசனம்",
        english: "Supported Shoulder Stand",
        category: "inversion",
        level: "Intermediate",
        chakra: "Vishuddha (Throat)",
        target: "Thyroid, Parathyroid, Core, Circulation",
        image: null,
        holdDefault: 60,
        snippet: "Celebrated as the 'Mother of All Asanas'. Normalizes thyroid function, reverses venous blood pooling, and promotes longevity.",
        breathCue: "Slow, gentle throat breathing without turning the head.",
        steps: [
            "Lie on your back. Inhale, bend knees, and lift legs and hips overhead.",
            "Bend elbows and place hands firmly against the middle of your back for support.",
            "Walk hands up toward shoulder blades as you extend legs straight up toward ceiling.",
            "Form a vertical line from shoulders to toes; weight is on shoulders and upper arms (never the neck).",
            "Hold steadily for 30–60 seconds, then slowly lower legs overhead into Halasana."
        ],
        benefits: [
            "Massages thyroid and parathyroid glands, balancing metabolic rates.",
            "Improves venous blood return from legs to heart, reducing varicose veins.",
            "Calms nervous system, relieves insomnia, and boosts immune vitality."
        ],
        contraindications: "High blood pressure, glaucoma, neck injury, or menstruation.",
        modifications: "Practice Viparita Karani (Legs-Up-The-Wall) with a bolster under hips."
    },
    {
        id: "halasana",
        sanskrit: "Halasana",
        devanagari: "ஹலாசனம்",
        english: "Plow Pose",
        category: "inversion",
        level: "Intermediate",
        chakra: "Vishuddha & Manipura",
        target: "Spine, Hamstrings, Thyroid, Abdomen",
        image: null,
        holdDefault: 45,
        snippet: "Shapes the body like an Indian farmer's plow ('Hala'), cultivating inner quietude and deeply stretching the posterior spine.",
        breathCue: "Steady, quiet breathing in the abdomen.",
        steps: [
            "From Sarvangasana (Shoulder Stand), exhale and slowly hinge at hips to lower legs overhead.",
            "Rest toes on the floor behind your head with legs straight.",
            "Interlace fingers on the mat and extend arms straight, or keep hands supporting the back.",
            "Lift sit bones toward the ceiling and keep neck completely still.",
            "Hold for 30–60 seconds, then gently roll down vertebra by vertebra."
        ],
        benefits: [
            "Massages internal organs, relieving indigestion and constipation.",
            "Stretches the whole spinal column and shoulders.",
            "Calms the brain and reduces stress and fatigue."
        ],
        contraindications: "Neck injury, asthma, diarrhea, or high blood pressure.",
        modifications: "Rest toes on a chair placed behind your head if feet do not reach the floor."
    },
    {
        id: "matsyasana",
        sanskrit: "Matsyasana",
        devanagari: "மத்ஸ்யாசனம்",
        english: "Fish Pose",
        category: "backbend",
        level: "Beginner",
        chakra: "Vishuddha & Anahata",
        target: "Throat, Chest, Neck, Intercostal Muscles",
        image: null,
        holdDefault: 30,
        snippet: "The essential counter-pose to Shoulder Stand. Unlocks the throat, expands bronchial airways, and awakens respiratory capacity.",
        breathCue: "Inhale expansive breaths into the upper thoracic chest and throat.",
        steps: [
            "Lie flat on your back with legs extended straight and feet together.",
            "Slide hands, palms down, underneath your buttocks.",
            "Press forearms and elbows firmly into mat, inhale, and arch chest high toward ceiling.",
            "Tilt head back gently until the crown of your head lightly rests on the floor.",
            "Keep 90% of weight on your elbows/forearms, not the crown. Hold for 30 seconds."
        ],
        benefits: [
            "Reverses neck flexion from Shoulder Stand and daily screen time.",
            "Expands lungs and stimulates thyroid and thymus glands.",
            "Stretches deep hip flexors and intercostal muscles."
        ],
        contraindications: "Severe neck or lower back injury, migraine, or high blood pressure.",
        modifications: "Place a yoga block under shoulder blades and another under head for restorative Fish pose."
    },
    {
        id: "sirsasana",
        sanskrit: "Salamba Sirsasana",
        devanagari: "சாலாம்ப சீர்ஷாசனம்",
        english: "Headstand (King of Asanas)",
        category: "inversion",
        level: "Advanced",
        chakra: "Sahasrara (Crown)",
        target: "Brain, Core, Shoulders, Spine",
        image: "images/sirsasana.jpg",
        holdDefault: 45,
        snippet: "Revered as the 'King of All Asanas'. Directs blood flow to pituitary and pineal glands, building supreme equilibrium and courage.",
        breathCue: "Slow, calm, controlled breathing throughout the inversion.",
        steps: [
            "Kneel and interlace fingers on mat, placing forearms on floor with elbows shoulder-width.",
            "Place crown of head on floor, nestled into cupped hands.",
            "Lift knees and walk toes toward elbows until spine is vertical.",
            "Engage core and gently float both legs up straight toward ceiling.",
            "Press down actively through forearms to lift shoulders away from neck. Hold steadily."
        ],
        benefits: [
            "Enhances cerebral blood flow, mental focus, memory, and sleep quality.",
            "Strengthens core, arms, shoulders, and spinal stabilizers.",
            "Stimulates pituitary, pineal, and lymphatic drainage systems."
        ],
        contraindications: "Neck injury, glaucoma, high blood pressure, heart disease, or during headache.",
        modifications: "Practice against a wall or with a qualified teacher's assistance."
    },
    {
        id: "navasana",
        sanskrit: "Paripurna Navasana",
        devanagari: "பரிபூர்ண நாவாசனம்",
        english: "Full Boat Pose",
        category: "inversion",
        level: "Intermediate",
        chakra: "Manipura (Solar Plexus)",
        target: "Abdominal Core, Hip Flexors, Spine",
        image: null,
        holdDefault: 25,
        snippet: "A dynamic V-shaped balance that ignites the abdominal core, strengthens hip flexors, and sharpens willpower.",
        breathCue: "Inhale to lift through sternum; exhale to stabilize the core.",
        steps: [
            "Sit with knees bent and feet flat on floor.",
            "Lean torso back slightly while maintaining a flat, long spine.",
            "Lift feet off floor until shins are parallel to the mat (or straighten legs to 45° for full pose).",
            "Extend arms forward parallel to the floor, palms facing each other.",
            "Balance on sit bones without collapsing lumbar spine. Hold for 20–30 seconds."
        ],
        benefits: [
            "Strengthens rectus abdominis, obliques, and transverse abdominis.",
            "Tones hip flexors, adductors, and lower back muscles.",
            "Stimulates kidneys, thyroid, and intestines."
        ],
        contraindications: "Asthma, diarrhea, heart issues, insomnia, or pregnancy.",
        modifications: "Keep knees bent with shins parallel to floor or hold behind thighs with hands."
    },
    {
        id: "bakasana",
        sanskrit: "Bakasana",
        devanagari: "பகாசனம் / காகாசனம்",
        english: "Crow / Crane Pose",
        category: "inversion",
        level: "Advanced",
        chakra: "Manipura & Ajna",
        target: "Wrists, Forearms, Core, Pelvis",
        image: null,
        holdDefault: 15,
        snippet: "The foundational arm balance. Transmutes fear of falling into weightless flight, building immense wrist and core coordination.",
        breathCue: "Exhale to lean forward; hold breath smoothly while floating.",
        steps: [
            "Squat down with feet slightly apart. Place palms flat on floor, shoulder-width, with fingers spread.",
            "Lift hips high and place knees on the backs of upper triceps close to armpits.",
            "Gaze forward on floor about 10 inches ahead (never look back between feet).",
            "Shift weight forward onto hands until feet naturally float off the floor.",
            "Touch big toes together and draw heels toward buttocks. Hold for 10–20 seconds."
        ],
        benefits: [
            "Builds exceptional wrist, arm, and shoulder strength.",
            "Stretches upper back and strengthens core stabilizers.",
            "Cultivates self-confidence, mental balance, and fearlessness."
        ],
        contraindications: "Carpal tunnel syndrome, wrist fractures, or pregnancy.",
        modifications: "Place a yoga block under feet to start with higher hip elevation."
    },
    {
        id: "balasana",
        sanskrit: "Balasana",
        devanagari: "பாலாசனம்",
        english: "Child's Pose",
        category: "restorative",
        level: "Beginner",
        chakra: "Ajna (Third Eye)",
        target: "Hips, Thighs, Spine, Nervous System",
        image: "images/balasana.jpg",
        holdDefault: 60,
        snippet: "The universal sanctuary of rest. Gently decompresses the spine, grounds scattered thoughts, and activates the parasympathetic response.",
        breathCue: "Long, slow exhalations, surrendering all tension into the earth.",
        steps: [
            "Kneel on the floor with big toes touching and knees wide apart.",
            "Sit back onto your heels and exhale, folding torso forward between thighs.",
            "Rest your forehead gently onto the mat.",
            "Extend arms forward with palms down, or rest them alongside your legs with palms up.",
            "Breathe deeply into the back of your ribcage and rest for 1 to 5 minutes."
        ],
        benefits: [
            "Deeply calms central nervous system and relieves stress and anxiety.",
            "Gently stretches hips, thighs, ankles, and spine.",
            "Relieves back and neck tension when practiced with head supported."
        ],
        contraindications: "Diarrhea, late pregnancy, or acute knee injuries.",
        modifications: "Place a pillow or folded blanket under forehead or between thighs and calves."
    },
    {
        id: "viparita_karani",
        sanskrit: "Viparita Karani",
        devanagari: "விபரீத கரணி",
        english: "Legs-Up-The-Wall Pose",
        category: "restorative",
        level: "Beginner",
        chakra: "Vishuddha & Ajna",
        target: "Circulation, Lymphatics, Hamstrings, Heart",
        image: "images/viparita_karani.jpg",
        holdDefault: 90,
        snippet: "A deeply restorative gem. Enhances lymphatic drainage, lowers resting heart rate, and relieves tired, swollen legs.",
        breathCue: "Effortless natural breathing; feel belly rise and fall rhythmically.",
        steps: [
            "Sit sideways with your right hip touching a wall.",
            "Gently pivot on sit bones and swing legs up the wall as you lower torso and head to the floor.",
            "Rest pelvis close to the wall (a few inches away if hamstrings are tight).",
            "Rest arms out to sides with palms facing up.",
            "Close eyes and remain in this restful inversion for 3 to 10 minutes."
        ],
        benefits: [
            "Relieves tired or swollen legs, feet, and ankles.",
            "Calms nervous system and lowers blood pressure naturally.",
            "Soothes headaches, migraines, and insomnia."
        ],
        contraindications: "Glaucoma, serious eye problems, or congestive heart conditions.",
        modifications: "Place a folded blanket or bolster beneath the hips for a restorative pelvic tilt."
    },
    {
        id: "supta_matsyendrasana",
        sanskrit: "Supta Matsyendrasana",
        devanagari: "சுப்த மத்ச்யேந்திராசனம்",
        english: "Supine Spinal Twist",
        category: "restorative",
        level: "Beginner",
        chakra: "Manipura & Anahata",
        target: "Lower Back, Glutes, Chest, Spine",
        image: null,
        holdDefault: 45,
        snippet: "A gentle lying twist that wrings out residual tension from the spine and hips before final relaxation.",
        breathCue: "Inhale to create space; exhale to melt both shoulders flat to the mat.",
        steps: [
            "Lie flat on your back with arms extended in a 'T' position at shoulder height.",
            "Bend your right knee into your chest, then guide it across your body to the left floor.",
            "Turn head to gaze over your right shoulder.",
            "Keep both shoulder blades anchored to the floor.",
            "Hold for 45 seconds, breathing into the right side body, then switch sides."
        ],
        benefits: [
            "Realigns the spine and releases lower back and sacroiliac tension.",
            "Gently massages abdominal organs, aiding digestion.",
            "Calms the nervous system and prepares body for deep sleep."
        ],
        contraindications: "Recent spine or hip surgery.",
        modifications: "Place a pillow beneath the crossed knee to allow shoulders to rest completely flat."
    },
    {
        id: "shavasana",
        sanskrit: "Shavasana",
        devanagari: "சவாசனம்",
        english: "Corpse Pose (Conscious Relaxation)",
        category: "restorative",
        level: "Beginner",
        chakra: "Sahasrara (Crown of Bliss)",
        target: "Total Mind, Body & Spirit Integration",
        image: null,
        holdDefault: 120,
        snippet: "The most important asana in the yogic tradition. Allows the physiological and energetic benefits of practice to integrate completely.",
        breathCue: "Release all conscious control of the breath; witness the natural breath as an unattached observer.",
        steps: [
            "Lie flat on your back on the mat. Spread legs mat-width apart and let feet roll naturally open.",
            "Place arms alongside body, about 6 inches away from hips, with palms facing upward.",
            "Gently tuck chin to lengthen neck and close eyes softly.",
            "Systematically relax every muscle: toes, ankles, calves, knees, hips, belly, chest, jaw, eyes, and scalp.",
            "Surrender all effort and remain in conscious stillness for 5 to 15 minutes."
        ],
        benefits: [
            "Calms central nervous system and triggers deep cellular repair.",
            "Lowers blood pressure, reduces insomnia, and eliminates fatigue.",
            "Cultivates Pratyahara (sensory withdrawal) and deep meditative bliss."
        ],
        contraindications: "None. Back discomfort can be relieved with a bolster under knees.",
        modifications: "Place a rolled blanket under knees to decompress lower back, and cover eyes with a silk cloth."
    }
];

/* ==========================================================================
   SURYA NAMASKAR 12-STEP DATA
   ========================================================================== */
const SURYA_STEPS = [
    {
        step: 1,
        sanskrit: "1. Pranamasana",
        english: "Prayer Pose",
        mantra: "Om Mitraya Namaha (Salutations to the Friend of All)",
        chakra: "Anahata (Heart)",
        breath: "Exhale completely bringing palms together at heart.",
        desc: "Stand tall in Tadasana with feet together. Bring palms together in front of the chest in Anjali Mudra. Relax shoulders and ground firmly.",
        image: "images/tadasana.jpg",
        svgId: "tadasana"
    },
    {
        step: 2,
        sanskrit: "2. Hasta Uttanasana",
        english: "Raised Arms Pose",
        mantra: "Om Ravaye Namaha (Salutations to the Shining One)",
        chakra: "Vishuddha (Throat)",
        breath: "Inhale deeply, sweeping arms overhead and arching back gently.",
        desc: "Inhale, sweep arms upward and back alongside ears. Open chest and gently push pelvis forward into a mild backbend.",
        image: null,
        svgId: "virabhadrasana1"
    },
    {
        step: 3,
        sanskrit: "3. Padahastasana",
        english: "Standing Forward Bend",
        mantra: "Om Suryaya Namaha (Salutations to the Source of Light)",
        chakra: "Svadhisthana (Sacral)",
        breath: "Exhale, hinging forward from hips with a flat back.",
        desc: "Fold all the way forward bringing hands beside feet and forehead toward knees. Keep knees soft if hamstrings are tight.",
        image: null,
        svgId: "uttanasana"
    },
    {
        step: 4,
        sanskrit: "4. Ashwa Sanchalanasana",
        english: "Equestrian / Lunge Pose (Right Leg Back)",
        mantra: "Om Bhanave Namaha (Salutations to the Illumined One)",
        chakra: "Ajna (Third Eye)",
        breath: "Inhale, stepping right leg back and gazing upward.",
        desc: "Step right leg far back, drop right knee to mat, and press hips down. Front left knee is at 90°. Lift chest and gaze upward.",
        image: null,
        svgId: "virabhadrasana1"
    },
    {
        step: 5,
        sanskrit: "5. Dandasana",
        english: "Plank / Stick Pose",
        mantra: "Om Khagaya Namaha (Salutations to the Cosmic Traveler)",
        chakra: "Vishuddha (Throat)",
        breath: "Retain breath (Kumbhaka) as you step left leg back into plank.",
        desc: "Step front leg back to join right leg. Form a straight line from heels to crown. Arms straight under shoulders, core tightly engaged.",
        image: null,
        svgId: "shavasana"
    },
    {
        step: 6,
        sanskrit: "6. Ashtanga Namaskara",
        english: "Eight-Limbed Salutation",
        mantra: "Om Pushne Namaha (Salutations to the Giver of Strength)",
        chakra: "Manipura (Solar Plexus)",
        breath: "Exhale, lowering knees, chest, and chin to floor.",
        desc: "Lower 8 points to the mat: 2 feet, 2 knees, 2 hands, chest, and chin. Keep hips slightly elevated off the mat.",
        image: null,
        svgId: "balasana"
    },
    {
        step: 7,
        sanskrit: "7. Bhujangasana",
        english: "Cobra Pose",
        mantra: "Om Hiranyagarbhaya Namaha (Salutations to the Golden Cosmic Soul)",
        chakra: "Svadhisthana (Sacral)",
        breath: "Inhale, sliding forward and arching chest upward.",
        desc: "Slide chest forward, flatten feet, and lift head and chest into Cobra pose. Keep shoulders rolled back and down.",
        image: "images/bhujangasana.jpg",
        svgId: "bhujangasana"
    },
    {
        step: 8,
        sanskrit: "8. Adho Mukha Svanasana / Parvatasana",
        english: "Downward-Facing Dog / Mountain Pose",
        mantra: "Om Marichaye Namaha (Salutations to the Ray of Dawn)",
        chakra: "Vishuddha (Throat)",
        breath: "Exhale, lifting hips and pressing back into inverted V.",
        desc: "Tuck toes and lift hips high into Downward Dog. Press heels toward the mat, lengthening spine and dropping head between arms.",
        image: "images/adho_mukha_svanasana.jpg",
        svgId: "adho_mukha_svanasana"
    },
    {
        step: 9,
        sanskrit: "9. Ashwa Sanchalanasana",
        english: "Equestrian Pose (Right Leg Forward)",
        mantra: "Om Adityaya Namaha (Salutations to the Son of Aditi / Divine Mother)",
        chakra: "Ajna (Third Eye)",
        breath: "Inhale, stepping right foot forward between hands.",
        desc: "Step right foot forward between palms. Lower left knee to the floor, press hips forward and gaze upward.",
        image: null,
        svgId: "virabhadrasana1"
    },
    {
        step: 10,
        sanskrit: "10. Padahastasana",
        english: "Standing Forward Bend",
        mantra: "Om Savitre Namaha (Salutations to the Radiant Creator)",
        chakra: "Svadhisthana (Sacral)",
        breath: "Exhale, stepping left foot forward to meet right foot in forward fold.",
        desc: "Step left leg forward to join right leg. Fold deeply over legs, drawing forehead toward shins.",
        image: null,
        svgId: "uttanasana"
    },
    {
        step: 11,
        sanskrit: "11. Hasta Uttanasana",
        english: "Raised Arms Pose",
        mantra: "Om Arkaya Namaha (Salutations to the One Worthy of Praise)",
        chakra: "Vishuddha (Throat)",
        breath: "Inhale, sweeping arms up and arching back gently.",
        desc: "Inhale, sweep arms up and back over head, lifting through chest into a gentle back arch.",
        image: null,
        svgId: "virabhadrasana1"
    },
    {
        step: 12,
        sanskrit: "12. Pranamasana",
        english: "Prayer Pose (Completion)",
        mantra: "Om Bhaskaraya Namaha (Salutations to the Bestower of Illumination)",
        chakra: "Anahata (Heart)",
        breath: "Exhale, returning palms gracefully to heart center.",
        desc: "Exhale, return to standing tall in Tadasana with palms joined at chest in Anjali Mudra. Feel the solar warmth coursing through your body.",
        image: "images/tadasana.jpg",
        svgId: "tadasana"
    }
];

/* ==========================================================================
   APP STATE & DOM ELEMENTS
   ========================================================================== */
let activeCategory = "all";
let activeLevel = "all";
let searchQuery = "";
let favorites = JSON.parse(localStorage.getItem("pranaveda_asana_favs") || "[]");
let currentSelectedAsana = null;

// Timer State
let poseTimer = null;
let poseRemainingSeconds = 30;
let poseTotalSeconds = 30;
let poseTimerRunning = false;

// Surya Namaskar State
let currentSuryaIndex = 0;
let suryaAutoTimer = null;

// DOM
const asanasContainer = document.getElementById("asanasContainer");
const asanaSearchInput = document.getElementById("asanaSearchInput");
const favCountSpan = document.getElementById("favCount");
const totalCountSpan = document.getElementById("totalCount");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const favFilterBtn = document.getElementById("favFilterBtn");
const asanaModal = document.getElementById("asanaModal");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const suryaModal = document.getElementById("suryaModal");
const suryaFlowBtn = document.getElementById("suryaFlowBtn");
const suryaModalCloseBtn = document.getElementById("suryaModalCloseBtn");
const randomAsanaBtn = document.getElementById("randomAsanaBtn");

/* ==========================================================================
   THEME SYNCHRONIZATION
   ========================================================================== */
const savedTheme = localStorage.getItem("pranaveda_theme") || "light";
if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggleBtn.innerHTML = "☀️ Light Mode";
} else {
    document.body.classList.remove("dark");
    themeToggleBtn.innerHTML = "🌙 Dark Mode";
}

themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeToggleBtn.innerHTML = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    localStorage.setItem("pranaveda_theme", isDark ? "dark" : "light");
});

/* ==========================================================================
   RENDER ASANA CARDS WITH REAL IMAGES
   ========================================================================== */
function renderAsanaMedia(item) {
    if (item.image) {
        return `
            <img src="${item.image}" alt="${item.sanskrit} - ${item.english}" loading="lazy" onerror="this.onerror=null; this.parentElement.innerHTML = getAsanaSVG('${item.id}');">
            <span class="view-mode-badge">📸 HD Photo</span>
        `;
    }
    return `${getAsanaSVG(item.id)}<span class="view-mode-badge">📐 Geometry</span>`;
}

function renderAsanas() {
    let filtered = ASANAS.filter(item => {
        if (activeCategory === "favorites") {
            if (!favorites.includes(item.id)) return false;
        } else if (activeCategory !== "all" && item.category !== activeCategory) {
            return false;
        }

        if (activeLevel !== "all" && item.level !== activeLevel) {
            return false;
        }

        if (searchQuery.trim() !== "") {
            const q = searchQuery.toLowerCase();
            const match = item.sanskrit.toLowerCase().includes(q) ||
                          item.devanagari.includes(q) ||
                          item.english.toLowerCase().includes(q) ||
                          item.snippet.toLowerCase().includes(q) ||
                          item.target.toLowerCase().includes(q) ||
                          item.benefits.some(b => b.toLowerCase().includes(q));
            if (!match) return false;
        }

        return true;
    });

    if (filtered.length === 0) {
        asanasContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 48px 16px; color: var(--text-secondary);">
                <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
                <h3 style="font-size: 18px; margin-bottom: 6px;">No Asanas Found</h3>
                <p style="font-size: 13px;">Try adjusting your search terms or filters.</p>
            </div>
        `;
        return;
    }

    asanasContainer.innerHTML = filtered.map(item => {
        const isFav = favorites.includes(item.id);
        const levelPillClass = item.level === "Beginner" ? "pill-beginner" : item.level === "Intermediate" ? "pill-intermediate" : "pill-advanced";

        return `
            <div class="asana-card" onclick="openAsanaModal('${item.id}')">
                <div class="asana-card-top">
                    <div class="asana-names">
                        <span class="asana-sanskrit">${item.sanskrit}</span>
                        <span class="asana-english">${item.english}</span>
                        <span class="asana-devanagari">${item.devanagari}</span>
                    </div>
                    <button class="fav-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(event, '${item.id}')" title="Save to Favorites">
                        ${isFav ? '❤️' : '🤍'}
                    </button>
                </div>

                <div class="asana-image-box">
                    ${renderAsanaMedia(item)}
                </div>

                <p class="asana-snippet">${item.snippet}</p>

                <div class="asana-tags-row">
                    <span class="pill ${levelPillClass}">${item.level}</span>
                    <span class="pill pill-chakra">${item.chakra.split(' ')[0]}</span>
                    <span class="pill pill-cyan" style="font-size:10px;">🎯 ${item.target.split(',')[0]}</span>
                </div>

                <div class="asana-action-row">
                    <span style="font-size: 11.5px; color: var(--text-muted);">⏱️ Hold: ${item.holdDefault}s</span>
                    <button class="quick-timer-btn" onclick="event.stopPropagation(); quickStartTimer('${item.id}')">
                        ▶ Practice
                    </button>
                </div>
            </div>
        `;
    }).join("");

    updateCounters();
}

function updateCounters() {
    favCountSpan.textContent = favorites.length;
    totalCountSpan.textContent = ASANAS.length;
}

/* ==========================================================================
   FAVORITES LOGIC
   ========================================================================== */
function toggleFavorite(e, id) {
    e.stopPropagation();
    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem("pranaveda_asana_favs", JSON.stringify(favorites));
    if (window.PranaFirebase) {
        window.PranaFirebase.saveAsanaFavorites(favorites);
    }
    renderAsanas();
}

favFilterBtn.addEventListener("click", () => {
    if (activeCategory === "favorites") {
        activeCategory = "all";
        favFilterBtn.classList.remove("primary");
    } else {
        activeCategory = "favorites";
        favFilterBtn.classList.add("primary");
    }
    document.querySelectorAll("#categoryFilterRow .filter-chip").forEach(chip => chip.classList.remove("active"));
    renderAsanas();
});

/* ==========================================================================
   SEARCH & FILTERS HANDLERS
   ========================================================================== */
asanaSearchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderAsanas();
});

document.querySelectorAll("#categoryFilterRow .filter-chip").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll("#categoryFilterRow .filter-chip").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        favFilterBtn.classList.remove("primary");
        activeCategory = btn.getAttribute("data-category");
        renderAsanas();
    });
});

document.querySelectorAll("#levelFilterRow .filter-chip").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll("#levelFilterRow .filter-chip").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeLevel = btn.getAttribute("data-level");
        renderAsanas();
    });
});

/* ==========================================================================
   MODAL DETAIL & TABS
   ========================================================================== */
function openAsanaModal(id) {
    const item = ASANAS.find(a => a.id === id);
    if (!item) return;

    currentSelectedAsana = item;

    const modalBox = document.getElementById("modalImageBox");
    if (item.image) {
        modalBox.innerHTML = `
            <img src="${item.image}" alt="${item.sanskrit}" onerror="this.onerror=null; this.parentElement.innerHTML = getAsanaSVG('${item.id}');">
            <span class="view-mode-badge" style="bottom:12px; right:12px;">📸 HD Pose Photo</span>
        `;
    } else {
        modalBox.innerHTML = getAsanaSVG(item.id);
    }

    document.getElementById("modalSanskritName").textContent = item.sanskrit;
    document.getElementById("modalDevanagari").textContent = item.devanagari;
    document.getElementById("modalEnglishName").textContent = item.english;
    
    document.getElementById("modalCategoryBadge").textContent = item.category.toUpperCase();
    document.getElementById("modalLevelBadge").textContent = item.level;
    document.getElementById("modalLevelBadge").className = `pill ${item.level === "Beginner" ? "pill-beginner" : item.level === "Intermediate" ? "pill-intermediate" : "pill-advanced"}`;
    document.getElementById("modalChakraBadge").textContent = item.chakra;

    // Steps
    document.getElementById("modalStepList").innerHTML = item.steps.map((step, idx) => `
        <div class="instruction-step">
            <div class="step-num">${idx + 1}</div>
            <div class="step-text">${step}</div>
        </div>
    `).join("");

    // Breath cue
    document.getElementById("modalBreathCue").innerHTML = `<strong>🌬️ Breath Coordination:</strong> ${item.breathCue}`;

    // Benefits
    document.getElementById("modalBenefitsList").innerHTML = item.benefits.map(b => `<li>${b}</li>`).join("");
    document.getElementById("modalTargetAreas").textContent = item.target;

    // Precautions & Modifications
    document.getElementById("modalContraindications").innerHTML = `<strong>⚠️ Contraindications:</strong> ${item.contraindications}`;
    document.getElementById("modalModifications").innerHTML = `<strong>💡 Modifications for Beginners:</strong> ${item.modifications}`;

    // Reset Timer Tab
    setHoldDuration(item.holdDefault || 30);
    resetPoseTimer();

    // Default to Tab 1
    switchModalTab("tabHowTo");

    asanaModal.classList.add("show");
}

function switchModalTab(tabId) {
    document.querySelectorAll(".modal-tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
    });
    document.querySelectorAll(".modal-tab-content").forEach(content => {
        content.classList.toggle("active", content.id === tabId);
    });
}

document.querySelectorAll(".modal-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        switchModalTab(btn.getAttribute("data-tab"));
    });
});

modalCloseBtn.addEventListener("click", () => {
    asanaModal.classList.remove("show");
    resetPoseTimer();
});

asanaModal.addEventListener("click", (e) => {
    if (e.target === asanaModal) {
        asanaModal.classList.remove("show");
        resetPoseTimer();
    }
});

/* ==========================================================================
   POSE HOLD TIMER ENGINE
   ========================================================================== */
function setHoldDuration(sec) {
    poseTotalSeconds = sec;
    poseRemainingSeconds = sec;
    document.getElementById("poseTimerText").textContent = formatTimer(sec);
    
    document.querySelectorAll(".duration-pill-btn").forEach(btn => {
        const val = parseInt(btn.textContent);
        if (btn.textContent.includes("Min")) {
            btn.classList.toggle("active", sec === 120);
        } else {
            btn.classList.toggle("active", val === sec);
        }
    });
}

function formatTimer(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function quickStartTimer(id) {
    openAsanaModal(id);
    switchModalTab("tabPractice");
    setTimeout(togglePoseTimer, 300);
}

function togglePoseTimer() {
    const btn = document.getElementById("startPoseTimerBtn");
    if (poseTimerRunning) {
        clearInterval(poseTimer);
        poseTimer = null;
        poseTimerRunning = false;
        btn.innerHTML = "▶️ Resume Hold Timer";
    } else {
        audio.playSingingBowl(432, 2.0);
        poseTimerRunning = true;
        btn.innerHTML = "⏸️ Pause Hold Timer";

        poseTimer = setInterval(() => {
            poseRemainingSeconds--;
            document.getElementById("poseTimerText").textContent = formatTimer(poseRemainingSeconds);

            if (poseRemainingSeconds <= 0) {
                clearInterval(poseTimer);
                poseTimer = null;
                poseTimerRunning = false;
                audio.playSingingBowl(528, 4.0);
                btn.innerHTML = "✅ Complete! Restart";
                document.getElementById("poseTimerText").textContent = "NAMASTE";
            }
        }, 1000);
    }
}

function resetPoseTimer() {
    if (poseTimer) {
        clearInterval(poseTimer);
        poseTimer = null;
    }
    poseTimerRunning = false;
    poseRemainingSeconds = poseTotalSeconds;
    document.getElementById("poseTimerText").textContent = formatTimer(poseTotalSeconds);
    const btn = document.getElementById("startPoseTimerBtn");
    if (btn) btn.innerHTML = "▶️ Start Hold Timer";
}

/* ==========================================================================
   CURATED PRACTICE ROUTINES KNOWLEDGE & FLOW CONTROLLER
   ========================================================================== */
const ROUTINES = {
    morning: {
        title: "🌅 Morning Awakening Flow",
        tag: "☀️ Prana & Vitality Boost",
        desc: "A carefully sequenced 6-pose sadhana designed to stretch the spine, awaken digestive Agni, and ground your mental focus for the day ahead.",
        meta: "6 Asanas • 15 Mins",
        poses: [
            { id: "tadasana", hold: 45, note: "Ground firmly through all four corners of feet; lengthen spine upward to center awareness." },
            { id: "vrikshasana", hold: 45, note: "Awaken balance and vertical alignment. Switch legs smoothly midway." },
            { id: "trikonasana", hold: 45, note: "Expand thoracic ribcage, open hips and stretch hamstrings laterally." },
            { id: "virabhadrasana1", hold: 45, note: "Build leg stamina and open psoas/hip flexors with warrior courage." },
            { id: "bhujangasana", hold: 45, note: "Gentle spinal backbend opening heart and boosting respiratory capacity." },
            { id: "balasana", hold: 90, note: "Deep restorative rest; surrender tension and ground prana into your core." }
        ]
    },
    desk: {
        title: "🪑 Desk & Spine Relief Flow",
        tag: "🌿 Posture & Neck Decompression",
        desc: "A targeted 5-pose sequence that immediately releases tension from long hours of sitting, opening shoulders, thoracic spine, and hip flexors.",
        meta: "5 Asanas • 10 Mins",
        poses: [
            { id: "tadasana", hold: 45, note: "Reset posture and roll shoulders back and down away from ears." },
            { id: "gomukhasana", hold: 45, note: "Deeply stretch tight rotator cuffs and upper back latissimus." },
            { id: "ardha_matsyendrasana", hold: 45, note: "Detoxify spinal discs with gentle rotational release." },
            { id: "cat_cow", hold: 60, note: "Mobilize pelvic joints and lubricate each vertebra." },
            { id: "balasana", hold: 90, note: "Rest forehead on mat to relieve eye and mental fatigue." }
        ]
    },
    evening: {
        title: "🌙 Evening Deep Calming & Sleep Flow",
        tag: "💤 Parasympathetic Reset",
        desc: "A restorative 5-pose evening sadhana designed to lower cortisol, calm mental chatter, and prepare the body for deep restful sleep.",
        meta: "5 Asanas • 15 Mins",
        poses: [
            { id: "balasana", hold: 60, note: "Begin by turning inward and slowing breath exhalations." },
            { id: "paschimottanasana", hold: 60, note: "Soothe central nervous system with gentle forward fold." },
            { id: "baddha_konasana", hold: 60, note: "Release stored emotional tension from pelvic hips." },
            { id: "viparita_karani", hold: 120, note: "Drain lymphatic fatigue from legs and lower resting heart rate." },
            { id: "shavasana", hold: 180, note: "Complete conscious surrender into profound tranquil stillness." }
        ]
    },
    strength: {
        title: "⚡ Core Fire & Stamina Sadhana",
        tag: "🔥 Strength & Stability",
        desc: "A dynamic 6-pose sequence that fires up the core (Manipura), strengthens quadriceps, tones back extensors, and builds inner courage.",
        meta: "6 Asanas • 18 Mins",
        poses: [
            { id: "utkatasana", hold: 45, note: "Ignite quadriceps, glutes, and core stability in Chair pose." },
            { id: "virabhadrasana2", hold: 45, note: "Channel warrior determination and open the pelvic base." },
            { id: "navasana", hold: 30, note: "Fire up deep abdominal stabilizers and hip flexors." },
            { id: "setu_bandhasana", hold: 60, note: "Strengthen posterior chain and stimulate thyroid vitality." },
            { id: "chakrasana", hold: 30, note: "Full wheel upward arch flooding nervous system with energy." },
            { id: "shavasana", hold: 120, note: "Cool down and integrate energetic vitality." }
        ]
    }
};

let currentRoutineKey = "morning";
let currentRoutineData = ROUTINES.morning;
let routinePoseIndex = 0;
let routineTimer = null;
let routinePoseRemainingSeconds = 45;
let routinePoseTotalSeconds = 45;
let routineState = 'idle'; // 'holding', 'resting', 'idle', 'completed'
let isRoutineAutoPlaying = false;

const routineModal = document.getElementById("routineModal");
const routineModalCloseBtn = document.getElementById("routineModalCloseBtn");

function startRoutine(type) {
    if (!ROUTINES[type]) type = "morning";
    currentRoutineKey = type;
    currentRoutineData = ROUTINES[type];
    routinePoseIndex = 0;
    isRoutineAutoPlaying = false;
    routineState = 'idle';

    if (routineTimer) {
        clearInterval(routineTimer);
        routineTimer = null;
    }

    document.getElementById("routineTagBadge").textContent = currentRoutineData.tag;
    document.getElementById("routineFlowTitle").textContent = currentRoutineData.title;
    document.getElementById("routineFlowDesc").textContent = currentRoutineData.desc;
    document.getElementById("routineMetaBadge").textContent = currentRoutineData.meta;

    renderRoutineTimeline();
    renderRoutineActivePose();

    const playBtn = document.getElementById("routinePlayBtn");
    if (playBtn) playBtn.innerHTML = "▶️ Start Full Guided Flow";

    routineModal.classList.add("show");
}

function renderRoutineTimeline() {
    const container = document.getElementById("routineTimelineContainer");
    const total = currentRoutineData.poses.length;

    container.innerHTML = currentRoutineData.poses.map((p, idx) => {
        const asana = ASANAS.find(a => a.id === p.id) || {};
        const isActive = idx === routinePoseIndex;
        
        const thumbHTML = asana.image ? 
            `<img src="${asana.image}" alt="${asana.sanskrit}" onerror="this.onerror=null; this.parentElement.innerHTML = getAsanaSVG('${asana.id}');">` : 
            getAsanaSVG(asana.id || "tadasana");

        return `
            <div class="routine-timeline-card ${isActive ? 'active' : ''}" onclick="selectRoutinePose(${idx})">
                <span class="routine-step-badge">${idx + 1}</span>
                <div class="routine-card-thumb">
                    ${thumbHTML}
                </div>
                <div class="routine-card-name" title="${asana.sanskrit} (${asana.english})">${asana.sanskrit || p.id}</div>
                <div class="routine-card-duration">⏱️ ${p.hold}s Hold</div>
            </div>
        `;
    }).join("");

    // Progress Bar and Text
    const pct = Math.round(((routinePoseIndex + 1) / total) * 100);
    document.getElementById("routineProgressBar").style.width = `${pct}%`;
    document.getElementById("routineProgressText").textContent = `Pose ${routinePoseIndex + 1} of ${total} (${pct}%)`;
}

function renderRoutineActivePose() {
    const currentPoseConfig = currentRoutineData.poses[routinePoseIndex];
    const asana = ASANAS.find(a => a.id === currentPoseConfig.id) || {};
    const total = currentRoutineData.poses.length;

    const imgBox = document.getElementById("routineActiveImageBox");
    if (asana.image) {
        imgBox.innerHTML = `
            <img src="${asana.image}" alt="${asana.sanskrit}" onerror="this.onerror=null; this.parentElement.innerHTML = getAsanaSVG('${asana.id}');">
            <span class="view-mode-badge" style="bottom:8px; right:8px;">📸 Pose ${routinePoseIndex + 1}</span>
        `;
    } else {
        imgBox.innerHTML = getAsanaSVG(asana.id || "tadasana");
    }

    document.getElementById("routinePoseNumberBadge").textContent = `Pose ${routinePoseIndex + 1} of ${total}`;
    document.getElementById("routinePoseChakraBadge").textContent = asana.chakra || "Heart";
    document.getElementById("routinePoseTargetBadge").textContent = (asana.target ? asana.target.split(',')[0] : "Spine");

    document.getElementById("routinePoseSanskritName").textContent = asana.sanskrit || currentPoseConfig.id;
    document.getElementById("routinePoseEnglishName").textContent = asana.english || "";
    
    document.getElementById("routinePoseInstruction").innerHTML = `
        <strong>💡 Alignment Cue:</strong> ${currentPoseConfig.note}
    `;

    // Reset hold timer
    routinePoseTotalSeconds = currentPoseConfig.hold;
    routinePoseRemainingSeconds = currentPoseConfig.hold;
    document.getElementById("routineTimerStateText").textContent = "ACTIVE POSE HOLD";
    document.getElementById("routineTimerStateText").style.color = "var(--accent-cyan)";
    document.getElementById("routineTimerDisplay").textContent = formatTimer(routinePoseRemainingSeconds);

    renderRoutineTimeline();
}

function selectRoutinePose(idx) {
    if (idx < 0 || idx >= currentRoutineData.poses.length) return;
    routinePoseIndex = idx;
    if (routineTimer) {
        clearInterval(routineTimer);
        routineTimer = null;
    }
    isRoutineAutoPlaying = false;
    const playBtn = document.getElementById("routinePlayBtn");
    if (playBtn) playBtn.innerHTML = "▶️ Start Guided Flow from Pose " + (idx + 1);

    renderRoutineActivePose();
}

function nextRoutinePose() {
    if (routinePoseIndex < currentRoutineData.poses.length - 1) {
        selectRoutinePose(routinePoseIndex + 1);
    } else {
        selectRoutinePose(0);
    }
}

function prevRoutinePose() {
    if (routinePoseIndex > 0) {
        selectRoutinePose(routinePoseIndex - 1);
    } else {
        selectRoutinePose(currentRoutineData.poses.length - 1);
    }
}

function toggleRoutineAutoPlay() {
    const playBtn = document.getElementById("routinePlayBtn");
    if (isRoutineAutoPlaying) {
        // Pause
        clearInterval(routineTimer);
        routineTimer = null;
        isRoutineAutoPlaying = false;
        playBtn.innerHTML = "▶️ Resume Flow";
    } else {
        // Start Auto Play
        isRoutineAutoPlaying = true;
        playBtn.innerHTML = "⏸️ Pause Guided Flow";
        audio.playSingingBowl(432, 2.0);

        routineState = 'holding';
        document.getElementById("routineTimerStateText").textContent = "ACTIVE POSE HOLD";
        document.getElementById("routineTimerStateText").style.color = "var(--accent-cyan)";

        routineTimer = setInterval(() => {
            routinePoseRemainingSeconds--;
            document.getElementById("routineTimerDisplay").textContent = formatTimer(routinePoseRemainingSeconds);

            if (routinePoseRemainingSeconds <= 0) {
                if (routineState === 'holding') {
                    // Pose hold finished! Transition rest
                    audio.playSingingBowl(528, 3.0);
                    
                    if (routinePoseIndex < currentRoutineData.poses.length - 1) {
                        // 5-second Transition & Breathe interval
                        routineState = 'resting';
                        routinePoseRemainingSeconds = 5;
                        document.getElementById("routineTimerStateText").textContent = "🌿 BREATHE & PREPARE FOR NEXT ASANA";
                        document.getElementById("routineTimerStateText").style.color = "var(--accent-gold)";
                        document.getElementById("routineTimerDisplay").textContent = "00:05";
                    } else {
                        // Entire sequence finished!
                        clearInterval(routineTimer);
                        routineTimer = null;
                        isRoutineAutoPlaying = false;
                        routineState = 'completed';
                        audio.playSingingBowl(528, 5.0);
                        playBtn.innerHTML = "✅ Sadhana Completed! Restart";
                        document.getElementById("routineTimerStateText").textContent = "🙏 SADHANA COMPLETED • NAMASTE";
                        document.getElementById("routineTimerStateText").style.color = "var(--accent-green)";
                        document.getElementById("routineTimerDisplay").textContent = "OM SHANTI";
                    }
                } else if (routineState === 'resting') {
                    // Rest finished, move to next pose
                    routinePoseIndex++;
                    renderRoutineActivePose();
                    audio.playSingingBowl(432, 2.0);
                    routineState = 'holding';
                }
            }
        }, 1000);
    }
}

if (routineModalCloseBtn) {
    routineModalCloseBtn.addEventListener("click", () => {
        routineModal.classList.remove("show");
        if (routineTimer) {
            clearInterval(routineTimer);
            routineTimer = null;
        }
        isRoutineAutoPlaying = false;
    });
}

if (routineModal) {
    routineModal.addEventListener("click", (e) => {
        if (e.target === routineModal) {
            routineModal.classList.remove("show");
            if (routineTimer) {
                clearInterval(routineTimer);
                routineTimer = null;
            }
            isRoutineAutoPlaying = false;
        }
    });
}

/* ==========================================================================
   SURYA NAMASKAR 12-STEP CONTROLLER
   ========================================================================== */
function buildSuryaStepper() {
    const container = document.getElementById("suryaStepIcons");
    container.innerHTML = SURYA_STEPS.map((s, idx) => `
        <button class="surya-step-btn ${idx === currentSuryaIndex ? 'active' : ''}" onclick="goToSuryaStep(${idx})">
            ${s.step}
        </button>
    `).join("");
}

function renderSuryaStep() {
    const s = SURYA_STEPS[currentSuryaIndex];
    const suryaBox = document.getElementById("suryaImageBox");
    if (s.image) {
        suryaBox.innerHTML = `
            <img src="${s.image}" alt="${s.sanskrit}" onerror="this.onerror=null; this.parentElement.innerHTML = getAsanaSVG('${s.svgId}');">
            <span class="view-mode-badge" style="bottom:10px; right:10px;">☀️ Step ${s.step}</span>
        `;
    } else {
        suryaBox.innerHTML = getAsanaSVG(s.svgId);
    }

    document.getElementById("suryaStepBadge").textContent = `Step ${s.step} of 12`;
    document.getElementById("suryaChakraBadge").textContent = s.chakra;
    document.getElementById("suryaSanskritName").textContent = s.sanskrit;
    document.getElementById("suryaEnglishName").textContent = s.english;
    document.getElementById("suryaMantra").innerHTML = `🕉️ Mantra: <i>${s.mantra}</i>`;
    document.getElementById("suryaBreathInstruction").innerHTML = `<strong>🌬️ Breath Cue:</strong> ${s.breath}`;
    document.getElementById("suryaDescription").textContent = s.desc;

    buildSuryaStepper();
    audio.playSingingBowl(432, 1.2);
}

function nextSuryaStep() {
    currentSuryaIndex = (currentSuryaIndex + 1) % SURYA_STEPS.length;
    renderSuryaStep();
}

function prevSuryaStep() {
    currentSuryaIndex = (currentSuryaIndex - 1 + SURYA_STEPS.length) % SURYA_STEPS.length;
    renderSuryaStep();
}

function goToSuryaStep(idx) {
    currentSuryaIndex = idx;
    renderSuryaStep();
}

function toggleSuryaAutoPlay() {
    const btn = document.getElementById("suryaAutoPlayBtn");
    if (suryaAutoTimer) {
        clearInterval(suryaAutoTimer);
        suryaAutoTimer = null;
        btn.innerHTML = "▶️ Auto-Guided Flow (5s / step)";
    } else {
        btn.innerHTML = "⏸️ Pause Auto Flow";
        nextSuryaStep();
        suryaAutoTimer = setInterval(() => {
            nextSuryaStep();
        }, 5000);
    }
}

suryaFlowBtn.addEventListener("click", () => {
    currentSuryaIndex = 0;
    renderSuryaStep();
    suryaModal.classList.add("show");
});

suryaModalCloseBtn.addEventListener("click", () => {
    suryaModal.classList.remove("show");
    if (suryaAutoTimer) {
        clearInterval(suryaAutoTimer);
        suryaAutoTimer = null;
        document.getElementById("suryaAutoPlayBtn").innerHTML = "▶️ Auto-Guided Flow (5s / step)";
    }
});

suryaModal.addEventListener("click", (e) => {
    if (e.target === suryaModal) {
        suryaModal.classList.remove("show");
        if (suryaAutoTimer) {
            clearInterval(suryaAutoTimer);
            suryaAutoTimer = null;
            document.getElementById("suryaAutoPlayBtn").innerHTML = "▶️ Auto-Guided Flow (5s / step)";
        }
    }
});

/* ==========================================================================
   RANDOM DAILY POSTURE DISCOVERY
   ========================================================================== */
randomAsanaBtn.addEventListener("click", () => {
    const rand = ASANAS[Math.floor(Math.random() * ASANAS.length)];
    openAsanaModal(rand.id);
});

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
renderAsanas();
buildSuryaStepper();
