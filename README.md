# vAG-Apps — App Store für vibeAgentGo

Offizieller App-Store für [vibeAgentGo](https://github.com/vibeopsde/vibeAgentGo).
Jede App ist eine **einzige, selbständige HTML-Datei** mit eingebettetem Manifest.

## App einreichen

1. Repo forken.
2. Neue App unter `apps/<Kategorie>/<app-id>/` ablegen.
3. Eine `index.html` mit eingebettetem Manifest anlegen.
4. Zusätzliche Daten (z.B. JSON-Einstellungen) optional im gleichen Ordner ablegen.
5. Pull Request öffnen.

## Beispiel-Struktur

```
apps/
└── Productivity/
    └── example.calculator/
        └── index.html
```

## Manifest-Format

Das Manifest wird direkt in den `<head>` der `index.html` eingebettet:

```html
<script type="application/vnd.vag+json">
{
  "id": "deinname.appname",
  "name": "AppName",
  "version": "1.0.0",
  "author": "Dein Name",
  "category": "Productivity",
  "description": "Kurze Beschreibung der App.",
  "icon": "🚀",
  "permissions": ["readFile", "listFiles", "sendMessage"],
  "minVibeAgentGo": "2607.9.4",
  "license": "MIT"
}
</script>
```

### Pflichtfelder

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `id` | `string` | Eindeutige App-ID im Format `autor.name` oder umgekehrte Domain. |
| `name` | `string` | Anzeigename der App. |
| `version` | `string` | Semver-Version, z.B. `1.0.0`. |
| `author` | `string` | Name oder Alias des Autors. |
| `category` | `string` | Eine der erlaubten Kategorien. |

### Optionale Felder

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| `description` | `string` | Kurze Beschreibung für den Store. |
| `icon` | `string` | Ein einzelnes Emoji als App-Icon (z.B. `🚀`). |
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

## Lokale Installation

Jede App ist ein normaler Workspace-Ordner. Um eine App lokal zu installieren, kopiere sie nach `apps/<Category>/<id>/`. Der App Store bietet dafür ein komfortables UI.

Nach dem Kopieren ist die App sofort im **Explorer** sichtbar und startbar. Keine versteckten IndexedDB-Speicher, keine Registry.

## Tool Kit

Das Tool Kit unter `scripts/` hilft beim Erstellen, Validieren und Veröffentlichen von Apps.

| Befehl | Beschreibung |
|--------|-------------|
| `npm run validate` | Prüft alle Apps auf Schema und Sicherheit. |
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
- [x] Single-HTML-Format mit eingebettetem Manifest und Emoji-Icon
- [ ] Update-Mechanismus für installierte Apps
- [ ] Eigene App-Symbole im Dock rendern
- [ ] CORS-Proxy für externe App-Quellen

## License

MIT License — Copyright Lars Greipl - vibeops.de

## NOTICE

This project was created with assistance from AI models including:

- Kimi K2.7 Code (Moonshot AI)

AI-generated code and content are used under the MIT license terms.
