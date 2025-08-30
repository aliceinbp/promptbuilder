// ===== RPG Segédlet - Vezérlő Szkript (rpg.js) =====

document.addEventListener('DOMContentLoaded', () => {
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
    const dmSuggestionsOutput = document.getElementById('dm-suggestions-output');
    const ccSuggestionsOutput = document.getElementById('cc-suggestions-output');
    const dmKeywordsInput = document.getElementById('dm-keywords');
    const ccKeywordsInput = document.getElementById('cc-keywords');
    const generateNamesBtn = document.getElementById('generate-names-btn');
    const nameStyleInput = document.getElementById('name-gen-style');
    const namesOutput = document.getElementById('names-output');
    const generateTwistBtn = document.getElementById('generate-twist-btn');
    const twistContextInput = document.getElementById('twist-gen-context');
    const twistOutput = document.getElementById('twist-output');

    // === Eseménykezelők ===
    generateAdventureBtn.addEventListener('click', () => {
        if (dmKeywordsInput.value.trim() === '') {
            generateSuggestions('/.netlify/functions/rpg-dm-suggestions', getDmMasterFormData(), dmSuggestionsOutput);
        } else {
            generateContent('/.netlify/functions/rpg-dm-master', getDmMasterFormData(), adventureOutput);
        }
    });

    generateCharacterBtn.addEventListener('click', () => {
        if (ccKeywordsInput.value.trim() === '') {
            generateSuggestions('/.netlify/functions/rpg-character-suggestions', getCharacterCreatorFormData(), ccSuggestionsOutput);
        } else {
            generateContent('/.netlify/functions/rpg-character-creator', getCharacterCreatorFormData(), characterOutput);
        }
    });

    generateNamesBtn.addEventListener('click', async () => {
        const style = nameStyleInput.value.trim();
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        namesOutput.innerHTML = `<div class="spinner" style="margin: 0 auto;"></div>`;
        try {
            const response = await fetch('/.netlify/functions/rpg-name-generator', {
                method: 'POST',
                body: JSON.stringify({ style: style, lang: lang })
            });
            if (!response.ok) throw new Error('Network error');
            const data = await response.json();
            if (data.names && data.names.length > 0) {
                namesOutput.innerHTML = `<ul>${data.names.map(name => `<li>${name}</li>`).join('')}</ul>`;
            } else { throw new Error('No names received.'); }
        } catch (error) {
            console.error("Name generation error:", error);
            namesOutput.innerHTML = `<p style="color: #ff6b6b;">${translations[lang].outputError}</p>`;
        }
    });

    generateTwistBtn.addEventListener('click', () => {
    const context = twistContextInput.value.trim();
    // Mostantól a fő generateContent függvényt használjuk, ami minden hibakezelést tud
    generateContent('/.netlify/functions/rpg-twist-generator', { context: context }, twistOutput);
});
    
    document.querySelectorAll('.slider-group input[type="range"]').forEach(slider => {
        const valueSpan = slider.nextElementSibling;
        valueSpan.textContent = slider.value;
        slider.addEventListener('input', () => { valueSpan.textContent = slider.value; });
    });
    
    populateSelectOptions(localStorage.getItem('preferredLanguage') || 'en');
}

// === Dinamikus gombok eseménykezelői (a teljes dokumentumot figyelik) ===

document.addEventListener('click', function(e) {
    // Ötlet-gombok kezelése
    if (e.target.classList.contains('suggestion-btn')) {
        const parentId = e.target.parentElement.id;
        const dmKeywordsInput = document.getElementById('dm-keywords');
        const ccKeywordsInput = document.getElementById('cc-keywords');
        
        if (parentId === 'dm-suggestions-output') {
            dmKeywordsInput.value = e.target.textContent;
            document.getElementById('dm-suggestions-output').innerHTML = '';
            document.getElementById('generate-adventure-btn').click(); // Automatikus generálás
        } else if (parentId === 'cc-suggestions-output') {
            ccKeywordsInput.value = e.target.textContent;
            document.getElementById('cc-suggestions-output').innerHTML = '';
            document.getElementById('generate-character-btn').click(); // Automatikus generálás
        }
    }

    // Másolás gombok kezelése
    if (e.target.closest('.copy-output-btn')) {
        const button = e.target.closest('.copy-output-btn');
        const outputContainer = button.closest('.mini-module-output, #adventure-output, #character-output');
        if (outputContainer) {
            const contentToCopy = outputContainer.cloneNode(true);
            const toolbar = contentToCopy.querySelector('.output-toolbar');
            if (toolbar) toolbar.remove();
            navigator.clipboard.writeText(contentToCopy.innerText.trim()).then(() => {
                const lang = localStorage.getItem('preferredLanguage') || 'en';
                const originalHTML = button.innerHTML;
                button.innerHTML = `<i class="fa-solid fa-check"></i> <span>${translations[lang].outputCopiedBtn}</span>`;
                setTimeout(() => { button.innerHTML = originalHTML; }, 2000);
            });
        }
    }
});

// === Segédfüggvények ===

function getDmMasterFormData() { /* ... kód változatlan ... */ }
function getCharacterCreatorFormData() { /* ... kód változatlan ... */ }
async function generateSuggestions(endpoint, formData, suggestionsOutputElement) { /* ... kód változatlan ... */ }
async function generateContent(endpoint, formData, outputElement) { /* ... kód változatlan ... */ }
function updateAccordionHeight(contentElement) { /* ... kód változatlan ... */ }
function populateSelectOptions(lang) { /* ... kód változatlan ... */ }
function updateDownloadLink(lang) { /* ... kód változatlan ... */ }

// IDE BEMÁSOLJUK A VÁLTOZATLAN FÜGGVÉNYEKET A BIZTONSÁG KEDVÉÉRT

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
        focus: `Combat: ${focusCombat}, Investigation: ${focusInvestigation}, Social: ${focusSocial}, Exploration: ${focusExploration}`
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

async function generateSuggestions(endpoint, formData, suggestionsOutputElement) {
    const lang = localStorage.getItem('preferredLanguage') || 'en';
    const mainOutputElement = suggestionsOutputElement.id === 'dm-suggestions-output' ? document.getElementById('adventure-output') : document.getElementById('character-output');
    if(mainOutputElement) mainOutputElement.innerHTML = '';
    suggestionsOutputElement.innerHTML = `<div style="text-align: center; padding: 20px;"><div class="spinner" style="margin: 0 auto 15px auto;"></div><p>${translations[lang].outputGenerating}</p></div>`;
    updateAccordionHeight(suggestionsOutputElement);
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify({ ...formData, lang: lang })
        });
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        suggestionsOutputElement.innerHTML = '';
        if (data.suggestions && data.suggestions.length > 0) {
            data.suggestions.forEach(suggestion => {
                const button = document.createElement('button');
                button.className = 'suggestion-btn';
                button.textContent = suggestion;
                suggestionsOutputElement.appendChild(button);
            });
            setTimeout(() => updateAccordionHeight(suggestionsOutputElement), 50); 
        } else { throw new Error('No suggestions received.'); }
    } catch (error) {
        console.error("Suggestion error:", error);
        suggestionsOutputElement.innerHTML = `<p style="color: #ff6b6b;">${translations[lang].outputError}</p>`;
        setTimeout(() => updateAccordionHeight(suggestionsOutputElement), 50);
    }
}

async function generateContent(endpoint, formData, outputElement) {
    const lang = localStorage.getItem('preferredLanguage') || 'en';
    outputElement.innerHTML = `<div style="text-align: center; padding: 20px;"><div class="spinner" style="margin: 0 auto 15px auto;"></div><p>${translations[lang].outputGenerating}</p></div>`;
    updateAccordionHeight(outputElement);
    const button = outputElement.closest('.accordion-content, .rpg-mini-module').querySelector('button[id^="generate-"]');
    if(button) button.disabled = true;
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify({ ...formData, lang: lang })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || `Network error: ${response.statusText}`);
        }
        const data = await response.json();
        const resultKey = Object.keys(data)[0]; // twists, names, result, etc.
        const resultValue = data[resultKey];

        const toolbarHTML = `<div class="output-toolbar"><button class="cta-button-small copy-output-btn"><i class="fa-solid fa-copy"></i> <span>${translations[lang].outputCopyBtn}</span></button></div>`;
        
        if (Array.isArray(resultValue)) { // Név- és fordulatgenerátor
             outputElement.innerHTML = `<ul>${resultValue.map(item => `<li>${item}</li>`).join('')}</ul>`;
        } else { // Kaland és karakter
            if (typeof showdown !== 'undefined') {
                const converter = new showdown.Converter({ openLinksInNewWindow: true, noHeaderId: true, simpleLineBreaks: true });
                outputElement.innerHTML = toolbarHTML + converter.makeHtml(resultValue);
            } else {
                outputElement.innerHTML = toolbarHTML + `<p>${resultValue}</p>`;
            }
        }
    } catch (error) {
        console.error("Generálási hiba:", error);
        outputElement.innerHTML = `<p style="color: #ff6b6b;">${translations[lang].outputError}<br><small>${error.message}</small></p>`;
    } finally {
        if(button) button.disabled = false;
        setTimeout(() => updateAccordionHeight(outputElement), 100);
    }
}

function updateAccordionHeight(contentElement) {
    const accordionContent = contentElement.closest('.accordion-content');
    if (accordionContent) {
        const accordionItem = accordionContent.parentElement;
        if (accordionItem && accordionItem.classList.contains('active')) {
            accordionContent.style.maxHeight = null;
            accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
        }
    }
}

function populateSelectOptions(lang) {
    const optionsData = translations[lang].rpgSelectOptions;
    if (!optionsData) return;
    const selectMappings = {
        'dm-length': optionsData.adventureLength, 'dm-names': optionsData.namingConvention,
        'cc-morality': optionsData.moralAlignment, 'cc-age': optionsData.ageGroup,
        'cc-names': optionsData.namingConvention
    };
    for (const selectId in selectMappings) {
        const selectElement = document.getElementById(selectId);
        const options = selectMappings[selectId];
        if (selectElement && options) {
            selectElement.innerHTML = '';
            options.forEach(optionData => {
                const option = document.createElement('option');
                option.value = optionData.value;
                option.textContent = optionData.label;
                selectElement.appendChild(option);
            });
        }
    }
}

function updateDownloadLink(lang) {
    const link = document.getElementById('download-guide-link');
    if (link) {
        link.href = (lang === 'hu') ? '/guides/prompting-for-pros-hu.pdf' : '/guides/prompting-for-pros-en.pdf';
    }
}
function initializeRpgInfoModal() {
    const icon = document.getElementById('rpg-info-icon');
    const modal = document.getElementById('rpg-info-modal');
    const overlay = document.getElementById('modal-overlay');

    if (!icon || !modal || !overlay) return;

    function openModal() {
        // A szövegek frissítése a jelenlegi nyelv alapján
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        const titleElem = modal.querySelector('[data-key="rpgInfoModalTitle"]');
        const textElem = modal.querySelector('[data-key="rpgInfoModalText"]');

        if (translations[lang]) {
            titleElem.textContent = translations[lang].rpgInfoModalTitle;
            textElem.textContent = translations[lang].rpgInfoModalText;
        }

        overlay.classList.remove('hidden');
        modal.classList.remove('hidden');
    }

    icon.addEventListener('click', openModal);

    // A bezárás gombot a main.js már kezeli, de a biztonság kedvéért itt is lehetne:
    // const closeBtn = modal.querySelector('.close-modal-btn');
    // if(closeBtn) closeBtn.addEventListener('click', () => {
    //     overlay.classList.add('hidden');
    //     modal.classList.add('hidden');
    // });
}