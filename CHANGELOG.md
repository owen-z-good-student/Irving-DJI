# Changelog

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
