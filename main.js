document.addEventListener('DOMContentLoaded', function () {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    // Fejléc betöltése
    if (headerPlaceholder) {
        fetch('partials/header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
                // Az aktív menüpont és a gombok eseménykezelőinek beállítása
                // a fejléc betöltése UTÁN történik meg.
                setupHeaderInteractivity();
            });
    }

    // Lábléc betöltése
    if (footerPlaceholder) {
        fetch('partials/footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            });
    }

    // Aktív menüpont kiemelése
    function setActiveNav() {
        const navLinks = document.querySelectorAll('#main-nav a');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
    }
    
    // Ez a funkció lefuttatja a fejléc eseménykezelőit,
    // de csak azután, hogy a fejléc betöltődött.
    function setupHeaderInteractivity() {
        setActiveNav();

        // A nyelvváltó és az info gomb logikája itt is szükséges,
        // ezért a fő script.js fájlból átvesszük a vezérlést.
        if (typeof initializeLanguageSwitcher === "function") {
            initializeLanguageSwitcher();
        }
         if (typeof initializeInfoModal === "function") {
            initializeInfoModal();
        }
    }
});