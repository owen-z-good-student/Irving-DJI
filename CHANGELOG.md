# Changelog

## 1.3.0-rc — 2026-08-06

- **Wayline sync path corrected after live verification.** FH2 sync is **directionally asymmetric**: FH2 writes *out* to `wayline/fh_sync/{org}/{project}/wayline/{file}` (it prepends `wayline/` itself), but only ingests *in* from `fh_sync/{org}/{project}/wayline/{file}` — the leading prefix must be absent. `wayline.prefix` now defaults to an empty string. Documented in `inspection-integration-architecture.md` and the demo `ARCHITECTURE.md`.
- Demo: the wayline list now labels each entry **本端上传 / 司空 2 同步** by inspecting where `fh_sync/` sits in the key. A consequence of the asymmetry is that an ingested wayline appears **twice** in the bucket under two keys; deduplicate by the `name_base64` object tag, not by object key.
- `SKILL.md`: added **Proactively offer the local dispatch trial** to the scenario gate. When deployment = Public Cloud and scenario = DFR or Both, surface once that dispatch is **outbound-only** and therefore runs from `localhost` with no server, public IP, or tunnel. Offer is capped at one mention and must carry the real-hardware safety notice.
- `QUICKSTART.md`: new section on local trial without a server, including the outbound-vs-inbound traffic-direction table that explains why Event API, MQTT telemetry, and wayline sync need public ingress while dispatch does not.
- **Bilingual documentation links.** The Chinese Apifox editions were present only in `README.zh-CN.md`, so the AI served English-only links to Chinese users. Added both editions to `SKILL.md`, `README.md`, and four references, plus a rule in **Language handling** to select by conversation language. Noted that the EN and ZH editions are **separate Apifox projects, not translations**, and may drift — check both before concluding a capability is missing.
- Added `USER-GUIDE.html` (EN) and `使用说明.html` (zh-CN): standalone end-user guides covering the two gates, how to ask, demo scope, and safety boundaries.
- Fixed stale references: `adapters/cursor-rules.md` still used the pre-rename `awesome-dfr-integration.mdc`; demo `README.md` and `ARCHITECTURE.md` still described the wayline module as a teaching STUB after it became a working implementation.
- Corrected an incorrect claim carried in the 1.3.0-rc (08-05) notes: sync is **incremental**, deletions do **not** propagate.

## 1.3.0-rc — 2026-08-05

- `inspection-integration-architecture.md`: documented **two** ways to get a wayline into the FH2 route library — (A) writing the file into a **FlightHub Sync mounted external bucket**, which syncs bidirectionally and requires no wayline OpenAPI call, and (B) the wayline OpenAPI endpoint family. Added the operational caveats of Option A: sync latency, and that sync is **incremental — additions propagate both ways, deletions do not**.
- Demo: replaced the wayline teaching STUB with a **working implementation** based on Option A. Uploads are now really written to the mounted MinIO bucket, and the list reflects both locally uploaded and FH2-synced waylines. Added `wayline.bucket` / `wayline.prefix` config fields.
- Demo: `POST /api/wayline/plan-task` now honestly returns **501 Not Implemented** — creating a flight task still requires `/openapi/v0.1/flight-task`, and the demo does not fabricate it.

- Added `references/demo-localization.md`: language detection priority, what to localize vs. leave untranslated, runtime detection order (`?lang=` → localStorage → browser → default), data-driven bilingual copy pattern, locale-driven functional defaults, and a rule that safety-critical notices must exist in every language.
- Added a **Language handling** section to `SKILL.md`: reply in the user's input language, localize generated UI copy, and allow locale to drive region-specific provider defaults — without ever altering API selection, gate logic, or guardrails.
- Demo: renamed the platform title to `司空2 集成能力演示Demo【请勿用于生产环境】` to make its non-production status explicit.
- Demo: removed all Tianditu basemaps (usage-quota constrained). Basemaps are now AMap, Google Maps, Google Satellite, and OpenStreetMap.
- Demo: basemap now defaults by locale (Chinese → AMap, other → Google Maps) via a `localeDefaults` map, falling back to `defaultKey` then the first available option.
- Demo: the AMap coordinate-offset safety warning now also appears on **first load** of the default basemap, not only when switching. Previously a Chinese user landing on AMap would never see it.
- Demo: basemap names and safety notices are bilingual; added `frontend/src/utils/locale.js` as the single language-detection utility.
- Demo: **every** basemap now carries a coordinate-system offset disclosure, differentiated by actual risk rather than a copy-pasted generic warning — AMap `GCJ-02` (high), Google vector `GCJ-02` in Mainland China / `WGS-84` elsewhere (medium), Google satellite `WGS-84` (low, with imagery-currency and layer-misalignment caveats), OSM `WGS-84` (low, with data-currency caveat). Each basemap declares `coordinateSystem` and `offsetRisk`, and every notice carries the same operational guidance (dock position is authoritative, assign within ~10 m, stay ready to take over).
- Added `api-guardrails.md` §6.1 **Map coordinate-system disclosure**: disclosing only the obviously offset basemap is not acceptable, because silence on the others implies "no risk". Notices must fire on first load of the default basemap as well as on every switch.

## 1.2.0-rc — 2026-07-09

Targeted three real user scenarios: experienced developers blocked by scattered docs, non-developers exploring capability, and semi-technical users demoing then integrating.

- Added an explicit **"prefer MCP when available"** rule: when a FlightHub 2 / Apifox OpenAPI MCP is present, read real endpoints and schemas via MCP before recommending endpoints or editing code. Falls back to Apifox links otherwise; still never invents endpoints.
- Added a lightweight **requirement-to-endpoint match table** output template for developers who need API matching rather than a full architecture, including honest `full / partial / none` coverage and an explicit gaps section.
- Added `references/capability-overview.md`: plain-language capability menu per scenario, deployment-limited capability table, a guided conversation flow for non-developers, and typical starter plans.
- Added `references/integrate-with-existing-system.md`: adapter-layer principle, three integration depths (Notify / Consume / Control), a demo-part reuse table, guidance on accounts, embedded UI, livestream, events and storage, and a "demo now, integrate later" sequence.
- Updated README (English and Chinese) with a three-user-type table and an OpenAPI MCP section.
- Added Chinese versions of the human-facing docs: `adapters/claude-code-usage.zh-CN.md` and `evals/eval-runbook.zh-CN.md`, with language cross-links.
- Documented the language policy: human-facing docs are bilingual; `SKILL.md` and `references/` stay English-only to preserve instruction-following precision and a single source of truth.
- Added `references/README.zh-CN.md`: a Chinese reading guide (directory-level index, not a translation) covering how `SKILL.md` and each reference file work together, per-file summaries with "when it applies", and a quick lookup table.

## 1.1.0-rc — 2026-07-09

- Renamed skill from `awesome-dfr-integration-skill` to `fh2-integration-skill` to reflect coverage of both DFR and inspection scenarios.
- Added a second gate: scenario gate (DFR / emergency vs inspection / patrol), applied after the deployment gate.
- Added `references/inspection-integration-architecture.md`: inspection five-stage workflow, interface selection (wayline, planned task, capture, media, AI/VLM, model), deployment notes, and safety guardrails.
- Added `references/scenario-dfr-vs-inspection.md`: scenario comparison, decision tree, mismatch red lines, and shared vs scenario-specific components.
- Marked `dfr-integration-architecture.md` as DFR-only and cross-linked the inspection reference.
- Split the SOP Step 2 interface mapping into DFR and inspection tables.
- Added middleware Patterns 7–9 (scheduled inspection dispatch, inspection media to AI/VLM analysis, model/reconstruction sync).
- Added inspection safety and data guardrails to `api-guardrails.md`, plus an explicit two-gate note.
- Updated adapters (Claude Code, Cursor) with scenario gate and inspection examples.
- Added evals 10–14 for inspection and scenario-mismatch coverage; raised passing threshold to 13/14 and added scenario confusion as a critical failure.
- Added `examples/dfr-public-cloud-demo/`: a runnable DFR Public Cloud reference implementation (DFR-only, teaching-grade), with a wayline upload → sync → planned-task page, de-identified config, README/QUICKSTART, architecture mapping, and a limitations/production checklist.

## 1.0.0-rc — 2026-06-24

- Created initial Awesome DFR Integration Skill draft.
- Added mandatory FlightHub 2 deployment gate: Public Cloud / On-Premises / AIO.
- Strengthened deployment gate: deployment model must not be inferred from token format, URL patterns, domains, screenshots, region, or context clues.
- Added STOP checkpoints for unknown deployment, unclear auth model, production control, live customer systems, and unverified APIs.
- Added Karpathy-style execution principles: think before coding, simplicity first, surgical changes, and goal-driven execution.
- Added Public Cloud vs On-Premises OpenAPI boundary guidance.
- Clarified that AIO and On-Premises share the same integration interface and OpenAPI scope for this skill.
- Clarified that Frontend Components and private-deployment OpenAPI V2.0 default module are private deployment / AIO only, while Public Cloud uses its own Public Cloud OpenAPI V2.0 reference.
- Clarified that Event API is supported on both Public Cloud and private deployment, with exact event types and payloads requiring deployment-specific Apifox verification.
- Added wrong examples to block Public Cloud / private-deployment API mixing.
- Hardened Frontend Components rule: only On-Premises / AIO private deployment supports this path; Public Cloud must not use `paas.js` / Frontend Components.
- Elevated Auto Dispatch Workflow header-casing warning into the main Skill code-generation flow.
- Added eval runbook for internal 1.0-rc testing.
- Added On-Premises default module reference summary.
- Added DFR architecture, middleware patterns, and API guardrails.
- Added Claude Code and Cursor adapter guidance.
- Added initial and adversarial evaluation prompts.
- Removed maintainer-local filesystem paths from source map.
