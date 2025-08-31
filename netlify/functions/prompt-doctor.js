exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const { userPrompt } = JSON.parse(event.body);

    if (!userPrompt || userPrompt.trim() === "") {
      throw new Error("A prompt nem lehet üres.");
    }

    const masterPrompt = `You are 'Dr. Script', an expert AI art prompt analyst. Your task is to help a user improve their prompt. Analyze the user's prompt provided below.
    Give feedback in three distinct categories in markdown format:
    1.  **Details & Storytelling:** Suggest 2 specific details to make the scene more vivid.
    2.  **Style & Artist:** Suggest 1 specific artist and 1 artistic style that would enhance the mood.
    3.  **Technical & Lighting:** Suggest 2 technical keywords (like 'cinematic lighting', '8K') to improve image quality.
    Keep your suggestions concise, actionable, and encouraging.
    USER'S PROMPT: "${userPrompt}"`;

    // ===== EZ A SOR VÁLTOZOTT! =====
    // A régi 'v1beta' és 'gemini-pro' helyett az új, stabil 'v1' és a gyorsabb 'gemini-1.5-flash-latest' modellt használjuk.
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
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
      // Részletesebb hibaüzenet naplózása a Netlify-on
      console.error("Gemini API Error:", JSON.stringify(errorData));
      throw new Error(errorData.error.message);
    }

    const data = await response.json();
    
    // Hibakezelés arra az esetre, ha a Gemini nem adna érdemi választ
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("A Gemini API nem adott vissza érvényes választ.");
    }
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