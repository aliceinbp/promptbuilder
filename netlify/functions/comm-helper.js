// D:\promptbuilder\netlify\functions\comm-helper.js
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
    
    const languageInstruction = lang === 'hu' ? 'A válasz KIZÁRÓLAG magyar nyelven készüljön.' : 'The response MUST be in English.';
    const toneMap = {
        hu: {
            formal: "Formális, hivatalos, udvarias",
            friendly: "Barátságos, laza, közvetlen",
            confident: "Magabiztos, határozott, meggyőző",
            concise: "Tömör, lényegre törő, minden felesleges szó nélküli"
        },
        en: {
            formal: "Formal, professional, polite",
            friendly: "Friendly, casual, approachable",
            confident: "Confident, assertive, persuasive",
            concise: "Concise, to-the-point, without any filler words"
        }
    };
    
    const selectedToneDescription = toneMap[lang][tone];

    const masterPrompt = `
      Te egy kommunikációs szakértő vagy. A feladatod, hogy a felhasználó által adott szöveget átfogalmazd a megadott hangnemben.

      **KRITIKUS SZABÁLYOK:**
      1.  **Csak az átírt szöveget add vissza!** Ne írj semmilyen bevezetőt, magyarázatot vagy kommentárt, mint pl. "Íme az átírt szöveg:".
      2.  **Tartsd meg az eredeti jelentést!** A cél a hangnem megváltoztatása, nem az üzenet tartalmának eltorzítása.
      3.  **Nyelv:** ${languageInstruction}

      **A FELHASZNÁLÓ SZÖVEGE:**
      "${userText}"

      **A KÉRT ÚJ HANGNEM:**
      ${selectedToneDescription}
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