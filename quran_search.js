// Quran Page Search Functionality
// Context-aware: Search surahs in list view, search ayahs in surah view

(function () {
    const searchInput = document.getElementById('global-search-input');
    const searchResults = document.getElementById('search-results');

    if (!searchInput || !searchResults) {
        console.log('Quran search: elements not found');
        return;
    }

    // Surah names for searching
    const SURAH_NAMES = [
        { number: 1, name: "Al-Fatihah", translation: "The Opening" },
        { number: 2, name: "Al-Baqarah", translation: "The Cow" },
        { number: 3, name: "Ali 'Imran", translation: "Family of Imran" },
        { number: 4, name: "An-Nisa", translation: "The Women" },
        { number: 5, name: "Al-Ma'idah", translation: "The Table Spread" },
        { number: 6, name: "Al-An'am", translation: "The Cattle" },
        { number: 7, name: "Al-A'raf", translation: "The Heights" },
        { number: 8, name: "Al-Anfal", translation: "The Spoils of War" },
        { number: 9, name: "At-Tawbah", translation: "The Repentance" },
        { number: 10, name: "Yunus", translation: "Jonah" },
        { number: 11, name: "Hud", translation: "Hud" },
        { number: 12, name: "Yusuf", translation: "Joseph" },
        { number: 13, name: "Ar-Ra'd", translation: "The Thunder" },
        { number: 14, name: "Ibrahim", translation: "Abraham" },
        { number: 15, name: "Al-Hijr", translation: "The Rocky Tract" },
        { number: 16, name: "An-Nahl", translation: "The Bee" },
        { number: 17, name: "Al-Isra", translation: "The Night Journey" },
        { number: 18, name: "Al-Kahf", translation: "The Cave" },
        { number: 19, name: "Maryam", translation: "Mary" },
        { number: 20, name: "Taha", translation: "Taha" },
        { number: 21, name: "Al-Anbya", translation: "The Prophets" },
        { number: 22, name: "Al-Hajj", translation: "The Pilgrimage" },
        { number: 23, name: "Al-Mu'minun", translation: "The Believers" },
        { number: 24, name: "An-Nur", translation: "The Light" },
        { number: 25, name: "Al-Furqan", translation: "The Criterion" },
        { number: 26, name: "Ash-Shu'ara", translation: "The Poets" },
        { number: 27, name: "An-Naml", translation: "The Ant" },
        { number: 28, name: "Al-Qasas", translation: "The Stories" },
        { number: 29, name: "Al-'Ankabut", translation: "The Spider" },
        { number: 30, name: "Ar-Rum", translation: "The Romans" },
        { number: 67, name: "Al-Mulk", translation: "The Sovereignty" },
        { number: 78, name: "An-Naba", translation: "The Tidings" },
        { number: 112, name: "Al-Ikhlas", translation: "The Sincerity" },
        { number: 113, name: "Al-Falaq", translation: "The Daybreak" },
        { number: 114, name: "An-Nas", translation: "Mankind" }
    ];

    let debounceTimer;

    // Check if we're viewing a specific surah
    function getCurrentSurahId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('surah');
    }

    // Search surahs by name or number
    function searchSurahs(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();

        SURAH_NAMES.forEach(surah => {
            if (surah.name.toLowerCase().includes(lowerQuery) ||
                surah.translation.toLowerCase().includes(lowerQuery) ||
                surah.number.toString() === query) {
                results.push(surah);
            }
        });

        return results.slice(0, 10); // Limit to 10 results
    }

    // Search ayahs by number
    function searchAyahs(query, surahId) {
        const ayahNumber = parseInt(query);

        if (!ayahNumber || isNaN(ayahNumber)) {
            return null;
        }

        // Get total ayahs in current surah (you'd need to add this data)
        // For now, we'll just allow the search
        return {
            surahId: surahId,
            ayahNumber: ayahNumber
        };
    }

    // Display surah search results
    function displaySurahResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results"><i class="bx bx-search" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>No surahs found</div>';
            searchResults.style.display = 'block';
            return;
        }

        let html = '<div class="search-category">';
        html += '<div class="search-category-title">📖 Surahs</div>';

        results.forEach(surah => {
            html += `
                <div class="search-result-item" onclick="window.location.href='quran.html?surah=${surah.number}'">
                    <div class="search-result-title">Surah ${surah.number}: ${surah.name}</div>
                    <div class="search-result-subtitle">${surah.translation}</div>
                </div>
            `;
        });

        html += '</div>';
        searchResults.innerHTML = html;
        searchResults.style.display = 'block';
    }

    // Display ayah search result
    function displayAyahResult(result) {
        let html = '<div class="search-category">';
        html += '<div class="search-category-title">🔍 Jump to Ayah</div>';
        html += `
            <div class="search-result-item" onclick="scrollToAyah(${result.ayahNumber})">
                <div class="search-result-title">Go to Ayah ${result.ayahNumber}</div>
                <div class="search-result-subtitle">Click to jump</div>
            </div>
        `;
        html += '</div>';

        searchResults.innerHTML = html;
        searchResults.style.display = 'block';
    }

    // Main search handler
    searchInput.addEventListener('input', function (e) {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();

        if (query.length < 1) {
            searchResults.style.display = 'none';
            return;
        }

        debounceTimer = setTimeout(() => {
            const currentSurah = getCurrentSurahId();

            if (currentSurah) {
                // Viewing a surah - search ayahs
                const result = searchAyahs(query, currentSurah);
                if (result) {
                    displayAyahResult(result);
                } else {
                    searchResults.innerHTML = '<div class="search-no-results">Enter ayah number (e.g., 1, 2, 3...)</div>';
                    searchResults.style.display = 'block';
                }
            } else {
                // Surah list view - search surahs
                const results = searchSurahs(query);
                displaySurahResults(results);
            }
        }, 300);
    });

    // Update placeholder based on current view
    function updatePlaceholder() {
        const currentSurah = getCurrentSurahId();
        if (currentSurah) {
            searchInput.placeholder = 'Search Ayah...';
        } else {
            searchInput.placeholder = 'Search Surahs...';
        }
    }

    // Call on page load
    updatePlaceholder();

    // Scroll to ayah function (accessible globally)
    window.scrollToAyah = function (ayahNumber) {
        // Ayahs are 0-indexed in the DOM (ayah-box-0, ayah-box-1, etc.)
        // So ayah number 1 is ayah-box-0, ayah number 20 is ayah-box-19
        const ayahIndex = ayahNumber - 1;
        const ayahElement = document.getElementById(`ayah-box-${ayahIndex}`);

        if (ayahElement) {
            ayahElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Highlight with golden background
            const originalBg = ayahElement.style.background;
            ayahElement.style.background = 'rgba(251, 191, 36, 0.2)';

            setTimeout(() => {
                ayahElement.style.background = originalBg;
            }, 2000);

            searchResults.style.display = 'none';
            searchInput.value = '';
        } else {
            alert(`Ayah ${ayahNumber} not found. Please make sure the ayah exists in this surah.`);
        }
    };

    // Close results when clicking outside
    document.addEventListener('click', function (e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });

    // Close on Escape and Auto-jump on Enter
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            searchResults.style.display = 'none';
            searchInput.blur();
        }

        // Auto-jump on Enter key
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            const currentSurah = getCurrentSurahId();

            if (currentSurah) {
                // In surah view - jump directly to ayah number
                const ayahNumber = parseInt(query);
                if (ayahNumber && !isNaN(ayahNumber)) {
                    scrollToAyah(ayahNumber);
                }
            } else {
                // In list view - click first result
                const firstResult = searchResults.querySelector('.search-result-item');
                if (firstResult) {
                    firstResult.click();
                }
            }
        }
    });

    console.log('Quran search initialized');
})();
