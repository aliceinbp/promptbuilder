document.addEventListener('DOMContentLoaded', function() {

    const translations = {
        hu: {
            navHome: "Főoldal", navLinks: "Ajánlások", navGallery: "Galéria",
            galleryTitle: "Galéria", comingSoon: "Hamarosan...",
            galleryCatFantasy: "Fantasy Portrék", galleryCatDark: "Dark & Gothic",
            galleryCatWorlds: "Mágikus Világok", galleryCatShards: "Fantázia Szilánkok",
            linksTitle: "Ajánlott AI Képalkotó Oldalak",
            nightcafeDesc: "Nagyon felhasználóbarát, naponta ad ingyenes krediteket. Többféle AI modellt is használ, és erős a közösségi része.",
            leonardoDesc: "Profi felület, szintén napi ingyenes kreditekkel. Különösen jó konzisztens karakterek és saját modellek tanítására.",
            imgtoimgDesc: "Napi bejelentkezéssel ad ingyenes krediteket. Képes a meglévő képeket átalakítani promptok alapján.",
            copilotDesc: "A legújabb DALL-E 3 modellt használja, és teljesen ingyenes egy Microsoft fiókkal. Kiváló minőséget produkál.",
            playgroundDesc: "Naponta rengeteg ingyenes kép készíthető vele. Nagyon letisztult, könnyen kezelhető felület, ideális kezdőknek is.",
            visitButton: "Oldal Megnyitása",
            randomButton: "Véletlen Prompt", clearAllButton: "Mindent Töröl", saveButton: "Mentés", savedPromptsTitle: "Mentett Promptok",
            negativePromptLabel: "Negatív Prompt (amit NE tartalmazzon a kép)", negativePromptPlaceholder: "pl. elmosódott, rossz minőségű, extra ujjak...",
            infoModalTitle: "A Prompt Builderről", infoModalText1: "Szia! Ez az oldal azért készült, hogy segítsen neked lenyűgöző promptokat (utasításokat) generálni AI képalkotó programokhoz.",
            infoModalText2: "Használd a legördülő menüket, vagy írd be a saját ötleteidet. Kombináld a stílusokat, témákat és helyszíneket, mentsd el a kedvenceidet, és alkoss valami csodálatosat!",
            historyModalTitle: "Prompt Előzmények",
            styleLabel: "Stílus:", subjectLabel: "Téma:", settingLabel: "Helyszín:", extraLabel: "Extrák:", addButton: "Hozzáad",
            stylePlaceholder: "Itt szerkesztheted a kiválasztott stílusokat... vagy alkosd meg a sajátod", subjectPlaceholder: "Itt szerkesztheted a kiválasztott témákat... vagy alkosd meg a sajátod",
            settingPlaceholder: "Itt szerkesztheted a kiválasztott helyszíneket... vagy alkosd meg a sajátod", extraPlaceholder: "Itt szerkesztheted a kiválasztott extrákat... vagy alkosd meg a sajátod",
            finalPromptLabel: "Végleges prompt (angolul)", finalPromptPlaceholder: "Az összeállított prompt itt fog megjelenni...",
            copyButton: "Prompt másolása", copyButtonSuccess: "Másolva!", translateButton: "Fordítás Angolra",
            chatTitle: "Vendégkönyv / Chat", selectDefault: "Válassz egyet a(z) {category} kategóriából..."
        },
        en: {
            navHome: "Home", navLinks: "Links", navGallery: "Gallery",
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
            infoModalTitle: "About The Prompt Builder", infoModalText1: "Hi! This site was created to help you generate amazing prompts for AI image generators.",
            infoModalText2: "Use the dropdowns, or type in your own ideas. Combine styles, subjects, and settings, save your favorites, and create something wonderful!",
            historyModalTitle: "Prompt History",
            styleLabel: "Style:", subjectLabel: "Subject:", settingLabel: "Setting:", extraLabel: "Extra:", addButton: "Add",
            stylePlaceholder: "You can edit the selected styles here... or create your own", subjectPlaceholder: "You can edit the selected subjects here... or create your own",
            settingPlaceholder: "You can edit the selected settings here... or create your own", extraPlaceholder: "You can edit the selected extras here... or create your own",
            finalPromptLabel: "Final prompt (English)", finalPromptPlaceholder: "The combined prompt will appear here...",
            copyButton: "Copy Prompt", copyButtonSuccess: "Copied!", translateButton: "Translate to English",
            chatTitle: "Guestbook / Chat", selectDefault: "Choose an option from {category}..."
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
        document.getElementById('lang-hu').classList.toggle('active', lang === 'hu');
        document.getElementById('lang-en').classList.toggle('active', lang === 'en');
        const translateButton = document.getElementById('translate-button');
        if (translateButton) translateButton.classList.toggle('hidden', lang !== 'hu');
        if (typeof populateSelects === 'function') populateSelects();
    }

    document.getElementById('lang-hu').addEventListener('click', (e) => { e.preventDefault(); setLanguage('hu'); });
    document.getElementById('lang-en').addEventListener('click', (e) => { e.preventDefault(); setLanguage('en'); });

    const overlay = document.getElementById('modal-overlay');
    const infoModal = document.getElementById('info-modal');
    const infoButton = document.getElementById('info-button');
    const closeInfoModalBtn = infoModal.querySelector('.close-modal-btn');
    
    if (infoButton) {
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

    if (document.getElementById('random-button')) {
        const defaultPrompts = {
            // ... (Itt van a teljes, nagy defaultPrompts objektum)
        };

        // ... (És itt az összes többi, főoldalhoz tartozó kód)
        let promptHistory = [];
        let historyTimeout;

        // ... (és az összes többi funkció és eseményfigyelő, ami a főoldalhoz kell)
        
        const historyModal = document.getElementById('history-modal');
        const historyButton = document.getElementById('history-button');
        const historyList = document.getElementById('history-list');
        const closeHistoryModalBtn = historyModal.querySelector('.close-modal-btn');

        function saveToHistory(prompt) {
            if (!prompt || prompt === promptHistory[promptHistory.length - 1]) return;
            promptHistory.push(prompt);
            if (promptHistory.length > 15) {
                promptHistory.shift(); // Csak az utolsó 15-öt tartja meg
            }
        }

        function renderHistory() {
            historyList.innerHTML = '';
            if (promptHistory.length === 0) {
                historyList.innerHTML = `<p style="text-align: center; color: #888;">Nincsenek előzmények ebben a munkamenetben.</p>`;
                return;
            }
            [...promptHistory].reverse().forEach(prompt => {
                const item = document.createElement('div');
                item.className = 'history-item';
                item.textContent = prompt;
                historyList.appendChild(item);
            });
        }
        
        historyButton.addEventListener('click', () => {
            renderHistory();
            openModal(historyModal);
        });

        closeHistoryModalBtn.addEventListener('click', () => {
            overlay.classList.add('hidden');
            historyModal.classList.add('hidden');
        });

        historyList.addEventListener('click', (e) => {
            if (e.target.classList.contains('history-item')) {
                finalPromptTextarea.value = e.target.textContent;
                updateFinalPrompt();
                overlay.classList.add('hidden');
                historyModal.classList.add('hidden');
            }
        });
        
        // A többi, főoldalhoz tartozó funkció...
    }

    setLanguage(currentLanguage);
});