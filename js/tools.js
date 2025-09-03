// js/tools.js

document.addEventListener('DOMContentLoaded', () => {
    // Csak akkor fusson le, ha a "helper-tools-container" létezik az oldalon
    if (document.getElementById('helper-tools-container')) {
        initializeCommHelper();
    }
});

function initializeCommHelper() {
    const toolContainer = document.getElementById('comm-helper-tool');
    if (!toolContainer) return;

    const input = toolContainer.querySelector('#comm-helper-input');
    const toneButtons = toolContainer.querySelectorAll('.tone-btn');
    const generateBtn = toolContainer.querySelector('#generate-rewrite-btn');
    const outputDiv = toolContainer.querySelector('#comm-helper-output');
    
    let selectedTone = 'formal'; // Alapértelmezett

    // Hangnem-választó gombok logikája
    toneButtons.forEach(button => {
        button.addEventListener('click', () => {
            toneButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedTone = button.dataset.tone;
        });
    });

    // "Átírás" gomb logikája
    generateBtn.addEventListener('click', async () => {
        // 1. Lépés: Limit ellenőrzése
        if (!canUseTool('commHelper')) {
            showLimitModal();
            return;
        }

        const userText = input.value.trim();
        const lang = localStorage.getItem('preferredLanguage') || 'en';

        if (!userText) {
            outputDiv.innerHTML = `<p style="color: #ff6b6b;">${translations[lang].expertErrorEmpty || 'Please enter some text to rewrite!'}</p>`;
            return;
        }

        // 2. Lépés: Felület előkészítése a generálásra
        outputDiv.innerHTML = `<div class="spinner" style="margin: 20px auto;"></div>`;
        generateBtn.disabled = true;

        // 3. Lépés: Kérés küldése az AI-nak
        try {
            const response = await fetch('/.netlify/functions/comm-helper', {
                method: 'POST',
                body: JSON.stringify({ userText: userText, tone: selectedTone, lang: lang })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || `Network error`);
            }

            const data = await response.json();
            
            // 4. Lépés: Eredmény megjelenítése
            const toolbarHTML = `<div class="output-toolbar"><button class="cta-button-small copy-output-btn"><i class="fa-solid fa-copy"></i> <span>${translations[lang].outputCopyBtn}</span></button></div>`;
            
            // Az eredményt egy <p> tag-be tesszük a jobb formázásért
            outputDiv.innerHTML = toolbarHTML + `<p>${data.rewrittenText}</p>`;

        } catch (error) {
            console.error("Communication Helper hiba:", error);
            outputDiv.innerHTML = `<p style="color: #ff6b6b;">${translations[lang].outputError}<br><small>${error.message}</small></p>`;
        } finally {
            generateBtn.disabled = false;
        }
    });
}