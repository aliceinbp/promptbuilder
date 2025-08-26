// ===== Alkimista Műhely - Fő Szkript (main.js) =====
// Ez a fájl tartalmazza az összes oldalon használt közös funkciókat.

document.addEventListener('DOMContentLoaded', function() {
    // --- INICIALIZÁLÁS ---
    const initialTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(initialTheme);

    const currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
    window.setLanguage(currentLanguage);

    // Oldal-specifikus funkciók meghívása (ezek a többi .js fájlból jönnek)
    if (document.querySelector('.final-prompt-section')) {
        initializeGeneratorLogic();
    }
    if (document.querySelector('.artist-grid')) {
        loadArtists();
    }
    if (document.getElementById('gallery-section')) {
        loadGallery();
    }
    if (document.getElementById('daily-prompt-section')) {
        loadDailyPrompt();
    }
    if (document.getElementById('daily-artist-section')) {
        loadDailyArtist();
    }
    if (document.getElementById('blog-posts-container')) {
        loadBlogPosts();
    }
    if (document.getElementById('post-content-container')) {
        loadSinglePost();
    }
    if (document.getElementById('daily-quote-container')) {
        displayDailyQuote();
    }
     if (document.getElementById('cusdis_thread')) {
        observeCusdis();
    }
    if (document.getElementById('submission-gallery-grid')) {
        loadSubmissions();
    }
    if (document.getElementById('prompt-anatomy')) {
        initializePromptAnatomy();
    }
    if (document.getElementById('style-finder-container')) {
        initializeStyleFinder();
    }
    if (document.getElementById('quiz-container')) {
        initializeQuiz();
    }
    if (document.querySelector('.accordion')) {
        initializeAccordions();
    }
     if (document.querySelector('.explainer-icon')) {
        initializeExplainers();
    }

    // Pagefind inicializálása a nyelvváltás után
    window.initializePagefind(); 
});


// ====================================================================
// ===== TÉMAVÁLTÁS LOGIKA =====
// ====================================================================
const themeToggleButton = document.getElementById('theme-toggle');

function applyTheme(theme) {
    const logo = document.getElementById('logo');
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        if (themeToggleButton) themeToggleButton.innerHTML = '<i class="fa-solid fa-moon"></i>';
        if (logo) logo.src = 'src/myLogolight.jpg';
    } else {
        document.body.classList.remove('light-theme');
        if (themeToggleButton) themeToggleButton.innerHTML = '<i class="fa-solid fa-sun"></i>';
        if (logo) logo.src = 'src/myLogo.jpg';
    }
    updateCusdisTheme(theme);
}

function updateCusdisTheme(theme) {
    const cusdisFrame = document.querySelector('#cusdis_thread iframe');
    if (cusdisFrame) {
        setTimeout(() => {
            cusdisFrame.contentWindow.postMessage({ type: 'setTheme', theme: theme }, 'https://cusdis.com');
        }, 100);
    }
}
function observeCusdis() {
    const cusdisContainer = document.getElementById('cusdis_thread');
    if (!cusdisContainer) return;
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && cusdisContainer.querySelector('iframe')) {
                const storedTheme = localStorage.getItem('theme') || 'dark';
                applyTheme(storedTheme);
                observer.disconnect();
                return;
            }
        }
    });
    observer.observe(cusdisContainer, { childList: true, subtree: true });
}

if (themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        let newTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
}


// ====================================================================
// ===== NYELVKEZELÉS LOGIKA =====
// ====================================================================
let currentLanguage = localStorage.getItem('preferredLanguage') || 'en';

window.setLanguage = function(lang) {
    currentLanguage = lang;
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

    if (typeof initializeGeneratorLogic === 'function') { // Ha a generátor oldalon vagyunk, frissítjük a lenyílókat
        initializeChoices();
    }
};

const langHu = document.getElementById('lang-hu');
const langEn = document.getElementById('lang-en');
if (langHu && langEn) {
    langHu.addEventListener('click', (e) => { e.preventDefault(); window.setLanguage('hu'); window.location.reload(); });
    langEn.addEventListener('click', (e) => { e.preventDefault(); window.setLanguage('en'); window.location.reload(); });
}

window.initializePagefind = () => {
    if (typeof PagefindUI !== 'undefined' && document.getElementById('search')) {
        new PagefindUI({
            element: "#search",
            showSubResults: true,
            translations: {
                placeholder: translations[currentLanguage].searchPlaceholder,
                clear_search: translations[currentLanguage].searchClear,
                load_more: translations[currentLanguage].searchLoadMore,
                search_label: translations[currentLanguage].searchLabel,
                results_count: (data) => translations[currentLanguage].searchResults.replace('{count}', data.count),
            }
        });
    }
};

// ====================================================================
// ===== ÁLTALÁNOS MODÁLIS ABLAK LOGIKA =====
// ====================================================================
const overlay = document.getElementById('modal-overlay');
const allModals = document.querySelectorAll('.modal');

function closeModalWindows() {
    allModals.forEach(modal => modal.classList.add('hidden'));
    if (overlay) overlay.classList.add('hidden');
}

const infoModal = document.getElementById('info-modal');
const infoButton = document.getElementById('info-button');
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


// ====================================================================
// ===== "VISSZA A TETEJÉRE" GOMB LOGIKA =====
// ====================================================================
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

// ====================================================================
// ===== "PROMPT HASZNÁLATA" GOMB LOGIKA =====
// ====================================================================
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