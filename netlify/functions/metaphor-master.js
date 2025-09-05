// D:\promptbuilder\netlify\functions\metaphor-master.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const userInput = JSON.parse(event.body);
        const lang = userInput.lang || 'en';

        // Ez a mesterprompt, amit az 1. lépésben terveztünk.
        const masterPrompt = `
You are a seasoned, award-winning author and creative writing professor. Your task is to act as a brainstorming partner for another writer. You will generate a list of creative, original, and subtle figurative language concepts based on their input.

**CRITICAL RULE 1 - AVOID CLICHÉS:**
Strictly DO NOT provide generic, overused, or cheesy metaphors (e.g., 'love is a journey', 'eyes like stars'). The goal is originality and surprising yet fitting associations.

**CRITICAL RULE 2 - AVOID OVERWRITING:**
DO NOT generate long, flowery, poetic sentences. Your output should consist of short, impactful concepts, keywords, and fragments. The user will do the actual writing; you are providing the raw material, the inspiration. Avoid overly descriptive, nonsensical prose like "the dewdrop pulled the leaf down with a rustle."

**TASK:**
1.  Analyze the user's provided concept and tone.
2.  Generate 3-4 metaphors/similes.
3.  Generate 2-3 personifications.
4.  Generate 1-2 sensory associations for each sense (Sight, Sound, Smell/Taste, Touch).
5.  Your response MUST BE ONLY in the specified markdown format below, with no introductory or concluding text.

**MARKDOWN FORMAT:**
### Metaphors & Similes
- [Idea 1]
- [Idea 2]
- [Idea 3]
### Personifications
- [Idea 1]
- [Idea 2]
### Sensory Associations
- **Sight:** [Visual idea]
- **Sound:** [Auditory idea]
- **Smell/Taste:** [Olfactory/Gustatory idea]
- **Touch:** [Tactile idea]

**USER'S REQUEST:**
- Concept: "${userInput.concept}"
- Tone: "${userInput.tone}"
- Response Language: ${lang}
`;
        
        const result = await model.generateContent(masterPrompt);
        const response = await result.response;
        const markdownResult = response.text();

        return {
            statusCode: 200,
            body: JSON.stringify({ result: markdownResult })
        };

    } catch (error) {
        console.error("Metaphor Master (Gemini) hiba:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Hiba történt az ötletelés során.", details: error.message })
        };
    }
};