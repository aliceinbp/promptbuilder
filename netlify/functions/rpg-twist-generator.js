import { HfInference } from "@huggingface/inference";

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
    const userInput = JSON.parse(event.body);
    const lang = userInput.lang || 'en';

    const sanitizedContext = (userInput.context || (lang === 'hu' ? 'A hősök egy sötét erdőben táboroznak.' : 'The heroes are camping in a dark forest.'))
        .replace(/`/g, "'")
        .replace(/"/g, "'");

    // Külön, optimalizált prompt mindkét nyelvhez
    const promptText = lang === 'hu'
      ? `Adj 3 rövid, kreatív fordulatot ehhez a szerepjáték helyzethez: "${sanitizedContext}". A válaszod CSAK egy JSON tömb legyen 3 stringgel.`
      : `Give 3 brief, creative plot twists for this RPG situation: "${sanitizedContext}". Your response MUST be ONLY a JSON array of 3 strings.`;
      
    const masterPrompt = `[INST]${promptText}[/INST]`;

    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      messages: [{ role: "user", content: masterPrompt }],
      parameters: { max_new_tokens: 250, temperature: 0.9 }
    });
    
    const rawResult = response.choices[0].message.content;
    const jsonMatch = rawResult.match(/\[\s*".*?"\s*(,\s*".*?"\s*)*\]/s);
    if (!jsonMatch) {
        throw new Error("Az AI nem adott vissza érvényes JSON formátumú választ.");
    }
    const jsonResult = JSON.parse(jsonMatch[0]);

    return { statusCode: 200, body: JSON.stringify({ twists: jsonResult }) };
  } catch (error) {
    console.error("Twist Generator hiba:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Hiba a fordulatok generálása során.", details: error.message }) };
  }
};