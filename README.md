# Eʋegbe – Ewe lernen (iPhone & iPad)

Eine eigenständige Lern-App für **Ewe aus Ghana** (Eʋegbe) als Web-App für den Home-Bildschirm von iPhone und iPad. Sie funktioniert nach dem ersten Öffnen **offline** und braucht kein Konto und keinen App Store.

## Inhalt

- **17 Lektionen** mit deutschen Grammatik-Erklärungen, Beispielsätzen, Dialog und Kinderlied: Artikel, Zustandsverben, Fragen, Verneinung, Zahlen, Plural, Pronomen, Postpositionen, Verlaufsform, Ingressiv, Besitz, „haben“, Imperativ, Habitual, Relativsätze, Futur, Reflexiv und Wortbildung
- **Wörterbuch** mit über 1.100 Einträgen (Ewe – Deutsch – Englisch). Die Suche funktioniert mit und ohne Tonzeichen.
- **Karteikarten mit Wiederholungsintervallen** (1, 3, 7, 16 … Tage), Tagesziel und Lernserie
- **Quiz pro Lektion**: Multiple Choice, Satzbau mit Wortkacheln, Tonschreibung und Schreiben mit einer Sondertastatur für ɖ ƒ ɣ ŋ ɔ ɛ ʋ und die Tonzeichen
- **Aussprache**
  - alle Laute mit Beschreibung auf Deutsch, z. B. kp, gb, ƒ, ʋ, ɖ, ɣ und die Nasalvokale
  - Erklärung der Töne mit Minimalpaaren (z. B. *asi* „Markt“ und *así* „Hand“)
  - **Tonmelodie**: Jedes Wort und jeder Satz lässt sich als Folge von Hoch-, Tief-, Steig- und Falltönen anhören.
  - **Sprechtrainer**: Du nimmst dich auf. Die App misst die Tonhöhe deiner Stimme, zeichnet deine Tonkurve über die Zielmelodie und bewertet die Übereinstimmung in Prozent.
  - **Muttersprachler-Referenzen**: Eine Ewe-Sprecherin oder ein Ewe-Sprecher kann Wörter und Sätze einsprechen. Diese Aufnahmen spielt die App dann überall ab, auch in der Übung „Hören“. Du kannst die Aufnahmen exportieren und importieren.
- **Alltagssätze** zu Begrüßung, Kennenlernen, Markt, Essen und Unterwegs, außerdem ein **Zahlentrainer**, ein **Verbtrainer** mit allen Zeiten und Pronomen sowie **Wochentage und Tagesnamen** (Kofi, Ama, Kɔsi …)
- Tonzeichen lassen sich ein- und ausblenden. Der Fortschritt lässt sich sichern. Die App unterstützt den Dunkelmodus.

## Auf das iPhone/iPad bringen

1. Die App muss über **HTTPS** erreichbar sein, am einfachsten über GitHub Pages:
   *Repository → Settings → Pages → „Deploy from a branch“ → Branch wählen → Ordner `/ (root)` → Save.*
   Nach etwa einer Minute ist sie unter `https://<benutzer>.github.io/<repo>/` erreichbar.
2. Öffne diese Adresse in **Safari**, tippe auf **Teilen** und dann auf **„Zum Home-Bildschirm“**.
3. Die App startet danach im Vollbild wie eine normale App und funktioniert offline.

Lokal testen: `python3 -m http.server` im Projektordner starten und `http://localhost:8000` öffnen.

## Hinweis zur Aussprache

iOS hat keine Ewe-Sprachausgabe. Die App ersetzt sie deshalb durch:

- Lautbeschreibungen
- die hörbare Tonmelodie
- die Tonhöhen-Analyse deiner eigenen Aufnahmen
- selbst aufgenommene Muttersprachler-Referenzen

Für flüssiges Sprechen sind Gespräche mit Muttersprachlern unersetzlich. Die App bereitet dich darauf vor und begleitet dich dabei.

## Quelle

Lektionen, Beispielsätze und Wortschatz stammen aus: Simon Wellington Dzablu-Kumah, *Basic Ewe for Foreign Students*, 2. Auflage, überarbeitet von Ulrike Claudi & Johannes Ayao Ossey, Institut für Afrikanistik, Universität zu Köln, 2015. Die deutschen Erklärungen und Übersetzungen wurden für diese App erstellt. Die mit 💬 markierten Alltagssätze stammen nicht aus dem Buch.

## Technik

Die App besteht aus reinem HTML, CSS und JavaScript, ohne Build-Schritt und ohne externe Abhängigkeiten.

| Pfad | Inhalt |
|---|---|
| `index.html`, `css/`, `js/app.js` | Oberfläche und Lernlogik |
| `js/audio.js` | Tonanalyse, Tonmelodie, Aufnahme, Tonhöhenerkennung, Referenzspeicher (IndexedDB) |
| `data/vocab.js` | Wortschatz, erzeugt mit `tools/build_vocab.py` aus `tools/vocab_raw.json` und `tools/vocab_de.txt` |
| `data/lessons.js`, `data/extras.js` | Lektionen, Laute, Phrasen, Verben |
| `sw.js` | Service Worker für den Offline-Betrieb. Bei Änderungen `VERSION` erhöhen. |
| `tools/make_icons.py` | erzeugt die App-Icons |
