// ===== Alkimista Műhely - Generátor Szkript (generator.js) - VÉGLEGES, EGYESÍTETT VERZIÓ =====

document.addEventListener('DOMContentLoaded', () => {
    // A szkript csak akkor fusson le, ha a generátor oldalon vagyunk.
    // (Ehhez a generator.html <main> tag-jében kell lennie egy id="generator-page-identifier"-nek)
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
    const negativePromptHelperBtn = document.getElementById('negative-prompt-helper-btn');
    const negativeHelperModal = document.getElementById('negative-helper-modal');
    const overlay = document.getElementById('modal-overlay');
    const weightSlider = document.getElementById('weight-slider');
    const weightValue = document.getElementById('weight-value');
    const resetWeightsBtn = document.getElementById('reset-weights-btn');


    // === CÍMKE LÉTREHOZÁSA ===
    function createTag(text, isFinalPromptTag) {
        const tag = document.createElement('span');
        // A .replace(/:[\d.]+$/, '') levágja a végéről a súlyozást, ha van
        const originalText = text.replace(/:[\d.]+$/, '').trim();
        tag.textContent = text;
        tag.dataset.originalText = originalText; // Eredeti szöveg mentése

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '&times;';
        deleteBtn.className = 'delete-tag';
        deleteBtn.title = 'Törlés';
        tag.appendChild(deleteBtn);
        
        tag.className = isFinalPromptTag ? 'prompt-tag' : 'prompt-input-tag';

        return tag;
    }
    
    // === VÉGLEGES PROMPT FRISSÍTÉSE ===
    function buildFinalPromptString() {
        let promptParts = [];
        finalPromptContainer.querySelectorAll('.prompt-tag:not(.param-display-tag)').forEach(tag => {
            promptParts.push(tag.textContent);
        });
        let finalString = promptParts.join(', ');
        if (selectedParameter) {
            finalString += ` ${selectedParameter}`;
        }
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
        
        const allTags = finalPromptContainer.querySelectorAll('.prompt-tag');
        const placeholder = finalPromptContainer.querySelector('.placeholder-text');
        if (allTags.length > 0 && placeholder) {
            placeholder.style.display = 'none';
        } else if (allTags.length === 0) {
            const lang = localStorage.getItem('preferredLanguage') || 'en';
            finalPromptContainer.innerHTML = `<span class="placeholder-text" data-key="finalPromptPlaceholder">${translations[lang].finalPromptPlaceholder}</span>`;
        }

        clearTimeout(historyTimeout);
        historyTimeout = setTimeout(() => {
            const currentPrompt = buildFinalPromptString();
            if (currentPrompt) saveToHistory(currentPrompt);
        }, 1500);
    }

    function saveToHistory(promptText) {
        if (!promptText || promptText.trim() === '') return;
        promptHistory = promptHistory.filter(p => p !== promptText);
        promptHistory.unshift(promptText);
        if (promptHistory.length > 20) promptHistory.pop();
        localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
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
            
            choiceInstances[category] = new Choices(selectElement, { 
                choices: options, 
                searchPlaceholderValue: "Keress...", 
                itemSelectText: "Kiválaszt", 
                allowHTML: false, 
                shouldSort: false, 
                placeholder: true, 
                placeholderValue: placeholderText 
            });
        }
    }
    
    // === FŐGOMBOK ÉS VEZÉRLŐK ===
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
            { text: getRandomItem(prompts.mainSubject), container: tagContainers.mainSubject },
            { text: getRandomItem(prompts.detail_physical), container: tagContainers.details },
            { text: getRandomItem(prompts.detail_environment), container: tagContainers.details },
            { text: getRandomItem(prompts.detail_mood), container: tagContainers.details },
            { text: getRandomItem(prompts.style), container: tagContainers.style },
            { text: getRandomItem(prompts.extra), container: tagContainers.extra }
        ];

        items.forEach(item => {
            const categoryTag = createTag(item.text, false);
            const finalTag = createTag(item.text, true);
            item.container.appendChild(categoryTag);
            finalPromptContainer.appendChild(finalTag);
        });

        updateFinalPrompt();
    }

    // === PROMPT BETÖLTÉSE A GALÉRIÁBÓL ===
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

    // === ESEMÉNYKEZELŐK INICIALIZÁLÁSA ===
    function initializeEventListeners() {

        // --- CÍMKE HOZZÁADÁSA ---
        document.querySelectorAll('.add-button').forEach(button => {
            button.addEventListener('click', function() {
                const parentGroup = this.closest('.input-group');
                const selectElement = parentGroup.querySelector('select');
                const inputElement = parentGroup.querySelector('.new-prompt-input');
                const categoryKey = selectElement.id.replace(/-select$/, '').replace(/-/g, '_');
                const choiceInstance = choiceInstances[categoryKey];
                let valueToAdd = inputElement.value.trim();

                if (!valueToAdd && choiceInstance) {
                    valueToAdd = choiceInstance.getValue(true);
                }

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

        // --- CÍMKE TÖRLÉSE ---
        document.querySelector('main').addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('delete-tag')) {
                const tagToRemove = e.target.parentElement;
                const textToRemove = tagToRemove.dataset.originalText;
                
                // Első törlés: a címke, amire kattintottunk
                tagToRemove.remove();

                // Második törlés: a párja a másik konténerben
                if (tagToRemove.classList.contains('prompt-tag')) { // Ha a végső promptból töröltünk
                     Object.values(tagContainers).forEach(container => {
                        const tagInCategory = [...container.querySelectorAll('.prompt-input-tag')].find(t => t.dataset.originalText === textToRemove);
                        if (tagInCategory) tagInCategory.remove();
                    });
                } else { // Ha egy kategóriából töröltünk
                    const tagInFinal = [...finalPromptContainer.querySelectorAll('.prompt-tag')].find(t => t.dataset.originalText === textToRemove);
                    if (tagInFinal) tagInFinal.remove();
                }

                updateFinalPrompt();
            }
        });
        
        // --- GOMBOK ---
        if (copyButton) {
            copyButton.addEventListener('click', () => {
                const textToCopy = finalPromptHiddenTextarea.value;
                if (textToCopy) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        const originalContent = copyButton.innerHTML;
                        const lang = localStorage.getItem('preferredLanguage') || 'en';
                        copyButton.innerHTML = `<i class="fa-solid fa-check"></i> <span>${translations[lang].copyButtonSuccess}</span>`;
                        setTimeout(() => { copyButton.innerHTML = originalContent; }, 2000);
                    });
                }
            });
        }

        if (copyNegativeButton) {
            copyNegativeButton.addEventListener('click', () => {
                const textToCopy = negativePromptTextarea.value;
                if (textToCopy) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        const icon = copyNegativeButton.querySelector('i');
                        icon.className = 'fa-solid fa-check';
                        setTimeout(() => { icon.className = 'fa-solid fa-copy'; }, 2000);
                    });
                }
            });
        }
        
        if (randomButton) randomButton.addEventListener('click', generateRandomPrompt);
        if (clearAllButton) clearAllButton.addEventListener('click', clearAll);

        // --- PARAMÉTEREK ---
        document.querySelectorAll('.param-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.param-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedParameter = this.dataset.param;
                updateFinalPrompt();
            });
        });
        
        // --- SÚLYOZÁS ---
        if (finalPromptContainer) {
            finalPromptContainer.addEventListener('click', (e) => {
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
        }

        if (weightSlider) {
            weightSlider.addEventListener('input', () => {
                if (activeWeightedTag) {
                    const weight = parseFloat(weightSlider.value).toFixed(1);
                    weightValue.textContent = weight;
                    activeWeightedTag.dataset.weight = weight;
                    
                    let originalText = activeWeightedTag.dataset.originalText;
                    let newTextContent = (weight !== '1.0') ? `${originalText}:${weight}` : originalText;
                    
                    // Frissítjük a textContent-et, de a gombot békén hagyjuk
                    activeWeightedTag.firstChild.nodeValue = newTextContent;
                    
                    if (weight !== '1.0') {
                         activeWeightedTag.classList.add('is-weighted');
                    } else {
                         activeWeightedTag.classList.remove('is-weighted');
                         delete activeWeightedTag.dataset.weight;
                    }
                    updateFinalPrompt();
                }
            });
        }

        if (resetWeightsBtn) {
            resetWeightsBtn.addEventListener('click', () => {
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
    }

    // === INDÍTÁS ===
    loadPromptFromStorage();
    initializeChoices();
    initializeEventListeners();
    updateFinalPrompt();
    
    // Drag & Drop inicializálása
    if (typeof Sortable !== 'undefined' && finalPromptContainer) {
        new Sortable(finalPromptContainer, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            filter: '.param-display-tag',
            onEnd: updateFinalPrompt
        });
    }
}