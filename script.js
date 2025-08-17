document.addEventListener('DOMContentLoaded', function() {

    // Magyar komment: A felület szövegeinek fordításai
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
            translateButton: "Fordítás Angolra",
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
            translateButton: "Translate to English",
            selectDefault: "Choose an option from {category}..."
        }
    };

    // ÚJ STRUKTÚRA: A prompt opciók fordításai
    const prompts = {
        en: {
            style: [
                "Jean-Michel Basquiat + Cy Twombly, texture and expressive abstraction",
                "Albert Bierstadt + Bob Ross, majestic landscapes with lush details",
                "Hayao Miyazaki + Makoto Shinkai, vibrant, emotional anime visuals",
                "Alex Grey + visionary art, spiritual and transcendent visual metaphors",
                "Greg Rutkowski + Alphonse Mucha, fantasy illustration in art nouveau style",
                "Gustav Klimt + Egon Schiele, gold, patterns and raw human emotions",
                "Banksy + Jean-Michel Basquiat, street art with social commentary",
                "Frida Kahlo + fantasy art, surreal self-portraits with fantastical elements",
                "Rembrandt + Caravaggio, dark, dramatic portraits with masterful chiaroscuro",
                "René Magritte + M.C. Escher, thought-provoking, paradoxical reality",
                "Gregory Crewdson + Boris Vallejo, cinematic lighting, fantasy realism",
                "Boris Vallejo + Zdzisław Beksiński, hyperrealistic dark fantasy",
                "Malcolm Liepke + Phil Hale, expressive brushwork, dripping melancholy",
                "Caravaggio + Annie Leibovitz, dramatic portrait",
                "Frank Frazetta + Gustave Doré, epic fantasy illustration",
                "Salvador Dalí + Hieronymus Bosch, dreamlike surrealism",
                "H.R. Giger + Francis Bacon, biomechanical psychological horror",
                "Edward Hopper + Film Noir aesthetic, rain-soaked urban melancholy",
                "Brom + Zdzisław Beksiński, dark fantasy, ominous character design",
                "Frank Frazetta + Greg Rutkowski, classic fantasy heroes and illustrations",
                "Moebius (Jean Giraud) + Syd Mead, futuristic sci-fi characters and worlds",
                "Akira Toriyama + Yoshitaka Amano, anime-style heroes with fantasy elements",
                "Yoji Shinkawa + H.R. Giger, biomechanical, post-apocalyptic characters",
                "J.C. Leyendecker + Norman Rockwell, classic, iconic adventurers",
                "Tsutomu Nihei + sci-fi noir, dark, detailed cyberpunk and dystopian characters",
                "Kentaro Miura + fantasy art, detailed, epic and brutal characters",
                "Alphonse Mucha + Art Nouveau aesthetic, elegant, magical, art nouveau style characters",
                "Loish + whimsical art, colorful, stylized and charming fantasy characters",
                "Caspar David Friedrich + Disney concept art, oil painting, magical, moonlit forest.",
                "Syd Mead + Jean-Michel Basquiat, digital art, neon-futuristic, graffiti city.",
                "Edward Hopper + Ansel Adams, realistic depiction, rain-soaked train station.",
                "Makoto Shinkai + Hayao Miyazaki, anime style, train running through a quiet field.",
                "Albert Bierstadt + Frank Frazetta, oil painting, misty mountain lake with hidden crystals.",
                "Andrew Wyeth + J.M.W. Turner, watercolor, quiet, foggy seashore.",
                "Jack Kirby + Frank Miller, comic book style, monumental futuristic city.",
                "Moebius (Jean Giraud) + Studio Ghibli art, digital art, floating island with huge trees.",
                "Edward Weston + Michael Kenna, photorealistic, black and white, abandoned pier.",
                "Claude Monet + Vincent van Gogh, impressionist, sunrise over a field."
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
        },
        hu: {
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
                "Félelf nő, fekete hullámos haj, jégkék szemek, fekete nemesi ruha, zafír medál, középkori",
                "Ember nő, hamvasszőke haj, smaragdzöld szemek, elegáns középkori ruha",
                "Magas elf nő, fekete fonott haj, arany-sárga szemek, orgyilkos harcos, érzelemmentes, kora középkori",
                "Barna hajú ember férfi, barna szemek, városi őr, kard, véres, baljós, középkori",
            ],
            setting: [
                "egy mágikus könyvtár lebegő könyvekkel és fénylő rúnákkal",
                "egy napfényes, benőtt rom ősi szobrokkal",
                "egy biolumineszcens barlang tele izzó gombákkal",
                "egy hófedte hegycsúcs egy rejtett kolostorral",
                "egy díszes, nagy bálterem egy elfeledett korból, por borítja",
                "egy sivatagi táj hatalmas, megkövesedett lényekkel",
                "egy mélytengeri árok fénylő, bizarr tengeri élőlényekkel",
                "egy csendes, holdfényes kert formára nyírt sövényekkel",
                "egy ősi templom, amelyet egy óriási fába vájtak",
                "egy poszt-apokaliptikus roncstelep, amelyet benőtt a növényzet",
                "egy vibráló, lehetetlen dzsungel lebegő szigetekkel",
                "egy díszes, nagy trónterem összetört üveggel és fénysugarakkal",
                "egy ködös, rejtett falu egy völgyben a hegyek között",
                "egy hatalmas földalatti barlang óriási kristályokkal",
                "egy kaotikus varázsló laboratóriuma izzó bájitalokkal és tekercsekkel",
            ],
            extra: [
                "részletes vonalvezetés, manga stílus, dinamikus póz",
                "akvarell, lágy pasztell paletta, éteri hangulat",
                "pixel art, retro 8-bites esztétika, élénk tónusok",
                "vázlat, szénrajz papíron, durva vonások",
                "pointillizmus, absztrakt formák, élénk pontok",
                "geometrikus formák, absztrakt kubizmus, merész színek",
                "ólomüveg művészet, bonyolult minták, izzó fény",
                "fotorealisztikus, filmszerű portré, sekély mélységélesség",
                "low poly, stilizált rajzfilm, sima árnyékolás",
                "pop art, képregény stílus, merész vonalak és féltónusok",
                "rézkarc, kereszt-satírozás, régi vágású hangulat",
                "3D render, subsurface scattering, valósághű textúrák",
                "krétarajz, elmosódott élek, lágy fény",
                "fametszet, magas kontraszt, rusztikus hangulat",
                "glitch art, sérült kép effektus, digitális zaj"
            ]
        }
    };

    let currentLanguage = 'en';
    const textareas = { style: document.getElementById('style-text'), subject: document.getElementById('subject-text'), setting: document.getElementById('setting-text'), extra: document.getElementById('extra-text') };
    const finalPromptTextarea = document.getElementById('final-prompt');
    const copyButton = document.getElementById('copy-button');
    const translateButton = document.getElementById('translate-button');

    function updateFinalPrompt() {
        const promptParts = [textareas.style.value, textareas.subject.value, textareas.setting.value, textareas.extra.value]
            .map(part => part.trim())
            .filter(part => part !== "");
        finalPromptTextarea.value = promptParts.join(', ');
    }
    
    function setLanguage(lang) {
        currentLanguage = lang;
        document.documentElement.lang = lang;
        document.getElementById('lang-hu').classList.toggle('active', lang === 'hu');
        document.getElementById('lang-en').classList.toggle('active', lang === 'en');
        
        document.querySelectorAll('[data-key]').forEach(elem => {
            const key = elem.dataset.key;
            if (translations[lang] && translations[lang][key]) {
                const translationData = translations[lang][key];
                if (elem.placeholder !== undefined && typeof translationData === 'string') {
                     elem.placeholder = translationData;
                } else if(typeof translationData === 'string') {
                    elem.textContent = translationData;
                }
            }
        });
        // FONTOS: A legördülő menüket újra kell tölteni a fordítás miatt
        populateSelects();
    }

    // MÓDOSÍTOTT FUNKCIÓ
    function populateSelects() {
        for (const category in prompts[currentLanguage]) { // Módosítva: a prompts[currentLanguage]-en iterál
            const selectElement = document.getElementById(`${category}-select`);
            selectElement.innerHTML = '';
            
            const defaultOption = document.createElement('option');
            let defaultText = translations[currentLanguage].selectDefault.replace('{category}', category);
            defaultOption.textContent = defaultText;
            defaultOption.value = "";
            selectElement.appendChild(defaultOption);

            // Módosítva: a helyes, lefordított listát használja
            prompts[currentLanguage][category].forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText;
                option.textContent = optionText;
                selectElement.appendChild(option);
            });
        }
    }

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
        
        const originalText = this.textContent;
        this.textContent = translations[currentLanguage].copyButtonSuccess;
        setTimeout(() => {
            this.textContent = originalText;
        }, 1500);
    });

    translateButton.addEventListener('click', function() {
        const promptText = finalPromptTextarea.value;
        if (promptText.trim() === '') return;
        const encodedText = encodeURIComponent(promptText);
        const translateUrl = `https://translate.google.com/?sl=hu&tl=en&text=${encodedText}`;
        window.open(translateUrl, '_blank');
    });

    document.getElementById('lang-hu').addEventListener('click', (e) => {
        e.preventDefault();
        setLanguage('hu');
    });
    document.getElementById('lang-en').addEventListener('click', (e) => {
        e.preventDefault();
        setLanguage('en');
    });

    setLanguage(currentLanguage);
    updateFinalPrompt();
});