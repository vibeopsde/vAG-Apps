# vAG-Apps — App Store für vibeAgentGo

Offizieller App-Store für [vibeAgentGo](https://github.com/vibeopsde/vibeAgentGo).
Jeder kann Apps einreichen — als Bundle mit einem `vAG-app.json`-Manifest.

## App einreichen

1. Repo forken.
2. Neue App unter `apps/<Kategorie>/<app-id>/` ablegen.
3. Ein `vAG-app.json` und ein `index.html` anlegen.
4. Icons oder Assets optional unter `assets/` ablegen.
5. Pull Request öffnen.

## Beispiel-Struktur

```
apps/
└── Productivity/
    └── example.calculator/
        ├── vAG-app.json
        ├── index.html
        └── assets/
            └── icon.svg
```

## Manifest-Schema `vAG-app.json`

```json
{
  "id": "deinname.appname",
  "name": "AppName",
  "version": "1.0.0",
  "author": "Dein Name",
  "category": "Productivity",
  "description": "Kurze Beschreibung der App.",
  "icon": "assets/icon.svg",
  "entry": "index.html",
  "permissions": ["readFile", "listFiles", "sendMessage"],
  "minVibeAgentGo": "2607.9.0",
  "license": "MIT"
}
```

### Pflichtfelder

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id` | `string` | Eindeutige App-ID im Format `autor.name` oder umgekehrte Domain. |
| `name` | `string` | Anzeigename der App. |
| `version` | `string` | Semver-Version, z.B. `1.0.0`. |
| `author` | `string` | Name oder Alias des Autors. |
| `category` | `string` | Eine der erlaubten Kategorien. |
| `entry` | `string` | Pfad zur HTML-Einstiegsdatei, relativ zum App-Ordner. |

### Optionale Felder

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `description` | `string` | Kurze Beschreibung für den Store. |
| `icon` | `string` | Pfad zum App-Icon, relativ zum App-Ordner. |
| `permissions` | `string[]` | Liste der erlaubten Bridge-Actions. |
| `minVibeAgentGo` | `string` | Mindestversion von vibeAgentGo. |
| `license` | `string` | Lizenz der App. |

## Erlaubte Kategorien

- `Productivity`
- `Utilities`
- `Development`
- `Creative`
- `Games`
- `System`

## Lokale Installation (kein separates Format nötig)

Jede App ist ein normaler Workspace-Ordner. Um eine App lokal zu installieren, kann man den Ordner einfach nach `apps/<Category>/<id>/` kopieren oder forken. Der App Store bietet dafür ein komfortables UI.

Nach dem Kopieren ist die App sofort sichtbar im **Explorer** und startbar per HTML/ProgramApp. Keine versteckten IndexedDB-Speicher, keine Registry.

## Tool Kit

Das Tool Kit unter `scripts/` hilft beim Erstellen, Validieren und Veröffentlichen von Apps.

| Befehl | Beschreibung |
|--------|-------------|
| `npm run validate` | Prüft alle Apps auf Schema, Assets und Sicherheit. |
| `npm run build:index` | Erzeugt `apps/index.json` für den App Store. |
| `npm run release:check` | Prüft Versions- und Autor-Rechte vor einem Merge. |

## Sandbox & Sicherheit

- Apps laufen in einem **sandboxed iframe** mit null origin.
- Zugriff auf den vibeAgentGo-Workspace nur über die dokumentierte Bridge.
- Jede Bridge-Aktion benötigt eine explizite Erlaubnis in `permissions`.
- Externe Skripte sind nur mit Subresource-Integrity (`integrity`) erlaubt.

## Roadmap

- [x] Manifest-Schema und README
- [x] Tool Kit (validate, build-index, release-check)
- [x] GitHub Actions CI
- [x] vibeAgentGo AppStore-App
- [x] Dynamische App-Registrierung in vibeAgentGo
- [x] Permission-Guard für Bridge-Requests
- [x] Apps als Workspace-Dateien speichern (sichtbar im Explorer, forkbar)
- [ ] Update-Mechanismus für installierte Apps
- [ ] Eigene App-Symbole im Dock rendern
- [ ] CORS-Proxy für externe App-Quellen

## License

MIT License — Copyright Lars Greipl - vibeops.de

## NOTICE

This project was created with assistance from AI models including:

- Kimi K2.7 Code (Moonshot AI)

AI-generated code and content are used under the MIT license terms.
