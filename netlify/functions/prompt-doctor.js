import { HfInference } from "@huggingface/inference";

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
    const { userPrompt } = JSON.parse(event.body);

    if (!userPrompt || userPrompt.trim() === "") {
      throw new Error("A prompt nem lehet üres.");
    }

    // Ugyanazt a megbízható modellt használjuk, mint az RPG segédlet
    const modelToUse = 'mistralai/Mistral-7B-Instruct-v0.3';

    const masterPrompt = `[INST] You are 'Dr. Script', an expert AI art prompt analyst. Your task is to help a user improve their prompt. Analyze the user's prompt provided below.
    Give feedback in three distinct categories in markdown format:
    1.  **Details & Storytelling:** Suggest 2 specific details to make the scene more vivid.
    2.  **Style & Artist:** Suggest 1 specific artist and 1 artistic style that would enhance the mood.
    3.  **Technical & Lighting:** Suggest 2 technical keywords (like 'cinematic lighting', '8K') to improve image quality.
    Keep your suggestions concise, actionable, and encouraging.
    USER'S PROMPT: "${userPrompt}" [/INST]`;
    
    const response = await hf.chatCompletion({
      model: modelToUse,
      messages: [{ role: "user", content: masterPrompt }],
      parameters: {
        max_new_tokens: 300,
        temperature: 0.7,
        repetition_penalty: 1.2
      }
    });

    const analysis = response.choices[0].message.content || "Az AI nem adott érdemi választ.";

    return {
      statusCode: 200,
      body: JSON.stringify({ analysis: analysis })
    };

  } catch (error) {
    console.error("Prompt Doktor (Hugging Face) hiba:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Hiba történt a prompt elemzése során.", details: error.message })
    };
  }
};