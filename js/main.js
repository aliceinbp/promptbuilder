// ===== Alkimista Műhely - Fő Szkript (main.js) - JAVÍTOTT =====

document.addEventListener('DOMContentLoaded', function() {
    // --- INICIALIZÁLÁS ---
    const initialTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(initialTheme);

    const currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
    window.setLanguage(currentLanguage);

    // --- ÁLTALÁNOS ESEMÉNYKEZELŐK ---
    initializeThemeToggle();
    initializeLanguageSwitcher();
    initializeModalSystem();
    initializeBackToTopButton();
    initializeStoryModals();
    initializeUsePromptButtons();
    initializeGalleryCopyButtons(); // ÚJ FUNKCIÓ HOZZÁADVA
    observeCusdis();

    // --- Oldal-specifikus funkciók meghívása ---
    if (typeof loadArtists === 'function') loadArtists();
    if (typeof loadGallery === 'function') loadGallery();
    if (typeof loadDailyPrompt === 'function') loadDailyPrompt();
    if (typeof loadDailyArtist === 'function') loadDailyArtist();
    if (typeof loadBlogPosts === 'function') loadBlogPosts();
    if (typeof loadSinglePost === 'function') loadSinglePost();
    if (typeof displayDailyQuote === 'function') displayDailyQuote();
    if (typeof loadSubmissions === 'function') loadSubmissions();
    if (typeof initializeAccordions === 'function') initializeAccordions();
    if (typeof initializeExplainers === 'function') initializeExplainers();
    if (typeof initializePromptAnatomy === 'function') initializePromptAnatomy();
    if (typeof initializeStyleFinder === 'function') initializeStyleFinder();
    if (typeof initializeQuiz === 'function') initializeQuiz();
    if (typeof initializeChallengePage === 'function') initializeChallengePage();

    // Pagefind kereső inicializálása
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

window.setLanguage = function(lang) {
    localStorage.setItem('preferredLanguage', lang);
    
    // Oldalcím frissítése
    const pageTitleElement = document.querySelector('title[data-key]');
    if (pageTitleElement) {
        const titleKey = pageTitleElement.dataset.key;
        if (typeof translations !== 'undefined' && translations[lang] && translations[lang][titleKey]) {
            document.title = translations[lang][titleKey];
        }
    }

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
    
    if (typeof populateSelectOptions === 'function') { 
        populateSelectOptions(lang); 
    }
    
    if (typeof updateDownloadLink === 'function') { 
        updateDownloadLink(lang); 
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

function initializeGalleryCopyButtons() {
    document.body.addEventListener('click', function(e) {
        const target = e.target.closest('.copy-prompt-btn');
        if (target) {
            e.preventDefault();
            e.stopPropagation();
            const promptToCopy = target.dataset.prompt;
            if (promptToCopy) {
                navigator.clipboard.writeText(promptToCopy).then(() => {
                    const originalKey = target.dataset.key;
                    const lang = localStorage.getItem('preferredLanguage') || 'en';
                    target.textContent = translations[lang].copyButtonSuccess;
                    setTimeout(() => {
                        target.textContent = translations[lang][originalKey];
                    }, 1500);
                });
            }
        }
    });
}
function initializeStoryModals() {
    const storyCards = document.querySelectorAll('.story-card');
    if (storyCards.length === 0) return;

    const overlay = document.getElementById('modal-overlay');

    storyCards.forEach(card => {
        const modalId = card.dataset.modalTarget;
        const modal = document.getElementById(modalId);
        if (modal) {
            card.addEventListener('click', () => {
                const lang = localStorage.getItem('preferredLanguage') || 'en';
                
                // === EZ A RÉSZ LETT JAVÍTVA ===
                const keyBase = modalId.replace('-modal', ''); // pl. "philosophy-modal" -> "philosophy"
                const titleKey = `${keyBase}ModalTitle`;     // "philosophy" -> "philosophyModalTitle"
                const textKey = `${keyBase}ModalText`;       // "philosophy" -> "philosophyModalText"
                // ===============================
                
                const titleElem = modal.querySelector('h2');
                const textElem = modal.querySelector('p');

                if (translations[lang] && titleElem && textElem) {
                    titleElem.textContent = translations[lang][titleKey];
                    textElem.textContent = translations[lang][textKey];
                }

                overlay.classList.remove('hidden');
                modal.classList.remove('hidden');
            });
        }
    });
}
// ===== KÖZPONTI MODÁLIS ABLAK KEZELŐ RENDSZER =====
function initializeModalSystem() {
    const overlay = document.getElementById('modal-overlay');
    const allModals = document.querySelectorAll('.modal');
    const mainInfoButton = document.getElementById('info-button');
    const mainInfoModal = document.getElementById('info-modal');

    // Ez a függvény zár be minden ablakot
    function closeModalWindows() {
        allModals.forEach(modal => modal.classList.add('hidden'));
        if (overlay) overlay.classList.add('hidden');
    }

    // 1. Ráteszi a bezárás funkciót AZ ÖSSZES 'X' gombra
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', closeModalWindows);
    });

    // 2. A háttérre kattintva is bezáródik minden
    if (overlay) {
        overlay.addEventListener('click', closeModalWindows);
    }

    // 3. A fejlécben lévő fő 'Névjegy' (?) gombot kezeli
    if (mainInfoButton && mainInfoModal) {
        mainInfoButton.addEventListener('click', () => {
            if(overlay) overlay.classList.remove('hidden');
            mainInfoModal.classList.remove('hidden');
        });
    }
}
// ===== GoatCounter Vizuális Számláló Frissítésének Biztosítása =====
window.addEventListener('load', function() {
    if (window.goatcounter && window.goatcounter.visit_count) {
        window.goatcounter.visit_count({
            append: '.goatcounter-display', // Ez a mi div-ünk a HTML-ben
            type: 'html'
        });
    }
});