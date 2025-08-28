// ===== Alkimista Műhely - Generátor Szkript (generator.js) - VÉGLEGES, FORDÍTÓVAL KIEGÉSZÍTETT =====

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('generator-page-identifier')) {
        initializeGeneratorLogic();
    }
});

function initializeGeneratorLogic() {
    // === VÁLTOZÓK ÉS ELEMEK ===
    let activeWeightedTag = null;
    let selectedParameter = '';
    let historyTimeout;
    let promptHistory = JSON.parse(localStorage.getItem('promptHistory')) || [];
    let choiceInstances = {};

    const tagContainers = {
        mainSubject: document.getElementById('mainSubject-container'),
        details: document.getElementById('details-container'),
        style: document.getElementById('style-container'),
        extra: document.getElementById('extra-container')
    };
    const finalPromptContainer = document.getElementById('final-prompt-container');
    const finalPromptHiddenTextarea = document.getElementById('final-prompt-hidden');
    const negativePromptTextarea = document.getElementById('negative-prompt');
    const copyButton = document.getElementById('copy-button');
    const copyNegativeButton = document.getElementById('copy-negative-button');
    const randomButton = document.getElementById('random-button');
    const clearAllButton = document.getElementById('clear-all-button');
    const overlay = document.getElementById('modal-overlay');
    const weightSlider = document.getElementById('weight-slider');
    const weightValue = document.getElementById('weight-value');
    const resetWeightsBtn = document.getElementById('reset-weights-btn');
    const translateButton = document.getElementById('translate-button');

    // === ALAP FUNKCIÓK ===
    function openModal(modal) { if (overlay) overlay.classList.remove('hidden'); if (modal) modal.classList.remove('hidden'); }
    function closeModal(modal) {
        if (modal) modal.classList.add('hidden');
        const anyModalOpen = document.querySelector('.modal:not(.hidden)');
        if (!anyModalOpen && overlay) overlay.classList.add('hidden');
    }

    // === CÍMKE LÉTREHOZÁSA ===
    function createTag(text, isFinalPromptTag) {
        const tag = document.createElement('span');
        const originalText = text.replace(/:[\d.]+$/, '').trim();
        tag.textContent = text;
        tag.dataset.originalText = originalText;
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '&times;';
        deleteBtn.className = 'delete-tag';
        deleteBtn.title = 'Törlés';
        tag.appendChild(deleteBtn);
        tag.className = isFinalPromptTag ? 'prompt-tag' : 'prompt-input-tag';
        return tag;
    }
    
    // === VÉGLEGES PROMPT KEZELÉSE ===
    // EZ AZ ÚJ, JAVÍTOTT VERZIÓ
function buildFinalPromptString() {
    let promptParts = Array.from(finalPromptContainer.querySelectorAll('.prompt-tag:not(.param-display-tag)'))
        .map(tag => {
            // A tag szövegét a ":súly" rész nélkül vesszük
            const cleanText = tag.textContent.replace(/:\d\.\d$/, '').trim();
            // A törlés gomb szövegét ('×') levágjuk a végéről
            return cleanText.endsWith('×') ? cleanText.slice(0, -1).trim() : cleanText;
        });
    let finalString = promptParts.join(', ');
    if (selectedParameter) finalString += ` ${selectedParameter}`;
    return finalString;
}
    
    function updateFinalPrompt() {
        const finalPromptText = buildFinalPromptString();
        finalPromptHiddenTextarea.value = finalPromptText;
        const existingParamTag = finalPromptContainer.querySelector('.param-display-tag');
        if (existingParamTag) existingParamTag.remove();
        if (selectedParameter) {
            const paramTag = document.createElement('span');
            paramTag.className = 'prompt-tag param-display-tag';
            paramTag.textContent = selectedParameter;
            finalPromptContainer.appendChild(paramTag);
        }
        const placeholder = finalPromptContainer.querySelector('.placeholder-text');
        if (finalPromptContainer.querySelectorAll('.prompt-tag').length > 0) {
            if(placeholder) placeholder.style.display = 'none';
        } else {
             const lang = localStorage.getItem('preferredLanguage') || 'en';
             finalPromptContainer.innerHTML = `<span class="placeholder-text" data-key="finalPromptPlaceholder">${translations[lang].finalPromptPlaceholder}</span>`;
        }
        clearTimeout(historyTimeout);
        historyTimeout = setTimeout(() => {
            if (buildFinalPromptString()) saveToHistory(buildFinalPromptString());
        }, 1500);
    }

    function saveToHistory(promptText) {
        promptHistory = promptHistory.filter(p => p !== promptText);
        promptHistory.unshift(promptText);
        if (promptHistory.length > 20) promptHistory.pop();
        localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
    }

    // === FORDÍTÁS FUNKCIÓ ===
    async function handleTranslation() {
        const textToTranslate = buildFinalPromptString(); // A teljes promptot fordítjuk
        if (!textToTranslate) return;
    
        const icon = translateButton.querySelector('i');
        const originalIconClass = icon.className;
    
        try {
            icon.className = 'fa-solid fa-spinner fa-spin';
            translateButton.disabled = true;
    
            const response = await fetch('/.netlify/functions/translate', {
                method: 'POST',
                body: JSON.stringify({
                    text: textToTranslate,
                    target_lang: 'EN-US'
                })
            });
    
            if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
            const data = await response.json();
            if (data.error) throw new Error(data.details || data.error);
    
            const translatedText = data.translatedText;
    
            clearAll(); 
            finalPromptContainer.appendChild(createTag(translatedText, true));
            updateFinalPrompt();
    
        } catch (error) {
            console.error("Fordítási hiba:", error);
            alert(`Hiba történt a fordítás során: ${error.message}`);
        } finally {
            icon.className = originalIconClass;
            translateButton.disabled = false;
        }
    }

    // === CHOICES.JS INICIALIZÁLÁS ===
    function initializeChoices() {
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        const custom = JSON.parse(localStorage.getItem('customPrompts')) || {};
        const defaults = defaultPrompts[lang];
        const categories = {
            mainSubject: 'mainSubjectLabel', detail_physical: 'detailPhysicalLabel',
            detail_environment: 'detailEnvironmentLabel', detail_mood: 'detailMoodLabel',
            style: 'styleLabel', extra: 'extraLabel'
        };
        for (const category in categories) {
            const selectId = category.replace(/_/g, '-') + '-select';
            const selectElement = document.getElementById(selectId);
            if (!selectElement) continue;
            if (choiceInstances[category]) choiceInstances[category].destroy();
            const combinedSet = new Set([...(defaults[category] || []), ...(custom[category] || [])]);
            const options = [...combinedSet].map(item => ({ value: item, label: item }));
            const placeholderKey = categories[category];
            const placeholderText = translations[lang].selectDefault.replace('{category}', translations[lang][placeholderKey].replace(':', ''));
            choiceInstances[category] = new Choices(selectElement, { choices: options, searchPlaceholderValue: "Keress...", itemSelectText: "Kiválaszt", allowHTML: false, shouldSort: false, placeholder: true, placeholderValue: placeholderText });
        }
    }
    
    // === ÁLTALÁNOS FUNKCIÓK ===
    function clearAll() {
        Object.values(tagContainers).forEach(c => { if(c) c.innerHTML = ''; });
        if(finalPromptContainer) finalPromptContainer.innerHTML = '';
        if (negativePromptTextarea) negativePromptTextarea.value = '';
        activeWeightedTag = null;
        document.querySelectorAll('.param-btn').forEach(btn => btn.classList.remove('active'));
        const defaultParamBtn = document.querySelector('.param-btn[data-param=""]');
        if(defaultParamBtn) defaultParamBtn.classList.add('active');
        selectedParameter = '';
        if(weightSlider) {
            weightSlider.value = 1.0;
            weightSlider.disabled = true;
            if (weightValue) weightValue.textContent = '1.0';
        }
        updateFinalPrompt();
    }
    
    function generateRandomPrompt() {
        clearAll();
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        const prompts = defaultPrompts[lang];
        const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const items = [
            { text: getRandomItem(prompts.mainSubject), container: tagContainers.mainSubject }, { text: getRandomItem(prompts.detail_physical), container: tagContainers.details },
            { text: getRandomItem(prompts.detail_environment), container: tagContainers.details }, { text: getRandomItem(prompts.detail_mood), container: tagContainers.details },
            { text: getRandomItem(prompts.style), container: tagContainers.style }, { text: getRandomItem(prompts.extra), container: tagContainers.extra }
        ];
        items.forEach(item => {
            const categoryTag = createTag(item.text, false);
            const finalTag = createTag(item.text, true);
            item.container.appendChild(categoryTag);
            finalPromptContainer.appendChild(finalTag);
        });
        updateFinalPrompt();
    }

    function loadPromptFromStorage() {
        const promptToLoad = localStorage.getItem('promptToLoad');
        if (promptToLoad) {
            clearAll();
            const parts = promptToLoad.split(',').map(p => p.trim()).filter(p => p);
            parts.forEach(part => {
                finalPromptContainer.appendChild(createTag(part, true));
            });
            updateFinalPrompt();
            localStorage.removeItem('promptToLoad');
        }
    }

    // === INTERAKTÍV MODULOK LOGIKÁJA ===
    function initializeStyleMixer() {
        const mixerSection = document.getElementById('style-mixer-section');
        if (!mixerSection) return;
        const rerollBtns = mixerSection.querySelectorAll('.reroll-btn');
        const applyBtn = mixerSection.querySelector('#apply-mixer-btn');
        const resultDivs = { mainSubject: document.getElementById('mixer-result-subject'), style: document.getElementById('mixer-result-style'), detail_mood: document.getElementById('mixer-result-mood') };
        function generateRandomMixerItem(category) {
            const lang = localStorage.getItem('preferredLanguage') || 'en';
            const prompts = defaultPrompts[lang][category];
            if (prompts && prompts.length > 0 && resultDivs[category]) {
                resultDivs[category].textContent = prompts[Math.floor(Math.random() * prompts.length)];
            }
        }
        rerollBtns.forEach(btn => btn.addEventListener('click', () => generateRandomMixerItem(btn.dataset.category)));
        applyBtn.addEventListener('click', () => {
            const itemsToAdd = [
                { text: resultDivs.mainSubject.textContent, container: tagContainers.mainSubject },
                { text: resultDivs.style.textContent, container: tagContainers.style },
                { text: resultDivs.detail_mood.textContent, container: tagContainers.details }
            ];
            itemsToAdd.forEach(item => {
                if(item.text && item.text !== '...') {
                    item.container.appendChild(createTag(item.text, false));
                    finalPromptContainer.appendChild(createTag(item.text, true));
                }
            });
            updateFinalPrompt();
        });
        generateRandomMixerItem('mainSubject');
        generateRandomMixerItem('style');
        generateRandomMixerItem('detail_mood');
    }

    function initializeNegativeHelper() {
        const negativePromptHelperBtn = document.getElementById('negative-prompt-helper-btn');
        const negativeHelperModal = document.getElementById('negative-helper-modal');
        if (!negativeHelperModal || !negativePromptHelperBtn) return;
        const contentDiv = document.getElementById('negative-helper-content');
        const addBtn = document.getElementById('add-negative-tags-btn');
        const closeBtn = negativeHelperModal.querySelector('.close-modal-btn');
        negativePromptHelperBtn.addEventListener('click', () => {
            const lang = localStorage.getItem('preferredLanguage') || 'en';
            const categoriesData = translations[lang].negativeHelperCategories;
            contentDiv.innerHTML = '';
            for (const categoryName in categoriesData) {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'negative-category';
                categoryDiv.innerHTML = `<h4>${categoryName}</h4>`;
                const tagsDiv = document.createElement('div');
                tagsDiv.className = 'negative-tags';
                categoriesData[categoryName].forEach(tagText => {
                    const tag = document.createElement('span');
                    tag.className = 'negative-tag';
                    tag.textContent = tagText;
                    tagsDiv.appendChild(tag);
                });
                categoryDiv.appendChild(tagsDiv);
                contentDiv.appendChild(categoryDiv);
            }
            openModal(negativeHelperModal);
        });
        contentDiv.addEventListener('click', (e) => {
            if (e.target.classList.contains('negative-tag')) e.target.classList.toggle('selected');
        });
        addBtn.addEventListener('click', () => {
            const selectedTags = Array.from(contentDiv.querySelectorAll('.negative-tag.selected')).map(tag => tag.textContent);
            if (selectedTags.length > 0) {
                const currentText = negativePromptTextarea.value.trim();
                negativePromptTextarea.value = (currentText ? currentText + ', ' : '') + selectedTags.join(', ');
            }
            closeModal(negativeHelperModal);
        });
        if (closeBtn) closeBtn.addEventListener('click', () => closeModal(negativeHelperModal));
    }

    function initializeRecipeModals() {
        const saveBtn = document.getElementById('save-recipe-btn');
        const loadBtn = document.getElementById('load-recipe-btn');
        const saveModal = document.getElementById('save-recipe-modal');
        const loadModal = document.getElementById('load-recipe-modal');
        if (!saveBtn || !loadBtn || !saveModal || !loadModal) return;

        saveBtn.addEventListener('click', () => {
            if (finalPromptContainer.querySelectorAll('.prompt-tag').length > 0) openModal(saveModal);
        });
        saveModal.querySelector('#confirm-save-recipe-btn').addEventListener('click', () => {
            const name = saveModal.querySelector('#recipe-name-input').value.trim();
            if (name) {
                const recipe = {
                    mainSubject: Array.from(tagContainers.mainSubject.children).map(t => t.dataset.originalText),
                    details: Array.from(tagContainers.details.children).map(t => t.dataset.originalText),
                    style: Array.from(tagContainers.style.children).map(t => t.dataset.originalText),
                    extra: Array.from(tagContainers.extra.children).map(t => t.dataset.originalText),
                };
                let recipes = JSON.parse(localStorage.getItem('savedRecipes')) || {};
                recipes[name] = recipe;
                localStorage.setItem('savedRecipes', JSON.stringify(recipes));
                saveModal.querySelector('#recipe-name-input').value = '';
                closeModal(saveModal);
            }
        });
        function populateLoadModal() {
            const listDiv = loadModal.querySelector('#saved-recipes-list');
            const recipes = JSON.parse(localStorage.getItem('savedRecipes')) || {};
            listDiv.innerHTML = '';
            if (Object.keys(recipes).length === 0) {
                const lang = localStorage.getItem('preferredLanguage') || 'en';
                listDiv.innerHTML = `<p>${translations[lang].noRecipesSaved}</p>`;
                return;
            }
            for (const name in recipes) {
                const item = document.createElement('div');
                item.className = 'saved-recipe-item';
                item.innerHTML = `
                    <span class="recipe-name">${name}</span>
                    <div class="recipe-actions">
                        <button class="load-recipe" data-name="${name}" data-key="recipeLoadBtn"></button>
                        <button class="delete-recipe" data-name="${name}" data-key="recipeDeleteBtn"></button>
                    </div>`;
                listDiv.appendChild(item);
            }
            window.setLanguage(localStorage.getItem('preferredLanguage') || 'en');
        }
        loadBtn.addEventListener('click', () => {
            populateLoadModal();
            openModal(loadModal);
        });
        loadModal.addEventListener('click', (e) => {
            const target = e.target;
            const recipeName = target.dataset.name;
            if (!recipeName) return;
            if (target.classList.contains('load-recipe')) {
                const recipes = JSON.parse(localStorage.getItem('savedRecipes'));
                const recipe = recipes[recipeName];
                if (recipe) {
                    clearAll();
                    for (const category in recipe) {
                        if (tagContainers[category]) {
                            recipe[category].forEach(text => {
                                tagContainers[category].appendChild(createTag(text, false));
                                finalPromptContainer.appendChild(createTag(text, true));
                            });
                        }
                    }
                    updateFinalPrompt();
                    closeModal(loadModal);
                }
            } else if (target.classList.contains('delete-recipe')) {
                let recipes = JSON.parse(localStorage.getItem('savedRecipes'));
                delete recipes[recipeName];
                localStorage.setItem('savedRecipes', JSON.stringify(recipes));
                populateLoadModal();
            }
        });
        saveModal.querySelector('.close-modal-btn').addEventListener('click', () => closeModal(saveModal));
        loadModal.querySelector('.close-modal-btn').addEventListener('click', () => closeModal(loadModal));
    }

    // === ESEMÉNYKEZELŐK ===
    function initializeEventListeners() {
        if (translateButton) translateButton.addEventListener('click', handleTranslation);

        document.querySelectorAll('.add-button').forEach(button => {
            button.addEventListener('click', function() {
                const parentGroup = this.closest('.input-group');
                const selectElement = parentGroup.querySelector('select');
                const inputElement = parentGroup.querySelector('.new-prompt-input');
                const categoryKey = selectElement.id.replace(/-select$/, '').replace(/-/g, '_');
                const choiceInstance = choiceInstances[categoryKey];
                let valueToAdd = inputElement.value.trim();
                if (!valueToAdd && choiceInstance) valueToAdd = choiceInstance.getValue(true);
                if (valueToAdd) {
                    const outputCategoryKey = this.dataset.category === 'details' ? 'details' : this.dataset.category;
                    const categoryContainer = tagContainers[outputCategoryKey];
                    categoryContainer.appendChild(createTag(valueToAdd, false));
                    finalPromptContainer.appendChild(createTag(valueToAdd, true));
                    updateFinalPrompt();
                    inputElement.value = '';
                    if (choiceInstance) {
                        choiceInstance.clearInput();
                        choiceInstance.setChoiceByValue('');
                    }
                }
            });
        });

        document.querySelector('main').addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('delete-tag')) {
                const tagToRemove = e.target.parentElement;
                const textToRemove = tagToRemove.dataset.originalText;
                tagToRemove.remove();
                if (tagToRemove.classList.contains('prompt-tag')) {
                     Object.values(tagContainers).forEach(container => {
                        const tagInCategory = [...container.querySelectorAll('.prompt-input-tag')].find(t => t.dataset.originalText === textToRemove);
                        if (tagInCategory) tagInCategory.remove();
                    });
                } else {
                    const tagInFinal = [...finalPromptContainer.querySelectorAll('.prompt-tag')].find(t => t.dataset.originalText === textToRemove);
                    if (tagInFinal) tagInFinal.remove();
                }
                updateFinalPrompt();
            }
        });
        
        if (copyButton) copyButton.addEventListener('click', () => {
            if (finalPromptHiddenTextarea.value) navigator.clipboard.writeText(finalPromptHiddenTextarea.value).then(() => {
                const originalContent = copyButton.innerHTML;
                const lang = localStorage.getItem('preferredLanguage') || 'en';
                copyButton.innerHTML = `<i class="fa-solid fa-check"></i> <span>${translations[lang].copyButtonSuccess}</span>`;
                setTimeout(() => { copyButton.innerHTML = originalContent; }, 2000);
            });
        });

        if (copyNegativeButton) copyNegativeButton.addEventListener('click', () => {
            if (negativePromptTextarea.value) navigator.clipboard.writeText(negativePromptTextarea.value).then(() => {
                const icon = copyNegativeButton.querySelector('i');
                icon.className = 'fa-solid fa-check';
                setTimeout(() => { icon.className = 'fa-solid fa-copy'; }, 2000);
            });
        });
        
        if (randomButton) randomButton.addEventListener('click', generateRandomPrompt);
        if (clearAllButton) clearAllButton.addEventListener('click', clearAll);

        document.querySelectorAll('.param-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.param-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedParameter = this.dataset.param;
                updateFinalPrompt();
            });
        });
        
        if (finalPromptContainer) finalPromptContainer.addEventListener('click', (e) => {
            const targetTag = e.target.closest('.prompt-tag:not(.param-display-tag)');
            finalPromptContainer.querySelectorAll('.prompt-tag').forEach(t => t.classList.remove('active-weight'));
            if (targetTag) {
                activeWeightedTag = targetTag;
                activeWeightedTag.classList.add('active-weight');
                weightSlider.disabled = false;
                const currentWeight = activeWeightedTag.dataset.weight || '1.0';
                weightSlider.value = currentWeight;
                weightValue.textContent = parseFloat(currentWeight).toFixed(1);
            } else {
                activeWeightedTag = null;
                weightSlider.disabled = true;
                weightSlider.value = 1.0;
                weightValue.textContent = '1.0';
            }
        });

        if (weightSlider) weightSlider.addEventListener('input', () => {
            if (activeWeightedTag) {
                const weight = parseFloat(weightSlider.value).toFixed(1);
                weightValue.textContent = weight;
                activeWeightedTag.dataset.weight = weight;
                let originalText = activeWeightedTag.dataset.originalText;
                let newTextContent = (weight !== '1.0') ? `${originalText}:${weight}` : originalText;
                activeWeightedTag.firstChild.nodeValue = newTextContent;
                if (weight !== '1.0') activeWeightedTag.classList.add('is-weighted');
                else {
                    activeWeightedTag.classList.remove('is-weighted');
                    delete activeWeightedTag.dataset.weight;
                }
                updateFinalPrompt();
            }
        });

        if (resetWeightsBtn) resetWeightsBtn.addEventListener('click', () => {
            finalPromptContainer.querySelectorAll('.prompt-tag.is-weighted').forEach(tag => {
                tag.firstChild.nodeValue = tag.dataset.originalText;
                delete tag.dataset.weight;
                tag.classList.remove('is-weighted');
            });
            if (activeWeightedTag) activeWeightedTag.classList.remove('active-weight');
            activeWeightedTag = null;
            weightSlider.value = 1.0;
            weightSlider.disabled = true;
            weightValue.textContent = '1.0';
            updateFinalPrompt();
        });
    }

    function initializePromptDoctor() {
    const doctorAccordion = document.getElementById('prompt-doctor-accordion');
    if (!doctorAccordion) return;

    const input = document.getElementById('prompt-doctor-input');
    const btn = document.getElementById('prompt-doctor-btn');
    const resultDiv = document.getElementById('prompt-doctor-result');
    const btnText = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.spinner');

    const updateAccordionHeight = () => {
        const accordionContent = resultDiv.closest('.accordion-content');
        if (accordionContent && doctorAccordion.classList.contains('active')) {
            accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
        }
    };

    // ILLESZD BE EZT AZ ÚJ, TELJES RÉSZT A TÖRÖLT HELYÉRE:
// ----------------------------------------------------
btn.addEventListener('click', async () => {
    const userPrompt = input.value.trim();
    if (!userPrompt) {
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        alert(lang === 'hu' ? 'Kérlek, írj be egy promptot az elemzéshez!' : 'Please enter a prompt to analyze!');
        return;
    }

    btnText.classList.add('hidden');
    spinner.classList.remove('hidden');
    btn.disabled = true;
    resultDiv.classList.add('hidden');
    updateAccordionHeight();

    try {
        const response = await fetch('/.netlify/functions/prompt-doctor', {
            method: 'POST',
            body: JSON.stringify({ userPrompt: userPrompt })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || `Network error: ${response.statusText}`);
        }

        const data = await response.json();
        let analysisText = data.analysis;

        const lang = localStorage.getItem('preferredLanguage') || 'en';

        if (lang === 'hu' && analysisText) {
            const translateResponse = await fetch('/.netlify/functions/translate', {
                method: 'POST',
                body: JSON.stringify({
                    text: analysisText,
                    target_lang: 'HU'
                })
            });
            if (translateResponse.ok) {
                const translatedData = await translateResponse.json();
                analysisText = translatedData.translatedText;
            }
        }
        
        // Először láthatatlanná tesszük a dobozt, hogy ne "ugráljon"
        resultDiv.style.visibility = 'hidden';
        resultDiv.classList.remove('hidden');

        if (typeof showdown !== 'undefined') {
            // Itt a fontos változás: simpleLineBreaks: true
            const converter = new showdown.Converter({ openLinksInNewWindow: true, noHeaderId: true, simpleLineBreaks: true });
            resultDiv.innerHTML = converter.makeHtml(analysisText);
        } else {
            resultDiv.textContent = analysisText;
        }

    } catch (error) {
        console.error("Prompt Doktor error:", error);
        resultDiv.innerHTML = `<p style="color: #ff6b6b;">Hiba történt: ${error.message}</p>`;
        resultDiv.classList.remove('hidden');
    } finally {
        btnText.classList.remove('hidden');
        spinner.classList.add('hidden');
        btn.disabled = false;
        // A magasság frissítése után tesszük újra láthatóvá
        setTimeout(() => {
            updateAccordionHeight();
            resultDiv.style.visibility = 'visible';
        }, 50); 
    }
});
// ----------------------------------------------------
// EDDIG TART AZ ÚJ BLOKK
}
    // === INDÍTÁS ===
    loadPromptFromStorage();
    initializeChoices();
    initializePromptPacks();
    initializePromptDoctor();
    initializeEventListeners();
    initializeStyleMixer();
    initializeNegativeHelper();
    initializeRecipeModals();
    updateFinalPrompt();
    
    if (typeof Sortable !== 'undefined' && finalPromptContainer) {
        new Sortable(finalPromptContainer, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            filter: '.param-display-tag',
            onEnd: updateFinalPrompt
        });
    }
    // === TEMATIKUS PROMPT CSOMAGOK ===
    // CSERÉLD LE A TELJES FUNKCIÓT ERRE A VISSZAÁLLÍTOTT VERZIÓRA:
async function initializePromptPacks() {
    const selectElement = document.getElementById('prompt-pack-select');
    const loadBtn = document.getElementById('load-pack-btn');
    if (!selectElement || !loadBtn) return;

    try {
        const response = await fetch('/_data/prompt-packs.json');
        promptPacks = await response.json();
        const lang = localStorage.getItem('preferredLanguage') || 'en';

        const options = promptPacks.map(pack => ({
            value: pack.id,
            label: (lang === 'hu' ? pack.name_hu : pack.name_en)
        }));
        
        const placeholderText = translations[lang].promptPackDefault || "Choose a pack...";

        if (choiceInstances.promptPacks) {
            choiceInstances.promptPacks.destroy();
        }
        choiceInstances.promptPacks = new Choices(selectElement, {
            choices: options,
            searchEnabled: false,
            itemSelectText: '',
            allowHTML: false,
            shouldSort: false,
            placeholder: true,
            placeholderValue: placeholderText
        });

        loadBtn.addEventListener('click', () => {
            const selectedPackId = choiceInstances.promptPacks.getValue(true);
            if (!selectedPackId) return;

            const selectedPack = promptPacks.find(p => p.id === selectedPackId);
            if (!selectedPack) return;

            Object.values(tagContainers).forEach(c => c.innerHTML = '');
            finalPromptContainer.innerHTML = '';
            activeWeightedTag = null;
            if(weightSlider) weightSlider.disabled = true;

            for (const category in selectedPack.prompts) {
                const keywords = selectedPack.prompts[category];
                // Kicsit javítottam a logikán, hogy biztosan jó helyre kerüljenek a tagek
                const containerKey = Object.keys(tagContainers).find(key => category.includes(key)) || 'details';
                const container = tagContainers[containerKey];
                
                if (container) {
                    keywords.forEach(keyword => {
                        container.appendChild(createTag(keyword, false));
                        finalPromptContainer.appendChild(createTag(keyword, true));
                    });
                }
            }
            updateFinalPrompt();
        });

    } catch (error) {
        console.error("Hiba a prompt csomagok betöltésekor:", error);
        document.getElementById('prompt-pack-section').innerHTML = "<p>A csomagok nem érhetőek el.</p>";
    }
}
}