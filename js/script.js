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
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            if (themeToggleButton) themeToggleButton.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            document.body.classList.remove('light-theme');
            if (themeToggleButton) themeToggleButton.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            let theme = document.body.classList.toggle('light-theme') ? 'light' : 'dark';
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

    if (document.getElementById('random-button')) {
        let currentManagedCategory = '';
        const textareas = {
            style: document.getElementById('style-text'),
            subject: document.getElementById('subject-text'),
            setting: document.getElementById('setting-text'),
            extra: document.getElementById('extra-text')
        };
        const finalPromptTextarea = document.getElementById('final-prompt');
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
        let promptHistory = [];
        let historyTimeout;
        let choiceInstances = {};

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

        function saveCurrentPrompt() {
            const promptToSave = finalPromptTextarea.value.trim();
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
            const savedPromptsList = document.getElementById('saved-prompts-list');
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
                finalPromptTextarea.value = saved[index];
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

        randomButton.addEventListener('click', generateRandomPrompt);
        clearAllButton.addEventListener('click', clearAllTextareas);
        savePromptButton.addEventListener('click', saveCurrentPrompt);
        savedPromptsList.addEventListener('click', handleSavedListClick);

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
            let textToCopy = finalPromptTextarea.value.trim();
            const negativeText = negativePromptTextarea.value.trim();
            if (negativeText !== '') { textToCopy += ` --no ${negativeText}`; }
            navigator.clipboard.writeText(textToCopy).then(() => {
                const buttonTextSpan = this.querySelector('span') || this;
                const originalText = buttonTextSpan.textContent;
                buttonTextSpan.textContent = translations[currentLanguage].copyButtonSuccess;
                setTimeout(() => { buttonTextSpan.textContent = originalText; }, 1500);
            });
        });

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
                    finalPromptTextarea.value = e.target.textContent;
                    overlay.classList.add('hidden');
                    historyModal.classList.add('hidden');
                }
            });
        }
    }

    // ÚJ FUNKCIÓ: Művész másolás gombok inicializálása
    function initializeArtistCopyButtons() {
        document.querySelectorAll('.copy-artist-btn').forEach(button => {
            // Hozzáadunk egy jelzőt, hogy ne duplázzuk az eseményfigyelőt
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

    function loadComments() {
        const commentsContainer = document.getElementById('comments-list');
        if (!commentsContainer) return;

        fetch('/_data/comments.json')
            .then(response => { if (!response.ok) { throw new Error('Network response was not ok'); } return response.json(); })
            .then(comments => {
                commentsContainer.innerHTML = '';
                if (comments.length === 0) {
                    commentsContainer.innerHTML = `<p>${translations[currentLanguage].guestbookNoComments}</p>`;
                    return;
                }
                comments.reverse().forEach(comment => {
                    const commentElement = document.createElement('div');
                    commentElement.className = 'comment-item';
                    commentElement.innerHTML = `
                        <div class="comment-header">
                            <strong>${comment.name}</strong>
                            <span class="comment-date">${comment.date}</span>
                        </div>
                        <p class="comment-message">${comment.message}</p>
                    `;
                    commentsContainer.appendChild(commentElement);
                });
            })
            .catch(error => {
                console.error('Hiba a kommentek betöltése közben:', error);
                commentsContainer.innerHTML = `<p>${translations[currentLanguage].guestbookError}</p>`;
            });
    }
    
    // --- ÚJ DINAMIKUS TARTALOMBETÖLTŐ FUNKCIÓK ---

    async function loadArtists() {
        const container = document.querySelector('.artist-grid');
        if (!container) return;

        try {
            const response = await fetch('/_data/artists.json');
            const artists = await response.json();
            
            container.innerHTML = ''; // Kiürítjük a konténert
            
            artists.forEach(artist => {
                const card = document.createElement('div');
                card.className = 'artist-card';
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
            
            initializeArtistCopyButtons(); // Újra kell futtatni, hogy az új gombok is működjenek
            setLanguage(currentLanguage); // Frissítjük a leírásokat és tooltip-eket az aktuális nyelvre

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
            
            container.innerHTML = ''; // Kiürítjük a teljes szekciót
            
            const categoryMap = {
                fantasy: 'galleryCatFantasy',
                dark: 'galleryCatDark',
                worlds: 'galleryCatWorlds',
                shards: 'galleryCatShards'
            };

            for (const categoryKey in galleryData) {
                const images = galleryData[categoryKey];
                const titleKey = categoryMap[categoryKey];

                // Kategória cím létrehozása
                const title = document.createElement('h2');
                title.className = 'gallery-category-title';
                title.innerHTML = `<span data-key="${titleKey}"></span>`;
                container.appendChild(title);
                
                // Képrács létrehozása
                const grid = document.createElement('div');
                grid.className = 'gallery-grid';

                images.forEach(image => {
                    const item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.innerHTML = `
                        <a href="src/gallery-images/${image.src}" target="_blank">
                            <img src="src/gallery-images/${image.src}" alt="${image.alt}" loading="lazy">
                        </a>
                    `;
                    grid.appendChild(item);
                });
                container.appendChild(grid);
            }
            
            setLanguage(currentLanguage); // Frissítjük a címeket az aktuális nyelvre

        } catch (error) {
            console.error('Hiba a galéria betöltésekor:', error);
            container.innerHTML = '<p>A galéria jelenleg nem érhető el.</p>';
        }
    }

    // --- BLOG LOGIKA ---
    
    const markdownConverter = typeof showdown !== 'undefined' ? new showdown.Converter() : null;

    function parseFrontmatter(markdown) {
        const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
        const match = markdown.match(frontmatterRegex);
        
        if (!match) {
            return { frontmatter: {}, content: markdown };
        }

        const yamlString = match[1];
        const content = markdown.replace(frontmatterRegex, '');
        
        try {
            const frontmatter = jsyaml.load(yamlString);
            return { frontmatter, content };
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

            const postPromises = files
                .filter(file => file.name && file.name.endsWith('.md'))
                .map(async (file) => {
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

                const postDate = new Date(post.date).toLocaleDateString(currentLanguage === 'hu' ? 'hu-HU' : 'en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });

                const card = document.createElement('div');
                card.className = 'blog-card';
                card.innerHTML = `
                    <a href="post.html?slug=${post.slug}"><img src="${post.image}" alt="${title}" class="blog-card-image"></a>
                    <div class="blog-card-content">
                        <h3><a href="post.html?slug=${post.slug}" style="text-decoration:none; color: inherit;">${title}</a></h3>
                        <p class="blog-card-meta">${translations[currentLanguage].postedOn} ${postDate}</p>
                        <p class="blog-card-excerpt">${excerpt}</p>
                        <a href="post.html?slug=${post.slug}" class="blog-card-read-more">${translations[currentLanguage].readMore}</a>
                    </div>
                `;
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
            const postDate = new Date(frontmatter.date).toLocaleDateString(currentLanguage === 'hu' ? 'hu-HU' : 'en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
            
            document.title = `${title} - Prompt Lab Blog`;

            container.innerHTML = `
                <div class="post-header">
                    <h1>${title}</h1>
                    <p class="post-meta">${translations[currentLanguage].postedOn} ${postDate}</p>
                </div>
                <img src="${frontmatter.image}" alt="${title}" class="post-featured-image">
                <div class="post-body">
                    ${bodyHtml}
                </div>
            `;

        } catch (error) {
            console.error('Hiba a bejegyzés betöltésekor:', error);
            container.innerHTML = '<p>A bejegyzés nem tölthető be.</p>';
        }
    }

    // --- Indítás ---
    applyTheme(currentTheme);
    setLanguage(currentLanguage); // Ez fontos, hogy a dinamikus tartalmak előtt fusson le
    loadComments();
    loadArtists(); // ÚJ
    loadGallery(); // ÚJ

    if (document.getElementById('blog-posts-container')) {
        loadBlogPosts();
    }
    if (document.getElementById('post-content-container')) {
        loadSinglePost();
    }
});