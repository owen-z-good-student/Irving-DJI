# Localization — Serving Global Users

Last updated: 2026-08-05

## Purpose

FH2 integrations and demo platforms are increasingly used by non-Chinese-speaking system integrators. This file defines how the assistant detects the user's language and adapts generated UI copy, so a demo or middleware built from this skill can serve global users.

Two distinct concerns — do not confuse them:

| Concern | Meaning | Rule |
|---|---|---|
| **Conversation language** | The language you reply in | Match the user's input language |
| **Artifact language** | The language of generated UI copy, labels, alerts | Follow the rules below |

## Language detection rules

Detect the user's language from their **input**, in this priority order:

1. **Explicit instruction** — the user states the target language ("make the UI English", "用中文"). Always wins.
2. **Language of the user's message** — if the user writes in Chinese, treat as `zh`; otherwise infer from the script/language used.
3. **Existing project convention** — if the codebase already ships localized copy, follow it.
4. **Default** — when nothing else applies, produce **bilingual** output (Chinese + English) rather than guessing.

Never infer language from the deployment region, IP, or company name.

## What to localize

Localize **user-facing copy** only:

- page titles, menu labels, button text
- alerts, confirmations, toasts, error messages
- form labels, placeholders, table headers
- footer notices and safety warnings

Do **not** translate:

- code identifiers, variable names, API field names
- endpoint paths, header names (`X-User-Token`, `x-project-uuid`)
- log messages intended for operators/developers (keep stable for grep)
- device SNs, UUIDs, protocol keywords (RTMP, MQTT, S3)

## Runtime language selection (for generated apps)

When building a demo or front end that must serve global users, implement detection in this order:

```text
URL parameter (?lang=en)        ← highest, useful for demos and sharing
  → stored user choice (localStorage)
  → browser language (navigator.languages / navigator.language)
  → default
```

Normalize to a small set (for example `zh` / `en`). Keep a fallback so a missing translation renders the other language instead of an empty string.

Reference implementation: `examples/dfr-public-cloud-demo/frontend/src/utils/locale.js`.

## Data-driven copy pattern

Prefer storing both languages in config/data rather than branching in templates:

```json
{
  "name": "高德地图（中国大陆推荐）",
  "nameEn": "AMap (Recommended for Mainland China)",
  "switchNotice": {
    "message": "……中文安全提示……",
    "messageEn": "……English safety notice……"
  }
}
```

Then select at load time with a helper such as `pickText(zh, en)`. This keeps templates clean and makes it easy to add copy without touching components.

## Locale-driven functional defaults

Language can also drive **functional** defaults, not just text. The canonical example is basemap selection:

| User locale | Default basemap | Reason |
|---|---|---|
| `zh` | AMap (高德) | Reachable and appropriate in Mainland China |
| other | Google Maps | Reachable and expected outside Mainland China |

Implement this with a `localeDefaults` map in config, falling back to a global `defaultKey`, then to the first available option. Never hard-code a single provider when the audience is global.

Apply the same thinking to: date/number formats, units, map center, and default language of any embedded provider.

## Safety copy must never be lost in translation

Safety-critical notices (coordinate offset warnings, takeover reminders, "do not use in production" banners) MUST:

- exist in every supported language
- keep the same operational meaning and urgency
- never be shortened into a vague phrase

If an English version is missing for a safety notice, surface the Chinese one rather than dropping it.

Canonical example — the AMap coordinate-offset warning must convey all of: map positions are offset, use the dock position as reference, assign tasks within ~10 m of the dock, keep watching the virtual cockpit and be ready to take over.

## Checklist when localizing an existing demo

- [ ] Detect language centrally in one utility, not scattered across components
- [ ] Move hard-coded strings into config or a text helper
- [ ] Provide `zh` + `en` for every user-facing string
- [ ] Add locale-driven defaults where a provider is region-specific (maps, tiles, CDN)
- [ ] Verify safety notices exist in all languages
- [ ] Provide `?lang=` override so a demo can be shown in either language
- [ ] Leave logs, API fields, and identifiers untranslated

## Boundary

Localization changes presentation only. It must never change:

- which API endpoints are called
- the deployment gate or scenario gate logic
- security guardrails or verification requirements
