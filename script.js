document.addEventListener('DOMContentLoaded', () => {
    // 0. Scroll Top Fix
    window.scrollTo(0, 0);

    // Initialize with safety check
    initApp();
});

const API_BASE = '/api';

// --- AUTH LOGIC ---
const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

function initAuth() {
    const authContainer = document.getElementById('auth-container');
    const notifBtn = document.getElementById('header-notif-btn');
    const signInBtn = document.getElementById('btn-signin');

    if (currentUser) {
        // STATE: LOGGED IN
        if (notifBtn) notifBtn.style.display = 'block'; // Show Notifications

        // Render Profile Chip
        const initials = currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : 'ME';

        // Use Mock Color or Default
        const avatarBg = currentUser.color || '#fbbf24';

        authContainer.innerHTML = `
            <div style="position:relative;">
                <div id="header-profile-chip" class="user-chip" title="Account: ${currentUser.email}" style="cursor:pointer; display:flex; align-items:center;">
                    ${currentUser.photo ?
                `<img src="${currentUser.photo}" class="avatar-portal" style="width:36px; height:36px; border-radius:50%; object-fit:cover; border:2px solid #fbbf24;">` :
                `<div class="avatar-portal" style="width:36px; height:36px; border-radius:50%; background:${avatarBg}; color:#0f172a; display:flex; align-items:center; justify-content:center; font-weight:bold; border:2px solid rgba(255,255,255,0.2);">${initials}</div>`
            }
                </div>
                
                <!-- Dropdown Menu -->
                <div id="user-dropdown" style="display:none; position:absolute; top:120%; right:0; width:200px; background:#1e293b; border:1px solid rgba(255,255,255,0.1); border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.5); overflow:hidden; z-index:1000; animation:fadeIn 0.2s ease;">
                    <div style="padding:1rem; border-bottom:1px solid rgba(255,255,255,0.1);">
                        <p style="color:white; font-size:0.9rem; margin:0; font-weight:600;">${currentUser.name}</p>
                        <p style="color:#94a3b8; font-size:0.8rem; margin:0; text-overflow:ellipsis; overflow:hidden;">${currentUser.email}</p>
                    </div>
                    <a href="profile.html" style="display:block; padding:0.8rem 1rem; color:#cbd5e1; text-decoration:none; transition:background 0.2s; font-size:0.9rem;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'"><i class='bx bx-user'></i> My Profile</a>
                    <a href="settings.html" style="display:block; padding:0.8rem 1rem; color:#cbd5e1; text-decoration:none; transition:background 0.2s; font-size:0.9rem;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'"><i class='bx bx-cog'></i> Settings</a>
                    <div style="border-top:1px solid rgba(255,255,255,0.1);"></div>
                    <a href="#" id="action-logout" style="display:block; padding:0.8rem 1rem; color:#f87171; text-decoration:none; transition:background 0.2s; font-size:0.9rem;" onmouseover="this.style.background='rgba(248, 113, 113, 0.1)'" onmouseout="this.style.background='transparent'"><i class='bx bx-log-out'></i> Sign Out</a>
                </div>
            </div>
        `;

        // Toggle Dropdown
        const chip = document.getElementById('header-profile-chip');
        const dropdown = document.getElementById('user-dropdown');

        chip.onclick = (e) => {
            e.stopPropagation();
            const isVisible = dropdown.style.display === 'block';
            dropdown.style.display = isVisible ? 'none' : 'block';
        };

        // Close on click outside
        document.addEventListener('click', () => {
            if (dropdown) dropdown.style.display = 'none';
        });

        // Logout Action
        document.getElementById('action-logout').onclick = (e) => {
            e.preventDefault();
            signOut();
        };

    } else {
        // STATE: GUEST
        // STATE: GUEST
        if (notifBtn) notifBtn.style.display = 'none'; // Hide Notifications
    }
}

function mockGoogleLogin() {
    // Simulating a Google OAuth Popup
    const mockUser = {
        name: "Shaheryar Jawed",
        email: "shaheryar@example.com",
        photo: null, // Could add a valid URL here if we had one
        color: "#10b981", // Emerald
        joined: new Date().toISOString()
    };

    if (confirm("Sign In with Google\n\n[Shaheryar Jawed]\nshaheryar@example.com\n\nContinue?")) {
        alert("Converting profile... Success!");
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        window.location.reload(); // Reload to apply state
    }
}

function signOut() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}

async function initApp() {
    // 0. AUTH CHECK
    try {
        initAuth();
    } catch (e) { console.error("Auth Error", e); }

    // 0. FETCH DATA FROM SERVER
    try {
        await fetchAllData();
    } catch (err) {
        console.error("CRITICAL: Failed to fetch dashboard data.", err);
        document.body.innerHTML = `<div style="color:white; text-align:center; padding:5rem;">
            <h1>Connection Error</h1>
            <p>Ensure the Backend Server is running.</p>
            <p style="color:#ef4444; font-family:monospace; background:#1e293b; padding:1rem; border-radius:8px; display:inline-block; margin-top:1rem;">
                ${err.message}
            </p>
        </div>`;
        return;
    }

    // Safe Execution Wrapper
    const safeRun = (name, fn) => {
        try {
            fn();
        } catch (e) {
            console.error(`Error in ${name}:`, e);
        }
    };

    // 1. Render Date
    safeRun("renderDate", renderDate);

    // 2. Render Daily Content (Ayah/Hadith)
    safeRun("renderDailyFeed", renderDailyFeed);

    // 3. Render Duas Grid
    safeRun("renderDuasGrid", renderDuasGrid);

    // 4. Fetch Prayer Times
    safeRun("fetchPrayerTimes", fetchPrayerTimes);

    // 5. Render Courses (The new feature)
    safeRun("renderCourses", renderCourses);

    // 6. Topics Logic
    safeRun("initTopics", initTopics);

    // 7. Header Actions (Search/Notif/Profile)
    safeRun("initHeaderActions", initHeaderActions);

    // 8. Dashboard Button Actions (Prayer/Share/Bookmark)
    safeRun("initDashboardActions", initDashboardActions);
}

async function fetchAllData() {
    console.log("Fetching data from API...");

    // Initialize global store
    window.DASHBOARD_DATA = {};

    try {
        const [daily, courses, topics, duas, seerah] = await Promise.all([
            fetch(`${API_BASE}/daily-feed`).then(async r => { if (!r.ok) throw new Error(`Daily Feed: ${r.status}`); return r.json(); }),
            fetch(`${API_BASE}/courses`).then(async r => { if (!r.ok) throw new Error(`Courses: ${r.status}`); return r.json(); }),
            fetch(`${API_BASE}/topics`).then(async r => { if (!r.ok) throw new Error(`Topics: ${r.status}`); return r.json(); }),
            fetch(`${API_BASE}/duas`).then(async r => { if (!r.ok) throw new Error(`Duas: ${r.status}`); return r.json(); }),
            fetch(`${API_BASE}/seerah`).then(async r => { if (!r.ok) throw new Error(`Seerah: ${r.status}`); return r.json(); })
        ]);

        // Reconstruct the structure previously in dashboard_data.js
        window.DASHBOARD_DATA = {
            // "daily" endpoint returns a SINGLE item, but renderDailyFeed expects an ARRAY to map by day index?
            // Actually dashboard_data.js had `daily: [...]`. 
            // My API `/api/daily-feed` returns ONE item based on server time.
            // I need to adjust renderDailyFeed logic or the API logic.
            // Let's create a shim:
            daily: [daily], // Put single item in array so existing logic (index 0) works
            courses,
            topics,
            duas,
            seerah
        };
        console.log("Data loaded:", window.DASHBOARD_DATA);

    } catch (e) {
        throw e;
    }
}

// --- DASHBOARD ACTIONS (Fixing Broken Buttons) ---
function initDashboardActions() {
    // A. Prayer Options
    const prayerBtn = document.getElementById('prayer-options-btn');
    if (prayerBtn) {
        prayerBtn.onclick = () => {
            alert("⚙️ Prayer Calculation Method\n\n• University of Islamic Sciences, Karachi\n• Muslim World League\n• ISNA (North America)\n\n(This will be a dropdown in the full app)");
        };
    }

    // B. Share Daily Ayah
    const shareBtn = document.getElementById('action-share-btn');
    if (shareBtn) {
        shareBtn.onclick = () => {
            const ayahText = document.getElementById('daily-ayah-body')?.innerText || "Daily Ayah";
            const ref = document.getElementById('ayah-ref')?.innerText || "";
            const content = `${ayahText}\n\n${ref}\n- Shared via DeenSphere`;

            if (navigator.share) {
                navigator.share({ title: 'Daily Inspiration', text: content })
                    .catch(e => console.log("Share skipped", e));
            } else {
                navigator.clipboard.writeText(content).then(() => {
                    alert("📋 Copied to Clipboard!");
                });
            }
        };
    }

    // C. Bookmark Daily Ayah
    const bookmarkBtn = document.getElementById('action-bookmark-btn');
    if (bookmarkBtn) {
        let isBookmarked = false; // Mock state
        bookmarkBtn.onclick = () => {
            isBookmarked = !isBookmarked;
            const icon = bookmarkBtn.querySelector('i');
            if (isBookmarked) {
                icon.className = 'bx bxs-bookmark'; // Solid icon
                icon.style.color = '#fbbf24'; // Gold
                alert("Saved to Bookmarks Collection");
            } else {
                icon.className = 'bx bx-bookmark'; // Outline
                icon.style.color = ''; // Reset
            }
        };
    }
}

// --- HEADER ACTIONS ---
function initHeaderActions() {
    const searchBtn = document.getElementById('header-search-btn');
    const notifBtn = document.getElementById('header-notif-btn');
    const profileChip = document.getElementById('header-profile-chip');

    if (searchBtn) {
        searchBtn.onclick = () => {
            const query = prompt("Global Search (Demo):\nEnter keyword (e.g., 'Musa', 'Prayer', 'Fasting')");
            if (query) {
                alert(`Searching for: "${query}"...\n(Backend integration would fetch results here)`);
            }
        };
    }

    if (notifBtn) {
        notifBtn.onclick = () => {
            alert("🔔 Notifications\n\n• Asr Prayer is in 20 mins\n• New Course Added: Seerah Part 3\n• Daily Hadith updated");
        };
    }

    // Profile Chip is already handled by initSettings (opens modal), 
    // but we ensure it has the pointer style just in case.
    if (profileChip) {
        profileChip.style.cursor = 'pointer';
        profileChip.title = "Open Settings";
    }
}

// --- COURSES LOGIC ---
function renderCourses() {
    console.log("Attempting to render courses...");
    const container = document.getElementById('courses-container');

    if (!container) {
        console.error("Courses container not found!");
        return;
    }

    if (!window.DASHBOARD_DATA?.courses) {
        console.error("No course data found in DASHBOARD_DATA");
        // Show visible error to user
        container.innerHTML = '<div style="color:#ef4444; background:rgba(239,68,68,0.1); padding:1rem; border-radius:12px; border:1px solid rgba(239,68,68,0.2); width:100%;">⚠️ Error: Course Data Missing. Please check console.</div>';
        return;
    }

    const courses = window.DASHBOARD_DATA.courses;
    console.log(`Found ${courses.length} courses to render.`);

    let html = '';

    courses.forEach((course, index) => {
        html += `
            <div class="course-card" onclick="openCourseModal(${index})">
                <div class="course-tag" style="color:${course.tagColor}">${course.tag}</div>
                <img src="${course.image}" alt="${course.title}" class="course-image" onerror="this.onerror=null; console.error('Image failed:', this.src); this.src='https://placehold.co/600x400';">
                <div class="course-overlay">
                    <div class="course-title">${course.title}</div>
                    <div class="course-subtitle">${course.subtitle}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function initTopics() {
    const buttons = document.querySelectorAll('.topic-pill');
    buttons.forEach(btn => {
        btn.onclick = () => {
            const topic = btn.textContent.replace(' ›', '');
            openTopicModal(topic);
        };
    });
}

// --- MODAL HELPERS FOR LEARNING ---
window.openCourseModal = function (index) {
    if (!window.DASHBOARD_DATA?.courses) {
        console.error("No course data available!");
        return;
    }
    const course = window.DASHBOARD_DATA.courses[index];
    if (course && course.id) {
        window.location.href = `course.html?id=${course.id}`;
    } else {
        alert("Course ID not found.");
    }
}

window.openTopicModal = function (topicKey) {
    if (!window.DASHBOARD_DATA?.topics) {
        console.error("No topic data available!");
        return;
    }
    const topic = window.DASHBOARD_DATA.topics[topicKey];
    if (topic) {
        window.location.href = `topic.html?id=${encodeURIComponent(topicKey)}`;
    } else {
        alert("Topic not found.");
    }
}

// --- DATE LOGIC ---
function renderDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date().toLocaleDateString('en-US', options);
    // Simple Hijri Approximation or Placeholder
    document.getElementById('date-display').textContent = date + " • " + "Hijri Date (Approx.)";
}

// --- DAILY FEED LOGIC ---
// --- DAILY FEED LOGIC (12H Cycle) ---
function renderDailyFeed() {
    if (!window.DASHBOARD_DATA || !window.DASHBOARD_DATA.daily) return;

    // API returns the correct daily object as the first item in the array check fetchAllData()
    const content = window.DASHBOARD_DATA.daily[0];

    if (!content) return;

    // --- HERO SECTION (Verse of the Day) ---
    const heroArabic = document.getElementById('hero-arabic');
    const heroTrans = document.getElementById('hero-translation');
    const heroReadBtn = document.getElementById('hero-read-btn');
    const heroListenBtn = document.getElementById('hero-listen-btn');

    if (heroArabic) heroArabic.textContent = content.ayah.text;
    if (heroTrans) heroTrans.textContent = `"${content.ayah.trans}" - ${content.ayah.ref}`;

    // Dynamic Deep Link
    if (heroReadBtn && content.meta && content.meta.surah_id) {
        heroReadBtn.href = `quran.html?surah=${content.meta.surah_id}`;
    }

    // Audio Playback
    if (heroListenBtn && content.meta && content.meta.audio) {
        // Remove old listeners by cloning or just setting onclick
        heroListenBtn.onclick = (e) => {
            e.preventDefault();
            playAyahOneShot(content.meta.audio);
        };
    }

    // --- CARDS ---

    // Ayah Card (Same as Hero but in card format)
    const ayahBody = document.getElementById('daily-ayah-body');
    if (ayahBody) {
        ayahBody.innerHTML = `
            <div class="ar-text" style="font-family:'Amiri', serif; font-size:1.5rem; text-align:center; color:#1e293b; margin-bottom:0.5rem;">${content.ayah.text}</div>
            <div class="en-text" style="font-size:0.95rem; color:#475569; text-align:center; line-height:1.6;">${content.ayah.trans}</div>
        `;
        document.getElementById('ayah-ref').textContent = content.ayah.ref;
    }

    // Hadith Card
    const hadithBody = document.getElementById('daily-hadith-body');
    if (hadithBody) {
        hadithBody.innerHTML = `
            <div class="en-text" style="font-style:italic; font-size:1rem; color:#334155; line-height:1.6; text-align:center;">"${content.hadith.text}"</div>
        `;
        document.getElementById('hadith-ref').textContent = content.hadith.ref;
    }

    // Dua Card
    const duaBody = document.getElementById('daily-dua-body');
    if (duaBody) {
        duaBody.innerHTML = `
            <div class="ar-text" style="font-family:'Amiri', serif; font-size:1.5rem; color:#1e293b; text-align:center; margin-bottom:0.5rem;">${content.dua.text}</div>
            <div class="en-text" style="font-size:0.95rem; color:#475569; text-align:center; line-height:1.6;">${content.dua.trans}</div>
        `;
        document.getElementById('dua-ref').textContent = `${content.dua.title} • ${content.dua.ref}`;
    }
}

// --- AUDIO HELPER ---
let currentHeroAudio = null;
let currentHeroUrl = null;

function playAyahOneShot(url) {
    const btn = document.getElementById('hero-listen-btn');

    // 1. Toggle Logic: If already playing THIS url, stop it.
    if (currentHeroAudio && currentHeroUrl === url) {
        currentHeroAudio.pause();
        currentHeroAudio = null;
        currentHeroUrl = null;
        if (btn) btn.innerHTML = "<i class='bx bx-play'></i> Listen";
        console.log("Audio: Stopped by user toggle.");
        return;
    }

    // 2. If playing something else, stop it first.
    if (currentHeroAudio) {
        currentHeroAudio.pause();
        currentHeroAudio = null;
    }

    // Valid URL check
    if (!url) {
        console.error("Audio: No URL provided");
        if (btn) btn.innerHTML = "<i class='bx bx-error'></i> No Audio";
        return;
    }

    console.log("Audio: Playing", url);
    currentHeroAudio = new Audio(url);
    currentHeroUrl = url;
    currentHeroAudio.loop = false; // Ensure it plays only once

    // Error Handler
    currentHeroAudio.onerror = (e) => {
        console.error("Audio Error:", e);
        if (btn) btn.innerHTML = "<i class='bx bx-error-circle'></i> Error";
        setTimeout(() => { if (btn) btn.innerHTML = "<i class='bx bx-play'></i> Listen"; }, 2000);
        currentHeroAudio = null;
        currentHeroUrl = null;
    };

    const playPromise = currentHeroAudio.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            if (btn) btn.innerHTML = "<i class='bx bx-pause'></i> Stop";
        }).catch(error => {
            console.error("Audio Blocked/Failed:", error);
            if (btn) btn.innerHTML = "<i class='bx bx-error'></i> Blocked";
        });
    }

    currentHeroAudio.onended = () => {
        console.log("Audio: Finished naturally.");
        if (btn) btn.innerHTML = "<i class='bx bx-play'></i> Listen";
        currentHeroAudio = null;
        currentHeroUrl = null;
    };
}

// --- PRAYER TIMES LOGIC ---
function fetchPrayerTimes() {
    console.log("Fetching Prayer Times...");
    const container = document.getElementById('prayer-display-container');
    if (!container) return;

    // Helper to fetch times
    const getTimes = (lat, long, method = 1) => { // Method 1: Karachi (Standard for PK/Region)
        fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${long}&method=${method}`)
            .then(res => res.json())
            .then(data => updatePrayerUI(data.data.timings))
            .catch(err => {
                console.error("Prayer API Error", err);
                container.innerHTML = '<div style="text-align:center; color:red;">Failed to load.</div>';
            });
    };

    // 1. Try GPS
    if (navigator.geolocation) {
        container.innerHTML = '<div style="text-align:center; padding:1rem; font-size:0.9rem; color:#64748b;">Locating...</div>';

        navigator.geolocation.getCurrentPosition(position => {
            getTimes(position.coords.latitude, position.coords.longitude);
        }, error => {
            console.log("GPS denied, trying IP fallback...", error);
            // 2. Fallback: IP Location (approximate)
            fetch('https://ipapi.co/json/')
                .then(res => res.json())
                .then(data => {
                    console.log("Logged in from:", data.city);
                    getTimes(data.latitude, data.longitude);
                })
                .catch(ipErr => {
                    console.error("IP Fallback Failed", ipErr);
                    container.innerHTML = '<div style="text-align:center; padding:1rem; font-size:0.9rem;">Enable Location for accurate times.<br>Default: Makkah</div>';
                    getTimes(21.4225, 39.8262, 4); // Fallback Makkah
                });
        });
    } else {
        container.innerHTML = "Not Supported";
    }
}

function updatePrayerUI(timings) {
    const container = document.getElementById('prayer-display-container');
    if (!container) return;

    const prayers = [
        { key: 'Fajr', name: 'Fajr' },
        { key: 'Dhuhr', name: 'Dhuhr' },
        { key: 'Asr', name: 'Asr' },
        { key: 'Maghrib', name: 'Maghrib' },
        { key: 'Isha', name: 'Isha' }
    ];

    let html = '';

    prayers.forEach(p => {
        // API returns HH:MM string (often 24h)
        const time = formatTime(timings[p.key]);
        html += `
            <div class="prayer-row">
                <span>${p.name}</span>
                <span>${time}</span>
            </div>
        `;
    });

    container.innerHTML = html;
}

function formatTime(time24) {
    if (!time24) return "--:--";
    let [h, m] = time24.split(':');
    let hour = parseInt(h);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12; // Convert 0 to 12
    return `${hour}:${m} ${suffix}`;
}

// --- DUAS GRID LOGIC ---
function renderDuasGrid() {
    if (!window.DASHBOARD_DATA) return;
    const grid = document.getElementById('duas-grid');
    const duas = window.DASHBOARD_DATA.duas;

    grid.innerHTML = '';

    for (const key in duas) {
        if (duas.hasOwnProperty(key)) {
            const dua = duas[key];
            const btn = document.createElement('button');
            btn.className = 'dua-btn';
            btn.style.setProperty('--btn-color', dua.color);
            btn.onclick = () => openDuaModal(key);

            btn.innerHTML = `
                <span class="dua-icon">${dua.icon}</span>
                <span class="dua-title">${dua.title}</span>
            `;
            grid.appendChild(btn);
        }
    }
}

// --- MODAL SYSTEM ---
const modal = document.getElementById('info-modal');
const modalContent = document.getElementById('modal-content');

function closeModal() {
    modal.classList.remove('active');
}

// Click outside to close
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// OPEN DUA
function openDuaModal(key) {
    const dua = window.DASHBOARD_DATA.duas[key];
    if (!dua) return;

    const content = dua.content;
    const refsHTML = content.refs.map(r => `<div>${r.type}: ${r.text}</div>`).join('');

    modalContent.innerHTML = `
        <div class="modal-header-title">${dua.title}</div>
        <div class="modal-arabic">${content.arabic}</div>
        <div class="modal-trans">${content.trans_ur}<br><br>${content.trans_en}</div>
        <div class="modal-context">
            <strong>Context:</strong> ${content.context}
        </div>
        <div class="modal-refs">${refsHTML}</div>
    `;

    modal.classList.add('active');
}

// OPEN SEERAH (Level 1: List)
function openSeerahModal() {
    const list = window.DASHBOARD_DATA.seerah;

    // Header
    let html = `
        <div class="modal-header-title">Seerah of the Prophet ﷺ</div>
        <div style="text-align:center; color:#64748b; margin-bottom:1.5rem;">Timeline of Mercy & Guidance</div>
        <div class="seerah-list">
    `;

    // List Items
    list.forEach((item, index) => {
        html += `
            <div class="seerah-item" onclick="openSeerahDetail(${index})" style="
                background: #f8fafc;
                padding: 1.25rem;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
                margin-bottom: 1rem;
                cursor: pointer;
                transition: 0.2s;
                display: flex;
                align-items: center;
                gap: 1rem;
            " onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'">
                <div style="font-weight:700; color:#b45309; min-width:80px; font-size:0.9rem;">${item.period}</div>
                <div style="flex:1;">
                    <div style="font-weight:700; font-size:1.1rem; color:#1e293b;">${item.title}</div>
                    <div style="font-family:'Amiri', serif; color:#047857; font-size:1.2rem;">${item.title_ur || ''}</div>
                    <div style="font-size:0.9rem; color:#64748b; margin-top:0.25rem;">${item.desc.substring(0, 60)}...</div>
                </div>
                <i class='bx bx-chevron-right' style="font-size:1.5rem; color:#94a3b8;"></i>
            </div>
        `;
    });

    html += `</div>`;
    modalContent.innerHTML = html;
    modal.classList.add('active');
}

// OPEN SEERAH DETAIL (Level 2: Content)
// Make this available globally or attach to window if needed, but since script.js is global scope, this works.
window.openSeerahDetail = function (index) {
    const item = window.DASHBOARD_DATA.seerah[index];
    if (!item) return;

    let html = `
        <div class="nav-header" style="display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem;">
            <button onclick="openSeerahModal()" style="
                background:none; border:none; cursor:pointer; color:#b45309; font-weight:600; display:flex; align-items:center; gap:0.5rem;
            "><i class='bx bx-arrow-back'></i> Back</button>
        </div>

        <div style="text-align:center; margin-bottom:2rem;">
            <div style="color:#b45309; font-weight:700; font-size:0.9rem; text-transform:uppercase; letter-spacing:1px; margin-bottom:0.5rem;">${item.period}</div>
            <h2 style="font-size:2rem; margin:0; color:#1e293b; font-family:'Playfair Display', serif;">${item.title}</h2>
            <h3 style="font-family:'Amiri', serif; font-size:2.5rem; color:#047857; margin:0.5rem 0;">${item.title_ur || ''}</h3>
        </div>

        <div class="content-body" style="
            text-align:right; 
            font-family:'Amiri', serif; 
            font-size:1.4rem; 
            line-height:2.2; 
            color:#334155; 
            dir:rtl;
            background:#fdfbf7;
            padding:1.5rem;
            border-radius:16px;
            border:1px solid #f1f5f9;
        ">
            ${item.content_ur || "<p>Content loading...</p>"}
        </div>
    `;
    modalContent.innerHTML = html;
    document.querySelector('.modal-container').scrollTop = 0;
};

// --- WELCOME SCREEN LOGIC ---
function enterDashboard() {
    const input = document.getElementById('username-input');
    const name = input.value.trim();

    if (!name) {
        // Shake animation or visual feedback for empty input could go here
        input.style.borderColor = '#ef4444';
        return;
    }

    // Force Scroll Top
    window.scrollTo(0, 0);

    // Save Name (Session Persistence only)
    sessionStorage.setItem('deensphere_user', name);

    // Update Greeting
    updateGreeting(name);

    // Fade Out Overlay
    const overlay = document.getElementById('welcome-overlay');
    overlay.classList.add('fade-out');

    // Remove from DOM after transition
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
}

function updateGreeting(name) {
    const welcomeText = document.querySelector('.welcome-text');
    if (welcomeText) {
        welcomeText.textContent = `Assalamu Alaikum, ${name}`;
    }
}

// Auto-focus input on load
window.addEventListener('load', () => {
    // Check if user already entered name previously (Session based)
    const savedName = sessionStorage.getItem('deensphere_user');

    if (savedName) {
        // User found in this session, skip overlay
        updateGreeting(savedName);
        const overlay = document.getElementById('welcome-overlay');
        if (overlay) overlay.style.display = 'none';
    } else {
        // No user in session, show input
        const input = document.getElementById('username-input');
        if (input) input.focus();
    }
});

// Allow "Enter" key to submit
document.getElementById('username-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        enterDashboard();
    }
});

// --- SETTINGS / MODAL LOGIC (DASHBOARD) ---
// Minimal Reciter Data for Dropdown (Synced with quran.js)
const RECITERS_MIN = {
    'ar.alafasy': { name: 'Mishary Rashid Alafasy' },
    'ar.abdulbasit': { name: 'Abdul Basit (Murattal)' },
    'ar.sudais': { name: 'Abdurrahmaan As-Sudais' },
    'ur.jalandhry': { name: 'Fateh Muhammad Jalandhry' }
};

// Global State wrapper (minimal)
window.quranState = window.quranState || {
    currentReciter: 'ar.alafasy',
    currentLanguage: 'ur'
};

function initSettings() {
    const userChip = document.querySelector('.user-chip');
    if (userChip) {
        userChip.style.cursor = 'pointer';
        userChip.onclick = () => openSettingsModal();
    }

    // Populate Reciter Select
    const modalSelect = document.getElementById('modal-reciter-select');
    if (modalSelect) {
        modalSelect.innerHTML = '';
        // Use full list if available via another script, else fallback
        const list = (window.RECITERS) ? window.RECITERS : RECITERS_MIN;

        for (const [key, data] of Object.entries(list)) {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = data.name;
            if (key === quranState.currentReciter) opt.selected = true;
            modalSelect.appendChild(opt);
        }
        modalSelect.onchange = (e) => {
            quranState.currentReciter = e.target.value;
            console.log("Reciter changed to:", e.target.value);
        };
    }
}

window.openSettingsModal = function () {
    const m = document.getElementById('settings-modal');
    if (m) m.classList.remove('hidden');
};

window.closeSettingsModal = function () {
    const m = document.getElementById('settings-modal');
    if (m) m.classList.add('hidden');
};

window.setLanguage = function (lang) {
    quranState.currentLanguage = lang;

    // UI Update
    const btnUr = document.getElementById('btn-lang-ur');
    const btnEn = document.getElementById('btn-lang-en');

    if (btnUr) {
        btnUr.className = lang === 'ur' ? 'segment-btn active' : 'segment-btn';
        btnUr.style.background = lang === 'ur' ? 'white' : 'transparent';
    }
    if (btnEn) {
        btnEn.className = lang === 'en' ? 'segment-btn active' : 'segment-btn';
        btnEn.style.background = lang === 'en' ? 'white' : 'transparent';
    }

    console.log("Language set to:", lang);
}

// Call init on load
document.addEventListener('DOMContentLoaded', () => {
    initSettings();
});
