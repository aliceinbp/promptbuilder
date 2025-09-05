// D:\promptbuilder\netlify\functions\comm-helper.js (FINOMHANGOLT PROMPTTAL)
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { userText, tone, lang } = JSON.parse(event.body);

    if (!userText || !tone) {
      throw new Error("A szöveg vagy a hangnem hiányzik a kérésből.");
    }
    
    // ÚJ: Részletesebb, kontextus-érzékenyebb mesterprompt
    const languageInstruction = lang === 'hu' ? 'A válasz KIZÁRÓLAG magyar nyelven készüljön.' : 'The response MUST be in English.';
    
    const toneMap = {
        hu: {
            formal: "Formális: Használj udvarias, hivatalos nyelvezetet, kerüld a szlenget és a tegeződést. A cél a professzionalizmus és a tisztelet.",
            friendly: "Barátságos: Használj közvetlen, laza stílust. Lehet tegeződő, használhatsz pozitív hangvételű kifejezéseket.",
            confident: "Magabiztos: Használj erős, határozott igéket és kijelentő módot. Kerüld a bizonytalanságot sugalló szavakat ('talán', 'szerintem').",
            concise: "Tömör: Fogalmazz a lehető legrövidebben. Távolíts el minden felesleges töltelékszót, a lényeg maradjon."
        },
        en: {
            formal: "Formal: Use polite, professional language. Avoid slang and contractions. The goal is professionalism and respect.",
            friendly: "Friendly: Use a casual, approachable tone. Use contractions and positive phrasing.",
            confident: "Confident: Use strong, assertive verbs and the active voice. Avoid hedging words ('maybe', 'I think').",
            concise: "Concise: Be as brief as possible. Remove all filler words, get straight to the point."
        }
    };
    
    const selectedToneDescription = toneMap[lang][tone];

    const masterPrompt = `
      Te egy mesterszintű kommunikációs coach és szövegíró vagy. A feladatod, hogy elemezd a felhasználó által adott szöveg **eredeti szándékát** (pl. tájékoztatás, kérés, felmondás), majd a kért hangnemben fogalmazd újra úgy, hogy az eredeti üzenet célja és jelentése ne sérüljön, sőt, a szöveg tisztábbá és hatásosabbá váljon.

      **SPECIÁLIS UTASÍTÁS:** Ha a felhasználó szövege már eleve nagyon közel áll a kért hangnemhez (pl. egy formális szöveget kérnek formálisra), akkor **ne fogalmazd át erőltetetten!** Helyette adj egy finomított, csiszoltabb verziót, ami még professzionálisabb, vagy egy alternatív megfogalmazást, ami ugyanazt a célt éri el. A cél a **javítás**, nem a felesleges változtatás.

      **A HANGNEMEK RÉSZLETES LEÍRÁSA:**
      - **Formális:** ${toneMap[lang].formal}
      - **Barátságos:** ${toneMap[lang].friendly}
      - **Magabiztos:** ${toneMap[lang].confident}
      - **Tömör:** ${toneMap[lang].concise}

      **KRITIKUS KIMENETI SZABÁLYOK:**
      1.  **Csak az átírt szöveget add vissza!** Ne írj semmilyen bevezetőt, magyarázatot vagy kommentárt, mint pl. "Íme az átírt szöveg:".
      2.  **Tartsd meg az eredeti szándékot!** Ha a szöveg egy kijelentés, maradjon kijelentés. Ha egy kérés, maradjon kérés.
      3.  **Nyelv:** ${languageInstruction}

      **A FELHASZNÁLÓ SZÖVEGE:**
      "${userText}"

      **A KÉRT ÚJ HANGNEM:**
      ${selectedTone}
    `;

    const result = await model.generateContent(masterPrompt);
    const response = await result.response;
    const rewrittenText = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ rewrittenText: rewrittenText.trim() })
    };

  } catch (error) {
    console.error("Communication Helper (Gemini) hiba:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Hiba történt a szöveg átírása során.", details: error.message })
    };
  }
};