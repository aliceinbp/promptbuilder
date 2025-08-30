// ===== RPG Segédlet - Vezérlő Szkript (rpg.js) =====

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('rpg-helper-intro')) {
        initializeRpgHelper();
    }
});

function initializeRpgHelper() {
    const generateAdventureBtn = document.getElementById('generate-adventure-btn');
    const generateCharacterBtn = document.getElementById('generate-character-btn');
    const adventureOutput = document.getElementById('adventure-output');
    const characterOutput = document.getElementById('character-output');
    const dmSuggestionsOutput = document.getElementById('dm-suggestions-output');
    const ccSuggestionsOutput = document.getElementById('cc-suggestions-output');
    const dmKeywordsInput = document.getElementById('dm-keywords');
    const ccKeywordsInput = document.getElementById('cc-keywords');

    generateAdventureBtn.addEventListener('click', () => {
        if (dmKeywordsInput.value.trim() === '') {
            generateSuggestions('/.netlify/functions/rpg-dm-suggestions', getDmMasterFormData(), dmSuggestionsOutput, dmKeywordsInput, adventureOutput);
        } else {
            generateContent('/.netlify/functions/rpg-dm-master', getDmMasterFormData(), adventureOutput);
        }
    });

    generateCharacterBtn.addEventListener('click', () => {
        if (ccKeywordsInput.value.trim() === '') {
            generateSuggestions('/.netlify/functions/rpg-character-suggestions', getCharacterCreatorFormData(), ccSuggestionsOutput, ccKeywordsInput, characterOutput);
        } else {
            generateContent('/.netlify/functions/rpg-character-creator', getCharacterCreatorFormData(), characterOutput);
        }
    });

    // Eseménykezelő a dinamikusan létrehozott ötlet-gombokhoz
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('suggestion-btn')) {
            const parentId = e.target.parentElement.id;
            if (parentId === 'dm-suggestions-output') {
                dmKeywordsInput.value = e.target.textContent;
                dmSuggestionsOutput.innerHTML = '';
                generateContent('/.netlify/functions/rpg-dm-master', getDmMasterFormData(), adventureOutput);
            } else if (parentId === 'cc-suggestions-output') {
                ccKeywordsInput.value = e.target.textContent;
                ccSuggestionsOutput.innerHTML = '';
                generateContent('/.netlify/functions/rpg-character-creator', getCharacterCreatorFormData(), characterOutput);
            }
        }
    });

    document.querySelectorAll('.slider-group input[type="range"]').forEach(slider => {
        const valueSpan = slider.nextElementSibling;
        valueSpan.textContent = slider.value;
        slider.addEventListener('input', () => { valueSpan.textContent = slider.value; });
    });

    populateSelectOptions(localStorage.getItem('preferredLanguage') || 'en');
}

// ... (A getDmMasterFormData és getCharacterCreatorFormData függvények változatlanok maradnak itt)
function getDmMasterFormData() {
    // ... (ez a függvény nem változik)
}
function getCharacterCreatorFormData() {
    // ... (ez a függvény sem változik)
}

async function generateSuggestions(endpoint, formData, suggestionsOutputElement, keywordsInputElement, mainOutputElement) {
    const lang = localStorage.getItem('preferredLanguage') || 'en';
    mainOutputElement.innerHTML = '';
    suggestionsOutputElement.innerHTML = `<div style="text-align: center; padding: 20px;"><div class="spinner" style="margin: 0 auto 15px auto;"></div><p>${translations[lang].outputGenerating}</p></div>`;

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
        } else {
            throw new Error('No suggestions received.');
        }
    } catch (error) {
        console.error("Suggestion error:", error);
        suggestionsOutputElement.innerHTML = `<p style="color: #ff6b6b;">${translations[lang].outputError}</p>`;
    }
}

// Az előzőleg módosított generateContent és a többi függvény...
// (Itt beillesztheted azokat a függvényeket, amiket az előző lépésben adtam,
// de az egyszerűség kedvéért most csak bemásolom őket újra, hogy teljes legyen a fájl)

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

async function generateContent(endpoint, formData, outputElement) {
    const lang = localStorage.getItem('preferredLanguage') || 'en';
    outputElement.innerHTML = `<div style="text-align: center; padding: 20px;"><div class="spinner" style="margin: 0 auto 15px auto;"></div><p>${translations[lang].outputGenerating}</p></div>`;
    updateAccordionHeight(outputElement);
    const button = outputElement.previousElementSibling;
    button.disabled = true;
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
        const toolbarHTML = `<div class="output-toolbar"><button class="cta-button-small copy-output-btn"><i class="fa-solid fa-copy"></i> <span data-key="outputCopyBtn">${translations[lang].outputCopyBtn}</span></button></div>`;
        if (typeof showdown !== 'undefined') {
            const converter = new showdown.Converter({ openLinksInNewWindow: true, noHeaderId: true, simpleLineBreaks: true });
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
        setTimeout(() => updateAccordionHeight(outputElement), 100);
    }
}

document.addEventListener('click', function(e) {
    if (e.target.closest('.copy-output-btn')) {
        const button = e.target.closest('.copy-output-btn');
        const outputContainer = button.closest('#adventure-output, #character-output');
        if (outputContainer) {
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

function updateAccordionHeight(contentElement) {
    const accordionContent = contentElement.closest('.accordion-content');
    const accordionItem = contentElement.closest('.accordion-item');
    if (accordionContent && accordionItem.classList.contains('active')) {
        accordionContent.style.maxHeight = null;
        accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
    }
}

function populateSelectOptions(lang) {
    const optionsData = translations[lang].rpgSelectOptions;
    if (!optionsData) return;
    const selectMappings = {
        'dm-length': optionsData.adventureLength,
        'dm-names': optionsData.namingConvention,
        'cc-morality': optionsData.moralAlignment,
        'cc-age': optionsData.ageGroup,
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