import { HfInference } from "@huggingface/inference";

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
    const userInput = JSON.parse(event.body);
    const lang = userInput.lang || 'en';

    const promptText = lang === 'hu'
      ? `Viselkedj úgy, mint egy nyelvész és fantasy író. Generálj 10 darab, teljesen egyedi, MAGYAR NYELVŰ nevet, amelyek illenek a következő leíráshoz: "${userInput.style || 'általános fantasy'}". Kerüld a közismert fantasy neveket és a kliséket. A válaszod CSAK egy JSON tömb legyen 10 stringgel, pl: ["Név1", "Név2", ...]. Semmi más szöveg.`
      : `Act as a linguist and fantasy author. Generate 10 completely unique, ENGLISH names that fit the following description: "${userInput.style || 'general fantasy'}". Avoid common fantasy names and clichés. Your response MUST be ONLY a JSON array of 10 strings, like: ["Name1", "Name2", ...]. No other text.`;
      
    const masterPrompt = `[INST]${promptText}[/INST]`;

    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      messages: [{ role: "user", content: masterPrompt }],
      parameters: { max_new_tokens: 200, temperature: 1.0, repetition_penalty: 1.2 }
    });
    
    const rawResult = response.choices[0].message.content;
    const jsonMatch = rawResult.match(/\[\s*".*?"\s*\]/s);
    if (!jsonMatch) {
        throw new Error("Az AI nem adott vissza érvényes JSON formátumú választ.");
    }
    const jsonResult = JSON.parse(jsonMatch[0]);

    return { statusCode: 200, body: JSON.stringify({ names: jsonResult }) };
  } catch (error) {
    console.error("Name Generator hiba:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Hiba a nevek generálása során.", details: error.message }) };
  }
};