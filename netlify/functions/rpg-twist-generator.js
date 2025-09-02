// D:\promptbuilder\netlify\functions\rpg-twist-generator.js (FINOMÍTOTT PROMPTTAL)
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const userInput = JSON.parse(event.body);
    const lang = userInput.lang || 'en';
    const context = userInput.context || (lang === 'hu' ? 'A hősök egy sötét erdőben táboroznak.' : 'The heroes are camping in a dark forest.');

    const prompts = {
      hu: `Te egy kreatív RPG fordulatgenerátor vagy. A feladatod, hogy 3 KÜLÖNBÖZŐ, a történethez illeszkedő, de meglepő fordulatot adj a felhasználó által megadott helyzet alapján.

**KRITIKUS SZABÁLYOK:**
1.  **Kreatív Irányelvek:** A fordulatok legyenek **váratlanok, de logikusak** a megadott helyzeten belül. Kerüljék a kliséket (pl. 'csak egy álom volt'), és adjanak mélységet a történetnek ahelyett, hogy teljesen elrugaszkodnának tőle.
2.  **Formátum:** A válaszod KIZÁRÓLAG egy JSON tömb legyen, ami 3 stringet tartalmaz. Minden string egy-egy különálló fordulatötlet.
3.  **Tisztaság:** Ne írj semmilyen más szöveget, bevezetést vagy magyarázatot a JSON tömbön kívül.
4.  **Nyelv:** A kimenet nyelve KIZÁRÓLAG magyar legyen.

**Példa a HELYES formátumra:**
["A gonosztevő valójában a hős rég elveszett testvére.", "Az 'elátkozott' tárgy valójában egy kulcs egy égi birodalomhoz.", "A látszólag ártatlan falusi a háttérből mozgatta az összes szálat."]

**FELHASZNÁLÓI HELYZET:**
"${context}"`,
      en: `You are a creative RPG plot twist generator. Your task is to provide 3 SEPARATE, story-appropriate, yet surprising plot twists based on the user's situation.

**CRITICAL RULES:**
1.  **Creative Guidelines:** The twists must be **unexpected, yet logical** within the provided context. They should avoid common clichés (e.g., 'it was all a dream') and add depth to the story rather than being completely random or nonsensical.
2.  **Format:** Your response MUST BE ONLY a JSON array containing exactly 3 strings. Each string is one separate twist idea.
3.  **Purity:** Do not write any text, introduction, or explanation outside of the JSON array.
4.  **Language:** The output MUST be in English.

**Example of the CORRECT format:**
["The villain is actually the hero's long-lost sibling.", "The 'cursed' object is actually a key to a celestial realm.", "The seemingly innocent villager is the mastermind behind the whole plot."]

**USER'S SITUATION:**
"${context}"`
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

    return {
      statusCode: 200,
      body: JSON.stringify({ twists: jsonResult })
    };

  } catch (error) {
    console.error("Twist Generator (Gemini) hiba:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Hiba történt a fordulatok generálása során.", details: error.message })
    };
  }
};