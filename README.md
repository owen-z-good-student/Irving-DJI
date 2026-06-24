# Awesome DFR Integration Skill

**Awesome DFR Integration Skill** is an AI-ready integration guide for system integrators building middleware around **DJI Dock**, **FlightHub 2**, and **Dock as First Responder (DFR)** workflows.

It turns the DFR white paper’s architecture, workflow, deployment, and FlightHub 2 integration guidance into structured context for AI coding assistants such as Claude Code, OpenCode, Cursor, and similar tools. The goal is to help integrators move faster from DFR reference design to middleware planning while staying inside the correct FlightHub 2 deployment and API boundaries.

> Version: `1.0.0-rc`  
> Last updated: `2026-06-24`

## What this skill helps with

- CAD / alarm system to FlightHub 2 dispatch middleware
- VMS / command center livestream integration
- GIS / PSIM telemetry integration
- evidence archive and media sync workflows
- Event API callback handling
- FlightHub Sync / OpenAPI / MQTT Bridge interface selection
- Public Cloud vs On-Premises / AIO API boundary checks
- implementation planning, test planning, and security guardrails

## Core principle

The skill must confirm the FlightHub 2 deployment model before recommending APIs:

1. **FlightHub 2 Public Cloud**
2. **FlightHub 2 On-Premises / Private Deployment**
3. **AIO / private all-in-one appliance**

The API surface and authentication model differ by deployment type. **AIO and On-Premises share the same integration interface and OpenAPI scope for this skill.** Public Cloud uses its own Public Cloud OpenAPI V2.0 reference. Private deployment / AIO exposes a broader API surface and is the default reference path when the user confirms On-Premises / AIO.

The skill must not infer deployment model from token format, URL patterns, domain names, screenshots, customer region, or other context clues.

## Important boundaries

- **Frontend Components / `paas.js`**: supported only on On-Premises / AIO private deployment. Do not recommend them for Public Cloud.
- **Private deployment OpenAPI V2.0 default module**: supported only on On-Premises / AIO private deployment. Public Cloud must use the Public Cloud OpenAPI V2.0 reference.
- **Event API**: supported on both Public Cloud and private deployment. Exact event types, payload schemas, and configuration paths still require deployment-specific documentation verification.
- **Auto Dispatch Workflow header casing**: DFR workflow guidance uses lowercase `x-project-uuid`, while many OpenAPI references use PascalCase `X-Project-Uuid`. Verify the required casing before generating production dispatch code.

## Repository structure

```text
awesome-dfr-integration-skill/
├── SKILL.md
├── README.md
├── CHANGELOG.md
├── references/
│   ├── api-guardrails.md
│   ├── dfr-integration-architecture.md
│   ├── dfr-whitepaper-summary.md
│   ├── fh2-openapi-v2-private-default.md
│   ├── fh2-openapi-v2-public-vs-private.md
│   ├── middleware-patterns.md
│   └── source-map.md
├── adapters/
│   ├── claude-code-usage.md
│   └── cursor-rules.md
└── evals/
    ├── evals.json
    └── eval-runbook.md
```

## Installation

### Claude Code / OpenCode-style skill folder

Copy this repository into your local skills directory:

```bash
mkdir -p ~/.config/opencode/skills
git clone https://github.com/owen-z-good-student/awesome-dfr-integration-skill.git \
  ~/.config/opencode/skills/awesome-dfr-integration-skill
```

Restart your AI coding environment after installation.

### Cursor

Use the adapter in:

```text
adapters/cursor-rules.md
```

Copy the rule content into your project’s `.cursor/rules/awesome-dfr-integration.mdc` file.

## Example prompts

```text
Use Awesome DFR Integration Skill to design a FlightHub 2 On-Premises DFR middleware for CAD alarm dispatch, VMS livestream, GIS telemetry, and evidence archiving.
```

```text
We use FlightHub 2 Public Cloud. Help design a VMS livestream integration for a DFR command center without using Frontend Components.
```

```text
We are on AIO. Design a DFR middleware using private deployment OpenAPI capabilities, Event API, MQTT Bridge, and Frontend Components.
```

## Latest API references

OpenAPI documentation may continue to evolve. Verify exact endpoint schemas against the latest Apifox references before production development:

- On-Premises / default module: <https://41b04hdzmc.apifox.cn/>
- Public Cloud OpenAPI V2.0: <https://s.apifox.cn/5113ab93-b1c2-4f3c-bc06-c3656c5352fb>

## Evaluation

The repo includes an internal evaluation set:

```text
evals/evals.json
evals/eval-runbook.md
```

The current release candidate expects at least **8 / 9 evals** to pass with no critical failure.

## Disclaimer

This skill is an integration design aid. It is not a replacement for official DJI documentation, customer security review, legal review, aviation approval, production validation, or professional engineering judgment. Always verify endpoint schemas, authentication behavior, permissions, and deployment-specific capabilities in the latest official documentation before production use.

## License

No open-source license is granted at this time. Use is subject to applicable DJI documentation and integration terms.
