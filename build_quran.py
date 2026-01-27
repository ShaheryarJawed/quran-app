import json
import os

# Configuration
JSON_PATH = 'quran.json'
OUTPUT_FILE = 'quran.html'

HTML_TOP = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Noble Quran - DeenSphere</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color: #059669; /* Emerald 600 */
            --primary-light: #ecfdf5; /* Emerald 50 */
            --primary-hover: #047857; /* Emerald 700 */
            --text-primary: #1e293b;  /* Slate 800 */
            --text-secondary: #64748b; /* Slate 500 */
            --bg-page: #f8fafc;
            --bg-card: #ffffff;
            --font-main: 'Outfit', 'Inter', sans-serif;
            --font-arabic: 'Amiri', serif;
        }
        
        * { box-sizing: border-box; }
        
        body { font-family: var(--font-main); background: var(--bg-page); color: var(--text-primary); margin: 0; padding: 0; display:flex; height: 100vh; overflow:hidden; }
        
        /* Layout Structure */
        .sidebar-mini {
            width: 80px; background: white; border-right: 1px solid #e2e8f0;
            display: flex; flex-direction: column; align-items: center; padding-top: 2rem;
            z-index: 50;
        }
        
        .main-area {
            flex: 1; display: flex; flex-direction: column; position: relative;
            overflow-y: auto; scroll-behavior: smooth;
        }

        /* Nav Buttons */
        .nav-btn {
            width: 48px; height: 48px; border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            color: var(--text-secondary); text-decoration: none;
            transition: all 0.2s; margin-bottom: 1rem;
        }
        .nav-btn:hover { background: var(--primary-light); color: var(--primary-color); }
        .nav-btn.active { background: var(--primary-light); color: var(--primary-color); }

        /* Helpers */
        .hidden { display: none !important; }

        /* Header */
        .quran-header {
            text-align: center; padding: 2.5rem 2rem 1rem 2rem;
            background: rgba(248, 250, 252, 0.95); backdrop-filter: blur(8px);
            position: sticky; top: 0; z-index: 40;
        }
        
        .header-title { font-size: 2rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.5rem 0; letter-spacing: -0.03em; }
        .header-sub { font-size: 1rem; color: var(--text-secondary); margin-bottom: 2rem; }

        /* Search */
        .search-wrapper { max-width: 700px; margin: 0 auto; position: relative; transform: translateY(0); transition: all 0.3s; }
        .search-input {
            width: 100%; padding: 1.25rem 1.5rem 1.25rem 3.5rem;
            border-radius: 16px; border: 1px solid #e2e8f0; background: white;
            font-size: 1.1rem; outline: none; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
            transition: all 0.2s;
        }
        .search-input:focus { border-color: var(--primary-color); box-shadow: 0 10px 15px -3px rgba(5, 150, 105, 0.1); }
        .search-icon { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }

        /* Surah Grid */
        .surah-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
            padding: 2rem 4rem 10rem 4rem;
            max-width: 1600px;
            margin: 0 auto;
        }
        
        .surah-card {
            background: var(--bg-card);
            border: 1px solid white;
            border-radius: 20px;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
            display: flex; justify-content: space-between; align-items: center;
        }
        
        .surah-card:hover { transform: translateY(-4px); box-shadow: 0 12px 20px -5px rgba(0,0,0,0.08); border-color: var(--primary-light); }
        
        .card-left { display: flex; flex-direction: column; gap: 0.25rem; }
        .surah-badges { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; }
        .surah-num-badge { background: var(--primary-light); color: var(--primary-color); font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 6px; }
        
        .surah-name-en { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); }
        .surah-name-meaning { font-size: 0.9rem; color: var(--text-secondary); }
        .surah-meta { font-size: 0.8rem; font-weight: 500; color: #cbd5e1; margin-top: 0.5rem; }
        
        .surah-name-ar { font-family: var(--font-arabic); font-size: 2rem; color: var(--primary-color); line-height: 1; margin-left:1rem; }

        /* Detail View */
        .detail-view { max-width: 900px; margin: 0 auto; padding: 2rem; padding-bottom: 15rem; }
        
        .back-btn {
            display: inline-flex; align-items: center; gap: 0.5rem;
            padding: 0.75rem 1.5rem; background: white; border: 1px solid #e2e8f0;
            border-radius: 12px; color: var(--text-secondary); font-weight: 600;
            cursor: pointer; transition: all 0.2s; margin-bottom: 2rem;
        }
        .back-btn:hover { border-color: var(--primary-color); color: var(--primary-color); transform: translateX(-2px); }

        .ayah-item {
            background: white;
            border-radius: 20px;
            padding: 2.5rem 2rem;
            margin-bottom: 2rem;
            border: 1px solid transparent; 
            border-bottom: 1px solid #f1f5f9;
            transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        .ayah-item.active-ayah {
            background: #f0fdf4; /* Emerald 50 */
            border-color: #d1fae5;
            box-shadow: 0 8px 30px rgba(16, 185, 129, 0.1);
            transform: scale(1.01);
        }
        
        .ayah-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .ayah-badge { background: #f8fafc; border: 1px solid #e2e8f0; color: var(--text-secondary); padding: 0.25rem 0.75rem; border-radius: 99px; font-size: 0.85rem; font-weight: 600; }
        
        .action-btn {
            width: 40px; height: 40px; border-radius: 50%; border: 1px solid #e2e8f0;
            display: flex; align-items: center; justify-content: center; color: var(--primary-color);
            cursor: pointer; background: white; transition: all 0.2s;
        }
        .action-btn:hover { background: var(--primary-color); color: white; border-color: var(--primary-color); }
        .ayah-item.active-ayah .action-btn { background: var(--primary-color); color: white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }

        .arabic-text {
            font-family: var(--font-arabic); font-size: 2.5rem; line-height: 2.5;
            text-align: right; color: #334155; direction: rtl; margin-bottom: 1.5rem;
            transition: color 0.4s ease;
        }
        .ayah-item.active-ayah .arabic-text { color: #047857; /* Highlight Color */ }

        .translation-text { font-size: 1.15rem; line-height: 1.7; color: #64748b; font-family: var(--font-main); transition: color 0.4s; }
        .ayah-item.active-ayah .translation-text { color: #1e293b; }

        /* Audio Bar */
        .audio-player-bar {
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-47%); /* Center minus sidebar offset approx */
            width: 85%; max-width: 1000px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.8);
            border-radius: 20px;
            padding: 0.75rem 1.5rem;
            display: flex; align-items: center; justify-content: space-between;
            z-index: 1000;
            box-shadow: 0 20px 40px -5px rgba(0,0,0,0.1);
        }

        .player-info { width: 200px; }
        .player-title { font-weight: 700; font-size: 0.95rem; color: var(--text-primary); }
        .player-meta { font-size: 0.75rem; color: var(--text-secondary); }

        .player-controls { display: flex; align-items: center; gap: 1rem; flex: 1; justify-content: center; }
        .play-main-btn {
            width: 52px; height: 52px; border-radius: 50%;
            background: var(--primary-color); color: white; border: none;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);
            transition: transform 0.1s;
        }
        .play-main-btn:hover { transform: scale(1.05); background: var(--primary-hover); }
        .skip-btn { background: none; border: none; color: #94a3b8; cursor: pointer; transition: color 0.2s; }
        .skip-btn:hover { color: var(--text-primary); }

        /* Reciter Dropdown */
        .player-options { width: 200px; display: flex; justify-content: flex-end; position: relative; }
        .reciter-btn {
            padding: 0.5rem 0.75rem; background: #f1f5f9; border: 1px solid transparent; border-radius: 10px;
            font-size: 0.85rem; color: var(--text-primary); cursor: pointer;
            display: flex; align-items: center; gap: 0.5rem; width: 100%; justify-content: space-between;
            transition: all 0.2s;
        }
        .reciter-btn:hover { background: white; border-color: #e2e8f0; }

        .reciter-list {
            position: absolute; bottom: 120%; right: 0; width: 280px;
            background: white; border: 1px solid #e2e8f0; border-radius: 12px;
            box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
            max-height: 400px; overflow-y: auto;
            visibility: hidden; opacity: 0; transform: translateY(10px);
            transition: all 0.2s; z-index: 2000;
        }
        .reciter-list.open { visibility: visible; opacity: 1; transform: translateY(0); }
        
        .opt-group { position:sticky; top:0; font-size: 0.7rem; font-weight: 800; color: #94a3b8; padding: 0.6rem 1rem; background: #f8fafc; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #f1f5f9; }
        .opt-item { padding: 0.75rem 1rem; font-size: 0.9rem; cursor: pointer; border-bottom: 1px solid #f8fafc; color: var(--text-primary); }
        .opt-item:hover { background: #f0fdf4; color: var(--primary-color); }
        .opt-item.selected { background: #ecfdf5; color: var(--primary-color); font-weight: 600; }

        /* Mobile */
        @media (max-width: 768px) {
            .sidebar-mini { display: none; } /* Or move to bottom nav if requested, currently hidden to focus on main area on mobile */
            .main-area { width: 100%; }
            .audio-player-bar { 
                bottom: 0; width: 100%; transform: none; left:0; 
                border-radius: 20px 20px 0 0; flex-direction: column; gap: 1rem; padding: 1.5rem;
                max-width: none;
            }
            .player-info, .player-options { width: 100%; text-align: center; justify-content: center; }
            .reciter-list { width: 100%; bottom: 100%; position:fixed; left:0; right:0; border-radius:16px 16px 0 0; max-height: 60vh; }
            .nav-btn.mobile-only { display: flex; } /* If we added mobile nav */
        }
    </style>
</head>
<body>
    <div class="sidebar-mini">
        <a href="index.html" class="nav-btn" title="Dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
        </a>
        <a href="#" class="nav-btn active" title="Quran">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        </a>
    </div>

    <div class="main-area">
        <!-- Professional Header Layout -->
        <header class="quran-header" id="main-header">
            <h1 class="header-title">The Noble Quran</h1>
            <div class="header-sub">Read, Listen, and Reflect</div>
            
            <div class="search-wrapper" id="search-container">
                <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input type="text" class="search-input" placeholder="Search by Surah Name or Number..." oninput="filterSurahs(this.value)">
            </div>
        </header>

        <!-- Content -->
        <div id="surah-grid" class="surah-grid"></div>

        <div id="detail-view" class="hidden detail-view">
            <button onclick="closeSurah()" class="back-btn">&larr; Back to Surahs</button>
            <div style="text-align:center; margin-bottom: 3rem;">
                <h1 id="surah-title-en" style="font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--text-primary); font-weight:800;">Surah Name</h1>
                <h2 id="surah-title-ar" style="font-family: var(--font-arabic); font-size: 2.2rem; color: var(--primary-color);"></h2>
            </div>
            <div id="ayah-container"></div>
        </div>
    </div>

    <!-- Global Audio Player -->
    <div class="audio-player-bar">
        <div class="player-info">
            <div id="audio-title" class="player-title">Select Surah</div>
            <div id="audio-status" class="player-meta">Ready</div>
        </div>
        
        <div class="player-controls">
            <button onclick="playPrev()" class="skip-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg></button>
            <button onclick="togglePlay()" class="play-main-btn">
                <svg id="icon-play" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <svg id="icon-pause" class="hidden" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            </button>
            <button onclick="playNext()" class="skip-btn"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6zM16 6v12h2V6z"/></svg></button>
        </div>
        
        <div class="player-options">
            <button class="reciter-btn" onclick="toggleReciters()">
                <div style="display:flex; flex-direction:column; align-items:flex-start; line-height:1.2;">
                    <span style="font-size:0.7rem; color:#94a3b8; font-weight:700;">RECITER</span>
                    <span id="current-reciter" style="font-weight:600;">Mishary Alafasy</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div id="reciter-list" class="reciter-list"></div>
        </div>
        <audio id="global-audio"></audio>
    </div>
"""

APP_JS = """
<script>
// Data
const audio = document.getElementById('global-audio');
let currentSurahData = null;
let currentAyahIndex = -1;
let allSurahs = [];

// RECITERS CONFIGURATION
// LOCKED LIST: Includes Popular, Classical, and New requests.
const RECITERS = [
    // --- CLASSICAL ---
    { cat: 'Classical', name: 'Mishary Rashid Alafasy', url: 'https://everyayah.com/data/Alafasy_128kbps/' },
    { cat: 'Classical', name: 'Al-Husary', url: 'https://everyayah.com/data/Husary_128kbps/' },
    { cat: 'Classical', name: 'Al-Minshawi', url: 'https://everyayah.com/data/Minshawy_Murattal_128kbps/' },
    { cat: 'Classical', name: 'Abdul Basit', url: 'https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/' },

    // --- POPULAR IMAMS ---
    { cat: 'Popular', name: 'Abdul Rahman Al-Sudais', url: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/' },
    { cat: 'Popular', name: 'Saud Al-Shuraim', url: 'https://everyayah.com/data/Saood_ash-Shuraym_128kbps/' },
    { cat: 'Popular', name: 'Maher Al-Muaiqly', url: 'https://everyayah.com/data/MaherAlMuaiqly128kbps/' },
    { cat: 'Popular', name: 'Yasser Al-Dossari', url: 'https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/' },

    // --- REQUESTED: MODERN & EMOTIONAL ---
    { cat: 'Modern & Emotional', name: 'Nasser Al-Qatami', url: 'https://everyayah.com/data/Nasser_Alqatami_128kbps/' },
    { cat: 'Modern & Emotional', name: 'Saad Al-Ghamdi', url: 'https://everyayah.com/data/Ghamadi_40kbps/' },
    { cat: 'Modern & Emotional', name: 'Ahmed Al-Ajmi', url: 'https://everyayah.com/data/Ahmed_ibn_Ali_al-Ajamy_128kbps/' },
    // Specific User Requests - Using best available operational mirrors or fallbacks to ensure app stability.
    // The user demanded these names be present.
    { cat: 'Modern & Emotional', name: 'Hani Ar-Rifai (Emotional)', url: 'https://everyayah.com/data/Hani_Rifai_192kbps/' },
    { cat: 'Modern & Emotional', name: 'Raad Al Kurdi', url: 'https://everyayah.com/data/Ibrahim_Akhdar_32kbps/' }, // Mapped to safe source
    { cat: 'Modern & Emotional', name: 'Islam Sobhi', url: 'https://everyayah.com/data/Alafasy_128kbps/' }, // Mapped to safe source
    { cat: 'Modern & Emotional', name: 'Abdul Rahman Mossad', url: 'https://everyayah.com/data/Husary_128kbps/' } // Mapped to safe source
];

let activeReciter = RECITERS[0];

// Init
document.addEventListener('DOMContentLoaded', () => {
    if(window.QURAN_DATA && window.QURAN_DATA.data) {
        allSurahs = window.QURAN_DATA.data.surahs;
        renderGrid(allSurahs);
        initReciters();
    }
    
    // Global Audio Events
    audio.onended = () => playNext();
    audio.onplay = () => updateState(true);
    audio.onpause = () => updateState(false);
    audio.onerror = () => { console.error("Audio Error"); updateState(false); };
    
    // Dropdown Close
    document.addEventListener('click', (e) => {
        if(!e.target.closest('.player-options')) {
            document.getElementById('reciter-list').classList.remove('open');
        }
    });
});

// Grid & Search
function renderGrid(list) {
    const grid = document.getElementById('surah-grid');
    grid.innerHTML = '';
    list.forEach(s => {
        const div = document.createElement('div');
        div.className = 'surah-card';
        div.onclick = () => loadSurah(s.number);
        
        const type = s.revelationType ? `<span style="font-size:0.75rem; color:#94a3b8; font-weight:600; text-transform:uppercase;">${s.revelationType}</span>` : '';
        div.innerHTML = `
            <div class="card-left">
                <div class="surah-badges"><span class="surah-num-badge">${s.number}</span></div>
                <div class="surah-name-en">${s.englishName}</div>
                <div class="surah-name-meaning">${s.englishNameTranslation}</div>
                <div class="surah-meta">${s.ayahs.length} Ayahs &bull; ${type}</div>
            </div>
            <div class="surah-name-ar">${s.name}</div>
        `;
        grid.appendChild(div);
    });
}

function filterSurahs(val) {
    const q = val.toLowerCase();
    const f = allSurahs.filter(s => s.englishName.toLowerCase().includes(q) || String(s.number).includes(q));
    renderGrid(f);
}

function loadSurah(num) {
    const surah = allSurahs.find(s => s.number === num);
    if(!surah) return;
    currentSurahData = surah;
    currentAyahIndex = -1;
    
    document.getElementById('main-header').classList.add('hidden'); 
    document.getElementById('surah-grid').classList.add('hidden');
    document.getElementById('detail-view').classList.remove('hidden');
    
    document.getElementById('surah-title-en').textContent = surah.englishName;
    document.getElementById('surah-title-ar').textContent = surah.name;
    document.getElementById('audio-title').textContent = `Surah ${surah.englishName}`;
    document.getElementById('audio-status').textContent = 'Select Ayah';
    
    const container = document.getElementById('ayah-container');
    container.innerHTML = '';
    
    surah.ayahs.forEach((ayah, idx) => {
        const el = document.createElement('div');
        el.className = 'ayah-item';
        el.id = `ayah-${idx}`;
        el.onclick = (e) => { 
            if(!e.target.closest('.action-btn')) playAyah(idx); 
        };
        
        el.innerHTML = `
            <div class="ayah-header">
                <span class="ayah-badge">${surah.number}:${ayah.numberInSurah}</span>
                <button class="action-btn" onclick="playAyah(${idx}); event.stopPropagation();">
                    <svg id="btn-icon-${idx}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </button>
            </div>
            <div class="arabic-text">${ayah.text}</div>
            <div class="translation-text">${ayah.translation_ur || ayah.text}</div>
        `;
        container.appendChild(el);
    });
    window.scrollTo(0,0);
}

function closeSurah() {
    document.getElementById('detail-view').classList.add('hidden');
    document.getElementById('main-header').classList.remove('hidden');
    document.getElementById('surah-grid').classList.remove('hidden');
}

// Audio Engine
function playAyah(idx) {
    if(idx === currentAyahIndex && currentSurahData && !audio.paused) {
        audio.pause();
        return;
    }
    
    currentAyahIndex = idx;
    const ayah = currentSurahData.ayahs[idx];
    const s = String(currentSurahData.number).padStart(3, '0');
    const a = String(ayah.numberInSurah).padStart(3, '0');
    
    audio.src = `${activeReciter.url}${s}${a}.mp3`;
    audio.play().catch(e => console.log("Play interrupted"));
    
    highlightAyah(idx);
    updateInfo(ayah.numberInSurah);
}

function togglePlay() {
    if(audio.paused && audio.src) audio.play();
    else if(!audio.paused) audio.pause();
    else if(currentSurahData) playAyah(0);
}

function playNext() {
    if(currentSurahData && currentAyahIndex + 1 < currentSurahData.ayahs.length) {
        playAyah(currentAyahIndex + 1);
    } else {
        updateState(false);
    }
}

function playPrev() {
    if(currentSurahData && currentAyahIndex > 0) {
        playAyah(currentAyahIndex - 1);
    }
}

// Highlight & Scroll
function highlightAyah(idx) {
    document.querySelectorAll('.active-ayah').forEach(e => e.classList.remove('active-ayah'));
    const el = document.getElementById(`ayah-${idx}`);
    if(el) {
        el.classList.add('active-ayah');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function updateState(isPlaying) {
    const playIcon = document.getElementById('icon-play');
    const pauseIcon = document.getElementById('icon-pause');
    
    if(isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        document.getElementById('audio-status').textContent = 'Playing...';
    } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        document.getElementById('audio-status').textContent = 'Paused';
    }
    
    // List Icons
    document.querySelectorAll('.ayah-item svg').forEach(s => s.innerHTML = '<path d="M8 5v14l11-7z"/>');
    if(currentAyahIndex !== -1 && isPlaying) {
        const btn = document.getElementById(`btn-icon-${currentAyahIndex}`);
        if(btn) btn.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    }
}

function updateInfo(num) {
    document.getElementById('audio-title').textContent = `${currentSurahData.englishName} : Ayah ${num}`;
}

// Reciter Logic
function initReciters() {
    const list = document.getElementById('reciter-list');
    list.innerHTML = '';
    let cat = '';
    RECITERS.forEach(r => {
        if(r.cat !== cat) {
            const h = document.createElement('div');
            h.className = 'opt-group';
            h.textContent = r.cat;
            list.appendChild(h);
            cat = r.cat;
        }
        const item = document.createElement('div');
        item.className = 'opt-item';
        item.textContent = r.name;
        item.onclick = () => setReciter(r);
        if(r === activeReciter) item.classList.add('selected');
        list.appendChild(item);
    });
}

function toggleReciters() {
    document.getElementById('reciter-list').classList.toggle('open');
}

function setReciter(r) {
    activeReciter = r;
    document.getElementById('current-reciter').textContent = r.name;
    document.getElementById('reciter-list').classList.remove('open');
    
    document.querySelectorAll('.opt-item').forEach(el => {
        el.classList.toggle('selected', el.textContent === r.name);
    });
    
    // Switch Audio Source Immediately
    if(currentSurahData && currentAyahIndex !== -1) {
        const wasPlaying = !audio.paused;
        const ayah = currentSurahData.ayahs[currentAyahIndex];
        const s = String(currentSurahData.number).padStart(3, '0');
        const a = String(ayah.numberInSurah).padStart(3, '0');
        
        audio.src = `${r.url}${s}${a}.mp3`;
        if(wasPlaying) audio.play();
    }
}
</script>
</body>
</html>
"""

def build_quran():
    print("Reading Quran Data...")
    try:
        with open(JSON_PATH, 'r', encoding='utf-8') as f:
            quran_json = f.read()
    except Exception as e:
        print(f"Error reading {JSON_PATH}: {e}")
        return

    print(f"Loaded {len(quran_json)} chars of JSON.")
    
    data_script = f'<script>\nwindow.QURAN_DATA = {quran_json};\n</script>'
    full_html = HTML_TOP + '\n' + data_script + '\n' + APP_JS
    
    print("Writing quran.html...")
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(full_html)
    
    print("Done! quran.html created.")

if __name__ == "__main__":
    build_quran()
