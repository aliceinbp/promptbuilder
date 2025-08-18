document.addEventListener('DOMContentLoaded', function() {

    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    // TÉMAVÁLASZTÓ LOGIKA
    const themeToggleButton = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    function applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            if(themeToggleButton) themeToggleButton.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            document.body.classList.remove('light-theme');
            if(themeToggleButton) themeToggleButton.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    }

    applyTheme(currentTheme); 

    if(themeToggleButton){
        themeToggleButton.addEventListener('click', () => {
            let theme = 'dark';
            if (document.body.classList.toggle('light-theme')) {
                theme = 'light';
            }
            localStorage.setItem('theme', theme);
            applyTheme(theme);
        });
    }

    let currentLanguage = localStorage.getItem('preferredLanguage') || 'en';

    function setLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('preferredLanguage', lang);
        
        document.querySelectorAll('[data-key]').forEach(elem => {
            const key = elem.dataset.key;
            if (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) {
                const text = translations[lang][key];
                if (elem.placeholder !== undefined) { elem.placeholder = text; } 
                else { elem.textContent = text; }
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
        if(langHu && langEn){
            langHu.classList.toggle('active', lang === 'hu');
            langEn.classList.toggle('active', lang === 'en');
        }

        const translateButton = document.getElementById('translate-button');
        if(translateButton) {
            translateButton.classList.toggle('hidden', lang !== 'hu');
        }
        
        if (typeof initializeGenerator === 'function') {
            initializeGenerator();
        }
    }

    const langHu = document.getElementById('lang-hu');
    const langEn = document.getElementById('lang-en');
    if(langHu && langEn){
        langHu.addEventListener('click', (e) => { e.preventDefault(); setLanguage('hu'); });
        langEn.addEventListener('click', (e) => { e.preventDefault(); setLanguage('en'); });
    }

    const overlay = document.getElementById('modal-overlay');
    const infoModal = document.getElementById('info-modal');
    const infoButton = document.getElementById('info-button');
    
    if(infoButton && infoModal && overlay){
        const closeInfoModalBtn = infoModal.querySelector('.close-modal-btn');
        const open = () => { overlay.classList.remove('hidden'); infoModal.classList.remove('hidden'); };
        const close = () => { overlay.classList.add('hidden'); infoModal.classList.add('hidden'); };
        infoButton.addEventListener('click', open);
        closeInfoModalBtn.addEventListener('click', close);
       }
       
       if(overlay){
           overlay.addEventListener('click', () => {
               document.querySelectorAll('.modal').forEach(modal => modal.classList.add('hidden'));
               overlay.classList.add('hidden');
           });
       }

    if (document.getElementById('random-button')) {
        
        let currentManagedCategory = '';
        const textareas = { style: document.getElementById('style-text'), subject: document.getElementById('subject-text'), setting: document.getElementById('setting-text'), extra: document.getElementById('extra-text') };
        const finalPromptTextarea = document.getElementById('final-prompt');
        const negativePromptTextarea = document.getElementById('negative-prompt');
        const copyButton = document.getElementById('copy-button');
        const translateButton = document.getElementById('translate-button');
        const randomButton = document.getElementById('random-button');
        const clearAllButton = document.getElementById('clear-all-button');
        const savePromptButton = document.getElementById('save-prompt-button');
        const savedPromptsList = document.getElementById('saved-prompts-list');
        const managePromptsModal = document.getElementById('manage-prompts-modal');
        const closeManageModalBtn = managePromptsModal.querySelector('.close-modal-btn');
        const manageModalTitle = document.getElementById('manage-modal-title');
        const managePromptsList = document.getElementById('manage-prompts-list');
        const newPromptInput = document.getElementById('new-prompt-input');
        const addNewPromptBtn = document.getElementById('add-new-prompt-btn');
        const historyModal = document.getElementById('history-modal');
        const historyButton = document.getElementById('history-button');
        const historyList = document.getElementById('history-list');
        const closeHistoryModalBtn = historyModal.querySelector('.close-modal-btn');
        let promptHistory = [];
        let historyTimeout;
        let choiceInstances = {};

        function getCustomPrompts() { return JSON.parse(localStorage.getItem('customPrompts')) || { style: [], subject: [], setting: [], extra: [] }; }
        function saveCustomPrompts(customPrompts) { localStorage.setItem('customPrompts', JSON.stringify(customPrompts)); }
        function openModal(modal) { overlay.classList.remove('hidden'); modal.classList.remove('hidden'); }

        function openManageModal(category) {
            currentManagedCategory = category;
            const categoryLabelKey = category + 'Label';
            manageModalTitle.textContent = `"${translations[currentLanguage][categoryLabelKey].replace(':', '')}" - Sajátok`;
            renderManageList();
            openModal(managePromptsModal);
        }
        
        function renderManageList() {
            managePromptsList.innerHTML = '';
            const customPrompts = getCustomPrompts();
            const promptsForCategory = customPrompts[currentManagedCategory] || [];
            if(promptsForCategory.length === 0){
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
            const newPrompt = newPromptInput.value.trim();
            if (newPrompt === '' || !currentManagedCategory) return;
            const customPrompts = getCustomPrompts();
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
            textareas.style.value = getRandomItem(langPrompts.style);
            textareas.subject.value = getRandomItem(langPrompts.subject);
            textareas.setting.value = getRandomItem(langPrompts.setting);
            textareas.extra.value = getRandomItem(langPrompts.extra);
            updateFinalPrompt();
        }

        function clearAllTextareas() {
            for (const key in textareas) { textareas[key].value = ''; }
            negativePromptTextarea.value = '';
            updateFinalPrompt();
        }

        function saveCurrentPrompt() {
            const promptToSave = finalPromptTextarea.value.trim();
            if (promptToSave === '') return;
            let saved = getSavedPrompts();
            if (!saved.includes(promptToSave)) { saved.unshift(promptToSave); localStorage.setItem('savedPrompts', JSON.stringify(saved)); renderSavedPrompts(); }
        }

        function getSavedPrompts() { return JSON.parse(localStorage.getItem('savedPrompts')) || []; }
        
        function renderSavedPrompts() {
            savedPromptsList.innerHTML = '';
            const saved = getSavedPrompts();
            if(saved.length === 0){ savedPromptsList.innerHTML = `<p style="text-align: center; color: #888;">Nincsenek mentett promptjaid.</p>`; return; }
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
            if (target.classList.contains('load-prompt-btn')) { finalPromptTextarea.value = saved[index]; }
            if (target.classList.contains('delete-prompt-btn')) { saved.splice(index, 1); localStorage.setItem('savedPrompts', JSON.stringify(saved)); renderSavedPrompts(); }
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
            const promptParts = [textareas.style.value, textareas.subject.value, textareas.setting.value, textareas.extra.value].map(part => part.trim()).filter(part => part !== "");
            const finalPrompt = promptParts.join(', ');
            finalPromptTextarea.value = finalPrompt;
            clearTimeout(historyTimeout);
            historyTimeout = setTimeout(() => {
                saveToHistory(finalPrompt);
            }, 1500);
        }

        function getCombinedPrompts(lang) {
            const custom = getCustomPrompts();
            const defaults = defaultPrompts[lang];
            let combined = {};
            for(const category in defaults){
                const defaultSet = new Set(defaults[category]);
                const customSet = new Set(custom[category] || []);
                combined[category] = [...defaultSet, ...customSet];
            }
            return combined;
        }

        function initializeChoices() {
            const combinedPrompts = getCombinedPrompts(currentLanguage);
            ['style', 'subject', 'setting', 'extra'].forEach(category => {
                const selectElement = document.getElementById(`${category}-select`);
                if (!selectElement) return;

                if (choiceInstances[category]) {
                    choiceInstances[category].destroy();
                }
                
                const options = combinedPrompts[category].map(item => ({ value: item, label: item }));

                choiceInstances[category] = new Choices(selectElement, {
                    choices: options, searchPlaceholderValue: "Keress...", itemSelectText: "Kiválaszt",
                    allowHTML: false, shouldSort: false, placeholder: true,
                    placeholderValue: translations[currentLanguage].selectDefault.replace('{category}', translations[currentLanguage][category + 'Label'].replace(':', '')),
                });
            });
        }
        
        window.initializeGenerator = function() {
            initializeChoices();
            renderSavedPrompts();
            updateFinalPrompt();
        }
        
        randomButton.addEventListener('click', generateRandomPrompt);
        clearAllButton.addEventListener('click', clearAllTextareas);
        savePromptButton.addEventListener('click', saveCurrentPrompt);
        savedPromptsList.addEventListener('click', handleSavedListClick);
        closeManageModalBtn.addEventListener('click', () => {overlay.classList.add('hidden'); managePromptsModal.classList.add('hidden');});
        document.querySelectorAll('.manage-prompts-btn').forEach(btn => { btn.addEventListener('click', function() { openManageModal(this.dataset.category); }); });
        addNewPromptBtn.addEventListener('click', addNewCustomPrompt);
        newPromptInput.addEventListener('keydown', (e) => { if(e.key === 'Enter') { e.preventDefault(); addNewCustomPrompt(); } });
        managePromptsList.addEventListener('click', function(event) { const target = event.target.closest('.delete-custom-prompt-btn'); if (target) { deleteCustomPrompt(parseInt(target.dataset.index, 10)); } });
        
        document.querySelectorAll('.add-button').forEach(button => { button.addEventListener('click', function() {
            const selectContainer = button.previousElementSibling;
            const choice = Object.values(choiceInstances).find(inst => inst.containerOuter.element === selectContainer);
            const selectedValue = choice ? choice.getValue(true) : null;
            
            if (selectedValue && selectedValue !== "") {
                const category = Object.keys(choiceInstances).find(key => choiceInstances[key] === choice);
                const targetTextarea = textareas[category];
                targetTextarea.value += (targetTextarea.value.trim() !== "" ? ", " : "") + selectedValue;
                updateFinalPrompt();
                choice.clearInput();
                choice.setChoiceByValue('');
            }
        }); });

        Object.values(textareas).forEach(textarea => textarea.addEventListener('input', updateFinalPrompt));
        copyButton.addEventListener('click', function() {
            let textToCopy = finalPromptTextarea.value.trim();
            const negativeText = negativePromptTextarea.value.trim();
            if(negativeText !== ''){ textToCopy += ` --no ${negativeText}`; }
            navigator.clipboard.writeText(textToCopy).then(() => {
                const buttonTextSpan = this.querySelector('span');
                const originalText = buttonTextSpan ? buttonTextSpan.textContent : this.textContent;
                const target = buttonTextSpan || this;
                target.textContent = translations[currentLanguage].copyButtonSuccess;
                setTimeout(() => { target.textContent = originalText; }, 1500);
            });
        });
        translateButton.addEventListener('click', function() { const promptText = finalPromptTextarea.value; if (promptText.trim() === '') return; const encodedText = encodeURIComponent(promptText); const translateUrl = `https://translate.google.com/?sl=hu&tl=en&text=${encodedText}`; window.open(translateUrl, '_blank'); });
        historyButton.addEventListener('click', () => { renderHistory(); openModal(historyModal); });
        closeHistoryModalBtn.addEventListener('click', () => { overlay.classList.add('hidden'); historyModal.classList.add('hidden'); });
        historyList.addEventListener('click', (e) => { if (e.target.classList.contains('history-item')) { finalPromptTextarea.value = e.target.textContent; overlay.classList.add('hidden'); historyModal.classList.add('hidden'); } });
        
        initializeGenerator();
    }
    
    // ARTIST PAGE - COPY BUTTON LOGIC
    if (document.querySelector('.copy-artist-btn')) {
        const copyButtons = document.querySelectorAll('.copy-artist-btn');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const artistName = button.dataset.artist;
                navigator.clipboard.writeText(artistName).then(() => {
                    const originalIcon = button.innerHTML;
                    button.innerHTML = '<i class="fa-solid fa-check"></i>';
                    button.classList.add('copied');
                    
                    copyButtons.forEach(btn => {
                        if (btn !== button && btn.classList.contains('copied')) {
                            btn.innerHTML = '<i class="fa-solid fa-copy"></i>';
                            btn.classList.remove('copied');
                        }
                    });

                    setTimeout(() => {
                        button.innerHTML = originalIcon;
                        button.classList.remove('copied');
                    }, 1500);
                }).catch(err => {
                    console.error('Hiba a másolás során:', err);
                });
            });
        });
    }

    // BACK TO TOP BUTTON LOGIC
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.remove('hidden');
            } else {
                backToTopButton.classList.add('hidden');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Vendégkönyv kommentek betöltése (JAVÍTOTT VERZIÓ)
    function loadComments() {
        const commentsContainer = document.getElementById('comments-list');
        if (!commentsContainer) {
            return;
        }

        fetch('/_data/comments.json')
            .then(response => {
                if (!response.ok) { throw new Error('Hálózati hiba'); }
                return response.json();
            })
            .then(comments => {
                commentsContainer.innerHTML = ''; 
                if (comments.length === 0) {
                    commentsContainer.innerHTML = `<p>${translations[currentLanguage].guestbookNoComments}</p>`;
                    return;
                }
                
                comments.reverse().forEach(comment => {
                    const commentElement = document.createElement('div');
                    commentElement.className = 'comment-item';
                    
                    const header = document.createElement('div');
                    header.className = 'comment-header';
                    
                    const name = document.createElement('strong');
                    name.textContent = comment.name;
                    
                    const date = document.createElement('span');
                    date.className = 'comment-date';
                    date.textContent = comment.date;
                    
                    header.appendChild(name);
                    header.appendChild(date);
                    
                    const message = document.createElement('p');
                    message.className = 'comment-message';
                    message.textContent = comment.message;
                    
                    commentElement.appendChild(header);
                    commentElement.appendChild(message);
                    
                    commentsContainer.appendChild(commentElement);
                });
            })
            .catch(error => {
                console.error('Hiba a kommentek betöltése közben:', error);
                commentsContainer.innerHTML = `<p>${translations[currentLanguage].guestbookError}</p>`;
            });
    }

    setLanguage(currentLanguage);
    loadComments(); 
});