// Random Verse of the Day - Changes every 12 hours
// Picks from entire Quran using time-based seed

(function () {
    // Total number of ayahs in Quran (approximately 6236)
    // We'll create a simplified random picker based on surah:ayah pairs

    const QURAN_AYAH_COUNTS = [
        7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99,
        128, 111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60,
        34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38,
        29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18,
        12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29,
        19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 5, 19, 5, 8, 8,
        11, 11, 8, 3, 9, 5, 4, 6, 3, 6, 3, 5, 4, 5, 6
    ];

    // Get 12-hour period index (changes every 12 hours)
    function get12HourPeriod() {
        const now = Date.now();
        const twelveHoursMs = 12 * 60 * 60 * 1000;
        return Math.floor(now / twelveHoursMs);
    }

    // Seeded random number generator
    function seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    // Get random surah and ayah based on current 12-hour period
    function getRandomVerse() {
        const period = get12HourPeriod();

        // Use period as seed for random surah
        const surahIndex = Math.floor(seededRandom(period) * QURAN_AYAH_COUNTS.length);
        const surahNumber = surahIndex + 1;
        const ayahCount = QURAN_AYAH_COUNTS[surahIndex];

        // Use period + surah as seed for random ayah
        const ayahNumber = Math.floor(seededRandom(period + surahNumber) * ayahCount) + 1;

        return {
            surah: surahNumber,
            ayah: ayahNumber,
            ayahCount: ayahCount
        };
    }

    // Fetch verse from API
    async function fetchRandomVerse() {
        const verse = getRandomVerse();

        try {
            // Fetch Arabic text
            const arabicResponse = await fetch(`https://api.alquran.cloud/v1/ayah/${verse.surah}:${verse.ayah}/ar.alafasy`);
            const arabicData = await arabicResponse.json();

            // Fetch English translation
            const englishResponse = await fetch(`https://api.alquran.cloud/v1/ayah/${verse.surah}:${verse.ayah}/en.asad`);
            const englishData = await englishResponse.json();

            if (arabicData.code === 200 && englishData.code === 200) {
                const ayahData = arabicData.data;
                const transData = englishData.data;

                return {
                    ayah: {
                        text: ayahData.text,
                        trans: transData.text,
                        ref: `Surah ${ayahData.surah.englishName} ${verse.surah}:${verse.ayah}`
                    },
                    meta: {
                        surah_id: verse.surah,
                        ayah_id: verse.ayah,
                        audio: `https://everyayah.com/data/Alafasy_128kbps/${String(verse.surah).padStart(3, '0')}${String(verse.ayah).padStart(3, '0')}.mp3`
                    }
                };
            }
        } catch (error) {
            console.error('Failed to fetch random verse:', error);
            // Fallback to default verse
            return null;
        }

        return null;
    }

    // Override the daily feed rendering with random verse
    window.renderRandomVerse = async function () {
        const heroArabic = document.getElementById('hero-arabic');
        const heroTrans = document.getElementById('hero-translation');
        const heroReadBtn = document.getElementById('hero-read-btn');
        const heroListenBtn = document.getElementById('hero-listen-btn');

        const ayahBody = document.getElementById('daily-ayah-body');
        const ayahRef = document.getElementById('ayah-ref');

        // Show loading state
        if (heroArabic) heroArabic.textContent = 'جاري التحميل...';
        if (heroTrans) heroTrans.textContent = 'Loading verse...';

        const verseData = await fetchRandomVerse();

        if (verseData) {
            // Update hero section
            if (heroArabic) heroArabic.textContent = verseData.ayah.text;
            if (heroTrans) heroTrans.textContent = `"${verseData.ayah.trans}" - ${verseData.ayah.ref}`;

            if (heroReadBtn) {
                heroReadBtn.href = `quran.html?surah=${verseData.meta.surah_id}`;
            }

            if (heroListenBtn) {
                heroListenBtn.onclick = (e) => {
                    e.preventDefault();
                    if (window.playAyahOneShot) {
                        window.playAyahOneShot(verseData.meta.audio);
                    }
                };
            }

            // Update daily ayah card
            if (ayahBody) {
                ayahBody.innerHTML = `
                    <div class="ar-text" style="font-family:'Amiri', serif; font-size:1.5rem; text-align:center; color:#1e293b; margin-bottom:0.5rem; padding-top:1rem;">${verseData.ayah.text}</div>
                    <div class="en-text" style="font-size:0.95rem; color:#475569; text-align:center; line-height:1.6;">${verseData.ayah.trans}</div>
                `;
            }

            if (ayahRef) {
                ayahRef.textContent = verseData.ayah.ref;
            }
        } else {
            // Keep fallback/loading text
            console.log('Using fallback verse');
        }
    };

    // Auto-run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', window.renderRandomVerse);
    } else {
        window.renderRandomVerse();
    }

    console.log('Random Verse of the Day initialized - changes every 12 hours');
})();
