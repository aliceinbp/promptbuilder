// js/challenge-page.js (ÚJ, TEMATIKUS VERZIÓ)

document.addEventListener('DOMContentLoaded', () => {
    initializeChallengePage();
});

function initializeChallengePage() {
    // Rövid várakozás, hogy a netlifyIdentity biztosan betöltsön
    setTimeout(() => {
        const user = netlifyIdentity.currentUser();
        const content = document.getElementById('challenge-content');

        if (!user && content) {
            // Ha a felhasználó nincs bejelentkezve, a szokásos üzenetet mutatjuk
            const lang = localStorage.getItem('preferredLanguage') || 'en';
            content.innerHTML = `
                <div class="daily-feature-box" style="text-align: center;">
                    <h2 data-key="loginRequiredTitle"></h2>
                    <p data-key="loginRequiredText"></p>
                    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                        <button onclick="netlifyIdentity.open('login')" class="cta-button-small" data-key="loginBtn"></button>
                        <button onclick="netlifyIdentity.open('signup')" class="cta-button-small" data-key="signupBtn"></button>
                    </div>
                </div>
            `;
            if (window.setLanguage) {
                window.setLanguage(lang);
            }
        } else {
            // Ha a felhasználó be van jelentkezve, betöltjük a havi témát
            loadMonthlyTheme();
        }
    }, 100);
}

async function loadMonthlyTheme() {
    const titleEl = document.getElementById('theme-title');
    const descEl = document.getElementById('theme-description');
    const linkContainer = document.getElementById('theme-blog-link-container');

    if (!titleEl || !descEl || !linkContainer) return;

    try {
        const response = await fetch('/_data/themes.json');
        if (!response.ok) throw new Error('Themes data not found');
        const themes = await response.json();
        
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        const currentMonthIndex = new Date().getMonth(); // 0-tól 11-ig adja a hónapokat
        const currentTheme = themes[currentMonthIndex];

        if (currentTheme) {
            titleEl.textContent = (lang === 'hu') ? currentTheme.name_hu : currentTheme.name_en;
            descEl.textContent = (lang === 'hu') ? currentTheme.desc_hu : currentTheme.desc_en;

            // Blog link kezelése
            if (currentTheme.blogLink) {
                linkContainer.innerHTML = `<a href="${currentTheme.blogLink}" class="cta-button-small" target="_blank" data-key="blogLinkText"></a>`;
            } else {
                linkContainer.innerHTML = `<span class="form-hint" data-key="blogLinkComingSoon"></span>`;
            }
            // Frissítjük a data-key-es szövegeket a linken/szövegen
            if (window.setLanguage) {
                window.setLanguage(lang);
            }
        } else {
            titleEl.textContent = 'Hiba';
            descEl.textContent = 'Az aktuális havi téma nem található.';
        }

    } catch (error) {
        console.error("Error loading monthly theme:", error);
        titleEl.textContent = 'Hiba';
        descEl.textContent = 'A havi témák betöltése sikertelen volt.';
    }
}