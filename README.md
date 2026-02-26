# Tirim Portfolio

Statische Portfolio-Website mit einer HTML-Seite, CSS-Styles und JavaScript für Scroll-/Reveal-Effekte sowie einen Canvas-Hintergrund. (Beleg: `index.html:1-13`, `assets/css/style.css:1-40`, `js/main.js:1-56`, `assets/js/binary-bg.js:1-150`)

## Features

- Einseitige Portfolio-Struktur mit Navigation zu `#projects`, `#skills`, `#about`, `#contact`. (Beleg: `index.html:18-23`)
- Hero-Bereich mit initialer Reveal-Animation über die Klasse `is-loaded`. (Beleg: `js/main.js:1-11`, `assets/css/style.css:127-146`)
- Abschnitts-Reveal via `IntersectionObserver` mit Fallback auf direkte Sichtbarkeit ohne Observer. (Beleg: `js/main.js:25-43`)
- Zusätzliche Confidence-Reveal-Animation für Elemente mit `.confidence-reveal`. (Beleg: `js/main.js:45-56`)
- Canvas-Hintergrund mit binären Zeichen (`0`/`1`), Maus-Drift und Resize-Handling. (Beleg: `assets/js/binary-bg.js:1-150`)
- Berücksichtigung von `prefers-reduced-motion` in beiden JavaScript-Dateien. (Beleg: `js/main.js:14-23`, `assets/js/binary-bg.js:8`, `assets/js/binary-bg.js:81-150`)

## Quickstart (lokal)

### Voraussetzungen

- Ein moderner Webbrowser (Seite nutzt `canvas`, `requestAnimationFrame`, `IntersectionObserver`, `matchMedia`). (Beleg: `assets/js/binary-bg.js:1-150`, `js/main.js:25-56`)

### Installation

```bash
git clone <REPO-URL>
cd thetirim.github.io
```

### Starten (Dev)

Es gibt im Repository keine Build- oder Dev-Skripte (`package.json`, `Makefile`, `Dockerfile` o.ä. sind nicht vorhanden im Projektstamm). (Beleg: Projektdateien im Root: `README.md`, `index.html`, `js/main.js`, `assets/css/style.css`, `assets/js/binary-bg.js`)

Direktstart durch Öffnen der HTML-Datei:

```bash
xdg-open index.html
```

Alternativ (optional, wenn Python lokal vorhanden) über einen statischen HTTP-Server:

```bash
python3 -m http.server 8000
```

Danach im Browser öffnen: `http://localhost:8000/`

### Starten (Prod)

- Keine dedizierte Produktions-Pipeline im Repository enthalten; Deployment erfolgt als statische Dateien (`index.html`, `assets/`, `js/`). (Beleg: Dateistruktur im Repository)

## Konfiguration

Im Repository sind keine `.env`-Dateien, keine ENV-Templates und keine konfigurierbaren Umgebungsvariablen hinterlegt.

| ENV-Variable | Bedeutung | Default | Wo definiert |
|---|---|---|---|
| – | Keine ENV-Konfiguration im Repository gefunden | – | – |

## Projektstruktur

- `index.html` – Seitenstruktur, Navigation, Sektionen und Script-/Stylesheet-Einbindung. (Beleg: `index.html:1-260`)
- `assets/css/style.css` – Layout, Theme-Variablen, Responsive-Regeln und Animationsklassen. (Beleg: `assets/css/style.css:1-260`)
- `js/main.js` – Hero/Reveal-Logik, Jahreszahl im Footer, Observer-Fallbacks. (Beleg: `js/main.js:1-56`)
- `assets/js/binary-bg.js` – Canvas-Initialisierung und Animation des binären Hintergrunds. (Beleg: `assets/js/binary-bg.js:1-150`)
- `img/test` – vorhandene Datei im Verzeichnis `img`. (Beleg: `img/test`)

## Troubleshooting

- Hintergrundanimation erscheint nicht, wenn das Canvas-Element `#binary-bg` oder ein 2D-Kontext nicht verfügbar ist; das Skript beendet sich dann frühzeitig. (Beleg: `assets/js/binary-bg.js:2-7`)
- Reveal-Animationen ohne `IntersectionObserver` werden sofort als sichtbar markiert (kein „harter“ Fehler, aber anderes Verhalten). (Beleg: `js/main.js:25-43`, `js/main.js:45-56`)
- Bei aktiviertem `prefers-reduced-motion` werden Animationen reduziert bzw. gestoppt. (Beleg: `js/main.js:14-23`, `assets/js/binary-bg.js:81-150`)

## Credits

© 2026 · Tirim
