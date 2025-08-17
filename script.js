document.addEventListener('DOMContentLoaded', function() {

    // === KÖZÖS RÉSZ MINDEN OLDALHOZ ===

    const translations = {
        hu: {
            navHome: "Főoldal", navLinks: "Ajánlások", navGallery: "Galéria",
            galleryTitle: "Galéria", comingSoon: "Hamarosan...",
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
        
        if (typeof populateSelects === 'function') populateSelects();
    }

    const langHu = document.getElementById('lang-hu');
    const langEn = document.getElementById('lang-en');
    if(langHu && langEn){
        langHu.addEventListener('click', (e) => { e.preventDefault(); setLanguage('hu'); });
        langEn.addEventListener('click', (e) => { e.preventDefault(); setLanguage('en'); });
    }

    const infoButton = document.getElementById('info-button');
    const infoModal = document.getElementById('info-modal');
    const overlay = document.getElementById('modal-overlay');
    const closeInfoModalBtn = document.getElementById('close-info-modal');

     if(infoButton && infoModal && overlay && closeInfoModalBtn){
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

    // === CSAK A FŐOLDALON (index.html) SZÜKSÉGES LOGIKA ===
    if (document.getElementById('random-button')) {
    
        const defaultPrompts = {
            en: {
                style: [ "Photorealistic", "Oil painting", "Pencil sketch", "Watercolor", "Impressionism by Claude Monet", "Surrealism by Salvador Dalí", "Cubism by Pablo Picasso", "Art Nouveau by Alphonse Mucha", "Pop Art by Andy Warhol", "Concept art", "Digital painting by Greg Rutkowski", "Steampunk aesthetic", "Cyberpunk neon noir", "Biomechanical art by H.R. Giger", "Fantasy art by Frank Frazetta", "Studio Ghibli anime style", "Disney animation style", "Tim Burton style", "Art Deco", "Baroque painting", "Minimalist line art", "Ukiyo-e Japanese art", "Vintage photography", "Double exposure", "Synthwave", "Solarpunk", "Gothic art", "Cosmic horror", "Abstract expressionism", "Cinematic still from a movie" ],
                subject: [ "A lone astronaut discovering an alien artifact", "A wise old dragon coiled on a mountain of gold", "A cyberpunk detective in a rain-soaked neon city", "A beautiful sorceress casting a complex spell", "A group of adventurers gathered around a campfire", "A majestic white wolf howling at a blood moon", "A secret agent in a high-speed chase", "A mythical phoenix rising from ashes", "A steampunk inventor in her workshop", "A tranquil forest spirit meditating", "A knight in shining armor facing a colossal beast", "An android questioning its own existence", "A cat wearing a tiny wizard hat", "A pirate captain on the deck of her ship", "A mermaid exploring a sunken city", "A time traveler witnessing the fall of Rome", "A sentient robot tending to a garden", "A gothic vampire in a lavish castle", "A post-apocalyptic survivor with a cybernetic dog", "A warrior queen leading her army into battle", "An ancient tree with glowing runes carved into it", "A mysterious figure in a Venetian mask", "A giant space whale carrying a city on its back", "A half-elf woman with ice-blue eyes", "A guardian golem made of stone and vines", "A child releasing a glowing lantern into the sky", "A scholar in a library of floating scrolls", "A futuristic soldier in powered armor", "A deity of the cosmos shaping galaxies", "A talking animal sidekick on an adventure" ],
                setting: [ "An enchanted forest with glowing mushrooms", "A futuristic city with flying cars and holograms", "The grand library of Alexandria, reimagined", "A forgotten temple deep in the jungle", "A space station orbiting a black hole", "An underwater kingdom of coral and light", "A floating island in a sea of clouds", "A post-apocalyptic wasteland with crumbling skyscrapers", "A Victorian-era London street shrouded in fog", "The throne room of a long-lost elven king", "A magical university resembling Hogwarts", "A bustling market in a medieval fantasy city", "A serene Japanese garden with a koi pond", "A desolate alien planet with two suns", "A colossal cave system with giant crystals", "The inside of a massive, ancient clockwork machine", "A vibrant coral reef teeming with alien sea life", "A hidden monastery high in the snowy mountains", "A surreal dreamscape where gravity is optional", "A volcanic landscape with rivers of lava", "A sun-drenched beach on a tropical island", "A dark, haunted mansion on a hill", "A Roman-style city on Mars", "A whimsical village where houses are made of candy", "An alien bazaar on a desert planet", "A derelict spaceship adrift in a nebula", "A battlefield after an epic magical war", "A tranquil meadow under a starry sky", "A dwarven city carved into the heart of a mountain", "The peak of Mount Olympus" ],
                extra: [ "Cinematic lighting", "Volumetric lighting, god rays", "Dynamic pose", "Hyperrealistic, 8K resolution", "Shallow depth of field", "Detailed line work, manga style", "Soft pastel palette, ethereal feel", "Vibrant colors, high contrast", "Monochromatic, black and white", "Trending on ArtStation", "Octane render, photorealistic", "Unreal Engine 5 screenshot", "Matte painting", "Golden hour lighting", "Moody and atmospheric", "Minimalist", "Intricate details", "Epic scale, wide-angle shot", "Close-up portrait", "Dynamic action scene", "Glitch effect, digital distortion", "Subsurface scattering", "Lush and overgrown with nature", "Elegant and ornate", "Dark and gritty", "Whimsical and charming", "Mystical and magical atmosphere", "Ominous and foreboding", "Peaceful and serene", "Retro 80s aesthetic" ]
            },
            hu: {
                style: [ "Fotórealisztikus", "Olajfestmény", "Ceruzavázlat", "Akvarell", "Impresszionizmus, Claude Monet stílusában", "Szürrealizmus, Salvador Dalí stílusában", "Kubizmus, Pablo Picasso stílusában", "Szecesszió, Alphonse Mucha stílusában", "Pop Art, Andy Warhol stílusában", "Koncepciórajz", "Digitális festmény, Greg Rutkowski stílusában", "Steampunk esztétika", "Cyberpunk neon noir", "Biomechanikus művészet, H.R. Giger stílusában", "Fantasy művészet, Frank Frazetta stílusában", "Studio Ghibli anime stílus", "Disney animációs stílus", "Tim Burton stílus", "Art Deco", "Barokk festmény", "Minimalista vonalrajz", "Ukiyo-e japán művészet", "Vintage fotográfia", "Dupla expozíció", "Synthwave", "Solarpunk", "Gótikus művészet", "Kozmikus horror", "Absztrakt expresszionizmus", "Filmszerű állókép egy moziból" ],
                subject: [ "Egy magányos űrhajós egy idegen ereklyét fedez fel", "Egy bölcs, öreg sárkány aranyhegyen tekeregve", "Egy cyberpunk detektív egy esőáztatta neon városban", "Egy gyönyörű varázslónő egy bonyolult varázslatot szór", "Egy csapat kalandor egy tábortűz körül", "Egy fenséges fehér farkas egy vérholdra üvölt", "Egy titkosügynök egy nagy sebességű autósüldözésben", "Egy mitikus főnix, ami feltámad a hamvaiból", "Egy steampunk feltaláló a műhelyében", "Egy nyugodt erdei szellem meditál", "Egy lovag fényes páncélban egy kolosszális szörnnyel szemben", "Egy android, aki megkérdőjelezi saját létezését", "Egy macska, aki apró varázslósüveget visel", "Egy kalózkapitány a hajója fedélzetén", "Egy hableány egy elsüllyedt várost fedez fel", "Egy időutazó, aki Róma bukásának tanúja", "Egy öntudattal rendelkező robot, aki egy kertet gondoz", "Egy gótikus vámpír egy pazar kastélyban", "Egy poszt-apokaliptikus túlélő egy kibernetikus kutyával", "Egy harcos királynő, aki csatába vezeti seregét", "Egy ősi fa, melynek törzsébe fénylő rúnákat véstek", "Egy rejtélyes alak velencei maszkban", "Egy óriási űrbálna, ami egy várost cipel a hátán", "Egy félelf nő jégkék szemekkel", "Egy kőből és indákból készült védelmező gólem", "Egy gyermek, aki egy fénylő lampiont enged az égbe", "Egy tudós egy lebegő tekercsekkel teli könyvtárban", "Egy futurisztikus katona motorizált páncélban", "A kozmosz istensége, aki galaxisokat formál", "Egy beszélő állat segítőtárs egy kalandban" ],
                setting: [ "Egy elvarázsolt erdő izzó gombákkal", "Egy futurisztikus város repülő autókkal és hologramokkal", "Az alexandriai nagykönyvtár, újragondolva", "Egy elfeledett templom mélyen a dzsungelben", "Egy űrállomás, ami egy fekete lyuk körül kering", "Egy vízalatti királyság korallból és fényből", "Egy lebegő sziget a felhők tengerében", "Egy poszt-apokaliptikus pusztaság omladozó felhőkarcolókkal", "Egy viktoriánus kori londoni utca ködbe burkolózva", "Egy rég elveszett tünde király trónterme", "Egy Roxfortra emlékeztető mágikus egyetem", "Egy nyüzsgő piac egy középkori fantasy városban", "Egy békés japán kert koi-tóval", "Egy kietlen idegen bolygó két nappal", "Egy kolosszális barlangrendszer óriási kristályokkal", "Egy hatalmas, ősi óramű gépezet belseje", "Egy vibráló korallzátony, ami hemzseg az idegen tengeri élettől", "Egy rejtett kolostor magasan a havas hegyekben", "Egy szürreális álomvilág, ahol a gravitáció opcionális", "Egy vulkanikus táj lávafolyamokkal", "Egy napsütötte tengerpart egy trópusi szigeten", "Egy sötét, kísértetjárta kúria egy dombon", "Egy római stílusú város a Marson", "Egy mókás falu, ahol a házak cukorkából vannak", "Egy idegen bazár egy sivatagos bolygón", "Egy elhagyatott űrhajó, ami egy ködben sodródik", "Egy csatatér egy epikus mágikus háború után", "Egy békés rét egy csillagos égbolt alatt", "Egy törp város, amit egy hegy szívébe vájtak", "Az Olümposz hegy csúcsa" ],
                extra: [ "Filmszerű megvilágítás", "Volumetrikus fény, fénysugarak", "Dinamikus póz", "Hiperrealisztikus, 8K felbontás", "Sekély mélységélesség", "Részletes vonalvezetés, manga stílus", "Lágy pasztell paletta, éteri hangulat", "Élénk színek, magas kontraszt", "Monokróm, fekete-fehér", "Népszerű az ArtStation-ön", "Octane render, fotorealisztikus", "Unreal Engine 5 képernyőkép", "Matte painting", "Arany óra megvilágítás", "Hangulatos és atmoszférikus", "Minimalista", "Bonyolult részletek", "Epikus méret, nagylátószögű felvétel", "Közeli portré", "Dinamikus akciójelenet", "Glitch effekt, digitális torzítás", "Subsurface scattering", "Dús és benőtt növényzet", "Elegáns és díszes", "Sötét és nyers", "Mókás és bájos", "Misztikus és mágikus atmoszféra", "Baljós és vészjósló", "Békés és nyugodt", "Retro 80-as évek esztétika" ]
            }
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
        const closeManageModalBtn = document.getElementById('close-manage-modal');
        const manageModalTitle = document.getElementById('manage-modal-title');
        const managePromptsList = document.getElementById('manage-prompts-list');
        const newPromptInput = document.getElementById('new-prompt-input');
        const addNewPromptBtn = document.getElementById('add-new-prompt-btn');

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

        function updateFinalPrompt() {
            const promptParts = [textareas.style.value, textareas.subject.value, textareas.setting.value, textareas.extra.value].map(part => part.trim()).filter(part => part !== "");
            finalPromptTextarea.value = promptParts.join(', ');
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
        
        renderSavedPrompts();
        updateFinalPrompt();
    }
    
    setLanguage(currentLanguage);
});