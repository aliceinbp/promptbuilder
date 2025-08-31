exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Beolvassuk mindhárom Netlify változót
    const apiKey = process.env.GEMINI_API_KEY;
    const projectId = process.env.GOOGLE_PROJECT_ID;
    const projectLocation = process.env.GOOGLE_PROJECT_LOCATION;
    
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

    // Az új, bombabiztos Vertex AI URL, ami a kódból kapja meg a helyszínt és a projekt ID-t
    const vertexAiUrl = `https://${projectLocation}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${projectLocation}/publishers/google/models/gemini-1.0-pro:streamGenerateContent`;

    const response = await fetch(vertexAiUrl, {
      method: 'POST',
      headers: {
        // Fontos: A Vertex AI "Bearer" tokent vár, nem sima API kulcsot a headerben.
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "contents": [{
          "role": "user",
          "parts": [{
            "text": masterPrompt
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Vertex AI Error Raw Response:", errorText);
      const errorData = JSON.parse(errorText);
      throw new Error(errorData.error.message);
    }

    // A Vertex AI "streamelt" választ ad, amit egyben kell feldolgozni
    const responseText = await response.text();
    const data = JSON.parse(responseText.replace(/^\[|\]$/g, '')); // Eltávolítja a kezdő és záró szögletes zárójeleket

    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content.parts[0].text) {
         throw new Error("A Vertex AI API nem adott vissza érvényes választ.");
    }
    const analysis = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      body: JSON.stringify({ analysis: analysis })
    };

  } catch (error) {
    console.error("Prompt Doktor (Vertex AI) hiba:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Hiba történt a prompt elemzése során.", details: error.message })
    };
  }
};