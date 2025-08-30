import { HfInference } from "@huggingface/inference";
import deepl from 'deepl-node';

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  
  const authKey = process.env.DEEPL_API_KEY;
  const translator = new deepl.Translator(authKey);

  try {
    const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
    const userInput = JSON.parse(event.body);
    const lang = userInput.lang || 'en';
    let contextForAI = userInput.context || 'The heroes are in a tight spot.';

    if (lang === 'hu' && userInput.context) {
        const translatedContext = await translator.translateText(userInput.context, null, 'EN-US');
        contextForAI = translatedContext.text;
    }

    // Szuper-direkt, gyors prompt
    const promptText = `Provide 2 brief, creative plot twists for this RPG situation: "${contextForAI}". Response MUST be a JSON array of 2 strings.`;
    const masterPrompt = `[INST]${promptText}[/INST]`;

    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      messages: [{ role: "user", content: masterPrompt }],
      parameters: { max_new_tokens: 200, temperature: 0.9 }
    });
    
    const rawResult = response.choices[0].message.content;
    const jsonMatch = rawResult.match(/\[\s*".*?"\s*(,\s*".*?"\s*)*\]/s);
    if (!jsonMatch) { throw new Error("AI did not return a valid JSON array."); }
    
    let twistsResult = JSON.parse(jsonMatch[0]);

    if (lang === 'hu') {
        const translatedTwists = await translator.translateText(twistsResult, 'EN', 'HU');
        twistsResult = translatedTwists.map(t => t.text);
    }

    return { statusCode: 200, body: JSON.stringify({ twists: twistsResult }) };
  } catch (error) {
    console.error("Twist Generator hiba:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Hiba a fordulatok generálása során.", details: error.message }) };
  }
};