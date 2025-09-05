document.addEventListener('DOMContentLoaded', () => {
    // Csak akkor fusson le, ha a "helper-tools-container" létezik az oldalon
    if (document.getElementById('helper-tools-container')) {
        initializeCommHelper();
        initializeGiftHelper();
        initializeMetaphorMaster(); // ÚJ: Meghívjuk a Metafora Mester logikáját is
    }
});
// ===== KOMMUNIKÁCIÓS SEGÉDLET (VÁLTOZATLAN) =====
function initializeCommHelper() {
    // ... (Ez a rész változatlan)
    const toolContainer = document.getElementById('comm-helper-tool');
    if (!toolContainer) return;
    const input = toolContainer.querySelector('#comm-helper-input');
    const toneButtons = toolContainer.querySelectorAll('.tone-btn');
    const generateBtn = toolContainer.querySelector('#generate-rewrite-btn');
    const outputDiv = toolContainer.querySelector('#comm-helper-output');
    let selectedTone = 'formal';
    toneButtons.forEach(button => {
        button.addEventListener('click', () => {
            toneButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedTone = button.dataset.tone;
        });
    });
    generateBtn.addEventListener('click', async () => {
        if (!canUseTool('commHelper')) {
            showLimitModal();
            return;
        }
        const userText = input.value.trim();
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        if (!userText) {
            outputDiv.innerHTML = `<p style="color: #ff6b6b;">${translations[lang].expertErrorEmpty || 'Please enter some text to rewrite!'}</p>`;
            updateAccordionHeight(outputDiv);
            return;
        }
        outputDiv.innerHTML = `<div class="spinner" style="margin: 20px auto;"></div>`;
        updateAccordionHeight(outputDiv);
        generateBtn.disabled = true;
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
            const toolbarHTML = `<div class="output-toolbar"><button class="cta-button-small copy-output-btn"><i class="fa-solid fa-copy"></i> <span>${translations[lang].outputCopyBtn}</span></button></div>`;
            outputDiv.innerHTML = toolbarHTML + `<p>${data.rewrittenText}</p>`;
        } catch (error) {
            console.error("Communication Helper hiba:", error);
            outputDiv.innerHTML = `<p style="color: #ff6b6b;">${translations[lang].outputError}<br><small>${error.message}</small></p>`;
        } finally {
            generateBtn.disabled = false;
            setTimeout(() => updateAccordionHeight(outputDiv), 50); 
        }
    });
}
// ===== AJÁNDÉKÖTLET GENERÁTOR (VÁLTOZATLAN) =====
function initializeGiftHelper() {
    // ... (Ez a rész változatlan)
    const toolContainer = document.getElementById('gift-helper-tool');
    if (!toolContainer) return;
    const recipientSelect = toolContainer.querySelector('#gift-recipient');
    const occasionSelect = toolContainer.querySelector('#gift-occasion');
    const ageSelect = toolContainer.querySelector('#gift-age');
    const priceSelect = toolContainer.querySelector('#gift-price');
    const interestsInput = toolContainer.querySelector('#gift-interests');
    const styleButtonsContainer = toolContainer.querySelector('#gift-style-buttons');
    const generateBtn = toolContainer.querySelector('#generate-gift-btn');
    const outputDiv = toolContainer.querySelector('#gift-helper-output');
    let selectedStyle = 'practical';
    styleButtonsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('tone-btn')) {
            styleButtonsContainer.querySelectorAll('.tone-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            selectedStyle = e.target.dataset.style;
        }
    });
    populateGiftSelects(localStorage.getItem('preferredLanguage') || 'en');
    document.body.addEventListener('languageChanged', (e) => populateGiftSelects(e.detail.lang));
    generateBtn.addEventListener('click', async () => {
        if (!canUseTool('giftHelper')) {
            showLimitModal();
            return;
        }
        const formData = {
            recipient: recipientSelect.value,
            occasion: occasionSelect.value,
            age: ageSelect.value,
            price: priceSelect.value,
            interests: interestsInput.value.trim(),
            style: selectedStyle,
            lang: localStorage.getItem('preferredLanguage') || 'en'
        };
        if (!formData.interests) {
            alert(translations[formData.lang].giftInterestsWarning || "Please describe the person's interests!");
            return;
        }
        outputDiv.innerHTML = `<div class="spinner" style="margin: 20px auto;"></div>`;
        updateAccordionHeight(outputDiv);
        generateBtn.disabled = true;
        try {
            const response = await fetch('/.netlify/functions/gift-helper', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Network error');
            }
            const data = await response.json();
            const toolbarHTML = `<div class="output-toolbar"><button class="cta-button-small copy-output-btn"><i class="fa-solid fa-copy"></i> <span>${translations[formData.lang].outputCopyBtn}</span></button></div>`;
            const ideasHTML = data.ideas.map(idea => `<li>${idea}</li>`).join('');
            outputDiv.innerHTML = toolbarHTML + `<ol>${ideasHTML}</ol>`;
        } catch (error) {
            console.error("Gift Helper hiba:", error);
            outputDiv.innerHTML = `<p style="color: #ff6b6b;">${translations[formData.lang].outputError}<br><small>${error.message}</small></p>`;
        } finally {
            generateBtn.disabled = false;
            setTimeout(() => updateAccordionHeight(outputDiv), 50);
        }
    });
}

function populateGiftSelects(lang) {
    // ... (Ez a rész változatlan)
    const optionsData = translations[lang].giftSelectOptions;
    if (!optionsData) return;
    const selectMappings = {
        'gift-recipient': optionsData.recipients,
        'gift-occasion': optionsData.occasions,
        'gift-age': optionsData.ageGroups,
        'gift-price': optionsData.priceRanges
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
// ===== ÚJ RÉSZ: METAFORA MESTER =====
function initializeMetaphorMaster() {
    const toolContainer = document.getElementById('metaphor-helper-tool');
    if (!toolContainer) return;

    const conceptInput = toolContainer.querySelector('#metaphor-concept');
    const toneSelect = toolContainer.querySelector('#metaphor-tone');
    const generateBtn = toolContainer.querySelector('#generate-metaphor-btn');
    const outputDiv = toolContainer.querySelector('#metaphor-helper-output');

    populateMetaphorSelects(localStorage.getItem('preferredLanguage') || 'en');
    document.body.addEventListener('languageChanged', (e) => populateMetaphorSelects(e.detail.lang));

    generateBtn.addEventListener('click', async () => {
        if (!canUseTool('metaphorMaster')) {
            showLimitModal();
            return;
        }

        const formData = {
            concept: conceptInput.value.trim(),
            tone: toneSelect.value,
            lang: localStorage.getItem('preferredLanguage') || 'en'
        };

        if (!formData.concept) {
            alert(translations[formData.lang].metaphorConceptWarning || "Please enter a concept to work with!");
            return;
        }

        outputDiv.innerHTML = `<div class="spinner" style="margin: 20px auto;"></div>`;
        updateAccordionHeight(outputDiv);
        generateBtn.disabled = true;

        try {
            const response = await fetch('/.netlify/functions/metaphor-master', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Network error');
            }

            const data = await response.json();
            const toolbarHTML = `<div class="output-toolbar"><button class="cta-button-small copy-output-btn"><i class="fa-solid fa-copy"></i> <span>${translations[formData.lang].outputCopyBtn}</span></button></div>`;

            if (typeof showdown !== 'undefined') {
                const converter = new showdown.Converter({ openLinksInNewWindow: true, noHeaderId: true });
                outputDiv.innerHTML = toolbarHTML + converter.makeHtml(data.result);
            } else {
                outputDiv.innerHTML = toolbarHTML + `<pre>${data.result}</pre>`; // Fallback, ha a Showdown nem érhető el
            }

        } catch (error) {
            console.error("Metaphor Master hiba:", error);
            outputDiv.innerHTML = `<p style="color: #ff6b6b;">${translations[formData.lang].outputError}<br><small>${error.message}</small></p>`;
        } finally {
            generateBtn.disabled = false;
            setTimeout(() => updateAccordionHeight(outputDiv), 50);
        }
    });
}

function populateMetaphorSelects(lang) {
    const optionsData = translations[lang].metaphorSelectOptions;
    if (!optionsData) return;

    const selectElement = document.getElementById('metaphor-tone');
    if (selectElement && optionsData) {
        selectElement.innerHTML = ''; // Töröljük a régi opciókat
        optionsData.forEach(optionData => {
            const option = document.createElement('option');
            option.value = optionData.value;
            option.textContent = optionData.label;
            selectElement.appendChild(option);
        });
    }
}
// ===== GLOBÁLIS SEGÉDFÜGGVÉNY (VÁLTOZATLAN) =====
function updateAccordionHeight(contentElement) {
    const accordionContent = contentElement.closest('.accordion-content');
    if (accordionContent) {
        const accordionItem = accordionContent.parentElement;
        if (accordionItem && accordionItem.classList.contains('active')) {
            accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
        }
    }
}