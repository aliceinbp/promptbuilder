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
    let contextForAI = userInput.context || 'The heroes are camping in a dark forest.';

    // Ha a nyelv magyar, lefordítjuk a kontextust angolra az AI számára
    if (lang === 'hu' && userInput.context) {
        const translatedContext = await translator.translateText(userInput.context, null, 'EN-US');
        contextForAI = translatedContext.text;
    }

    // Az AI-nak mindig angolul adjuk a parancsot, mert úgy a legkreatívabb
    const promptText = `Act as an expert storyteller and screenwriter. The user is stuck in their story. Read the provided situation, and generate 3 logical but surprising and creative plot twists to advance the plot. Your response MUST be ONLY a JSON array of 3 strings. The user's situation is: '${contextForAI}'`;
      
    const masterPrompt = `[INST]${promptText}[/INST]`;

    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      messages: [{ role: "user", content: masterPrompt }],
      parameters: { max_new_tokens: 300, temperature: 0.9, repetition_penalty: 1.2 }
    });
    
    const rawResult = response.choices[0].message.content;
    const jsonMatch = rawResult.match(/\[\s*".*?"\s*(,\s*".*?"\s*)*\]/s);
    if (!jsonMatch) {
        throw new Error("AI did not return a valid JSON array.");
    }
    
    let twistsResult = JSON.parse(jsonMatch[0]);

    // Ha a nyelv magyar, a kapott angol ötleteket visszafordítjuk magyarra
    if (lang === 'hu') {
        const translatedTwists = await translator.translateText(twistsResult, 'EN', 'HU');
        // A deepl-node translateText metódusa tömböt vár és objektumok tömbjét adja vissza
        twistsResult = translatedTwists.map(t => t.text);
    }

    return { statusCode: 200, body: JSON.stringify({ twists: twistsResult }) };
  } catch (error) {
    console.error("Twist Generator hiba:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Hiba a fordulatok generálása során.", details: error.message }) };
  }
};