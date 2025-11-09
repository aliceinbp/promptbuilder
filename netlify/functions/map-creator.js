// D:\promptbuilder\netlify\functions\map-creator.js (JAVÍTOTT NYELVI KEZELÉSSEL)

const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const { keywords, lang } = JSON.parse(event.body);

        if (!keywords) {
            throw new Error("A 'keywords' mező hiányzik.");
        }

        // JAVÍTOTT MESTERPROMPT: Külön utasítás a fordításra
        const masterPrompt = `
You are an expert fantasy cartographer and world-building assistant for tabletop RPGs. Your task is to generate two distinct pieces of content based on the user's keywords: a detailed, NightCafe-compatible prompt for generating a map, and a list of key locations for that map.

**CRITICAL RULES:**
1.  **Response Format:** Your entire output MUST be a single, valid JSON object. Do not include any text, explanations, or markdown backticks before or after the JSON object.
2.  **Language:** The **Key Locations** must be in the language specified by the user ('hu' for Hungarian, 'en' for English). The **Image Prompt** must ALWAYS be in English.

**INTERNAL STEP (VERY IMPORTANT):**
If the user's Response Language is 'hu', you MUST first mentally translate the user's Hungarian keywords into natural, evocative English keywords. Use this English translation to build the 100% English image prompt.

**Task 1: Generate the Image Prompt (ALWAYS IN ENGLISH)**
Create a detailed, NightCafe-compatible prompt. Follow this structure precisely:
- **Main subject:** "top-down fantasy map of [the English version of user's keywords]"
- **Secondary subject:** Add 2-3 descriptive English elements fitting the keywords (e.g., "winding rivers, ancient ruins, dense forests").
- **Artist names / style prompts:** Use stylistic keywords like "in the style of a Tolkien-esque map, vintage cartography, simple line art, hand-drawn".
- **Photography / artistic prompts:** Add technical keywords like "highly detailed, intricate, epic scale, masterpiece".
- **Colors:** Specify "black and white" or "sepia tones" to ensure a map-like quality.

**Task 2: Generate Key Locations (in the user's specified language)**
Create a list of 3-5 key locations that would logically appear on a map based on the user's keywords. For each location, provide a one-sentence evocative description.

**USER'S REQUEST:**
- Keywords: "${keywords}"
- Response Language: ${lang}

**FINAL JSON OUTPUT STRUCTURE EXAMPLE:**
{
  "prompt": "top-down fantasy map of an abandoned treasure map of a swampy region, winding marshy rivers, ancient ruins, dangerous marshlands, in the style of a Tolkien-esque map, vintage cartography, simple line art, hand-drawn, highly detailed, intricate, epic scale, masterpiece, sepia tones",
  "locations": [
    "**The Sunken Crypt:** An ancient tomb half-swallowed by the marsh, rumored to hold the treasure.",
    "**Whisperwood:** A section of dead trees where strange voices are heard on the wind.",
    "**The Serpent's Path:** A treacherous, winding waterway that is the only safe passage through the bog.",
    "**Old Man Willow's Rest:** A massive, ancient willow tree that serves as a landmark and a place of strange power."
  ]
}
`;
        
        const result = await model.generateContent(masterPrompt);
        const response = await result.response;
        let textResult = response.text();
        
        const jsonMatch = textResult.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI did not return a valid JSON object.");
        }
        const parsedResult = JSON.parse(jsonMatch[0]);

        return {
            statusCode: 200,
            body: JSON.stringify(parsedResult)
        };

    } catch (error) {
        console.error("Map Creator (Gemini) hiba:", error);

        if (error.message.includes('503') || error.message.toLowerCase().includes('overloaded')) {
            return {
                statusCode: 503,
                body: JSON.stringify({ error: "Az AI modell jelenleg túlterhelt.", details: "Service Unavailable" })
            };
        }

        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Hiba történt a térkép adatok generálása során.", details: error.message })
        };
    }
};