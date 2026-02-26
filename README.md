# Tirim Portfolio

Statische Portfolio-Website mit einer HTML-Seite, CSS-Styles und JavaScript für Scroll-/Reveal-Effekte sowie einen Canvas-Hintergrund. 
## Features

- Einseitige Portfolio-Struktur mit Navigation zu `#projects`, `#skills`, `#about`, `#contact`. 
- Hero-Bereich mit initialer Reveal-Animation über die Klasse `is-loaded`. 
- Abschnitts-Reveal via `IntersectionObserver` mit Fallback auf direkte Sichtbarkeit ohne Observer. 
- Zusätzliche Confidence-Reveal-Animation für Elemente mit `.confidence-reveal`. 
- Canvas-Hintergrund mit binären Zeichen (`0`/`1`), Maus-Drift und Resize-Handling. 
- Berücksichtigung von `prefers-reduced-motion` in beiden JavaScript-Dateien. 
## Quickstart (lokal)

### Voraussetzungen

- Ein moderner Webbrowser (Seite nutzt `canvas`, `requestAnimationFrame`, `IntersectionObserver`, `matchMedia`).
### Installation

```bash
git clone <REPO-URL>
cd thetirim.github.io
```

### Starten (Dev)

Es gibt im Repository keine Build- oder Dev-Skripte (`package.json`, `Makefile`, `Dockerfile` o.ä. sind nicht vorhanden im Projektstamm). 
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

- Keine dedizierte Produktions-Pipeline im Repository enthalten; Deployment erfolgt als statische Dateien (`index.html`, `assets/`, `js/`). 

## Konfiguration

Im Repository sind keine `.env`-Dateien, keine ENV-Templates und keine konfigurierbaren Umgebungsvariablen hinterlegt.

| ENV-Variable | Bedeutung | Default | Wo definiert |
|---|---|---|---|
| – | Keine ENV-Konfiguration im Repository gefunden | – | – |

## Projektstruktur

- `index.html` – Seitenstruktur, Navigation, Sektionen und Script-/Stylesheet-Einbindung. 
- `assets/css/style.css` – Layout, Theme-Variablen, Responsive-Regeln und Animationsklassen. 
- `js/main.js` – Hero/Reveal-Logik, Jahreszahl im Footer, Observer-Fallbacks. 
- `assets/js/binary-bg.js` – Canvas-Initialisierung und Animation des binären Hintergrunds. 
- `img/test` – vorhandene Datei im Verzeichnis `img`. 

## Troubleshooting

- Hintergrundanimation erscheint nicht, wenn das Canvas-Element `#binary-bg` oder ein 2D-Kontext nicht verfügbar ist; das Skript beendet sich dann frühzeitig. 
- Reveal-Animationen ohne `IntersectionObserver` werden sofort als sichtbar markiert (kein „harter“ Fehler, aber anderes Verhalten). 
- Bei aktiviertem `prefers-reduced-motion` werden Animationen reduziert bzw. gestoppt. 

## Credits

© 2026 · Tirim
