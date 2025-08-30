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
    
    // Betöltés jelzése
    outputElement.innerHTML = `<div class="spinner-container"><div class="spinner"></div><p>${translations[lang].outputGenerating}</p></div>`;
    // A gombot is letilthatjuk, amíg fut a generálás
    const button = outputElement.previousElementSibling;
    button.disabled = true;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || `Hálózati hiba: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Markdown -> HTML konverzió (ha a showdown.js be van töltve)
        if (typeof showdown !== 'undefined') {
            const converter = new showdown.Converter({ openLinksInNewWindow: true, noHeaderId: true, simpleLineBreaks: true });
            outputElement.innerHTML = converter.makeHtml(data.result);
        } else {
            outputElement.textContent = data.result;
        }

    } catch (error) {
        console.error("Generálási hiba:", error);
        outputElement.innerHTML = `<p style="color: #ff6b6b;">${translations[lang].outputError}<br><small>${error.message}</small></p>`;
    } finally {
        button.disabled = false;
    }
}