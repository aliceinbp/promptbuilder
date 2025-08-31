// A Google hivatalos Vertex AI könyvtárának importálása
const { VertexAI } = require('@google-cloud/aiplatform');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { userPrompt } = JSON.parse(event.body);

    if (!userPrompt || userPrompt.trim() === "") {
      throw new Error("A prompt nem lehet üres.");
    }
    
    // A Netlify változókból beolvasott JSON tartalmának feldolgozása
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON);
    
    // A kliens inicializálása a Service Account adatokkal és a hellyel
    const vertex_ai = new VertexAI({
        project: credentials.project_id,
        location: 'us-central1',
        credentials
    });
    
    // A generatív modell kiválasztása
    const generativeModel = vertex_ai.getGenerativeModel({
        model: 'gemini-1.0-pro',
    });

    const masterPrompt = `You are 'Dr. Script', an expert AI art prompt analyst... USER'S PROMPT: "${userPrompt}"`; // A prompt szövege változatlan

    // Kérés küldése a modelnek
    const resp = await generativeModel.generateContentStream(masterPrompt);
    
    // A streamelt válasz összefűzése
    let fullAnalysis = "";
    for await (const item of resp.stream) {
        if (item.candidates && item.candidates[0].content && item.candidates[0].content.parts[0].text) {
            fullAnalysis += item.candidates[0].content.parts[0].text;
        }
    }

    if (fullAnalysis === "") {
        throw new Error("A Vertex AI API nem adott vissza érdemi választ.");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ analysis: fullAnalysis })
    };

  } catch (error) {
    console.error("Prompt Doktor (Vertex AI) hiba:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Hiba történt a prompt elemzése során.", details: error.message })
    };
  }
};