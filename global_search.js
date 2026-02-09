// Global Search Functionality for DeenSphere
(function () {
    const searchInput = document.getElementById('global-search-input');
    const searchResults = document.getElementById('search-results');

    if (!searchInput || !searchResults) return;

    // Search data sources
    const SEARCH_DATA = {
        quran: [
            { name: "Al-Fatihah", number: 1, type: "Surah", url: "quran.html?surah=1" },
            { name: "Al-Baqarah", number: 2, type: "Surah", url: "quran.html?surah=2" },
            { name: "Ali 'Imran", number: 3, type: "Surah", url: "quran.html?surah=3" },
            { name: "An-Nisa", number: 4, type: "Surah", url: "quran.html?surah=4" },
            { name: "Al-Ma'idah", number: 5, type: "Surah", url: "quran.html?surah=5" },
            { name: "Al-An'am", number: 6, type: "Surah", url: "quran.html?surah=6" },
            { name: "Al-A'raf", number: 7, type: "Surah", url: "quran.html?surah=7" },
            { name: "Al-Anfal", number: 8, type: "Surah", url: "quran.html?surah=8" },
            { name: "At-Tawbah", number: 9, type: "Surah", url: "quran.html?surah=9" },
            { name: "Yunus", number: 10, type: "Surah", url: "quran.html?surah=10" },
            { name: "Hud", number: 11, type: "Surah", url: "quran.html?surah=11" },
            { name: "Yusuf", number: 12, type: "Surah", url: "quran.html?surah=12" },
            { name: "Ar-Ra'd", number: 13, type: "Surah", url: "quran.html?surah=13" },
            { name: "Ibrahim", number: 14, type: "Surah", url: "quran.html?surah=14" },
            { name: "Al-Hijr", number: 15, type: "Surah", url: "quran.html?surah=15" },
            { name: "An-Nahl", number: 16, type: "Surah", url: "quran.html?surah=16" },
            { name: "Al-Isra", number: 17, type: "Surah", url: "quran.html?surah=17" },
            { name: "Al-Kahf", number: 18, type: "Surah", url: "quran.html?surah=18" },
            { name: "Maryam", number: 19, type: "Surah", url: "quran.html?surah=19" },
            { name: "Taha", number: 20, type: "Surah", url: "quran.html?surah=20" },
            { name: "Al-Mulk", number: 67, type: "Surah", url: "quran.html?surah=67" },
            { name: "Al-Ikhlas", number: 112, type: "Surah", url: "quran.html?surah=112" },
            { name: "Al-Falaq", number: 113, type: "Surah", url: "quran.html?surah=113" },
            { name: "An-Nas", number: 114, type: "Surah", url: "quran.html?surah=114" }
        ],
        hadith: [
            { name: "Sahih Bukhari", type: "Hadith Collection", url: "hadith.html" },
            { name: "Sahih Muslim", type: "Hadith Collection", url: "hadith.html" },
            { name: "Sunan Abu Dawud", type: "Hadith Collection", url: "hadith.html" },
            { name: "Jami at-Tirmidhi", type: "Hadith Collection", url: "hadith.html" },
            { name: "Sunan an-Nasa'i", type: "Hadith Collection", url: "hadith.html" },
            { name: "Sunan Ibn Majah", type: "Hadith Collection", url: "hadith.html" }
        ],
        duas: [
            { name: "Morning Duas", type: "Dua", url: "duas.html" },
            { name: "Evening Duas", type: "Dua", url: "duas.html" },
            { name: "Before Sleep", type: "Dua", url: "duas.html" },
            { name: "After Waking Up", type: "Dua", url: "duas.html" }
        ],
        pages: [
            { name: "Dashboard", type: "Page", url: "index.html", icon: "bx-home" },
            { name: "Quran Library", type: "Page", url: "quran.html", icon: "bx-book-open" },
            { name: "Hadith Library", type: "Page", url: "hadith.html", icon: "bx-book-bookmark" },
            { name: "99 Names of Allah", type: "Page", url: "names.html", icon: "bx-star" },
            { name: "Digital Tasbih", type: "Page", url: "tasbih.html", icon: "bx-mobile" },
            { name: "Duas & Prayers", type: "Page", url: "duas.html", icon: "bx-pray" },
            { name: "Seerah", type: "Page", url: "seerah.html", icon: "bx-book-content" },
            { name: "Courses", type: "Page", url: "course.html", icon: "bx-graduation" }
        ]
    };

    let debounceTimer;

    searchInput.addEventListener('input', function (e) {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim().toLowerCase();

        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        debounceTimer = setTimeout(() => {
            performSearch(query);
        }, 300);
    });

    function performSearch(query) {
        const results = {
            quran: [],
            hadith: [],
            duas: [],
            pages: []
        };

        // Search Quran
        SEARCH_DATA.quran.forEach(item => {
            if (item.name.toLowerCase().includes(query) ||
                item.number.toString() === query) {
                results.quran.push(item);
            }
        });

        // Search Hadith
        SEARCH_DATA.hadith.forEach(item => {
            if (item.name.toLowerCase().includes(query)) {
                results.hadith.push(item);
            }
        });

        // Search Duas
        SEARCH_DATA.duas.forEach(item => {
            if (item.name.toLowerCase().includes(query)) {
                results.duas.push(item);
            }
        });

        // Search Pages
        SEARCH_DATA.pages.forEach(item => {
            if (item.name.toLowerCase().includes(query)) {
                results.pages.push(item);
            }
        });

        displayResults(results);
    }

    function displayResults(results) {
        let html = '';
        let hasResults = false;

        // Quran Results
        if (results.quran.length > 0) {
            hasResults = true;
            html += '<div class="search-category">';
            html += '<div class="search-category-title">📖 Quran</div>';
            results.quran.slice(0, 5).forEach(item => {
                html += `
                    <div class="search-result-item" onclick="window.location.href='${item.url}'">
                        <div class="search-result-title">${item.name}</div>
                        <div class="search-result-subtitle">Surah ${item.number}</div>
                    </div>
                `;
            });
            html += '</div>';
        }

        // Hadith Results
        if (results.hadith.length > 0) {
            hasResults = true;
            html += '<div class="search-category">';
            html += '<div class="search-category-title">📚 Hadith</div>';
            results.hadith.forEach(item => {
                html += `
                    <div class="search-result-item" onclick="window.location.href='${item.url}'">
                        <div class="search-result-title">${item.name}</div>
                        <div class="search-result-subtitle">${item.type}</div>
                    </div>
                `;
            });
            html += '</div>';
        }

        // Duas Results
        if (results.duas.length > 0) {
            hasResults = true;
            html += '<div class="search-category">';
            html += '<div class="search-category-title">🤲 Duas</div>';
            results.duas.forEach(item => {
                html += `
                    <div class="search-result-item" onclick="window.location.href='${item.url}'">
                        <div class="search-result-title">${item.name}</div>
                        <div class="search-result-subtitle">${item.type}</div>
                    </div>
                `;
            });
            html += '</div>';
        }

        // Pages Results
        if (results.pages.length > 0) {
            hasResults = true;
            html += '<div class="search-category">';
            html += '<div class="search-category-title">🏠 Pages</div>';
            results.pages.forEach(item => {
                html += `
                    <div class="search-result-item" onclick="window.location.href='${item.url}'">
                        <div class="search-result-title"><i class='bx ${item.icon}'></i> ${item.name}</div>
                        <div class="search-result-subtitle">${item.type}</div>
                    </div>
                `;
            });
            html += '</div>';
        }

        if (!hasResults) {
            html = '<div class="search-no-results"><i class="bx bx-search" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>No results found</div>';
        }

        searchResults.innerHTML = html;
        searchResults.style.display = 'block';
    }

    // Close results when clicking outside
    document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });

    // Close results on Escape key
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            searchResults.style.display = 'none';
            searchInput.blur();
        }
    });
})();
