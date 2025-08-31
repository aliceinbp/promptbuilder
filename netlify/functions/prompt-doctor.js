exports.handler = async function(event) {
  // 1. Csak a POST kéréseket fogadjuk el
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // 2. Beolvassuk a Netlify-on beállított titkos API kulcsot
    const apiKey = process.env.GEMINI_API_KEY;
    const { userPrompt } = JSON.parse(event.body);

    if (!userPrompt || userPrompt.trim() === "") {
      throw new Error("A prompt nem lehet üres.");
    }

    // 3. Összeállítjuk a mester-promptot a Gemini számára
    const masterPrompt = `You are 'Dr. Script', an expert AI art prompt analyst. Your task is to help a user improve their prompt. Analyze the user's prompt provided below.
    Give feedback in three distinct categories in markdown format:
    1.  **Details & Storytelling:** Suggest 2 specific details to make the scene more vivid.
    2.  **Style & Artist:** Suggest 1 specific artist and 1 artistic style that would enhance the mood.
    3.  **Technical & Lighting:** Suggest 2 technical keywords (like 'cinematic lighting', '8K') to improve image quality.
    Keep your suggestions concise, actionable, and encouraging.
    USER'S PROMPT: "${userPrompt}"`;

    // 4. API hívás a Google Gemini felé a JAVÍTOTT, STABIL modellcímmel
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${apiKey}`, {
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

    // 5. Hibakezelés, ha az API hívás nem sikeres
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", JSON.stringify(errorData));
      throw new Error(errorData.error.message);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("A Gemini API nem adott vissza érvényes választ.");
    }

    // 6. A sikeres válasz feldolgozása és visszaküldése a weboldalnak
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