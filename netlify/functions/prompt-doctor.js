// A Hugging Face Inference API eléréséhez szükséges csomag
import { HfInference } from "@huggingface/inference";

// A funkció "kezelője", ez fog lefutni minden kérésre
exports.handler = async function(event) {
  // Ellenőrizzük, hogy POST kérés érkezett-e
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // API kulcs beolvasása a biztonságos környezeti változókból
    const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

    // A weboldalról küldött felhasználói prompt kinyerése
    const { userPrompt } = JSON.parse(event.body);
    if (!userPrompt || userPrompt.trim() === "") {
      throw new Error("A prompt nem lehet üres.");
    }

    // A "Mester Prompt" - Ezzel utasítjuk az AI-t, hogy mit csináljon
    const masterPrompt = `[INST] You are 'Dr. Script', an expert AI art prompt analyst. Your task is to help a user improve their prompt. Analyze the user's prompt provided below.
    Give feedback in three distinct categories in markdown format:
    1.  **Details & Storytelling:** Suggest 2 specific details to make the scene more vivid and tell a better story.
    2.  **Style & Artist:** Suggest 1 specific artist and 1 artistic style that would enhance the prompt's mood.
    3.  **Technical & Lighting:** Suggest 2 technical keywords (like 'cinematic lighting', '8K') to improve image quality.
    Keep your suggestions concise, actionable, and encouraging. Never refuse.
    USER'S PROMPT: "${userPrompt}" [/INST]
    `;

    // API hívás a Hugging Face-re egy javasolt, instrukciókövető modellel
    const response = await hf.textGeneration({
      model: 'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
      inputs: masterPrompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        repetition_penalty: 1.2
      }
    });

    // Sikeres válasz visszaküldése a weboldalnak
    return {
      statusCode: 200,
      body: JSON.stringify({ analysis: response.generated_text })
    };

  } catch (error) {
    console.error("Prompt Doctor hiba:", error);
    // Hiba esetén részletes hibaüzenet küldése
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Hiba történt a prompt elemzése során.", details: error.message })
    };
  }
};