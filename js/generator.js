// ===== Alkimista Műhely - Generátor Szkript (generator.js) - VÉGLEGES, TELJES VERZIÓ =====
// Ez a fájl tartalmazza a generator.html oldal teljes és javított logikáját.

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
    const negativePromptHelperBtn = document.getElementById('negative-prompt-helper-btn');
    const negativeHelperModal = document.getElementById('negative-helper-modal');
    const overlay = document.getElementById('modal-overlay');
    
    let choiceInstances = {};
    let selectedParameter = '';
    let historyTimeout;
    let promptHistory = JSON.parse(localStorage.getItem('promptHistory')) || [];
    let activeWeightedTag = null;

    // === ALAP FUNKCIÓK ===
    function openModal(modal) { if (overlay) overlay.classList.remove('hidden'); if (modal) modal.classList.remove('hidden'); }
    function closeModal(modal) {
        if (modal) modal.classList.add('hidden');
        const anyModalOpen = document.querySelector('.modal:not(.hidden)');
        if (!anyModalOpen && overlay) overlay.classList.add('hidden');
    }

    // === CÍMKE KEZELŐ FUNKCIÓK ===
    function createTag(text, isDraggable = false) {
        const tag = document.createElement('span');
        tag.textContent = text;
        tag.dataset.originalText = text;
    
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '&times;';
        deleteBtn.title = 'Törlés';
    
        if (isDraggable) {
            tag.className = 'prompt-tag';
            deleteBtn.className = 'delete-tag final-delete';
        } else {
            tag.className = 'prompt-input-tag';
            deleteBtn.className = 'delete-tag category-delete';
        }
    
        tag.appendChild(deleteBtn);
        return tag;
    }

    // === VÉGLEGES PROMPT FRISSÍTÉSE ===
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
        if (allTags.length === 0) {
            const lang = localStorage.getItem('preferredLanguage') || 'en';
            finalPromptContainer.innerHTML = `<span class="placeholder-text" data-key="finalPromptPlaceholder">${translations[lang].finalPromptPlaceholder}</span>`;
        }
        
        clearTimeout(historyTimeout);
        historyTimeout = setTimeout(() => {
            const currentPrompt = buildFinalPromptString();
            if (currentPrompt) saveToHistory(currentPrompt);
        }, 1500);
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
            const placeholderText = translations[lang].selectDefault.replace('{category}', translations[lang][categories[category]].replace(':', ''));
            choiceInstances[category] = new Choices(selectElement, { choices: options, searchPlaceholderValue: "Keress...", itemSelectText: "Kiválaszt", allowHTML: false, shouldSort: false, placeholder: true, placeholderValue: placeholderText });
        }
    }

    // === FŐGOMBOK ÉS VEZÉRLŐK ===
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
    
    function clearAll() {
        Object.values(tagContainers).forEach(c => { if(c) c.innerHTML = ''; });
        if(finalPromptContainer) finalPromptContainer.innerHTML = '';
        if (negativePromptTextarea) negativePromptTextarea.value = '';
        activeWeightedTag = null;
        document.querySelectorAll('.param-btn').forEach(btn => btn.classList.remove('active'));
        const defaultParamBtn = document.querySelector('.param-btn[data-param=""]');
        if(defaultParamBtn) defaultParamBtn.classList.add('active');
        selectedParameter = '';
        const weightSlider = document.getElementById('weight-slider');
        if(weightSlider) {
            weightSlider.value = 1.0;
            document.getElementById('weight-value').textContent = '1.0';
        }
        updateFinalPrompt();
    }

    // === STÍLUSKEVERŐ ===
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
             const subject = resultDivs.mainSubject.textContent;
             const style = resultDivs.style.textContent;
             const mood = resultDivs.detail_mood.textContent;

             if (finalPromptContainer.querySelector('.placeholder-text')) finalPromptContainer.innerHTML = '';
             
             tagContainers.mainSubject.appendChild(createTag(subject, false));
             finalPromptContainer.appendChild(createTag(subject, true));
             
             tagContainers.style.appendChild(createTag(style, false));
             finalPromptContainer.appendChild(createTag(style, true));
             
             tagContainers.details.appendChild(createTag(mood, false));
             finalPromptContainer.appendChild(createTag(mood, true));
             
             updateFinalPrompt();
        });
        
        generateRandomMixerItem('mainSubject');
        generateRandomMixerItem('style');
        generateRandomMixerItem('detail_mood');
    }

    // === NEGATÍV PROMPT SEGÉDLET ===
    function initializeNegativeHelper() {
        if (!negativeHelperModal || !negativePromptHelperBtn) return;
        const contentDiv = document.getElementById('negative-helper-content');
        const addBtn = document.getElementById('add-negative-tags-btn');
        const closeBtn = negativeHelperModal.querySelector('.close-modal-btn');

        negativePromptHelperBtn.addEventListener('click', () => {
            populateNegativeHelperModal();
            openModal(negativeHelperModal);
        });

        function populateNegativeHelperModal() {
            const lang = localStorage.getItem('preferredLanguage') || 'en';
            const categoriesData = translations[lang].negativeHelperCategories;
            contentDiv.innerHTML = '';
            for (const categoryName in categoriesData) {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'negative-category';
                const title = document.createElement('h4');
                title.textContent = categoryName;
                categoryDiv.appendChild(title);

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
        }
        
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
    
    // === ESEMÉNYKEZELŐK ===
    
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
                if (finalPromptContainer.querySelector('.placeholder-text')) finalPromptContainer.innerHTML = '';
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
        if (e.target.classList.contains('delete-tag')) {
            const tagToRemove = e.target.parentElement;
            const textToRemove = tagToRemove.dataset.originalText;
            tagToRemove.remove();

            if (e.target.classList.contains('final-delete')) {
                Object.values(tagContainers).forEach(container => {
                    const tagInCategory = container.querySelector(`.prompt-input-tag[data-original-text="${textToRemove}"]`);
                    if (tagInCategory) tagInCategory.remove();
                });
            } else if (e.target.classList.contains('category-delete')) {
                const tagInFinal = finalPromptContainer.querySelector(`.prompt-tag[data-original-text="${textToRemove}"]`);
                if (tagInFinal) tagInFinal.remove();
            }
            updateFinalPrompt();
        }
    });

    if (randomButton) randomButton.addEventListener('click', generateRandomPrompt);
    if (clearAllButton) clearAllButton.addEventListener('click', clearAll);

    // === DRAG & DROP INICIALIZÁLÁS ===
    if (typeof Sortable !== 'undefined') {
        new Sortable(finalPromptContainer, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            onEnd: updateFinalPrompt
        });
    }

    // === INICIALIZÁLÁS HÍVÁSOK ===
    initializeChoices();
    initializeStyleMixer();
    initializeNegativeHelper();
    updateFinalPrompt();
}