// ===== Script Acid - Fő Szkript (Javított, Teljes Verzió) =====

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
    initializeAuth(); // Ez a funkció most már csak elindítja a folyamatot
    initializeStoryModals();
    initializeUsePromptButtons();
    initializeGalleryCopyButtons();
    initializeCusdis();

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
    if (typeof initializeGlossaryExpert === 'function') initializeGlossaryExpert();
    if (typeof initializePillarNav === 'function') initializePillarNav();

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

    // GoatCounter vizuális számláló indítása
    if (typeof displayGoatCounterHits === 'function') {
        window.addEventListener('load', displayGoatCounterHits);
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
            window.location.reload();
        });
    }
}

// =======================================================
// ===== CUSDIS VENDÉGKÖNYV KEZELÉSE (VÉGLEGES KÓD) =====
// =======================================================

function initializeCusdis() {
    const container = document.getElementById('cusdis_thread');
    if (!container) return;

    const theme = localStorage.getItem('theme') || 'dark';
    const lang = localStorage.getItem('preferredLanguage') || 'en';

    container.setAttribute('data-host', "https://cusdis.com");
    container.setAttribute('data-app-id', "aee00228-8446-4e36-ab21-e793fae2519c");
    container.setAttribute('data-page-id', "homepage-guestbook");
    container.setAttribute('data-page-url', "https://aliceinbp.com/");
    container.setAttribute('data-page-title', "Vendégkönyv");
    container.setAttribute('data-theme', theme);

    const cusdisScript = document.createElement('script');
    cusdisScript.defer = true;
    cusdisScript.src = 'https://cusdis.com/js/cusdis.es.js';
    document.body.appendChild(cusdisScript);

    if (lang === 'hu') {
        const langScript = document.createElement('script');
        langScript.defer = true;
        langScript.src = 'https://cusdis.com/js/widget/lang/hu.js';
        document.body.appendChild(langScript);
    }
}

function updateCusdisTheme(theme) {
    const cusdisContainer = document.getElementById('cusdis_thread');
    if (cusdisContainer) {
        cusdisContainer.setAttribute('data-theme', theme);
    }

    const cusdisFrame = document.querySelector('#cusdis_thread iframe');
    if (cusdisFrame && cusdisFrame.contentWindow) {
        cusdisFrame.contentWindow.postMessage({
            type: 'setTheme',
            theme: theme
        }, 'https://cusdis.com');
    }
}

// =======================================================
// ===== GOATCOUNTER KEZELÉSE =====
// =======================================================

function displayGoatCounterHits() {
    let attempts = 0;
    const interval = setInterval(function() {
        attempts++;
        if (window.goatcounter && window.goatcounter.data) {
            clearInterval(interval);
            const counterSpan = document.querySelector('span[data-goatcounter-display="hits"]');
            if (counterSpan) {
                counterSpan.textContent = window.goatcounter.data.hits;
            }
        }
        if (attempts > 50) {
            clearInterval(interval);
            const counterSpan = document.querySelector('span[data-goatcounter-display="hits"]');
            if (counterSpan && counterSpan.textContent === '...') {
                counterSpan.textContent = '-';
            }
        }
    }, 100);
}


// =======================================================
// ===== EGYÉB ÁLTALÁNOS FUNKCIÓK =====
// =======================================================

window.setLanguage = function(lang) {
    localStorage.setItem('preferredLanguage', lang);
    
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
                const keyBase = modalId.replace('-modal', '');
                const titleKey = `${keyBase}ModalTitle`;
                const textKey = `${keyBase}ModalText`;
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

function initializeModalSystem() {
    const overlay = document.getElementById('modal-overlay');
    const allModals = document.querySelectorAll('.modal');
    const mainInfoButton = document.getElementById('info-button');
    const mainInfoModal = document.getElementById('info-modal');

    function closeModalWindows() {
        allModals.forEach(modal => modal.classList.add('hidden'));
        if (overlay) overlay.classList.add('hidden');
    }

    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', closeModalWindows);
    });

    if (overlay) {
        overlay.addEventListener('click', closeModalWindows);
    }

    if (mainInfoButton && mainInfoModal) {
        mainInfoButton.addEventListener('click', () => {
            if(overlay) overlay.classList.remove('hidden');
            mainInfoModal.classList.remove('hidden');
        });
    }
}

// =======================================================
// ===== NETLIFY IDENTITY & AUTHENTIKÁCIÓS RENDSZER =====
// =======================================================

function initializeAuth() {
  if (typeof netlifyIdentity === 'undefined') {
    console.error('Netlify Identity widget not found. Make sure the script is included in your HTML.');
    return;
  }

  const loginButtonContainer = document.createElement('div');
  loginButtonContainer.id = 'login-status-container';
  const headerTopRow = document.getElementById('header-top-row');

  if (headerTopRow && headerTopRow.firstChild) {
    headerTopRow.insertBefore(loginButtonContainer, headerTopRow.children[1]);
    updateLoginState(netlifyIdentity.currentUser());
  }

  netlifyIdentity.on('login', user => {
    updateLoginState(user);
    netlifyIdentity.close();
  });

  netlifyIdentity.on('logout', () => {
    updateLoginState(null);
  });

  netlifyIdentity.on('error', err => console.error('Netlify Identity Error:', err));

  document.addEventListener('click', function(e) {
    if (e.target.id === 'login-btn') {
      netlifyIdentity.open('login');
    }
    if (e.target.id === 'signup-btn') {
      netlifyIdentity.open('signup');
    }
    if (e.target.id === 'logout-btn') {
      netlifyIdentity.logout();
    }
  });
}

function updateLoginState(user) {
  const container = document.getElementById('login-status-container');
  if (!container) return;

  const lang = localStorage.getItem('preferredLanguage') || 'en';

  if (user) {
    const userName = user.user_metadata?.full_name || user.email.split('@')[0];
    container.innerHTML = `
      <div class="user-info">
        <span>${userName}</span>
        <button id="logout-btn" class="utility-btn">${translations[lang].logoutBtn || 'Logout'}</button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button id="login-btn" class="utility-btn">${translations[lang].loginBtn || 'Login'}</button>
      <button id="signup-btn" class="utility-btn primary">${translations[lang].signupBtn || 'Sign Up'}</button>
    `;
  }
  
  const saveRecipeBtn = document.getElementById('save-recipe-btn');
  const loadRecipeBtn = document.getElementById('load-recipe-btn');

  if (saveRecipeBtn && loadRecipeBtn) {
    if (user) {
      saveRecipeBtn.disabled = false;
      loadRecipeBtn.disabled = false;
      saveRecipeBtn.title = '';
      loadRecipeBtn.title = '';
    } else {
      const tooltipText = translations[lang].recipeLoginTooltip || 'Login to use this feature';
      saveRecipeBtn.disabled = true;
      loadRecipeBtn.disabled = true;
      saveRecipeBtn.title = tooltipText;
      loadRecipeBtn.title = tooltipText;
    }
  }
}
// ===== NAPI LIMIT SZÁMLÁLÓ RENDSZER =====
function canUseTool(toolType) {
  const user = netlifyIdentity.currentUser();
  if (user) return true;

  const today = new Date().toISOString().split('T')[0];
  let usage = JSON.parse(localStorage.getItem('dailyUsage')) || {};
  // Ha új nap van, minden számlálót nullázunk.
  if (usage.date !== today) {
        usage = { 
            date: today, 
            generatorCount: 0, 
            dmHelperCount: 0, 
            charCreatorCount: 0,
            promptDoctorCount: 0,
            commHelperCount: 0,
            giftHelperCount: 0 
        };
}
  // Itt vannak az egyedi limitek minden eszközhöz.
  const limits = {
        generator: 10,
        dmHelper: 1,
        charCreator: 1,
        promptDoctor: 1,
        commHelper: 1,
        giftHelper: 5 // <--- 2. ADD HOZZÁ EZT A SORT (itt 5-re állítottam a napi limitet)
    };
  const countKey = `${toolType}Count`;
  const currentCount = usage[countKey] || 0;
  const limit = limits[toolType];
  // Hibakezelés, ha ismeretlen eszközt kapnánk.
  if (limit === undefined) {
      console.error(`Ismeretlen eszköz a limithez: ${toolType}`);
      return true; 
  }

  if (currentCount < limit) {
    usage[countKey] = (usage[countKey] || 0) + 1;
    localStorage.setItem('dailyUsage', JSON.stringify(usage));
    return true;
  } else {
    return false;
  }
}

function showLimitModal() {
  const lang = localStorage.getItem('preferredLanguage') || 'en';
  
  if (!document.getElementById('limit-modal')) {
      const modalHTML = `
        <div id="limit-modal" class="modal hidden">
            <button class="close-modal-btn"><i class="fa-solid fa-xmark"></i></button>
            <h2 data-key="limitModalTitle"></h2>
            <p data-key="limitModalText"></p>
            <div id="limit-modal-buttons" style="display: flex; gap: 10px; margin-top: 20px;">
                <button id="limit-login-btn" class="cta-button" style="flex: 1;"></button>
                <button id="limit-signup-btn" class="cta-button" style="flex: 1;"></button>
            </div>
        </div>`;
      document.body.insertAdjacentHTML('beforeend', modalHTML);

      document.getElementById('limit-login-btn').addEventListener('click', () => netlifyIdentity.open('login'));
      document.getElementById('limit-signup-btn').addEventListener('click', () => netlifyIdentity.open('signup'));
      document.getElementById('limit-modal').querySelector('.close-modal-btn').addEventListener('click', () => {
          document.getElementById('modal-overlay').classList.add('hidden');
          document.getElementById('limit-modal').classList.add('hidden');
      });
  }
  
  const modal = document.getElementById('limit-modal');
  modal.querySelector('[data-key="limitModalTitle"]').textContent = translations[lang].limitModalTitle;
  modal.querySelector('[data-key="limitModalText"]').textContent = translations[lang].limitModalText;
  modal.querySelector('#limit-login-btn').textContent = translations[lang].loginBtn;
  modal.querySelector('#limit-signup-btn').textContent = translations[lang].signupBtn;

  document.getElementById('modal-overlay').classList.remove('hidden');
  modal.classList.remove('hidden');
}