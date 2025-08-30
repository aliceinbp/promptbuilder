import { HfInference } from "@huggingface/inference";

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
    const userInput = JSON.parse(event.body);
    const lang = userInput.lang || 'en';

    // EZ AZ ÚJ, FONTOS RÉSZ: Megtisztítjuk a felhasználói szöveget
    const defaultContextHu = 'A hősök egy sötét erdőben táboroznak.';
    const defaultContextEn = 'The heroes are camping in a dark forest.';
    const sanitizedContext = (userInput.context || (lang === 'hu' ? defaultContextHu : defaultContextEn))
        .replace(/`/g, "'")
        .replace(/"/g, "'");

    const promptText = lang === 'hu'
      ? `Viselkedj úgy, mint egy tapasztalt mesélő és forgatókönyvíró. A felhasználó elakadt a történetében. Olvasd el a helyzetleírást, és generálj 3 logikus, de meglepő és kreatív fordulatot, ami továbbviheti a cselekményt. A válaszod CSAK egy JSON tömb legyen 3 stringgel. A felhasználó helyzete: '${sanitizedContext}'`
      : `Act as an expert storyteller and screenwriter. The user is stuck in their story. Read the provided situation, and generate 3 logical but surprising and creative plot twists to advance the plot. Your response MUST be ONLY a JSON array of 3 strings. The user's situation is: '${sanitizedContext}'`;
      
    const masterPrompt = `[INST]${promptText}[/INST]`;

    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      messages: [{ role: "user", content: masterPrompt }],
      parameters: { max_new_tokens: 300, temperature: 0.9, repetition_penalty: 1.2 }
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