import { HfInference } from "@huggingface/inference";

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
    const userInput = JSON.parse(event.body);
    const lang = userInput.lang || 'en';

    const prompts = {
      hu: `[INST]Te egy profi, kreatív szerepjátékos karakteralkotó segéd vagy. Feladatod egy strukturált, mechanika-semleges karakterkoncepció generálása a felhasználó kérései alapján. Szigorúan tartsd be a kereteket. A kimenet KIZÁRÓLAG magyar nyelven készüljön. A kimenet formátuma TISZTA markdown legyen, a sablonban látható címsorokkal. Ne adj hozzá semmilyen bevezető vagy záró szöveget, csak a karakter leírását.

### Név és Koncepció
**Név:** (A karakter neve a kért konvenció szerint.)
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

A FELHASZNÁLÓ KÉRÉSE:
- **Világ:** ${userInput.world || "általános fantasy"}
- **Faj/Származás:** ${userInput.race || "véletlenszerű"}
- **Kaszt/Hivatás:** ${userInput.class || "kalandor"}
- **Kulcsszavak:** ${userInput.keywords || "rejtélyes múlt"}
- **Erkölcsi irány:** ${userInput.morality || "semleges"}
- **Korcsoport:** ${userInput.age || "érett"}
- **Tartalmi Határok:** ${userInput.boundaries || "nincs megadva"}
- **Névkonvenció:** ${userInput.names || "világ-hű"}
[/INST]`,
      en: `[INST]You are an expert, creative RPG character creator assistant. Your task is to generate a structured, mechanics-neutral character concept based on the user's request. Strictly adhere to the constraints. The output MUST be in English. The output format MUST be clean markdown, using the headings as shown in the template. Do not add any introductory or concluding text, only the character sheet.

### Name & Concept
**Name:** (The character's name according to the requested convention.)
**Concept:** (A single, powerful sentence summarizing the character.)

### Appearance
(A 2-3 sentence description of their appearance, attire, and body language.)

### Personality
- **Motivation:** (What drives them forward?)
- **Values:** (What is most important to them?)
- **Fears:** (What do they fear the most?)
- **Flaw/Strength:** (One major character flaw and one major strength.)

### Backstory (Turning Points)
(A 5-7 point outline of their past that led them to their current situation.)

### Connection to the World (3 hooks for the GM)
- (A secret from their past.)
- (An unfinished business or a debt.)
- (A personal goal or quest.)

### Signature Item
(An item that is important to them and says a lot about them.)

### Signature Phrases
- (A phrase they often use.)
- (A phrase that reflects their philosophy.)

USER'S REQUEST:
- **World:** ${userInput.world || "generic fantasy"}
- **Race/Origin:** ${userInput.race || "random"}
- **Class/Profession:** ${userInput.class || "adventurer"}
- **Keywords:** ${userInput.keywords || "mysterious past"}
- **Moral Alignment:** ${userInput.morality || "neutral"}
- **Age Group:** ${userInput.age || "mature"}
- **Content Boundaries:** ${userInput.boundaries || "none specified"}
- **Naming Convention:** ${userInput.names || "world-appropriate"}
[/INST]`
    };

    const masterPrompt = prompts[lang];

    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      messages: [{ role: "user", content: masterPrompt }],
      parameters: { max_new_tokens: 1000, temperature: 0.8, repetition_penalty: 1.1 }
    });

    const result = response.choices[0].message.content || "The AI did not provide a meaningful response.";

    return {
      statusCode: 200,
      body: JSON.stringify({ result: result })
    };

  } catch (error) {
    console.error("Character Creator error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error during character generation.", details: error.message })
    };
  }
};