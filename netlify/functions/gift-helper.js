// D:\promptbuilder\netlify\functions\gift-helper.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const userInput = JSON.parse(event.body);
        const lang = userInput.lang || 'en';

        // Ez a mesterprompt, amit az 1. lépésben terveztünk.
        const masterPrompt = `
You are a thoughtful and creative gift-giving expert. Your task is to generate 5 unique, yet practical and feasible gift ideas based on the user's input.

CRITICAL RULES:
1.  **Practicality:** Avoid unrealistic or impossible ideas (e.g., "a trip to the moon"). Suggestions should be real products or accessible services.
2.  **Personalization:** Closely tailor each suggestion to the provided interests, age, and occasion.
3.  **Justification:** For each idea, provide a brief (1-2 sentence) explanation of WHY it's a good fit.
4.  **Format:** Your response MUST BE a numbered list (1., 2., 3., ...). Each list item must follow the format: "**[Gift Name]:** [Brief justification]".
5.  **Language:** The response language must strictly be the one specified by the user ('hu' for Hungarian, 'en' for English).
6.  **Purity:** Do not add any introductory or concluding text. Only provide the numbered list.

USER'S DATA:
- Recipient: ${userInput.recipient}
- Occasion: ${userInput.occasion}
- Age Group: ${userInput.age}
- Interests: ${userInput.interests}
- Price Range: ${userInput.price}
- Gift Style: ${userInput.style}
- Response Language: ${lang}
`;
        
        const result = await model.generateContent(masterPrompt);
        const response = await result.response;
        const rawResult = response.text();

        // Feldolgozzuk a szöveges választ, hogy egy tiszta tömböt kapjunk vissza
        const ideas = rawResult.split('\n') // Sorokra bontjuk
                           .map(line => line.replace(/^\d+\.\s*/, '').trim()) // Eltávolítjuk a sorszámozást (pl. "1. ")
                           .filter(line => line.length > 0); // Kiszűrjük az üres sorokat

        return {
            statusCode: 200,
            body: JSON.stringify({ ideas: ideas })
        };

    } catch (error) {
        console.error("Gift Helper (Gemini) hiba:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Hiba történt az ajándékötletek generálása során.", details: error.message })
        };
    }
};