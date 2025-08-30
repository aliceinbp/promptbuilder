import { HfInference } from "@huggingface/inference";

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
    const userInput = JSON.parse(event.body);
    const lang = userInput.lang || 'en';

    const prompts = {
      hu: `[INST]Te egy profi, kreatív szerepjátékos mesélősegéd vagy. Feladatod egy strukturált kalandvázlat generálása. A kimenet KIZÁRÓLAG magyar nyelven készüljön, TISZTA markdown formátumban. Ne adj hozzá semmilyen bevezető vagy záró szöveget, csak a vázlatot.

**Pitch:** (2-3 mondatos, izgalmas összefoglaló.)
**Kiinduló Helyzet és Tét:** (Mi történik? Mi forog kockán?)
**Kampó (3 opció):**
- *Harcosoknak:* (Akció-orientált bevezetés.)
- *Nyomozóknak:* (Rejtély-központú bevezetés.)
- *Társasági karaktereknek:* (Szociális interakcióra épülő bevezetés.)
**A Fordulat:** (Egy meglepő felfedezés.)
**Főbb Helyszínek (3):**
1. **Helyszín neve:** (Leírás, interakciós lehetőség.)
2. **Helyszín neve:** (Leírás)
3. **Helyszín neve:** (Leírás)
**Főbb NJK-k (3):**
1. **Név:** (Célja, Módszere, Jellegzetes vonása/mondata.)
2. **Név:** (Célja, Módszere, Jellegzetes vonása/mondata.)
3. **Név:** (Célja, Módszere, Jellegzetes vonása/mondata.)
**Lehetséges Jelenetek (5):**
- (1. jelenet: Bevezetés)
- (2. jelenet: Nyomozás/utazás)
- (3. jelenet: Társasági találkozó)
- (4. jelenet: Bonyodalom)
- (5. jelenet: Csúcspont)
**Jutalmak:** (Narratív és tárgyi jutalmak.)

A FELHASZNÁLÓ KÉRÉSE:
- **Játékrendszer/Világ:** ${userInput.world || "általános high fantasy"}
- **Hangulat & Stílus:** ${userInput.mood || "hősies kaland"}
- **Kulcsszavak:** ${userInput.keywords || "egy elveszett ereklye"}
- **Játékosok:** ${userInput.party || "3-5 tapasztalt játékos"}
- **Hossz:** ${userInput.length || "egyestés kaland"}
- **Tartalmi Határok:** ${userInput.boundaries || "nincs megadva"}
- **Kötöttségek:** ${userInput.constraints || "nincs megadva"}
- **Névkonvenció:** ${userInput.names || "világ-hű"}
[/INST]`,
      en: `[INST]You are an expert, creative RPG game master assistant. Your task is to generate a structured adventure outline. The output MUST be in English. The output format MUST be clean markdown. Do not add any introductory or concluding text, only the outline.

**Pitch:** (A 2-3 sentence, exciting summary.)
**Starting Situation & Stakes:** (What is happening? What is at stake?)
**Hooks (3 options):**
- *For Warriors/Action-seekers:* (A direct, action-oriented intro.)
- *For Investigators/Intrigue-lovers:* (A mystery-focused intro.)
- *For Social/Charismatic Characters:* (A social interaction-based intro.)
**The Twist:** (A surprising revelation.)
**Key Locations (3):**
1. **Location Name:** (Atmospheric description, 1-2 interaction ideas.)
2. **Location Name:** (Description)
3. **Location Name:** (Description)
**Key NPCs (3):**
1. **Name:** (Goal, Method, Quirk/Quote.)
2. **Name:** (Goal, Method, Quirk/Quote.)
3. **Name:** (Goal, Method, Quirk/Quote.)
**Potential Scenes (5):**
- (Scene 1: The introduction)
- (Scene 2: Investigation/travel)
- (Scene 3: A social encounter)
- (Scene 4: The complication)
- (Scene 5: The climax)
**Rewards:** (List both narrative and material rewards.)

USER'S REQUEST:
- **System/World:** ${userInput.world || "generic high fantasy"}
- **Mood & Style:** ${userInput.mood || "heroic adventure"}
- **Keywords:** ${userInput.keywords || "a missing artifact"}
- **Party:** ${userInput.party || "3-5 experienced players"}
- **Length:** ${userInput.length || "one-shot"}
- **Content Boundaries:** ${userInput.boundaries || "none specified"}
- **Constraints:** ${userInput.constraints || "none specified"}
- **Naming Convention:** ${userInput.names || "world-appropriate"}
[/INST]`
    };
    
    const masterPrompt = prompts[lang];

    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      messages: [{ role: "user", content: masterPrompt }],
      parameters: { max_new_tokens: 1200, temperature: 0.8, repetition_penalty: 1.1 }
    });

    const result = response.choices[0].message.content || "The AI did not provide a meaningful response.";

    return {
      statusCode: 200,
      body: JSON.stringify({ result: result })
    };

  } catch (error) {
    console.error("DM Master error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error during adventure generation.", details: error.message })
    };
  }
};