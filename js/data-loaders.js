document.addEventListener('DOMContentLoaded', function() {
    // Itt kezdődik az összes load...() funkció
  
    // ===== Alkimista Műhely - Adatbetöltő Szkript (data-loaders.js) =====
// Ez a fájl felelős minden külső adat (művészek, galéria, blog, stb.) betöltéséért és megjelenítéséért.

function initializeArtistCopyButtons() {
    document.querySelectorAll('.copy-artist-btn').forEach(button => {
        if (button.dataset.listenerAttached) return;
        button.dataset.listenerAttached = 'true';
        button.addEventListener('click', () => {
            const artistName = button.dataset.artist;
            navigator.clipboard.writeText(artistName).then(() => {
                button.innerHTML = '<i class="fa-solid fa-check"></i>';
                button.classList.add('copied');
                setTimeout(() => {
                    button.innerHTML = '<i class="fa-solid fa-copy"></i>';
                    button.classList.remove('copied');
                }, 1500);
            });
        });
    });
}

async function loadArtists() {
    const container = document.querySelector('.artist-grid');
    if (!container) return;
    const staticSchema = document.querySelector('script[type="application/ld+json"]');
    if (staticSchema) {
        staticSchema.remove();
    }
    try {
        const response = await fetch('/_data/artists.json');
        const artists = await response.json();
        const schema = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Művész Adatbázis a Tökéletes Stílusért - Alkimista Műhely",
            "description": "Böngészhető adatbázis híres művészekről, akiknek stílusa inspirációt nyújt az AI képalkotáshoz. Fedezz fel új stílusokat a prompjaidhoz!",
            "mainEntity": {
                "@type": "ItemList",
                "itemListElement": []
            }
        };
        artists.forEach((artist, index) => {
            schema.mainEntity.itemListElement.push({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Person",
                    "name": artist.name
                }
            });
        });
        const schemaScript = document.createElement('script');
        schemaScript.type = 'application/ld+json';
        schemaScript.textContent = JSON.stringify(schema);
        document.head.appendChild(schemaScript);
        container.innerHTML = '';
        artists.forEach(artist => {
            const card = document.createElement('div');
            card.className = `artist-card`;
            if(artist.category) card.dataset.category = artist.category; 
            const copyName = artist.copyName || artist.name;
            card.innerHTML = `
                <div class="artist-card-header">
                    <h3>${artist.name}</h3>
                    <button class="copy-artist-btn" data-artist="${copyName}" data-key-title="copyTooltip">
                        <i class="fa-solid fa-copy"></i>
                    </button>
                </div>
                <p data-key="${artist.dataKey}"></p>
            `;
            container.appendChild(card);
        });
        const filterButtons = document.querySelectorAll('.filter-btn');
        const artistCards = document.querySelectorAll('.artist-card');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const selectedCategory = button.dataset.category;
                artistCards.forEach(card => {
                    if (selectedCategory === 'all' || card.dataset.category === selectedCategory) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
        initializeArtistCopyButtons();
        window.setLanguage(localStorage.getItem('preferredLanguage') || 'en');
    } catch (error) {
        console.error('Hiba a művészek betöltésekor:', error);
        container.innerHTML = '<p>A művészek listája jelenleg nem érhető el.</p>';
    }
}
 
async function loadGallery() {
    const container = document.getElementById('gallery-section');
    if (!container) return;
    try {
        const response = await fetch('/_data/gallery.json');
        const galleryData = await response.json();
        container.innerHTML = '';
        const categoryMap = { fantasy: 'galleryCatFantasy', dark: 'galleryCatDark', worlds: 'galleryCatWorlds', shards: 'galleryCatShards' };
        for (const categoryKey in galleryData) {
            const images = galleryData[categoryKey];
            const titleKey = categoryMap[categoryKey];
            const title = document.createElement('h2');
            title.className = 'gallery-category-title';
            title.innerHTML = `<span data-key="${titleKey}"></span>`;
            container.appendChild(title);
            const grid = document.createElement('div');
            grid.className = 'gallery-grid';
            images.forEach(image => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                const promptText = image.prompt || '';
                item.innerHTML = `
                    <a href="src/gallery-images/${image.src}" target="_blank">
                        <img src="src/gallery-images/${image.src}" alt="${image.alt}" loading="lazy">
                        <div class="gallery-prompt-overlay">
                            <p>${promptText}</p>
                            <button class="cta-button-small use-prompt-btn" data-prompt="${promptText}" data-key="usePromptBtn"></button>
                        </div>
                    </a>`;
                grid.appendChild(item);
            });
            container.appendChild(grid);
        }
        window.setLanguage(localStorage.getItem('preferredLanguage') || 'en');
    } catch (error) {
        console.error('Hiba a galéria betöltésekor:', error);
        container.innerHTML = '<p>A galéria jelenleg nem érhető el.</p>';
    }
}

async function loadDailyPrompt() {
    const container = document.getElementById('daily-prompt-section');
    if (!container) return;
    const promptTextElement = document.getElementById('daily-prompt-text');
    const copyBtn = document.getElementById('copy-daily-prompt-btn');
    try {
        const response = await fetch('/_data/daily_prompts.json');
        const prompts = await response.json();
        if (prompts.length === 0) {
            promptTextElement.textContent = "Nincsenek elérhető promptok.";
            return;
        }
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 0);
        const diff = now - startOfYear;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        const promptIndex = (dayOfYear - 1) % prompts.length;
        const selectedPrompt = prompts[promptIndex];
        promptTextElement.textContent = selectedPrompt;
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(selectedPrompt).then(() => {
                const buttonTextSpan = copyBtn.querySelector('span');
                const originalText = buttonTextSpan.textContent;
                const icon = copyBtn.querySelector('i');
                buttonTextSpan.textContent = translations[localStorage.getItem('preferredLanguage') || 'en'].dailyPromptCopySuccess;
                icon.className = 'fa-solid fa-check';
                setTimeout(() => {
                    buttonTextSpan.textContent = originalText;
                    icon.className = 'fa-solid fa-copy';
                }, 2000);
            });
        });
    } catch (error) {
        console.error("Hiba a nap promptjának betöltésekor:", error);
        promptTextElement.textContent = "A nap promptja jelenleg nem érhető el.";
    }
}

async function loadDailyArtist() {
    const container = document.getElementById('daily-artist-section');
    if (!container) return;
    const nameElement = document.getElementById('daily-artist-name');
    const descElement = document.getElementById('daily-artist-desc');
    try {
        const response = await fetch('/_data/artists.json');
        const artists = await response.json();
        if (artists.length === 0) {
            nameElement.textContent = "Nincsenek elérhető művészek.";
            return;
        }
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 0);
        const diff = now - startOfYear;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        const artistIndex = (dayOfYear - 1) % artists.length;
        const selectedArtist = artists[artistIndex];
        
        const setArtistDescription = () => {
            const lang = localStorage.getItem('preferredLanguage') || 'en';
            nameElement.textContent = selectedArtist.name;
            if (translations[lang] && translations[lang][selectedArtist.dataKey]) {
                descElement.textContent = translations[lang][selectedArtist.dataKey];
            }
        };

        setArtistDescription();
        
        // This makes sure the text updates if the user switches language on the page
        const originalSetLanguage = window.setLanguage;
        window.setLanguage = function(lang, ...args) {
            originalSetLanguage.apply(this, [lang, ...args]);
            if (document.getElementById('daily-artist-section')) {
                 setArtistDescription();
            }
        }

    } catch (error) {
        console.error("Hiba a nap művészének betöltésekor:", error);
        nameElement.textContent = "A nap művésze jelenleg nem érhető el.";
    }
}

const markdownConverter = typeof showdown !== 'undefined' ? new showdown.Converter({ openLinksInNewWindow: true }) : null;

function parseFrontmatter(markdown) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const match = markdown.match(frontmatterRegex);
    if (!match) return { frontmatter: {}, content: markdown };
    const yamlString = match[1];
    const content = markdown.replace(frontmatterRegex, '');
    try {
        return { frontmatter: jsyaml.load(yamlString), content };
    } catch (error) {
        console.error("Hiba a YAML feldolgozása közben:", error);
        return { frontmatter: {}, content: content };
    }
}
async function loadBlogPosts() {
    const container = document.getElementById('blog-posts-container');
    if (!container || !markdownConverter) return;
    const GITHUB_API_URL = 'https://api.github.com/repos/aliceinbp/promptbuilder/contents/blog';
    try {
        const response = await fetch(GITHUB_API_URL);
        if (!response.ok) throw new Error('Nem sikerült lekérni a bejegyzéseket a GitHubról.');
        let files = await response.json();
        if (!Array.isArray(files)) {
            container.innerHTML = `<p>${translations[localStorage.getItem('preferredLanguage') || 'en'].blogError || 'Hiba a bejegyzések formátumával.'}</p>`;
            return;
        }
        const postPromises = files.filter(file => file.name && file.name.endsWith('.md')).map(async (file) => {
            const postResponse = await fetch(file.download_url);
            const markdown = await postResponse.text();
            const { frontmatter } = parseFrontmatter(markdown);
            frontmatter.slug = file.name.replace('.md', '');
            return frontmatter;
        });
        let postData = await Promise.all(postPromises);
        postData.sort((a, b) => new Date(b.date) - new Date(a.date));
        container.innerHTML = '';
        if (postData.length === 0) {
            container.innerHTML = `<p>${translations[localStorage.getItem('preferredLanguage') || 'en'].noPostsFound}</p>`;
            return;
        }
        postData.forEach(post => {
            const lang = localStorage.getItem('preferredLanguage') || 'en';
            const title = lang === 'hu' ? post.title_hu : post.title_en;
            const bodyMarkdown = lang === 'hu' ? post.body_hu : post.body_en;
            const bodyHtml = markdownConverter.makeHtml(bodyMarkdown || '');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = bodyHtml;
            const plainText = tempDiv.textContent || tempDiv.innerText || "";
            const excerpt = plainText.substring(0, 150) + '...';
            const postDate = new Date(post.date).toLocaleDateString(lang === 'hu' ? 'hu-HU' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const card = document.createElement('div');
            card.className = 'blog-card';
            card.innerHTML = `<a href="post.html?slug=${post.slug}"><img src="${post.image}" alt="${title}" class="blog-card-image"></a><div class="blog-card-content"><h3><a href="post.html?slug=${post.slug}" style="text-decoration:none; color: inherit;">${title}</a></h3><p class="blog-card-meta">${translations[lang].postedOn} ${postDate}</p><p class="blog-card-excerpt">${excerpt}</p><a href="post.html?slug=${post.slug}" class="blog-card-read-more">${translations[lang].readMore}</a></div>`;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Hiba a blogbejegyzések betöltésekor:', error);
        container.innerHTML = `<p>${translations[localStorage.getItem('preferredLanguage') || 'en'].blogError || 'Hiba a bejegyzések betöltése közben.'}</p>`;
    }
}

async function loadSinglePost() {
    const container = document.getElementById('post-content-container');
    if (!container || !markdownConverter) return;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    if (!slug) {
        container.innerHTML = 'Hiba: Nincs megadva bejegyzés azonosító.';
        return;
    }
    const POST_URL = `https://raw.githubusercontent.com/aliceinbp/promptbuilder/main/blog/${slug}.md`;
    try {
        const response = await fetch(POST_URL);
        if (!response.ok) throw new Error('A bejegyzés nem található.');
        const markdown = await response.text();
        const { frontmatter, content } = parseFrontmatter(markdown);
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        const title = lang === 'hu' ? frontmatter.title_hu : frontmatter.title_en;
        const bodyMarkdown = lang === 'hu' ? frontmatter.body_hu : frontmatter.body_en;
        const bodyHtml = markdownConverter.makeHtml(bodyMarkdown || content);
        const postDate = new Date(frontmatter.date).toLocaleDateString(lang === 'hu' ? 'hu-HU' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        document.title = `${title} - Alkimista Műhely Blog`;
        
        const likeBtnHtml = `<div class="like-button-container" style="margin-top: 40px; border-top: 1px solid var(--color-border); padding-top: 20px;"><span class="likebtn-wrapper" data-identifier="${slug}" data-lazy_load="true" data-rich_snippet="true"></span></div>`;
        container.innerHTML = `<div class="post-header"><h1>${title}</h1><p class="post-meta">${translations[lang].postedOn} ${postDate}</p></div><img src="${frontmatter.image}" alt="${title}" class="post-featured-image"><div class="post-body">${bodyHtml}</div>${likeBtnHtml}`;
        if (window.likebtn_queue) {
            window.likebtn_queue.push({ init: true });
        }
    } catch (error) {
        console.error('Hiba a bejegyzés betöltésekor:', error);
        container.innerHTML = '<p>A bejegyzés nem tölthető be.</p>';
    }
}

function displayDailyQuote() {
    const quoteContainer = document.getElementById('daily-quote-container');
    if (!quoteContainer) return;
    const quoteTextElem = document.getElementById('quote-text');
    const quoteAuthorElem = document.getElementById('quote-author');
    const closeBtn = document.getElementById('close-quote-btn');
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const quoteIndex = dayOfYear % dailyQuotes.length;
    const todayQuote = dailyQuotes[quoteIndex];
    const lastClosedDay = localStorage.getItem('quoteClosedDay');

    const setQuoteContent = () => {
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        quoteTextElem.textContent = (lang === 'hu') ? `„${todayQuote.quote_hu}”` : `“${todayQuote.quote_en}”`;
        quoteAuthorElem.textContent = `– ${todayQuote.author}`;
    };

    if (lastClosedDay == dayOfYear) {
        quoteContainer.classList.add('hidden');
        return;
    }

    quoteContainer.classList.remove('hidden');
    setQuoteContent();
    closeBtn.addEventListener('click', () => {
        quoteContainer.classList.add('closing');
        setTimeout(() => {
            quoteContainer.classList.add('hidden');
            quoteContainer.classList.remove('closing');
        }, 500);
        localStorage.setItem('quoteClosedDay', dayOfYear);
    });
}

async function loadSubmissions() {
    const container = document.getElementById('submission-gallery-grid');
    if (!container) return;
    try {
        const response = await fetch('/_data/submissions.json');
        const submissions = await response.json();
        container.innerHTML = ''; 
        if (submissions.length === 0) {
            container.innerHTML = `<p style="text-align: center; color: var(--color-text-secondary);">Még nincsenek beküldött alkotások. Légy te az első!</p>`;
            return;
        }
        submissions.forEach(image => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            const promptText = image.prompt || '';
            const authorText = image.author || 'Ismeretlen Alkotó';
            item.innerHTML = `
                <a href="${image.src}" target="_blank">
                    <img src="${image.src}" alt="${authorText} alkotása" loading="lazy">
                    <div class="gallery-prompt-overlay">
                        <span class="submission-author">${authorText}</span>
                    </div>
                </a>`;
            container.appendChild(item);
        });
         window.setLanguage(localStorage.getItem('preferredLanguage') || 'en');
    } catch (error) {
        console.error('Hiba a beküldött képek betöltésekor:', error);
        container.innerHTML = '<p>A galéria jelenleg nem érhető el.</p>';
    }
}
if (document.querySelector('.artist-grid')) loadArtists();
    if (document.getElementById('gallery-section')) loadGallery();
    if (document.getElementById('daily-prompt-section')) loadDailyPrompt();
    if (document.getElementById('daily-artist-section')) loadDailyArtist();
    if (document.getElementById('blog-posts-container')) loadBlogPosts();
    if (document.getElementById('post-content-container')) loadSinglePost();
    if (document.getElementById('daily-quote-container')) displayDailyQuote();
    if (document.getElementById('submission-gallery-grid')) loadSubmissions();
});