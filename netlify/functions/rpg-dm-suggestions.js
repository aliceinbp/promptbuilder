import { HfInference } from "@huggingface/inference";

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
    const userInput = JSON.parse(event.body);
    const lang = userInput.lang || 'en';

    const promptText = lang === 'hu' 
      ? `Generálj 3 különböző, egy mondatos szerepjáték kaland ötletet (kampó). A világ: ${userInput.world || 'fantasy'}. A hangulat: ${userInput.mood || 'kalandos'}. A válasz CSAK egy JSON tömb legyen 3 stringgel, pl: ["ötlet1", "ötlet2", "ötlet3"]. Semmi más szöveg.`
      : `Generate 3 distinct, one-sentence RPG adventure hooks. The world is: ${userInput.world || 'fantasy'}. The mood is: ${userInput.mood || 'adventurous'}. Your response MUST be ONLY a JSON array of 3 strings, like: ["hook1", "hook2", "hook3"]. No other text.`;

    const masterPrompt = `[INST]${promptText}[/INST]`;

    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      messages: [{ role: "user", content: masterPrompt }],
      parameters: { max_new_tokens: 150, temperature: 0.9 }
    });

    const rawResult = response.choices[0].message.content;
    const jsonResult = JSON.parse(rawResult.match(/\[.*\]/s)[0]); // Kinyerjük a JSON tömböt a válaszból

    return { statusCode: 200, body: JSON.stringify({ suggestions: jsonResult }) };
  } catch (error) {
    console.error("DM Suggestion hiba:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Hiba az ötletek generálása során." }) };
  }
};