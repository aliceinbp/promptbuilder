// Magyar komment: Várjuk meg, amíg a teljes HTML dokumentum betöltődik.
document.addEventListener('DOMContentLoaded', function() {

    // Magyar komment: Itt tároljuk az összes prompt opciót kategóriánként.
    // Ez a struktúra könnyen bővíthető a jövőben.
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
            "a fierce woman with flowing blonde hair, barefoot, holding a worn sword, flanked by two wolves",
            "lonely detective in trench coat, cigarette, hat brim shadow",
            "sensual figure half-draped, introspective gaze",
            "armored barbarian hero raising a blade",
            "vampire noble with ornate chalice",
            "surreal figure with floating objects orbiting the head",
            "forest nymph crowned with branches",
            "android priest with cables and icons",
            "cyberpunk dragon descending on a neon-lit city skyscraper",
            "an ancient library filled with floating, glowing scrolls",
            "a futuristic, elegant astronaut in a gilded helmet",
            "steampunk robot walking through a field of flowers",
            "a mystical forest with glowing mushrooms and fairy dust",
            "a talking cat sipping steaming tea in front of a rain-soaked window",
            "an underwater kingdom filled with bioluminescence",
            "an ice dragon enthroned on a crystal mountain with the northern lights in the background",
            "a medieval market full of adventurers and strange creatures",
            "a holy sword floating over a volcanic lake",
            "a time traveler standing among the ruins of a lost civilization",
            "a giant, floating whale on which a small village travels in the sky",
            "a gothic castle at night with a huge blood moon in the background",
            "a wizard conjuring an illusion from a book",
            "an astronaut floating on the surface of a desolate planet, with a misty galaxy",
            "a detailed, abandoned city reclaimed by nature",
            "an armored samurai fighting under a cherry tree",
            "a village built in the clouds, connected by bridges",
            "a ghost ship sailing on dark, stormy waters",
            "a tree whose roots lead to another dimension"
        ],
        setting: [
            "a magical library with floating books and glowing runes",
            "a sun-drenched, overgrown ruin with ancient statues",
            "a bioluminescent cave filled with glowing fungi",
            "a snow-covered mountain peak with a hidden monastery",
            "an ornate, grand ballroom from a forgotten era, covered in dust",
            "a futuristic cityscape with flying vehicles and holographic advertisements",
            "a desert landscape with massive, petrified creatures",
            "a deep-sea trench with luminescent, bizarre marine life",
            "a quiet, moonlit garden with sculpted hedges",
            "an ancient temple carved into a giant tree",
            "a futuristic space station with large windows overlooking a nebula",
            "a post-apocalyptic junkyard with overgrown vegetation",
            "a vibrant, impossible jungle with floating islands",
            "a surreal clock tower with melting gears",
            "a grand, ornate throne room with shattered glass and lightbeams",
            "a misty, hidden village in a valley between mountains",
            "a glowing portal opening in a dark, empty field",
            "a vast underground cavern with giant crystals",
            "a chaotic wizard's laboratory with glowing potions and scrolls",
            "a floating celestial garden in a starry sky"
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

    // Magyar komment: DOM elemek kigyűjtése változókba a könnyebb elérésért.
    const textareas = {
        style: document.getElementById('style-text'),
        subject: document.getElementById('subject-text'),
        setting: document.getElementById('setting-text'),
        extra: document.getElementById('extra-text')
    };
    const finalPromptTextarea = document.getElementById('final-prompt');

    // Magyar komment: Ez a funkció frissíti a végső promptot a négy szövegdoboz tartalma alapján.
    function updateFinalPrompt() {
        const style = textareas.style.value.trim();
        const subject = textareas.subject.value.trim();
        const setting = textareas.setting.value.trim();
        const extra = textareas.extra.value.trim();

        // Összefűzzük a részeket, de csak azokat, amik nem üresek.
        const promptParts = [style, subject, setting, extra].filter(part => part !== "");
        finalPromptTextarea.value = promptParts.join(', ');
    }

    // Magyar komment: Ez a funkció feltölti a legördülő menüket (select) a prompts objektumból.
    function populateSelects() {
        for (const category in prompts) {
            const selectElement = document.getElementById(`${category}-select`);
            // Hozzáadunk egy alapértelmezett, kiválaszthatatlan opciót.
            const defaultOption = document.createElement('option');
            defaultOption.textContent = `Válassz egyet a(z) ${category} kategóriából...`;
            defaultOption.value = "";
            selectElement.appendChild(defaultOption);

            // Betöltjük az összes többi opciót a listából.
            prompts[category].forEach(optionText => {
                const option = document.createElement('option');
                option.value = optionText;
                option.textContent = optionText;
                selectElement.appendChild(option);
            });
        }
    }

    // Magyar komment: Eseménykezelőket adunk a "Hozzáad" gombokhoz.
    document.querySelectorAll('.add-button').forEach(button => {
        button.addEventListener('click', function() {
            const targetTextareaId = this.dataset.target; // A gomb 'data-target' attribútuma
            const targetTextarea = document.getElementById(targetTextareaId);
            const selectElement = this.previousElementSibling; // A gomb melletti select elem
            const selectedValue = selectElement.value;

            if (selectedValue) {
                // Ha a szövegdoboz már tartalmaz szöveget, vesszővel és szóközzel választjuk el.
                if (targetTextarea.value.trim() !== "") {
                    targetTextarea.value += ", " + selectedValue;
                } else {
                    targetTextarea.value = selectedValue;
                }
                // Frissítjük a végső promptot minden hozzáadás után.
                updateFinalPrompt();
            }
            
            // Visszaállítjuk a legördülő menüt az alapértelmezett opcióra.
            selectElement.selectedIndex = 0;
        });
    });

    // Magyar komment: Eseménykezelőket adunk a szövegdobozokhoz.
    // Így ha manuálisan szerkeszted a tartalmat, a végső prompt akkor is frissül.
    for (const category in textareas) {
        textareas[category].addEventListener('input', updateFinalPrompt);
    }

    // Magyar komment: Eseménykezelő a másolás gombhoz.
    document.getElementById('copy-button').addEventListener('click', function() {
        finalPromptTextarea.select(); // Kijelöli a szöveget
        document.execCommand('copy'); // Vágólapra másolja
        // Visszajelzés a felhasználónak
        this.textContent = 'Másolva!';
        setTimeout(() => {
            this.textContent = 'Prompt másolása';
        }, 1500);
    });


    // Magyar komment: Az oldal betöltődésekor lefutó funkciók.
    populateSelects();
    updateFinalPrompt(); // Lefuttatjuk egyszer az elején is.
});