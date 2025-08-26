// ===== Alkimista Műhely - Generátor Szkript (generator.js) =====
// Ez a fájl tartalmazza a generator.html oldal teljes logikáját.

if (document.querySelector('.final-prompt-section')) {
    initializeGeneratorLogic();
}

function initializeGeneratorLogic() {
    // === VÁLTOZÓK ÉS ELEMEK ===
    let currentManagedCategory = '';
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
    const managePromptsModal = document.getElementById('manage-prompts-modal');
    const historyModal = document.getElementById('history-modal');
    const historyButton = document.getElementById('history-button');
    const historyList = document.getElementById('history-list');
    const translateButton = document.getElementById('translate-button');
    const shareTwitterBtn = document.getElementById('share-twitter-btn');
    const shareFacebookBtn = document.getElementById('share-facebook-btn');
    const negativePromptHelperBtn = document.getElementById('negative-prompt-helper-btn');
    const saveRecipeBtn = document.getElementById('save-recipe-btn');
    const loadRecipeBtn = document.getElementById('load-recipe-btn');
    const saveRecipeModal = document.getElementById('save-recipe-modal');
    const loadRecipeModal = document.getElementById('load-recipe-modal');
    const negativeHelperModal = document.getElementById('negative-helper-modal');
    const overlay = document.getElementById('modal-overlay');

    let promptHistory = JSON.parse(localStorage.getItem('promptHistory')) || [];
    let historyTimeout;
    let choiceInstances = {};
    let selectedParameter = '';
    let activeWeightedTag = null;

    // === ALAP FUNKCIÓK ===
    function getCustomPrompts() { return JSON.parse(localStorage.getItem('customPrompts')) || { mainSubject: [], detail_physical: [], detail_environment: [], detail_mood: [], style: [], extra: [] }; }
    function saveCustomPrompts(customPrompts) { localStorage.setItem('customPrompts', JSON.stringify(customPrompts)); }
    function openModal(modal) { if (overlay) overlay.classList.remove('hidden'); if (modal) modal.classList.remove('hidden'); }
    function closeModal(modal) { if (overlay) overlay.classList.add('hidden'); if (modal) modal.classList.add('hidden'); }

    // === CÍMKE KEZELŐ FUNKCIÓK ===
    function addTagToContainer(text, container, weight = '1.0') {
        if (!text || !container) return;
        const tag = document.createElement('span');
        tag.className = 'prompt-input-tag';
        tag.dataset.originalText = text;
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-tag';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.title = 'Törlés';
        tag.appendChild(deleteBtn);
        container.appendChild(tag);
        applyWeight(tag, weight);
    }

    function applyWeight(tagElement, weight) {
        const originalText = tagElement.dataset.originalText || tagElement.textContent.replace(/:\d\.\d\)$/, '').replace(/^\(/, '');
        tagElement.dataset.originalText = originalText;
        tagElement.dataset.weight = weight;
        let deleteBtn = tagElement.querySelector('.delete-tag');
        if (parseFloat(weight) === 1.0) {
            tagElement.textContent = originalText;
            tagElement.classList.remove('is-weighted');
        } else {
            tagElement.textContent = `(${originalText}:${weight})`;
            tagElement.classList.add('is-weighted');
        }
        if (deleteBtn) {
            tagElement.appendChild(deleteBtn);
        }
    }

    // === VÉGLEGES PROMPT FRISSÍTÉSE ===
    function updateFinalPrompt() {
        if (!finalPromptContainer) return;
        finalPromptContainer.innerHTML = '';
        const allParts = [];
        ['mainSubject', 'details', 'style', 'extra'].forEach(category => {
            const container = tagContainers[category];
            if (container) {
                container.querySelectorAll('.prompt-input-tag').forEach(tag => {
                    const promptText = tag.dataset.originalText;
                    if (promptText) {
                        allParts.push({ text: promptText, weight: tag.dataset.weight || '1.0' });
                    }
                });
            }
        });

        allParts.forEach(part => {
            const tag = document.createElement('span');
            tag.className = 'prompt-tag';
            finalPromptContainer.appendChild(tag);
            applyWeight(tag, part.weight);
        });

        const finalPromptText = buildFinalPromptString();
        finalPromptHiddenTextarea.value = finalPromptText;

        if (selectedParameter) {
            const paramTag = document.createElement('span');
            paramTag.className = 'prompt-tag param-display-tag';
            paramTag.textContent = selectedParameter;
            finalPromptContainer.appendChild(paramTag);
        }

        if (allParts.length === 0 && !selectedParameter) {
            const lang = localStorage.getItem('preferredLanguage') || 'en';
            finalPromptContainer.innerHTML = `<span class="placeholder-text" data-key="finalPromptPlaceholder">${translations[lang].finalPromptPlaceholder}</span>`;
        }

        clearTimeout(historyTimeout);
        historyTimeout = setTimeout(() => { saveToHistory(finalPromptText); }, 1500);
    }

    function buildFinalPromptString() {
        let promptParts = [];
        finalPromptContainer.querySelectorAll('.prompt-tag:not(.param-display-tag)').forEach(tag => {
            promptParts.push(tag.textContent);
        });
        let finalString = promptParts.join(', ');
        if (selectedParameter) finalString += ` ${selectedParameter}`;
        return finalString;
    }
    
    // === CHOICES.JS INICIALIZÁLÁS ===
    function initializeChoices() {
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        const custom = getCustomPrompts();
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
            const placeholderText = translations[lang].selectDefault.replace('{category}', translations[lang][categories[category]].replace(':', ''));

            choiceInstances[category] = new Choices(selectElement, {
                choices: options, searchPlaceholderValue: "Keress...", itemSelectText: "Kiválaszt",
                allowHTML: false, shouldSort: false, placeholder: true, placeholderValue: placeholderText,
            });
        }
    }

    // === FŐGOMBOK FUNKCIÓI ===
    function generateRandomPrompt() {
        clearAll();
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        const prompts = defaultPrompts[lang];
        const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
        addTagToContainer(getRandomItem(prompts.mainSubject), tagContainers.mainSubject);
        addTagToContainer(getRandomItem(prompts.detail_physical), tagContainers.details);
        addTagToContainer(getRandomItem(prompts.detail_environment), tagContainers.details);
        addTagToContainer(getRandomItem(prompts.detail_mood), tagContainers.details);
        addTagToContainer(getRandomItem(prompts.style), tagContainers.style);
        addTagToContainer(getRandomItem(prompts.extra), tagContainers.extra);
        updateFinalPrompt();
    }

    function clearAll() {
        for (const key in tagContainers) {
            if (tagContainers[key]) tagContainers[key].innerHTML = '';
        }
        if (negativePromptTextarea) negativePromptTextarea.value = '';
        activeWeightedTag = null;
        document.querySelectorAll('.param-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.param-btn[data-param=""]').classList.add('active');
        selectedParameter = '';
        document.getElementById('weight-slider').value = 1.0;
        document.getElementById('weight-value').textContent = '1.0';
        updateFinalPrompt();
    }

    // === STÍLUSKEVERŐ FUNKCIÓ (ÚJ!) ===
    function initializeStyleMixer() {
        const mixerSection = document.getElementById('style-mixer-section');
        if (!mixerSection) return;

        const rerollBtns = mixerSection.querySelectorAll('.reroll-btn');
        const applyBtn = mixerSection.querySelector('#apply-mixer-btn');
        const resultDivs = {
            mainSubject: document.getElementById('mixer-result-subject'),
            style: document.getElementById('mixer-result-style'),
            detail_mood: document.getElementById('mixer-result-mood')
        };

        function generateRandomMixerItem(category) {
            const lang = localStorage.getItem('preferredLanguage') || 'en';
            const prompts = defaultPrompts[lang][category];
            if (prompts && prompts.length > 0 && resultDivs[category]) {
                const randomItem = prompts[Math.floor(Math.random() * prompts.length)];
                resultDivs[category].textContent = randomItem;
            }
        }

        rerollBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                generateRandomMixerItem(btn.dataset.category);
            });
        });

        applyBtn.addEventListener('click', () => {
            addTagToContainer(resultDivs.mainSubject.textContent, tagContainers.mainSubject);
            addTagToContainer(resultDivs.style.textContent, tagContainers.style);
            addTagToContainer(resultDivs.detail_mood.textContent, tagContainers.details);
            updateFinalPrompt();
        });

        // Kezdeti pörgetés az oldal betöltésekor
        generateRandomMixerItem('mainSubject');
        generateRandomMixerItem('style');
        generateRandomMixerItem('detail_mood');
    }


    // === ESEMÉNYKEZELŐK ===
    
    // Címke hozzáadása
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
                addTagToContainer(valueToAdd, tagContainers[outputCategoryKey]);
                updateFinalPrompt();
                inputElement.value = '';
                if (choiceInstance) {
                    choiceInstance.clearInput();
                    choiceInstance.setChoiceByValue('');
                }
            }
        });
    });

    // Címke törlése
    document.querySelector('main').addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-tag')) {
            const tagToRemove = e.target.parentElement;
            if (activeWeightedTag && activeWeightedTag === tagToRemove) activeWeightedTag = null;
            tagToRemove.remove();
            updateFinalPrompt();
        }
    });
    
    // Fő gombok
    if (randomButton) randomButton.addEventListener('click', generateRandomPrompt);
    if (clearAllButton) clearAllButton.addEventListener('click', clearAll);

    // Másolás gombok
    if (copyButton) {
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(finalPromptHiddenTextarea.value).then(() => {
                const originalContent = copyButton.innerHTML;
                const lang = localStorage.getItem('preferredLanguage') || 'en';
                copyButton.innerHTML = `<i class="fa-solid fa-check"></i> <span>${translations[lang].copyButtonSuccess}</span>`;
                setTimeout(() => { copyButton.innerHTML = originalContent; }, 1500);
            });
        });
    }
    if (copyNegativeButton) {
        copyNegativeButton.addEventListener('click', () => {
             navigator.clipboard.writeText(negativePromptTextarea.value);
        });
    }

    // Paraméter gombok
    document.querySelectorAll('.param-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.param-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedParameter = btn.dataset.param;
            updateFinalPrompt();
        });
    });

    // Súlyozás
    const weightSlider = document.getElementById('weight-slider');
    const weightValue = document.getElementById('weight-value');
    if (finalPromptContainer && weightSlider && weightValue) {
        finalPromptContainer.addEventListener('click', (e) => {
            const clickedTag = e.target.closest('.prompt-tag:not(.param-display-tag)');
            if (!clickedTag) return;

            if (activeWeightedTag) activeWeightedTag.classList.remove('active-weight');
            
            activeWeightedTag = clickedTag;
            activeWeightedTag.classList.add('active-weight');

            weightSlider.value = activeWeightedTag.dataset.weight || 1.0;
            weightValue.textContent = parseFloat(weightSlider.value).toFixed(1);
        });

        weightSlider.addEventListener('input', () => {
            if (activeWeightedTag) {
                const newWeight = parseFloat(weightSlider.value).toFixed(1);
                weightValue.textContent = newWeight;
                applyWeight(activeWeightedTag, newWeight);
                updateFinalPrompt(); 
            }
        });
        
        document.getElementById('reset-weights-btn').addEventListener('click', () => {
             if (activeWeightedTag) {
                 weightSlider.value = 1.0;
                 weightValue.textContent = '1.0';
                 applyWeight(activeWeightedTag, '1.0');
                 activeWeightedTag.classList.remove('active-weight');
                 activeWeightedTag = null;
                 updateFinalPrompt();
             }
        });
    }

    // === INICIALIZÁLÁS HÍVÁSOK ===
    initializeChoices();
    initializeStyleMixer(); // ÚJ FUNKCIÓ HÍVÁSA
}