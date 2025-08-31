// A Hugging Face importot töröltük, már nincs rá szükség

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // 1. API kulcs beolvasása a Netlify biztonságos környezeti változóiból
    const apiKey = process.env.GEMINI_API_KEY;
    const { userPrompt } = JSON.parse(event.body);

    if (!userPrompt || userPrompt.trim() === "") {
      throw new Error("A prompt nem lehet üres.");
    }

    // 2. Prompt összeállítása a Gemini számára
    const masterPrompt = `You are 'Dr. Script', an expert AI art prompt analyst. Your task is to help a user improve their prompt. Analyze the user's prompt provided below.
    Give feedback in three distinct categories in markdown format:
    1.  **Details & Storytelling:** Suggest 2 specific details to make the scene more vivid.
    2.  **Style & Artist:** Suggest 1 specific artist and 1 artistic style that would enhance the mood.
    3.  **Technical & Lighting:** Suggest 2 technical keywords (like 'cinematic lighting', '8K') to improve image quality.
    Keep your suggestions concise, actionable, and encouraging.
    USER'S PROMPT: "${userPrompt}"`;

    // 3. API hívás a Google Gemini felé a 'fetch' paranccsal
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "contents": [{
          "parts": [{
            "text": masterPrompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    const data = await response.json();
    
    // 4. A válasz feldolgozása
    const analysis = data.candidates[0].content.parts[0].text;

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