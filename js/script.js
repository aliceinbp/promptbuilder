document.addEventListener('DOMContentLoaded', function() {
    // EXPLAINER MODAL LOGIC
    const explainerModal = document.getElementById('explainer-modal');
    if (explainerModal) {
        const explainerTitle = document.getElementById('explainer-modal-title');
        const explainerText = document.getElementById('explainer-modal-text');
        const explainerIcons = document.querySelectorAll('.explainer-icon');
        const closeExplainerModalBtn = explainerModal.querySelector('.close-modal-btn');

        explainerIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                const lang = currentLanguage;
                
                const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
                let camelCaseCategory = category.replace(/_([a-z])/g, g => g[1].toUpperCase());

                const titleKey = `explainerTitle${capitalize(camelCaseCategory)}`;
                const textKey = `explainerText${capitalize(camelCaseCategory)}`;

                if (translations[lang] && translations[lang][titleKey] && translations[lang][textKey]) {
                    explainerTitle.textContent = translations[lang][titleKey];
                    const rawText = translations[lang][textKey];
                    explainerText.innerHTML = rawText.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('');
                    overlay.classList.remove('hidden');
                    explainerModal.classList.remove('hidden');
                }
            });
        });

        closeExplainerModalBtn.addEventListener('click', () => {
            overlay.classList.add('hidden');
            explainerModal.classList.add('hidden');
        });
    }

    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    // ====================================================================
    // ===== TÉMAVÁLASZTÓ ÉS CUSDIS LOGIKA =====
    // ====================================================================
    const themeToggleButton = document.getElementById('theme-toggle');
    
    function updateCusdisTheme(theme) {
        const cusdisFrame = document.querySelector('#cusdis_thread iframe');
        if (cusdisFrame) {
            setTimeout(() => {
                console.log(`[Prompt Lab] Téma beállítása a vendégkönyvben: ${theme}`);
                cusdisFrame.contentWindow.postMessage({
                    type: 'setTheme',
                    theme: theme
                }, 'https://cusdis.com');
            }, 100);
        } else {
             console.log('[Prompt Lab] Cusdis iframe nem található a témaváltáskor.');
        }
    }

    function applyTheme(theme) {
        const logo = document.getElementById('logo');
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            if (themeToggleButton) themeToggleButton.innerHTML = '<i class="fa-solid fa-moon"></i>';
            if (logo) logo.src = 'src/myLogolight.jpg';
        } else {
            document.body.classList.remove('light-theme');
            if (themeToggleButton) themeToggleButton.innerHTML = '<i class="fa-solid fa-sun"></i>';
            if (logo) logo.src = 'src/myLogo.jpg';
        }
        updateCusdisTheme(theme === 'light' ? 'light' : 'dark');
    }
    
    function observeCusdis() {
        const cusdisContainer = document.getElementById('cusdis_thread');
        if (!cusdisContainer) return;

        const observer = new MutationObserver((mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if (cusdisContainer.querySelector('iframe')) {
                        console.log('[Prompt Lab] Vendégkönyv betöltődött, téma szinkronizálása...');
                        const storedTheme = localStorage.getItem('theme') || 'dark';
                        applyTheme(storedTheme);
                        observer.disconnect();
                        return;
                    }
                }
            }
        });
        observer.observe(cusdisContainer, { childList: true, subtree: true });
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            let newTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // ====================================================================
    // ===== NYELVKEZELÉS =====
    // ====================================================================
    let currentLanguage = localStorage.getItem('preferredLanguage') || 'en';

    window.setLanguage = function(lang) {
        currentLanguage = lang;
        localStorage.setItem('preferredLanguage', lang);

        document.querySelectorAll('[data-key]').forEach(elem => {
            const key = elem.dataset.key;
            if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
                const text = translations[lang][key];
                if (elem.placeholder !== undefined) {
                    elem.placeholder = text;
                } else {
                    elem.textContent = text;
                }
            }
        });

        document.querySelectorAll('[data-key-title]').forEach(elem => {
            const key = elem.dataset.keyTitle;
            if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
                elem.setAttribute('title', translations[lang][key]);
            }
        });

        const langHu = document.getElementById('lang-hu');
        const langEn = document.getElementById('lang-en');
        if (langHu && langEn) {
            langHu.classList.toggle('active', lang === 'hu');
            langEn.classList.toggle('active', lang === 'en');
        }

        if (document.getElementById('translate-button')) {
            document.getElementById('translate-button').classList.toggle('hidden', lang !== 'hu');
        }

        if (typeof initializeGenerator === 'function') {
            initializeGenerator();
        }
    }

    const langHu = document.getElementById('lang-hu');
    const langEn = document.getElementById('lang-en');
    if (langHu && langEn) {
        langHu.addEventListener('click', (e) => { e.preventDefault(); window.setLanguage('hu'); });
        langEn.addEventListener('click', (e) => { e.preventDefault(); window.setLanguage('en'); });
    }

    // ====================================================================
    // ===== MODÁLIS ABLAKOK ÁLTALÁNOS LOGIKÁJA =====
    // ====================================================================
    const overlay = document.getElementById('modal-overlay');
    const infoModal = document.getElementById('info-modal');
    const infoButton = document.getElementById('info-button');

    if (infoButton && infoModal && overlay) {
        const closeInfoModalBtn = infoModal.querySelector('.close-modal-btn');
        const open = () => { overlay.classList.remove('hidden'); infoModal.classList.remove('hidden'); };
        const close = () => { overlay.classList.add('hidden'); infoModal.classList.add('hidden'); };
        infoButton.addEventListener('click', open);
        closeInfoModalBtn.addEventListener('click', close);
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => modal.classList.add('hidden'));
            overlay.classList.add('hidden');
        });
    }

    // ====================================================================
    // ===== GENERÁTOR OLDAL SPECIFIKUS LOGIKA =====
    // ====================================================================
    if (document.querySelector('.final-prompt-section')) {
        let currentManagedCategory = '';
        const textareas = {
            mainSubject: document.getElementById('mainSubject-text'),
            details: document.getElementById('details-text'),
            style: document.getElementById('style-text'),
            extra: document.getElementById('extra-text')
        };
        const finalPromptContainer = document.getElementById('final-prompt-container');
        const finalPromptHiddenTextarea = document.getElementById('final-prompt-hidden');
        const negativePromptTextarea = document.getElementById('negative-prompt');
        const copyButton = document.getElementById('copy-button');
        const randomButton = document.getElementById('random-button');
        const clearAllButton = document.getElementById('clear-all-button');
        const savePromptButton = document.getElementById('save-prompt-button');
        const savedPromptsList = document.getElementById('saved-prompts-list');
        const managePromptsModal = document.getElementById('manage-prompts-modal');
        const historyModal = document.getElementById('history-modal');
        const historyButton = document.getElementById('history-button');
        const historyList = document.getElementById('history-list');
        const translateButton = document.getElementById('translate-button');
        let promptHistory = [];
        let historyTimeout;
        let choiceInstances = {};

        // ===== ÚJ: Paraméter változó inicializálása =====
        let selectedParameter = ''; 

        if (finalPromptContainer && typeof Sortable !== 'undefined') {
            new Sortable(finalPromptContainer, { animation: 150, ghostClass: 'sortable-ghost' });
        }
        function getCustomPrompts() { return JSON.parse(localStorage.getItem('customPrompts')) || { mainSubject: [], detail_physical: [], detail_environment: [], detail_mood: [], style: [], extra: [] }; }
        function saveCustomPrompts(customPrompts) { localStorage.setItem('customPrompts', JSON.stringify(customPrompts)); }
        function openModal(modal) { overlay.classList.remove('hidden'); modal.classList.remove('hidden'); }
        function openManageModal(category) {
            currentManagedCategory = category;
            const manageModalTitle = document.getElementById('manage-modal-title');
            const categoryKeyMap = {
                mainSubject: 'mainSubjectLabel',
                detail_physical: 'detailPhysicalLabel',
                detail_environment: 'detailEnvironmentLabel',
                detail_mood: 'detailMoodLabel',
                style: 'styleLabel',
                extra: 'extraLabel'
            };
            const categoryLabelKey = categoryKeyMap[category] || category + 'Label';
            manageModalTitle.textContent = `"${translations[currentLanguage][categoryLabelKey].replace(':', '')}" - Sajátok`;
            renderManageList();
            openModal(managePromptsModal);
        }
        function renderManageList() {
            const managePromptsList = document.getElementById('manage-prompts-list');
            managePromptsList.innerHTML = '';
            const customPrompts = getCustomPrompts();
            const promptsForCategory = customPrompts[currentManagedCategory] || [];
            if (promptsForCategory.length === 0) {
                managePromptsList.innerHTML = `<p style="text-align: center; color: #888;">Itt még nincsenek saját promptjaid.</p>`;
            } else {
                promptsForCategory.forEach((prompt, index) => {
                    const item = document.createElement('div');
                    item.className = 'manage-list-item';
                    item.innerHTML = `<span>${prompt}</span><button class="delete-custom-prompt-btn" data-index="${index}" title="Törlés"><i class="fa-solid fa-trash"></i></button>`;
                    managePromptsList.appendChild(item);
                });
            }
        }
        function addNewCustomPrompt() {
            const newPromptInput = document.getElementById('new-prompt-input');
            const newPrompt = newPromptInput.value.trim();
            if (newPrompt === '' || !currentManagedCategory) return;
            const customPrompts = getCustomPrompts();
            if (!customPrompts[currentManagedCategory]) {
                customPrompts[currentManagedCategory] = [];
            }
            if (!customPrompts[currentManagedCategory].includes(newPrompt)) {
                customPrompts[currentManagedCategory].push(newPrompt);
                saveCustomPrompts(customPrompts);
                renderManageList();
                initializeChoices();
            }
            newPromptInput.value = '';
            newPromptInput.focus();
        }
        function deleteCustomPrompt(index) {
            const customPrompts = getCustomPrompts();
            customPrompts[currentManagedCategory].splice(index, 1);
            saveCustomPrompts(customPrompts);
            renderManageList();
            initializeChoices();
        }
        function generateRandomPrompt() {
            const langPrompts = getCombinedPrompts(currentLanguage);
            const getRandomItem = (arr) => arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : '';
            for (const key in textareas) { textareas[key].value = ''; }
            textareas.mainSubject.value = getRandomItem(langPrompts.mainSubject);
            const randomDetails = [
                getRandomItem(langPrompts.detail_physical),
                getRandomItem(langPrompts.detail_environment),
                getRandomItem(langPrompts.detail_mood)
            ].filter(Boolean).join(', ');
            textareas.details.value = randomDetails;
            textareas.style.value = getRandomItem(langPrompts.style);
            textareas.extra.value = getRandomItem(langPrompts.extra);
            updateFinalPrompt();
        }
        function clearAllTextareas() {
            for (const key in textareas) { textareas[key].value = ''; }
            negativePromptTextarea.value = '';
            updateFinalPrompt();
        }
        function getPromptTextFromTags() {
            if (!finalPromptContainer) return '';
            const tags = finalPromptContainer.querySelectorAll('.prompt-tag');
            return Array.from(tags).map(tag => tag.textContent).join(', ');
        }
        function saveCurrentPrompt() {
            const promptToSave = getPromptTextFromTags();
            if (promptToSave === '') return;
            let saved = getSavedPrompts();
            if (!saved.includes(promptToSave)) {
                saved.unshift(promptToSave);
                localStorage.setItem('savedPrompts', JSON.stringify(saved));
                renderSavedPrompts();
            }
        }
        function getSavedPrompts() { return JSON.parse(localStorage.getItem('savedPrompts')) || []; }
        function renderSavedPrompts() {
            if(!savedPromptsList) return;
            savedPromptsList.innerHTML = '';
            const saved = getSavedPrompts();
            if (saved.length === 0) {
                savedPromptsList.innerHTML = `<p style="text-align: center; color: #888;">Nincsenek mentett promptjaid.</p>`;
                return;
            }
            saved.forEach((prompt, index) => {
                const item = document.createElement('div');
                item.className = 'saved-prompt-item';
                item.innerHTML = `<span class="saved-prompt-text">${prompt}</span><div class="saved-prompt-actions"><button class="load-prompt-btn" data-index="${index}" title="Betöltés"><i class="fa-solid fa-upload"></i></button><button class="delete-prompt-btn" data-index="${index}" title="Törlés"><i class="fa-solid fa-trash"></i></button></div>`;
                savedPromptsList.appendChild(item);
            });
        }
        function handleSavedListClick(event) {
            const target = event.target.closest('button');
            if (!target) return;
            const index = parseInt(target.dataset.index, 10);
            let saved = getSavedPrompts();
            if (target.classList.contains('load-prompt-btn')) {
                clearAllTextareas(); 
                finalPromptContainer.innerHTML = '';
                const prompt = saved[index];
                prompt.split(',').forEach(part => {
                    const trimmedPart = part.trim();
                    if(trimmedPart) {
                        const tag = document.createElement('span');
                        tag.className = 'prompt-tag';
                        tag.textContent = trimmedPart;
                        finalPromptContainer.appendChild(tag);
                    }
                });
                finalPromptHiddenTextarea.value = getPromptTextFromTags();
            }
            if (target.classList.contains('delete-prompt-btn')) {
                saved.splice(index, 1);
                localStorage.setItem('savedPrompts', JSON.stringify(saved));
                renderSavedPrompts();
            }
        }
        function saveToHistory(prompt) {
            if (!prompt || prompt === promptHistory[0]) return;
            promptHistory.unshift(prompt);
            if (promptHistory.length > 15) { promptHistory.pop(); }
        }
        function renderHistory() {
            historyList.innerHTML = '';
            if (promptHistory.length === 0) {
                historyList.innerHTML = `<p style="text-align: center; color: #888;">Nincsenek előzmények ebben a munkamenetben.</p>`;
                return;
            }
            promptHistory.forEach(prompt => {
                const item = document.createElement('div');
                item.className = 'history-item';
                item.textContent = prompt;
                historyList.appendChild(item);
            });
        }
        function updateFinalPrompt() {
            if (!finalPromptContainer) return;
            finalPromptContainer.innerHTML = '';
            const allParts = [];
            const categoryOrder = ['mainSubject', 'details', 'style', 'extra'];
            categoryOrder.forEach(category => {
                if (textareas[category]) {
                    const text = textareas[category].value.trim();
                    if (text) {
                        text.split(',').forEach(part => {
                            const trimmedPart = part.trim();
                            if(trimmedPart) {
                                allParts.push(trimmedPart);
                            }
                        });
                    }
                }
            });
            allParts.forEach(part => {
                const tag = document.createElement('span');
                tag.className = 'prompt-tag';
                tag.textContent = part;
                finalPromptContainer.appendChild(tag);
            });
            const finalPromptText = getPromptTextFromTags();
            finalPromptHiddenTextarea.value = finalPromptText;
            clearTimeout(historyTimeout);
            historyTimeout = setTimeout(() => {
                saveToHistory(finalPromptText);
            }, 1500);
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
            const combinedPrompts = getCombinedPrompts(currentLanguage);
            const categories = ['mainSubject', 'detail_physical', 'detail_environment', 'detail_mood', 'style', 'extra'];
            const categoryKeyMap = {
                mainSubject: 'mainSubjectLabel',
                detail_physical: 'detailPhysicalLabel',
                detail_environment: 'detailEnvironmentLabel',
                detail_mood: 'detailMoodLabel',
                style: 'styleLabel',
                extra: 'extraLabel'
            };
            categories.forEach(category => {
                const selectId = category.replace(/_/g, '-') + '-select';
                const selectElement = document.getElementById(selectId);
                if (!selectElement) return;
                if (choiceInstances[category]) {
                    choiceInstances[category].destroy();
                }
                const options = (combinedPrompts[category] || []).map(item => ({ value: item, label: item }));
                const labelKey = categoryKeyMap[category];
                const placeholderText = translations[currentLanguage].selectDefault.replace('{category}', translations[currentLanguage][labelKey].replace(':', ''));
                choiceInstances[category] = new Choices(selectElement, {
                    choices: options,
                    searchPlaceholderValue: "Keress...",
                    itemSelectText: "Kiválaszt",
                    allowHTML: false,
                    shouldSort: false,
                    placeholder: true,
                    placeholderValue: placeholderText,
                });
                selectElement.addEventListener('showDropdown.choices', function() {
                    const dropdown = choiceInstances[category].dropdown.element;
                    dropdown.style.maxHeight = '25vh';
                }, false);
            });
        }
        window.initializeGenerator = function() {
            initializeChoices();
            renderSavedPrompts();
            updateFinalPrompt();
        };

        randomButton.addEventListener('click', generateRandomPrompt);
        clearAllButton.addEventListener('click', clearAllTextareas);
        savePromptButton.addEventListener('click', saveCurrentPrompt);
        if(savedPromptsList) {
            savedPromptsList.addEventListener('click', handleSavedListClick);
        }
        if (managePromptsModal) {
            managePromptsModal.querySelector('.close-modal-btn').addEventListener('click', () => {
                overlay.classList.add('hidden');
                managePromptsModal.classList.add('hidden');
            });
            document.querySelectorAll('.manage-prompts-btn').forEach(btn => {
                btn.addEventListener('click', function() { openManageModal(this.dataset.category); });
            });
            document.getElementById('add-new-prompt-btn').addEventListener('click', addNewCustomPrompt);
            document.getElementById('new-prompt-input').addEventListener('keydown', (e) => {
                if (e.key === 'Enter') { e.preventDefault(); addNewCustomPrompt(); }
            });
            document.getElementById('manage-prompts-list').addEventListener('click', function(event) {
                const target = event.target.closest('.delete-custom-prompt-btn');
                if (target) { deleteCustomPrompt(parseInt(target.dataset.index, 10)); }
            });
        }
        document.querySelectorAll('.add-button').forEach(button => {
            button.addEventListener('click', function() {
                const outputCategory = this.dataset.category;
                const parentSection = this.closest('.prompt-section');
                if (!parentSection) return;
                const selectElement = parentSection.querySelector('select');
                const selectId = selectElement.id;
                const choiceCategory = selectId.replace(/-select$/, '').replace(/-/g, '_');
                const choice = choiceInstances[choiceCategory];
                const selectedValue = choice ? choice.getValue(true) : null;
                if (selectedValue && selectedValue !== "" && textareas[outputCategory]) {
                    const targetTextarea = textareas[outputCategory];
                    targetTextarea.value += (targetTextarea.value.trim() !== "" ? ", " : "") + selectedValue;
                    updateFinalPrompt();
                    choice.clearInput();
                    choice.setChoiceByValue('');
                }
            });
        });
        Object.values(textareas).forEach(textarea => {
            if(textarea) textarea.addEventListener('input', updateFinalPrompt)
        });

        // ===== ÚJ PARAMÉTER LOGIKA =====
        const paramButtons = document.querySelectorAll('.param-btn');
        if (paramButtons.length > 0) {
            const defaultButton = Array.from(paramButtons).find(btn => btn.dataset.param === '');
            if(defaultButton) defaultButton.classList.add('active'); 

            paramButtons.forEach(button => {
                button.addEventListener('click', () => {
                    paramButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    selectedParameter = button.dataset.param;
                });
            });
        }
        // ===== ÚJ PARAMÉTER LOGIKA VÉGE =====

        // ===== FRISSÍTETT MÁSOLÁS GOMB LOGIKA =====
        copyButton.addEventListener('click', function() {
            let textToCopy = getPromptTextFromTags();
            const negativeText = negativePromptTextarea.value.trim();
            
            if (negativeText !== '') { textToCopy += ` --no ${negativeText}`; }
            if (selectedParameter !== '') { textToCopy += ` ${selectedParameter}`; }

            navigator.clipboard.writeText(textToCopy).then(() => {
                const buttonTextSpan = this.querySelector('span') || this;
                const originalText = translations[currentLanguage].copyButton;
                buttonTextSpan.textContent = translations[currentLanguage].copyButtonSuccess;
                setTimeout(() => { 
                    buttonTextSpan.textContent = translations[currentLanguage].copyButton; 
                }, 1500);
            });
        });
        // ===== FRISSÍTETT MÁSOLÁS GOMB LOGIKA VÉGE =====

        if (translateButton) {
            translateButton.addEventListener('click', async () => {
                const buttonSpan = translateButton.querySelector('span') || translateButton;
                const originalText = buttonSpan.textContent;
                buttonSpan.textContent = 'Fordítás...';
                translateButton.disabled = true;
                try {
                    for (const category in textareas) {
                        const textarea = textareas[category];
                        if (textarea) {
                            const text = textarea.value.trim();
                            if (text && !/by|style of|art by|realistic|8k|cinematic|artstation/i.test(text)) {
                                const response = await fetch('/.netlify/functions/translate', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ text: text, target_lang: 'EN-US' })
                                });
                                if (!response.ok) {
                                    const errorData = await response.json();
                                    throw new Error(errorData.details || 'A fordítási szolgáltatás hibát adott.');
                                }
                                const data = await response.json();
                                textarea.value = data.translatedText;
                            }
                        }
                    }
                    updateFinalPrompt();
                    buttonSpan.textContent = 'Fordítás kész!';
                } catch (error) {
                    console.error('Fordítási hiba:', error);
                    buttonSpan.textContent = 'Hiba a fordításkor!';
                    alert('Hiba történt a fordítás során: ' + error.message);
                } finally {
                    setTimeout(() => {
                        buttonSpan.textContent = originalText;
                        translateButton.disabled = false;
                    }, 2500);
                }
            });
        }
        if (historyButton && historyModal) {
            historyButton.addEventListener('click', () => {
                renderHistory();
                openModal(historyModal);
            });
            historyModal.querySelector('.close-modal-btn').addEventListener('click', () => {
                overlay.classList.add('hidden');
                historyModal.classList.add('hidden');
            });
            historyList.addEventListener('click', (e) => {
                if (e.target.classList.contains('history-item')) {
                    clearAllTextareas();
                    finalPromptContainer.innerHTML = '';
                    const prompt = e.target.textContent;
                    prompt.split(',').forEach(part => {
                       const trimmedPart = part.trim();
                       if (trimmedPart) {
                           const tag = document.createElement('span');
                           tag.className = 'prompt-tag';
                           tag.textContent = trimmedPart;
                           finalPromptContainer.appendChild(tag);
                       }
                    });
                    finalPromptHiddenTextarea.value = getPromptTextFromTags();
                    overlay.classList.add('hidden');
                    historyModal.classList.add('hidden');
                }
            });
        }
    }

    // ====================================================================
    // ===== EGYÉB OLDALAK LOGIKÁJA (MŰVÉSZEK, BLOG, STB.) =====
    // ====================================================================

    function initializeArtistCopyButtons() {
        document.querySelectorAll('.copy-artist-btn').forEach(button => {
            if (button.dataset.listenerAttached) return;
            button.dataset.listenerAttached = 'true';
            button.addEventListener('click', () => {
                const artistName = button.dataset.artist;
                navigator.clipboard.writeText(artistName).then(() => {
                    button.innerHTML = '<i class="fa-solid fa-check"></i>';
                    button.classList.add('copied');
                    setTimeout(() => {
                        button.innerHTML = '<i class="fa-solid fa-copy"></i>';
                        button.classList.remove('copied');
                    }, 1500);
                });
            });
        });
    }

    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            backToTopButton.classList.toggle('hidden', window.scrollY <= 300);
        });
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const copyNegativeButton = document.getElementById('copy-negative-button');
    if (copyNegativeButton) {
        copyNegativeButton.addEventListener('click', () => {
            const negativePromptText = document.getElementById('negative-prompt').value;
            navigator.clipboard.writeText(negativePromptText).then(() => {
                const originalIcon = copyNegativeButton.innerHTML;
                copyNegativeButton.innerHTML = '<i class="fa-solid fa-check"></i>';
                copyNegativeButton.classList.add('copied');
                setTimeout(() => {
                    copyNegativeButton.innerHTML = originalIcon;
                    copyNegativeButton.classList.remove('copied');
                }, 1500);
            });
        });
    }
    
    async function loadArtists() {
        const container = document.querySelector('.artist-grid');
        if (!container) return;
    
        try {
            const response = await fetch('/_data/artists.json');
            const artists = await response.json();
            container.innerHTML = ''; // Töröljük a korábbi tartalmat
    
            // 1. Művész kártyák létrehozása
            artists.forEach(artist => {
                const card = document.createElement('div');
                card.className = `artist-card`;
                if(artist.category) card.dataset.category = artist.category; 
    
                const copyName = artist.copyName || artist.name;
                card.innerHTML = `
                    <div class="artist-card-header">
                        <h3>${artist.name}</h3>
                        <button class="copy-artist-btn" data-artist="${copyName}" data-key-title="copyTooltip">
                            <i class="fa-solid fa-copy"></i>
                        </button>
                    </div>
                    <p data-key="${artist.dataKey}"></p>
                `;
                container.appendChild(card);
            });
    
            // 2. Szűrő logika beállítása
            const filterButtons = document.querySelectorAll('.filter-btn');
            const artistCards = document.querySelectorAll('.artist-card');
    
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
    
                    const selectedCategory = button.dataset.category;
    
                    artistCards.forEach(card => {
                        if (selectedCategory === 'all' || card.dataset.category === selectedCategory) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            });
    
            // 3. Utómunkálatok (gombok, fordítás)
            initializeArtistCopyButtons();
            window.setLanguage(localStorage.getItem('preferredLanguage') || 'en');
            
        } catch (error) {
            console.error('Hiba a művészek betöltésekor:', error);
            container.innerHTML = '<p>A művészek listája jelenleg nem érhető el.</p>';
        }
    }
    
    async function loadGallery() {
        const container = document.getElementById('gallery-section');
        if (!container) return;
        try {
            const response = await fetch('/_data/gallery.json');
            const galleryData = await response.json();
            container.innerHTML = '';
            const categoryMap = { fantasy: 'galleryCatFantasy', dark: 'galleryCatDark', worlds: 'galleryCatWorlds', shards: 'galleryCatShards' };
            for (const categoryKey in galleryData) {
                const images = galleryData[categoryKey];
                const titleKey = categoryMap[categoryKey];
                const title = document.createElement('h2');
                title.className = 'gallery-category-title';
                title.innerHTML = `<span data-key="${titleKey}"></span>`;
                container.appendChild(title);
                const grid = document.createElement('div');
                grid.className = 'gallery-grid';
                images.forEach(image => {
                    const item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.innerHTML = `<a href="src/gallery-images/${image.src}" target="_blank"><img src="src/gallery-images/${image.src}" alt="${image.alt}" loading="lazy"></a>`;
                    grid.appendChild(item);
                });
                container.appendChild(grid);
            }
            window.setLanguage(currentLanguage);
        } catch (error) {
            console.error('Hiba a galéria betöltésekor:', error);
            container.innerHTML = '<p>A galéria jelenleg nem érhető el.</p>';
        }
    }

    async function loadDailyPrompt() {
        const container = document.getElementById('daily-prompt-section');
        if (!container) return;
        const promptTextElement = document.getElementById('daily-prompt-text');
        const copyBtn = document.getElementById('copy-daily-prompt-btn');
        try {
            const response = await fetch('/_data/daily_prompts.json');
            const prompts = await response.json();
            if (prompts.length === 0) {
                promptTextElement.textContent = "Nincsenek elérhető promptok.";
                return;
            }
            const now = new Date();
            const startOfYear = new Date(now.getFullYear(), 0, 0);
            const diff = now - startOfYear;
            const oneDay = 1000 * 60 * 60 * 24;
            const dayOfYear = Math.floor(diff / oneDay);
            const promptIndex = (dayOfYear - 1) % prompts.length;
            const selectedPrompt = prompts[promptIndex];
            promptTextElement.textContent = selectedPrompt;
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(selectedPrompt).then(() => {
                    const buttonTextSpan = copyBtn.querySelector('span');
                    const originalText = buttonTextSpan.textContent;
                    const icon = copyBtn.querySelector('i');
                    buttonTextSpan.textContent = translations[currentLanguage].dailyPromptCopySuccess;
                    icon.className = 'fa-solid fa-check';
                    setTimeout(() => {
                        buttonTextSpan.textContent = originalText;
                        icon.className = 'fa-solid fa-copy';
                    }, 2000);
                });
            });
        } catch (error) {
            console.error("Hiba a nap promptjának betöltésekor:", error);
            promptTextElement.textContent = "A nap promptja jelenleg nem érhető el.";
        }
    }

    const markdownConverter = typeof showdown !== 'undefined' ? new showdown.Converter() : null;
    function parseFrontmatter(markdown) {
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
        const match = markdown.match(frontmatterRegex);
        if (!match) return { frontmatter: {}, content: markdown };
        const yamlString = match[1];
        const content = markdown.replace(frontmatterRegex, '');
        try {
            return { frontmatter: jsyaml.load(yamlString), content };
        } catch (error) {
            console.error("Hiba a YAML feldolgozása közben:", error);
            return { frontmatter: {}, content: content };
        }
    }

    async function loadBlogPosts() {
        const container = document.getElementById('blog-posts-container');
        if (!container || !markdownConverter) return;
        const GITHUB_API_URL = 'https://api.github.com/repos/aliceinbp/promptbuilder/contents/blog';
        try {
            const response = await fetch(GITHUB_API_URL);
            if (!response.ok) throw new Error('Nem sikerült lekérni a bejegyzéseket a GitHubról.');
            let files = await response.json();
            if (!Array.isArray(files)) {
                console.error("GitHub API did not return an array:", files.message);
                container.innerHTML = `<p>${translations[currentLanguage].blogError || 'Hiba a bejegyzések formátumával.'}</p>`;
                return;
            }
            const postPromises = files.filter(file => file.name && file.name.endsWith('.md')).map(async (file) => {
                const postResponse = await fetch(file.download_url);
                const markdown = await postResponse.text();
                const { frontmatter } = parseFrontmatter(markdown);
                frontmatter.slug = file.name.replace('.md', '');
                return frontmatter;
            });
            let postData = await Promise.all(postPromises);
            postData.sort((a, b) => new Date(b.date) - new Date(a.date));
            container.innerHTML = '';
            if (postData.length === 0) {
                 container.innerHTML = `<p>${translations[currentLanguage].noPostsFound}</p>`;
                 return;
            }
            postData.forEach(post => {
                const title = currentLanguage === 'hu' ? post.title_hu : post.title_en;
                const bodyMarkdown = currentLanguage === 'hu' ? post.body_hu : post.body_en;
                const bodyHtml = markdownConverter.makeHtml(bodyMarkdown || '');
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = bodyHtml;
                const plainText = tempDiv.textContent || tempDiv.innerText || "";
                const excerpt = plainText.substring(0, 150) + '...';
                const postDate = new Date(post.date).toLocaleDateString(currentLanguage === 'hu' ? 'hu-HU' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                const card = document.createElement('div');
                card.className = 'blog-card';
                card.innerHTML = `<a href="post.html?slug=${post.slug}"><img src="${post.image}" alt="${title}" class="blog-card-image"></a><div class="blog-card-content"><h3><a href="post.html?slug=${post.slug}" style="text-decoration:none; color: inherit;">${title}</a></h3><p class="blog-card-meta">${translations[currentLanguage].postedOn} ${postDate}</p><p class="blog-card-excerpt">${excerpt}</p><a href="post.html?slug=${post.slug}" class="blog-card-read-more">${translations[currentLanguage].readMore}</a></div>`;
                container.appendChild(card);
            });
        } catch (error) {
            console.error('Hiba a blogbejegyzések betöltésekor:', error);
            container.innerHTML = `<p>${translations[currentLanguage].blogError || 'Hiba a bejegyzések betöltése közben.'}</p>`;
        }
    }

    async function loadSinglePost() {
        const container = document.getElementById('post-content-container');
        if (!container || !markdownConverter) return;
        const params = new URLSearchParams(window.location.search);
        const slug = params.get('slug');
        if (!slug) {
            container.innerHTML = 'Hiba: Nincs megadva bejegyzés azonosító.';
            return;
        }
        const POST_URL = `https://raw.githubusercontent.com/aliceinbp/promptbuilder/main/blog/${slug}.md`;
        try {
            const response = await fetch(POST_URL);
            if (!response.ok) throw new Error('A bejegyzés nem található.');
            const markdown = await response.text();
            const { frontmatter } = parseFrontmatter(markdown);
            const title = currentLanguage === 'hu' ? frontmatter.title_hu : frontmatter.title_en;
            const bodyMarkdown = currentLanguage === 'hu' ? frontmatter.body_hu : frontmatter.body_en;
            const bodyHtml = markdownConverter.makeHtml(bodyMarkdown);
            const postDate = new Date(frontmatter.date).toLocaleDateString(currentLanguage === 'hu' ? 'hu-HU' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            document.title = `${title} - Prompt Lab Blog`;
            const metaDescriptionTag = document.querySelector('meta[name="description"]');
if (metaDescriptionTag) {
    const excerpt = bodyHtml.replace(/<[^>]*>?/gm, '').substring(0, 155); // Létrehoz egy 155 karakteres kivonatot a szövegből
    metaDescriptionTag.setAttribute('content', excerpt);
}
const oldSchema = document.getElementById('blog-post-schema');
if (oldSchema) {
    oldSchema.remove();
}

// Létrehozzuk az új szkript elemet
const schemaScript = document.createElement('script');
schemaScript.type = 'application/ld+json';
schemaScript.id = 'blog-post-schema'; // Adunk neki egy azonosítót

// Definiáljuk a séma tartalmát a bejegyzés adataival
schemaScript.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "image": frontmatter.image,
    "datePublished": frontmatter.date,
    "author": {
        "@type": "Person",
        "name": "Aliceinbp"
    }
});

// Hozzáadjuk a szkriptet a <head> részhez
document.head.appendChild(schemaScript);
            container.innerHTML = `<div class="post-header"><h1>${title}</h1><p class="post-meta">${translations[currentLanguage].postedOn} ${postDate}</p></div><img src="${frontmatter.image}" alt="${title}" class="post-featured-image"><div class="post-body">${bodyHtml}</div>`;
        } catch (error) {
            console.error('Hiba a bejegyzés betöltésekor:', error);
            container.innerHTML = '<p>A bejegyzés nem tölthető be.</p>';
        }
    }

    function displayDailyQuote() {
        const quoteContainer = document.getElementById('daily-quote-container');
        if (!quoteContainer) return;
        const quoteTextElem = document.getElementById('quote-text');
        const quoteAuthorElem = document.getElementById('quote-author');
        const closeBtn = document.getElementById('close-quote-btn');
        let isQuoteLogicEnhanced = false;
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 0);
        const diff = now - startOfYear;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        const quoteIndex = dayOfYear % dailyQuotes.length;
        const todayQuote = dailyQuotes[quoteIndex];
        const lastClosedDay = localStorage.getItem('quoteClosedDay');
        if (lastClosedDay == dayOfYear) {
            quoteContainer.classList.add('hidden');
            return;
        }
        quoteContainer.classList.remove('hidden');
        function setQuoteContent() {
            const lang = localStorage.getItem('preferredLanguage') || 'en';
            quoteTextElem.textContent = (lang === 'hu') ? `„${todayQuote.quote_hu}”` : `“${todayQuote.quote_en}”`;
            quoteAuthorElem.textContent = `– ${todayQuote.author}`;
        }
        setQuoteContent();
        closeBtn.addEventListener('click', () => {
            quoteContainer.classList.add('closing');
            setTimeout(() => {
                quoteContainer.classList.add('hidden');
                quoteContainer.classList.remove('closing');
            }, 500);
            localStorage.setItem('quoteClosedDay', dayOfYear);
        });
        if (!isQuoteLogicEnhanced) {
            const originalSetLanguage = window.setLanguage;
            window.setLanguage = function(lang, ...args) {
                originalSetLanguage.apply(this, [lang, ...args]);
                if (document.getElementById('daily-quote-container') && !document.getElementById('daily-quote-container').classList.contains('hidden')) {
                    setQuoteContent();
                }
            }
            isQuoteLogicEnhanced = true;
        }
    }

    // --- OLDAL INDÍTÁSA ---
    const initialTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(initialTheme);
    window.setLanguage(currentLanguage);
    loadArtists();
    loadGallery();
    loadDailyPrompt();
    if (document.getElementById('blog-posts-container')) {
        loadBlogPosts();
    }
    if (document.getElementById('post-content-container')) {
        loadSinglePost();
    }
    displayDailyQuote();
    observeCusdis();
});