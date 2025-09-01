// D:\promptbuilder\netlify\functions\rpg-dm-suggestions.js (JAVÍTOTT)

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

    // JAVÍTÁS: A prompt most 4 ötletet kér, és az elvárt JSON formátum is ezt tükrözi.
    const prompts = {
      hu: `Kérlek generálj 4 különböző, rövid, egyedi RPG kalandötletet (mindegyik 3-7 kulcsszóból álljon). A világ: ${userInput.world || 'fantasy'}. A hangulat: ${userInput.mood || 'kalandos'}. A válaszod CSAK egy JSON tömb legyen 4 stringgel, pl: ["ötlet1", "ötlet2", "ötlet3", "ötlet4"]. Semmi más szöveget ne írj.`,
      en: `Generate 4 distinct, brief, unique RPG adventure hooks (each 3-7 keywords long). The world is: ${userInput.world || 'fantasy'}. The mood is: ${userInput.mood || 'adventurous'}. Your response MUST be ONLY a JSON array of 4 strings, like: ["hook1", "hook2", "hook3", "hook4"]. No other text.`
    };
    
    const masterPrompt = prompts[lang];

    const result = await model.generateContent(masterPrompt);
    const response = await result.response;
    const rawResult = response.text();

    // JAVÍTÁS: Biztonságos JSON kinyerése a válaszból, hogy elkerüljük a hibákat.
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