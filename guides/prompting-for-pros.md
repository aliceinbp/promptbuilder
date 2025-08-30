# A Profi Promptolás Kézikönyve: Útmutató a Nagy Nyelvi Modellekhez

Szia! Ez az útmutató abban segít, hogy a Script Acid oldalán tanultakat egy új szinten alkalmazd, amikor olyan fejlett, párbeszéd-alapú mesterséges intelligenciákkal dolgozol, mint a Gemini, a ChatGPT-4 vagy a Claude.

## A Legnagyobb Különbség: Italautomata vs. Személyi Asszisztens

A képgenerátorok (mint a Midjourney vagy a Stable Diffusion) promptjai gyakran olyanok, mint egy **italautomata**: bedobálod a kulcsszavakat (`kiberpunk`, `nő`, `eső`, `neon`), és reméled, hogy a megfelelő termék esik ki.

A nagy nyelvi modellek (LLM-ek) ezzel szemben olyanok, mint egy **kreatív személyi asszisztens**: nem parancsokat, hanem feladatleírásokat és kontextust várnak. Nem elég odavetni neki a kulcsszavakat; beszélgetned kell vele.

## A Sikeres Promptolás 5 Alapelve

### 1. Adj Szerepet és Kontextust!
Mondd meg az AI-nak, hogy kinek a bőrébe bújjon. Ez segít neki a megfelelő stílus és tudásbázis kiválasztásában.

* **Rossz:** `írj egy kalandötletet`
* **Jó:** `Viselkedj úgy, mint egy tapasztalt, sötét fantasy regényíró és D&D mesélő. Az a feladatod, hogy adj nekem egy egyedi kalandötletet...`

### 2. Használj Struktúrát!
A felsorolások, címsorok és a markdown formázás segít az AI-nak logikusan és átláthatóan strukturálni a válaszát. Pontosan úgy add meg neki a kért formátumot, ahogy a Script Acid RPG Segédlete is teszi.

* **Rossz:** `kell egy város, pár NJK meg egy küldetés`
* **Jó:** `Kérlek, add meg a választ a következő markdown formátumban:
    ### Város neve
    **Leírás:** (Rövid leírás)
    **Kulcsfontosságú NJK-k:**
    - NJK 1: (Leírás)
    - NJK 2: (Leírás)`

### 3. Mutass, ne csak mondd! (Adj Példát!)
Ha egy nagyon specifikus stílust vagy formátumot szeretnél, a legjobb, ha adsz neki egy rövid példát.

* **Példa:** `Szeretnék karakterkoncepciókat kapni. Olyanokat, mint ez: "Korgan, a kiégett törp zsoldos, aki a harci csákányába vésett rúnákban keresi elvesztett szerelmének emlékét." Kérlek, ebben a stílusban adj még hármat.`

### 4. Finomíts és Folytasd a Beszélgetést!
Az első válasz ritkán tökéletes. Tekints rá vázlatként! Folytasd a beszélgetést, és kérj finomításokat.

* **Példák a folytatásra:**
    * `Ez tetszik! Most kérlek, a második NJK-t tedd sokkal gyanakvóbbá, és adj neki egy titkot.`
    * `A kalandötlet jó, de tegyük a hangulatát komorabbá és lovecrafti horror elemekkel tűzdeltté.`
    * `Generálj 5 magyaros hangzású nevet a fent leírt kikötővárosnak.`

### 5. Határozz meg Korlátokat!
Mondd el az AI-nak, hogy mit **NE** csináljon. Ez legalább annyira fontos, mint az, hogy mit csináljon.

* **Példák:**
    * `A karakter előtörténete ne tartalmazzon családi tragédiát.`
    * `Kerüld a fantasy kliséket, mint az "árva fiú, aki megmenti a világot".`
    * `A leírás legyen maximum 200 szó.`

Ezekkel az elvekkel nem csak parancsokat adsz, hanem egy kreatív párbeszédet folytatsz, aminek a végeredménye sokkal közelebb áll majd ahhoz, amit elképzeltél. Sok sikert a kísérletezéshez!