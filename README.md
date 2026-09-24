# FH2 Integration Skill

**FH2 Integration Skill** is an AI-ready integration guide for system integrators building middleware around **DJI Dock**, **FlightHub 2 (司空 2)**, and two workflow scenarios: **DFR (Dock as First Responder)** emergency response and **inspection / patrol**.

> Historical note: this skill was previously named `awesome-dfr-integration-skill`. It now covers both DFR and inspection scenarios and is named `fh2-integration-skill`.

It packages DFR whitepaper best practices, inspection workflow guidance, and FlightHub 2 OpenAPI boundary guidance into a reusable skill for Claude Code, Cursor, and similar AI-assisted development environments.

> Version: `1.3.0-rc`  
> Last updated: `2026-08-06`

## What this skill helps with

- **DFR / emergency response**
  - CAD / alarm system to FlightHub 2 dispatch middleware
  - VMS / command center livestream integration
  - GIS / PSIM telemetry integration
  - evidence archive and media sync integration
- **Inspection / patrol**
  - wayline upload and sync to the FH2 route library + planned / periodic task dispatch
  - inspection media → AI / VLM defect recognition → third-party analysis platform
  - 3D reconstruction / point cloud / model sync
- **Common**
  - Event API callback handling
  - FlightHub Sync / OpenAPI / MQTT Bridge interface selection
  - Public Cloud vs On-Premises / AIO API boundary checks
  - implementation plans, test plans, and security guardrails

## Two gates

This skill applies two mandatory gates, in order.

1. **Deployment gate (first):** FlightHub 2 deployment model — Public Cloud / On-Premises / AIO. Determines the API surface and authentication model.
2. **Scenario gate (second):** DFR / emergency vs inspection / patrol. Determines interface selection, data flow, and security focus.

For this skill, AIO and On-Premises share the same integration interface and OpenAPI scope; private deployment / AIO exposes a broader API surface.

The skill must confirm the deployment model before recommending endpoints, and must confirm the scenario before selecting interfaces. The skill must not infer the deployment model from token format, URL patterns, domain names, screenshots, customer region, or other context clues. Do not apply DFR real-time-takeover logic to inspection; do not apply inspection periodic-scheduling logic to DFR.

## Important boundaries

- **Frontend Components / `paas.js`**: supported only on On-Premises / AIO private deployment. Do not recommend them for Public Cloud.
- **Private deployment OpenAPI V2.0 default module**: supported only on On-Premises / AIO private deployment. Public Cloud must use the Public Cloud OpenAPI V2.0 reference.
- **Event API**: supported on both Public Cloud and private deployment. Exact event types, payload schemas, and configuration paths require deployment-specific documentation verification.
- **Auto Dispatch Workflow header casing**: DFR workflow guidance uses lowercase `x-project-uuid`, while many OpenAPI references use PascalCase `X-Project-Uuid`. Verify the required casing before generating production dispatch code.
- **Scenario mixing**: design each scenario separately; mark shared components (S3 storage, Event API) and scenario-specific components explicitly.

## Repository structure

```text
fh2-integration-skill/
├── SKILL.md                              # skill entry: workflow, SOP, STOP checkpoints, output template
├── README.md / README.zh-CN.md
├── USER-GUIDE.html / 使用说明.html         # standalone end-user guides (EN + zh-CN)
├── CHANGELOG.md
├── references/                           # knowledge base (fact layer)
│   ├── README.zh-CN.md                       # Chinese reading guide (index, not a translation)
│   ├── api-guardrails.md                     # anti-hallucination & security baseline (highest priority)
│   ├── capability-overview.md                # capability menu for non-developers (explain & select)
│   ├── scenario-dfr-vs-inspection.md         # scenario decision (DFR vs inspection)
│   ├── dfr-integration-architecture.md       # DFR architecture & interface selection
│   ├── inspection-integration-architecture.md# inspection architecture & interface selection
│   ├── integrate-with-existing-system.md     # connect FH2 into an existing platform (adapter layer)
│   ├── demo-localization.md                  # language detection & UI copy localization
│   ├── dfr-whitepaper-summary.md             # DFR operational best practices
│   ├── fh2-openapi-v2-private-default.md      # private deployment default-module API scope
│   ├── fh2-openapi-v2-public-vs-private.md    # deployment boundary decision logic
│   ├── middleware-patterns.md                # middleware patterns (DFR + inspection, 9 total)
│   └── source-map.md                         # source provenance & latest-doc links
├── adapters/                             # IDE adapters
│   ├── claude-code-usage.md / .zh-CN.md      # how to use it in Claude Code / OpenCode
│   └── cursor-rules.md
├── evals/                               # quality evaluation
│   ├── evals.json                            # 14 test cases (incl. adversarial)
│   └── eval-runbook.md / .zh-CN.md           # release gate: 13/14 pass, no critical failure
├── examples/
│   └── dfr-public-cloud-demo/                # runnable DFR Public Cloud demo (DFR-only, not production)
└── CHANGELOG.md
```

## Installation

### Claude Code / OpenCode-style skill folder

Copy this repository into your local skills directory:

```bash
mkdir -p ~/.config/opencode/skills
git clone https://github.com/owen-z-good-student/Irving-DJI.git \
  ~/.config/opencode/skills/fh2-integration-skill
```

Restart your AI coding environment after installation.

### Cursor

Use the adapter in:

```text
adapters/cursor-rules.md
```

Copy the rule content into your project's `.cursor/rules/fh2-integration.mdc` file.

### Included demo (optional)

A runnable DFR Public Cloud reference implementation ships under:

```text
examples/dfr-public-cloud-demo/
```

See `QUICKSTART.md` to run it locally. It is DFR-only and teaching-grade, not production — read `LIMITATIONS.md` before any reuse.

## Example prompts

```text
Use FH2 Integration Skill to design a FlightHub 2 On-Premises DFR middleware for CAD alarm dispatch, VMS livestream, GIS telemetry, and evidence archiving.
```

```text
We use FlightHub 2 Public Cloud. Help design a VMS livestream integration for a DFR command center without using Frontend Components.
```

```text
We are on AIO. Design a DFR middleware using private deployment OpenAPI capabilities, Event API, MQTT Bridge, and Frontend Components.
```

```text
Inspection / patrol scenario, On-Premises. Design a wayline upload + sync, planned periodic task dispatch, inspection media → AI/VLM defect analysis, and 3D model sync middleware.
```

## Latest API references

OpenAPI documentation may continue to evolve. Verify exact endpoint schemas against the latest Apifox references before production development.

**English:**

- On-Premises / default module: <https://41b04hdzmc.apifox.cn/>
- Public Cloud OpenAPI V2.0: <https://s.apifox.cn/5113ab93-b1c2-4f3c-bc06-c3656c5352fb>

**Chinese:**

- On-Premises / default module: <https://henvmbbf6x.apifox.cn/8983503m0>
- Public Cloud OpenAPI V2.0: <https://s.apifox.cn/4de4a239-c2cc-4572-9b65-90738289f37a>

The two editions are separate Apifox projects and may drift; check both if an endpoint appears missing.

## Evaluation

The repo includes an internal evaluation set:

```text
evals/evals.json          # 14 test cases (incl. adversarial)
evals/eval-runbook.md     # release gate and manual test guidance
```

The current release candidate expects at least **13 / 14 evals** to pass with no critical failure.

## Disclaimer

This skill is an integration design aid. It is not a replacement for official DJI documentation, customer security review, legal review, aviation approval, production validation, or professional engineering judgment. Always verify endpoint schemas, authentication behavior, permissions, and deployment-specific capabilities in the latest official documentation before production use.

## License

No open-source license is granted at this time. Use is subject to applicable DJI documentation and integration terms.
