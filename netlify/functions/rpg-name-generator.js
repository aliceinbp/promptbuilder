import { HfInference } from "@huggingface/inference";

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
    const userInput = JSON.parse(event.body);
    const lang = userInput.lang || 'en';

    // EZ A VÉGLEGES, MÉG SZIGORÚBB PROMPT
    const promptText = lang === 'hu'
      ? `Viselkedj úgy, mint egy nyelvész és fantasy író. Generálj 10 darab, teljesen egyedi, fiktív nevet, amelyek illenek a következő leíráshoz: "${userInput.style || 'általános fantasy'}".
      A nevek legyenek egybefüggő, kitalált szavak, vagy két részből álló nevek, ahol MINDKÉT RÉSZ FIKTÍV.
      KRITIKUSAN FONTOS: NE alkoss neveket létező magyar szavak összetételéből (KERÜLENDŐ: 'Árnyék-Suttogó', 'Obszidián-Szív'). A cél az eredetiség, nem a leírás.
      A következő nevek KIZÁRÓLAG STÍLUS PÉLDÁK: 'Lyra Valerion', 'Sorin Thale', 'Elaria Vessar'. NE HASZNÁLD VAGY MÁSOLD ezeket!
      A válaszod CSAK egy JSON tömb legyen 10 stringgel, pl: ["Név1", "Név2", ...].`
      : `Act as a linguist and fantasy author. Generate 10 completely unique, fictional proper names that fit the following description: "${userInput.style || 'general fantasy'}".
      The names should be single, cohesive words, or two-part names where BOTH parts are fictional. They should sound like authentic names, not descriptive titles.
      CRITICAL: DO NOT create names by combining common English words (AVOID: 'Shadow-Whisper', 'Crimson-Blade', 'Nightshade'). The goal is originality, not description.
      The following names are STYLE EXAMPLES ONLY: 'Lyra Valerion', 'Sorin Thale', 'Elaria Vessar'. DO NOT USE OR COPY them!
      Your response MUST be ONLY a JSON array of 10 strings, like: ["Name1", "Name2", ...].`;
      
    const masterPrompt = `[INST]${promptText}[/INST]`;

    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      messages: [{ role: "user", content: masterPrompt }],
      parameters: { max_new_tokens: 200, temperature: 1.0, repetition_penalty: 1.2 }
    });
    
    const rawResult = response.choices[0].message.content;
    const jsonMatch = rawResult.match(/\[\s*".*?"\s*(,\s*".*?"\s*)*\]/s);
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