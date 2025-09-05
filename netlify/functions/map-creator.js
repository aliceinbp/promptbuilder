const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const { keywords, lang } = JSON.parse(event.body);

        if (!keywords) {
            throw new Error("A 'keywords' mező hiányzik.");
        }

        // Ez a mesterprompt, ami a két feladatot adja az AI-nak.
        const masterPrompt = `
You are an expert fantasy cartographer and world-building assistant for tabletop RPGs. Your task is to generate two distinct pieces of content based on the user's keywords: a detailed, NightCafe-compatible prompt for generating a map, and a list of key locations for that map.

**CRITICAL RULES:**
1.  **Response Format:** Your entire output MUST be a single, valid JSON object. Do not include any text, explanations, or markdown backticks before or after the JSON object.
2.  **Language:** All generated content (both the prompt and the locations) must be in the language specified by the user ('hu' for Hungarian, 'en' for English).

**Task 1: Generate the Image Prompt**
Create a detailed, NightCafe-compatible prompt. Follow this structure precisely:
- **Main subject:** "top-down fantasy map of [user's keywords]"
- **Secondary subject:** Add 2-3 descriptive elements fitting the keywords (e.g., "winding rivers, ancient ruins, dense forests").
- **Artist names / style prompts:** Use stylistic keywords like "in the style of a Tolkien-esque map, vintage cartography, simple line art, hand-drawn".
- **Photography / artistic prompts:** Add technical keywords like "highly detailed, intricate, epic scale, masterpiece".
- **Colors:** Specify "black and white" or "sepia tones" to ensure a map-like quality.

**Task 2: Generate Key Locations**
Create a list of 3-5 key locations that would logically appear on a map based on the user's keywords. For each location, provide a one-sentence evocative description.

**USER'S REQUEST:**
- Keywords: "${keywords}"
- Response Language: ${lang}

**FINAL JSON OUTPUT STRUCTURE EXAMPLE:**
{
  "prompt": "top-down fantasy map of an abandoned dwarf mine near a volcano, overflowing lava rivers, crumbling stone bridges, in the style of a Tolkien-esque map, vintage cartography, simple line art, hand-drawn, highly detailed, intricate, epic scale, masterpiece, sepia tones",
  "locations": [
    "**The Molten Heart:** A vast cavern where the main forge was once powered by the volcano's heat.",
    "**Whispering Tunnels:** A maze of secondary shafts known for strange echoes and unsettling drafts.",
    "**King's Overlook:** A collapsed balcony that once offered a view of the entire mining operation.",
    "**The Obsidian Gate:** The main, heavily fortified entrance to the mine, now shattered and blocked."
  ]
}
`;
        
        const result = await model.generateContent(masterPrompt);
        const response = await result.response;
        let textResult = response.text();
        
        // Biztonsági ellenőrzés és tisztítás, hogy biztosan JSON legyen
        const jsonMatch = textResult.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("AI did not return a valid JSON object.");
        }
        const parsedResult = JSON.parse(jsonMatch[0]);

        return {
            statusCode: 200,
            body: JSON.stringify(parsedResult) // Közvetlenül a parse-olt objektumot küldjük vissza
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