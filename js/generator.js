// ===== Alkimista Műhely - Generátor Szkript (generator.js) - JAVÍTOTT, TELJES VERZIÓ =====

// A szkript csak akkor fusson le, ha az egész oldal betöltődött,
// és csak akkor, ha a generátor oldalon vagyunk.
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
    const negativePromptHelperBtn = document.getElementById('negative-prompt-helper-btn');
    const negativeHelperModal = document.getElementById('negative-helper-modal');
    const overlay = document.getElementById('modal-overlay');
    const weightSlider = document.getElementById('weight-slider');
    const weightValue = document.getElementById('weight-value');
    const resetWeightsBtn = document.getElementById('reset-weights-btn');


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
        tag.textContent = text;
        tag.dataset.originalText = text; // Eredeti szöveg mentése a súlyozáshoz

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '&times;';
        deleteBtn.title = 'Törlés';

        if (isFinalPromptTag) {
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
    function buildFinalPromptString() {
        let promptParts = [];
        finalPromptContainer.querySelectorAll('.prompt-tag:not(.param-display-tag)').forEach(tag => {
            promptParts.push(tag.textContent); // A látható szöveget használjuk, ami tartalmazza a súlyt
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

        // Paraméter címke kezelése
        const existingParamTag = finalPromptContainer.querySelector('.param-display-tag');
        if (existingParamTag) existingParamTag.remove();
        if (selectedParameter) {
            const paramTag = document.createElement('span');
            paramTag.className = 'prompt-tag param-display-tag';
            paramTag.textContent = selectedParameter;
            finalPromptContainer.appendChild(paramTag);
        }

        // Helykitöltő szöveg kezelése
        const allTags = finalPromptContainer.querySelectorAll('.prompt-tag');
        const placeholder = finalPromptContainer.querySelector('.placeholder-text');
        if (allTags.length > 0 && placeholder) {
            placeholder.style.display = 'none';
        } else if (allTags.length === 0 && !placeholder) {
            const lang = localStorage.getItem('preferredLanguage') || 'en';
            finalPromptContainer.innerHTML = `<span class="placeholder-text" data-key="finalPromptPlaceholder">${translations[lang].finalPromptPlaceholder}</span>`;
        } else if (allTags.length === 0 && placeholder) {
            placeholder.style.display = 'block';
        }

        // Előzmények mentése késleltetve
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
            const placeholderText = translations[lang].selectDefault.replace('{category}', translations[lang][categories[category]].replace(':', ''));
            choiceInstances[category] = new Choices(selectElement, { choices: options, searchPlaceholderValue: "Keress...", itemSelectText: "Kiválaszt", allowHTML: false, shouldSort: false, placeholder: true, placeholderValue: placeholderText });
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

    // === PROMPT BETÖLTÉSE A GALÉRIÁBÓL (LOCALSTORAGE) ===
    function loadPromptFromStorage() {
        const promptToLoad = localStorage.getItem('promptToLoad');
        if (promptToLoad) {
            clearAll();
            const parts = promptToLoad.split(',').map(p => p.trim()).filter(p => p);
            
            parts.forEach(part => {
                // A betöltött prompt részei csak a végső dobozba kerülnek, mert nem tudjuk, melyik kategóriából jöttek
                finalPromptContainer.appendChild(createTag(part, true));
            });
            
            updateFinalPrompt();
            localStorage.removeItem('promptToLoad'); // Kitakarítjuk magunk után
        }
    }

    // === ESEMÉNYKEZELŐK INICIALIZÁLÁSA (AZ ÖSSZES HIÁNYZÓ GOMB LOGIKÁJA ITT VAN) ===
    function initializeEventListeners() {

        // Fő prompt másolása
        if (copyButton) {
            copyButton.addEventListener('click', () => {
                const textToCopy = finalPromptHiddenTextarea.value;
                if (textToCopy) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        const originalContent = copyButton.innerHTML;
                        const lang = localStorage.getItem('preferredLanguage') || 'en';
                        copyButton.innerHTML = `<i class="fa-solid fa-check"></i> <span>${translations[lang].copyButtonSuccess}</span>`;
                        setTimeout(() => { copyButton.innerHTML = originalContent; }, 2000);
                    }).catch(err => console.error('Hiba a másoláskor:', err));
                }
            });
        }

        // Negatív prompt másolása
        if (copyNegativeButton) {
            copyNegativeButton.addEventListener('click', () => {
                const textToCopy = negativePromptTextarea.value;
                if (textToCopy) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        const icon = copyNegativeButton.querySelector('i');
                        icon.className = 'fa-solid fa-check';
                        setTimeout(() => { icon.className = 'fa-solid fa-copy'; }, 2000);
                    }).catch(err => console.error('Hiba a másoláskor:', err));
                }
            });
        }

        // Paraméter gombok
        document.querySelectorAll('.param-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.param-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                selectedParameter = this.dataset.param;
                updateFinalPrompt();
            });
        });
        
        // Súlyozás - Tag kiválasztása
        if(finalPromptContainer) {
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

        // Súlyozás - Csúszka
        if (weightSlider) {
            weightSlider.addEventListener('input', () => {
                if (activeWeightedTag) {
                    const weight = parseFloat(weightSlider.value).toFixed(1);
                    weightValue.textContent = weight;
                    activeWeightedTag.dataset.weight = weight;
                    
                    let originalText = activeWeightedTag.dataset.originalText;
                    if (weight !== '1.0') {
                        activeWeightedTag.textContent = `${originalText}:${weight}`;
                        activeWeightedTag.classList.add('is-weighted');
                    } else {
                        activeWeightedTag.textContent = originalText;
                        activeWeightedTag.classList.remove('is-weighted');
                        delete activeWeightedTag.dataset.weight;
                    }
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.innerHTML = '&times;';
                    deleteBtn.className = 'delete-tag final-delete';
                    deleteBtn.title = 'Törlés';
                    activeWeightedTag.appendChild(deleteBtn);
                    
                    updateFinalPrompt();
                }
            });
        }

        // Súlyozás - Visszaállítás gomb
        if (resetWeightsBtn) {
            resetWeightsBtn.addEventListener('click', () => {
                finalPromptContainer.querySelectorAll('.prompt-tag.is-weighted').forEach(tag => {
                    tag.textContent = tag.dataset.originalText;
                    const deleteBtn = document.createElement('button');
                    deleteBtn.innerHTML = '&times;';
                    deleteBtn.className = 'delete-tag final-delete';
                    deleteBtn.title = 'Törlés';
                    tag.appendChild(deleteBtn);
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

        // A többi gomb, ami már létezett
        if (randomButton) randomButton.addEventListener('click', generateRandomPrompt);
        if (clearAllButton) clearAllButton.addEventListener('click', clearAll);
    }

    // === INDÍTÁS ===
    loadPromptFromStorage(); // Ezt a többi előtt kell futtatni
    initializeChoices();
    initializeStyleMixer();
    initializeNegativeHelper();
    initializeEventListeners(); // Itt hívjuk meg az új eseménykezelőket
    updateFinalPrompt();
    
    // SortableJS (Drag & Drop) inicializálása
    if (typeof Sortable !== 'undefined' && finalPromptContainer) {
        new Sortable(finalPromptContainer, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            filter: '.param-display-tag', // A paraméter címke ne legyen mozgatható
            onEnd: updateFinalPrompt
        });
    }
}