// D:\promptbuilder\netlify\functions\rpg-character-creator.js (Névgenerálás javítva)

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

    // JAVÍTÁS: A Név generálására vonatkozó utasítás pontosítva lett.
    const prompts = {
      hu: `Te egy profi, kreatív szerepjátékos karakteralkotó segéd vagy. A feladatod egy strukturált, mechanika-semleges karakterkoncepció generálása a felhasználó által megadott adatok alapján.

**KRITIKUS SZABÁLYOK:**
1.  **Maradj a kontextusban:** A karakter illeszkedjen a megadott világba és stílusba. Legyen egyedi, de logikus és játszható. Kerüld az önellentmondásokat és a túlzottan absztrakt, megfoghatatlan elemeket.
2.  **Tartsd be a felhasználó kéréseit:** Szigorúan vedd figyelembe az összes megadott kulcsszót, korlátot és egyéb adatot.
3.  **Formátum:** A válaszod KIZÁRÓLAG tiszta markdown legyen az alábbi sablon szerint. Ne adj hozzá semmilyen bevezető vagy záró szöveget, csak a karakter leírását.
4.  **Nyelv:** A kimenet nyelve KIZÁRÓLAG magyar legyen.

**A KÉRT STRUKTÚRA:**
### Név és Koncepció
**Név:** (Generálj egy teljesen egyedi nevet, ami hangzásában illik a karakter fajához/származásához, de nem létező szavakból áll. Kerüld a kliséket és az egyszerű szó-összetételeket, pl. ne legyen 'Árnyék-futó'.)
**Koncepció:** (Egyetlen, ütős mondat, ami összefoglalja a karaktert.)
### Külső Leírás
(2-3 mondatos leírás a megjelenésről, öltözetről, testbeszédről.)
### Belső Jellemzők
- **Motiváció:** (Mi hajtja előre?)
- **Értékek:** (Mi a legfontosabb számára?)
- **Félelmek:** (Mitől retteg a legjobban?)
- **Hiba/Erősség:** (Egy fő jellemhiba és egy fő erősség.)
### Előtörténet (Fordulópontok)
(5-7 pontból álló vázlat a múltjáról.)
### Kapcsolódás a Világhoz (3 kampó a mesélőnek)
- (Egy titok a múltjából.)
- (Egy befejezetlen ügy vagy adósság.)
- (Egy személyes cél vagy küldetés.)
### Jellegzetes Tárgy
(Egy tárgy, ami fontos a számára.)
### Jellegzetes Mondatok
- (Egy mondat, amit gyakran használ.)
- (Egy mondat, ami a filozófiáját tükrözi.)

**A FELHASZNÁLÓ KÉRÉSE:**
- **Világ:** ${userInput.world || "általános fantasy"}
- **Faj/Származás:** ${userInput.race || "véletlenszerű"}
- **Kaszt/Hivatás:** ${userInput.class || "kalandor"}
- **Kulcsszavak:** ${userInput.keywords || "rejtélyes múlt"}
- **Erkölcsi irány:** ${userInput.morality || "semleges"}
- **Korcsoport:** ${userInput.age || "érett"}
- **Tartalmi Határok:** ${userInput.boundaries || "nincs megadva"}
- **Névkonvenció:** ${userInput.names || "világ-hű"}`,
      en: `You are an expert, creative RPG character creator assistant. Your task is to generate a structured, mechanics-neutral character concept based on the user's request.

**CRITICAL RULES:**
1.  **Stay in Context:** The character must fit the specified world and style. Be unique, but also logical and playable. Avoid contradictions and overly abstract or intangible elements.
2.  **Adhere to User Input:** Strictly follow all provided keywords, boundaries, and other data.
3.  **Format:** Your response MUST BE clean markdown, using the template below. Do not add any introductory or concluding text, only the character sheet.
4.  **Language:** The output MUST be in English.

**REQUESTED STRUCTURE:**
### Name & Concept
**Name:** (Generate a completely unique name that sonically fits the character's race/origin but is not made of existing words. Avoid clichés and simple compound words, e.g., no 'Shadow-runner'.)
**Concept:** (A single, powerful sentence summarizing the character.)
### Appearance
(A 2-3 sentence description of their appearance, attire, and body language.)
### Personality
- **Motivation:** (What drives them forward?)
- **Values:** (What is most important to them?)
- **Fears:** (What do they fear the most?)
- **Flaw/Strength:** (One major character flaw and one major strength.)
### Backstory (Turning Points)
(A 5-7 point outline of their past.)
### Connection to the World (3 hooks for the GM)
- (A secret from their past.)
- (An unfinished business or a debt.)
- (A personal goal or quest.)
### Signature Item
(An item that is important to them.)
### Signature Phrases
- (A phrase they often use.)
- (A phrase that reflects their philosophy.)

**USER'S REQUEST:**
- **World:** ${userInput.world || "generic fantasy"}
- **Race/Origin:** ${userInput.race || "random"}
- **Class/Profession:** ${userInput.class || "adventurer"}
- **Keywords:** ${userInput.keywords || "mysterious past"}
- **Moral Alignment:** ${userInput.morality || "neutral"}
- **Age Group:** ${userInput.age || "mature"}
- **Content Boundaries:** ${userInput.boundaries || "none specified"}
- **Naming Convention:** ${userInput.names || "world-appropriate"}`
    };
    
    const masterPrompt = prompts[lang];

    const result = await model.generateContent(masterPrompt);
    const response = await result.response;
    const generatedText = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ result: generatedText })
    };

  } catch (error) {
    console.error("Character Creator (Gemini) hiba:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Hiba történt a karakter generálása során.", details: error.message })
    };
  }
};