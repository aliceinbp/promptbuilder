// ===== RPG Segédlet - Vezérlő Szkript (rpg.js) =====

document.addEventListener('DOMContentLoaded', () => {
    // Csak akkor fusson le, ha az RPG oldalon vagyunk
    if (document.getElementById('rpg-helper-intro')) {
        initializeRpgHelper();
    }
});

function initializeRpgHelper() {
    // === Elemek ===
    const generateAdventureBtn = document.getElementById('generate-adventure-btn');
    const generateCharacterBtn = document.getElementById('generate-character-btn');
    const adventureOutput = document.getElementById('adventure-output');
    const characterOutput = document.getElementById('character-output');

    // === Eseménykezelők ===
    generateAdventureBtn.addEventListener('click', () => {
        const formData = getDmMasterFormData();
        generateContent('/.netlify/functions/rpg-dm-master', formData, adventureOutput);
    });

    generateCharacterBtn.addEventListener('click', () => {
        const formData = getCharacterCreatorFormData();
        generateContent('/.netlify/functions/rpg-character-creator', formData, characterOutput);
    });
    
    // Csúszkák értékének frissítése
    document.querySelectorAll('.slider-group input[type="range"]').forEach(slider => {
        const valueSpan = slider.nextElementSibling;
        valueSpan.textContent = slider.value;
        slider.addEventListener('input', () => {
            valueSpan.textContent = slider.value;
        });
    });
}

// === Adatgyűjtő Függvények ===

function getDmMasterFormData() {
    const focusCombat = document.getElementById('dm-focus-combat').value;
    const focusInvestigation = document.getElementById('dm-focus-investigation').value;
    const focusSocial = document.getElementById('dm-focus-social').value;
    const focusExploration = document.getElementById('dm-focus-exploration').value;

    return {
        world: document.getElementById('dm-system').value,
        mood: document.getElementById('dm-mood').value,
        keywords: document.getElementById('dm-keywords').value,
        party: document.getElementById('dm-party').value,
        length: document.getElementById('dm-length').value,
        boundaries: document.getElementById('dm-boundaries').value,
        constraints: document.getElementById('dm-constraints').value,
        names: document.getElementById('dm-names').value,
        focus: `Harc: ${focusCombat}, Nyomozás: ${focusInvestigation}, Társalgás: ${focusSocial}, Felfedezés: ${focusExploration}`
    };
}

function getCharacterCreatorFormData() {
    return {
        world: document.getElementById('cc-system').value,
        race: document.getElementById('cc-race').value,
        class: document.getElementById('cc-class').value,
        keywords: document.getElementById('cc-keywords').value,
        morality: document.getElementById('cc-morality').value,
        age: document.getElementById('cc-age').value,
        boundaries: document.getElementById('cc-boundaries').value,
        names: document.getElementById('cc-names').value
    };
}

// === Fő Generátor Függvény ===

async function generateContent(endpoint, formData, outputElement) {
    const lang = localStorage.getItem('preferredLanguage') || 'en';

    // Stílusos betöltés jelzése
    outputElement.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div class="spinner" style="margin: 0 auto 15px auto;"></div>
            <p>${translations[lang].outputGenerating}</p>
        </div>`;

    const button = outputElement.previousElementSibling;
    button.disabled = true;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || `Network error: ${response.statusText}`);
        }

        const data = await response.json();

        // Létrehozzuk az eszköztárat a másolás gombbal
        const toolbarHTML = `
            <div class="output-toolbar">
                <button class="cta-button-small copy-output-btn">
                    <i class="fa-solid fa-copy"></i> <span data-key="outputCopyBtn">${translations[lang].outputCopyBtn}</span>
                </button>
            </div>
        `;

        if (typeof showdown !== 'undefined') {
            const converter = new showdown.Converter({ openLinksInNewWindow: true, noHeaderId: true, simpleLineBreaks: true });
            // Először a toolbar, utána a konvertált tartalom
            outputElement.innerHTML = toolbarHTML + converter.makeHtml(data.result);
        } else {
            outputElement.innerHTML = toolbarHTML;
            outputElement.insertAdjacentText('beforeend', data.result);
        }

    } catch (error) {
        console.error("Generálási hiba:", error);
        outputElement.innerHTML = `<p style="color: #ff6b6b;">${translations[lang].outputError}<br><small>${error.message}</small></p>`;
    } finally {
        button.disabled = false;
    }
}
// Eseménykezelő a dinamikusan létrehozott "Másolás" gombokhoz
document.addEventListener('click', function(e) {
    if (e.target.closest('.copy-output-btn')) {
        const button = e.target.closest('.copy-output-btn');
        const outputContainer = button.closest('#adventure-output, #character-output');

        if (outputContainer) {
            // A toolbar nélkül másoljuk a szöveget
            const contentToCopy = outputContainer.cloneNode(true);
            const toolbar = contentToCopy.querySelector('.output-toolbar');
            if (toolbar) toolbar.remove();

            navigator.clipboard.writeText(contentToCopy.innerText).then(() => {
                const lang = localStorage.getItem('preferredLanguage') || 'en';
                const originalHTML = button.innerHTML;
                button.innerHTML = `<i class="fa-solid fa-check"></i> <span data-key="outputCopiedBtn">${translations[lang].outputCopiedBtn}</span>`;
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                }, 2000);
            });
        }
    }
});