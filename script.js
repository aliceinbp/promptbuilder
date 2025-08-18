document.addEventListener('DOMContentLoaded', function() {

    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const translations = {
        hu: {
            navHome: "Főoldal", navGenerator: "Generátor", navLinks: "Ajánlások", navGallery: "Galéria", navArtists: "Művészek",
            siteSubtitle: "AI Képalkotó Segédlet by Aliceinbp",
            welcomeTitle: "Engedd szabadjára a kreativitásod!",
            welcomeText: "Üdv a Prompt Lab-ben! Ezt az oldalt azért hoztam létre, hogy segítsek neked és a hozzám hasonló AI művészet rajongóknak a lehető legjobb képeket alkotni. Itt minden eszközt megtalálsz, amire szükséged lehet a tökéletes prompt összeállításához.",
            welcomeButton: "Irány a Generátor!",
            featuredTitle: "Ízelítő a Galériából",
            galleryTitle: "Galéria", comingSoon: "Hamarosan...",
            galleryCatFantasy: "Fantasy Portrék", galleryCatDark: "Dark & Gothic", galleryCatWorlds: "Mágikus Világok", galleryCatShards: "Fantázia Szilánkok",
            linksTitle: "Ajánlott AI Képalkotó Oldalak",
            nightcafeDesc: "Nagyon felhasználóbarát, naponta ad ingyenes krediteket. Többféle AI modellt is használ, és erős a közösségi része.",
            leonardoDesc: "Profi felület, szintén napi ingyenes kreditekkel. Különösen jó konzisztens karakterek és saját modellek tanítására.",
            imgtoimgDesc: "Napi bejelentkezéssel ad ingyenes krediteket. Képes a meglévő képeket átalakítani promptok alapján.",
            copilotDesc: "A legújabb DALL-E 3 modellt használja, és teljesen ingyenes egy Microsoft fiókkal. Kiváló minőséget produkál.",
            playgroundDesc: "Naponta rengeteg ingyenes kép készíthető vele. Nagyon letisztult, könnyen kezelhető felület, ideális kezdőknek is.",
            visitButton: "Oldal Megnyitása",
            randomButton: "Véletlen Prompt", clearAllButton: "Mindent Töröl", saveButton: "Mentés", savedPromptsTitle: "Mentett Promptok",
            negativePromptLabel: "Negatív Prompt (amit NE tartalmazzon a kép)", negativePromptPlaceholder: "pl. elmosódott, rossz minőségű, extra ujjak...",
            infoModalTitle: "A Prompt Lab-ről",
            infoModalText1: "Szia! Ez az oldal azért készült, hogy segítsen neked lenyűgöző promptokat (utasításokat) generálni AI képalkotó programokhoz.",
            infoModalText2: "Használd a legördülő menüket, vagy írd be a saját ötleteidet. Kombináld a stílusokat, témákat és helyszíneket, mentsd el a kedvenceidet, és alkoss valami csodálatosat!",
            historyModalTitle: "Prompt Előzmények",
            artistsTitle: "Művész Adatbázis",
            artistsSubtitle: "Tisztelgés a művészek előtt",
            styleLabel: "Stílus:", subjectLabel: "Téma:", settingLabel: "Helyszín:", extraLabel: "Extrák:", addButton: "Hozzáad",
            stylePlaceholder: "Itt szerkesztheted a kiválasztott stílusokat... vagy alkosd meg a sajátod", subjectPlaceholder: "Itt szerkesztheted a kiválasztott témákat... vagy alkosd meg a sajátod",
            settingPlaceholder: "Itt szerkesztheted a kiválasztott helyszíneket... vagy alkosd meg a sajátod", extraPlaceholder: "Itt szerkesztheted a kiválasztott extrákat... vagy alkosd meg a sajátod",
            finalPromptLabel: "Végleges prompt (angolul)", finalPromptPlaceholder: "Az összeállított prompt itt fog megjelenni...",
            copyButton: "Prompt másolása", copyButtonSuccess: "Másolva!", translateButton: "Fordítás Angolra",
            chatTitle: "Vendégkönyv / Chat", selectDefault: "Válassz egyet a(z) {category} kategóriából..."
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
        
        // Ez a feltétel biztosítja, hogy a generátor specifikus funkciók
        // csak akkor frissüljenek, ha léteznek az oldalon.
        if (typeof initializeGenerator === 'function') {
            initializeGenerator();
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
    // Ezzel a feltétellel a kód nem fut hibára a többi oldalon.
    if (document.getElementById('random-button')) {
    
        const defaultPrompts = {
            en: {
                style: [ "Photorealistic", "Oil painting", "Pencil sketch", "Watercolor", "Impressionism by Claude Monet", "Surrealism by Salvador Dalí", "Cubism by Pablo Picasso", "Art Nouveau by Alphonse Mucha", "Pop Art by Andy Warhol", "Concept art", "Digital painting by Greg Rutkowski", "Steampunk aesthetic", "Cyberpunk neon noir", "Biomechanical art by H.R. Giger", "Fantasy art by Frank Frazetta", "Studio Ghibli anime style", "Disney animation style", "Tim Burton style", "Art Deco", "Baroque painting", "Minimalist line art", "Ukiyo-e Japanese art", "Vintage photography", "Double exposure", "Synthwave", "Solarpunk", "Gothic art", "Cosmic horror", "Abstract expressionism", "Cinematic still from a movie" ],
                subject: ["A majestic griffin soaring through a stormy sky", "An ancient, moss-covered golem awakening in a forest", "A time-traveling historian observing a medieval battle", "A celestial being crafting a star in a nebula", "A bio-luminescent jellyfish-like creature floating in a dark cave", "A crystal city hidden within a massive geode", "A lone wanderer in a vast, surreal desert of shifting sands", "A clockwork city powered by a captured lightning storm", "A forgotten god sleeping at the bottom of the ocean", "A knight whose armor is made of living wood and leaves", "A librarian in a library where books fly like birds", "A dream-weaver catching nightmares in a silver net", "A city built on the back of a colossal, sky-swimming turtle", "A musician playing a lute that makes plants grow", "An alchemist's laboratory filled with glowing potions and strange contraptions", "A floating market where merchants trade starlight and whispers", "A gentle giant made of clouds, watching over a mountain range", "A hidden oasis in a post-apocalyptic wasteland", "A warrior princess with a sword forged from a meteorite", "An enchanted greenhouse where flowers chime like bells", "A haunted lighthouse on a craggy, storm-battered coast", "A mechanical dragon breathing streams of neon data", "A quiet tea party held by woodland creatures in a sun-dappled clearing", "A portal to another dimension opening in a subway station", "A sentient storm cloud with eyes of lightning", "An explorer discovering the ruins of Atlantis", "A nomadic tribe traveling on giant, domesticated insects", "A garden where the statues come to life at night", "A shaman communing with the spirits of the aurora borealis", "A futuristic city under a massive dome on Mars", "A young witch learning to fly on a broomstick under a full moon", "A secret society of scholars studying forbidden magic", "A colossal world-tree whose branches hold entire ecosystems", "A ghost ship crewed by spectral sailors, sailing the cosmic seas", "A blacksmith forging a sword with captured sunlight", "A city where the buildings are carved from giant crystals", "A lonely robot companion waiting for its owner to return", "A bard singing tales of ancient heroes in a bustling tavern", "A mythical creature made of pure shadow and moonlight", "A hidden valley where dinosaurs still roam", "An ornate, magical key that can unlock any door", "A desert caravan crossing dunes of black sand at night", "A whimsical airship with sails made of woven clouds", "A thief stealing a jewel from the eye of an idol in a booby-trapped temple", "A powerful elemental spirit of fire, water, or earth", "A floating castle held aloft by giant, glowing crystals", "A serene monk meditating on a precarious mountain peak", "A cybernetically enhanced animal detective solving a crime", "A magical duel between two powerful archmages", "A secret garden hidden behind a waterfall", "A city where people have wings and live in the sky", "An ancient, sentient sword seeking a worthy wielder", "A festival of floating lanterns on a winding river", "A giant, mechanical heart powering an entire city", "A space-port bustling with alien species and exotic ships", "A druid shapeshifting into a bear or an eagle", "A hidden library containing the collective dreams of humanity", "A steampunk submarine exploring the Mariana Trench", "A knight of the zodiac, with armor themed after a constellation", "A marketplace where memories are bought and sold", "A colossal statue of a forgotten king, half-buried in the sand", "A creature that is half-plant, half-animal", "A city built in perfect harmony with nature", "A wizard's tower that pierces the clouds", "A celestial observatory made of glass and starlight", "A samurai warrior meditating in a cherry blossom grove", "A dragon's hoard filled with unimaginable treasures", "A secret agent infiltrating a villain's lavish masquerade ball", "A journey to the center of the earth", "A battle for the last city on a dying planet", "A mischievous pixie playing pranks on sleeping travelers", "An oracle foretelling the future from the stars", "A city that exists only in reflections", "A living constellation taking the form of an animal", "A magical forest where the seasons change every hour", "A pilot navigating an asteroid field in a small starfighter", "A guardian spirit protecting an ancient shrine", "A detective solving a murder in a magical society", "A hunt for a legendary, mythical beast", "A grand tournament of knights and champions", "A city built inside a giant, hollowed-out tree", "A lone survivor in a world overrun by sentient plants", "A creature made of living glass", "A sky-pirate raiding a merchant airship", "A magical academy hidden from the mundane world", "A journey through the underworld to rescue a lost soul", "A city where emotions manifest as visible auras", "A mechanical owl delivering a secret message", "A garden of crystal flowers that never wilt", "An explorer mapping the uncharted territories of the mind", "A society living on the shell of a giant sea creature", "A city where the streets are flowing rivers of lava", "A warrior who fights with a weapon made of pure energy", "A sanctuary for retired mythical creatures", "A planet where the flora and fauna are made of metal", "A grand ball held in a palace made of ice", "A scholar translating an ancient, alien text", "A city that rises from the sea only once a century", "A duel on the wings of a flying dragon"],
                setting: [ "A sprawling cyberpunk city under perpetual neon rain", "An ancient library where scrolls float and whisper forgotten knowledge", "A mossy, sun-dappled clearing in an enchanted forest", "A derelict spaceship adrift in a vibrant nebula", "A grand, gothic cathedral with stained-glass windows depicting cosmic horrors", "A bustling bazaar in a desert city, filled with alien merchants", "A hidden monastery carved into the side of a snow-capped mountain", "An underwater city of glass domes and bioluminescent coral", "The throne room of a crystal palace, refracting rainbows of light", "A post-apocalyptic city reclaimed by overgrown nature", "A floating island held aloft by a giant, ancient tree", "A steampunk workshop filled with whirring gears and half-finished automatons", "A serene zen garden on a distant, peaceful planet", "The heart of a volcano, where a mythical forge is located", "A surreal landscape where the ground is a chessboard and the sky is swirling paint", "A Victorian London alleyway, shrouded in supernatural fog", "A massive, world-spanning bridge connecting two continents", "A dwarven city built around a glowing heart of the mountain", "A druid's grove where ancient stones hum with power", "A grand masquerade ball in a baroque palace", "A quiet, abandoned carnival at dusk", "An alien jungle with bizarre, glowing flora and fauna", "A secret laboratory hidden beneath a bustling metropolis", "A desert oasis under a sky with two moons", "A battlefield littered with the remains of giant war-mechs", "The interior of a colossal, living creature", "A city built on a series of interconnected floating platforms", "A haunted forest where the trees have faces", "An observatory on the edge of a black hole", "A market that trades in dreams and memories", "A city where the architecture is based on musical notes", "A sunken temple complex in the middle of a vast swamp", "A giant's garden, where flowers are the size of trees", "A space elevator connecting the Earth to an orbiting station", "A gladiator arena on an alien world", "A quiet, snowy village during a perpetual winter", "The interior of a magical, reality-bending labyrinth", "A sanctuary in the sky for flying creatures", "A city built from the fossilized bones of a colossal, ancient beast", "A tranquil beach with sand that glows in the dark", "A secret underground network of resistance fighters", "A grand, magical academy floating in the clouds", "A world where the sky is an ocean and ships sail through the air", "The ruins of a futuristic city after a great war", "A vibrant, bustling port on a tropical island", "A dark, foreboding castle perched on a jagged cliff", "A world where gravity works differently, with floating islands and waterfalls that flow upwards", "A peaceful village of treehouses in a giant forest", "A massive, ancient dam holding back a sea of cosmic energy", "A planet entirely covered by a single, planet-wide ocean", "A mechanical forest with trees of copper and leaves of brass", "A grand, celestial courtroom where gods are judged", "A hidden cove where pirates bury their treasure", "A world where everyone lives in giant, mobile cities", "A market where endangered mythical creatures are sold", "A crystal cave that sings when the wind blows through it", "A city carved from a single, massive block of obsidian", "A research outpost in the heart of the Antarctic", "A world where the ground is a trampoline-like, bouncy surface", "A garden where flowers bloom with the light of captured stars", "A city that exists simultaneously in the past, present, and future", "The interior of a massive, living library where knowledge takes physical form", "A desert landscape filled with giant, petrified mushrooms", "A city built on the edge of a colossal, world-ending waterfall", "A secret ninja village hidden behind a waterfall", "A grand, opulent opera house on a space station", "A world where people communicate through colors instead of words", "A floating market on a river of liquid starlight", "A city where buildings are woven from living trees", "A massive, abandoned factory that once built giants", "A planet where the sky is always filled with a beautiful aurora", "A magical forest where the animals can speak", "A city that is a massive, intricate clockwork mechanism", "A grand tournament held in a floating arena in the sky", "A library that contains every book that was never written", "A world where people have a personal, symbiotic creature companion", "A city built on the back of a sleeping titan", "A secret garden that only appears under the light of a full moon", "A world where music is a form of magic", "A city built in the branches of a colossal, petrified tree", "A marketplace that travels between dimensions", "A grand, abandoned hotel from the 1920s, frozen in time", "A world where the inhabitants are made of living stone", "A city built on a series of interlocking rings orbiting a planet", "A magical spring whose water can heal any wound", "A forest where the trees are made of crystal and glass", "A hidden city of scholars and inventors, isolated from the world", "A world where dreams and reality are intertwined", "A grand, celestial ship sailing between galaxies", "A city built in the caldera of a dormant volcano", "A magical forest where the path changes every time you walk it", "A world where people can manipulate their own shadows", "A secret, underwater research facility", "A grand, ancient tree that serves as a gateway to other worlds", "A city where the buildings are constantly shifting and reconfiguring", "A planet where the seasons last for decades", "A mystical forge where legendary weapons are made", "A hidden city of dragons living in human form" ],
                extra: [ "Cinematic lighting", "Volumetric lighting, god rays", "Dynamic pose", "Hyperrealistic, 8K resolution", "Shallow depth of field", "Detailed line work, manga style", "Soft pastel palette, ethereal feel", "Vibrant colors, high contrast", "Monochromatic, black and white", "Trending on ArtStation", "Octane render, photorealistic", "Unreal Engine 5 screenshot", "Matte painting", "Golden hour lighting", "Moody and atmospheric", "Minimalist", "Intricate details", "Epic scale, wide-angle shot", "Close-up portrait", "Dynamic action scene", "Glitch effect, digital distortion", "Subsurface scattering", "Lush and overgrown with nature", "Elegant and ornate", "Dark and gritty", "Whimsical and charming", "Mystical and magical atmosphere", "Ominous and foreboding", "Peaceful and serene", "Retro 80s aesthetic" ]
            },
            hu: {
                style: [ "Fotórealisztikus", "Olajfestmény", "Ceruzavázlat", "Akvarell", "Impresszionizmus, Claude Monet stílusában", "Szürrealizmus, Salvador Dalí stílusában", "Kubizmus, Pablo Picasso stílusában", "Szecesszió, Alphonse Mucha stílusában", "Pop Art, Andy Warhol stílusában", "Koncepciórajz", "Digitális festmény, Greg Rutkowski stílusában", "Steampunk esztétika", "Cyberpunk neon noir", "Biomechanikus művészet, H.R. Giger stílusában", "Fantasy művészet, Frank Frazetta stílusában", "Studio Ghibli anime stílus", "Disney animációs stílus", "Tim Burton stílus", "Art Deco", "Barokk festmény", "Minimalista vonalrajz", "Ukiyo-e japán művészet", "Vintage fotográfia", "Dupla expozíció", "Synthwave", "Solarpunk", "Gótikus művészet", "Kozmikus horror", "Absztrakt expresszionizmus", "Filmszerű állókép egy moziból" ],
                subject: [ "Fenséges griff, amint egy viharos égen szárnyal", "Ősi, mohával benőtt gólem, amint egy erdőben ébred", "Időutazó történész, aki egy középkori csatát figyel", "Égi lény, aki egy csillagot alkot egy csillagködben", "Biolumineszcens medúzaszerű lény, amint egy sötét barlangban lebeg", "Kristályváros, ami egy hatalmas geóda belsejében rejtőzik", "Magányos vándor egy hatalmas, szürreális sivatagban", "Óraműváros, amit egy befogott villámvihar energiája működtet", "Egy elfeledett isten alszik az óceán mélyén", "Lovag, akinek páncélja élő fából és levelekből készült", "Könyvtáros egy könyvtárban, ahol a könyvek madarakként repülnek", "Álomszövő, aki egy ezüst hálóval kapja el a rémálmokat", "Város egy kolosszális, égen úszó teknős hátán", "Zenész, aki lantján játszva növényeket növeszt", "Egy alkimista laboratóriuma tele fénylő bájitalokkal és furcsa szerkezetekkel", "Lebegő piac, ahol a kereskedők csillagfénnyel és suttogásokkal kereskednek", "Gyengéd óriás felhőkből, aki egy hegylánc felett őrködik", "Rejtett oázis egy poszt-apokaliptikus pusztaságban", "Harcos hercegnő egy meteoritból kovácsolt karddal", "Elvarázsolt üvegház, ahol a virágok harangként csilingelnek", "Kísértetjárta világítótorony egy sziklás, viharvert tengerparton", "Mechanikus sárkány, ami neon adatfolyamokat lélegzik", "Csendes teadélután, amit erdei lények tartanak egy napfényes tisztáson", "Portál egy másik dimenzióba, ami egy metróállomáson nyílik", "Öntudattal rendelkező viharfelhő villámszemekkel", "Felfedező, aki Atlantisz romjait találja meg", "Nomád törzs, ami óriási, háziasított rovarokon utazik", "Kert, ahol a szobrok éjjel életre kelnek", "Sámán, aki az aurora borealis szellemeivel kommunikál", "Futurisztikus város egy hatalmas kupola alatt a Marson", "Fiatal boszorkány, aki egy seprűn tanul repülni telihold alatt", "Tudósok titkos társasága, akik tiltott mágiát tanulmányoznak", "Kolosszális világfa, melynek ágai egész ökoszisztémákat tartanak fenn", "Szellemhajó spektrális tengerészekkel, ami a kozmikus tengereken hajózik", "Kovács, aki befogott napfénnyel kovácsol kardot", "Város, ahol az épületeket óriási kristályokból faragták", "Magányos robot társ, aki várja, hogy gazdája visszatérjen", "Bárd, aki ősi hősökről énekel egy nyüzsgő kocsmában", "Tiszta árnyékból és holdfényből álló mitikus lény", "Rejtett völgy, ahol még mindig dinoszauruszok élnek", "Díszes, mágikus kulcs, ami bármely ajtót kinyit", "Sivatagi karaván, ami fekete homokdűnéken kel át éjjel", "Mókás léghajó, melynek vitorlái szőtt felhőkből vannak", "Tolvaj, aki egy bálvány szeméből lop el egy ékkövet egy csapdákkal teli templomban", "Erőteljes elemi szellem: tűz, víz vagy föld", "Lebegő kastély, amit óriási, fénylő kristályok tartanak a levegőben", "Békés szerzetes, aki egy ingatag hegycsúcson meditál", "Kibernetikusan továbbfejlesztett állatdetektív, aki egy bűntényt old meg", "Mágikus párbaj két hatalmas főmágus között", "Titkos kert egy vízesés mögött", "Város, ahol az embereknek szárnyaik vannak és az égen élnek", "Ősi, öntudattal rendelkező kard, ami méltó viselőt keres", "Lebegő lampionok fesztiválja egy kanyargó folyón", "Óriási, mechanikus szív, ami egy egész várost működtet", "Űrkikötő, ami hemzseg az idegen fajoktól és egzotikus hajóktól", "Druida, aki medvévé vagy sassá változik", "Rejtett könyvtár, ami az emberiség összes álmát tartalmazza", "Steampunk tengeralattjáró, ami a Mariana-árkot kutatja", "Zodiákus lovag, akinek páncélja egy csillagkép témájú", "Piac, ahol emlékeket vesznek és adnak el", "Egy elfeledett király kolosszális szobra, félig homokba temetve", "Félig növény, félig állat lény", "A természettel tökéletes harmóniában épült város", "Varázslótorony, ami átszúrja a felhőket", "Égi obszervatórium üvegből és csillagfényből", "Szamuráj harcos, aki egy cseresznyefa ligetben meditál", "Sárkánykincs, ami elképzelhetetlen kincsekkel van tele", "Titkosügynök, aki beépül egy gonosztevő pazar álarcosbáljába", "Utazás a Föld középpontja felé", "Csata az utolsó városért egy haldokló bolygón", "Csintalan tündér, aki alvó utazókat tréfál meg", "Jós, aki a csillagokból jósolja a jövőt", "Város, ami csak a tükröződésekben létezik", "Élő csillagkép, ami egy állat formáját veszi fel", "Mágikus erdő, ahol az évszakok óránként változnak", "Pilóta, aki egy aszteroidamezőn navigál egy kis csillaghajóval", "Őrző szellem, aki egy ősi szentélyt véd", "Detektív, aki egy gyilkosságot old meg egy mágikus társadalomban", "Vadászat egy legendás, mitikus fenevadra", "Lovagok és bajnokok nagyszabású tornája", "Város egy óriási, kivájt fa belsejében", "Magányos túlélő egy öntudattal rendelkező növények által ellepett világban", "Élő üvegből készült lény", "Égi kalóz, aki egy kereskedelmi léghajót támad meg", "Mágikus akadémia, ami el van rejtve a hétköznapi világ elől", "Utazás az alvilágon keresztül egy elveszett lélek megmentéséért", "Város, ahol az érzelmek látható auraként jelennek meg", "Mechanikus bagoly, ami egy titkos üzenetett kézbesít", "Kristályvirágok kertje, amik soha nem hervadnak el", "Felfedező, aki az elme feltérképezetlen területeit kutatja", "Társadalom, ami egy óriási tengeri lény páncélján él", "Város, ahol az utcák folyó lávafolyamok", "Harcos, aki tiszta energiából készült fegyverrel harcol", "Menedékhely a nyugdíjas mitikus lények számára", "Bolygó, ahol a növény- és állatvilág fémből van", "Nagyszabású bál egy jégből készült palotában", "Tudós, aki egy ősi, idegen szöveget fordít", "Város, ami csak évszázadonként egyszer emelkedik ki a tengerből", "Párbaj egy repülő sárkány szárnyain" ],
                setting: [ "Egy terjeszkedő cyberpunk város örökös neon eső alatt", "Egy ősi könyvtár, ahol a tekercsek lebegnek és elfeledett tudást suttognak", "Egy mohás, napfoltos tisztás egy elvarázsolt erdőben", "Egy elhagyatott űrhajó, ami egy vibráló csillagködben sodródik", "Egy nagyszabású, gótikus katedrális, melynek ólomüveg ablakai kozmikus borzalmakat ábrázolnak", "Egy nyüzsgő bazár egy sivatagi városban, tele idegen kereskedőkkel", "Egy rejtett kolostor, amit egy hófödte hegy oldalába vájtak", "Egy vízalatti város üvegkupolákkal és biolumineszcens korallokkal", "Egy kristálypalota trónterme, ami a szivárvány színeit töri meg", "Egy poszt-apokaliptikus város, amit visszahódított a burjánzó természet", "Egy lebegő sziget, amit egy óriási, ősi fa tart a levegőben", "Egy steampunk műhely tele zúgó fogaskerekekkel és félkész automatákkal", "Egy békés zen kert egy távoli, békés bolygón", "Egy vulkán szíve, ahol egy mitikus kovácsműhely található", "Egy szürreális táj, ahol a talaj egy sakktábla, az ég pedig örvénylő festék", "Egy viktoriánus kori londoni sikátor, amit természetfeletti köd borít", "Egy hatalmas, világot átívelő híd, ami két kontinenst köt össze", "Egy törp város, ami egy hegy izzó szíve köré épült", "Egy druida liget, ahol az ősi kövek energiától zümmögnek", "Egy nagyszabású álarcosbál egy barokk palotában", "Egy csendes, elhagyatott vidámpark alkonyatkor", "Egy idegen dzsungel bizarr, fénylő növény- és állatvilággal", "Egy titkos laboratórium egy nyüzsgő metropolisz alatt", "Egy sivatagi oázis két holddal az égen", "Egy csatatér, ami tele van óriási harci gépek maradványaival", "Egy kolosszális, élő lény belseje", "Egy város, ami egymáshoz kapcsolódó lebegő platformok sorozatára épült", "Egy kísértetjárta erdő, ahol a fáknak arcuk van", "Egy obszervatórium egy fekete lyuk peremén", "Egy piac, ami álmokkal és emlékekkel kereskedik", "Egy város, ahol az építészet hangjegyekre épül", "Egy elsüllyedt templomkomplexum egy hatalmas mocsár közepén", "Egy óriás kertje, ahol a virágok fák méretűek", "Egy űrlift, ami összeköti a Földet egy keringő állomással", "Egy gladiátoraréna egy idegen világon", "Egy csendes, havas falu egy örökös télben", "Egy mágikus, valóságot hajlító labirintus belseje", "Egy menedékhely az égen a repülő lények számára", "Egy város, amit egy kolosszális, ősi fenevad megkövesedett csontjaiból építettek", "Egy békés tengerpart, ahol a homok sötétben világít", "Ellenállók titkos földalatti hálózata", "Egy nagyszabású, mágikus akadémia a felhőkben lebegve", "Egy világ, ahol az ég egy óceán, és a hajók a levegőben vitorláznak", "Egy futurisztikus város romjai egy nagy háború után", "Egy vibráló, nyüzsgő kikötő egy trópusi szigeten", "Egy sötét, vészjósló kastély egy szaggatott sziklán", "Egy világ, ahol a gravitáció másképp működik, lebegő szigetekkel és felfelé folyó vízesésekkel", "Békés falucska faházakból egy óriási erdőben", "Egy hatalmas, ősi gát, ami a kozmikus energia tengerét tartja vissza", "Egy bolygó, amit teljes egészében egyetlen, bolygó méretű óceán borít", "Egy mechanikus erdő rézből készült fákkal és sárgaréz levelekkel", "Egy nagyszabású, égi bíróság, ahol isteneket ítélnek meg", "Egy rejtett öböl, ahová a kalózok a kincsüket temetik", "Egy világ, ahol mindenki óriási, mozgó városokban él", "Egy piac, ahol veszélyeztetett mitikus lényeket árulnak", "Egy kristálybarlang, ami énekel, amikor a szél átfúj rajta", "Egy város, amit egyetlen, hatalmas obszidián tömbből faragtak", "Egy kutatóállomás az Antarktisz szívében", "Egy világ, ahol a talaj egy trambulinszerű, pattogós felület", "Egy kert, ahol a virágok befogott csillagok fényében nyílnak", "Egy város, ami egyszerre létezik a múltban, a jelenben és a jövőben", "Egy hatalmas, élő könyvtár belseje, ahol a tudás fizikai formát ölt", "Egy sivatagi táj tele óriási, megkövesedett gombákkal", "Egy város, ami egy kolosszális, világvége vízesés peremére épült", "Egy titkos nindzsa falu egy vízesés mögött", "Egy nagyszabású, pazar operaház egy űrállomáson", "Egy világ, ahol az emberek szavak helyett színekkel kommunikálnak", "Egy lebegő piac egy folyékony csillagfény folyón", "Egy város, ahol az épületeket élő fákból szövik", "Egy hatalmas, elhagyatott gyár, ami egykor óriásokat épített", "Egy bolygó, ahol az eget mindig egy gyönyörű sarki fény tölti be", "Egy mágikus erdő, ahol az állatok beszélni tudnak", "Egy város, ami egy hatalmas, bonyolult óramű mechanizmus", "Egy nagyszabású torna, amit egy lebegő arénában tartanak az égen", "Egy könyvtár, ami minden soha meg nem írt könyvet tartalmaz", "Egy világ, ahol az embereknek személyes, szimbiotikus lénytársa van", "Egy város, ami egy alvó titán hátára épült", "Egy titkos kert, ami csak telihold fényénél jelenik meg", "Egy világ, ahol a zene a mágia egy formája", "Egy város, ami egy kolosszális, megkövesedett fa ágaiban épült", "Egy piac, ami dimenziók között utazik", "Egy nagyszabású, elhagyatott szálloda az 1920-as évekből, megfagyva az időben", "Egy világ, ahol a lakók élő kőből vannak", "Egy város, ami egy bolygó körül keringő, egymásba kapcsolódó gyűrűk sorozatára épült", "Egy mágikus forrás, melynek vize bármilyen sebet meggyógyít", "Egy erdő, ahol a fák kristályból és üvegből vannak", "Tudósok és feltalálók rejtett városa, elszigetelve a világtól", "Egy világ, ahol az álmok és a valóság összefonódik", "Egy nagyszabású, égi hajó, ami galaxisok között vitorlázik", "Egy város, ami egy szunnyadó vulkán kalderájában épült", "Egy mágikus erdő, ahol az ösvény minden alkalommal megváltozik, amikor végigsétálsz rajta", "Egy világ, ahol az emberek manipulálni tudják a saját árnyékukat", "Egy titkos, vízalatti kutatólétesítmény", "Egy nagyszabású, ősi fa, ami átjáróként szolgál más világokba", "Egy város, ahol az épületek folyamatosan változnak és újrarendeződnek", "Egy bolygó, ahol az évszakok évtizedekig tartanak", "Egy misztikus kovácsműhely, ahol legendás fegyvereket készítenek", "Sárkányok rejtett városa, akik emberi alakban élnek" ]
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

                selectElement.innerHTML = '';
                
                const placeholderOption = document.createElement('option');
                placeholderOption.value = '';
                placeholderOption.textContent = translations[currentLanguage].selectDefault.replace('{category}', translations[currentLanguage][category + 'Label'].replace(':', ''));
                selectElement.appendChild(placeholderOption);

                combinedPrompts[category].forEach(optionText => {
                    const option = document.createElement('option');
                    option.value = optionText;
                    option.textContent = optionText;
                    selectElement.appendChild(option);
                });

                choiceInstances[category] = new Choices(selectElement, {
                    searchPlaceholderValue: "Keress...",
                    itemSelectText: "Kiválaszt",
                    allowHTML: false,
                });
            });
        }
        
        function initializeGenerator() {
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
            
            if (selectedValue) {
                const category = Object.keys(choiceInstances).find(key => choiceInstances[key] === choice);
                const targetTextarea = textareas[category];
                targetTextarea.value += (targetTextarea.value.trim() !== "" ? ", " : "") + selectedValue;
                updateFinalPrompt();
                choice.setChoiceByValue(''); // Reset selection
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
    
    setLanguage(currentLanguage);
});