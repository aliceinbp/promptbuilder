import React, { useMemo, useState } from "react";
import myLogo from './assets/myLogo.jpg';

// ⚙️ Téma – itt tudsz mindent átírni VS Code-ban
const THEME = {
  bg: "#0a0a0a",           // teljes háttér (fekete)
  text: "#d8b4fe",         // halványlila szöveg
  card: "#141018",         // kártyák háttere (nagyon sötét lila-fekete)
  border: "#5b21b6",       // halványlila keret
  accent: "#a855f7",       // gombok, kiemelések
  accentSoft: "#c084fc",   // hover/fénylés
};

export default function PromptBuilderDark() {
  // 🔽 Legördülő listák (TELJES, a kéréseid szerint)
  const styleOptions = [
    "Jean-Michel Basquiat + Cy Twombly, textúra és expresszív absztrakció",
    "Albert Bierstadt + Bob Ross, fenséges tájképek, buja részletekkel",
    "Hayao Miyazaki + Makoto Shinkai, vibráló, érzelmes anime látványvilág",
    "Alex Grey + visionary art, spirituális és transzcendens vizuális metaforák",
    "Greg Rutkowski + Alphonse Mucha, fantasy illusztráció, szecessziós stílusban",
    "Gustav Klimt + Egon Schiele, arany, minták és nyers emberi érzelmek",
    "Banksy + Jean-Michel Basquiat, street art, társadalmi kommentárral",
    "Frida Kahlo + fantasy art, szürreális önarcképek, fantasztikus elemekkel",
    "Rembrandt + Caravaggio, sötét, drámai portrék mesteri fény-árnyékkal",
    "René Magritte + M.C. Escher, gondolatébresztő, paradox valóság",
    "Gregory Crewdson + Boris Vallejo, mozihatású világítás, fantasy realizmus",
    "Boris Vallejo + Zdzisław Beksiński, hiperrealista sötét fantasy",
    "Malcolm Liepke + Phil Hale, expresszív ecsetkezelés, lefolyó melankólia",
    "Caravaggio + Annie Leibovitz, drámai portré",
    "Frank Frazetta + Gustave Doré, epikus fantasy illusztráció",
    "Salvador Dalí + Hieronymus Bosch, álomszerű szürrealizmus",
    "H.R. Giger + Francis Bacon, biomechanikus pszichológiai horror",
    "Edward Hopper + Film Noir esztétika, esőáztatta városi melankólia",
    "Brom + Zdzisław Beksiński, sötét fantasy, baljós karakterábrázolás",
    "Frank Frazetta + Greg Rutkowski, klasszikus fantasy hősök és illusztrációk",
    "Moebius (Jean Giraud) + Syd Mead, futurisztikus sci-fi karakterek és világok",
    "Akira Toriyama + Yoshitaka Amano, anime-stílusú hősök, fantáziaelemekkel",
    "Yoji Shinkawa + H.R. Giger, biomechanikus, poszt-apokaliptikus karakterek",
    "J.C. Leyendecker + Norman Rockwell, klasszikus, ikonikus kalandorok",
    "Tsutomu Nihei + sci-fi noir, sötét, részletgazdag cyberpunk és disztópikus karakterek",
    "Kentaro Miura + fantasy art, részletgazdag, epikus és brutális karakterek",
    "Alphonse Mucha + Art Nouveau aesthetic, elegáns, mágikus, art nouveau stílusú karakterek",
    "Loish + whimsical art, színes, stilizált és bájos fantasy karakterek",
    "Caspar David Friedrich + Disney concept art, olajfestmény, varázslatos, holdfényes erdő.",
    "Syd Mead + Jean-Michel Basquiat, digitális művészet, neon-futurisztikus, graffitis város.",
    "Edward Hopper + Ansel Adams, valósághű ábrázolás, eső áztatta vasútállomás.",
    "Makoto Shinkai + Hayao Miyazaki, anime stílusú, csendes mezőn futó vonat.",
    "Albert Bierstadt + Frank Frazetta, olajfestmény, ködös hegyi tó rejtett kristályokkal.",
    "Andrew Wyeth + J.M.W. Turner, akvarell, csendes, ködös tengerpart.",
    "Jack Kirby + Frank Miller, képregény stílusú, monumentális futurisztikus város.",
    "Moebius (Jean Giraud) + Studio Ghibli art, digitális művészet, lebegő sziget hatalmas fákkal.",
    "Edward Weston + Michael Kenna, fotórealista, fekete-fehér, elhagyatott móló.",
    "Claude Monet + Vincent van Gogh, impresszionista, napfelkelte a mező felett."
  ];

  const subjectOptions = [
    "a fierce woman with flowing blonde hair, barefoot, holding a worn sword, flanked by two wolves",
    "lonely detective in trench coat, cigarette, hat brim shadow",
    "sensual figure half-draped, introspective gaze",
    "armored barbarian hero raising a blade",
    "vampire noble with ornate chalice",
    "surreal figure with floating objects orbiting the head",
    "forest nymph crowned with branches",
    "android priest with cables and icons",
    "cyberpunk dragon descending on a neon-lit city skyscraper",
    "an ancient library filled with floating, glowing scrolls",
    "a futuristic, elegant astronaut in a gilded helmet",
    "steampunk robot walking through a field of flowers",
    "a mystical forest with glowing mushrooms and fairy dust",
    "a talking cat sipping steaming tea in front of a rain-soaked window",
    "an underwater kingdom filled with bioluminescence",
    "an ice dragon enthroned on a crystal mountain with the northern lights in the background",
    "a medieval market full of adventurers and strange creatures",
    "a holy sword floating over a volcanic lake",
    "a time traveler standing among the ruins of a lost civilization",
    "a giant, floating whale on which a small village travels in the sky",
    "a gothic castle at night with a huge blood moon in the background",
    "a wizard conjuring an illusion from a book",
    "an astronaut floating on the surface of a desolate planet, with a misty galaxy",
    "a detailed, abandoned city reclaimed by nature",
    "an armored samurai fighting under a cherry tree",
    "a village built in the clouds, connected by bridges",
    "a ghost ship sailing on dark, stormy waters",
    "a tree whose roots lead to another dimension"
  ];

  const settingOptions = [
    "a magical library with floating books and glowing runes",
    "a sun-drenched, overgrown ruin with ancient statues",
    "a bioluminescent cave filled with glowing fungi",
    "a snow-covered mountain peak with a hidden monastery",
    "an ornate, grand ballroom from a forgotten era, covered in dust",
    "a futuristic cityscape with flying vehicles and holographic advertisements",
    "a desert landscape with massive, petrified creatures",
    "a deep-sea trench with luminescent, bizarre marine life",
    "a quiet, moonlit garden with sculpted hedges",
    "an ancient temple carved into a giant tree",
    "a futuristic space station with large windows overlooking a nebula",
    "a post-apocalyptic junkyard with overgrown vegetation",
    "a vibrant, impossible jungle with floating islands",
    "a surreal clock tower with melting gears",
    "a grand, ornate throne room with shattered glass and lightbeams",
    "a misty, hidden village in a valley between mountains",
    "a glowing portal opening in a dark, empty field",
    "a vast underground cavern with giant crystals",
    "a chaotic wizard's laboratory with glowing potions and scrolls",
    "a floating celestial garden in a starry sky"
  ];

  const extraOptions = [
    "detailed line work, manga style, dynamic pose",
    "watercolor art, soft pastel palette, ethereal feel",
    "pixel art, retro 8-bit aesthetic, vibrant tones",
    "sketch art, charcoal on paper, rough strokes",
    "pointillism, abstract forms, vivid dots",
    "geometric shapes, abstract cubism, bold colors",
    "stained glass art, intricate patterns, glowing light",
    "photorealistic, cinematic portrait, shallow depth of field",
    "low poly, stylized cartoon, smooth shading",
    "pop art, comic book style, bold lines and half-tones",
    "etching art, cross-hatching, old-world feel",
    "3D render, subsurface scattering, realistic textures",
    "chalk drawing, smudged edges, soft light",
    "woodcut art, high contrast, rustic feel",
    "glitch art, corrupted image effect, digital noise"
  ];

  // Állapotok
  const [style, setStyle] = useState("");
  const [subject, setSubject] = useState("");
  const [setting, setSetting] = useState("");
  const [extra, setExtra] = useState("");
  const finalPrompt = useMemo(
    () => [style, subject, setting, extra].filter(Boolean).join("\n"),
    [style, subject, setting, extra]
  );

  // Segédfüggvények
  const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];
  const shuffleAll = () => {
    setStyle(pickRandom(styleOptions));
    setSubject(pickRandom(subjectOptions));
    setSetting(pickRandom(settingOptions));
    setExtra(pickRandom(extraOptions));
  };
  const clearAll = () => {
    setStyle("");
    setSubject("");
    setSetting("");
    setExtra("");
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(finalPrompt);
    } catch {
      // Fallback Chrome-ban is működik
      const ta = document.createElement("textarea");
      ta.value = finalPrompt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  };

  // UI helper – kártyakomponens
  const Card = ({ label, children }) => (
    <section
      className="rounded-2xl shadow-md p-4 md:p-5 backdrop-blur-sm border"
      style={{ background: THEME.card, borderColor: THEME.border }}
    >
      <h2 className="text-sm font-semibold mb-2 tracking-wide" style={{ color: THEME.text }}>
        {label}
      </h2>
      {children}
    </section>
  );

  // Select (félmagas + dark-lila)
  const Select = ({ value, onChange, options, placeholder }) => (
    <div className="relative">
      <select
        aria-label={placeholder}
        className="appearance-none w-full h-8 text-xs md:text-sm rounded-xl pr-8 pl-3"
        style={{
          background: THEME.bg,
          color: THEME.text,
          border: `1px solid ${THEME.border}`,
        }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div
        className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs"
        style={{ color: THEME.accentSoft }}
      >
        ▾
      </div>
    </div>
  );

  const Button = ({ children, onClick, variant = "ghost" }) => (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-xl text-xs md:text-sm transition"
      style={{
        color: THEME.text,
        background: variant === "solid" ? THEME.accent : THEME.bg,
        border: `1px solid ${THEME.border}`,
        boxShadow: variant === "solid" ? `0 0 0 1px ${THEME.border}` : "none",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${THEME.accentSoft}`)}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = variant === "solid" ? `0 0 0 1px ${THEME.border}` : "none")}
    >
      {children}
    </button>
  );

  return (
    <div
      className="min-h-screen w-full"
      style={{ color: THEME.text, background: THEME.bg }}
    >
      {/* Felső lila derengés a csajos-dark hangulathoz */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 opacity-50"
        style={{
          background:
            "radial-gradient(800px 400px at 50% -10%, rgba(168,85,247,0.12), transparent), radial-gradient(600px 300px at 100% 10%, rgba(192,132,252,0.10), transparent)",
        }}
      />

<header
  className="w-full border-b"
  style={{ borderColor: THEME.border }}
>
  <div className="mx-auto max-w-5xl px-6 py-6 text-center">
    <div
      className="mx-auto w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center mb-3"
      style={{ border: `2px solid ${THEME.border}` }}
    >
      <img src={myLogo} alt="Alice in BP logó" className="w-full h-full object-cover" />
    </div>
    <h1 className="text-xl md:text-2xl font-semibold tracking-widest"> ★ Prompt Builder ★ </h1>
    <p className="text-xs md:text-sm mt-1 opacity-90">Prompt generator for AI images</p>
  </div>
</header>

      <main className="mx-auto max-w-5xl px-6 py-8 md:py-12">
        {/* Fő keret */}
        <div
          className="rounded-3xl p-5 md:p-8 space-y-6 md:space-y-8"
          style={{ border: `1px solid ${THEME.border}`, background: THEME.card }}
        >
          {/* Vezérlők felül */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 justify-between">
            <div className="flex gap-2 md:gap-3">
              <Button onClick={shuffleAll} variant="solid">Shuffle All</Button>
              <Button onClick={clearAll}>Clear</Button>
              <Button onClick={() => copy()}>Copy</Button>
            </div>
            <div className="text-xs opacity-80">Chrome-kompatibilis • reszponzív</div>
          </div>

          {/* Kártyák – nagyobb távok, kisebb selectek */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <Card label="🎨 Style">
              <Select
                value={style}
                onChange={setStyle}
                options={styleOptions}
                placeholder="Válassz stílust…"
              />
              <div className="flex gap-2">
                <Button onClick={() => setStyle(pickRandom(styleOptions))}>Random</Button>
              </div>
            </Card>

            <Card label="👤 Subject">
              <Select
                value={subject}
                onChange={setSubject}
                options={subjectOptions}
                placeholder="Válassz témát…"
              />
              <div className="flex gap-2">
                <Button onClick={() => setSubject(pickRandom(subjectOptions))}>Random</Button>
              </div>
            </Card>

            <Card label="🏞 Setting">
              <Select
                value={setting}
                onChange={setSetting}
                options={settingOptions}
                placeholder="Válassz helyszínt…"
              />
              <div className="flex gap-2">
                <Button onClick={() => setSetting(pickRandom(settingOptions))}>Random</Button>
              </div>
            </Card>

            <Card label="✨ Extra">
              <Select
                value={extra}
                onChange={setExtra}
                options={extraOptions}
                placeholder="Válassz extrát…"
              />
              <div className="flex gap-2">
                <Button onClick={() => setExtra(pickRandom(extraOptions))}>Random</Button>
              </div>
            </Card>
          </div>

          {/* Eredmény doboz – egy darab, nagy, fekete */}
          <Card label="🖋 Végső Prompt">
            <textarea
              readOnly
              className="w-full rounded-2xl p-3 md:p-4 font-mono text-xs md:text-sm min-h-[140px]"
              style={{ background: THEME.bg, color: THEME.text, border: `1px solid ${THEME.border}` }}
              value={finalPrompt}
            />
            <div className="flex gap-2">
              <Button onClick={() => copy()} variant="solid">Másolás</Button>
            </div>
          </Card>
        </div>
      </main>

      <footer className="py-8 text-center text-xs opacity-70">♥ csajos-dark vibe – minden szín a THEME-ben állítható</footer>
    </div>
  );
}
