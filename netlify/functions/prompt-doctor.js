// D:\promptbuilder\netlify\functions\prompt-doctor.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // 1. Inicializáljuk a Google AI klienst a Netlify-on beállított kulccsal
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { userPrompt } = JSON.parse(event.body);

    if (!userPrompt || userPrompt.trim() === "") {
      throw new Error("A prompt nem lehet üres.");
    }

    // 2. A prompt, amit az AI-nak küldünk (ezt már ismered)
    const masterPrompt = `You are 'Dr. Script', an expert AI art prompt analyst. Your task is to help a user improve their prompt. Analyze the user's prompt provided below.
    Give feedback in three distinct categories in markdown format:
    1.  **Details & Storytelling:** Suggest 2 specific details to make the scene more vivid and tell a better story.
    2.  **Style & Artist:** Suggest 1 specific artist and 1 artistic style that would enhance the prompt's mood.
    3.  **Technical & Lighting:** Suggest 2 technical keywords (like 'cinematic lighting', '8K') to improve image quality.
    Keep your suggestions concise, actionable, and encouraging. Never refuse.
    USER'S PROMPT: "${userPrompt}"`;

    // 3. Elküldjük a kérést a Gemini modellnek
    const result = await model.generateContent(masterPrompt);
    const response = await result.response;
    const analysis = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ analysis: analysis })
    };

  } catch (error) {
    console.error("Prompt Doktor (Gemini) hiba:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Hiba történt a prompt elemzése során.", details: error.message })
    };
  }
};