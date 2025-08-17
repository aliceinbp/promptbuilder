// Globális függvények, amiket a main.js is elérhet
let currentLanguage = 'en';
let translations = {};

// Nyelvváltó inicializálása
function initializeLanguageSwitcher() {
    const langHu = document.getElementById('lang-hu');
    const langEn = document.getElementById('lang-en');
    if(langHu && langEn){
        langHu.addEventListener('click', (e) => { e.preventDefault(); setLanguage('hu'); });
        langEn.addEventListener('click', (e) => { e.preventDefault(); setLanguage('en'); });
    }
}

// Info Modal inicializálása
function initializeInfoModal() {
     const infoButton = document.getElementById('info-button');
     const infoModal = document.getElementById('info-modal');
     const overlay = document.getElementById('modal-overlay');
     const closeInfoModalBtn = document.getElementById('close-info-modal');

     if(infoButton && infoModal && overlay && closeInfoModalBtn){
        const open = () => { overlay.classList.remove('hidden'); infoModal.classList.remove('hidden'); };
        const close = () => { overlay.classList.add('hidden'); infoModal.classList.add('hidden'); };

        infoButton.addEventListener('click', open);
        closeInfoModalBtn.addEventListener('click', close);
        overlay.addEventListener('click', close);
     }
}


// A fő programkód, ami csak az index.html betöltődésekor fut le.
document.addEventListener('DOMContentLoaded', function() {
    
    // Csak akkor fusson le a kód, ha a fő prompt generátor oldalon vagyunk.
    if(document.querySelector('#prompt-builder-main')){

        translations = {
            // ... (Itt jön a teljes, nagy translations objektum, ahogy korábban volt)
        };
        
        // ... (És itt jön a többi, teljes script.js kód, a prompts objektummal és az összes funkcióval)
        
        // A legvégén pedig beállítjuk az alapértelmezett nyelvet
        setLanguage(currentLanguage);
    }
    
    // Nyelv beállítása az aloldalakon, ahol csak a fordítások kellenek.
    else {
        // ... (Itt is beállítjuk a nyelvet, de csak a UI elemekre)
    }

});