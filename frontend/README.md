# Semester Planner V2

Osobní plánovač studia Lékařská elektronika a bioinformatika na FEL ČVUT. Původní aplikace je uchovaná v `legacy/v1`; V2 je ve `frontend`.

## Spuštění

Vyžaduje aktuální Node.js (testy používají vestavěný TypeScript strip).

```sh
cd frontend
npm ci
npm run dev
```

`npm test` ověřuje import, opakování, kredity, skupiny, migraci a validaci záloh. `npm run build` kontroluje TypeScript a vytváří produkční aplikaci v `frontend/dist`.

## Import a používání

První spuštění má dva povinné kroky: jméno a import studijních výsledků. Přehled ani plán nejsou dostupné před úspěšným importem. Existující studium se otevře rovnou. Pro přenos mezi prohlížeči je dostupná i obnova zálohy obsahující výsledky.

1. V KOSu otevři **Studijní výsledky → Tisk studijních výsledků → Česky** a stáhni PDF.
2. V aplikaci otevři **Další akce (⋯) → Import z KOSu**, vyber PDF, zkontroluj náhled a potvrď import.
3. Stejným způsobem přenes JSON export V1. Jeho semestry 1–4 se převedou na budoucí semestry 5–8.
4. Přesouvej předměty přetažením nebo výběrem na kartě. Přesuny mění jen plán, nikoli zápisy či výsledky v KOSu.
5. Tlačítkem zálohy stáhni kompletní JSON pro obnovení a přenos do jiného prohlížeče.

PDF se zpracovává v prohlížeči. Rodné číslo z hlavičky se neukládá. Import kontroluje získané kredity proti součtu KOSu. Opakovaný import nahrazuje úplný výpis historie a zachovává plány a poznámky. Úspěšně dokončené opakované předměty se započítají jednou.

## Rozsah a limity

- Historie zápisů, známky, zápočty, kredity a průměry z výpisu.
- Čtyři budoucí semestry, varianty plánu, opakování a minima skupin P/PV/V.
- Výchozí práce 20 h týdně, nastavitelné samostudium a výuková hodina. Neznámé hodnoty jsou označené.
- Lokální ukládání, export/import záloh, vrácení poslední změny a ochrana před přepsáním změn z jiného panelu.
- Katalog programu a vlastní předměty. Živé KOS API, účty a synchronizace přijdou v dalších iteracích.

Data patří konkrétní adrese v konkrétním prohlížeči. Publikování aplikace je nesynchronizuje. Nový prohlížeč začíná prázdný a data získá importem.

Předloha pravidel: [BIO 2018](https://intranet.fel.cvut.cz/cz/education/bk/plany/pl30018325.html). Přiřazení ke svému studiu ověř v KOSu a potvrď v nastavení. Kontrola zahrnuje minima skupin, nikoli všechny návaznosti, maxima nebo započitatelnost volitelných kreditů. PDF neobsahuje všechny katalogové údaje; chybějící hodnoty jsou označené.

## Zdrojový kód

`frontend/src/lib`: model, katalog, import, ukládání. `frontend/src/components`: obrazovky a dialogy. Testy obsahují pouze syntetická data. Osobní výpisy a zálohy nepatří do repozitáře.
