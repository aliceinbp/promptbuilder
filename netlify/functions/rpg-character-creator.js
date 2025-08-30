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
Te egy profi, kreatív szerepjátékos karakteralkotó segéd vagy. Feladatod egy strukturált, mechanika-semleges karakterkoncepció generálása a felhasználó kérései alapján.
Szigorúan tartsd be a felhasználó által megadott kereteket. Ha egy mező üres, találj ki egy kreatív, de odaillő elemet.
A kimenet KIZÁRÓLAG magyar nyelven készüljön, a megadott névkonvencióval.
A kimenet formátuma TISZTA markdown legyen, a sablonban látható címsorokkal, listajelekkel és félkövér kiemelésekkel. Ne adj hozzá semmilyen bevezető vagy záró szöveget, csak a karakter leírását.

### Név és Koncepció
**Név:** (A karakter neve a kért konvenció szerint.)
**Koncepció:** (Egyetlen, ütős mondat, ami összefoglalja a karaktert.)

### Külső Leírás
(2-3 mondatos leírás a megjelenésről, öltözetről, testbeszédről és jellegzetes vonásokról.)

### Belső Jellemzők
- **Motiváció:** (Mi hajtja előre?)
- **Értékek:** (Mi a legfontosabb számára?)
- **Félelmek:** (Mitől retteg a legjobban?)
- **Hiba/Erősség:** (Egy fő jellemhiba és egy fő erősség.)

### Előtörténet (Fordulópontok)
(5-7 pontból álló vázlat a múltjáról, ami a jelenlegi helyzetéhez vezetett. Pl. mentor, trauma, eskü, első siker, nagy veszteség.)

### Kapcsolódás a Világhoz (3 kampó a mesélőnek)
- (Egy titok a múltjából.)
- (Egy befejezetlen ügy vagy adósság.)
- (Egy személyes cél vagy küldetés.)

### Jellegzetes Tárgy
(Egy tárgy, ami fontos a számára és sokat elárul róla.)

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
[/INST]
`;

    const response = await hf.chatCompletion({
      model: 'mistralai/Mistral-7B-Instruct-v0.3',
      messages: [{ role: "user", content: masterPrompt }],
      parameters: {
        max_new_tokens: 1000,
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
    console.error("Karakteralkotó hiba:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Hiba történt a karakter generálása során.", details: error.message })
    };
  }
};