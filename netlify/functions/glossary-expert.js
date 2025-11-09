// D:\promptbuilder\netlify\functions\glossary-expert.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const { userTerm, lang } = JSON.parse(event.body);

    if (!userTerm) {
      throw new Error("A keresett kifejezés nem lehet üres.");
    }
    
    const languageInstruction = lang === 'hu' ? 'A válasz KIZÁRÓLAG magyar nyelven készüljön.' : 'The response MUST be in English.';

    const masterPrompt = `
      Te egy AI művészeti és technológiai szakértő vagy, a "Tudós". Feladatod, hogy közérthető, lényegre törő magyarázatot adj a felhasználó által megadott kifejezésre.
      
      **KRITIKUS SZABÁLYOK:**
      1.  **Formátum:** A válaszodnak pontosan meg kell egyeznie a meglévő fogalomtár stílusával: egyetlen, rövid bekezdésnyi magyarázat, amit egy "Kulcsszavak:" lista követ 3-5 releváns kulcsszóval.
      2.  **Stílus:** A hangnemed legyen segítőkész, informatív és könnyen érthető. Kerüld a túlzottan bonyolult szakzsargont.
      3.  **Nyelv:** ${languageInstruction}
      4.  **Tartalom:** Koncentrálj arra, hogy a kifejezés mit jelent az AI képalkotás kontextusában.
      5.  **Tisztaság:** Ne adj hozzá semmilyen bevezető vagy záró szöveget, mint pl. "Íme a definíció:". Csak a magyarázatot add.

      **A FELHASZNÁLÓ KIFEJEZÉSE:** "${userTerm}"
    `;

    const result = await model.generateContent(masterPrompt);
    const response = await result.response;
    const definition = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ definition: definition })
    };

  } catch (error) {
    console.error("Glossary Expert (Gemini) hiba:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Hiba történt a magyarázat generálása során.", details: error.message })
    };
  }
};