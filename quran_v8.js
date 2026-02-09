/**
 * Quran Portal Logic - Complete (v5.5)
 * Tafsir Integration + Audio Player Refinements + Playbar Reciters
 * Added: Bismillah Pre-roll
 */

console.log("Quran Script v5.5 Loading...");

// --- CONFIGURATION ---
// --- CONFIGURATION ---
const RECITER_MAPPING = {
    'ar.alafasy': 7,
    'ar.abdulbasit': null,        // Force Fallback
    'ar.abdulbasitmujawwad': null, // Force Fallback
    'ar.sudais': null, // Force Fallback
    'ar.husary': null,            // Force Fallback
    'ar.minshawi': null,          // Force Fallback
    'ar.shuraim': null,
    'ar.mahermuaiqly': null,
    'ar.ahmedajamy': null,
    'ar.hudhaify': null,
    'ar.ghamdi': null,
    'ar.basfar': null,
    'ar.shaatree': null,
    'ar.jibril': null,
    'ar.dossari': null,
    'ar.rifai': null,
    'ar.ayyub': null,
    'ar.parhizgar': null
};

const RECITERS = {
    // Verified Reciters (API + EveryAyah)
    'ar.alafasy': { name: 'Mishary Rashid Alafasy', slug: 'Alafasy_128kbps' },
    'ar.abdulbasit': { name: 'Abdul Basit (Murattal)', slug: 'Abdul_Basit_Murattal_192kbps' },
    'ar.abdulbasitmujawwad': { name: 'Abdul Basit (Mujawwad)', slug: 'AbdulSamad_64kbps_QuranExplorer.Com' },
    'ar.sudais': { name: 'Abdurrahmaan As-Sudais', slug: 'Abdurrahmaan_As-Sudais_192kbps' },
    'ar.husary': { name: 'Mahmoud Khalil Al-Husary', slug: 'Husary_128kbps' },
    'ar.minshawi': { name: 'Mohamed Siddiq Al-Minshawi', slug: 'Minshawy_Mujawwad_192kbps' },
    'ar.shuraim': { name: 'Saud Al-Shuraim', slug: 'Saood_ash-Shuraym_128kbps' },
    'ar.shaatree': { name: 'Abu Bakr Al-Shatri', slug: 'Abu_Bakr_Ash-Shaatree_128kbps' },
    'ar.rifai': { name: 'Hani Ar-Rifai', slug: 'Hani_Rifai_192kbps' },
    'ar.dossari': { name: 'Yasser Al-Dossari', slug: 'Yasser_Ad-Dussary_128kbps' },

    // Fallback Reciters (EveryAyah Only - No Sync)
    'ar.mahermuaiqly': { name: 'Maher Al Muaiqly', slug: 'MaherAlMuaiqly128kbps' },
    'ar.ahmedajamy': { name: 'Ahmed ibn Ali al-Ajamy', slug: 'Ahmed_ibn_Ali_al-Ajamy_128kbps_ketaballah.net' },
    'ar.hudhaify': { name: 'Ali Al-Hudhaify', slug: 'Hudhaify_128kbps' },
    'ar.ghamdi': { name: 'Saad Al-Ghamdi', slug: 'Ghamadi_40kbps' }, // FIXED Valid Slug
    'ar.jibril': { name: 'Muhammad Jibreel', slug: 'Muhammad_Jibreel_128kbps' },
    'ar.basfar': { name: 'Abdullah Basfar', slug: 'Abdullah_Basfar_192kbps' },
    'ar.ayyub': { name: 'Muhammad Ayyub', slug: 'Muhammad_Ayyoub_128kbps' },
    'ar.parhizgar': { name: 'Parhizgar', slug: 'Parhizgar_48kbps' },

    // Translation
    'ur.jalandhry': { name: 'Fateh Muhammad Jalandhry (Urdu)', slug: 'translations/urdu_shamshad_ali_khan_46kbps' }
};

// --- STATE ---
let quranState = {
    audio: null,
    isPlaying: false,
    isPlayingBismillah: false,
    currentSurahId: null,
    currentAyahIndex: 0,
    currentReciter: localStorage.getItem('preferred_reciter') || 'ar.alafasy', // Load from localStorage
    currentLanguage: 'ur',
    surahData: null,
    tafsirData: null,

    // NEW: Audio Sync State
    audioTimings: null, // Holds segment data [ayahIndex][wordIndex] => { start, end }
    audioFiles: null,   // Holds URLs from new API
    lastHighlightedWordId: null
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded. Initializing Quran Portal...");
    initQuranPortal();
    populateReciterOptions(); // Populates both Modal and Playbar

    // Setup global listeners
    const userChip = document.querySelector('.user-chip');
    if (userChip) {
        userChip.style.cursor = 'pointer';
        userChip.onclick = () => window.openSettingsModal();
    }
});

// --- INITIALIZATION ---
function initQuranPortal() {
    const grid = document.getElementById('surah-grid');
    if (!grid) return;

    setupAudioPlayerUI();
    setupAdvancedAudioEvents();

    // Data Load
    let surahs = [];
    if (window.GLOBAL_QURAN_DATA && window.GLOBAL_QURAN_DATA.data && window.GLOBAL_QURAN_DATA.data.surahs) {
        surahs = window.GLOBAL_QURAN_DATA.data.surahs;
    } else if (window.QURAN_DATA && window.QURAN_DATA.data) {
        surahs = window.QURAN_DATA.data.surahs;
    }

    try {
        if (surahs.length > 0) {
            console.log("Loading from Global Data");
            window.quranData = { surahs: surahs };

            // LOAD JUZ MAP DIRECTLY FROM GLOBAL VARIABLE
            if (window.QURAN_JUZ_DATA) {
                window.quranData.juzMap = window.QURAN_JUZ_DATA;
                renderJuzList(surahs);
            } else {
                console.warn("Juz Map Global Not Found. Fetching...");
                fetch('./quran-juz.json')
                    .then(r => r.json())
                    .then(juzData => {
                        window.quranData.juzMap = juzData;
                        renderJuzList(surahs);
                    })
                    .catch(e => {
                        console.error("Juz Map Error", e);
                        renderJuzList(surahs);
                    });
            }

            renderSurahs(surahs, grid);
            handleDeepLink(surahs);
        } else {
            console.log("Fetching quran.json");
            fetch('./quran.json')
                .then(res => res.json())
                .then(data => {
                    const list = data.data ? data.data.surahs : (data.surahs || []);
                    window.quranData = { surahs: list };

                    if (window.QURAN_JUZ_DATA) {
                        window.quranData.juzMap = window.QURAN_JUZ_DATA;
                        renderJuzList(list);
                    } else {
                        fetch('./quran-juz.json')
                            .then(r => r.json())
                            .then(juzData => {
                                window.quranData.juzMap = juzData;
                                renderJuzList(list);
                            });
                    }

                    renderSurahs(list, grid);
                    handleDeepLink(list);
                })
                .catch(err => {
                    console.error("Fetch Error:", err);
                    grid.innerHTML = `<div style="text-align:center; color:#ef4444; padding:2rem;">Data Load Error: ${err.message}</div>`;
                });
        }
    } catch (e) {
        console.error("Init Error:", e);
        grid.innerHTML = `<div style="text-align:center; color:#ef4444; padding:2rem;">Init Critical Error: ${e.message}</div>`;
    }


    function handleDeepLink(list) {
        const urlParams = new URLSearchParams(window.location.search);
        const surahId = urlParams.get('surah');
        const ayahNum = urlParams.get('ayah');

        if (surahId && typeof loadDetailView === 'function') {
            setTimeout(() => {
                loadDetailView(parseInt(surahId), list);

                // Auto Scroll to Ayah
                if (ayahNum) {
                    const idx = parseInt(ayahNum) - 1;
                    setTimeout(() => {
                        const target = document.getElementById(`ayah-box-${idx}`);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
                            // Highlight effect
                            target.style.background = '#ecfdf5'; // Light Emerald
                            target.style.border = '1px solid #10b981';

                            setTimeout(() => {
                                target.style.background = 'white';
                                target.style.border = 'none';
                            }, 3000);
                        }
                    }, 500); // Allow render time
                }
            }, 100);
        }
    }

    // Search
    const searchInput = document.getElementById('surah-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();

            // CHECK: Are we in Detail VieW?
            const detailView = document.getElementById('surah-detail-view');
            if (detailView && !detailView.classList.contains('hidden')) {
                // JUMP TO AYAH LOGIC
                const ayahNum = parseInt(query);
                if (!isNaN(ayahNum) && ayahNum > 0) {
                    const idx = ayahNum - 1;
                    const targetAyah = document.getElementById(`ayah-box-${idx}`);
                    if (targetAyah) {
                        targetAyah.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // Optional: Highlight effect
                        targetAyah.style.background = '#f0fdf4';
                        setTimeout(() => {
                            if (quranState.currentAyahIndex !== idx) {
                                targetAyah.style.background = 'white';
                            }
                        }, 2000);
                    }
                }
                return; // Stop here, don't filter surahs
            }

            // DEFAULT: Filter Surahs
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
    const customList = document.getElementById('custom-reciter-options');
    const customTrigger = document.getElementById('custom-reciter-trigger');
    const customLabel = document.getElementById('p-reciter-label');

    if (modalSelect) {
        modalSelect.innerHTML = '';
        for (const [key, data] of Object.entries(RECITERS)) {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = data.name;
            if (key === quranState.currentReciter) opt.selected = true;
            modalSelect.appendChild(opt);
        }
        modalSelect.onchange = (e) => {
            handleReciterChange(e.target.value);
        };
    }

    if (customList && customLabel) {
        customList.innerHTML = '';
        const currentData = RECITERS[quranState.currentReciter];
        if (currentData) customLabel.textContent = currentData.name.split('(')[0].trim();

        for (const [key, data] of Object.entries(RECITERS)) {
            const item = document.createElement('div');
            item.className = `custom-option ${key === quranState.currentReciter ? 'selected' : ''}`;
            item.innerHTML = `<span>${data.name}</span>`;
            item.onclick = () => {
                handleReciterChange(key);
                document.getElementById('playbar-reciter-wrapper').classList.remove('open');
            };
            customList.appendChild(item);
        }

        if (customTrigger) {
            customTrigger.onclick = (e) => {
                e.stopPropagation();
                document.getElementById('playbar-reciter-wrapper').classList.toggle('open');
            };
        }
    }
}

document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('playbar-reciter-wrapper');
    if (wrapper && wrapper.classList.contains('open') && !wrapper.contains(e.target)) {
        wrapper.classList.remove('open');
    }
});

function handleReciterChange(reciterKey) {
    console.log(`[Debug] handleReciterChange called: ${reciterKey}`);
    const wasPlaying = quranState.isPlaying;
    changeReciter(reciterKey);
    if (wasPlaying) {
        setTimeout(() => playAyahByIndex(quranState.currentAyahIndex, true, 0), 100);
    }
}

function changeReciter(reciterKey) {
    // ALERT DEBUGGING
    // ALERT DEBUGGING REMOVED
    console.log(`[Debug] changeReciter: Setting ${reciterKey}`);
    console.log(`[Debug] changeReciter: Setting ${reciterKey}`);

    stopAudio();
    quranState.currentReciter = reciterKey;

    // Save to localStorage for persistence
    localStorage.setItem('preferred_reciter', reciterKey);

    const modalSelect = document.getElementById('modal-reciter-select');
    if (modalSelect) modalSelect.value = reciterKey;

    const customLabel = document.getElementById('p-reciter-label');
    if (customLabel) customLabel.textContent = RECITERS[reciterKey].name.split('(')[0].trim();

    document.querySelectorAll('.custom-option').forEach(opt => {
        opt.classList.remove('selected');
        if (opt.textContent.includes(RECITERS[reciterKey].name)) {
            opt.classList.add('selected');
        }
    });

    const nameEl = document.getElementById('player-reciter-name');
    if (nameEl) nameEl.textContent = RECITERS[reciterKey].name;

    // SYNC AUDIO VIEW DROPDOWN
    const audioViewSelect = document.getElementById('audio-reciter-select');
    if (audioViewSelect) audioViewSelect.value = reciterKey;

    // FORCE CLEAR AUDIO SATE
    quranState.audioFiles = {};
    quranState.audioTimings = null;
    quranState.lastCacheKey = null;
}

window.setLanguage = function (lang) {
    quranState.currentLanguage = lang;
    document.querySelectorAll('.lang-toggle-btn').forEach(btn => btn.classList.remove('active'));

    if (lang === 'ur') {
        const btn = document.getElementById('toggle-lang-ur');
        if (btn) btn.classList.add('active');
    } else {
        const btn = document.getElementById('toggle-lang-en');
        if (btn) btn.classList.add('active');
    }

    if (quranState.surahData) {
        loadDetailView(quranState.currentSurahId, window.quranData.surahs);
    }
};

// --- TAFSIR ---
window.toggleTafsirDrawer = async function () {
    const drawer = document.getElementById('tafsir-drawer');
    const overlay = document.getElementById('side-drawer-overlay');
    const content = document.getElementById('tafsir-drawer-content');

    if (!drawer || !overlay) return;

    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
        return;
    }

    drawer.classList.add('open');
    overlay.classList.add('open');

    if (!quranState.tafsirData) {
        content.innerHTML = '<div class="loading-spinner"></div><p style="text-align:center;">Loading Ibn Kathir (Urdu)...</p>';
    }

    if (!quranState.tafsirData) {
        if (window.TAFSIR_DB) {
            quranState.tafsirData = window.TAFSIR_DB;
        } else if (window.FULL_TAFSIR_DATA) {
            quranState.tafsirData = window.FULL_TAFSIR_DATA;
        } else {
            try {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'tafsir_db.js';
                    script.onload = () => {
                        if (window.TAFSIR_DB) {
                            quranState.tafsirData = window.TAFSIR_DB;
                            resolve();
                        } else if (window.FULL_TAFSIR_DATA) {
                            quranState.tafsirData = window.FULL_TAFSIR_DATA;
                            resolve();
                        } else {
                            reject(new Error("Data not found in script (TAFSIR_DB or FULL_TAFSIR_DATA)"));
                        }
                    };
                    script.onerror = () => reject(new Error("Failed to load script: tafsir_db.js"));
                    document.body.appendChild(script);
                });
                console.log("Tafsir Data Loaded via Script.");
            } catch (error) {
                console.error(error);
                content.innerHTML = '<p style="color:#ef4444; text-align:center;">Error loading Tafsir data. Please try again.</p>';
                return;
            }
        }
    }

    if (!quranState.currentSurahId) {
        content.innerHTML = '<div style="text-align:center; padding-top:2rem;"><p>Please select a Surah first.</p></div>';
        return;
    }

    quranState.tafsirRenderIndex = 0;
    quranState.tafsirBatchSize = 15;

    const r = renderTafsirHeader();
    content.innerHTML = r.html;
    renderNextTafsirBatch();
};

function renderTafsirHeader() {
    return {
        html: `
        <div style="text-align:center; margin-bottom:2rem;">
            <h4 style="color:#64748b; font-weight:400; font-size:0.9rem; text-transform:uppercase; letter-spacing:1px;">Surah Ref</h4>
            <h2 style="font-family:'Amiri'; color:var(--primary-emerald); font-size:2rem; margin:0.5rem 0;">${quranState.surahData.name}</h2>
            <p style="color:#94a3b8;">${quranState.surahData.englishName}</p>
        </div>
        <div id="tafsir-list-container"></div>
        <div id="tafsir-load-more" style="text-align:center; padding: 2rem 0;">
            <button onclick="renderNextTafsirBatch()" class="btn-magic" style="margin:0 auto;">Load More Ayahs</button>
        </div>
        `
    };
}

window.renderNextTafsirBatch = function () {
    const container = document.getElementById('tafsir-list-container');
    const loadMoreBtn = document.getElementById('tafsir-load-more');
    if (!container) return;

    const sId = quranState.currentSurahId;
    const ayahs = quranState.surahData.ayahs;
    const start = quranState.tafsirRenderIndex;
    const end = Math.min(start + quranState.tafsirBatchSize, ayahs.length);

    if (start >= ayahs.length) {
        loadMoreBtn.innerHTML = '<p style="color:#94a3b8;">End of Tafsir</p>';
        return;
    }

    let html = '';
    for (let i = start; i < end; i++) {
        const ayah = ayahs[i];
        const key = `${sId}:${ayah.numberInSurah}`;
        const tafsirEntry = quranState.tafsirData[key];

        if (tafsirEntry) {
            html += `
                <div class="tafsir-block">
                    <span class="tafsir-ayah-ref">Ayah ${ayah.numberInSurah}</span>
                    <div class="tafsir-ayah-preview">
                        ${ayah.text}
                    </div>
                    <div class="tafsir-text-ur">
                        ${tafsirEntry.text || tafsirEntry.desc || "No text"}
                    </div>
                </div>
            `;
        }
    }

    const div = document.createElement('div');
    div.innerHTML = html;
    container.appendChild(div);

    quranState.tafsirRenderIndex = end;

    if (quranState.tafsirRenderIndex >= ayahs.length) {
        loadMoreBtn.style.display = 'none';
    }
};


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
                <div class="surah-name-row">
                    <h4 class="surah-name-en">${surah.englishName}</h4>
                    <h3 class="surah-name-ar">${surah.name.replace('سورة ', '')}</h3>
                </div>
                <p class="surah-meaning">${surah.englishNameTranslation}</p>
            </div>
        </div>
    `).join('');


    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('surah')) {
        loadDetailView(parseInt(urlParams.get('surah')), list);
    }
    initializePlaybarDropdown(list);
}

// --- JUZ / FILTER LOGIC ---
function renderJuzList(allSurahs) {
    const container = document.getElementById('juz-grid');
    if (!container) return;

    const surahs = allSurahs || (window.quranData ? window.quranData.surahs : []);

    container.classList.remove('juz-grid-portal');
    container.classList.add('juz-list-container');

    const hasMap = window.quranData && window.quranData.juzMap;

    let html = '';

    for (let i = 1; i <= 30; i++) {
        let surahTags = '';

        if (hasMap && window.quranData.juzMap[i] && window.quranData.juzMap[i].verse_mapping) {
            const juzInfo = window.quranData.juzMap[i];
            const surahIds = Object.keys(juzInfo.verse_mapping);

            surahTags = surahIds.map(id => {
                const s = surahs.find(item => item.number == id);
                return s ? `<span class="juz-surah-tag clickable" onclick="event.stopPropagation(); window.location.href='quran.html?surah=${s.number}';">${s.englishName}</span>` : '';
            }).join('');
        }

        html += `
        <div class="juz-list-item" style="cursor: default;">
            <div class="juz-list-num">${i}</div>
            <div class="juz-list-content">
                <h3 class="juz-list-title">Juz ${i}</h3>
                <div class="juz-list-surahs">
                    ${surahTags || (hasMap ? '' : '<span style="color:#64748b; font-size:0.8rem;">Loading...</span>')}
                </div>
            </div>
        </div>
        `;
    }

    container.innerHTML = html;
}

// Duplicate renderJuzList removed

window.switchTab = function (tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const sGrid = document.getElementById('surah-grid');
    const jGrid = document.getElementById('juz-grid');
    const aView = document.getElementById('audio-quran-view');
    const dView = document.getElementById('surah-detail-view');
    const playerBar = document.getElementById('audio-player-bar');

    // Hide all first
    sGrid.classList.add('hidden');
    jGrid.classList.add('hidden');
    if (aView) aView.classList.add('hidden');
    if (dView) dView.classList.add('hidden');

    // Hide player bar initially
    if (playerBar) playerBar.style.display = 'none';

    if (tab === 'surah') {
        sGrid.classList.remove('hidden');
        // Restore player bar if playing
        if (quranState.audio && playerBar) playerBar.style.display = 'flex';
    } else if (tab === 'juz') {
        jGrid.classList.remove('hidden');
        if (quranState.audio && playerBar) playerBar.style.display = 'flex';
    } else if (tab === 'audio') {
        if (aView) {
            aView.classList.remove('hidden');
            initAudioQuranView();
            // Ensure playbar is HIDDEN here
            if (playerBar) playerBar.style.display = 'none';
        }
    }
};

function initAudioQuranView() {
    const surahSelect = document.getElementById('audio-surah-select');
    const reciterSelect = document.getElementById('audio-reciter-select');

    if (surahSelect && surahSelect.options.length <= 1) {
        const list = window.quranData ? window.quranData.surahs : [];
        surahSelect.innerHTML = '<option value="" disabled selected>Choose a Surah...</option>';
        list.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.number;
            opt.textContent = `${s.number}. ${s.englishName} (${s.name})`;
            surahSelect.appendChild(opt);
        });

        // STOP AUDIO ON SURAH CHANGE
        surahSelect.onchange = () => {
            if (quranState.isPlaying || quranState.audio) {
                stopAudio();
            }
        };
    }

    if (reciterSelect && reciterSelect.options.length === 0) {
        reciterSelect.innerHTML = ''; // Clear default if any
        for (const [key, data] of Object.entries(RECITERS)) {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = data.name;
            if (key === quranState.currentReciter) opt.selected = true;
            reciterSelect.appendChild(opt);
        }
        reciterSelect.onchange = (e) => {
            quranState.currentReciter = e.target.value;
            changeReciter(e.target.value); // Syncs global state
        };
    }

    // ALWAYS sync selection to current state when entering view
    if (reciterSelect) {
        reciterSelect.value = quranState.currentReciter;
    }
}

window.startAudioQuranPlayback = function () {
    const surahSelect = document.getElementById('audio-surah-select');
    const reciterSelect = document.getElementById('audio-reciter-select');

    if (!surahSelect || !surahSelect.value) {
        alert("Please select a Surah first.");
        return;
    }

    const surahId = parseInt(surahSelect.value);
    const reciterKey = reciterSelect.value;

    // 1. Check if same Surah & Reciter logic
    const isSameSurah = quranState.currentSurahId === surahId;
    const isSameReciter = quranState.currentReciter === reciterKey;

    if (isSameSurah && isSameReciter && quranState.audio) {
        // Toggle Logic
        togglePlay();
    } else {
        // Start New
        handleReciterChange(reciterKey);
        const allSurahs = window.quranData ? window.quranData.surahs : [];
        const surah = allSurahs.find(s => s.number == surahId);

        if (surah) {
            // Load Detail View (Populates DOM, sets state, stops previous audio)
            loadDetailView(surahId, allSurahs);

            // FORCE SWITCH BACK TO AUDIO VIEW (Hide Detail, Show Audio)
            const dView = document.getElementById('surah-detail-view');
            const aView = document.getElementById('audio-quran-view');

            if (dView) dView.classList.add('hidden');
            if (aView) aView.classList.remove('hidden');

            // --- UI TOGGLE: HIDE BUTTON, SHOW ADVANCED PLAYER ---
            const btn = document.getElementById('audio-quran-btn');
            const advPlayer = document.getElementById('audio-advanced-player');
            if (btn) btn.classList.add('hidden');
            if (advPlayer) advPlayer.classList.remove('hidden');

            // --- HIDE GLOBAL PLAYER BAR (Fix for "Two Playbars") ---
            const globalPlayerBar = document.getElementById('audio-player-bar');
            if (globalPlayerBar) {
                globalPlayerBar.style.display = 'none';
                globalPlayerBar.classList.remove('flex'); // Ensure flex class doesn't override
            }

            // Play
            setTimeout(() => {
                playAyahByIndex(0, true);
            }, 100);
        }
    }
};

function renderJuzSectionHTML(surah, ayahs) {
    // Legacy content renderer
}



// --- PLAYBAR DROPDOWN ---
function initializePlaybarDropdown(list) {
    const select = document.getElementById('player-surah-select');
    if (!select) return;

    select.innerHTML = '<option value="" disabled selected>Select Surah</option>';
    list.forEach(surah => {
        const opt = document.createElement('option');
        opt.value = surah.number;
        opt.textContent = `${surah.number}. ${surah.englishName} (${surah.name})`;
        select.appendChild(opt);
    });

    select.addEventListener('change', (e) => {
        const surahId = parseInt(e.target.value);
        if (surahId) {
            loadDetailView(surahId, list);
        }
    });
}

// --- DETAIL VIEW ---
function loadDetailView(surahId, allSurahs) {
    const surah = allSurahs.find(s => s.number == surahId);
    if (!surah) return;

    quranState.currentSurahId = surahId;
    quranState.surahData = surah;
    quranState.currentAyahIndex = 0;

    stopAudio();

    // SYNC PLAYBAR SELECTION
    const playerSelect = document.getElementById('player-surah-select');
    if (playerSelect) playerSelect.value = surahId;

    document.getElementById('surah-grid').classList.add('hidden');
    document.getElementById('surah-detail-view').classList.remove('hidden');
    document.getElementById('current-surah-name').textContent = `${surah.englishName} (${surah.name})`;

    const ayahContainer = document.getElementById('ayah-list');
    if (!surah.ayahs || surah.ayahs.length === 0) {
        ayahContainer.innerHTML = '<p style="color:yellow; text-align:center;">No Ayahs.</p>';
        return;
    }

    ayahContainer.innerHTML = surah.ayahs.map((ayah, idx) => {
        let translation = "";

        if (quranState.currentLanguage === 'ur') {
            if (window.QURAN_UR_JALANDHRY && window.QURAN_UR_JALANDHRY.quran && window.QURAN_UR_JALANDHRY.quran['ur.jalandhry'] && window.QURAN_UR_JALANDHRY.quran['ur.jalandhry'][ayah.number]) {
                translation = window.QURAN_UR_JALANDHRY.quran['ur.jalandhry'][ayah.number].verse;
            } else {
                translation = ayah.translation_ur || "Urdu translation not available";
            }
        } else {
            if (window.QURAN_EN_AHMEDRAZA && window.QURAN_EN_AHMEDRAZA.quran && window.QURAN_EN_AHMEDRAZA.quran['en.ahmedraza'] && window.QURAN_EN_AHMEDRAZA.quran['en.ahmedraza'][ayah.number]) {
                translation = window.QURAN_EN_AHMEDRAZA.quran['en.ahmedraza'][ayah.number].verse;
            } else {
                translation = ayah.translation_en || ayah.text;
            }
        }

        // --- WORD SPLIT LOGIC ---
        // We split by space to get words.
        // We attach ID: w-{surahId}-{ayahNumInSurah}-{wordIndex}
        let text = ayah.text || ""; // Safety check

        // Strip Bismillah from Ayah 1 (except Fatiha & Tawbah)
        const sId = Number(surahId);
        const ayahNum = Number(ayah.numberInSurah);

        if (ayahNum === 1 && sId !== 1 && sId !== 9) {
            // 1. Uthmani (Most likely from API)
            const bismillahUthmani = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";

            // 2. Simple Arabic
            const bismillahSimple = "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ";

            // 3. Normalized Regex (Matches start of string, Ba-Sin-Mim...)
            // Strips anything starting with Bismillah...Raheem including spaces
            const regex = /^\s*بِسْمِ\s+ٱ?للّ?َ?هِ\s+ٱ?لرَّحْمَ?ـ?ٰ?نِ\s+ٱ?لرَّحِيمِ\s*/u;

            if (text.startsWith(bismillahUthmani)) {
                text = text.replace(bismillahUthmani, "");
            } else if (text.startsWith("بِسْمِ اللَّهِ")) {
                // Fallback for simple font starts
                text = text.replace(/^بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\s*/, "");
                text = text.replace(/^بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\s*/, "");
            } else {
                // Aggressive Regex
                text = text.replace(regex, "");
            }

            // Final Cleanup
            text = text.trim();
        }

        const words = text.split(' ');

        let wordCounter = 0; // Only increment for real words

        const arabicHtml = words.map((w) => {
            // Check if w has Arabic letters (Alif-Yaa)
            // If not, it's a stop sign/symbol/number -> Don't give it an ID
            const hasLetters = /[\u0621-\u064A\u0671-\u06D3]/.test(w);

            if (hasLetters) {
                wordCounter++;
                // Word ID uses the filtered counter
                return `<span id="w-${quranState.currentSurahId}-${ayah.numberInSurah}-${wordCounter}" class="quran-word" onclick="seekToWord(${idx}, ${wordCounter})">${w}</span>`;
            } else {
                // Symbol: No ID, No Click, No Highlight Class
                return `<span class="quran-symbol">${w}</span>`;
            }
        }).join(' ');

        // Check Like State
        const likeId = `${surahId}:${ayah.numberInSurah}`;
        const liked = isAyahLiked(likeId);

        return `
        <div class="ayah-container" id="ayah-box-${idx}" 
             style="background: white; color: #1e293b; padding: 2rem; border-radius: 12px; margin-bottom: 1.5rem; transition: background 0.3s; scroll-margin-top: 150px;">
            <div class="ayah-header" style="display:flex; justify-content:space-between; margin-bottom:1rem;">
                <span class="ayah-badge" style="background:#ecfdf5; color:#047857; padding:0.2rem 0.8rem; border-radius:20px; font-weight:bold;">
                    ${surahId}:${ayah.numberInSurah}
                </span>
                <div class="ayah-actions" style="display:flex; gap:0.5rem;">
                     
                     <button onclick="toggleAyahLike('${surahId}', '${ayah.numberInSurah}', '${idx}')" class="action-btn" style="cursor:pointer; padding:0.5rem; border-radius:50%; border:1px solid #ddd; background:transparent;">
                        <i id="like-icon-${idx}" class='bx ${liked ? 'bxs-heart' : 'bx-heart'}' style="font-size:1.2rem; color:${liked ? '#ef4444' : '#64748b'}; transition:all 0.2s;"></i>
                     </button>

                     <button id="ayah-play-btn-${idx}" onclick="playAyahByIndex(${idx})" class="action-btn" style="cursor:pointer; padding:0.5rem; border-radius:50%; border:1px solid #ddd;">
                        <i class='bx bx-play'></i>
                     </button>
                </div>
            </div>
            <h1 class="arabic-text-large" style="color: #000; direction: rtl; text-align: right; font-family: 'Amiri', serif; font-size: 2.2rem; line-height: 2;">${arabicHtml}</h1>
            <p id="trans-${surahId}-${ayah.numberInSurah}" class="translation-text" style="color: #475569; font-size: 1.1rem; line-height: 1.6; margin-top: 1rem; text-align:left; transition: color 0.3s; border-radius: 8px; padding: 0.5rem;">
                ${translation}
            </p>
         </div>
        `;
    }).join('');

    // Update Search Placeholder
    const searchInput = document.getElementById('surah-search');
    if (searchInput) {
        searchInput.value = '';
        searchInput.placeholder = "Search Ayah No...";
    }

    const backBtn = document.getElementById('back-to-list');
    if (backBtn) {
        backBtn.onclick = () => {
            document.getElementById('surah-grid').classList.remove('hidden');
            document.getElementById('surah-detail-view').classList.add('hidden');

            // Reset Placeholder
            if (searchInput) {
                searchInput.value = '';
                searchInput.placeholder = "Search Surah...";
                // Trigger empty search to restore list
                searchInput.dispatchEvent(new Event('input'));
            }

            stopAudio();
            window.history.pushState({}, '', 'quran.html');
        };
    }
}

// --- AUDIO ENGINE ---
// --- ADVANCED AUDIO ENGINE (v2.0) ---

// 1. Fetch Timings from Quran.com (Verses Endpoint)
async function fetchAudioTimings(surahId, reciterKey) {

    // SKIP API for Urdu Translations (No word-by-word sync available usually)
    // We force fallback to EveryAyah which has the correct translation audio files.
    if (reciterKey && reciterKey.startsWith('ur.')) {
        console.log(`[Audio] Translation Reciter (${reciterKey}). Using fallback audio source.`);
        quranState.audioFiles = {};
        quranState.audioTimings = null; // No sync for translation
        quranState.lastCacheKey = `translation_${surahId}_${reciterKey}`;
        return;
    }

    const reciterId = RECITER_MAPPING[reciterKey];
    console.log(`[Debug] fetchAudioTimings: Key=${reciterKey} -> ID=${reciterId}`);

    // ALERT DEBUGGING
    // ALERT DEBUGGING REMOVED
    // if (!reciterId) alert(`DEBUG: Reciter ${reciterKey} is UNSUPPORTED (ID: null). Using Fallback.`);
    // else alert(`DEBUG: Reciter ${reciterKey} is SUPPORTED (ID: ${reciterId}). Using API.`);

    // PROXY TIMING LOGIC (The "Totally up to you" Fix)
    // If Reciter is unsupported (ID=null), we fetch Alafasy (ID=7) timings 
    // but force audioFiles to empty so we use EveryAyah audio.

    let fetchId = reciterId;
    let useProxyTimings = false;

    if (!reciterId) {
        console.log(`[Audio] Reciter ${reciterKey} has no API ID. Using Alafasy (ID=7) for Ghost Timings.`);
        fetchId = 7; // Alafasy
        useProxyTimings = true;
    }

    const cacheKey = `audio_${fetchId}_${surahId}`;

    if (quranState.audioTimings && quranState.lastCacheKey === cacheKey && !useProxyTimings) {
        return;
    }

    // In Proxy Mode, re-fetch logic is slightly loose, but let's just fetch.

    console.log(`[Audio] Fetching Data for ReciterID ${fetchId} (Proxy: ${useProxyTimings})`);

    // Show Loading State
    const playBtn = document.querySelector('.p-play-btn i');
    if (playBtn) playBtn.className = 'bx bx-loader-alt bx-spin';

    try {
        // Correct Endpoint: verses/by_chapter returns audio + segments
        // ADDED: per_page=300 to fetch ALL Ayahs (Max surah length is 286)
        // BUG FIX: Use fetchId (which includes proxy fallback) instead of reciterId
        const res = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${surahId}?audio=${fetchId}&per_page=300`);
        const data = await res.json();

        if (!data || !data.verses) throw new Error("Invalid API Data");

        // Map Data to State
        // If Proxy Mode: Clear audioFiles so we fallback to EveryAyah
        if (useProxyTimings) {
            quranState.audioFiles = {}; // Force Fallback
        } else {
            quranState.audioFiles = {};
        }

        quranState.audioTimings = {};

        data.verses.forEach(v => {
            if (v.audio) {
                const ayahNum = v.verse_number;

                // Only Use API Audio if NOT proxy
                if (!useProxyTimings) {
                    quranState.audioFiles[ayahNum] = `https://verses.quran.com/${v.audio.url}`;
                }

                // FIX 2: Parse Segment Arrays [index, ?, start, end]
                // We map them to object structure expected by handleTimeUpdate
                if (v.audio.segments) {
                    quranState.audioTimings[ayahNum] = v.audio.segments.map(seg => ({
                        word_location: seg[0] + 1, // 0-based index -> 1-based word location
                        timestamp_from: seg[2],
                        timestamp_to: seg[3]
                    }));
                }
            }
        });

        quranState.lastCacheKey = cacheKey;
        console.log("[Audio] Data Loaded Successfully");

    } catch (e) {
        console.error("[Audio] Fetch failed", e);
        // Don't alert here, let it fallback silently in playAyahByIndex
    } finally {
        if (playBtn) playBtn.className = 'bx bx-play';
    }
}

// 2. Main Play Function
window.playAyahByIndex = async function (index, forcePlay = false, startTime = 0, skipBismillah = false) {
    const ayah = quranState.surahData.ayahs[index];
    console.log(`[Audio] Play Request: Ayah ${ayah.numberInSurah} (Idx: ${index})`);

    // Toggle Pause if same ayah
    if (!forcePlay && quranState.isPlaying && quranState.currentAyahIndex === index) {
        togglePlay();
        return;
    }

    // Stop Previous (but don't kill next buffer yet)
    stopAudio();

    // Prepare New
    quranState.currentAyahIndex = index;

    // SAVE PREMIUM STATE
    saveLastRead(quranState.surahData.number, ayah.numberInSurah);

    // Ensure Data Loaded
    await fetchAudioTimings(quranState.surahData.number, quranState.currentReciter);

    // --- BISMILLAH PRE-ROLL LOGIC ---
    // Use loose equality != to handle string/number mismatch
    if (index === 0 && !skipBismillah && quranState.surahData.number != 1 && quranState.surahData.number != 9) {
        console.log("[Audio] Starting Bismillah Pre-roll for Surah " + quranState.surahData.number);

        // Clear any previous state
        stopAudio();

        quranState.isPlayingBismillah = true;
        quranState.currentAyahIndex = 0; // Visual focus on first ayah

        // Fetch Bismillah (Surah 1, Ayah 1) 
        // Note: Using hardcoded 'ar.alafasy' fallback if current reciter missing? No, use current.
        const bismillahUrl = getAudioUrl(quranState.currentReciter, 1, 1);

        // Manually trigger playback with isBismillah=true
        playAudioUrl(bismillahUrl, "Bismillah", 0, true);

        // PRELOAD FIRST AYAH during Bismillah
        preloadAudioForIndex(index);
        return;
    }
    // --------------------------------
    // Get URL
    let url = "";
    if (quranState.audioFiles && quranState.audioFiles[ayah.numberInSurah]) {
        url = quranState.audioFiles[ayah.numberInSurah];
    } else {
        // Fallback to old API if new fetch failed
        console.log("[Debug] Using Fallback URL Generator");
        url = getAudioUrl(quranState.currentReciter, quranState.surahData.number, ayah.numberInSurah);
    }

    // GAPLESS STRATEGY: Check if preloaded
    if (quranState.nextAudio && quranState.nextAudio.src === url) {
        console.log("[Audio] Using Preloaded Buffer 🚀");
        quranState.audio = quranState.nextAudio;
        quranState.nextAudio = null; // Consume it
    } else {
        console.log(`[Audio] Playing URL: ${url}`);
        // Setup Audio Object
        quranState.audio = new Audio(url);
    }

    quranState.audio.currentTime = startTime;

    // --- SYNC EVENTS ---
    // quranState.audio.ontimeupdate = () => handleTimeUpdate(ayah.numberInSurah); // Removed: Too slow/laggy

    quranState.audio.onended = () => {
        console.log("[Audio] Ayah Ended, Next...");
        // Auto Play Next
        if (index + 1 < quranState.surahData.ayahs.length) {
            playAyahByIndex(index + 1, true);
        } else {
            console.log("[Audio] Surah Finished");

            // Clean Stop
            if (quranState.audio) {
                quranState.audio.pause();
                quranState.audio = null;
            }
            quranState.isPlaying = false;
            updatePlaybarUI(false);
        }
    };

    quranState.audio.onerror = (e) => {
        console.error("Audio Error", e);
        alert("Audio failed to load.");
    };

    // Start
    const p = quranState.audio.play();
    if (p) {
        p.then(() => {
            quranState.isPlaying = true;
            updatePlaybarUI(true);
            highlightAyahContainer(index);
            startSyncLoop(ayah.numberInSurah);

            // 🔥 TRIGGER PRELOAD FOR NEXT 🔥
            if (index + 1 < quranState.surahData.ayahs.length) {
                preloadAudioForIndex(index + 1);
            }
        }).catch(e => {
            console.error("Play Blocked/Failed", e);
            // Auto skip if fail?
        });
    }
};

// NEW: Helper to preload
function preloadAudioForIndex(index) {
    if (index >= quranState.surahData.ayahs.length) return;

    const ayah = quranState.surahData.ayahs[index];
    let url = "";
    if (quranState.audioFiles && quranState.audioFiles[ayah.numberInSurah]) {
        url = quranState.audioFiles[ayah.numberInSurah];
    } else {
        url = getAudioUrl(quranState.currentReciter, quranState.surahData.number, ayah.numberInSurah);
    }

    // Create and Load
    const audio = new Audio(url);
    audio.preload = "auto";
    audio.load();
    quranState.nextAudio = audio;
    console.log(`[Audio] Preloading Ayah ${ayah.numberInSurah}...`);
}

// 3. Sync Logic (Loop Wrapper)
function startSyncLoop(ayahNum) {
    const currentIndex = quranState.currentAyahIndex;

    const syncLoop = () => {
        // Strict Safety Check
        if (quranState.currentAyahIndex !== currentIndex) {
            return; // Abort if changed
        }

        if (!quranState.audio || quranState.audio.paused) {
            // Keep alive if just paused
            if (quranState.audio && quranState.audio.paused) {
                quranState.syncReqId = requestAnimationFrame(syncLoop);
            }
            return;
        }

        handleTimeUpdate(ayahNum);
        quranState.syncReqId = requestAnimationFrame(syncLoop);
    };

    // Cancel any existing loop
    if (quranState.syncReqId) cancelAnimationFrame(quranState.syncReqId);

    console.log("Starting Sync Loop for Ayah:", ayahNum);
    quranState.syncReqId = requestAnimationFrame(syncLoop);
}

// Helper function to start the sync loop
function startSyncLoop(ayahNumForLoop) {
    // Cancel any existing loop
    if (quranState.syncReqId) {
        cancelAnimationFrame(quranState.syncReqId);
        quranState.syncReqId = null;
    }

    console.log("Starting Sync Loop for Ayah:", ayahNumForLoop);

    const syncLoop = () => {
        // Strict Safety Check: If we moved to another ayah, kill this loop
        // Compare against the ayah number this specific loop was started for
        if (quranState.surahData.ayahs[quranState.currentAyahIndex].numberInSurah !== ayahNumForLoop) {
            console.warn("Loop Aborted: Ayah Number Mismatch");
            quranState.syncReqId = null; // Ensure the ID is cleared
            return;
        }

        if (!quranState.audio || quranState.audio.paused) {
            // If paused, keep checking next frame in case it resumes
            if (quranState.audio && quranState.audio.paused) {
                quranState.syncReqId = requestAnimationFrame(syncLoop);
                return;
            }
            // If audio is null or not paused (e.g., ended and cleaned up), stop the loop
            quranState.syncReqId = null;
            return;
        }
        handleTimeUpdate(ayahNumForLoop);
        quranState.syncReqId = requestAnimationFrame(syncLoop);
    };

    quranState.syncReqId = requestAnimationFrame(syncLoop);
}


// 3. Sync Logic (Karaoke)
function handleTimeUpdate(ayahNum) {
    if (!quranState.audio) return;

    // SPECIAL CASE: URDU TRANSLATION (No Sync)
    // If no timings are present (disabled in fetchAudioTimings), but we are playing Urdu Jalandhry
    if (!quranState.audioTimings && quranState.currentReciter && quranState.currentReciter.startsWith('ur.')) {
        // Highlight the Translation Text Block
        const transEl = document.getElementById(`trans-${quranState.currentSurahId}-${ayahNum}`);
        if (transEl) {
            transEl.style.color = "#059669"; // Emerald Green
            transEl.style.fontWeight = "bold";
            // transEl.style.background = "#ecfdf5";
        }

        // FIX: Ensure no Arabic word remains highlighted from previous recitation
        if (quranState.lastHighlightedWordId) {
            const old = document.getElementById(quranState.lastHighlightedWordId);
            if (old) old.classList.remove('highlighted-word');
            quranState.lastHighlightedWordId = null;
        }

        return;
    }

    if (!quranState.audioTimings) return;

    // Debug log throttled? No, just log distinct
    const timeMs = quranState.audio.currentTime * 1000;
    const timings = quranState.audioTimings[ayahNum];

    if (!timings) {
        console.warn(`No Timings for Ayah ${ayahNum}`);
        return;
    }

    // Find active word
    // Segment format: { word_location: 1, timestamp_from: 0, timestamp_to: 500 }
    const activeSegment = timings.find(seg =>
        timeMs >= seg.timestamp_from && timeMs < seg.timestamp_to
    );

    if (activeSegment) {
        const wordId = `w-${quranState.currentSurahId}-${ayahNum}-${activeSegment.word_location}`;

        // Optimize: Don't re-select if already highlighted
        if (quranState.lastHighlightedWordId !== wordId) {
            console.log(`Highlighting Word: ${wordId}`);

            // Remove old highlight
            if (quranState.lastHighlightedWordId) {
                const old = document.getElementById(quranState.lastHighlightedWordId);
                if (old) old.classList.remove('highlighted-word');
            }

            // Add new highlight
            const el = document.getElementById(wordId);
            if (el) {
                el.classList.add('highlighted-word');
                quranState.lastHighlightedWordId = wordId;
            } else {
                console.warn("Element not found:", wordId);
            }
        }
    }
}

// 4. Seek to Word (Click Listener)
window.seekToWord = function (ayahIdx, wordLoc) {
    // If not playing this ayah, start it
    if (quranState.currentAyahIndex !== ayahIdx) {
        // We can't jump to specific word immediately without complex logic, 
        // simplified: just play ayah from start
        playAyahByIndex(ayahIdx, true);
        return;
    }

    // If already playing, jump to time
    if (quranState.audio && quranState.audioTimings) {
        const ayahNum = quranState.surahData.ayahs[ayahIdx].numberInSurah;
        const timings = quranState.audioTimings[ayahNum];
        const seg = timings.find(s => s.word_location === wordLoc);

        if (seg) {
            quranState.audio.currentTime = seg.timestamp_from / 1000;
        }
    }
};

// 5. Helpers
function highlightAyahContainer(idx) {
    // RESET ALL
    document.querySelectorAll('.ayah-container').forEach(d => {
        d.style.border = '1px solid #e2e8f0'; // Default border
        d.style.background = 'white'; // Default bg
        d.classList.remove('active-ayah-box');
    });

    const el = document.getElementById(`ayah-box-${idx}`);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // ACTIVE STYLE
        el.style.transition = 'background 0.3s ease';
        el.style.background = '#ecfdf5'; // Light Emerald
        el.style.border = '1px solid #10b981'; // Emerald Border
        el.classList.add('active-ayah-box');
    }
}

// Replaces old playAudioUrl logic
function stopAudio() {
    // 1. Cancel Sync Loop
    if (quranState.syncReqId) {
        cancelAnimationFrame(quranState.syncReqId);
        quranState.syncReqId = null;
    }

    if (quranState.audio) {
        quranState.audio.onended = null;
        quranState.audio.pause();
        quranState.audio = null;
    }
    quranState.isPlaying = false;
    updatePlaybarUI(false);

    // Clear word highlights
    if (quranState.lastHighlightedWordId) {
        const old = document.getElementById(quranState.lastHighlightedWordId);
        if (old) old.classList.remove('highlighted-word');
        quranState.lastHighlightedWordId = null;
    }
}

// Mock update function if not exists
// Helper to keep old getAudioUrl for fallback
function getAudioUrl(reciterKey, surahNum, ayahNum) {
    const reciterData = RECITERS[reciterKey];
    if (!reciterData) return '';
    const s = String(surahNum).padStart(3, '0');
    const a = String(ayahNum).padStart(3, '0');
    const url = `https://everyayah.com/data/${reciterData.slug}/${s}${a}.mp3`;
    console.log(`[Debug] Generated Fallback URL: ${url}`);
    return url;
}

// ALIAS for Compatibility
const updatePlaybarUI = updatePlayUIState;

// Note: playNextAyah and others are below.

function playNextAyah() {
    const nextIndex = quranState.currentAyahIndex + 1;
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

// stopAudio is defined above in Audio Engine.
// Removed duplicate stopAudio here.

function togglePlay() {
    if (!quranState.audio) {
        if (quranState.surahData && quranState.surahData.ayahs.length > 0) {
            playAyahByIndex(0);
        }
        return;
    }

    if (quranState.isPlaying) {
        quranState.audio.pause();
        quranState.isPlaying = false;
    } else {
        quranState.audio.play();
        quranState.isPlaying = true;
    }
    updatePlayUIState();
}

function updatePlayUIState() {
    const isPlaying = quranState.isPlaying;
    const idx = quranState.currentAyahIndex;
    const statusText = document.getElementById('player-status-text');

    // Update Status Text
    if (statusText) {
        if (quranState.isPlayingBismillah) {
            statusText.textContent = "Reciting Bismillah...";
        } else if (quranState.surahData && quranState.surahData.ayahs[idx]) {
            statusText.textContent = isPlaying
                ? `Playing Ayah ${quranState.surahData.ayahs[idx].numberInSurah}...`
                : "Paused";
        }
    }

    const mainBtn = document.getElementById('play-pause-btn');
    if (mainBtn) mainBtn.innerHTML = isPlaying ? "<i class='bx bx-pause'></i>" : "<i class='bx bx-play' style='margin-left:5px;'></i>";

    document.querySelectorAll('.ayah-actions button i').forEach(icon => {
        icon.className = 'bx bx-play';
    });

    if (isPlaying) {
        const currentBtnIcon = document.querySelector(`#ayah-play-btn-${idx} i`);
        if (currentBtnIcon) currentBtnIcon.className = 'bx bx-pause';
    }

    // UPDATE AUDIO QURAN BIG BUTTON & ADVANCED PLAYER
    const audioBtn = document.getElementById('audio-quran-btn');
    const advPlayBtn = document.getElementById('adv-play-btn');
    const advPlayer = document.getElementById('audio-advanced-player');

    // Advanced Player State
    if (advPlayer && !advPlayer.classList.contains('hidden')) {
        // If showing advanced player, ensure big button is hidden
        if (audioBtn) audioBtn.classList.add('hidden');

        if (advPlayBtn) {
            advPlayBtn.innerHTML = isPlaying ? "<i class='bx bx-pause'></i>" : "<i class='bx bx-play' style='margin-left:5px;'></i>";
        }
    } else {
        // Fallback to button state if player is hidden (e.g. initial load or stop)
        if (audioBtn) {
            if (isPlaying) {
                audioBtn.innerHTML = "<i class='bx bx-pause-circle' style='font-size: 1.5rem;'></i> Pause Listening";
                audioBtn.style.background = "rgba(251, 191, 36, 0.2)";
                audioBtn.style.color = "#fbbf24";
            } else {
                audioBtn.innerHTML = "<i class='bx bx-play-circle' style='font-size: 1.5rem;'></i> Start Listening";
                audioBtn.style.background = "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)";
                audioBtn.style.color = "#0f172a";
            }
        }
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function setupAdvancedAudioEvents() {
    const progressBar = document.getElementById('audio-progress-bar');
    const volumeSlider = document.getElementById('audio-volume-slider');

    if (progressBar) {
        progressBar.oninput = (e) => {
            if (quranState.audio) {
                quranState.audio.currentTime = e.target.value;
            }
        };
    }

    if (volumeSlider) {
        volumeSlider.oninput = (e) => {
            const vol = e.target.value;
            if (quranState.audio) {
                quranState.audio.volume = vol;
            }
        };
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

function togglePlay() {
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

        // Restore Text
        if (quranState.isPlayingBismillah) {
            document.getElementById('player-status-text').textContent = "Reciting Bismillah...";
        } else {
            document.getElementById('player-status-text').textContent = `Playing Ayah ${quranState.surahData.ayahs[quranState.currentAyahIndex].numberInSurah}...`;
        }
    }
    updatePlayUIState();
}

window.switchTab = function (tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    const sGrid = document.getElementById('surah-grid');
    const jGrid = document.getElementById('juz-grid');
    const aView = document.getElementById('audio-quran-view');
    const dView = document.getElementById('surah-detail-view');
    const playerBar = document.getElementById('audio-player-bar');

    // HIDE ALL TAB CONTENTS
    sGrid.classList.add('hidden');
    jGrid.classList.add('hidden');
    if (aView) aView.classList.add('hidden');
    if (dView) dView.classList.add('hidden');

    // CRITICAL FIX: STOP AUDIO WHEN SWITCHING TABS
    stopAudio();

    // Hide player bar initially
    if (playerBar) playerBar.style.display = 'none';

    if (tab === 'surah') {
        sGrid.classList.remove('hidden');
        // Restore player bar if playing
        if (quranState.audio && playerBar) playerBar.style.display = 'flex';
    } else if (tab === 'juz') {
        jGrid.classList.remove('hidden');
        if (quranState.audio && playerBar) playerBar.style.display = 'flex';
    } else if (tab === 'audio') {
        if (aView) {
            aView.classList.remove('hidden');
            initAudioQuranView();
            // Ensure playbar is HIDDEN here
            if (playerBar) playerBar.style.display = 'none';
        }
    }
};

window.startAudioQuranPlayback = function () {
    const surahSelect = document.getElementById('audio-surah-select');
    const reciterSelect = document.getElementById('audio-reciter-select');

    if (!surahSelect || !surahSelect.value) {
        alert("Please select a Surah first.");
        return;
    }

    const surahId = parseInt(surahSelect.value);
    const reciterKey = reciterSelect.value;

    // 1. Check if same Surah & Reciter logic
    const isSameSurah = quranState.currentSurahId === surahId;
    const isSameReciter = quranState.currentReciter === reciterKey;

    if (isSameSurah && isSameReciter && quranState.audio) {
        // Toggle Logic
        togglePlay();
    } else {
        // Start New
        handleReciterChange(reciterKey);
        const allSurahs = window.quranData ? window.quranData.surahs : [];
        const surah = allSurahs.find(s => s.number == surahId);

        if (surah) {
            quranState.currentSurahId = surahId;
            quranState.surahData = surah;
            quranState.currentAyahIndex = 0;
            playAyahByIndex(0, true);
        }
    }
};

// ... inside initAudioQuranView ...

// ... inside updatePlayUIState ...
function updatePlayUIState() {
    const isPlaying = quranState.isPlaying;
    const idx = quranState.currentAyahIndex;

    const mainBtn = document.getElementById('play-pause-btn');
    if (mainBtn) mainBtn.innerHTML = isPlaying ? "<i class='bx bx-pause'></i>" : "<i class='bx bx-play' style='margin-left:5px;'></i>";

    // ONLY reset Play Buttons, NOT all buttons (like Hearts)
    document.querySelectorAll('.ayah-actions button[id^="ayah-play-btn"] i').forEach(icon => {
        icon.className = 'bx bx-play';
    });

    if (isPlaying) {
        const currentBtnIcon = document.querySelector(`#ayah-play-btn-${idx} i`);
        if (currentBtnIcon) currentBtnIcon.className = 'bx bx-pause';
    }

    // UPDATE AUDIO QURAN BIG BUTTON & ADVANCED PLAYER
    const audioBtn = document.getElementById('audio-quran-btn');
    const advPlayBtn = document.getElementById('adv-play-btn');
    const advPlayer = document.getElementById('audio-advanced-player');

    // Advanced Player State
    // const advPlayer = ... already declared above

    // LOGIC: If advanced player is active (or should be), hide button
    if (advPlayer && !advPlayer.classList.contains('hidden')) {
        if (audioBtn) audioBtn.style.display = 'none'; // FORCE HIDE
        if (advPlayBtn) {
            advPlayBtn.innerHTML = isPlaying ? "<i class='bx bx-pause'></i>" : "<i class='bx bx-play' style='margin-left:5px;'></i>";
        }
    } else {
        // Fallback: If not using advanced player, show button
        if (audioBtn) {
            if (isPlaying) {
                // Force switch to advanced player if we are supposedly playing but checking button state?
                // No, just update button logic
                audioBtn.innerHTML = "<i class='bx bx-pause-circle' style='font-size: 1.5rem;'></i> Pause Listening";
                audioBtn.style.background = "rgba(251, 191, 36, 0.2)";
                audioBtn.style.color = "#fbbf24";
            } else {
                audioBtn.innerHTML = "<i class='bx bx-play-circle' style='font-size: 1.5rem;'></i> Start Listening";
                audioBtn.style.background = "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)";
                audioBtn.style.color = "#0f172a";
            }
        }
    }
}


// ... inside playAudioUrl ...
function playAudioUrl(url, labelOrNum, startTime = 0, isBismillah = false) {
    console.log(`[Audio] playAudioUrl: ${labelOrNum} (Bis=${isBismillah})`);

    if (quranState.audio) {
        quranState.audio.onended = null;
        quranState.audio.pause();
        quranState.audio = null;
    }

    quranState.audio = new Audio(url);
    quranState.audio.currentTime = startTime;
    quranState.isPlaying = true;

    const bar = document.getElementById('audio-player-bar');
    // ONLY SHOW IF NOT IN AUDIO TAB
    const aView = document.getElementById('audio-quran-view');
    if (bar) {
        if (aView && !aView.classList.contains('hidden')) {
            bar.style.display = 'none';
        } else {
            bar.style.display = 'flex';
        }
    }

    const select = document.getElementById('player-surah-select');
    if (select && quranState.surahData) select.value = quranState.surahData.number;

    const statusText = document.getElementById('player-status-text');
    if (statusText) {
        if (isBismillah) {
            statusText.textContent = "Reciting Bismillah...";
        } else {
            statusText.textContent = `Playing Ayah ${labelOrNum}...`;
        }
    }

    updatePlayUIState();

    quranState.audio.play().then(() => {
        console.log("[Audio] Playback started successfully");
    }).catch(e => {
        console.error("Playback error:", e);
        if (statusText) statusText.textContent = "Error playing audio.";
        stopAudio();
    });

    // --- NEW: TIME UPDATE FOR PROGRESS BAR ---
    quranState.audio.ontimeupdate = () => {
        const progressBar = document.getElementById('audio-progress-bar');
        const currTimeEl = document.getElementById('audio-time-current');
        const totalTimeEl = document.getElementById('audio-time-total');

        if (quranState.audio && quranState.audio.duration) {
            const curr = quranState.audio.currentTime;
            const total = quranState.audio.duration;

            if (progressBar) {
                progressBar.max = total;
                progressBar.value = curr;
            }
            if (currTimeEl) currTimeEl.textContent = formatTime(curr);
            if (totalTimeEl) totalTimeEl.textContent = formatTime(total);
        }
    };

    quranState.audio.onended = () => {
        console.log(`[Audio] Ended: ${labelOrNum} (Bis=${isBismillah})`);
        if (isBismillah) {
            console.log("[Audio] Bismillah done, starting Ayah 1");
            playAyahByIndex(0, true, 0, true);
        } else {
            console.log("[Audio] Ayah done, requesting next");
            playNextAyah();
        }
    };

    highlightActiveAyah();
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function setupAdvancedAudioEvents() {
    const progressBar = document.getElementById('audio-progress-bar');
    const volumeSlider = document.getElementById('audio-volume-slider');

    if (progressBar) {
        progressBar.oninput = (e) => {
            if (quranState.audio) {
                quranState.audio.currentTime = e.target.value;
            }
        };
    }

    if (volumeSlider) {
        volumeSlider.oninput = (e) => {
            const vol = e.target.value;
            if (quranState.audio) {
                quranState.audio.volume = vol;
            }
            // Store volume preference?
        };
    }
}

function stopAudio() {
    if (quranState.audio) {
        quranState.audio.onended = null;
        quranState.audio.pause();
        quranState.audio = null;
    }
    quranState.isPlaying = false;
    quranState.isPlayingBismillah = false;

    // Reset UI: Show Button, Hide Player
    const btn = document.getElementById('audio-quran-btn');
    const advPlayer = document.getElementById('audio-advanced-player');

    if (btn) btn.classList.remove('hidden');
    if (advPlayer) advPlayer.classList.add('hidden');
    updatePlayUIState();
}


// --- PREMIUM FEATURES (Resume, Vault, Likes) ---

window.isAyahLiked = function (id) {
    const favs = JSON.parse(localStorage.getItem('user_favorites') || '[]');
    return favs.some(f => f.id === id);
};

window.toggleAyahLike = function (surahId, ayahNum, idx) {
    const id = `${surahId}:${ayahNum}`;
    let favs = JSON.parse(localStorage.getItem('user_favorites') || '[]');
    const existingIndex = favs.findIndex(f => f.id === id);

    const icon = document.getElementById(`like-icon-${idx}`);

    if (existingIndex > -1) {
        // Remove
        favs.splice(existingIndex, 1);
        if (icon) {
            icon.classList.remove('bxs-heart');
            icon.classList.add('bx-heart');
            icon.style.color = '#64748b';
        }
    } else {
        // Add
        // Construct Object
        const surah = quranState.surahData;
        const ayah = surah.ayahs.find(a => a.numberInSurah == ayahNum);
        if (ayah) {
            favs.push({
                id: id,
                surahId: surahId,
                ayahNum: ayahNum,
                surahName: surah.englishName,
                text: ayah.text.substring(0, 50) + "..."
            });
            if (icon) {
                icon.classList.remove('bx-heart');
                icon.classList.add('bxs-heart');
                icon.style.color = '#ef4444';
            }
        }
    }

    localStorage.setItem('user_favorites', JSON.stringify(favs));
};

window.saveLastRead = function (surahId, ayahNum) {
    // Only save if we have valid surah data
    if (!quranState.surahData) return;

    const totalAyahs = quranState.surahData.ayahs.length;
    const progress = Math.round((ayahNum / totalAyahs) * 100);

    const data = {
        surahId: surahId,
        ayahNum: ayahNum,
        surahName: quranState.surahData.englishName,
        progress: progress,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('user_last_read', JSON.stringify(data));

    // Update Daily Stats for Vault Goal
    incrementDailyStats();
};

function incrementDailyStats() {
    const today = new Date().toISOString().split('T')[0];
    let stats = JSON.parse(localStorage.getItem('user_daily_stats') || '{}');
    stats[today] = (stats[today] || 0) + 1;
    localStorage.setItem('user_daily_stats', JSON.stringify(stats));
}

