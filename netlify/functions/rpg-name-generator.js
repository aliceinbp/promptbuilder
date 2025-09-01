// D:\promptbuilder\netlify\functions\rpg-name-generator.js (Kereszt- és vezetéknévvel)
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const userInput = JSON.parse(event.body);
    const lang = userInput.lang || 'en';
    // JAVÍTÁS: A prompt most már teljes neveket kér, és a szabályok mindkét névrészre vonatkoznak.
    const prompts = {
      hu: `Te egy kreatív nyelvész és fantasy-névgenerátor vagy. A feladatod 10 teljesen egyedi, kétrészes név (keresztnév és vezetéknév) létrehozása a felhasználó által megadott stílus alapján.

**KRITIKUS SZABÁLYOK A NÉVALKOTÁSHOZ:**
1.  **Eredetiség:** A név MINDKÉT RÉSZE legyen teljesen kitalált. NE használj létező szavakat semmilyen nyelven.
2.  **Hangzás:** A nevek hangulata és hangzása illeszkedjen a megadott stílushoz (pl. egy törp név legyen keményebb hangzású, egy tünde dallamosabb).
3.  **Nincsenek összetételek:** Szigorúan TILOS létező szavakból összerakni a neveket (pl. KERÜLENDŐ: 'Árny-mágus', 'Vaskalapács').
4.  **Kerüld a kliséket:** Ne használj közismert fantasy neveket (pl. 'Legolas', 'Aragorn').

**FELHASZNÁLÓI KÉRÉS:**
- Stílus: "${userInput.style || 'általános fantasy'}"

**A VÁLASZ FORMÁTUMA:**
A válaszod KIZÁRÓLAG egy JSON tömb legyen, ami 10 stringet tartalmaz. Minden string egy teljes név legyen, ami egy keresztnévből és egy vezetéknévből áll, szóközzel elválasztva. Például: ["Kaelen Voros", "Sorin Thale"].`,
      en: `You are a creative linguist and fantasy name generator. Your task is to create 10 completely unique, two-part names (a first name and a last name) based on the user-provided style.

**CRITICAL RULES FOR NAME CREATION:**
1.  **Originality:** BOTH parts of the name must be entirely fictional. DO NOT use existing words from any language.
2.  **Phonetics:** The mood and sound of the names must fit the requested style (e.g., a dwarven name should sound harsher, an elven name more melodic).
3.  **No Compounds:** It is strictly FORBIDDEN to combine existing words (e.g., AVOID: 'Shadow-mancer', 'Iron-hammer').
4.  **Avoid Clichés:** Do not use well-known fantasy names (e.g., 'Legolas', 'Aragorn').

**USER REQUEST:**
- Style: "${userInput.style || 'general fantasy'}"

**RESPONSE FORMAT:**
Your response MUST BE a JSON array containing exactly 10 strings. Each string must be a full name containing a first name and a last name, separated by a space. For example: ["Kaelen Voros", "Sorin Thale"].`
    };

    const masterPrompt = prompts[lang];

    const result = await model.generateContent(masterPrompt);
    const response = await result.response;
    const rawResult = response.text();
    
    const jsonMatch = rawResult.match(/\[\s*".*?"\s*(,\s*".*?"\s*)*\]/s);
    if (!jsonMatch) {
      throw new Error("The AI did not return a valid JSON array.");
    }
    const jsonResult = JSON.parse(jsonMatch[0]);

    return { statusCode: 200, body: JSON.stringify({ names: jsonResult }) };
  } catch (error) {
    console.error("Name Generator (Gemini) hiba:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Hiba a nevek generálása során.", details: error.message })
    };
  }
};