// Magyar komment: Várjuk meg, amíg a teljes HTML dokumentum betöltődik.
document.addEventListener('DOMContentLoaded', function() {

    // Magyar komment: Fordítások tárolása. Könnyen bővíthető.
    const translations = {
        hu: {
            styleLabel: "Stílus:",
            subjectLabel: "Téma:",
            settingLabel: "Helyszín:",
            extraLabel: "Extrák:",
            addButton: "Hozzáad",
            stylePlaceholder: "Itt szerkesztheted a kiválasztott stílusokat...",
            subjectPlaceholder: "Itt szerkesztheted a kiválasztott témákat...",
            settingPlaceholder: "Itt szerkesztheted a kiválasztott helyszíneket...",
            extraPlaceholder: "Itt szerkesztheted a kiválasztott extrákat...",
            finalPromptLabel: "Végleges prompt (angolul)",
            finalPromptPlaceholder: "Az összeállított prompt itt fog megjelenni...",
            copyButton: "Prompt másolása",
            copyButtonSuccess: "Másolva!",
            selectDefault: "Válassz egyet a(z) {category} kategóriából..."
        },
        en: {
            styleLabel: "Style:",
            subjectLabel: "Subject:",
            settingLabel: "Setting:",
            extraLabel: "Extra:",
            addButton: "Add",
            stylePlaceholder: "You can edit the selected styles here...",
            subjectPlaceholder: "You can edit the selected subjects here...",
            settingPlaceholder: "You can edit the selected settings here...",
            extraPlaceholder: "You can edit the selected extras here...",
            finalPromptLabel: "Final prompt (English)",
            finalPromptPlaceholder: "The combined prompt will appear here...",
            copyButton: "Copy Prompt",
            copyButtonSuccess: "Copied!",
            selectDefault: "Choose an option from {category}..."
        }
    };

    // Magyar komment: Itt tároljuk az összes prompt opciót kategóriánként.
    // EZ A RÉSZ FRISSÜLT A TE LISTÁDDAL
    const prompts = {
        style: [
            "Jean-Michel Basquiat + Cy Twombly, textúra és expresszív absztrakció",
            "Albert Bierstadt + Bob Ross, fenséges tájképek, buja részletekkel",
            "Hayao Miyazaki + Makoto Shinkai, vibráló, érzelmes anime látványvilág",
            "Alex Grey + visionary art, spirituális és transzcendens vizuális metaforák",
            "Greg Rutkowski + Alphonse Mucha, fantasy illusztráció, szecessziós stílusban",
            "Gustav Klimt + Egon Schiele, arany, minták és nyers emberi érzelmek",
            "Banksy + Jean-Michel Basquiat, street art, társadalmi kommentárral",
            "Frida Kahlo + fantasy art, szürreális önarcképek, fantasztikus elemekkel",
            "Rembrandt + Caravaggio, sötét, drámai portrék mesteri fény-árnyékkal",
            "René Magritte + M.C. Escher, gondolatébresztő, paradox valóság",
            "Gregory Crewdson + Boris Vallejo, mozihatású világítás, fantasy realizmus",
            "Boris Vallejo + Zdzisław Beksiński, hiperrealista sötét fantasy",
            "Malcolm Liepke + Phil Hale, expresszív ecsetkezelés, lefolyó melankólia",
            "Caravaggio + Annie Leibovitz, drámai portré",
            "Frank Frazetta + Gustave Doré, epikus fantasy illusztráció",
            "Salvador Dalí + Hieronymus Bosch, álomszerű szürrealizmus",
            "H.R. Giger + Francis Bacon, biomechanikus pszichológiai horror",
            "Edward Hopper + Film Noir esztétika, esőáztatta városi melankólia",
            "Brom + Zdzisław Beksiński, sötét fantasy, baljós karakterábrázolás",
            "Frank Frazetta + Greg Rutkowski, klasszikus fantasy hősök és illusztrációk",
            "Moebius (Jean Giraud) + Syd Mead, futurisztikus sci-fi karakterek és világok",
            "Akira Toriyama + Yoshitaka Amano, anime-stílusú hősök, fantáziaelemekkel",
            "Yoji Shinkawa + H.R. Giger, biomechanikus, poszt-apokaliptikus karakterek",
            "J.C. Leyendecker + Norman Rockwell, klasszikus, ikonikus kalandorok",
            "Tsutomu Nihei + sci-fi noir, sötét, részletgazdag cyberpunk és disztópikus karakterek",
            "Kentaro Miura + fantasy art, részletgazdag, epikus és brutális karakterek",
            "Alphonse Mucha + Art Nouveau aesthetic, elegáns, mágikus, art nouveau stílusú karakterek",
            "Loish + whimsical art, színes, stilizált és bájos fantasy karakterek",
            "Caspar David Friedrich + Disney concept art, olajfestmény, varázslatos, holdfényes erdő.",
            "Syd Mead + Jean-Michel Basquiat, digitális művészet, neon-futurisztikus, graffitis város.",
            "Edward Hopper + Ansel Adams, valósághű ábrázolás, eső áztatta vasútállomás.",
            "Makoto Shinkai + Hayao Miyazaki, anime stílusú, csendes mezőn futó vonat.",
            "Albert Bierstadt + Frank Frazetta, olajfestmény, ködös hegyi tó rejtett kristályokkal.",
            "Andrew Wyeth + J.M.W. Turner, akvarell, csendes, ködös tengerpart.",
            "Jack Kirby + Frank Miller, képregény stílusú, monumentális futurisztikus város.",
            "Moebius (Jean Giraud) + Studio Ghibli art, digitális művészet, lebegő sziget hatalmas fákkal.",
            "Edward Weston + Michael Kenna, fotórealista, fekete-fehér, elhagyatott móló.",
            "Claude Monet + Vincent van Gogh, impresszionista, napfelkelte a mező felett."
        ],
        subject: [
            "Half-elf woman, black wavy hair, ice-blue eyes, black noble dress, sapphire pendant, medieval",
            "Human woman, ash-blonde hair, emerald eyes, elegant medieval dress",
            "Tall elf woman, black braided hair, yellow-gold eyes, assassin warrior, expressionless, early medieval",
            "Brown-haired human man, brown eyes, city guard, sword, bloodied, ominous, medieval",
        ],
        setting: [
            "a magical library with floating books and glowing runes",
            "a sun-drenched, overgrown ruin with ancient statues",
            "a bioluminescent cave filled with glowing fungi",
            "a snow-covered mountain peak with a hidden monastery",
            "an ornate, grand ballroom from a forgotten era, covered in dust",
            "a desert landscape with massive, petrified creatures",
            "a deep-sea trench with luminescent, bizarre marine life",
            "a quiet, moonlit garden with sculpted hedges",
            "an ancient temple carved into a giant tree",
            "a post-apocalyptic junkyard with overgrown vegetation",
            "a vibrant, impossible jungle with floating islands",
            "a grand, ornate throne room with shattered glass and lightbeams",
            "a misty, hidden village in a valley between mountains",
            "a vast underground cavern with giant crystals",
            "a chaotic wizard's laboratory with glowing potions and scrolls",
        ],
        extra: [
            "detailed line work, manga style, dynamic pose",
            "watercolor art, soft pastel palette, ethereal feel",
            "pixel art, retro 8-bit aesthetic, vibrant tones",
            "sketch art, charcoal on paper, rough strokes",
            "pointillism, abstract forms, vivid dots",
            "geometric shapes, abstract cubism, bold colors",
            "stained glass art, intricate patterns, glowing light",
            "photorealistic, cinematic portrait, shallow depth of field",
            "low poly, stylized cartoon, smooth shading",
            "pop art, comic book style, bold lines and half-tones",
            "etching art, cross-hatching, old-world feel",
            "3D render, subsurface scattering, realistic textures",
            "chalk drawing, smudged edges, soft light",
            "woodcut art, high contrast, rustic feel",
            "glitch art, corrupted image effect, digital noise"
        ]
    };

    let currentLanguage = 'en'; // Alapértelmezett nyelv

    // Magyar komment: DOM elemek kigyűjtése változókba.
    const textareas = {
        style: document.getElementById('style-text'),
        subject: document.getElementById('subject-text'),
        setting: document.getElementById('setting-text'),
        extra: document.getElementById('extra-text')
    };
    const finalPromptTextarea = document.getElementById('final-prompt');
    const copyButton = document.getElementById('copy-button');

    // Magyar komment: Frissíti a végső promptot.
    function updateFinalPrompt() {
        const promptParts = [textareas.style.value, textareas.subject.value, textareas.setting.value, textareas.extra.value]
            .map(part => part.trim())
            .filter(part => part !== "");
        finalPromptTextarea.value = promptParts.join(', ');
    }
    
    // Magyar komment: Lefordítja az oldalt a kiválasztott nyelvre.
    function setLanguage(lang) {
        currentLanguage = lang;
        document.documentElement.lang = lang; // HTML lang attribútum frissítése

        // Aktív gomb stílusának beállítása
        document.getElementById('lang-hu').classList.toggle('active', lang === 'hu');
        document.getElementById('lang-en').classList.toggle('active', lang === 'en');
        
        document.querySelectorAll('[data-key]').forEach(elem => {
            const key = elem.dataset.key;
            if (translations[lang] && translations[lang][key]) {
                if (elem.placeholder !== undefined) {
                    elem.placeholder = translations[lang][key];
                } else {
                    elem.textContent = translations[lang][key];
                }
            }
        });
        // A legördülő menüket újra kell tölteni a fordítás miatt
        populateSelects();
    }

    // Magyar komment: Feltölti a legördülő menüket a megfelelő nyelvű szöveggel.
    function populateSelects() {
        for (const category in prompts) {
            const selectElement = document.getElementById(`${category}-select`);
            selectElement.innerHTML = ''; // Kiürítjük a menüt
            
            const defaultOption = document.createElement('option');
            const defaultText = translations[currentLanguage].selectDefault.replace('{category}', category);
            defaultOption.textContent = defaultText;
            defaultOption.value = "";
            selectElement.appendChild(defaultOption);

            prompts[category].forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText;
                option.textContent = optionText;
                selectElement.appendChild(option);
            });
        }
    }

    // Magyar komment: Eseménykezelők a "Hozzáad" gombokhoz.
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

    // Magyar komment: Eseménykezelők a szövegdobozokhoz.
    Object.values(textareas).forEach(textarea => textarea.addEventListener('input', updateFinalPrompt));

    // Magyar komment: Eseménykezelő a másolás gombhoz.
    copyButton.addEventListener('click', function() {
        finalPromptTextarea.select();
        document.execCommand('copy');
        
        const originalText = this.textContent;
        this.textContent = translations[currentLanguage].copyButtonSuccess;
        setTimeout(() => {
            this.textContent = originalText;
        }, 1500);
    });

    // Magyar komment: Eseménykezelők a nyelvválasztó gombokhoz.
    document.getElementById('lang-hu').addEventListener('click', (e) => {
        e.preventDefault();
        setLanguage('hu');
    });
    document.getElementById('lang-en').addEventListener('click', (e) => {
        e.preventDefault();
        setLanguage('en');
    });

    // Magyar komment: Oldal betöltésekor lefutó funkciók.
    setLanguage(currentLanguage); // Beállítjuk az alapértelmezett nyelvet
    updateFinalPrompt();
});