
// Mocking the environment
const window = {};
global.window = window;
const document = {
    getElementById: () => ({
        style: {},
        classList: { remove: () => { }, add: () => { } },
        textContent: '',
        innerHTML: '',
        appendChild: () => { },
        value: ''
    }),
    createElement: () => ({ value: '', textContent: '', selected: false }),
    querySelectorAll: () => [],
    querySelector: () => ({ className: '' }),
};
global.document = document;
global.window = global;

// Mock Audio
class Audio {
    constructor(url) {
        this.url = url;
        this.onended = null;
        this.paused = true;
        console.log(`[Audio] Created with URL: ${url}`);
    }
    play() {
        console.log(`[Audio] Playing: ${this.url}`);
        this.paused = false;
        return Promise.resolve();
    }
    pause() {
        console.log(`[Audio] Paused: ${this.url}`);
        this.paused = true;
    }
}
global.Audio = Audio;

// Helper to log state
function logState() {
    console.log(`[State] Reciter: ${quranState.currentReciter}, IsPlaying: ${quranState.isPlaying}, AudioURL: ${quranState.audio ? quranState.audio.url : 'null'}`);
}

// Load script content (simulated by requiring or pasting relevant parts)
// Start of quran.js logic (simplified for test)

const RECITERS = {
    'ar.alafasy': { name: 'Mishary Rashid Alafasy', slug: 'Alafasy_128kbps' },
    'ar.sudais': { name: 'Abdurrahmaan As-Sudais', slug: 'Abdurrahmaan_As-Sudais_192kbps' },
};

let quranState = {
    audio: null,
    isPlaying: false,
    currentSurahId: 1,
    currentAyahIndex: 0,
    currentReciter: 'ar.alafasy',
    surahData: { number: 1, ayahs: [{ numberInSurah: 1 }, { numberInSurah: 2 }] }
};

// ... copy relevant functions ...
function getAudioUrl(reciterKey, surahNum, ayahNum) {
    const reciterData = RECITERS[reciterKey];
    if (!reciterData) return '';
    const s = String(surahNum).padStart(3, '0');
    const a = String(ayahNum).padStart(3, '0');
    return `https://everyayah.com/data/${reciterData.slug}/${s}${a}.mp3`;
}

function stopAudio() {
    if (quranState.audio) {
        quranState.audio.onended = null;
        quranState.audio.pause();
    }
    quranState.isPlaying = false;
    // updatePlayUIState(); // ignored
    console.log("[StopAudio] Called");
}

function playAudioUrl(url, ayahNum, startTime = 0) {
    if (quranState.audio) {
        quranState.audio.onended = null;
        quranState.audio.pause();
        quranState.audio = null;
    }
    quranState.audio = new Audio(url);
    quranState.audio.currentTime = startTime;
    quranState.isPlaying = true;

    // UI updates ignored

    quranState.audio.play().catch(e => {
        console.error("Playback error:", e);
        stopAudio();
    });
}

function playAyahByIndex(index, forcePlay = false, startTime = 0) {
    if (!quranState.surahData) return;

    // Logic from user file
    if (!forcePlay && quranState.isPlaying && quranState.currentAyahIndex === index) {
        // togglePlay(); // ignored for this test
        console.log("Toggle happening instead of play");
        return;
    }

    quranState.currentAyahIndex = index;
    const ayah = quranState.surahData.ayahs[index];
    const url = getAudioUrl(quranState.currentReciter, quranState.surahData.number, ayah.numberInSurah);
    console.log(`[PlayAyahByIndex] Generated URL: ${url}`);
    playAudioUrl(url, ayah.numberInSurah, startTime);
}

function changeReciter(reciterKey) {
    stopAudio(); // <--- ORIGINAL CODE CALLS THIS
    quranState.currentReciter = reciterKey;
    console.log(`[ChangeReciter] Switched to ${reciterKey}`);
}

// SIMULATION

// 1. Initial Play
console.log("--- 1. Start Playing with Alafasy ---");
playAyahByIndex(0);
logState();

// 2. Switch Reciter logic (simulating the event listener)
console.log("\n--- 2. User switches to Sudais ---");
const wasPlaying = quranState.isPlaying; // Capture state
console.log(`[Event] wasPlaying: ${wasPlaying}`);

changeReciter('ar.sudais'); // Called by handler
logState();

if (wasPlaying) {
    // Simulated setTimeout
    console.log("[Event] Triggering seamless restart...");
    playAyahByIndex(quranState.currentAyahIndex, true, 0);
}
logState();
