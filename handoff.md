# Handoff — Semester Planner V2

Aktualizováno **7. 9. 2026**. Tento soubor slouží jako kontext pro nový chat, který nemá historii předchozí konverzace. Popisuje implementovaný stav, rozhodnutí uživatele a navržené další kroky. Při rozporu ověř skutečný kód a aktuální zadání uživatele.

## 1. Co je projekt a pro koho vznikl

Uživatel Lukas studuje bakalářský program **Lékařská elektronika a bioinformatika na FEL ČVUT**, nástup 2024. Původní tříleté studium si rozkládá na čtyři roky, aby mohl pracovat. Po prvních dvou letech potřebuje naplánovat zbývající povinnosti a opakované předměty do dalších čtyř semestrů.

Potvrzené priority:

- Dokončení ideálně v létě **2028**.
- **Poslední semestr ideálně jen bakalářka a prostor na státnice.**
- Alespoň **20 hodin práce týdně**.
- Primárně osobní aplikace, hlavně na notebooku.
- Spojit skutečnou historii studia s plánováním budoucích semestrů.
- V první iteraci stačí import výsledků z KOSu a přesouvání předmětů s upozorněním. Automatické skládání optimálního plánu není požadované.
- Do budoucna přidávání předmětů podle kódu přes katalog/API a případně účty a synchronizaci.

Uživatel původně žádal analýzu a plán, následně výslovně požadoval fungující, spuštěnou a ověřenou V2. Ta už byla vytvořená. **Nepokračuj dalším přepisem od nuly.** Poslední funkční požadavky (zjednodušení UI, onboarding a reset) jsou dokončené a nasazené.

## 2. Preference spolupráce a designu

- Komunikuj česky, stručně a konkrétně.
- Uživatel má rád V2, ale požádal o výrazně méně informací na první pohled. Preferuje detaily na vyžádání před zaplněným dashboardem.
- Vizuální směr vychází z Apple Human Interface Guidelines: systémové písmo, klidné plochy, boční navigace, modrý akcent, jasná hierarchie.
- Zachovej jednoduchý hlavní tok. Nepřidávej nové statistické karty a vysvětlující texty bez důvodu.
- Uživatel dovolil Computer Use a žádal ověřování skutečného chování v prohlížeči.
- Uživatel výslovně požaduje **průběžné samostatné commity**, ne jeden velký commit na konci celé série změn.
- Běžné implementační volby řeš samostatně. Na skutečné produktové nejasnosti se můžeš zeptat.

### Důležitá oprava předpokladu o čase

`weekBudget: 60` je **výchozí hodnota zvolená asistentem**, nikoli vypočtená nebo uživatelem potvrzená kapacita. Uživatel se na její původ výslovně zeptal a dostal vysvětlení. Potvrzených je pouze minimálně 20 hodin práce týdně.

**Hodnota 60 v kódu stále zůstává.** Nikdy ji neprezentuj jako skutečný uživatelův volný čas. Návrh nechat rozpočet nezadaný do jeho potvrzení zatím nebyl implementovaný ani výslovně objednaný.

## 3. Kde je aktuální aplikace

- Repo: <https://github.com/Luksanss/studyPlanner>
- Aktivní V2: `frontend/`.
- Zachovaná původní V1: `legacy/v1/`. Slouží jako archiv, neupravovat při běžném vývoji V2.
- Původní GitHub Pages aplikace: <https://luksanss.github.io/studyPlanner/>.
- **Soukromá nasazená V2:** <https://semester-planner-lukas-v2.luksans.chatgpt.site>.
- Hosting manifest: `frontend/.openai/hosting.json`.
- Sites project ID: `appgprj_6a9c2bd40d208191927576729836a76d`.
- Poslední ověřené nasazení: Sites verze **3**, obsahuje reset. Přístup byl owner-only pro uživatele; před změnami sdílení ověř aktuální stav.
- `TODO.md` obsahuje starší mobilní backlog z původní aplikace; není aktuálním schváleným plánem V2.
- `Semester-planner-nano/` není aktivní adresář V2.
- Licence v `LICENSE`: PolyForm Noncommercial 1.0.0.

### Pozor: běžící web není synchronizovaná databáze

V2 je statická aplikace. Uživatelská data jsou v `localStorage`, klíč **`semester-v2-study`**. Neexistuje backend, uživatelský účet aplikace ani automatická synchronizace.

Každý prohlížeč a každý origin má samostatná data: GitHub Pages, localhost a Sites je automaticky nesdílejí. Soukromý přístup k hostované stránce není totéž co implementované účty v aplikaci. Data lze přenášet JSON zálohou. Publikovaný bundle neobsahuje osobní výpis ani uživatelův plán.

## 4. Co se nedávno udělalo

Commity v hlavním repozitáři, od nejstaršího:

| Commit | Změna |
| --- | --- |
| `9523d33` | Kompletní V2, TypeScript, datový model, PDF import KOS, migrace V1, přehled, historie, plánování, zachování V1. |
| `24c3beb` | Zjednodušené UI: detaily na vyžádání, kratší karty, menu méně častých akcí. |
| `6dde5e7` | Povinný dvoukrokový onboarding: jméno a import studijních výsledků. |
| `5e78b2c` | Potvrzovaný reset všech lokálních údajů v nastavení. |

Tento handoff je další dokumentační změna. Rozlišuj lokální Git historii, vzdálený GitHub `origin` a samostatnou source repository služby Sites. Nasazení na Sites samo neznamená push do GitHub `origin`.

### Současné zjednodušené UI

- **Přehled studia:** jeden ukazatel získaných kreditů a čtyři budoucí semestry.
- **K opakování** a **Statistiky a podmínky studia** jsou ve výchozím stavu sbalené.
- **Plán semestrů:** stručné karty, kredity a důležitý příznak opakování. Tlačítko **Podrobnosti** zpřístupní kódy, období výuky, výběr přesunu a hodinovou zátěž.
- Přesun lze provést také z detailu předmětu; zůstává HTML5 drag-and-drop.
- Nezařazené předměty jsou ve výchozím stavu sbalené.
- Kopie varianty plánu je v menu **Možnosti plánu (⋯)**.
- Import, záloha a nastavení jsou v horním menu **Další akce (⋯)**. Nastavení je dostupné i v desktopovém sidebaru.
- Historie výsledků zůstává tabulková s hledáním a filtry.

### Onboarding

- Nové / prázdné studium nejprve zobrazí jméno, potom rovnou import českého PDF výpisu.
- Bez neprázdného jména a úspěšného importu se nelze dostat do plánovače. Není tlačítko přeskočení.
- Používá se existující importní komponenta, vložená přímo do stránky místo zavíratelného dialogu.
- Existuje nenápadná alternativa pro obnovení zálohy; musí obsahovat výsledky. Samotný export V1 bez výsledků onboarding nedokončí.
- Výběr souboru nejdříve ukáže náhled. Data se zapíší až potvrzením importu.
- Existující studium s `enrollments.length > 0` onboarding přeskočí. Samostatný příznak `onboardingComplete` není v modelu.
- Při poškozeném uloženém stavu zůstává dostupná cesta obnovy přes původní chybové UI.
- Obnovení stránky před dokončením importu vrátí krok jména, jeho uložená hodnota je předvyplněná.

### Reset

- **Nastavení studia → Začít znovu → Resetovat všechna data**.
- Následuje explicitní potvrzení **Smazat všechna data**, možnost zrušit a stáhnout zálohu.
- Smaže se pouze storage klíč aplikace, ne celé `localStorage` originu.
- V paměti se obnoví `initialState()`, vyčistí undo, dialogy, rozpracované přesuny a další UI stav.
- Zmizí osobní výsledky, jméno, varianty, vlastní předměty, poznámky a uživatelská nastavení. Výchozí veřejný katalog se znovu načte z aplikace.
- Vrací na onboarding a přetrvá po reloadu. Reset nemá undo.
- Pokud mezitím změnila data jiná karta nebo odstranění storage selže, reset nesmí tiše přepsat data; v potvrzení zobrazí chybu.

## 5. Architektura a orientace v kódu

Stack: React 19, TypeScript, Vite, `lucide-react`, `pdfjs-dist`. Přesné verze používej z `frontend/package-lock.json`; není důvod měnit stack nebo závislosti kvůli běžné úpravě UI.

| Soubor | Odpovědnost |
| --- | --- |
| `frontend/src/App.tsx` | Centrální stav, navigace, commit změn do storage, undo, detekce konfliktů mezi kartami, přesuny, reset a gate onboardingu. |
| `frontend/src/lib/model.ts` | Typy, validace záloh, součty kreditů, opakování, minima skupin, zatížení a upozornění. |
| `frontend/src/lib/catalogue.ts` | Veřejný katalog programu a `initialState()`. |
| `frontend/src/lib/imports.ts` | Parsování PDF textových pozic, V1/V2 JSON, náhled a merge. |
| `frontend/src/lib/readFile.ts` | Čtení souboru, lokální PDF.js worker, limity 20 MB / 100 stran. |
| `frontend/src/lib/storage.ts` | Storage klíč, načtení, zápis, export zálohy. |
| `frontend/src/components/Onboarding.tsx` | Jméno → import, blokování vstupu před výsledky. |
| `frontend/src/components/ImportDialog.tsx` | Sdílený importní tok; `embedded` a `pdfOnly` pro onboarding. |
| `frontend/src/components/Dashboard.tsx` | Zjednodušený přehled a rozbalovací statistiky/podmínky. |
| `frontend/src/components/PlanBoard.tsx` | Semestry, karty, drag-and-drop, podrobnosti a nezařazené předměty. |
| `frontend/src/components/History.tsx` | Historie zápisů, hledání a filtry. |
| `frontend/src/components/CourseDialog.tsx` | Detail/editace, lokální hledání podle kódu, odkazy, samostudium a poznámky. |
| `frontend/src/components/SettingsDialog.tsx` | Nastavení profilu, rozpočtu, potvrzení programu, záloha a reset. |
| `frontend/src/components/ActionMenu.tsx` | Nativní disclosure menu s podporou Escape a zavíráním po opuštění. |
| `frontend/src/components/Modal.tsx` | Nativní `<dialog>`, focus a zavírání. |
| `frontend/src/index.css` | Celý vizuální styl a responzivita. |
| `frontend/tests/study.test.ts` | Deset automatických testů se syntetickými daty. |

Část zdrojáků je stále zapsaná velmi kompaktně, některé komponenty na dlouhých řádcích. Při větší úpravě lze dotčený soubor zpřehlednit, ale nemíchej plošné formátování s funkční změnou.

## 6. Datová pravidla, která zachovat

`StudyState.schemaVersion` je **2**. Obsahuje `courses`, `enrollments`, `plans`, `activePlanId`, `settings`, `official` a `updatedAt`.

- **Course** je katalogový předmět identifikovaný kódem.
- **Enrollment** je konkrétní zápis předmětu v konkrétním semestru, včetně historických kreditů, výsledku a zdroje.
- **Plan** je varianta budoucího rozložení (`placements: code → semester | null`). Historie je společná všem variantám.
- Přesun v plánu **nikdy nemění skutečný zápis v KOSu ani jeho známku**.
- Známky A–E znamenají splnění. U zakončení Z/KZ může splnění vyplývat ze zápočtu Z bez známky. F/N jsou neúspěšné výsledky.
- Kredity dokončeného předmětu se počítají **jednou podle kódu**, z úspěšného zápisu. Historie zachovává neúspěšný i pozdější úspěšný zápis.
- Předmět s pozdějším splněním nesmí dál figurovat mezi nutnými opakováními.
- Nulové kredity neznamenají zbytečný předmět: existují povinnosti s 0 kredity.
- Celý nový PDF výpis nahrazuje snapshot historie; není to nekonečné přidávání záznamů. Plány a vlastní poznámky se zachovávají.
- PDF nemá roli P/PV/V. Ta se doplňuje ze známého katalogu; neznámé předměty mají neověřené údaje a lze je upravit.
- Parser čte souřadnice textových sloupců, nikoli prostý řetězec všech textů. Sloupec známky se musí odlišit od sloupce „Uzav.“ s hodnotou A. Podporuje zalomené názvy.
- Součet získaných kreditů musí odpovídat souhrnu KOSu, pokud ho výpis obsahuje; jinak se import zastaví. Naskenované PDF/OCR není podporované.
- PDF se zpracovává pouze v prohlížeči. Neukládat rodné číslo z jeho hlavičky.
- V1 migruje čtyři plánovací semestry 1–4 na B261, B262, B271, B272, normalizuje kódy i z KOS URL a slučuje duplicity.
- `selfStudy: null` znamená neznámou zátěž; nesmí se v UI zaměnit za potvrzenou nulu. `hoursKnown: false` označuje neověřenou výuku.
- Výuka se přepočítává podle `lessonMinutes` (výchozí 45), samostudium a práce jsou v běžných hodinách.
- Před uložením se validuje stav a kontroluje poslední známý storage snapshot, aby druhá karta nepřepsala novější změny.

### Studijní plán

Program: <https://fel.cvut.cz/cs/studijni-programy/bio-lekarska-elektronika-a-bioinformatika/zajem-o-studium/bakalarske-studium>

Použitá předloha: [BIO 2018](https://intranet.fel.cvut.cz/cz/education/bk/plany/pl30018325.html). **Její přiřazení ke konkrétnímu uživatelovu studiu zatím nebylo potvrzené.** K tomu slouží checkbox v nastavení.

Implementovaná minima: povinné 126 kr. / 25 předmětů; odborné PV 14 kr. / 3 předměty; programování 6 kr. / 1; úvod do inženýrství 4 kr. / 1; angličtina 2 předměty s 0 kr.; bakalářka 20 kr. / 1. Celkový cíl 180 kr.

Programovací a úvodní PV se **nepočítají do odborných PV 14 kreditů**. Aplikace zatím nekontroluje úplnou započitatelnost, všechna maxima volitelných kreditů ani všechny návaznosti. Pokrytí minim proto není oficiální potvrzení splnění studia.

Program, nástup a čtyři budoucí semestry jsou stále pevně dané pro tento osobní případ. Onboarding s jiným jménem z aplikace nedělá univerzální plánovač všech škol a ročníků.

## 7. Kontext uživatelových dat při předání

Jde o **referenční stav z importu**, nikoli seed, který se má přidat do zdrojového kódu, a nikoli garantovaně aktuální data při další návštěvě.

- 106 získaných kreditů, 26 splněných unikátních předmětů.
- 36 zápisů / 35 unikátních kódů v tehdejším výpisu.
- Průměr z KOSu 2,1; vážený 2,18.
- Zbývala tři opakování: Fyzika 2 (`B3B02FY2`, 6 kr.), Elektrická měření (`B2B38EMBA`, 5 kr.), Statistika a pravděpodobnost (`B0B01STP`, 5 kr.).
- ZEOA (`B2B31ZEOA`) mělo F v roce 2025 a E v roce 2026: je splněné, kredity jednou.
- Přenesený budoucí plán měl **20 / 20 / 17 / 20 kreditů**, celkem 77, poslední semestr jen bakalářka. Součet s historií je 183, ale započitatelnost konkrétních volitelných předmětů je nutné ověřit.

Osobní PDF, JSON zálohy, přihlašovací údaje ani tokeny **nepatří do repozitáře**. Předchozí testy používaly soubory mimo repo; nový chat nesmí spoléhat, že dočasné soubory nebo prohlížečové relace stále existují. Pro testy přednostně použij syntetická data. Reset testuj na odděleném originu, nikoli nad uživatelovým skutečným plánem.

## 8. Spuštění a ověření

Z kořene repozitáře:

```sh
cd frontend
npm ci
npm run dev
```

Vite je nakonfigurované na `http://127.0.0.1:5173/` se `strictPort: true`. Použij aktuální Node podporující Vite a vestavěné TypeScript stripování. Nevyměňuj lockfile bez důvodu.

```sh
npm test
npm run build
```

- `npm test`: Node test runner, 10 testů importu, opakování, historických kreditů, skupin, upozornění, migrace, validace a roundtripu zálohy.
- `npm run build`: `tsc -b && vite build`; výstup `dist/`.
- `npm run lint` existuje, ale současný ESLint config pokrývá pouze JS/JSX, **ne TS/TSX**. Úspěšný lint není důkaz kontroly většiny V2. TypeScript kontroluje build.
- Žádná automatická end-to-end browser sada zatím není.

Dosud ručně ověřeno přes Computer Use: import skutečného českého PDF a jeho opakování, převod V1, historie ZEOA, přesun s upozorněním a undo, kopie varianty, úprava samostudia, rozbalovací UI, menu importu, onboarding s prázdným jménem i skutečným PDF a další návštěva po reloadu. Reset byl otestovaný na oddělené testovací adrese včetně zrušení, potvrzení a reloadu. Notebookový layout i šířka 390 px byly kontrolované; úplný audit přístupnosti a touch drag-and-drop není hotový.

## 9. Nasazení a rozdíl proti GitHub Pages

Současná V2 je nasazená přes **Sites**, staticky z `frontend/dist`.

- Znovu použij existující `project_id`; nezakládej další Site.
- Pokud prostředí nabízí Sites skills, přečti aktuální instrukce před nasazováním.
- Ověř build, pushni přesný zdrojový stav do source repository vybrané Site, zabal odpovídající build, ulož verzi a nasaď ji podle aktuálního přístupu a autorizace.
- Tokeny jsou krátkodobé: používej nástroje pro získání credentials, nikdy je neukládej do souborů, Git remote URL ani tohoto handoffu.
- Předchozí nasazení používalo samostatný dočasný checkout rootovaný obsahem `frontend/`, protože hlavní Git repo má frontend v podadresáři. Tento checkout není součástí repo a jeho existence není zaručená. Nesmí se omylem publikovat osobní soubory ani celý nesouvisející parent adresář.
- Po publikování ověř terminální stav deploymentu a vrať uživateli stejnou finální adresu. Není potřeba znovu importovat jeho data při každé změně UI.
- Skript `npm run deploy` stále používá **gh-pages**. **Není to aktuální cesta nasazení V2**; nespouštěj ho automaticky, mohl by změnit původní GitHub Pages web.
- Nespolehej na stará ID běžících procesů, browser tabů, temp cest nebo credentials z minulého chatu.

## 10. Co dál — odliš zadání od návrhů

**Aktuálně není rozpracovaný funkční požadavek.** Zjednodušení UI, onboarding a reset jsou hotové. Tento soubor vznikl na výslovné přání uživatele pro pokračování v novém chatu.

Uživatelem požadovaný dlouhodobý směr:

1. **Vyhledání předmětu podle kódu a automatické doplnění údajů.** Dnes je pouze lokální katalog a ruční editace. Před integrací ověř oficiální dostupné zdroje KOS/ČVUT, rozhraní a přístupové podmínky. Zvlášť řeš katalogová data a zvlášť osobní studijní výsledky; nepředpokládej, že stejné API poskytne obojí.
2. **Účty a synchronizace mezi zařízeními**, až po dohodě o rozsahu. Backend, poskytovatel identity ani konkrétní databáze nejsou vybrané. Zajistit migraci současných lokálních dat a zachovat export/obnovu.
3. **Úplnější kontext studia v jedné aplikaci**, postupně a bez znovuzaplnění hlavní obrazovky.

Doporučené menší kroky k diskusi, nikoli už schválený sprint:

- Rozpočet 60 h nahradit vědomě zadanou kapacitou nebo stavem „nezadáno“. To vyžaduje úpravu modelu, validace, migrace, grafů a upozornění, ne jen přepsat text.
- Ověřit přesný studijní plán uživatele a doplnit chybějící katalogové údaje bez odhadování.
- Rozšířit kontroly návazností, maxim a započitatelnosti, pokud je uživatel bude chtít.
- Zpřehlednit editaci detailu předmětu a případně historii, pouze pokud současné zjednodušení nestačí.
- Nastavit ESLint pro TypeScript; postupně formátovat dotčené soubory. Další testy přidávat pro skutečná rizika a nové chování.
- Generalizovat ročníky/programy teprve při rozhodnutí dělat produkt pro více studentů. Nynější priorita je osobní použití na notebooku.

## 11. Doporučený první postup nového chatu

1. Přečti tento soubor a zkontroluj `git status`, poslední commity a aktuální uživatelovo zadání.
2. Pro konkrétní změnu otevři odpovídající komponentu a související model/import. Neprováděj nový generální audit nebo rebuild V2 bez důvodu.
3. Zachovej existující uživatelská data, jednoduchý UI směr a oddělení historie od plánů.
4. Změnu dokonči, přiměřeně ověř a ulož v samostatném commitu. Při nasazování použij existující Site a její současná pravidla.
5. Aktualizuj tento handoff po další významné změně, zejména při změně modelu, importu, onboardingu, synchronizace nebo hostingu.
