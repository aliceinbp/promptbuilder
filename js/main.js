// ===== Alkimista Műhely - Fő Szkript (main.js) =====
// Ez a fájl tartalmazza az összes oldalon használt közös funkciókat.

document.addEventListener('DOMContentLoaded', function() {
    // --- INICIALIZÁLÁS ---
    const initialTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(initialTheme);

    const currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
    window.setLanguage(currentLanguage);

    // --- ÁLTALÁNOS ESEMÉNYKEZELŐK ---
    initializeThemeToggle();
    initializeLanguageSwitcher();
    initializeInfoModal();
    initializeBackToTopButton();
    initializeUsePromptButtons();
    observeCusdis(); // A Cusdis komment motorhoz

    // --- Oldal-specifikus funkciók meghívása a központi helyről ---
    // A data-loaders.js és interactive-pages.js fájlokban lévő funkciókat hívjuk meg itt.
    // Maguk a funkciók már "védekezőek", így nem okoznak hibát, ha nincs meg a szükséges elem.
    
    // data-loaders.js funkciói
    if (typeof loadArtists === 'function') loadArtists();
    if (typeof loadGallery === 'function') loadGallery();
    if (typeof loadDailyPrompt === 'function') loadDailyPrompt();
    if (typeof loadDailyArtist === 'function') loadDailyArtist();
    if (typeof loadBlogPosts === 'function') loadBlogPosts();
    if (typeof loadSinglePost === 'function') loadSinglePost();
    if (typeof displayDailyQuote === 'function') displayDailyQuote();
    if (typeof loadSubmissions === 'function') loadSubmissions();

    // interactive-pages.js funkciói
    if (typeof initializeAccordions === 'function') initializeAccordions();
    if (typeof initializeExplainers === 'function') initializeExplainers();
    if (typeof initializePromptAnatomy === 'function') initializePromptAnatomy();
    if (typeof initializeStyleFinder === 'function') initializeStyleFinder();
    if (typeof initializeQuiz === 'function') initializeQuiz();
    if (typeof initializeChallengePage === 'function') initializeChallengePage();


    // Pagefind kereső inicializálása
    // A Pagefind szkriptje maga kezeli a saját logikáját, itt csak meghívjuk.
    if (typeof PagefindUI !== 'undefined' && document.getElementById('search')) {
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        new PagefindUI({
            element: "#search",
            showSubResults: true,
            translations: {
                placeholder: translations[lang].searchPlaceholder,
                clear_search: translations[lang].searchClear,
                load_more: translations[lang].searchLoadMore,
                search_label: translations[lang].searchLabel,
                results_count: (data) => translations[lang].searchResults.replace('{count}', data.count),
            }
        });
    }
});


// ====================================================================
// ===== TÉMAVÁLTÁS LOGIKA =====
// ====================================================================
function applyTheme(theme) {
    const logo = document.getElementById('logo');
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('theme-toggle').innerHTML = '<i class="fa-solid fa-moon"></i>';
        if (logo) logo.src = 'src/myLogolight.jpg';
    } else {
        document.body.classList.remove('light-theme');
        document.getElementById('theme-toggle').innerHTML = '<i class="fa-solid fa-sun"></i>';
        if (logo) logo.src = 'src/myLogo.jpg';
    }
    updateCusdisTheme(theme);
}

function initializeThemeToggle() {
    const themeToggleButton = document.getElementById('theme-toggle');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            let newTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }
}

function updateCusdisTheme(theme) {
    const cusdisFrame = document.querySelector('#cusdis_thread iframe');
    if (cusdisFrame) {
        setTimeout(() => {
            cusdisFrame.contentWindow.postMessage({ type: 'setTheme', theme: theme === 'light' ? 'light' : 'dark' }, 'https://cusdis.com');
        }, 200);
    }
}

function observeCusdis() {
    const cusdisContainer = document.getElementById('cusdis_thread');
    if (!cusdisContainer) return;
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && cusdisContainer.querySelector('iframe')) {
                const storedTheme = localStorage.getItem('theme') || 'dark';
                updateCusdisTheme(storedTheme);
                observer.disconnect();
                return;
            }
        }
    });
    observer.observe(cusdisContainer, { childList: true, subtree: true });
}

// ====================================================================
// ===== NYELVKEZELÉS LOGIKA =====
// ====================================================================
window.setLanguage = function(lang) {
    localStorage.setItem('preferredLanguage', lang);
    
    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.dataset.key;
        if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
            elem.textContent = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-key-title]').forEach(elem => {
        const key = elem.dataset.keyTitle;
        if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
            elem.setAttribute('title', translations[lang][key]);
        }
    });

    document.querySelectorAll('[data-key-placeholder]').forEach(elem => {
        const key = elem.dataset.keyPlaceholder;
        if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
            elem.setAttribute('placeholder', translations[lang][key]);
        }
    });
    
    const langHu = document.getElementById('lang-hu');
    const langEn = document.getElementById('lang-en');
    if (langHu && langEn) {
        langHu.classList.toggle('active', lang === 'hu');
        langEn.classList.toggle('active', lang === 'en');
    }
};

function initializeLanguageSwitcher() {
    const langHu = document.getElementById('lang-hu');
    const langEn = document.getElementById('lang-en');
    if (langHu && langEn) {
        langHu.addEventListener('click', (e) => { e.preventDefault(); if (localStorage.getItem('preferredLanguage') !== 'hu') { window.setLanguage('hu'); window.location.reload(); } });
        langEn.addEventListener('click', (e) => { e.preventDefault(); if (localStorage.getItem('preferredLanguage') !== 'en') { window.setLanguage('en'); window.location.reload(); } });
    }
}

// ====================================================================
// ===== ÁLTALÁNOS MODÁLIS ABLAK LOGIKA =====
// ====================================================================
function initializeInfoModal() {
    const overlay = document.getElementById('modal-overlay');
    const allModals = document.querySelectorAll('.modal');
    const infoModal = document.getElementById('info-modal');
    const infoButton = document.getElementById('info-button');

    function closeModalWindows() {
        allModals.forEach(modal => modal.classList.add('hidden'));
        if (overlay) overlay.classList.add('hidden');
    }

    if (infoButton && infoModal && overlay) {
        const closeInfoModalBtn = infoModal.querySelector('.close-modal-btn');
        infoButton.addEventListener('click', () => {
            overlay.classList.remove('hidden');
            infoModal.classList.remove('hidden');
        });
        if(closeInfoModalBtn) closeInfoModalBtn.addEventListener('click', closeModalWindows);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeModalWindows);
    }
}

// ====================================================================
// ===== "VISSZA A TETEJÉRE" GOMB LOGIKA =====
// ====================================================================
function initializeBackToTopButton() {
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            backToTopButton.classList.toggle('hidden', window.scrollY <= 300);
        });
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ====================================================================
// ===== "PROMPT HASZNÁLATA" GOMB LOGIKA (GALÉRIA) =====
// ====================================================================
function initializeUsePromptButtons() {
    document.body.addEventListener('click', function(e) {
        const target = e.target.closest('.use-prompt-btn');
        if (target) {
            e.preventDefault();
            e.stopPropagation();
            const promptString = target.dataset.prompt;
            if (promptString) {
                localStorage.setItem('promptToLoad', promptString);
                window.location.href = 'generator.html';
            }
        }
    });
}