// ===== Alkimista Műhely - Interaktív Oldalak Szkriptje (interactive-pages.js) =====
// Ez a fájl olyan oldalak logikáját tartalmazza, amik nem a fő generátorhoz tartoznak,
// de interaktív elemeket tartalmaznak (pl. kvíz, kihívás, összehasonlító).

function initializeAccordions() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (accordionItems.length === 0) return;

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (header) {
            // Megakadályozzuk a dupla eseménykezelést
            if (header.dataset.listenerAttached) return;
            header.dataset.listenerAttached = 'true';

            header.addEventListener('click', () => {
                const content = item.querySelector('.accordion-content');
                if (!content) return;

                // Ha nem része a "minden-kinyitható" harmonikának, a többit becsukjuk
                if (!item.parentElement.classList.contains('allow-multiple')) {
                    accordionItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                            otherItem.querySelector('.accordion-content').style.maxHeight = null;
                        }
                    });
                }

                item.classList.toggle('active');

                if (item.classList.contains('active')) {
                    content.style.maxHeight = content.scrollHeight + "px";
                } else {
                    content.style.maxHeight = null;
                }
            });
        }
    });
}

function initializeExplainers() {
    const explainerModal = document.getElementById('explainer-modal');
    if (!explainerModal) return;

    const explainerTitle = document.getElementById('explainer-modal-title');
    const explainerText = document.getElementById('explainer-modal-text');
    const explainerIcons = document.querySelectorAll('.explainer-icon');
    const closeExplainerModalBtn = explainerModal.querySelector('.close-modal-btn');
    const overlay = document.getElementById('modal-overlay');

    function openModal(modal) {
        if (overlay) overlay.classList.remove('hidden');
        if (modal) modal.classList.remove('hidden');
    }

    explainerIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            const category = e.currentTarget.dataset.category;
            const lang = localStorage.getItem('preferredLanguage') || 'en';
            const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
            let camelCaseCategory = category.replace(/_([a-z])/g, g => g[1].toUpperCase());
            const titleKey = `explainerTitle${capitalize(camelCaseCategory)}`;
            const textKey = `explainerText${capitalize(camelCaseCategory)}`;
            
            if (translations[lang] && translations[lang][titleKey] && translations[lang][textKey]) {
                explainerTitle.textContent = translations[lang][titleKey];
                const rawText = translations[lang][textKey];
                explainerText.innerHTML = rawText.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('');
                openModal(explainerModal);
            }
        });
    });

    if (closeExplainerModalBtn) {
       closeExplainerModalBtn.addEventListener('click', () => {
            overlay.classList.add('hidden');
            explainerModal.classList.add('hidden');
       });
    }
}


function initializePromptAnatomy() {
    const modules = document.querySelectorAll('.anatomy-module');
    if (modules.length === 0) return;

    modules.forEach(module => {
        const imageElement = module.querySelector('.anatomy-image');
        const baseImage = module.dataset.baseImage;
        const interactiveSpans = module.querySelectorAll('.interactive-prompt');

        interactiveSpans.forEach(span => {
            const hoverImage = span.dataset.image;
            span.addEventListener('mouseenter', () => {
                imageElement.style.opacity = '0.5';
                setTimeout(() => {
                    imageElement.src = hoverImage;
                    imageElement.style.opacity = '1';
                }, 150);
            });
            span.addEventListener('mouseleave', () => {
                imageElement.style.opacity = '0.5';
                setTimeout(() => {
                    imageElement.src = baseImage;
                    imageElement.style.opacity = '1';
                }, 150);
            });
        });
    });
}

function initializeStyleFinder() {
    const container = document.getElementById('style-finder-container');
    if (!container) return;

    const steps = container.querySelectorAll('.sf-step');
    const choiceBtns = container.querySelectorAll('.sf-choice-btn');
    const resultKeywordsDiv = document.getElementById('sf-result-keywords');
    const copyBtn = document.getElementById('sf-copy-btn');
    const restartBtn = document.getElementById('sf-restart-btn');
    let userChoices = {};

    const keywordMap = {
        step1: { epic: "epic, majestic, grand scale, fantasy art,", mystical: "mystical, dreamlike, ethereal, spiritual,", calm: "calm, melancholic, serene, peaceful,", dynamic: "dynamic, modern, vibrant, action-packed," },
        step3: { cinematic: "cinematic film still, dramatic lighting, movie still,", vintage: "vintage film photo, 1970s, faded colors, analog, grainy,", "3d": "hyperrealistic 3D render, octane render, unreal engine, CGI,", digital: "smooth digital painting, by artgerm and loish, sharp details,", oil: "classic oil painting, textured, thick impasto brushstrokes,", watercolor: "watercolor painting, loose brushstrokes, paper texture, splashes of color,", anime: "anime screenshot, style of Studio Ghibli, Makoto Shinkai,", comic: "american comic book style, bold outlines, ink shadows, Frank Miller style,", deco: "elegant art deco poster, geometric shapes, clean lines," },
        step4: { nature: "organic, overgrown with nature, floral patterns,", tech: "sci-fi, futuristic, high-tech, mechanical details,", gothic: "gothic, dark, moody, style of Zdzisław Beksiński,", none: "" }
    };

    function showStep(stepId) {
        steps.forEach(step => step.classList.remove('active'));
        const nextStep = document.getElementById(stepId);
        if (nextStep) {
            nextStep.classList.add('active');
        }
    }

    function generateResult() {
        let result = "";
        result += keywordMap.step1[userChoices['1']] || "";
        result += " " + (keywordMap.step3[userChoices['3']] || "");
        result += " " + (keywordMap.step4[userChoices['4']] || "");
        
        resultKeywordsDiv.innerHTML = '';
        const keywords = result.split(',').map(k => k.trim()).filter(k => k);
        
        keywords.forEach(keyword => {
            const tag = document.createElement('span');
            tag.className = 'prompt-input-tag'; // Osztály cseréje
            tag.textContent = keyword;
            resultKeywordsDiv.appendChild(tag);
        });
        showStep('sf-result');
    }

    choiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const step = btn.dataset.step;
            const choice = btn.dataset.choice;
            userChoices[step] = choice;

            if (step === '1') {
                showStep('sf-step-2');
            } else if (step === '2') {
                showStep(`sf-step-3-${choice}`);
            } else if (step === '3') {
                showStep('sf-step-4');
            } else if (step === '4') {
                generateResult();
            }
        });
    });

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            userChoices = {};
            showStep('sf-step-1');
        });
    }
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const textToCopy = Array.from(resultKeywordsDiv.querySelectorAll('.prompt-input-tag')).map(tag => tag.textContent).join(', ');
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalContent = copyBtn.innerHTML;
                const lang = localStorage.getItem('preferredLanguage') || 'en';
                const successKey = 'copyButtonSuccess';
                const successText = (translations[lang] && translations[lang][successKey]) || "Copied!";
                copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> <span>${successText}</span>`;
                setTimeout(() => { 
                    copyBtn.innerHTML = originalContent; 
                }, 1500);
            });
        });
    }
}

function initializeQuiz() {
    const startBtn = document.getElementById('start-quiz-btn');
    if (!startBtn) return;

    const quizStartDiv = document.getElementById('quiz-start');
    const questionsDiv = document.getElementById('quiz-questions');
    const resultDiv = document.getElementById('quiz-result');
    const progressBarContainer = document.getElementById('progress-bar-container');
    const progressBar = document.getElementById('progress-bar');
    
    let currentQuestionIndex = 0;
    let scores = { epicFantasist: 0, artNouveauDreamer: 0, surrealVisionary: 0, modernistRebel: 0, masterOfLight: 0 };

    startBtn.addEventListener('click', startQuiz);

    function startQuiz() {
        const currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
        if (!translations[currentLanguage] || !translations[currentLanguage].quizQuestions) {
             console.error("Quiz data not found for language:", currentLanguage);
             questionsDiv.innerHTML = "<p>Quiz data is currently unavailable. Please try again later.</p>";
             return;
        }
        quizStartDiv.classList.add('hidden');
        questionsDiv.classList.remove('hidden');
        progressBarContainer.classList.remove('hidden');
        displayQuestion();
    }

    function displayQuestion() {
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        const questionData = translations[lang].quizQuestions[currentQuestionIndex];
        let answersHTML = questionData.answers.map(answer =>
            `<li data-style="${answer.style}">${answer.text}</li>`
        ).join('');

        questionsDiv.innerHTML = `
            <div class="quiz-question active">
                <h3>${currentQuestionIndex + 1}. ${questionData.question}</h3>
                <ul class="quiz-answers">${answersHTML}</ul>
            </div>`;
        
        updateProgressBar();
        
        document.querySelectorAll('.quiz-answers li').forEach(item => {
            item.addEventListener('click', handleAnswerClick);
        });
    }

    function handleAnswerClick(e) {
        const selectedStyle = e.target.dataset.style;
        scores[selectedStyle]++;
        currentQuestionIndex++;
        
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        if (currentQuestionIndex < translations[lang].quizQuestions.length) {
            displayQuestion();
        } else {
            showResult();
        }
    }

    function updateProgressBar() {
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        const progress = (currentQuestionIndex / translations[lang].quizQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function showResult() {
        progressBar.style.width = `100%`;
        
        let maxScore = -1;
        let resultStyle = '';
        for (const style in scores) {
            if (scores[style] > maxScore) {
                maxScore = scores[style];
                resultStyle = style;
            }
        }
        
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        const resultData = translations[lang].quizResults[resultStyle];
        const siteUrl = 'https://aliceinbp.com/quiz.html';
        const shareTextRaw = translations[lang].quizShareText || "My AI art style is: {style}! Find yours!";
        const shareText = encodeURIComponent(shareTextRaw.replace('{style}', resultData.title));

        questionsDiv.classList.add('hidden');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            <h2><span data-key="quizResultTitle"></span> ${resultData.title}</h2>
            <img src="src/quiz-results/${resultStyle.replace(/([A-Z])/g, "-$1").toLowerCase()}.jpg" alt="${resultData.title}">
            <p>${resultData.description}</p>
            <p class="result-artists"><strong><span data-key="quizResultArtists"></span></strong> ${resultData.artists}</p>
            <a href="generator.html" class="cta-button" style="margin-top: 1rem;" data-key="quizResultCTA"></a>
            <div class="share-buttons">
                <a href="https://twitter.com/intent/tweet?text=${shareText}&url=${siteUrl}" target="_blank" class="share-btn twitter" data-key-title="quizShareTwitter"><i class="fa-brands fa-twitter"></i></a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${siteUrl}&quote=${shareText}" target="_blank" class="share-btn facebook" data-key-title="quizShareFacebook"><i class="fa-brands fa-facebook-f"></i></a>
            </div>`;
        
        if (window.setLanguage) window.setLanguage(lang);
    }
}

function initializeChallengePage() {
    const generateBtn = document.getElementById('generate-challenge-btn');
    if (!generateBtn) return;

    const challengeDisplay = document.getElementById('challenge-display');
    const subjectEl = document.getElementById('challenge-subject');
    const styleEl = document.getElementById('challenge-style');
    const moodEl = document.getElementById('challenge-mood');

    generateBtn.addEventListener('click', () => {
        const lang = localStorage.getItem('preferredLanguage') || 'en';
        const { mainSubject, style, detail_mood } = defaultPrompts[lang];

        const randomSubject = mainSubject[Math.floor(Math.random() * mainSubject.length)];
        const randomStyle = style[Math.floor(Math.random() * style.length)];
        const randomMood = detail_mood[Math.floor(Math.random() * detail_mood.length)];

        subjectEl.textContent = randomSubject;
        styleEl.textContent = randomStyle;
        moodEl.textContent = randomMood;

        challengeDisplay.classList.remove('hidden');
    });
}