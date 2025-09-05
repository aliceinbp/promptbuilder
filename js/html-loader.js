// js/html-loader.js

document.addEventListener("DOMContentLoaded", function() {
    // Aszinkron függvény a HTML tartalom betöltéséhez
    const loadHTML = async (selector, filePath) => {
        const element = document.querySelector(selector);
        if (element) {
            try {
                const response = await fetch(filePath);
                if (response.ok) {
                    const text = await response.text();
                    element.innerHTML = text;
                } else {
                    element.innerHTML = `<p>Error loading content: ${response.statusText}</p>`;
                }
            } catch (error) {
                console.error(`Failed to load ${filePath}:`, error);
                element.innerHTML = "<p>Content could not be loaded.</p>";
            }
        }
    };

    // Betöltjük a fejlécet és a láblécet, majd inicializáljuk a main.js funkcióit
    // A Promise.all biztosítja, hogy minden betöltődjön, mielőtt a main.js lefutna
    Promise.all([
        loadHTML('#header-placeholder', '/_header.html'),
        loadHTML('#footer-placeholder', '/_footer.html')
    ]).then(() => {
        // Miután a header és a footer a helyén van, lefuttatjuk azokat a main.js funkciókat,
        // amelyeknek ezekre az elemekre van szükségük.
        // Ezt a részt a main.js-be helyezzük át, hogy a sorrend biztosan jó legyen.
        document.dispatchEvent(new Event('htmlLoaded'));
    });
});