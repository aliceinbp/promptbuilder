document.addEventListener('DOMContentLoaded', function() {

    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const translations = {
        hu: {
            navHome: "Főoldal", navLinks: "Ajánlások", navGallery: "Galéria", navArtists: "Művészek",
            artistsTitle: "Művész Adatbázis",
            artistsSubtitle: "Tisztelgés a művészek előtt",
            artistDescBasquiatSingle: "Amerikai neo-expresszionista művész, akinek nyers, graffiti-szerű stílusa a szavak, szimbólumok és a figuratív ábrázolás energikus keveréke.",
            artistDescTwombly: "Amerikai festő, akinek nagyméretű, szabadon firkált, kalligrafikus munkái a klasszikus történelem és mitológia témáit dolgozzák fel elvont formában.",
            artistDescBierstadt: "Német-amerikai festő, a romantikus tájképfestészet mestere. Fenséges, idealizált amerikai tájképei drámai fény-árnyék hatásokkal és aprólékos részletességgel bírnak.",
            artistDescRoss: "Amerikai festő és televíziós személyiség, aki a 'wet-on-wet' olajfestési technikájáról és megnyugtató, természetközeli tájképeiről ismert.",
            artistDescMiyazakiSingle: "A Studio Ghibli társalapítója, az anime legendája. Munkáit a varázslatos, emberközpontú történetek, a természet tisztelete és a repülés motívuma jellemzi.",
            artistDescShinkai: "Modern anime rendező, akit a fotórealisztikus, érzelmes és fényben úszó tájképei tettek híressé. Művei gyakran a távolság és a melankólia témáit járják körül.",
            artistDescGrey: "Vizionárius művész, aki az emberi testet, a tudatot és a spiritualitást metafizikai és anatómiai pontossággal ábrázolja.",
            artistDescRutkowskiSingle: "Népszerű digitális fantasy festő, akinek stílusát az epikus, filmszerű fények, a drámai pózok és a klasszikus olajfestészetet idéző textúrák határozzák meg.",
            artistDescMucha: "Cseh festő, a szecesszió (Art Nouveau) ikonikus alakja. Munkáit a díszes, hullámzó vonalak, organikus minták és az idealizált női alakok jellemzik.",
            artistDescKlimt: "Az osztrák szecesszió mestere. Stílusát a díszes, arany hátterek, a gazdag mintázatok és az erotikus, szimbolikus női alakok jellemzik.",
            artistDescSchiele: "Osztrák expresszionista festő, akit a nyers, torzított önarcképei és aktjai tettek híressé. Munkái az emberi test és a psziché mélységeit kutatják.",
            artistDescBanksy: "Ismeretlen street art művész, akinek szatirikus és felforgató üzenetei gyakran politikai vagy társadalmi kommentárként jelennek meg a köztereken.",
            artistDescKahlo: "Mexikói festőnő, aki leginkább szürreális önarcképeiről ismert. Művei a személyes szenvedést, az identitást és a mexikói kultúrát dolgozzák fel.",
            artistDescRembrandt: "A holland aranykor egyik legnagyobb festője, a fény-árnyék (chiaroscuro) mestere. Portréi mély pszichológiai betekintést nyújtanak.",
            artistDescCaravaggio: "Olasz barokk festő, aki a drámai, kontrasztos fény-árnyék technikájával (tenebrizmus) forradalmasította a festészetet.",
            artistDescMagritte: "Belga szürrealista művész, aki hétköznapi tárgyakat ábrázolt meghökkentő, gondolatébresztő kontextusban, megkérdőjelezve a valóság és a látszat viszonyát.",
            artistDescEscher: "Holland grafikusművész, aki lehetetlen építményeiről, végtelen mintázatairól és paradox optikai illúzióiról ismert.",
            artistDescCrewdson: "Amerikai fotográfus, aki filmszerű, aprólékosan megrendezett jeleneteket készít amerikai kertvárosokról, feszültséggel és rejtélyekkel teli hangulatot teremtve.",
            artistDescVallejo: "Perui-amerikai festő, a hiperrealista fantasy művészet egyik legismertebb alakja. Képei gyakran ábrázolnak mitológiai hősöket és egzotikus tájakat.",
            artistDescBeksinski: "Lengyel festő, aki a disztópikus szürrealizmus sötét, nyomasztó és gyakran apokaliptikus vízióiról ismert.",
            artistDescLiepke: "Modern amerikai festő, akinek expresszív, sötét tónusú portréi a magányt, a vágyat és az emberi kapcsolatok törékenységét vizsgálják.",
            artistDescHale: "Amerikai festő, aki sötét, drámai és gyakran erőszakos jeleneteket ábrázol expresszív, dinamikus ecsetkezeléssel.",
            artistDescLeibovitz: "Híres amerikai portréfotós, akinek képei ikonikusak és gyakran intim, mégis gondosan megkomponált beállításokban mutatják be a hírességeket.",
            artistDescFrazetta: "A fantasy és sci-fi művészet ikonikus alakja. Dinamikus, erőteljes kompozíciói barbárokról, harcosokról és szörnyekről a műfaj alapköveivé váltak.",
            artistDescDore: "Francia grafikusművész, aki a 19. században készült, drámai és részletgazdag fametszeteiről ismert, melyekkel klasszikus irodalmi műveket illusztrált.",
            artistDescDaliSingle: "A szürrealizmus legismertebb alakja. Munkáit a bizarr, álomszerű jelenetek, az olvadó órák és a tudatalatti mélységeinek feltárása jellemzi.",
            artistDescBosch: "Kora reneszánsz festő, akinek fantasztikus, szimbolikus és gyakran groteszk festményei a bűn, az erény és a túlvilág témáit dolgozzák fel.",
            artistDescGigerSingle: "Svájci művész, a biomechanikus stílus megteremtője. Munkái az emberi test és a gépek fúzióját ábrázolják egy sötét, szürreális és nyugtalanító esztétikával.",
            artistDescBacon: "Ír születésű brit festő, aki nyers, torzított és pszichológiailag megterhelő portréiról és figuráiról ismert.",
            artistDescHopper: "Amerikai realista festő, aki a modern városi élet magányát és elidegenedését örökítette meg jellegzetes, fény-árnyékkal teli kompozícióiban.",
            artistDescBrom: "Amerikai gótikus és dark fantasy művész. Stílusa sötét, részletgazdag és gyakran groteszk, a szépséget és a horrort ötvözi.",
            artistDescMoebius: "Jean Giraud francia művész álneve, a képregény és a sci-fi látványtervezés megújítója. Stílusát a letisztult vonalak és a lenyűgöző, képzeletgazdag világok jellemzik.",
            artistDescMead: "Legendás 'vizuális futurista', aki olyan filmek világát tervezte, mint a Szárnyas fejvadász és a Tron. Munkáit a letisztult, high-tech és optimista jövőkép jellemzi.",
            artistDescAmano: "Japán művész, aki leginkább a Final Fantasy videójáték-sorozat karakterterveiről ismert. Stílusa légies, elegáns, és a hagyományos japán fametszetekből merít.",
            artistDescShinkawa: "Japán videójáték-tervező, aki a Metal Gear Solid sorozat művészeti stílusáért felelt. Munkáit a kalligrafikus, tusfestészetre emlékeztető vonalvezetés és a komor, high-tech dizájn jellemzi.",
            artistDescRockwell: "Amerikai festő és illusztrátor, aki az amerikai hétköznapok idealizált, szentimentális és részletgazdag jeleneteiről vált híressé.",
            artistDescNihei: "Japán manga művész, aki sötét, disztópikus cyberpunk világairól ismert. Stílusát a hatalmas, monumentális építészeti terek és a részletgazdag, komor látványvilág határozza meg.",
            artistDescMiura: "A 'Berserk' című dark fantasy manga megalkotója. Művészetét a rendkívüli részletesség, a brutális, epikus csatajelenetek és a mély, sötét történetmesélés jellemzi.",
            artistDescLoish: "Modern digitális művész, akinek élénk színvilágú, stilizált és bájos karakterábrázolásai rendkívül népszerűek. Munkái gyakran a nőiességet és a természetet ünneplik.",
            artistDescTurner: "Angol romantikus tájképfestő, a 'fény festője'. Munkáit a vibráló színek, a dinamikus kompozíciók és az atmoszferikus, gyakran viharos jelenetek jellemzik.",
            artistDescWyeth: "Amerikai realista festő, aki a vidéki táj és emberek csendes, gyakran melankolikus világát örökítette meg rendkívüli részletességgel és visszafogott színhasználattal.",
            artistDescMiller: "Amerikai képregényíró és -rajzoló, a modern, sötét és nyers képregény stílus egyik úttörője (Sin City, The Dark Knight Returns).",
            artistDescKirby: "A képregény 'Királya', a Marvel univerzum számos ikonikus karakterének (Fantasztikus Négyes, Thor, Hulk) társalkotója. Stílusát a kozmikus energia, a dinamizmus és a monumentális lépték jellemzi.",
            artistDescKenna: "Brit fotográfus, aki minimalista, fekete-fehér tájképeiről ismert. Hosszú expozíciós technikájával éteri, időtlen hangulatot teremt.",
            artistDescWeston: "A 20. századi fotóművészet egyik úttörője. Fekete-fehér, borotvaéles képei hétköznapi tárgyakat (paprika, kagyló) és tájképeket emelnek absztrakt, szoborszerű formákká.",
            artistDescGogh: "Holland posztimpresszionista festő, akinek érzelmekkel teli, vastag ecsetvonásai és élénk színei a modern művészet egyik legfontosabb alakjává tették.",
            artistDescWarhol: "Az amerikai pop art mozgalom központi figurája. Művei a fogyasztói társadalom és a sztárkultusz témáit dolgozzák fel, gyakran a sokszorosítás technikájával.",
            artistDescPicasso: "A 20. század egyik legmeghatározóbb művésze, a kubizmus társalapítója. Munkássága rendkívül sokszínű, a realista ábrázolástól a teljes absztrakcióig terjed.",
            artistDescAnsel: "Amerikai fotográfus és környezetvédő, aki a fekete-fehér tájképeiről híres, különösen az amerikai Nyugatról. Mestere volt a tónusok és a kontrasztok kezelésének.",
            galleryTitle: "Galéria", comingSoon: "Hamarosan...", galleryCatFantasy: "Fantasy Portrék", galleryCatDark: "Dark & Gothic", galleryCatWorlds: "Mágikus Világok", galleryCatShards: "Fantázia Szilánkok",
            linksTitle: "Ajánlott AI Képalkotó Oldalak", nightcafeDesc: "Nagyon felhasználóbarát, naponta ad ingyenes krediteket. Többféle AI modellt is használ, és erős a közösségi része.", leonardoDesc: "Profi felület, szintén napi ingyenes kreditekkel. Különösen jó konzisztens karakterek és saját modellek tanítására.", imgtoimgDesc: "Napi bejelentkezéssel ad ingyenes krediteket. Képes a meglévő képeket átalakítani promptok alapján.", copilotDesc: "A legújabb DALL-E 3 modellt használja, és teljesen ingyenes egy Microsoft fiókkal. Kiváló minőséget produkál.", playgroundDesc: "Naponta rengeteg ingyenes kép készíthető vele. Nagyon letisztult, könnyen kezelhető felület, ideális kezdőknek is.", visitButton: "Oldal Megnyitása",
            randomButton: "Véletlen Prompt", clearAllButton: "Mindent Töröl", saveButton: "Mentés", savedPromptsTitle: "Mentett Promptok",
            negativePromptLabel: "Negatív Prompt (amit NE tartalmazzon a kép)", negativePromptPlaceholder: "pl. elmosódott, rossz minőségű, extra ujjak...",
            infoModalTitle: "A Prompt Builderről", infoModalText1: "Szia! Ez az oldal azért készült, hogy segítsen neked lenyűgöző promptokat (utasításokat) generálni AI képalkotó programokhoz.", infoModalText2: "Használd a legördülő menüket, vagy írd be a saját ötleteidet. Kombináld a stílusokat, témákat és helyszíneket, mentsd el a kedvenceidet, és alkoss valami csodálatosat!",
            historyModalTitle: "Prompt Előzmények", styleLabel: "Stílus:", subjectLabel: "Téma:", settingLabel: "Helyszín:", extraLabel: "Extrák:", addButton: "Hozzáad",
            stylePlaceholder: "Itt szerkesztheted a kiválasztott stílusokat... vagy alkosd meg a sajátod", subjectPlaceholder: "Itt szerkesztheted a kiválasztott témákat... vagy alkosd meg a sajátod", settingPlaceholder: "Itt szerkesztheted a kiválasztott helyszíneket... vagy alkosd meg a sajátod", extraPlaceholder: "Itt szerkesztheted a kiválasztott extrákat... vagy alkosd meg a sajátod",
            finalPromptLabel: "Végleges prompt (angolul)", finalPromptPlaceholder: "Az összeállított prompt itt fog megjelenni...",
            copyButton: "Prompt másolása", copyButtonSuccess: "Másolva!", translateButton: "Fordítás Angolra",
            chatTitle: "Vendégkönyv / Chat", selectDefault: "Válassz egyet a(z) {category} kategóriából..."
        },
        en: {
            navHome: "Home", navLinks: "Links", navGallery: "Gallery", navArtists: "Artists",
            artistsTitle: "Artist Database",
            artistsSubtitle: "A tribute to the artists",
            artistDescBasquiatSingle: "An American neo-expressionist artist whose raw, graffiti-like style is an energetic mix of words, symbols, and figurative imagery.",
            artistDescTwombly: "An American painter whose large-scale, freely scribbled, calligraphic works explore themes of classical history and mythology in an abstract form.",
            artistDescBierstadt: "A German-American painter, master of romantic landscape painting. His majestic, idealized American landscapes feature dramatic lighting and meticulous detail.",
            artistDescRoss: "An American painter and television personality known for his 'wet-on-wet' oil painting technique and his calming, nature-centric landscapes.",
            artistDescMiyazakiSingle: "Co-founder of Studio Ghibli, a legend of anime. His works are characterized by magical, human-centric stories, a respect for nature, and the motif of flight.",
            artistDescShinkai: "A modern anime director famous for his photorealistic, emotional, and light-filled landscapes. His works often explore themes of distance and melancholy.",
            artistDescGrey: "A visionary artist who depicts the human body, consciousness, and spirituality with metaphysical and anatomical precision.",
            artistDescRutkowskiSingle: "A popular digital fantasy painter whose style is defined by epic, cinematic lighting, dramatic poses, and textures reminiscent of classical oil painting.",
            artistDescMucha: "A Czech painter, an iconic figure of Art Nouveau. His work is characterized by ornate, flowing lines, organic patterns, and idealized female figures.",
            artistDescKlimt: "Master of the Austrian Art Nouveau. His style is characterized by ornamental, golden backgrounds, rich patterns, and erotic, symbolic female figures.",
            artistDescSchiele: "An Austrian expressionist painter, famous for his raw, distorted self-portraits and nudes. His work explores the depths of the human body and psyche.",
            artistDescBanksy: "An anonymous street artist whose satirical and subversive messages often appear in public spaces as political or social commentary.",
            artistDescKahlo: "A Mexican painter best known for her surreal self-portraits. Her works explore personal suffering, identity, and Mexican culture.",
            artistDescRembrandt: "One of the greatest painters of the Dutch Golden Age, a master of chiaroscuro (light and shadow). His portraits offer deep psychological insight.",
            artistDescCaravaggio: "An Italian Baroque painter who revolutionized painting with his dramatic, high-contrast light and shadow technique (tenebrism).",
            artistDescMagritte: "A Belgian surrealist artist who depicted ordinary objects in unusual, thought-provoking contexts, questioning the relationship between reality and representation.",
            artistDescEscher: "A Dutch graphic artist known for his impossible constructions, infinite patterns, and paradoxical optical illusions.",
            artistDescCrewdson: "An American photographer who creates cinematic, meticulously staged scenes of American suburban life, filled with an atmosphere of tension and mystery.",
            artistDescVallejo: "A Peruvian-American painter, one of the most famous figures in hyperrealistic fantasy art. His paintings often depict mythological heroes and exotic landscapes.",
            artistDescBeksinski: "A Polish painter known for his dark, oppressive, and often apocalyptic visions of dystopian surrealism.",
            artistDescLiepke: "A modern American painter whose expressive, dark-toned portraits explore loneliness, desire, and the fragility of human connections.",
            artistDescHale: "An American painter who depicts dark, dramatic, and often violent scenes with expressive, dynamic brushwork.",
            artistDescLeibovitz: "A famous American portrait photographer whose images are iconic and often feature celebrities in intimate yet carefully composed settings.",
            artistDescFrazetta: "An iconic figure in fantasy and sci-fi art. His dynamic, powerful compositions of barbarians, warriors, and monsters became cornerstones of the genre.",
            artistDescDore: "A French graphic artist known for his dramatic and detailed wood engravings from the 19th century, with which he illustrated classic literary works.",
            artistDescDaliSingle: "The most famous figure of surrealism. His work is characterized by bizarre, dreamlike scenes, melting clocks, and an exploration of the subconscious depths.",
            artistDescBosch: "An early Renaissance painter whose fantastic, symbolic, and often grotesque paintings deal with themes of sin, virtue, and the afterlife.",
            artistDescGigerSingle: "A Swiss artist, creator of the biomechanical style. His works depict the fusion of the human body and machines with a dark, surreal, and unsettling aesthetic.",
            artistDescBacon: "An Irish-born British painter known for his raw, distorted, and psychologically charged portraits and figures.",
            artistDescHopper: "An American realist painter who captured the loneliness and alienation of modern urban life in his distinctive compositions filled with light and shadow.",
            artistDescBrom: "An American gothic and dark fantasy artist. His style is dark, detailed, and often grotesque, combining beauty and horror.",
            artistDescMoebius: "The pseudonym of French artist Jean Giraud, an innovator in comics and sci-fi concept design. His style is defined by clean lines and stunning, imaginative worlds.",
            artistDescMead: "A legendary 'visual futurist' who designed the worlds of films like Blade Runner and Tron. His work is characterized by a clean, high-tech, and optimistic vision of the future.",
            artistDescAmano: "A Japanese artist best known for his character designs for the Final Fantasy video game series. His style is ethereal, elegant, and draws from traditional Japanese woodblock prints.",
            artistDescShinkawa: "A Japanese video game artist, responsible for the art style of the Metal Gear Solid series. His work is known for its calligraphic, ink-wash-like linework and somber, high-tech designs.",
            artistDescRockwell: "An American painter and illustrator who became famous for his idealized, sentimental, and detailed scenes of American everyday life.",
            artistDescNihei: "A Japanese manga artist known for his dark, dystopian cyberpunk worlds. His style is defined by vast, monumental architectural spaces and a detailed, grim visual style.",
            artistDescMiura: "The creator of the dark fantasy manga 'Berserk'. His art is characterized by extraordinary detail, brutal, epic battle scenes, and deep, dark storytelling.",
            artistDescLoish: "A modern digital artist whose vibrant, stylized, and charming character illustrations are immensely popular. Her work often celebrates femininity and nature.",
            artistDescTurner: "An English Romantic landscape painter, the 'painter of light'. His work is characterized by vibrant colors, dynamic compositions, and atmospheric, often stormy scenes.",
            artistDescWyeth: "An American realist painter who captured the quiet, often melancholic world of the rural landscape and its people with extraordinary detail and a muted color palette.",
            artistDescMiller: "An American comic book writer and artist, a pioneer of the modern, dark, and gritty comic book style (Sin City, The Dark Knight Returns).",
            artistDescKirby: "The 'King' of comics, co-creator of many iconic Marvel Universe characters (Fantastic Four, Thor, Hulk). His style is defined by cosmic energy, dynamism, and a monumental scale.",
            artistDescKenna: "A British photographer known for his minimalist, black-and-white landscapes. His long-exposure technique creates an ethereal, timeless mood.",
            artistDescWeston: "A pioneer of 20th-century photography. His black-and-white, razor-sharp images elevate everyday objects (peppers, shells) and landscapes into abstract, sculptural forms.",
            artistDescGogh: "A Dutch post-impressionist painter whose emotionally charged, thick brushstrokes and vibrant colors made him one of the most important figures in modern art.",
            artistDescWarhol: "A central figure in the American pop art movement. His works explore themes of consumer society and celebrity culture, often using the technique of reproduction.",
            artistDescPicasso: "One of the most influential artists of the 20th century, co-founder of Cubism. His work is incredibly diverse, ranging from realistic depiction to complete abstraction.",
            artistDescAnsel: "An American photographer and environmentalist, famous for his black-and-white photographs of the American West. He was a master of tonal range and contrast.",
            galleryTitle: "Gallery", comingSoon: "Coming Soon...", galleryCatFantasy: "Fantasy Portraits", galleryCatDark: "Dark & Gothic", galleryCatWorlds: "Magical Worlds", galleryCatShards: "Shards of Fantasy",
            linksTitle: "Recommended AI Image Generators", nightcafeDesc: "Very user-friendly, provides daily free credits. Uses multiple AI models and has a strong community aspect.", leonardoDesc: "Professional interface, also with daily free credits. Especially good for consistent characters and training your own models.", imgtoimgDesc: "Provides free credits with daily login. Capable of transforming existing images based on prompts.", copilotDesc: "Uses the latest DALL-E 3 model and is completely free with a Microsoft account. Produces excellent quality.", playgroundDesc: "You can create a large number of free images daily. Very clean, easy-to-use interface, also ideal for beginners.", visitButton: "Visit Site",
            randomButton: "Random Prompt", clearAllButton: "Clear All", saveButton: "Save", savedPromptsTitle: "Saved Prompts",
            negativePromptLabel: "Negative Prompt (what the image should NOT contain)", negativePromptPlaceholder: "e.g. blurry, bad quality, extra fingers...",
            infoModalTitle: "About The Prompt Builder", infoModalText1: "Hi! This site was created to help you generate amazing prompts for AI image generators.", infoModalText2: "Use the dropdowns, or type in your own ideas. Combine styles, subjects, and settings, save your favorites, and create something wonderful!",
            historyModalTitle: "Prompt History", styleLabel: "Style:", subjectLabel: "Subject:", settingLabel: "Setting:", extraLabel: "Extra:", addButton: "Add",
            stylePlaceholder: "You can edit the selected styles here... or create your own", subjectPlaceholder: "You can edit the selected subjects here... or create your own", settingPlaceholder: "You can edit the selected settings here... or create your own", extraPlaceholder: "You can edit the selected extras here... or create your own",
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

    if (document.getElementById('random-button')) {
        const defaultPrompts = {
            en: {
                style: [ ...new Set([ "Photorealistic", "Oil painting", "Pencil sketch", "Watercolor", "Impressionism by Claude Monet", "Surrealism by Salvador Dalí", "Cubism by Pablo Picasso", "Art Nouveau by Alphonse Mucha", "Pop Art by Andy Warhol", "Concept art", "Digital painting by Greg Rutkowski", "Steampunk aesthetic", "Cyberpunk neon noir", "Biomechanical art by H.R. Giger", "Fantasy art by Frank Frazetta", "Studio Ghibli anime style", "Disney animation style", "Tim Burton style", "Art Deco", "Baroque painting", "Minimalist line art", "Ukiyo-e Japanese art", "Vintage photography", "Double exposure", "Synthwave", "Solarpunk", "Gothic art", "Cosmic horror", "Abstract expressionism", "Cinematic still from a movie", "Jean-Michel Basquiat + Cy Twombly, texture and expressive abstraction", "Albert Bierstadt + Bob Ross, majestic landscapes with lush details", "Hayao Miyazaki + Makoto Shinkai, vibrant, emotional anime visuals", "Alex Grey + visionary art, spiritual and transcendent visual metaphors", "Greg Rutkowski + Alphonse Mucha, fantasy illustration in art nouveau style", "Gustav Klimt + Egon Schiele, gold, patterns and raw human emotions", "Banksy + Jean-Michel Basquiat, street art with social commentary", "Frida Kahlo + fantasy art, surreal self-portraits with fantastical elements", "Rembrandt + Caravaggio, dark, dramatic portraits with masterful chiaroscuro", "René Magritte + M.C. Escher, thought-provoking, paradoxical reality", "Gregory Crewdson + Boris Vallejo, cinematic lighting, fantasy realism", "Boris Vallejo + Zdzisław Beksiński, hyperrealistic dark fantasy", "Malcolm Liepke + Phil Hale, expressive brushwork, dripping melancholy", "Caravaggio + Annie Leibovitz, dramatic portrait", "Frank Frazetta + Gustave Doré, epic fantasy illustration", "Salvador Dalí + Hieronymus Bosch, dreamlike surrealism", "H.R. Giger + Francis Bacon, biomechanical psychological horror", "Edward Hopper + Film Noir aesthetic, rain-soaked urban melancholy", "Brom + Zdzisław Beksiński, dark fantasy, ominous character design", "Frank Frazetta + Greg Rutkowski, classic fantasy heroes and illustrations", "Moebius (Jean Giraud) + Syd Mead, futuristic sci-fi characters and worlds", "Akira Toriyama + Yoshitaka Amano, anime-style heroes with fantasy elements", "Yoji Shinkawa + H.R. Giger, biomechanical, post-apocalyptic characters", "J.C. Leyendecker + Norman Rockwell, classic, iconic adventurers", "Tsutomu Nihei + sci-fi noir, dark, detailed cyberpunk and dystopian characters", "Kentaro Miura + fantasy art, detailed, epic and brutal characters", "Alphonse Mucha + Art Nouveau aesthetic, elegant, magical, art nouveau style characters", "Loish + whimsical art, colorful, stylized and charming fantasy characters", "Caspar David Friedrich + Disney concept art, oil painting, magical, moonlit forest.", "Syd Mead + Jean-Michel Basquiat, digital art, neon-futuristic, graffiti city.", "Edward Hopper + Ansel Adams, realistic depiction, rain-soaked train station.", "Makoto Shinkai + Hayao Miyazaki, anime style, train running through a quiet field.", "Albert Bierstadt + Frank Frazetta, oil painting, misty mountain lake with hidden crystals.", "Andrew Wyeth + J.M.W. Turner, watercolor, quiet, foggy seashore.", "Jack Kirby + Frank Miller, comic book style, monumental futuristic city.", "Moebius (Jean Giraud) + Studio Ghibli art, digital art, floating island with huge trees.", "Edward Weston + Michael Kenna, photorealistic, black and white, abandoned pier.", "Claude Monet + Vincent van Gogh, impressionist, sunrise over a field." ])],
                subject: [ "A lone astronaut discovering an alien artifact", "A wise old dragon coiled on a mountain of gold", "A cyberpunk detective in a rain-soaked neon city", "A beautiful sorceress casting a complex spell", "A group of adventurers gathered around a campfire", "A majestic white wolf howling at a blood moon", "A secret agent in a high-speed chase", "A mythical phoenix rising from ashes", "A steampunk inventor in her workshop", "A tranquil forest spirit meditating", "A knight in shining armor facing a colossal beast", "An android questioning its own existence", "A cat wearing a tiny wizard hat", "A pirate captain on the deck of her ship", "A mermaid exploring a sunken city", "A time traveler witnessing the fall of Rome", "A sentient robot tending to a garden", "A gothic vampire in a lavish castle", "A post-apocalyptic survivor with a cybernetic dog", "A warrior queen leading her army into battle", "An ancient tree with glowing runes carved into it", "A mysterious figure in a Venetian mask", "A giant space whale carrying a city on its back", "A half-elf woman with ice-blue eyes", "A guardian golem made of stone and vines", "A child releasing a glowing lantern into the sky", "A scholar in a library of floating scrolls", "A futuristic soldier in powered armor", "A deity of the cosmos shaping galaxies", "A talking animal sidekick on an adventure" ],
                setting: [ "An enchanted forest with glowing mushrooms", "A futuristic city with flying cars and holograms", "The grand library of Alexandria, reimagined", "A forgotten temple deep in the jungle", "A space station orbiting a black hole", "An underwater kingdom of coral and light", "A floating island in a sea of clouds", "A post-apocalyptic wasteland with crumbling skyscrapers", "A Victorian-era London street shrouded in fog", "The throne room of a long-lost elven king", "A magical university resembling Hogwarts", "A bustling market in a medieval fantasy city", "A serene Japanese garden with a koi pond", "A desolate alien planet with two suns", "A colossal cave system with giant crystals", "The inside of a massive, ancient clockwork machine", "A vibrant coral reef teeming with alien sea life", "A hidden monastery high in the snowy mountains", "A surreal dreamscape where gravity is optional", "A volcanic landscape with rivers of lava", "A sun-drenched beach on a tropical island", "A dark, haunted mansion on a hill", "A Roman-style city on Mars", "A whimsical village where houses are made of candy", "An alien bazaar on a desert planet", "A derelict spaceship adrift in a nebula", "A battlefield after an epic magical war", "A tranquil meadow under a starry sky", "A dwarven city carved into the heart of a mountain", "The peak of Mount Olympus" ],
                extra: [ "Cinematic lighting", "Volumetric lighting, god rays", "Dynamic pose", "Hyperrealistic, 8K resolution", "Shallow depth of field", "Detailed line work, manga style", "Soft pastel palette, ethereal feel", "Vibrant colors, high contrast", "Monochromatic, black and white", "Trending on ArtStation", "Octane render, photorealistic", "Unreal Engine 5 screenshot", "Matte painting", "Golden hour lighting", "Moody and atmospheric", "Minimalist", "Intricate details", "Epic scale, wide-angle shot", "Close-up portrait", "Dynamic action scene", "Glitch effect, digital distortion", "Subsurface scattering", "Lush and overgrown with nature", "Elegant and ornate", "Dark and gritty", "Whimsical and charming", "Mystical and magical atmosphere", "Ominous and foreboding", "Peaceful and serene", "Retro 80s aesthetic" ]
            },
            hu: {
                style: [ ...new Set([ "Fotórealisztikus", "Olajfestmény", "Ceruzavázlat", "Akvarell", "Impresszionizmus, Claude Monet stílusában", "Szürrealizmus, Salvador Dalí stílusában", "Kubizmus, Pablo Picasso stílusában", "Szecesszió, Alphonse Mucha stílusában", "Pop Art, Andy Warhol stílusában", "Koncepciórajz", "Digitális festmény, Greg Rutkowski stílusában", "Steampunk esztétika", "Cyberpunk neon noir", "Biomechanikus művészet, H.R. Giger stílusában", "Fantasy művészet, Frank Frazetta stílusában", "Studio Ghibli anime stílus", "Disney animációs stílus", "Tim Burton stílus", "Art Deco", "Barokk festmény", "Minimalista vonalrajz", "Ukiyo-e japán művészet", "Vintage fotográfia", "Dupla expozíció", "Synthwave", "Solarpunk", "Gótikus művészet", "Kozmikus horror", "Absztrakt expresszionizmus", "Filmszerű állókép egy moziból", "Jean-Michel Basquiat + Cy Twombly, textúra és expresszív absztrakció", "Albert Bierstadt + Bob Ross, fenséges tájképek, buja részletekkel", "Hayao Miyazaki + Makoto Shinkai, vibráló, érzelmes anime látványvilág", "Alex Grey + visionary art, spirituális és transzcendens vizuális metaforák", "Greg Rutkowski + Alphonse Mucha, fantasy illusztráció, szecessziós stílusban", "Gustav Klimt + Egon Schiele, arany, minták és nyers emberi érzelmek", "Banksy + Jean-Michel Basquiat, street art, társadalmi kommentárral", "Frida Kahlo + fantasy art, szürreális önarcképek, fantasztikus elemekkel", "Rembrandt + Caravaggio, sötét, drámai portrék mesteri fény-árnyékkal", "René Magritte + M.C. Escher, gondolatébresztő, paradox valóság", "Gregory Crewdson + Boris Vallejo, mozihatású világítás, fantasy realizmus", "Boris Vallejo + Zdzisław Beksiński, hiperrealista sötét fantasy", "Malcolm Liepke + Phil Hale, expresszív ecsetkezelés, lefolyó melankólia", "Caravaggio + Annie Leibovitz, drámai portré", "Frank Frazetta + Gustave Doré, epikus fantasy illusztráció", "Salvador Dalí + Hieronymus Bosch, álomszerű szürrealizmus", "H.R. Giger + Francis Bacon, biomechanikus pszichológiai horror", "Edward Hopper + Film Noir esztétika, esőáztatta városi melankólia", "Brom + Zdzisław Beksiński, sötét fantasy, baljós karakterábrázolás", "Frank Frazetta + Greg Rutkowski, klasszikus fantasy hősök és illusztrációk", "Moebius (Jean Giraud) + Syd Mead, futurisztikus sci-fi karakterek és világok", "Akira Toriyama + Yoshitaka Amano, anime-stílusú hősök, fantáziaelemekkel", "Yoji Shinkawa + H.R. Giger, biomechanikus, poszt-apokaliptikus karakterek", "J.C. Leyendecker + Norman Rockwell, klasszikus, ikonikus kalandorok", "Tsutomu Nihei + sci-fi noir, sötét, részletgazdag cyberpunk és disztópikus karakterek", "Kentaro Miura + fantasy art, részletgazdag, epikus és brutális karakterek", "Alphonse Mucha + Art Nouveau aesthetic, elegáns, mágikus, art nouveau stílusú karakterek", "Loish + whimsical art, színes, stilizált és bájos fantasy karakterek", "Caspar David Friedrich + Disney concept art, olajfestmény, varázslatos, holdfényes erdő.", "Syd Mead + Jean-Michel Basquiat, digitális művészet, neon-futurisztikus, graffitis város.", "Edward Hopper + Ansel Adams, valósághű ábrázolás, eső áztatta vasútállomás.", "Makoto Shinkai + Hayao Miyazaki, anime stílusú, csendes mezőn futó vonat.", "Albert Bierstadt + Frank Frazetta, olajfestmény, ködös hegyi tó rejtett kristályokkal.", "Andrew Wyeth + J.M.W. Turner, akvarell, csendes, ködös tengerpart.", "Jack Kirby + Frank Miller, képregény stílusú, monumentális futurisztikus város.", "Moebius (Jean Giraud) + Studio Ghibli art, digitális művészet, lebegő sziget hatalmas fákkal.", "Edward Weston + Michael Kenna, fotórealista, fekete-fehér, elhagyatott móló.", "Claude Monet + Vincent van Gogh, impresszionista, napfelkelte a mező felett." ])],
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