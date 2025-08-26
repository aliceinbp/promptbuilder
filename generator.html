// ===== Alkimista Műhely - Generátor Szkript (generator.js) =====
// Ez a fájl tartalmazza a generator.html oldal teljes logikáját.

if (document.querySelector('.final-prompt-section')) {
    initializeGeneratorLogic();
}

function initializeGeneratorLogic() {
    // === VÁLTOZÓK ÉS ELEMEK ===
    const tagContainers = {
        mainSubject: document.getElementById('mainSubject-container'),
        details: document.getElementById('details-container'),
        style: document.getElementById('style-container'),
        extra: document.getElementById('extra-container')
    };
    const finalPromptContainer = document.getElementById('final-prompt-container');
    const finalPromptHiddenTextarea = document.getElementById('final-prompt-hidden');
    const negativePromptTextarea = document.getElementById('negative-prompt');
    const randomButton = document.getElementById('random-button');
    const clearAllButton = document.getElementById('clear-all-button');
    const negativePromptHelperBtn = document.getElementById('negative-prompt-helper-btn');
    const negativeHelperModal = document.getElementById('negative-helper-modal');
    const overlay = document.getElementById('modal-overlay');
    
    let choiceInstances = {};
    let selectedParameter = '';
    let historyTimeout;

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
        tag.dataset.originalText = text; // Eredeti szöveg mentése
    
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '&times;';
        deleteBtn.title = 'Törlés';
    
        if (isDraggable) {
            tag.className = 'prompt-tag'; // Mozgatható stílus
            deleteBtn.className = 'delete-tag final-delete'; // Megkülönböztetjük a törlő gombot
        } else {
            tag.className = 'prompt-input-tag'; // Fix stílus
            deleteBtn.className = 'delete-tag category-delete';
        }
    
        tag.appendChild(deleteBtn);
        return tag;
    }

    // === VÉGLEGES PROMPT FRISSÍTÉSE ===
    function updateFinalPrompt() {
        const finalPromptText = buildFinalPromptString();
        finalPromptHiddenTextarea.value = finalPromptText;

        const allTags = Array.from(finalPromptContainer.querySelectorAll('.prompt-tag'));
        if (allTags.length === 0 && !selectedParameter) {
            const lang = localStorage.getItem('preferredLanguage') || 'en';
            finalPromptContainer.innerHTML = `<span class="placeholder-text" data-key="finalPromptPlaceholder">${translations[lang].finalPromptPlaceholder}</span>`;
        } else if (selectedParameter && finalPromptContainer.querySelector('.param-display-tag') === null) {
             const paramTag = document.createElement('span');
             paramTag.className = 'prompt-tag param-display-tag';
             paramTag.textContent = selectedParameter;
             finalPromptContainer.appendChild(paramTag);
        }

        // Előzmények mentése késleltetve
        clearTimeout(historyTimeout);
        historyTimeout = setTimeout(() => {
            const currentPrompt = buildFinalPromptString();
            if (currentPrompt) saveToHistory(currentPrompt);
        }, 1500);
    }
    
    function buildFinalPromptString() {
        let promptParts = [];
        finalPromptContainer.querySelectorAll('.prompt-tag:not(.param-display-tag)').forEach(tag => {
            promptParts.push(tag.dataset.originalText); // Mindig az eredeti szöveget használjuk
        });
        let finalString = promptParts.join(', ');
        if (selectedParameter) finalString += ` ${selectedParameter}`;
        return finalString;
    }
    
    // === CHOICES.JS INICIALIZÁLÁS ===
    function initializeChoices() {
        // Ez a funkció változatlan maradt, nem másolom be újra a helytakarékosság miatt.
        // Ha mégis kell, szólj!
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

        addTagToContainer(getRandomItem(prompts.mainSubject), tagContainers.mainSubject);
        addTagToContainer(getRandomItem(prompts.detail_physical), tagContainers.details);
        addTagToContainer(getRandomItem(prompts.detail_environment), tagContainers.details);
        addTagToContainer(getRandomItem(prompts.detail_mood), tagContainers.details);
        addTagToContainer(getRandomItem(prompts.style), tagContainers.style);
        addTagToContainer(getRandomItem(prompts.extra), tagContainers.extra);
        
        // A végső promptot is feltöltjük
        Object.values(tagContainers).forEach(container => {
            container.querySelectorAll('.prompt-input-tag').forEach(tag => {
                const finalTag = createTag(tag.dataset.originalText, true);
                finalPromptContainer.appendChild(finalTag);
            });
        });
        updateFinalPrompt();
    }
    
    function clearAll() {
        Object.values(tagContainers).forEach(c => c.innerHTML = '');
        finalPromptContainer.innerHTML = '';
        if (negativePromptTextarea) negativePromptTextarea.value = '';
        document.querySelectorAll('.param-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.param-btn[data-param=""]').classList.add('active');
        selectedParameter = '';
        updateFinalPrompt();
    }

    // === STÍLUSKEVERŐ ===
    function initializeStyleMixer() {
        const mixerSection = document.getElementById('style-mixer-section');
        if (!mixerSection) return;
        // ... A stíluskeverő kódja változatlan, itt most nem ismétlem meg.
        const rerollBtns = mixerSection.querySelectorAll('.reroll-btn');
        const applyBtn = mixerSection.querySelector('#apply-mixer-btn');
        const resultDivs = { mainSubject: document.getElementById('mixer-result-subject'), style: document.getElementById('mixer-result-style'), detail_mood: document.getElementById('mixer-result-mood') };
        function generateRandomMixerItem(category) {
            const lang = localStorage.getItem('preferredLanguage') || 'en';
            const prompts = defaultPrompts[lang][category];
            if (prompts && prompts.length > 0 && resultDivs[category]) {
                const randomItem = prompts[Math.floor(Math.random() * prompts.length)];
                resultDivs[category].textContent = randomItem;
            }
        }
        rerollBtns.forEach(btn => btn.addEventListener('click', () => generateRandomMixerItem(btn.dataset.category)));
        applyBtn.addEventListener('click', () => {
             const subject = resultDivs.mainSubject.textContent;
             const style = resultDivs.style.textContent;
             const mood = resultDivs.detail_mood.textContent;
             // Hozzáadás mindkét helyre
             addTagToContainer(subject, tagContainers.mainSubject);
             addTagToContainer(subject, finalPromptContainer, true);
             addTagToContainer(style, tagContainers.style);
             addTagToContainer(style, finalPromptContainer, true);
             addTagToContainer(mood, tagContainers.details);
             addTagToContainer(mood, finalPromptContainer, true);
             updateFinalPrompt();
        });
        generateRandomMixerItem('mainSubject');
        generateRandomMixerItem('style');
        generateRandomMixerItem('detail_mood');
    }

    // === NEGATÍV PROMPT SEGÉDLET (JAVÍTOTT) ===
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
            const categories = translations[lang].negativeHelperCategories;
            contentDiv.innerHTML = '';

            for (const categoryKey in categories) {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'negative-category';
                const title = document.createElement('h4');
                // A kulcsot használjuk a fordításhoz
                const titleKey = `negativeCategory${categoryKey.replace(/\s+/g, '')}`;
                title.textContent = translations[lang][titleKey] || categoryKey;
                categoryDiv.appendChild(title);

                const tagsDiv = document.createElement('div');
                tagsDiv.className = 'negative-tags';
                categories[categoryKey].forEach(tagText => {
                    const tag = document.createElement('span');
                    tag.className = 'negative-tag';
                    tag.textContent = tagText;
                    tagsDiv.appendChild(tag);
                });
                categoryDiv.appendChild(categoryDiv);
                contentDiv.appendChild(categoryDiv);
            }
        }
        
        contentDiv.addEventListener('click', (e) => {
            if (e.target.classList.contains('negative-tag')) {
                e.target.classList.toggle('selected');
            }
        });

        addBtn.addEventListener('click', () => {
            const selectedTags = Array.from(contentDiv.querySelectorAll('.negative-tag.selected')).map(tag => tag.textContent);
            if (selectedTags.length > 0) {
                const currentText = negativePromptTextarea.value.trim();
                const newText = (currentText ? currentText + ', ' : '') + selectedTags.join(', ');
                negativePromptTextarea.value = newText;
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
                const outputCategoryKey = this.dataset.category === 'details' ? 'details' : this.dataset.category;
                const categoryContainer = tagContainers[outputCategoryKey];
                
                // Hozzáadás a kategória konténerhez (nem mozgatható)
                addTagToContainer(valueToAdd, categoryContainer, false);
                // Hozzáadás a végső prompt konténerhez (mozgatható)
                const finalTag = createTag(valueToAdd, true);
                finalPromptContainer.appendChild(finalTag);

                updateFinalPrompt();

                inputElement.value = '';
                if (choiceInstance) {
                    choiceInstance.clearInput();
                    choiceInstance.setChoiceByValue('');
                }
            }
        });
    });

    // Törlés gombok eseménykezelője
    document.querySelector('main').addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-tag')) {
            const tagToRemove = e.target.parentElement;
            const textToRemove = tagToRemove.dataset.originalText;
            
            // Ha a VÉGSŐ promptból törlünk
            if (e.target.classList.contains('final-delete')) {
                tagToRemove.remove(); // Töröljük a végsőből
                // Megkeressük és töröljük a párját a kategóriákból is
                Object.values(tagContainers).forEach(container => {
                    const tagInCategory = container.querySelector(`.prompt-input-tag[data-original-text="${textToRemove}"]`);
                    if (tagInCategory) tagInCategory.remove();
                });
            } 
            // Ha egy KATEGÓRIÁBÓL törlünk
            else if (e.target.classList.contains('category-delete')) {
                tagToRemove.remove(); // Töröljük a kategóriából
                // Megkeressük és töröljük a párját a végső promptból is
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
            group: 'shared-prompts',
            animation: 150,
            ghostClass: 'sortable-ghost',
            onEnd: updateFinalPrompt
        });
    }

    // === INICIALIZÁLÁS HÍVÁSOK ===
    initializeChoices();
    initializeStyleMixer();
    initializeNegativeHelper();
    updateFinalPrompt(); // Hogy a placeholder megjelenjen betöltéskor
}