// js/challenge-page.js
document.addEventListener('DOMContentLoaded', () => {
    // Rövid várakozás, hogy a netlifyIdentity biztosan betöltsön
    setTimeout(() => {
        const user = netlifyIdentity.currentUser();
        const content = document.getElementById('challenge-content');

        if (!user && content) {
            const lang = localStorage.getItem('preferredLanguage') || 'en';
            content.innerHTML = `
                <div class="daily-feature-box" style="text-align: center;">
                    <h2 data-key="loginRequiredTitle">Regisztráció Szükséges</h2>
                    <p data-key="loginRequiredText">Ez a funkció csak bejelentkezett felhasználók számára elérhető. A regisztráció ingyenes és azonnali!</p>
                    <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
                        <button onclick="netlifyIdentity.open('login')" class="cta-button-small" data-key="loginBtn"></button>
                        <button onclick="netlifyIdentity.open('signup')" class="cta-button-small" data-key="signupBtn"></button>
                    </div>
                </div>
            `;
            // Frissítjük a szövegeket a megfelelő nyelvre
            if (window.setLanguage) {
                window.setLanguage(lang); 
            }
        }
    }, 100); // 100ms várakozás
});