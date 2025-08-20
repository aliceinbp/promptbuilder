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
                const titleKey = `explainerTitle${category.charAt(0).toUpperCase() + category.slice(1)}`;
                const textKey = `explainerText${category.charAt(0).toUpperCase() + category.slice(1)}`;
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

    // TÉMAVÁLASZTÓ LOGIKA
    const themeToggleButton = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    function applyTheme(theme) {
    // Ez a rész már megvan, ez váltja az oldal témáját
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        if (themeToggleButton) themeToggleButton.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
        document.body.classList.remove('light-theme');
        if (themeToggleButton) themeToggleButton.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
    const cusdisFrame = document.querySelector('#cusdis_thread iframe');
    if (cusdisFrame) {
        cusdisFrame.contentWindow.postMessage({
            type: 'setTheme',
            theme: theme === 'light' ? 'light' : 'dark'
        }, 'https://cusdis.com');
    }
}

    let currentLanguage = localStorage.getItem('preferredLanguage') || 'en';

    function setLanguage(lang) {
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
        langHu.addEventListener('click', (e) => {
            e.preventDefault();
            setLanguage('hu');
        });
        langEn.addEventListener('click', (e) => {
            e.preventDefault();
            setLanguage('en');
        });
    }

    const overlay = document.getElementById('modal-overlay');
    const infoModal = document.getElementById('info-modal');
    const infoButton = document.getElementById('info-button');

    if (infoButton && infoModal && overlay) {
        const closeInfoModalBtn = infoModal.querySelector('.close-modal-btn');
        const open = () => {
            overlay.classList.remove('hidden');
            infoModal.classList.remove('hidden');
        };
        const close = () => {
            overlay.classList.add('hidden');
            infoModal.classList.add('hidden');
        };
        infoButton.addEventListener('click', open);
        closeInfoModalBtn.addEventListener('click', close);
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            document.querySelectorAll('.modal').forEach(modal => modal.classList.add('hidden'));
            overlay.classList.add('hidden');
        });
    }

    // --- GENERATOR OLDAL LOGIKÁJA ---
    if (document.querySelector('.prompt-section')) {
        let currentManagedCategory = '';
        const textareas = {
            style: document.getElementById('style-text'),
            subject: document.getElementById('subject-text'),
            setting: document.getElementById('setting-text'),
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
        const translateButton = document.getElementById('translate-button'); // ÚJ
        let promptHistory = [];
        let historyTimeout;
        let choiceInstances = {};
        
        if (finalPromptContainer && typeof Sortable !== 'undefined') {
            new Sortable(finalPromptContainer, {
                animation: 150,
                ghostClass: 'sortable-ghost'
            });
        }

        function getCustomPrompts() { return JSON.parse(localStorage.getItem('customPrompts')) || { style: [], subject: [], setting: [], extra: [] }; }
        function saveCustomPrompts(customPrompts) { localStorage.setItem('customPrompts', JSON.stringify(customPrompts)); }
        function openModal(modal) { overlay.classList.remove('hidden'); modal.classList.remove('hidden'); }

        function openManageModal(category) {
            currentManagedCategory = category;
            const manageModalTitle = document.getElementById('manage-modal-title');
            const categoryLabelKey = category + 'Label';
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
        
        function getPromptTextFromTags() {
            if (!finalPromptContainer) return '';
            const tags = finalPromptContainer.querySelectorAll('.prompt-tag');
            const tagTexts = Array.from(tags).map(tag => tag.textContent);
            return tagTexts.join(', ');
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
                const tag = document.createElement('span');
                tag.className = 'prompt-tag';
                tag.textContent = prompt;
                finalPromptContainer.appendChild(tag);
                finalPromptHiddenTextarea.value = prompt;
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
            
            ['style', 'subject', 'setting', 'extra'].forEach(category => {
                const text = textareas[category].value.trim();
                if (text) {
                    text.split(',').forEach(part => {
                        const trimmedPart = part.trim();
                        if(trimmedPart) {
                            allParts.push(trimmedPart);
                        }
                    });
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
                const combinedSet = new Set([...(defaults[category] || []), ...(custom[category] || [])]);
                combined[category] = [...combinedSet];
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
                    choices: options,
                    searchPlaceholderValue: "Keress...",
                    itemSelectText: "Kiválaszt",
                    allowHTML: false,
                    shouldSort: false,
                    placeholder: true,
                    placeholderValue: translations[currentLanguage].selectDefault.replace('{category}', translations[currentLanguage][category + 'Label'].replace(':', '')),
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

        // --- ESEMÉNYFIGYELŐK ---
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
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addNewCustomPrompt();
                }
            });
            document.getElementById('manage-prompts-list').addEventListener('click', function(event) {
                const target = event.target.closest('.delete-custom-prompt-btn');
                if (target) { deleteCustomPrompt(parseInt(target.dataset.index, 10)); }
            });
        }

        document.querySelectorAll('.add-button').forEach(button => {
            button.addEventListener('click', function() {
                const parentSection = this.closest('.prompt-section');
                if (!parentSection) return;
                const selectElement = parentSection.querySelector('select');
                const category = selectElement.id.replace('-select', '');
                const choice = choiceInstances[category];
                const selectedValue = choice ? choice.getValue(true) : null;
                if (selectedValue && selectedValue !== "") {
                    const targetTextarea = textareas[category];
                    targetTextarea.value += (targetTextarea.value.trim() !== "" ? ", " : "") + selectedValue;
                    updateFinalPrompt();
                    choice.clearInput();
                    choice.setChoiceByValue('');
                }
            });
        });

        Object.values(textareas).forEach(textarea => textarea.addEventListener('input', updateFinalPrompt));

        copyButton.addEventListener('click', function() {
            let textToCopy = getPromptTextFromTags();
            const negativeText = negativePromptTextarea.value.trim();
            if (negativeText !== '') { textToCopy += ` --no ${negativeText}`; }
            navigator.clipboard.writeText(textToCopy).then(() => {
                const buttonTextSpan = this.querySelector('span');
                const originalText = buttonTextSpan ? buttonTextSpan.textContent : this.textContent;
                const target = buttonTextSpan || this;
                target.textContent = translations[currentLanguage].copyButtonSuccess;
                setTimeout(() => {
                    target.textContent = originalText;
                }, 1500);
            });
        });

        // ÚJ FORDÍTÓ GOMB LOGIKA
        if (translateButton) {
            translateButton.addEventListener('click', async () => {
                const buttonSpan = translateButton.querySelector('span') || translateButton;
                const originalText = buttonSpan.textContent;
                buttonSpan.textContent = 'Fordítás...';
                translateButton.disabled = true;

                try {
                    for (const category in textareas) {
                        const textarea = textareas[category];
                        const text = textarea.value.trim();
                        
                        // Csak akkor fordítunk, ha van szöveg és valószínűleg magyar
                        // Egyszerűsített ellenőrzés: nem fordítunk, ha tipikus angol kulcsszavakat tartalmaz
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
                    const tag = document.createElement('span');
                    tag.className = 'prompt-tag';
                    tag.textContent = prompt;
                    finalPromptContainer.appendChild(tag);
                    finalPromptHiddenTextarea.value = prompt;
                    overlay.classList.add('hidden');
                    historyModal.classList.add('hidden');
                }
            });
        }
    }
    
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
            container.innerHTML = '';
            artists.forEach(artist => {
                const card = document.createElement('div');
                card.className = 'artist-card';
                const copyName = artist.copyName || artist.name;
                card.innerHTML = `<div class="artist-card-header"><h3>${artist.name}</h3><button class="copy-artist-btn" data-artist="${copyName}" data-key-title="copyTooltip"><i class="fa-solid fa-copy"></i></button></div><p data-key="${artist.dataKey}"></p>`;
                container.appendChild(card);
            });
            initializeArtistCopyButtons();
            setLanguage(currentLanguage);
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
            setLanguage(currentLanguage);
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
                        setLanguage(currentLanguage);
                    }, 2000);
                });
            });
        } catch (error) {
            console.error("Hiba a nap promptjának betöltésekor:", error);
            promptTextElement.textContent = "A nap promptja jelenleg nem érhető el.";
        }
    }

    // --- BLOG LOGIKA ---
    
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
            container.innerHTML = `<div class="post-header"><h1>${title}</h1><p class="post-meta">${translations[currentLanguage].postedOn} ${postDate}</p></div><img src="${frontmatter.image}" alt="${title}" class="post-featured-image"><div class="post-body">${bodyHtml}</div>`;
        } catch (error) {
            console.error('Hiba a bejegyzés betöltésekor:', error);
            container.innerHTML = '<p>A bejegyzés nem tölthető be.</p>';
        }
    }

    // --- Indítás ---
    applyTheme(currentTheme);
    setLanguage(currentLanguage);
    loadArtists();
    loadGallery();
    loadDailyPrompt();

    if (document.getElementById('blog-posts-container')) {
        loadBlogPosts();
    }
    if (document.getElementById('post-content-container')) {
        loadSinglePost();
    }
    // ===== NAPI IDÉZET LOGIKA =====
function displayDailyQuote() {
    const quoteContainer = document.getElementById('daily-quote-container');
    if (!quoteContainer) return; // Ha nem a főoldalon vagyunk, ne csináljon semmit

    const quoteTextElem = document.getElementById('quote-text');
    const quoteAuthorElem = document.getElementById('quote-author');
    const closeBtn = document.getElementById('close-quote-btn');

    // Dátum alapú idézet kiválasztása
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const quoteIndex = dayOfYear % dailyQuotes.length;
    const todayQuote = dailyQuotes[quoteIndex];

    // Ellenőrizzük, hogy a mai napon bezárta-e már
    const lastClosedDay = localStorage.getItem('quoteClosedDay');
    if (lastClosedDay == dayOfYear) {
        quoteContainer.classList.add('hidden');
        return;
    }
    
    quoteContainer.classList.remove('hidden');

    // Tartalom beállítása a nyelv alapján
    function setQuoteContent() {
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        quoteTextElem.textContent = (lang === 'hu') ? `„${todayQuote.quote_hu}”` : `“${todayQuote.quote_en}”`;
        quoteAuthorElem.textContent = `– ${todayQuote.author}`;
    }

    setQuoteContent();

    // Bezárás gomb
    closeBtn.addEventListener('click', () => {
        quoteContainer.classList.add('closing');
        setTimeout(() => {
            quoteContainer.classList.add('hidden');
            quoteContainer.classList.remove('closing');
        }, 500); // Megvárjuk az animáció végét
        localStorage.setItem('quoteClosedDay', dayOfYear);
    });
    
    // A nyelvváltó függvény kiegészítése
    // Ez biztosítja, hogy a HUN/ENG gombra kattintva az idézet is leforduljon
    const originalSetLanguage = window.setLanguage;
    window.setLanguage = function(lang) {
        originalSetLanguage(lang);
        setQuoteContent();
    }
}

// A fájl végén, ahol a többi indító függvény is van, hívd meg ezt is:
displayDailyQuote();
});