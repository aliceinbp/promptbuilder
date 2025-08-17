document.addEventListener('DOMContentLoaded', function() {

    // KIBŐVÍTETT FORDÍTÁSOK
    const translations = {
        hu: {
            randomButton: "Véletlen Prompt",
            clearAllButton: "Mindent Töröl",
            saveButton: "Mentés",
            savedPromptsTitle: "Mentett Promptok",
            styleLabel: "Stílus:",
            subjectLabel: "Téma:",
            settingLabel: "Helyszín:",
            extraLabel: "Extrák:",
            addButton: "Hozzáad",
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
            randomButton: "Random Prompt",
            clearAllButton: "Clear All",
            saveButton: "Save",
            savedPromptsTitle: "Saved Prompts",
            styleLabel: "Style:",
            subjectLabel: "Subject:",
            settingLabel: "Setting:",
            extraLabel: "Extra:",
            addButton: "Add",
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

    // KIBŐVÍTETT PROMPT LISTÁK
    const prompts = {
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

    let currentLanguage = 'en';
    const textareas = { style: document.getElementById('style-text'), subject: document.getElementById('subject-text'), setting: document.getElementById('setting-text'), extra: document.getElementById('extra-text') };
    const finalPromptTextarea = document.getElementById('final-prompt');
    const copyButton = document.getElementById('copy-button');
    const translateButton = document.getElementById('translate-button');
    const randomButton = document.getElementById('random-button');
    const clearAllButton = document.getElementById('clear-all-button'); // ÚJ
    const savePromptButton = document.getElementById('save-prompt-button'); // ÚJ
    const savedPromptsList = document.getElementById('saved-prompts-list'); // ÚJ

    // --- ÚJ FUNKCIÓK ---

    function generateRandomPrompt() {
        const langPrompts = prompts[currentLanguage];
        const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
        textareas.style.value = getRandomItem(langPrompts.style);
        textareas.subject.value = getRandomItem(langPrompts.subject);
        textareas.setting.value = getRandomItem(langPrompts.setting);
        textareas.extra.value = getRandomItem(langPrompts.extra);
        updateFinalPrompt();
    }

    function clearAllTextareas() {
        for (const key in textareas) {
            textareas[key].value = '';
        }
        updateFinalPrompt();
    }

    function saveCurrentPrompt() {
        const promptToSave = finalPromptTextarea.value.trim();
        if (promptToSave === '') return; // Ne mentsen üres promptot
        let saved = getSavedPrompts();
        if (!saved.includes(promptToSave)) { // Ne mentsen duplikátumot
            saved.push(promptToSave);
            localStorage.setItem('savedPrompts', JSON.stringify(saved));
            renderSavedPrompts();
        }
    }

    function getSavedPrompts() {
        return JSON.parse(localStorage.getItem('savedPrompts')) || [];
    }
    
    function renderSavedPrompts() {
        savedPromptsList.innerHTML = '';
        const saved = getSavedPrompts();
        saved.forEach((prompt, index) => {
            const item = document.createElement('div');
            item.className = 'saved-prompt-item';
            item.innerHTML = `
                <span class="saved-prompt-text">${prompt}</span>
                <div class="saved-prompt-actions">
                    <button class="load-prompt-btn" data-index="${index}" title="Betöltés"><i class="fa-solid fa-upload"></i></button>
                    <button class="delete-prompt-btn" data-index="${index}" title="Törlés"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
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


    // --- MEGLÉVŐ FUNKCIÓK ---

    function updateFinalPrompt() {
        const promptParts = [textareas.style.value, textareas.subject.value, textareas.setting.value, textareas.extra.value].map(part => part.trim()).filter(part => part !== "");
        finalPromptTextarea.value = promptParts.join(', ');
    }
    
    function setLanguage(lang) {
        currentLanguage = lang;
        document.documentElement.lang = lang;
        document.getElementById('lang-hu').classList.toggle('active', lang === 'hu');
        document.getElementById('lang-en').classList.toggle('active', lang === 'en');
        translateButton.classList.toggle('hidden', lang !== 'hu');
        document.querySelectorAll('[data-key]').forEach(elem => {
            const key = elem.dataset.key;
            const target = elem.querySelector('span') || elem;
            if (translations[lang] && translations[lang][key]) {
                if (target.placeholder !== undefined) {
                    target.placeholder = translations[lang][key];
                } else {
                    target.textContent = translations[lang][key];
                }
            }
        });
        populateSelects();
    }

    function populateSelects() {
        for (const category in prompts[currentLanguage]) {
            const selectElement = document.getElementById(`${category}-select`);
            if (selectElement) {
                selectElement.innerHTML = '';
                const defaultOption = document.createElement('option');
                let defaultText = translations[currentLanguage].selectDefault.replace('{category}', category);
                defaultOption.textContent = defaultText;
                defaultOption.value = "";
                selectElement.appendChild(defaultOption);
                prompts[currentLanguage][category].forEach(optionText => {
                    const option = document.createElement('option');
                    option.value = optionText;
                    option.textContent = optionText;
                    selectElement.appendChild(option);
                });
            }
        }
    }
    
    // --- ESEMÉNYFIGYELŐK ---

    randomButton.addEventListener('click', generateRandomPrompt);
    clearAllButton.addEventListener('click', clearAllTextareas);
    savePromptButton.addEventListener('click', saveCurrentPrompt);
    savedPromptsList.addEventListener('click', handleSavedListClick);

    document.querySelectorAll('.clear-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const textareaToClear = document.getElementById(targetId);
            if (textareaToClear) {
                textareaToClear.value = '';
                updateFinalPrompt();
            }
        });
    });

    document.querySelectorAll('.add-button').forEach(button => {
        button.addEventListener('click', function() {
            const selectElement = this.previousElementSibling;
            const targetTextareaId = selectElement.id.replace('-select', '-text');
            const targetTextarea = document.getElementById(targetTextareaId);
            const selectedValue = selectElement.value;
            if (selectedValue) {
                targetTextarea.value += (targetTextarea.value.trim() !== "" ? ", " : "") + selectedValue;
                updateFinalPrompt();
            }
            selectElement.selectedIndex = 0;
        });
    });

    Object.values(textareas).forEach(textarea => textarea.addEventListener('input', updateFinalPrompt));

    copyButton.addEventListener('click', function() {
        finalPromptTextarea.select();
        document.execCommand('copy');
        const originalText = this.querySelector('span').textContent;
        this.querySelector('span').textContent = translations[currentLanguage].copyButtonSuccess;
        setTimeout(() => {
            this.querySelector('span').textContent = originalText;
        }, 1500);
    });



    translateButton.addEventListener('click', function() {
        const promptText = finalPromptTextarea.value;
        if (promptText.trim() === '') return;
        const encodedText = encodeURIComponent(promptText);
        const translateUrl = `https://translate.google.com/?sl=hu&tl=en&text=${encodedText}`;
        window.open(translateUrl, '_blank');
    });

    document.getElementById('lang-hu').addEventListener('click', (e) => { e.preventDefault(); setLanguage('hu'); });
    document.getElementById('lang-en').addEventListener('click', (e) => { e.preventDefault(); setLanguage('en'); });

    // --- INICIALIZÁLÁS ---
    
    setLanguage(currentLanguage);
    renderSavedPrompts(); // ÚJ: Mentett promptok betöltése az oldal indulásakor
    updateFinalPrompt();
});