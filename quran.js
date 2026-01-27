/**
 * Quran Portal Logic - Complete (v5.5)
 * Tafsir Integration + Audio Player Refinements + Playbar Reciters
 * Added: Bismillah Pre-roll
 */

console.log("Quran Script v5.5 Loading...");

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
    'ur.jalandhry': { name: 'Fateh Muhammad Jalandhry', slug: 'translations/urdu_shamshad_ali_khan_46kbps' }
};

// --- STATE ---
let quranState = {
    audio: null,
    isPlaying: false,
    isPlayingBismillah: false, // New State Flag
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
        if (surahId && typeof loadDetailView === 'function') {
            setTimeout(() => {
                loadDetailView(parseInt(surahId), list);
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
    const wasPlaying = quranState.isPlaying;
    changeReciter(reciterKey);
    if (wasPlaying) {
        setTimeout(() => playAyahByIndex(quranState.currentAyahIndex, true, 0), 0);
    }
}

function changeReciter(reciterKey) {
    stopAudio();
    quranState.currentReciter = reciterKey;

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
// --- AUDIO ENGINE ---
window.playAyahByIndex = function (index, forcePlay = false, startTime = 0, skipBismillah = false) {
    console.log(`[Audio] playAyahByIndex: Idx=${index}, Force=${forcePlay}, SkipBis=${skipBismillah}`);

    if (!quranState.surahData) {
        console.error("[Audio] No Surah Data!");
        return;
    }

    // Toggle Logic (Stop if already playing this ayah, UNLESS it's Bismillah which we let run or pause)
    if (!forcePlay && quranState.isPlaying && quranState.currentAyahIndex === index && !quranState.isPlayingBismillah) {
        console.log("[Audio] Toggling Pause");
        togglePlay();
        return;
    }

    // --- BISMILLAH PRE-ROLL LOGIC ---
    if (index === 0 && !skipBismillah && quranState.surahData.number !== 1 && quranState.surahData.number !== 9) {
        console.log("[Audio] Starting Bismillah Pre-roll");
        stopAudio();
        quranState.isPlayingBismillah = true;
        quranState.currentAyahIndex = 0; // Keep visual focus on first ayah

        // Fetch Bismillah (Surah 1, Ayah 1) for the current reciter
        const bismillahUrl = getAudioUrl(quranState.currentReciter, 1, 1);
        playAudioUrl(bismillahUrl, "Bismillah", 0, true);
        return; // Wait for Bismillah to finish
    }
    // --------------------------------

    quranState.currentAyahIndex = index;
    quranState.isPlayingBismillah = false; // Ensure flag is cleared if we are playing normal ayah

    if (index >= quranState.surahData.ayahs.length) {
        console.log("[Audio] Surah Finished");
        stopAudio();
        return;
    }

    const ayah = quranState.surahData.ayahs[index];
    const url = getAudioUrl(quranState.currentReciter, quranState.surahData.number, ayah.numberInSurah);
    console.log(`[Audio] Playing Ayah ${ayah.numberInSurah} URL: ${url}`);

    // Play normal ayah (isBismillah = false)
    playAudioUrl(url, ayah.numberInSurah, startTime, false);
};

function getAudioUrl(reciterKey, surahNum, ayahNum) {
    const reciterData = RECITERS[reciterKey];
    if (!reciterData) return '';

    const s = String(surahNum).padStart(3, '0');
    const a = String(ayahNum).padStart(3, '0');
    const timestamp = Date.now();
    return `https://everyayah.com/data/${reciterData.slug}/${s}${a}.mp3?t=${timestamp}`;
}

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

    quranState.audio.onended = () => {
        console.log(`[Audio] Ended: ${labelOrNum} (Bis=${isBismillah})`);
        if (isBismillah) {
            // Check completed, play actual first ayah (skip check)
            console.log("[Audio] Bismillah done, starting Ayah 1");
            playAyahByIndex(0, true, 0, true);
        } else {
            console.log("[Audio] Ayah done, requesting next");
            playNextAyah();
        }
    };

    highlightActiveAyah();
}

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
    const statusText = document.getElementById('player-status-text');
    if (statusText) statusText.textContent = "Ready to play";
    document.querySelectorAll('.ayah-container').forEach(d => d.style.background = 'white');
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
    const statusText = document.getElementById('player-status-text');
    if (statusText) statusText.textContent = "Ready to play";
    document.querySelectorAll('.ayah-container').forEach(d => d.style.background = 'white');
}

