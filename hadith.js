
class HadithManager {
    constructor() {
        this.books = [
            { id: 'bukhari', name: 'Sahih Bukhari (صحیح بخاری)', file: 'hadith_bukhari.js' },
            { id: 'muslim', name: 'Sahih Muslim (صحیح مسلم)', file: 'hadith_muslim.js' },
            { id: 'abudawud', name: 'Sunan Abu Dawood (سنن ابوداؤد)', file: 'hadith_abudawud.js' },
            { id: 'tirmidhi', name: 'Jami` at-Tirmidhi (جامع ترمذی)', file: 'hadith_tirmidhi.js' },
            { id: 'nasai', name: 'Sunan an-Nasa’i (سنن نسائی)', file: 'hadith_nasai.js' },
            { id: 'ibnmajah', name: 'Sunan Ibn Majah (سنن ابن ماجہ)', file: 'hadith_ibnmajah.js' },
            { id: 'malik', name: 'Muwatta Imam Malik (موطأ امام مالک)', file: 'hadith_malik.js' }
        ];
        this.cache = {};
        this.currentBook = null;
        this.currentHadithList = [];

        this.init();
    }

    init() {
        console.log("HadithManager: Init started");
        this.cacheDOM();
        this.bindEvents();
        this.renderBooks();
        console.log("HadithManager: Init finished");
    }

    cacheDOM() {
        this.container = document.getElementById('hadith-container');
        this.booksView = document.getElementById('hadith-books-view');
        console.log("HadithManager: Books View Element:", this.booksView);
        this.listView = document.getElementById('hadith-list-view');
        this.detailView = document.getElementById('hadith-detail-view');
        this.loadingIndicator = document.getElementById('hadith-loading');
        this.listContainer = document.getElementById('hadith-list-container');
        this.contentContainer = document.getElementById('hadith-content-container');

        // Headers
        this.listBookTitle = document.getElementById('list-book-title');
        this.listHadithCount = document.getElementById('list-hadith-count');

        // Map old properties to new elements to prevent null crashes if accessed
        this.currentBookName = this.listBookTitle;
        this.hadithCountBadge = this.listHadithCount;

        this.detailBookName = document.getElementById('detail-book-name');

        // Search Inputs (Hero + Nav)
        this.heroSearch = document.getElementById('hadith-search-hero');
        this.navSearch = document.getElementById('hadith-search-nav');

        // Navigation Buttons
        this.backToBooksBtn = document.getElementById('back-to-books');
        this.backToListBtn = document.getElementById('back-to-hadith-list');
    }

    bindEvents() {
        this.backToBooksBtn.addEventListener('click', () => this.showBooksView());
        this.backToListBtn.addEventListener('click', () => this.showListView());

        const handleSearch = (e) => this.handleSearch(e.target.value);

        if (this.heroSearch) this.heroSearch.addEventListener('input', handleSearch);
        if (this.navSearch) this.navSearch.addEventListener('input', handleSearch);
    }

    renderBooks() {
        console.log("HadithManager: renderBooks called. Books count:", this.books.length);
        if (!this.booksView) {
            console.error("HadithManager: booksView not found!");
            return;
        }
        this.booksView.innerHTML = this.books.map(book => {
            // Split "Name (Urdu)"
            const parts = book.name.match(/(.+?)\s*\((.+?)\)/);
            const enName = parts ? parts[1] : book.name;
            const urName = parts ? parts[2] : '';

            // Premium Card Design
            return `
            <div class="hadith-book-card-premium" onclick="hadithManager.loadBook('${book.id}')">
                <div class="book-card-bg"></div>
                <div class="book-card-content">
                    <div class="book-icon-wrapper">
                        <i class='bx bxs-book-bookmark'></i>
                    </div>
                    <div class="book-info">
                        <h3 class="book-title-en">${enName}</h3>
                        <span class="book-title-ur">${urName}</span>
                    </div>
                    <div class="book-shine"></div>
                </div>
            </div>
            `;
        }).join('');
    }

    async loadBook(bookId) {
        const bookConfig = this.books.find(b => b.id === bookId);
        if (!bookConfig) return;

        this.showLoading(true);
        this.currentBook = bookConfig;

        try {
            if (!this.cache[bookId]) {
                await this.loadScript(bookId);
            }

            const bookData = this.cache[bookId];
            this.currentHadithList = bookData.hadiths || [];

            // Update Header Info
            if (this.listBookTitle) this.listBookTitle.textContent = this.currentBook.name;
            if (this.listHadithCount) this.listHadithCount.textContent = `${this.currentHadithList.length} Hadiths`;

            this.renderHadithList();
            this.showListView();
        } catch (error) {
            console.error('Error loading book:', error);
            alert('Failed to load Hadith book. Please ensure the data files (e.g., hadith_bukhari.js) are present.');
        } finally {
            this.showLoading(false);
        }
    }

    loadScript(bookId) {
        return new Promise((resolve, reject) => {
            const varName = `HADITH_DATA_${bookId.toUpperCase()}`;

            // 1. Check if already loaded globally
            if (window[varName]) {
                console.log(`HadithManager: ${varName} found in global scope.`);
                this.cache[bookId] = window[varName];
                resolve(window[varName]);
                return;
            }

            const script = document.createElement('script');
            script.src = `hadith_${bookId}.js`;

            script.onload = () => {
                const data = window[varName];
                if (data) {
                    console.log(`HadithManager: Successfully loaded ${varName}`);
                    this.cache[bookId] = data;
                    resolve(data);
                } else {
                    console.error(`HadithManager: Script loaded but ${varName} missing.`);
                    console.log('Available HADITH_ keys:', Object.keys(window).filter(k => k.startsWith('HADITH_')));
                    reject(new Error(`Variable ${varName} not found in script hadith_${bookId}.js`));
                }
                // Do not remove script to avoid potential GC issues with large data in some environments
                // script.remove(); 
            };

            script.onerror = (e) => {
                console.error(`HadithManager: Failed to load script hadith_${bookId}.js`, e);
                reject(new Error(`Failed to load script: hadith_${bookId}.js. Check console for details.`));
            };

            document.body.appendChild(script);
        });
    }

    renderHadithList() {
        if (this.listBookTitle && this.currentBook) {
            this.listBookTitle.textContent = this.currentBook.name;
        }
        if (this.listHadithCount && this.currentHadithList) {
            this.listHadithCount.textContent = `${this.currentHadithList.length} Hadiths`;
        }

        // Render virtual scrolling or pagination if list is huge? 
        // For now, simple render. If > 7000 items, might be slow. 
        // Let's perform a chunked render or basic map. 7000 DOM nodes is heavy but manageable on modern browsers.
        // Optimization: Limit to first 100, then load more or use a simpler structure.

        // Let's implement lazy rendering or limit initial view for performance
        const initialLimit = 100; // Render first 100
        this.renderListItems(this.currentHadithList.slice(0, initialLimit));

        // Add "Load More" button if needed, or implement infinite scroll. 
        // For simplicity in this iteration:
        if (this.currentHadithList.length > initialLimit) {
            const loadMoreBtn = document.createElement('button');
            loadMoreBtn.className = 'btn-primary';
            loadMoreBtn.textContent = 'Load All (May be slow)';
            loadMoreBtn.style.margin = '1rem auto';
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.onclick = () => {
                loadMoreBtn.remove();
                this.renderListItems(this.currentHadithList); // Render all
            };
            if (this.listContainer) this.listContainer.appendChild(loadMoreBtn);
        }
    }

    renderListItems(items) {
        this.listContainer.innerHTML = items.map(hadith => `
            <div class="hadith-quote-card" onclick="hadithManager.openHadith(${hadith.hadithnumber})">
                <div class="quote-header">
                    <span class="hadith-number-badge">Hadith #${hadith.hadithnumber}</span>
                    <div class="quote-actions">
                        <button class="action-btn-mini" onclick="event.stopPropagation(); hadithManager.copyHadith(${hadith.hadithnumber})"><i class='bx bx-copy'></i></button>
                        <button class="action-btn-mini" onclick="event.stopPropagation(); alert('Share feature coming soon!')"><i class='bx bx-share-alt'></i></button>
                    </div>
                </div>
                <div class="quote-body">
                    <p class="hadith-text-en">${this.getPreviewText(hadith)}</p>
                    <p class="hadith-read-more">Read Full Hadith <i class='bx bx-right-arrow-alt'></i></p>
                </div>
                <div class="quote-footer">
                    <span class="book-tag">${this.currentBook.name}</span>
                </div>
            </div>
        `).join('');
    }

    getPreviewText(hadith) {
        // bukhari.json has 'text' which is Urdu.
        // text might be long, so truncate.
        const text = hadith.text || "معذرت، اس حدیث کا اردو ترجمہ ابھی دستیاب نہیں ہے۔";
        return text.length > 100 ? text.substring(0, 100) + '...' : text;
    }

    handleSearch(query) {
        if (!query) {
            if (this.currentBook) {
                this.renderHadithList(); // Reset list to full
            } else {
                this.renderBooks(); // Reset books to full
            }
            return;
        }

        const lowerQuery = query.toLowerCase().trim();
        const isNumber = !isNaN(lowerQuery) && lowerQuery !== '';

        // Search in current book if open
        if (this.currentBook && this.cache[this.currentBook.id]) {
            let results;
            if (isNumber) {
                // Precise number matching as requested by user
                // "gives exact results of all hadith of that specific number"
                // We initially filter for EXACT match on hadithnumber
                const exactMatches = this.currentHadithList.filter(h => h.hadithnumber == lowerQuery);

                // If found, show only those. If not, maybe show containing matches (e.g. 10 matches 10, 100, 101)
                // But user asked for "exact results of all hadith of that specific number".
                // We will prioritize exact matches.
                if (exactMatches.length > 0) {
                    results = exactMatches;
                } else {
                    // Fallback to partial number match or text search if exact number not found
                    results = this.currentHadithList.filter(h => {
                        const num = (h.hadithnumber || '').toString();
                        return num.includes(lowerQuery);
                    });
                }
            } else {
                // Text search
                results = this.currentHadithList.filter(h => {
                    const text = (h.text || '').toLowerCase();
                    const arabic = (h.arabic || '').toLowerCase();
                    return text.includes(lowerQuery) || arabic.includes(lowerQuery);
                });
            }
            this.renderListItems(results);
        } else {
            // Global search (Books View)
            if (!this.currentBook) {
                // Allow filtering books by name
                const filteredBooks = this.books.filter(b => b.name.toLowerCase().includes(lowerQuery));
                this.booksView.innerHTML = filteredBooks.map(book => `
                    <div class="surah-card" onclick="hadithManager.loadBook('${book.id}')">
                        <div class="surah-number"><span>📖</span></div>
                        <div class="surah-info"><h3>${book.name}</h3></div>
                    </div>
                `).join('');

                if (filteredBooks.length === 0) {
                    this.booksView.innerHTML = `<p style="text-align:center; width:100%; color:var(--text-secondary);">No books found matching "${query}"</p>`;
                }
            }
        }
    }

    openHadith(hadithNumber) {
        const hadith = this.currentHadithList.find(h => h.hadithnumber == hadithNumber);
        if (!hadith) return;

        this.currentDetailHadith = hadith; // Save state for Tafsir
        this.renderHadithDetail(hadith);
        this.showDetailView();
    }

    renderHadithDetail(hadith) {
        this.detailBookName.textContent = `${this.currentBook.name} - Hadith ${hadith.hadithnumber}`;

        // Check for arabic/urdu separation. In bukhari.json we saw 'text' is Urdu. 
        // We will assume 'text' is the main content.

        let html = `
            <div class="ayah-header">
                <span class="ayah-number-badge">${hadith.hadithnumber}</span>
            </div>
        `;

        if (hadith.arabic) {
            html += `<div class="arabic-text-large">${hadith.arabic}</div>`;
        }

        // Urdu / Main Text
        // Using 'urdu-translation' class for consistent styling with Quran module if it is indeed Urdu
        html += `<p class="urdu-translation" style="margin-top:1.5rem;">${hadith.text}</p>`;

        // Grades/Reference if available
        if (hadith.grades && hadith.grades.length > 0) {
            html += `
                <div class="hadith-grades" style="margin-top: 2rem; padding: 1rem; background: var(--bg-card); border-radius: 8px;">
                    <h4>Grades:</h4>
                    ${hadith.grades.map(g => `<div><span class="tag">${g.grade}</span> - ${g.name}</div>`).join('')}
                </div>
            `;
        }

        this.contentContainer.innerHTML = html;
    }

    showBooksView() {
        this.hideAllViews();
        this.booksView.classList.remove('hidden');
        this.currentBook = null;

        // Restore Main Header
        const header = document.querySelector('.top-header');
        if (header) header.style.display = 'flex';

        // FIX: Force reset the Subtitle ID to the correct static text
        if (this.hadithCountBadge) {
            this.hadithCountBadge.textContent = "Wisdom from the Prophet ﷺ";
        }
        // Also reset the main title just in case
        if (this.currentBookName) {
            this.currentBookName.textContent = "Hadith Library";
        }
    }

    showListView() {
        this.hideAllViews();
        this.listView.classList.remove('hidden');

        // Hide Main Header (since we use the Glass Header now)
        const header = document.querySelector('.top-header');
        if (header) header.style.display = 'none';

        window.scrollTo(0, 0);
    }

    showDetailView() {
        this.hideAllViews();
        this.detailView.classList.remove('hidden');
    }

    hideAllViews() {
        this.booksView.classList.add('hidden');
        this.listView.classList.add('hidden');
        this.detailView.classList.add('hidden');
    }

    showLoading(show) {
        if (show) this.loadingIndicator.classList.remove('hidden');
        else this.loadingIndicator.classList.add('hidden');
    }

    async getRandomHadith() {
        // Prefer Bukhari for Daily Hadith as it's most common
        const bookId = 'bukhari';

        try {
            if (!this.cache[bookId]) {
                await this.loadBook(bookId);
            }

            // Wait a sec if loadBook is async and redundant calls happen? 
            // loadBook updates 'currentBook', we might want to avoid side effects if user didn't request it explicitly.
            // But for simplicity, we rely on the cache.

            const bookData = this.cache[bookId];
            if (!bookData || !bookData.hadiths) return null;

            const randomIndex = Math.floor(Math.random() * bookData.hadiths.length);
            const hadith = bookData.hadiths[randomIndex];

            return {
                bookName: 'Sahih Bukhari',
                hadith: hadith
            };
        } catch (e) {
            console.error("Error fetching random hadith", e);
            return null;
        }
    }
    openTafsir() {
        if (!this.currentDetailHadith) {
            this.showToast("Please open a Hadith first.");
            return;
        }

        const h = this.currentDetailHadith;

        // Mock Scholars Data for Demo
        const scholars = [
            { id: 'taqi', name: 'Mufti Taqi Usmani', hasAudio: true },
            { id: 'ibnkathir', name: 'Tafsir Ibn Kathir', hasAudio: false },
            { id: 'israr', name: 'Dr. Israr Ahmed', hasAudio: true }
        ];

        // Default or fetch existing text (using window.TAFSIR_DATA as base)
        const baseData = window.TAFSIR_DATA && window.TAFSIR_DATA.hadith[h.hadithNumber];

        // Helper to get content for a scholar (Mock logic)
        const getScholarContent = (scholarId) => {
            if (!baseData) return null;

            // In a real app, you'd fetch specific text for each scholar.
            // Here we just decorate the base text to show the feature works.
            let content = baseData.content;
            let intro = baseData.intro;

            if (scholarId === 'ibnkathir') {
                intro = "امام ابن کثیر کی تفسیر اپنی اسناد اور روایات کے لیے مشہور ہے۔";
                content = `<h3>ابن کثیر کی تشریح</h3><p>یہ حدیث اس بات کی دلیل ہے کہ اعمال کا وزن نیت کے پلڑے میں ہوتا ہے۔۔۔</p>` + content;
            } else if (scholarId === 'israr') {
                intro = "ڈاکٹر اسرار احمد کا بیان قرآن و حدیث کے انقلابی پہلوؤں پر زور دیتا ہے۔";
                content = `<h3>بصیرت</h3><p>اس حدیث میں امت کے لیے ایک عظیم فکری پیغام ہے۔۔۔</p>` + content;
            }

            return { intro, content };
        };

        const modalContentHTML = `
            <div>
                <div class="tafsir-header">
                    <div class="tafsir-title-badge">
                        <i class='bx bxs-book-content'></i>
                        Hadith #${h.hadithNumber}
                    </div>
                    <div class="tafsir-title-main">تشریح و فوائد</div>
                </div>

                <!-- Scholar Selection -->
                <div class="scholar-select-container">
                    <label>Select Scholar (تفاسیر)</label>
                    <div class="custom-select-wrapper">
                        <select id="tafsir-scholar-select" onchange="hadithManager.updateTafsirView(this.value)">
                            ${scholars.map(s => `<option value="${s.id}">${s.name} ${s.hasAudio ? '🎧' : ''}</option>`).join('')}
                        </select>
                        <i class='bx bx-chevron-down'></i>
                    </div>
                </div>

                <!-- Audio Player (Placeholder) -->
                <div id="tafsir-audio-container" class="tafsir-audio-player hidden">
                    <div class="audio-info">
                        <div class="audio-icon"><i class='bx bx-play'></i></div>
                        <span>Listen to Explanation</span>
                    </div>
                    <audio id="tafsir-audio" controls style="width:100%; margin-top:0.5rem;"></audio>
                </div>
                
                <div id="tafsir-body-content" style="padding: 0 0.5rem;">
                    <!-- Content Injected via JS -->
                </div>
            </div>
        `;

        // Universal Modal Logic
        let modal = document.getElementById('info-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'info-modal';
            modal.className = 'modal-overlay';
            // Note: Added simple inline styles for quick modal fix if css missing
            modal.innerHTML = `
                <div class="modal-container">
                    <button class="close-modal" onclick="closeModal()">&times;</button>
                    <div id="modal-content"></div>
                </div>
            `;
            document.body.appendChild(modal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }

        document.getElementById('modal-content').innerHTML = modalContentHTML;
        modal.classList.add('active');

        // Initial Render (Default to first scholar)
        this.currentTafsirBaseData = baseData; // Store for updateTafsirView
        this.updateTafsirView('taqi');

        // Ensure closeModal is global
        window.closeModal = function () {
            const m = document.getElementById("info-modal");
            if (m) m.classList.remove('active');
            // Stop audio if playing
            const audio = document.getElementById('tafsir-audio');
            if (audio) { audio.pause(); audio.currentTime = 0; }
        };
    }

    updateTafsirView(scholarId) {
        const container = document.getElementById('tafsir-body-content');
        const audioContainer = document.getElementById('tafsir-audio-container');
        const baseData = this.currentTafsirBaseData;

        // Mock Logic for content
        let contentHtml = '';
        let hasAudio = (scholarId === 'taqi' || scholarId === 'israr');

        if (baseData) {
            let intro = baseData.intro;
            let content = baseData.content;

            // Customizing text based on scholar (Mock)
            if (scholarId === 'ibnkathir') {
                intro = "<strong>ابن کثیر:</strong> یہ تفسیر روایات پر مبنی ہے۔";
            } else if (scholarId === 'taqi') {
                intro = "<strong>مفتی تقی عثمانی:</strong> فقہی اور جدید مسائل کا حل۔";
            }

            contentHtml = `
                <div class="tafsir-intro-box">
                    <div class="tafsir-intro-title">
                        <i class='bx bxs-bulb'></i>
                        تعارف (Introduction)
                    </div>
                    <p style="margin:0; line-height:1.8; color:#78350f;">${intro}</p>
                </div>
                <div class="tafsir-content-text">
                    ${content}
                </div>
            `;
        } else {
            contentHtml = `
                <div style="text-align:center; padding:2rem; color:var(--text-slate);">
                    <i class='bx bx-book-content' style="font-size:3rem; margin-bottom:1rem; opacity:0.5;"></i>
                    <p>اس عالم کی تشریح ابھی دستیاب نہیں ہے۔</p>
                </div>
            `;
        }

        container.innerHTML = contentHtml;
        // Audio Logic
        if (hasAudio) {
            audioContainer.classList.remove('hidden');
            const audioPlayer = document.getElementById('tafsir-audio');

            // Authentic Lecture URLs (High Availability)
            let audioUrl = "";
            let isFallback = false;

            if (scholarId === 'taqi') {
                // Mufti Taqi Usmani - Islah e Nafs (Stable Link)
                audioUrl = "https://archive.org/download/IslahENafsKLiyeAhamNasayehByShaykhMuftiTaqiUsmaniDb/Mufti%20Taqi%20Usmani_%20Islah%20e%20Nafs%20k%20liye%20aham%20nasayeh.mp3";
            } else if (scholarId === 'israr') {
                // Dr. Israr Ahmed - Bayan Ul Quran (Official Verified Link)
                audioUrl = "https://data.quranacademy.com/Bayanulquran/Urdu/Audio/001-Surah-Al-Fatiha.mp3";
            }

            // Error Handling (No Quran Fallback)
            audioPlayer.onerror = () => {
                console.warn("Audio playback failed for URL:", audioPlayer.src);
                this.showToast("Audio unavailable. (Link expired or blocked)");
            };

            // Set Source
            if (audioPlayer.src !== audioUrl) {
                audioPlayer.src = audioUrl;
                // Preload metadata to check validity
                audioPlayer.load();
            }
        } else {
            audioContainer.classList.add('hidden');
            const audioPlayer = document.getElementById('tafsir-audio');
            if (audioPlayer) {
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
            }
        }
    }

    async copyHadith(hadithNumber) {
        const hadith = this.currentHadithList.find(h => h.hadithnumber == hadithNumber);
        if (!hadith) return;

        const textToCopy = `Hadith #${hadith.hadithnumber} - ${this.currentBook.name}\n\n${hadith.text}\n\nRead more at DeenSphere Pro`;

        try {
            await navigator.clipboard.writeText(textToCopy);
            this.showToast("Hadith copied to clipboard!");
        } catch (err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers or non-secure contexts
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("Copy");
            textArea.remove();
            this.showToast("Hadith copied to clipboard!");
        }
    }

    showToast(message) {
        // Create toast element on the fly if it doesn't exist (cleaner than polluting HTML)
        let toast = document.getElementById('hadith-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'hadith-toast';
            toast.className = 'toast-notification';
            toast.innerHTML = `<i class='bx bxs-check-circle'></i> <span id="toast-msg"></span>`;
            document.body.appendChild(toast);
        }

        toast.querySelector('#toast-msg').textContent = message;

        // Show
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Hide after 3 seconds
        if (this.toastTimeout) clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

} // End of Class

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    window.hadithManager = new HadithManager();
});
