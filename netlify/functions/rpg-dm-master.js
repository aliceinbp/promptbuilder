import { HfInference } from "@huggingface/inference";

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);
    const userInput = JSON.parse(event.body);

    const masterPrompt = `
[INST]
Te egy profi, kreatív szerepjátékos mesélősegéd vagy. Feladatod egy strukturált kalandvázlat generálása a felhasználó kérései alapján.
Szigorúan tartsd be a felhasználó által megadott kereteket. Ha egy mező üres vagy "véletlenszerű", találj ki egy kreatív, de odaillő elemet.
A kimenet KIZÁRÓLAG magyar nyelven készüljön, a megadott névkonvencióval.
A kimenet formátuma TISZTA markdown legyen, a sablonban látható címsorokkal, listajelekkel és félkövér kiemelésekkel. Ne adj hozzá semmilyen bevezető vagy záró szöveget, csak a vázlatot.

**Pitch:** (2-3 mondatos, izgalmas összefoglaló a kalandról.)
**Kiinduló Helyzet és Tét:** (Mi történik? Mi forog kockán?)
**Kampó (3 opció):**
- *Harcosoknak/Akcióra vágyóknak:* (Egy direkt, akció-orientált bevezetés.)
- *Nyomozóknak/Intrikára vágyóknak:* (Egy rejtély-központú bevezetés.)
- *Társasági/Beszélgetős karaktereknek:* (Egy szociális interakcióra épülő bevezetés.)
**A Fordulat:** (Egy meglepő felfedezés vagy rejtett igazság.)
**Főbb Helyszínek (3):**
1.  **Helyszín neve:** (Hangulatos leírás, 1-2 interakciós lehetőség.)
2.  **Helyszín neve:** (Leírás)
3.  **Helyszín neve:** (Leírás)
**Főbb NJK-k (3):**
1.  **Név:** (Célja, Módszere, Jellegzetes vonása/mondata.)
2.  **Név:** (Célja, Módszere, Jellegzetes vonása/mondata.)
3.  **Név:** (Célja, Módszere, Jellegzetes vonása/mondata.)
**Lehetséges Jelenetek (5):**
- (1. jelenet: A bevezetés)
- (2. jelenet: A nyomozás vagy utazás)
- (3. jelenet: Egy társasági találkozó)
- (4. jelenet: A bonyodalom vagy a feszültség fokozódása)
- (5. jelenet: A csúcspont)
**Jutalmak:** (Sorold fel a narratív és tárgyi jutalmakat is.)

A FELHASZNÁLÓ KÉRÉSE:
- **Játékrendszer/Világ:** ${userInput.world || "általános high fantasy"}
- **Hangulat & Stílus:** ${userInput.mood || "hősies kaland"}
- **Kulcsszavak:** ${userInput.keywords || "egy elveszett ereklye"}
- **Játékosok:** ${userInput.party || "3-5 tapasztalt játékos"}
- **Hossz:** ${userInput.length || "egyestés kaland"}
- **Tartalmi Határok:** ${userInput.boundaries || "nincs megadva"}
- **Kötöttségek:** ${userInput.constraints || "nincs megadva"}
- **Fókusz:** ${userInput.focus || "kiegyensúlyozott"}
- **Névkonvenció:** ${userInput.names || "világ-hű"}
[/INST]
`;

    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      messages: [{ role: "user", content: masterPrompt }],
      parameters: {
        max_new_tokens: 1200, // Több helyet adunk a hosszabb válasznak
        temperature: 0.8,
        repetition_penalty: 1.1
      }
    });

    const result = response.choices[0].message.content || "Az AI nem adott érdemi választ.";

    return {
      statusCode: 200,
      body: JSON.stringify({ result: result })
    };

  } catch (error) {
    console.error("DM Master hiba:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Hiba történt a kaland generálása során.", details: error.message })
    };
  }
};