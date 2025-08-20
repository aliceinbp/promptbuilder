// A DeepL API csomag importálása
const deepl = require('deepl-node');

// A funkció "kezelője", ez fog lefutni minden kérésre
exports.handler = async function(event, context) {
  // API kulcs beolvasása a biztonságos környezeti változókból
  const authKey = process.env.DEEPL_API_KEY;
  const translator = new deepl.Translator(authKey);

  try {
    // A weboldalról küldött szöveg kinyerése
    const { text, target_lang } = JSON.parse(event.body);

    if (!text) {
      throw new Error("A 'text' mező hiányzik.");
    }

    // Fordítás végrehajtása
    const result = await translator.translateText(text, null, target_lang || 'EN-US');

    // Sikeres válasz visszaküldése a weboldalnak
    return {
      statusCode: 200,
      body: JSON.stringify({ translatedText: result.text })
    };

  } catch (error) {
    console.error("Fordítási hiba:", error);
    // Hiba esetén részletes hibaüzenet küldése
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Hiba történt a fordítás során.", details: error.message })
    };
  }
};