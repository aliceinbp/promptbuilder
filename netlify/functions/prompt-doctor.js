// A Google hivatalos hitelesítési könyvtárának importálása
const { GoogleAuth } = require('google-auth-library');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { userPrompt } = JSON.parse(event.body);

    if (!userPrompt || userPrompt.trim() === "") {
      throw new Error("A prompt nem lehet üres.");
    }
    
    // 1. Beolvassuk a Netlify-on tárolt titkos JSON-t
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
    
    // 2. Létrehozunk egy hitelesítési klienst a JSON adatokból
    const auth = new GoogleAuth({
        credentials,
        scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });
    const client = await auth.getClient();
    
    // 3. Kérünk egy rövid életű, biztonságos hozzáférési tokent
    const accessToken = (await client.getAccessToken()).token;
    
    // 4. Beállítjuk a projekt adatait
    const projectId = credentials.project_id;
    const location = 'us-central1';

    const masterPrompt = `You are 'Dr. Script', an expert AI art prompt analyst. Your task is to help a user improve their prompt. Analyze the user's prompt provided below.
    Give feedback in three distinct categories in markdown format:
    1.  **Details & Storytelling:** Suggest 2 specific details to make the scene more vivid.
    2.  **Style & Artist:** Suggest 1 specific artist and 1 artistic style that would enhance the mood.
    3.  **Technical & Lighting:** Suggest 2 technical keywords (like 'cinematic lighting', '8K') to improve image quality.
    Keep your suggestions concise, actionable, and encouraging.
    USER'S PROMPT: "${userPrompt}"`;

    // 5. Elküldjük a kérést a Vertex AI-nak a frissen generált tokennel
    const vertexAiUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/gemini-1.0-pro:generateContent`;

    const response = await fetch(vertexAiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`, // A generált tokent használjuk
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "contents": [{
          "parts": [{ "text": masterPrompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Vertex AI Error Raw Response:", errorText);
      throw new Error(`API hiba: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
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