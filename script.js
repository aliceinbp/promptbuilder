document.addEventListener('DOMContentLoaded', function() {

    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const translations = {
        hu: {
            navHome: "Főoldal",
            navGenerator: "Generátor",
            navLinks: "Ajánlások",
            navGallery: "Galéria",
            navArtists: "Művészek",
            siteSubtitle: "AI Képalkotó Segédlet by Aliceinbp",
            welcomeTitle: "Engedd szabadjára a kreativitásod!",
            welcomeText: "Üdv a Prompt Lab-ben! Ezt az oldalt azért hoztam létre, hogy segítsek neked és a hozzám hasonló AI művészet rajongóknak a lehető legjobb képeket alkotni. Itt minden eszközt megtalálsz, amire szükséged lehet a tökéletes prompt összeállításához.",
            welcomeButton: "Irány a Generátor!",
            featuredTitle: "Ízelítő a Galériából",
            galleryTitle: "Galéria",
            comingSoon: "Hamarosan...",
            galleryCatFantasy: "Fantasy Portrék",
            galleryCatDark: "Dark & Gothic",
            galleryCatWorlds: "Mágikus Világok",
            galleryCatShards: "Fantázia Szilánkok",
            linksTitle: "Ajánlott AI Képalkotó Oldalak",
            nightcafeDesc: "Nagyon felhasználóbarát, naponta ad ingyenes krediteket. Többféle AI modellt is használ, és erős a közösségi része.",
            leonardoDesc: "Profi felület, szintén napi ingyenes kreditekkel. Különösen jó konzisztens karakterek és saját modellek tanítására.",
            imgtoimgDesc: "Napi bejelentkezéssel ad ingyenes krediteket. Képes a meglévő képeket átalakítani promptok alapján.",
            copilotDesc: "A legújabb DALL-E 3 modellt használja, és teljesen ingyenes egy Microsoft fiókkal. Kiváló minőséget produkál.",
            playgroundDesc: "Naponta rengeteg ingyenes kép készíthető vele. Nagyon letisztult, könnyen kezelhető felület, ideális kezdőknek is.",
            visitButton: "Oldal Megnyitása",
            randomButton: "Véletlen Prompt",
            clearAllButton: "Mindent Töröl",
            saveButton: "Mentés",
            savedPromptsTitle: "Mentett Promptok",
            negativePromptLabel: "Negatív Prompt (amit NE tartalmazzon a kép)",
            negativePromptPlaceholder: "pl. elmosódott, rossz minőségű, extra ujjak...",
            infoModalTitle: "A Prompt Lab-ről",
            infoModalText1: "Szia! Ez az oldal azért készült, hogy segítsen neked lenyűgöző promptokat (utasításokat) generálni AI képalkotó programokhoz.",
            infoModalText2: "Használd a legördülő menüket, vagy írd be a saját ötleteidet. Kombináld a stílusokat, témákat és helyszíneket, mentsd el a kedvenceidet, és alkoss valami csodálatosat!",
            historyModalTitle: "Prompt Előzmények",
            artistsTitle: "Művész Adatbázis",
            artistsSubtitle: "Tisztelgés a művészek előtt",
            styleLabel: "Stílus:", subjectLabel: "Téma:", settingLabel: "Helyszín:", extraLabel: "Extrák:", addButton: "Hozzáad",
            stylePlaceholder: "Itt szerkesztheted a kiválasztott stílusokat... vagy alkosd meg a sajátod",
            subjectPlaceholder: "Itt szerkesztheted a kiválasztott témákat... vagy alkosd meg a sajátod",
            settingPlaceholder: "Itt szerkesztheted a kiválasztott helyszíneket... vagy alkosd meg a sajátod",
            extraPlaceholder: "Itt szerkesztheted a kiválasztott extrákat... vagy alkosd meg a sajátod",
            finalPromptLabel: "Végleges prompt (angolul)",
            finalPromptPlaceholder: "Az összeállított prompt itt fog megjelenni...",
            copyButton: "Prompt másolása",
            copyButtonSuccess: "Másolva!",
            translateButton: "Fordítás Angolra",
            chatTitle: "Vendégkönyv / Chat",
            selectDefault: "Válassz egyet a(z) {category} kategóriából..."
        },
        en: {
            navHome: "Home", navGenerator: "Generator", navLinks: "Links", navGallery: "Gallery", navArtists: "Artists",
            siteSubtitle: "AI Image Creation Helper by Aliceinbp",
            welcomeTitle: "Unleash Your Creativity!",
            welcomeText: "Welcome to the Prompt Lab! I created this site to help AI art fans like myself to create the best possible images. Here you will find all the tools you need to build the perfect prompt.",
            welcomeButton: "Go to the Generator!",
            featuredTitle: "Featured from the Gallery",
            galleryTitle: "Gallery", comingSoon: "Coming Soon...",
            galleryCatFantasy: "Fantasy Portraits", galleryCatDark: "Dark & Gothic",
            galleryCatWorlds: "Magical Worlds", galleryCatShards: "Shards of Fantasy",
            linksTitle: "Recommended AI Image Generators",
            nightcafeDesc: "Very user-friendly, provides daily free credits. Uses multiple AI models and has a strong community aspect.",
            leonardoDesc: "Professional interface, also with daily free credits. Especially good for consistent characters and training your own models.",
            imgtoimgDesc: "Provides free credits with daily login. Capable of transforming existing images based on prompts.",
            copilotDesc: "Uses the latest DALL-E 3 model and is completely free with a Microsoft account. Produces excellent quality.",
            playgroundDesc: "You can create a large number of free images daily. Very clean, easy-to-use interface, also ideal for beginners.",
            visitButton: "Visit Site",
            randomButton: "Random Prompt", clearAllButton: "Clear All", saveButton: "Save", savedPromptsTitle: "Saved Prompts",
            negativePromptLabel: "Negative Prompt (what the image should NOT contain)", negativePromptPlaceholder: "e.g. blurry, bad quality, extra fingers...",
            infoModalTitle: "About The Prompt Lab",
            infoModalText1: "Hi! This site was created to help you generate amazing prompts for AI image generators.",
            infoModalText2: "Use the dropdowns, or type in your own ideas. Combine styles, subjects, and settings, save your favorites, and create something wonderful!",
            historyModalTitle: "Prompt History",
            artistsTitle: "Artist Database",
            artistsSubtitle: "A tribute to the artists",
            styleLabel: "Style:", subjectLabel: "Subject:", settingLabel: "Setting:", extraLabel: "Extra:", addButton: "Add",
            stylePlaceholder: "You can edit the selected styles here... or create your own",
            subjectPlaceholder: "You can edit the selected subjects here... or create your own",
            settingPlaceholder: "You can edit the selected settings here... or create your own",
            extraPlaceholder: "You can edit the selected extras here... or create your own",
            finalPromptLabel: "Final prompt (English)",
            finalPromptPlaceholder: "The combined prompt will appear here...",
            copyButton: "Copy Prompt",
            copyButtonSuccess: "Copied!",
            translateButton: "Translate to English",
            chatTitle: "Guestbook / Chat",
            selectDefault: "Choose an option from {category}..."
        }
    };

    let currentLanguage = localStorage.getItem('preferredLanguage') || 'en';

    function setLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('preferredLanguage', lang);
        document.querySelectorAll('[data-key]').forEach(elem => {
            const key = elem.dataset.key;
            if (translations[lang] && translations[lang][key]) {
                const text = translations[lang][key];
                if (elem.placeholder !== undefined) { elem.placeholder = text; } 
                else { elem.textContent = text; }
            }
        });
        const langHu = document.getElementById('lang-hu');
        const langEn = document.getElementById('lang-en');
        if (langHu && langEn) {
            langHu.classList.toggle('active', lang === 'hu');
            langEn.classList.toggle('active', lang === 'en');
        }
        const translateButton = document.getElementById('translate-button');
        if (translateButton) {
            translateButton.classList.toggle('hidden', lang !== 'hu');
        }
        if (typeof populateSelects === 'function') {
            populateSelects();
        }
        if (typeof renderSavedPrompts === 'function') {
            renderSavedPrompts();
        }
    }

    const langHu = document.getElementById('lang-hu');
    const langEn = document.getElementById('lang-en');
    if (langHu && langEn) {
        langHu.addEventListener('click', (e) => { e.preventDefault(); setLanguage('hu'); });
        langEn.addEventListener('click', (e) => { e.preventDefault(); setLanguage('en'); });
    }

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

    // === CSAK A GENERÁTOR OLDALON (generator.html) SZÜKSÉGES LOGIKA ===
    if (document.getElementById('random-button')) {
    
        const defaultPrompts = {
            en: { /* ... (a teljes prompt lista itt van) ... */ },
            hu: { /* ... (a teljes prompt lista itt van) ... */ }
        };
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
                populateSelects();
            }
            newPromptInput.value = '';
            newPromptInput.focus();
        }

        function deleteCustomPrompt(index) {
            const customPrompts = getCustomPrompts();
            customPrompts[currentManagedCategory].splice(index, 1);
            saveCustomPrompts(customPrompts);
            renderManageList();
            populateSelects();
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
            if (promptHistory.length > 15) {
                promptHistory.pop();
            }
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

        function populateSelects() {
            const combinedPrompts = getCombinedPrompts(currentLanguage);
            for (const category in combinedPrompts) {
                const selectElement = document.getElementById(`${category}-select`);
                if (selectElement) {
                    selectElement.innerHTML = '';
                    const defaultOption = document.createElement('option');
                    let defaultText = translations[currentLanguage].selectDefault.replace('{category}', category);
                    defaultOption.textContent = defaultText;
                    defaultOption.value = "";
                    selectElement.appendChild(defaultOption);
                    combinedPrompts[category].forEach(optionText => {
                        const option = document.createElement('option');
                        option.value = optionText;
                        option.textContent = optionText;
                        selectElement.appendChild(option);
                    });
                }
            }
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
        document.querySelectorAll('.add-button').forEach(button => { button.addEventListener('click', function() { const selectElement = this.previousElementSibling; const targetTextareaId = selectElement.id.replace('-select', '-text'); const targetTextarea = document.getElementById(targetTextareaId); const selectedValue = selectElement.value; if (selectedValue) { targetTextarea.value += (targetTextarea.value.trim() !== "" ? ", " : "") + selectedValue; updateFinalPrompt(); } selectElement.selectedIndex = 0; }); });
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
        historyList.addEventListener('click', (e) => { if (e.target.classList.contains('history-item')) { finalPromptTextarea.value = e.target.textContent; /*updateFinalPrompt();*/ overlay.classList.add('hidden'); historyModal.classList.add('hidden'); } });
        
        renderSavedPrompts();
        updateFinalPrompt();
    }
    
    setLanguage(currentLanguage);
});