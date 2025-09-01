// D:\promptbuilder\netlify\functions\rpg-dm-suggestions.js (VÉGLEGESEN JAVÍTOTT)

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

    // JAVÍTÁS: Sokkal részletesebb és egyértelműbb parancs az AI számára, példával együtt.
    const prompts = {
      hu: `Te egy kreatív RPG ötletgenerátor vagy. A feladatod, hogy 4 KÜLÖNBÖZŐ kalandötletet adj. Minden ötlet egy rövid, 3-7 szóból álló kulcsszó-lista legyen.
A felhasználó adta meg a következőket:
- Világ: ${userInput.world || 'általános fantasy'}
- Hangulat: ${userInput.mood || 'kalandos'}

A VÁLASZOD KIZÁRÓLAG egy JSON tömb legyen, ami 4 stringet tartalmaz. Minden string egy-egy különálló ötlet. NE fűzd össze az ötleteket egyetlen stringbe!

Példa a HELYES formátumra:
["Elveszett karaván, sivatagi szellemek, oázis átka", "Tolvajcéh árulása, megmérgezett herceg, titkos alagutak", "Süllyedő város, vízalatti isten, korall-ereklye", "Mágusok tornya, elszabadult idézés, időhurok"]

Ne írj semmilyen más szöveget a JSON tömbön kívül.`,
      en: `You are a creative RPG idea generator. Your task is to provide 4 SEPARATE adventure hooks. Each hook should be a short string of 3-7 keywords.
The user has provided:
- World: ${userInput.world || 'fantasy'}
- Mood: ${userInput.mood || 'adventurous'}

Your response MUST BE a JSON array containing exactly 4 strings. Each string is one separate hook. DO NOT combine the hooks into a single string.

Example of the CORRECT format:
["Lost caravan, desert ghosts, oasis curse", "Thieves' guild betrayal, poisoned prince, secret tunnels", "Sinking city, underwater god, coral relic", "Wizard's tower, summon-gone-wrong, time loop"]

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

    return {
      statusCode: 200,
      body: JSON.stringify({ suggestions: jsonResult })
    };

  } catch (error) {
    console.error("DM Suggestion (Gemini) hiba:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Hiba történt az ötletek generálása során.", details: error.message })
    };
  }
};