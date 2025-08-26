// ===== Alkimista Műhely - Generátor Szkript (generator.js) =====
// Ez a fájl tartalmazza a generator.html oldal teljes logikáját.
document.addEventListener('DOMContentLoaded', function() {
    // Csak akkor fusson le, ha tényleg a generátor oldalon vagyunk
    if (document.querySelector('.final-prompt-section')) {
        initializeGeneratorLogic();
    }
});

function initializeGeneratorLogic() {
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

    let promptHistory = [];
    let historyTimeout;
    let choiceInstances = {};
    let selectedParameter = '';
    let activeWeightedTag = null;
    
    function getCustomPrompts() { 
        return JSON.parse(localStorage.getItem('customPrompts')) || { mainSubject: [], detail_physical: [], detail_environment: [], detail_mood: [], style: [], extra: [] }; 
    }
    function saveCustomPrompts(customPrompts) { 
        localStorage.setItem('customPrompts', JSON.stringify(customPrompts)); 
    }

    function openModal(modal) { 
        const overlay = document.getElementById('modal-overlay');
        overlay.classList.remove('hidden'); 
        modal.classList.remove('hidden'); 
    }

    function updateFinalPrompt(preserveActiveTag = false) {
        if (!finalPromptContainer) return;
        let activeTagInfo = null;
        if (preserveActiveTag && activeWeightedTag) {
            activeTagInfo = { text: activeWeightedTag.dataset.originalText, weight: activeWeightedTag.dataset.weight };
        }
        finalPromptContainer.innerHTML = '';
        const allParts = [];
        ['mainSubject', 'details', 'style', 'extra'].forEach(category => {
            const container = tagContainers[category];
            if (container) {
                container.querySelectorAll('.prompt-input-tag').forEach(tag => {
                    const promptText = tag.dataset.originalText || tag.firstChild.textContent.trim();
                    if (promptText) allParts.push({text: promptText, weight: tag.dataset.weight || '1.0'});
                });
            }
        });

        allParts.forEach(part => {
            const tag = document.createElement('span');
            tag.className = 'prompt-tag';
            tag.dataset.originalText = part.text;
            finalPromptContainer.appendChild(tag);
            applyWeight(tag, part.weight);
        });

        if (activeTagInfo) {
            const newActiveTag = Array.from(finalPromptContainer.querySelectorAll('.prompt-tag')).find(t => t.dataset.originalText === activeTagInfo.text);
            if (newActiveTag) {
                activeWeightedTag = newActiveTag;
                activeWeightedTag.classList.add('active-weight');
            } else {
                activeWeightedTag = null;
            }
        } else {
             activeWeightedTag = null;
        }

        const finalPromptTextWithParams = buildFinalPromptString();
        finalPromptHiddenTextarea.value = finalPromptTextWithParams;

        if (selectedParameter) {
            const paramTag = document.createElement('span');
            paramTag.className = 'prompt-tag param-display-tag';
            paramTag.textContent = selectedParameter;
            finalPromptContainer.appendChild(paramTag);
        }

        if (allParts.length === 0 && !selectedParameter) {
            finalPromptContainer.innerHTML = `<span class="placeholder-text" data-key="finalPromptPlaceholder">${translations[localStorage.getItem('preferredLanguage') || 'en'].finalPromptPlaceholder}</span>`;
        }
        clearTimeout(historyTimeout);
        historyTimeout = setTimeout(() => { saveToHistory(finalPromptTextWithParams); }, 1500);
    }

    function applyWeight(tagElement, weight) {
        const originalText = tagElement.dataset.originalText || tagElement.textContent.replace(/^\(.*\)$/g, '').split(':')[0];
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

    function buildFinalPromptString() {
        if (!finalPromptContainer) return '';
        let promptParts = [];
        finalPromptContainer.querySelectorAll('.prompt-tag:not(.param-display-tag)').forEach(tag => {
            promptParts.push(tag.textContent);
        });
        let finalString = promptParts.join(', ');
        if (selectedParameter) finalString += ` ${selectedParameter}`;
        return finalString;
    }

    if (typeof Sortable !== 'undefined') {
        [...Object.values(tagContainers), finalPromptContainer].forEach(container => {
            if (container) {
                new Sortable(container, {
                    group: 'shared',
                    animation: 150,
                    ghostClass: 'sortable-ghost',
                    onEnd: function () {
                        updateFinalPrompt(true); 
                    }
                });
            }
        });
    }

    function getCombinedPrompts(lang) {
        const custom = getCustomPrompts();
        const defaults = defaultPrompts[lang];
        let combined = {};
        for (const category in defaults) {
            const customPromptsForCategory = custom[category] || [];
            const defaultPromptsForCategory = defaults[category] || [];
            const combinedSet = new Set([...defaultPromptsForCategory, ...customPromptsForCategory]);
            combined[category] = [...combinedSet];
        }
        return combined;
    }

    function initializeChoices() {
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        const combinedPrompts = getCombinedPrompts(lang);
        const categories = ['mainSubject', 'detail_physical', 'detail_environment', 'detail_mood', 'style', 'extra'];
        const categoryKeyMap = { mainSubject: 'mainSubjectLabel', detail_physical: 'detailPhysicalLabel', detail_environment: 'detailEnvironmentLabel', detail_mood: 'detailMoodLabel', style: 'styleLabel', extra: 'extraLabel' };
        
        categories.forEach(category => {
            const selectId = category.replace(/_/g, '-') + '-select';
            const selectElement = document.getElementById(selectId);
            if (!selectElement) return;
            if (choiceInstances[category]) {
                choiceInstances[category].destroy();
            }
            const options = (combinedPrompts[category] || []).map(item => ({ value: item, label: item }));
            const labelKey = categoryKeyMap[category];
            const placeholderText = translations[lang].selectDefault.replace('{category}', translations[lang][labelKey].replace(':', ''));
            
            choiceInstances[category] = new Choices(selectElement, {
                choices: options, searchPlaceholderValue: "Keress...", itemSelectText: "Kiválaszt", allowHTML: false, shouldSort: false, placeholder: true, placeholderValue: placeholderText,
            });
        });
    }

    function clearAll() {
        for (const key in tagContainers) {
            if (tagContainers[key]) {
                tagContainers[key].innerHTML = '';
            }
        }
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
    
    // Event listeners...
    document.querySelectorAll('.add-button').forEach(button => {
        button.addEventListener('click', function() {
            const outputCategory = this.dataset.category === 'details' 
                ? 'details' 
                : this.dataset.category;

            const finalContainer = tagContainers[outputCategory] || tagContainers.details;

            const parentSection = this.closest('.prompt-section, .detail-subsection');
            if (!parentSection) return;
            
            const inputElement = parentSection.querySelector('.new-prompt-input');
            const selectElement = parentSection.querySelector('select');
            
            const choiceKey = selectElement ? selectElement.id.replace(/-select$/, '').replace(/-/g, '_') : null;
            
            let selectedValue = (inputElement && inputElement.value.trim() !== '') 
                ? inputElement.value.trim() 
                : (selectElement && choiceInstances[choiceKey] ? (choiceInstances[choiceKey].getValue(true) || '') : '');

            if (selectedValue && finalContainer) {
                const tag = document.createElement('span');
                tag.className = 'prompt-input-tag';
                tag.textContent = selectedValue;
                tag.dataset.weight = '1.0';
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-tag';
                deleteBtn.innerHTML = '&times;';
                deleteBtn.title = 'Törlés';
                tag.appendChild(deleteBtn);
                
                finalContainer.appendChild(tag);
                updateFinalPrompt();
                
                if (inputElement) inputElement.value = '';
                if (selectElement && choiceInstances[choiceKey]) {
                    choiceInstances[choiceKey].clearInput();
                    choiceInstances[choiceKey].setChoiceByValue('');
                }
            }
        });
    });

    document.querySelector('main').addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-tag')) {
            const tagToRemove = e.target.parentElement;
            if (activeWeightedTag && activeWeightedTag.dataset.originalText === tagToRemove.dataset.originalText) {
                activeWeightedTag = null;
            }
            tagToRemove.remove();
            updateFinalPrompt(true);
        }
    });

    if(randomButton) randomButton.addEventListener('click', generateRandomPrompt);
    if(clearAllButton) clearAllButton.addEventListener('click', clearAll);

    // Folytatás a többi funkcióval és eseménykezelővel...
    // (A teljes, hosszú kód a régi script.js-ből ide másolva)
}
