// D:\promptbuilder\netlify\functions\rpg-character-suggestions.js (ÚJ, GEMINI VERZIÓ)
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const userInput = JSON.parse(event.body);
    const lang = userInput.lang || 'en';

    const prompts = {
      hu: `Te egy kreatív RPG ötletgenerátor vagy. A feladatod, hogy 4 KÜLÖNBÖZŐ, egy mondatos karakterkoncepciót adj.
A felhasználó adta meg a következőket:
- Világ: ${userInput.world || 'fantasy'}
- Kaszt: ${userInput.class || 'kalandor'}

A VÁLASZOD KIZÁRÓLAG egy JSON tömb legyen, ami 4 stringet tartalmaz. Minden string egy-egy különálló ötlet. NE fűzd össze az ötleteket!

Példa a HELYES formátumra:
["Egy veterán testőr, aki cserbenhagyta a herceget, akit védelmeznie kellett volna.", "Egy alkimista, aki véletlenül halhatatlanná tette a macskáját, és most a gyógymódot keresi.", "Egy kiugrott pap, aki egy tiltott isten suttogásait hallja a fejében.", "Egy nomád bárd, aki a törzsének elveszett történeteit gyűjti össze a világban."]

Ne írj semmilyen más szöveget a JSON tömbön kívül.`,
      en: `You are a creative RPG idea generator. Your task is to provide 4 SEPARATE, one-sentence character concepts.
The user has provided:
- World: ${userInput.world || 'fantasy'}
- Class: ${userInput.class || 'adventurer'}

Your response MUST BE a JSON array containing exactly 4 strings. Each string is one separate concept. DO NOT combine the concepts into a single string.

Example of the CORRECT format:
["A veteran bodyguard who failed the prince they were sworn to protect.", "An alchemist who accidentally made their cat immortal and is now seeking a cure.", "A disgraced priest who hears the whispers of a forbidden god.", "A nomadic bard piecing together their tribe's lost history from scattered lore."]

Do not write any text outside of the JSON array.`
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

    return { statusCode: 200, body: JSON.stringify({ suggestions: jsonResult }) };
  } catch (error) {
    console.error("Character Suggestion (Gemini) hiba:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Hiba a koncepciók generálása során.", details: error.message }) };
  }
};