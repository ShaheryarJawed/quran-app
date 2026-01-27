/**
 * Quran Portal Logic - Complete (v5.3)
 * Tafsir Integration + Audio Player Refinements + Playbar Reciters
 */

console.log("Quran Script v5.3 Loading...");

// --- CONFIGURATION ---
const RECITERS = {
    'ar.alafasy': { name: 'Mishary Rashid Alafasy', slug: 'Alafasy_128kbps' },
    'ar.abdulbasit': { name: 'Abdul Basit (Murattal)', slug: 'Abdul_Basit_Murattal_192kbps' },
    'ar.sudais': { name: 'Abdurrahmaan As-Sudais', slug: 'Abdurrahmaan_As-Sudais_192kbps' },
    'ar.husary': { name: 'Mahmoud Khalil Al-Husary', slug: 'Husary_128kbps' },
    'ar.minshawi': { name: 'Mohamed Siddiq Al-Minshawi (Mujawwad)', slug: 'Minshawy_Mujawwad_192kbps' },
    'ar.shuraim': { name: 'Saud Al-Shuraim', slug: 'Saood_ash-Shuraym_128kbps' },
    'ar.mahermuaiqly': { name: 'Maher Al Muaiqly', slug: 'MaherAlMuaiqly128kbps' },
    'ar.ahmedajamy': { name: 'Ahmed ibn Ali al-Ajamy', slug: 'Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net' },
    'ar.hudhaify': { name: 'Ali Al-Hudhaify', slug: 'Hudhaify_128kbps' },
    'ar.shaatree': { name: 'Abu Bakr Al Shatri', slug: 'Abu_Bakr_Ash-Shaatree_128kbps' },
    'ar.ghamdi': { name: 'Saad Al-Ghamdi', slug: 'Ghamadi_40kbps' },
    'ar.jibril': { name: 'Muhammad Jibreel', slug: 'Muhammad_Jibreel_128kbps' },
    'ar.basfar': { name: 'Abdullah Basfar', slug: 'Abdullah_Basfar_192kbps' },
    'ur.khan': { name: 'Urdu (Shamshad Ali Khan)', slug: 'Urdu_Shamshad_Ali_Khan_46kbps' }
};

// --- STATE ---
let quranState = {
    audio: null,
    isPlaying: false,
    currentSurahId: null,
    currentAyahIndex: 0,
    currentReciter: 'ar.alafasy',
    currentLanguage: 'ur', // 'ur' or 'en'
    surahData: null,
    tafsirData: null // Cache for Tafsir
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Initializing Quran Portal...");
    initQuranPortal();
    populateReciterOptions(); // Populates both Modal and Playbar
});

// --- INITIALIZATION ---
function initQuranPortal() {
    const grid = document.getElementById('surah-grid');
    if (!grid) return;

    setupAudioPlayerUI();

    // Data Load
    let surahs = [];
    if (window.GLOBAL_QURAN_DATA && window.GLOBAL_QURAN_DATA.data && window.GLOBAL_QURAN_DATA.data.surahs) {
        surahs = window.GLOBAL_QURAN_DATA.data.surahs;
    } else if (window.QURAN_DATA && window.QURAN_DATA.data) {
        surahs = window.QURAN_DATA.data.surahs;
    }

    if (surahs.length > 0) {
        renderSurahs(surahs, grid);
        window.quranData = { surahs: surahs };
    } else {
        fetch('./quran.json')
            .then(res => res.json())
            .then(data => {
                const list = data.data ? data.data.surahs : (data.surahs || []);
                renderSurahs(list, grid);
                window.quranData = { surahs: list };
            })
            .catch(err => {
                grid.innerHTML = `<div style="text-align:center; color:#ef4444; padding:2rem;">Data Load Error</div>`;
            });
    }

    // Search
    const searchInput = document.getElementById('surah-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const allSurahs = window.quranData ? window.quranData.surahs : [];
            const filtered = allSurahs.filter(s =>
                s.englishName.toLowerCase().includes(query) ||
                s.name.includes(query) ||
                s.number.toString().includes(query)
            );
            renderSurahs(filtered, grid);
        });
    }
}

// --- RECITERS & SETTINGS ---
function populateReciterOptions() {
    const modalSelect = document.getElementById('modal-reciter-select');
    const playbarSelect = document.getElementById('playbar-reciter-select');

    // Clear both
    if (modalSelect) modalSelect.innerHTML = '';
    if (playbarSelect) playbarSelect.innerHTML = '';

    for (const [key, data] of Object.entries(RECITERS)) {
        // Modal Option
        if (modalSelect) {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = data.name;
            if (key === quranState.currentReciter) opt.selected = true;
            modalSelect.appendChild(opt);
        }

        // Playbar Option
        if (playbarSelect) {
            const opt2 = document.createElement('option');
            opt2.value = key;
            const shortName = data.name.split('(')[0].trim(); // Shorter name for playbar
            opt2.textContent = shortName;
            if (key === quranState.currentReciter) opt2.selected = true;
            playbarSelect.appendChild(opt2);
        }
    }

    // Event Listeners
    if (modalSelect) {
        modalSelect.onchange = (e) => {
            const wasPlaying = quranState.isPlaying;

            changeReciter(e.target.value);

            // Seamless switch if playing: Restart the current Ayah immediately
            if (wasPlaying) {
                playAyahByIndex(quranState.currentAyahIndex, true, 0);
            }
        };
    }
    if (playbarSelect) {
        playbarSelect.onchange = (e) => {
            const wasPlaying = quranState.isPlaying;

            changeReciter(e.target.value);

            // Seamless switch if playing: Restart the current Ayah immediately
            if (wasPlaying) {
                setTimeout(() => playAyahByIndex(quranState.currentAyahIndex, true, 0), 0); // Try minimal timeout to yield to UI
            }
        };
    }
}

function changeReciter(reciterKey) {
    // Hard Stop: Ensure any existing audio is fully stopped
    stopAudio();

    quranState.currentReciter = reciterKey;
    // Sync Selects
    const modalSelect = document.getElementById('modal-reciter-select');
    const playbarSelect = document.getElementById('playbar-reciter-select');
    if (modalSelect) modalSelect.value = reciterKey;
    if (playbarSelect) playbarSelect.value = reciterKey;

    // Update Player UI Text
    document.getElementById('player-reciter-name').textContent = RECITERS[reciterKey].name;
}

window.openSettingsModal = function () {
    document.getElementById('settings-modal').classList.remove('hidden');
};

window.closeSettingsModal = function () {
    document.getElementById('settings-modal').classList.add('hidden');
};

window.setLanguage = function (lang) {
    quranState.currentLanguage = lang;

    // UI Update
    document.getElementById('btn-lang-ur').className = lang === 'ur' ? 'segment-btn active' : 'segment-btn';
    document.getElementById('btn-lang-en').className = lang === 'en' ? 'segment-btn active' : 'segment-btn';
    document.getElementById('btn-lang-ur').style.background = lang === 'ur' ? 'white' : 'transparent';
    document.getElementById('btn-lang-en').style.background = lang === 'en' ? 'white' : 'transparent';

    // Re-render text if detail view is open
    if (quranState.surahData) {
        loadDetailView(quranState.currentSurahId, window.quranData.surahs);
    }
};

// --- TAFSIR LOGIC ---
window.openTafsirModal = async function () {
    const modal = document.getElementById('tafsir-modal');
    const content = document.getElementById('tafsir-content');
    if (!modal || !content) return;

    modal.classList.remove('hidden');
    content.innerHTML = '<div class="loading-spinner"></div><p style="text-align:center;">Loading Ibn Kathir (Urdu)...</p>';

    // Load Data if not loaded
    if (!quranState.tafsirData) {
        try {
            const response = await fetch('tafseer-ibn-e-kaseer-urdu.json');
            if (!response.ok) throw new Error("Failed to load tafsir file");
            quranState.tafsirData = await response.json();
            console.log("Tafsir Data Loaded.");
        } catch (error) {
            console.error(error);
            content.innerHTML = '<p style="color:red; text-align:center;">Error loading Tafsir data.</p>';
            return;
        }
    }

    // Render Tafsir for *Current Surah*
    // Note: The JSON structure is keys like "1:1", "1:2"...
    // We will show the Tafsir for the current Ayah if possible, or the whole Surah context.
    // For now, let's list the Tafsir entries for the current Surah.

    if (!quranState.currentSurahId) {
        content.innerHTML = '<p>Please select a Surah first.</p>';
        return;
    }

    const sId = quranState.currentSurahId;
    let html = `<h2>Tafsir for Surah ${quranState.surahData.englishName}</h2>`;

    // We will loop through Ayahs of this surah and check if tafsir exists
    // Limit to first few or lazy load? The file is huge.
    // Let's iterate the current Surah's ayahs.

    let found = false;
    // Only show Tafsir for the current viewed ayah if playing, otherwise show list?
    // User requested "Add data in tafsir button".
    // Better UX: Show Tafsir for the *currently focused* or *all* ayahs of surm.

    html += '<div style="max-height: 60vh; overflow-y: auto; padding-right: 10px;">';

    quranState.surahData.ayahs.forEach(ayah => {
        const key = `${sId}:${ayah.numberInSurah}`;
        const tafsirEntry = quranState.tafsirData[key];

        if (tafsirEntry) {
            found = true;
            html += `
                <div class="tafsir-block" style="margin-bottom: 2rem; border-bottom:1px solid #eee; padding-bottom:1rem;">
                    <h4 style="color:#047857; margin-bottom:0.5rem;">Ayah ${ayah.numberInSurah}</h4>
                    <p style="font-family:'Amiri'; font-size:1.2rem; background:#f8fafc; padding:0.5rem; text-align:right;">${ayah.text}</p>
                    <div class="ur-text" style="text-align:right; direction:rtl; font-family:'Noto Nastaliq Urdu'; line-height:2;">
                        ${tafsirEntry.text || tafsirEntry.desc || "No text"}
                    </div>
                </div>
            `;
        }
    });

    html += '</div>';

    if (!found) {
        content.innerHTML = '<p>No Tafsir data found for this Surah in the available database.</p>';
    } else {
        content.innerHTML = html;
    }
};

if (document.getElementById('close-tafsir')) {
    document.getElementById('close-tafsir').onclick = () => {
        document.getElementById('tafsir-modal').classList.add('hidden');
    };
}


// --- RENDERING ---
function renderSurahs(list, container) {
    if (!list || list.length === 0) {
        container.innerHTML = '<p style="color:white; text-align:center;">No Surahs found.</p>';
        return;
    }

    container.innerHTML = list.map(surah => `
        <div class="surah-card-portal" onclick="window.location.href='quran.html?surah=${surah.number}'">
            <div class="surah-header-portal">
                <span class="surah-number-badge">${surah.number}</span>
                <span class="ayah-count-tag">${surah.ayahs ? surah.ayahs.length : 0} Ayahs</span>
            </div>
            <div class="surah-titles-portal">
                <h3 class="surah-name-ar">${surah.name.replace('سورة ', '')}</h3>
                <h4 class="surah-name-en">${surah.englishName}</h4>
                <p class="surah-meaning">${surah.englishNameTranslation}</p>
            </div>
        </div>
    `).join('');

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('surah')) {
        loadDetailView(parseInt(urlParams.get('surah')), list);
    }
}

// --- DETAIL VIEW ---
function loadDetailView(surahId, allSurahs) {
    const surah = allSurahs.find(s => s.number == surahId);
    if (!surah) return;

    quranState.currentSurahId = surahId;
    quranState.surahData = surah;
    quranState.currentAyahIndex = 0; // Reset index when loading new surah

    document.getElementById('surah-grid').classList.add('hidden');
    document.getElementById('surah-detail-view').classList.remove('hidden');
    document.getElementById('current-surah-name').textContent = `${surah.englishName} (${surah.name})`;

    const ayahContainer = document.getElementById('ayah-list');
    if (!surah.ayahs || surah.ayahs.length === 0) {
        ayahContainer.innerHTML = '<p style="color:yellow; text-align:center;">No Ayahs.</p>';
        return;
    }

    ayahContainer.innerHTML = surah.ayahs.map((ayah, idx) => {
        let translation = (quranState.currentLanguage === 'ur')
            ? (ayah.translation_ur || "Urdu translation not available")
            : (ayah.translation_en || ayah.text);

        return `
         <div class="ayah-container" id="ayah-box-${idx}" 
              style="background: white; color: #1e293b; padding: 2rem; border-radius: 12px; margin-bottom: 1.5rem; transition: background 0.3s;">
            <div class="ayah-header" style="display:flex; justify-content:space-between; margin-bottom:1rem;">
                <span class="ayah-badge" style="background:#ecfdf5; color:#047857; padding:0.2rem 0.8rem; border-radius:20px; font-weight:bold;">
                    ${surahId}:${ayah.numberInSurah}
                </span>
                <div class="ayah-actions">
                     <button id="ayah-play-btn-${idx}" onclick="playAyahByIndex(${idx})" class="action-btn" style="cursor:pointer; padding:0.5rem; border-radius:50%; border:1px solid #ddd;">
                        <i class='bx bx-play'></i>
                     </button>
                </div>
            </div>
            <h1 class="arabic-text-large" style="color: #000; direction: rtl; text-align: right; font-family: 'Amiri', serif; font-size: 2.2rem; line-height: 2;">${ayah.text}</h1>
            <p class="translation-text" style="color: #475569; font-size: 1.1rem; line-height: 1.6; margin-top: 1rem; text-align:left;">
                ${translation}
            </p>
         </div>
    `}).join('');

    const backBtn = document.getElementById('back-to-list');
    if (backBtn) {
        backBtn.onclick = () => {
            document.getElementById('surah-grid').classList.remove('hidden');
            document.getElementById('surah-detail-view').classList.add('hidden');
            stopAudio();
            window.history.pushState({}, '', 'quran.html');
        };
    }
}

// --- AUDIO ENGINE ---
window.playAyahByIndex = function (index, forcePlay = false, startTime = 0) {
    if (!quranState.surahData) return;

    // Toggle Logic if clicking the same one that is playing AND NOT FORCED
    if (!forcePlay && quranState.isPlaying && quranState.currentAyahIndex === index) {
        togglePlay();
        return;
    }

    quranState.currentAyahIndex = index;
    const ayah = quranState.surahData.ayahs[index];
    // const audioId = ayah.number; // Global Ayah Number (Old Logic)

    const url = getAudioUrl(quranState.currentReciter, quranState.surahData.number, ayah.numberInSurah);
    playAudioUrl(url, ayah.numberInSurah, startTime);
};

function getAudioUrl(reciterKey, surahNum, ayahNum) {
    const reciterData = RECITERS[reciterKey];
    if (!reciterData) return '';

    // Pad to 3 digits
    const s = String(surahNum).padStart(3, '0');
    const a = String(ayahNum).padStart(3, '0');

    // Add timestamp to prevent caching logic issues on the browser side
    const timestamp = Date.now();
    return `https://everyayah.com/data/${reciterData.slug}/${s}${a}.mp3?t=${timestamp}`;
}

function playAudioUrl(url, ayahNum, startTime = 0) {
    // Cleanup old audio safely
    if (quranState.audio) {
        quranState.audio.onended = null; // CRITICAL: Prevent old audio from triggering next ayah
        quranState.audio.pause();
        quranState.audio = null;
    }

    quranState.audio = new Audio(url);
    quranState.audio.currentTime = startTime; // seeking support
    quranState.isPlaying = true;

    // UI Updates
    const bar = document.getElementById('audio-player-bar');
    if (bar) bar.style.display = 'flex'; // Ensure visible

    document.getElementById('player-surah-name').textContent = `${quranState.surahData.englishName}`;
    document.getElementById('player-status-text').textContent = `Playing Ayah ${ayahNum}...`;

    updatePlayUIState();

    quranState.audio.play().catch(e => {
        console.error("Playback error:", e);
        document.getElementById('player-status-text').textContent = "Error playing audio.";
        stopAudio();
    });

    quranState.audio.onended = () => {
        playNextAyah();
    };

    // Highlight Box
    highlightActiveAyah();
}

function playNextAyah() {
    const nextIndex = quranState.currentAyahIndex + 1;
    // Fix: Make sure we don't go out of bounds
    if (quranState.surahData && nextIndex < quranState.surahData.ayahs.length) {
        playAyahByIndex(nextIndex);
    } else {
        stopAudio();
        document.getElementById('player-status-text').textContent = "Surah Completed";
    }
}

function playPreviousAyah() {
    const prevIndex = quranState.currentAyahIndex - 1;
    if (prevIndex >= 0) {
        playAyahByIndex(prevIndex);
    }
}

function stopAudio() {
    if (quranState.audio) {
        quranState.audio.onended = null; // Cleanup listener
        quranState.audio.pause();
    }
    quranState.isPlaying = false;
    updatePlayUIState();

    document.getElementById('player-status-text').textContent = "Ready to play";

    // Remove highlight
    document.querySelectorAll('.ayah-container').forEach(d => d.style.background = 'white');
}

// [Modified] Auto-play from start if no audio
function togglePlay() {
    // New Logic: If no audio exists (idle on page), play first Ayah
    if (!quranState.audio) {
        if (quranState.surahData && quranState.surahData.ayahs.length > 0) {
            playAyahByIndex(0);
        }
        return;
    }

    if (quranState.isPlaying) {
        quranState.audio.pause();
        quranState.isPlaying = false;
        document.getElementById('player-status-text').textContent = "Paused";
    } else {
        quranState.audio.play();
        quranState.isPlaying = true;
        document.getElementById('player-status-text').textContent = `Playing Ayah ${quranState.surahData.ayahs[quranState.currentAyahIndex].numberInSurah}...`;
    }
    updatePlayUIState();
}

function updatePlayUIState() {
    const isPlaying = quranState.isPlaying;
    const idx = quranState.currentAyahIndex;

    // 1. Playbar Button (Update for new UI)
    const mainBtn = document.getElementById('play-pause-btn');
    if (mainBtn) mainBtn.innerHTML = isPlaying ? "<i class='bx bx-pause'></i>" : "<i class='bx bx-play' style='margin-left:5px;'></i>";
    // Margin adjustment for play icon purely visual centering

    // 2. All Ayah Buttons -> Reset to Play
    document.querySelectorAll('.ayah-actions button i').forEach(icon => {
        icon.className = 'bx bx-play';
    });

    // 3. Current Ayah Button -> Set to Pause if Playing
    if (isPlaying) {
        const currentBtnIcon = document.querySelector(`#ayah-play-btn-${idx} i`);
        if (currentBtnIcon) currentBtnIcon.className = 'bx bx-pause';
    }
}

function highlightActiveAyah() {
    document.querySelectorAll('.ayah-container').forEach(d => d.style.background = 'white');
    const activeBox = document.getElementById(`ayah-box-${quranState.currentAyahIndex}`);
    if (activeBox) {
        activeBox.style.background = '#f0fdf4';
        activeBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function setupAudioPlayerUI() {
    const playBtn = document.getElementById('play-pause-btn');
    if (playBtn) playBtn.onclick = togglePlay;

    const closeBtn = document.getElementById('close-player');
    if (closeBtn) closeBtn.onclick = stopAudio;

    const nextBtn = document.getElementById('next-ayah-btn');
    if (nextBtn) nextBtn.onclick = playNextAyah;

    const prevBtn = document.getElementById('prev-ayah-btn');
    if (prevBtn) prevBtn.onclick = playPreviousAyah;
}
