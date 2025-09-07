// js/rpg.js

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('rpg-helper-intro')) {
        initializeRpgHelper();
        initializeMapCreator();
        initializeRpgPortraitAssistant();
    }
    initializeRpgInfoModal();
});
// ===== ÚJ RÉSZ: TÉRKÉP ALKOTÓ ASSZISZTENS =====
function initializeMapCreator() {
    const toolContainer = document.getElementById('map-creator-tool');
    if (!toolContainer) return;

    const keywordsInput = toolContainer.querySelector('#map-keywords');
    const generateBtn = toolContainer.querySelector('#generate-map-btn');
    const outputContainer = toolContainer.querySelector('#map-creator-output');
    const promptOutputDiv = toolContainer.querySelector('#map-prompt-output');
    const locationsOutputDiv = toolContainer.querySelector('#map-locations-output');

    generateBtn.addEventListener('click', async () => {
        if (!canUseTool('mapCreator')) {
            showLimitModal();
            return;
        }

        const keywords = keywordsInput.value.trim();
        const lang = localStorage.getItem('preferredLanguage') || 'en';

        if (!keywords) {
            alert(translations[lang].mapKeywordsWarning || "Please provide some keywords for your map!");
            return;
        }

        outputContainer.classList.remove('hidden');
        const spinnerHTML = `<div class="spinner" style="margin: 20px auto;"></div>`;
        promptOutputDiv.innerHTML = spinnerHTML;
        locationsOutputDiv.innerHTML = spinnerHTML;
        updateAccordionHeight(outputContainer);
        generateBtn.disabled = true;

        try {
            const response = await fetch('/.netlify/functions/map-creator', {
                method: 'POST',
                body: JSON.stringify({ keywords: keywords, lang: lang })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Network error');
            }

            // Prompt kimenet feltöltése
            const promptToolbar = `<div class="output-toolbar"><button class="cta-button-small copy-output-btn"><i class="fa-solid fa-copy"></i> <span>${translations[lang].outputCopyBtn}</span></button></div>`;
            promptOutputDiv.innerHTML = promptToolbar + `<p>${data.prompt}</p>`;

            // Helyszínek kimenet feltöltése
            const locationsHTML = data.locations.map(loc => `<li>${loc}</li>`).join('');
            locationsOutputDiv.innerHTML = `<ul>${locationsHTML}</ul>`;

        } catch (error) {
            console.error("Map Creator hiba:", error);
            const errorMessage = error.message.includes("overloaded") 
                ? translations[lang].outputErrorOverloaded 
                : translations[lang].outputError;
            
            promptOutputDiv.innerHTML = `<p style="color: #ff6b6b;">${errorMessage}</p>`;
            locationsOutputDiv.innerHTML = '';
        } finally {
            generateBtn.disabled = false;
            setTimeout(() => updateAccordionHeight(outputContainer), 100);
        }
    });
}
// ===== MEGLÉVŐ RPG KÓD (VÁLTOZATLAN) =====
function initializeRpgHelper() {
    const generateAdventureBtn = document.getElementById('generate-adventure-btn');
    // ... (A fájl többi része változatlan)
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

    generateAdventureBtn.addEventListener('click', () => {
        if (!canUseTool('dmHelper')) {
            showLimitModal();
            return;
        }
        if (dmKeywordsInput.value.trim() === '') {
            generateSuggestions('/.netlify/functions/rpg-dm-suggestions', getDmMasterFormData(), dmSuggestionsOutput);
        } else {
            generateContent('/.netlify/functions/rpg-dm-master', getDmMasterFormData(), adventureOutput);
        }
    });

    generateCharacterBtn.addEventListener('click', () => {
        if (!canUseTool('charCreator')) {
            showLimitModal();
            return;
        }
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
        generateContent('/.netlify/functions/rpg-twist-generator', { context: context }, twistOutput);
    });
    
    document.querySelectorAll('.slider-group input[type="range"]').forEach(slider => {
        const valueSpan = slider.nextElementSibling;
        valueSpan.textContent = slider.value;
        slider.addEventListener('input', () => { valueSpan.textContent = slider.value; });
    });
    
    populateSelectOptions(localStorage.getItem('preferredLanguage') || 'en');
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('suggestion-btn')) {
        const parentId = e.target.parentElement.id;
        const dmKeywordsInput = document.getElementById('dm-keywords');
        const ccKeywordsInput = document.getElementById('cc-keywords');
        
        if (parentId === 'dm-suggestions-output') {
            dmKeywordsInput.value = e.target.textContent;
            document.getElementById('dm-suggestions-output').innerHTML = '';
            document.getElementById('generate-adventure-btn').click();
        } else if (parentId === 'cc-suggestions-output') {
            ccKeywordsInput.value = e.target.textContent;
            document.getElementById('cc-suggestions-output').innerHTML = '';
            document.getElementById('generate-character-btn').click();
        }
    }

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
        const resultKey = Object.keys(data)[0];
        const resultValue = data[resultKey];
        const toolbarHTML = `<div class="output-toolbar"><button class="cta-button-small copy-output-btn"><i class="fa-solid fa-copy"></i> <span>${translations[lang].outputCopyBtn}</span></button></div>`;
        
        if (Array.isArray(resultValue)) {
            outputElement.innerHTML = `<ul>${resultValue.map(item => `<li>${item}</li>`).join('')}</ul>`;
        } else {
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

    const lang = localStorage.getItem('preferredLanguage') || 'en';
    const tooltipKey = icon.dataset.keyTitle;
    if (typeof translations !== 'undefined' && translations[lang] && translations[lang][tooltipKey]) {
        icon.setAttribute('title', translations[lang][tooltipKey]);
    }

    function openModal() {
        const titleElem = modal.querySelector('[data-key="rpgInfoModalTitle"]');
        const textElem = modal.querySelector('[data-key="rpgInfoModalText"]');
        const currentLang = localStorage.getItem('preferredLanguage') || 'en';

        if (translations[currentLang]) {
            titleElem.textContent = translations[currentLang].rpgInfoModalTitle;
            textElem.textContent = translations[currentLang].rpgInfoModalText;
        }

        overlay.classList.remove('hidden');
        modal.classList.remove('hidden');
    }

    icon.addEventListener('click', openModal);
}

function initializeRpgPortraitAssistant() {
    const toolContainer = document.getElementById('portrait-assistant-tool');
    if (!toolContainer) return;

    // Form elemek összegyűjtése
    const raceSelect = toolContainer.querySelector('#pa-race');
    const classSelect = toolContainer.querySelector('#pa-class');
    const genderSelect = toolContainer.querySelector('#pa-gender');
    const customKeywordsInput = toolContainer.querySelector('#pa-custom-keywords');
    const generateBtn = toolContainer.querySelector('#generate-portrait-btn');
    const outputDiv = toolContainer.querySelector('#portrait-output');

    // Legördülő menük feltöltése a fordítási adatokból
    function populatePortraitSelects(lang) {
        const optionsData = translations[lang].rpgPortraitOptions;
        if (!optionsData) return;

        const populate = (selectElement, options) => {
            selectElement.innerHTML = '';
            options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.label;
                selectElement.appendChild(option);
            });
        };

        populate(raceSelect, optionsData.races);
        populate(classSelect, optionsData.classes);
        populate(genderSelect, optionsData.genders);
    }

    // Gomb eseménykezelője
    generateBtn.addEventListener('click', async () => {
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        outputDiv.classList.remove('hidden');
        outputDiv.innerHTML = `<div class="spinner" style="margin: 20px auto;"></div>`;
        updateAccordionHeight(outputDiv);
        generateBtn.disabled = true;

        try {
            // 1. Adatok begyűjtése
            const raceValue = raceSelect.value;
            const classValue = classSelect.value;
            const genderValue = genderSelect.value;
            const customKeywords = customKeywordsInput.value.trim();
            let translatedKeywords = '';

            // 2. Fordítás (ha szükséges)
            if (customKeywords) {
                const response = await fetch('/.netlify/functions/translate', {
                    method: 'POST',
                    body: JSON.stringify({ text: customKeywords, target_lang: 'EN-US' })
                });
                if (!response.ok) throw new Error('Translation failed');
                const data = await response.json();
                translatedKeywords = data.translatedText;
            }

            // 3. Prompt összeállítása a NightCafe struktúra szerint
            const mainSubject = `A portrait of a ${genderValue} ${raceValue} ${classValue}`;
            const secondarySubject = translatedKeywords ? `, ${translatedKeywords}` : '';
            const style = `epic fantasy character concept art, by Greg Rutkowski and Artgerm`;
            const extras = `highly detailed, cinematic lighting, 8k resolution, intricate details`;
            
            const finalPrompt = `${mainSubject}${secondarySubject}, ${style}, ${extras}.`;

            // 4. Eredmény megjelenítése
            const toolbarHTML = `<div class="output-toolbar"><button class="cta-button-small copy-output-btn"><i class="fa-solid fa-copy"></i> <span>${translations[lang].outputCopyBtn}</span></button></div>`;
            const promptHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word;">${finalPrompt}</pre>`;
            outputDiv.innerHTML = toolbarHTML + promptHTML;

        } catch (error) {
            console.error("Portrait Assistant Error:", error);
            outputDiv.innerHTML = `<p style="color: #ff6b6b;">${translations[lang].outputError}</p>`;
        } finally {
            generateBtn.disabled = false;
            setTimeout(() => updateAccordionHeight(outputDiv), 50);
        }
    });

    // Kezdeti feltöltés és nyelvváltozás figyelése
    populatePortraitSelects(localStorage.getItem('preferredLanguage') || 'en');
    document.body.addEventListener('languageChanged', (e) => populatePortraitSelects(e.detail.lang));
}