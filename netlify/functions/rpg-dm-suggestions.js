import { HfInference } from "@huggingface/inference";

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
    const userInput = JSON.parse(event.body);
    const lang = userInput.lang || 'en';

    const promptText = lang === 'hu'
      ? `Generálj 3 különböző, egy mondatos magyar nyelvű szerepjáték karakter koncepciót. A világ: ${userInput.world || 'fantasy'}. A kaszt: ${userInput.class || 'kalandor'}. A válasz CSAK egy JSON tömb legyen 3 stringgel, pl: ["koncepció1", "koncepció2", "koncepció3"]. Semmi más szöveg.`
      : `Generate 3 distinct, one-sentence RPG character concepts in English. The world is: ${userInput.world || 'fantasy'}. The class is: ${userInput.class || 'adventurer'}. Your response MUST be ONLY a JSON array of 3 strings, like: ["concept1", "concept2", "concept3"]. No other text.`;

    const masterPrompt = `[INST]${promptText}[/INST]`;

    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      messages: [{ role: "user", content: masterPrompt }],
      parameters: { max_new_tokens: 150, temperature: 0.9 }
    });
    
    const rawResult = response.choices[0].message.content;
    const jsonResult = JSON.parse(rawResult.match(/\[.*\]/s)[0]);

    return { statusCode: 200, body: JSON.stringify({ suggestions: jsonResult }) };
  } catch (error) {
    console.error("Character Suggestion hiba:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Hiba a koncepciók generálása során." }) };
  }
};