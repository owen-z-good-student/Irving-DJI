---
name: awesome-dfr-integration-skill
description: Use this skill when designing DFR, DJI Dock, or FlightHub 2 middleware integrations for CAD, VMS, GIS, PSIM, evidence, dispatch, telemetry, livestream, media sync, Event API, or OpenAPI workflows. The skill guides AI coding assistants to ask the FlightHub 2 deployment model first, choose Public Cloud or On-Premises API boundaries correctly, and produce integration architecture, API mapping, implementation plans, and guardrails for system integrators. Do not use for generic drone marketing copy, non-DFR operations, or unsupported API invention.
intent: Help system integrators design lower-friction FlightHub 2 integration middleware using DFR best practices and deployment-aware OpenAPI guidance.
type: workflow
last_updated: 2026-06-24
version: 1.0.0-rc
---

# Awesome DFR Integration Skill

## Skill goal

Help a system integrator design practical middleware around DJI Dock and FlightHub 2 for DFR scenarios, using deployment-aware FH2 interface selection, API boundaries, security guardrails, and staged implementation logic.

## Trigger keywords / trigger contexts

Use this skill when the user asks for any of the following:

- DFR middleware architecture
- DJI Dock / FlightHub 2 integration design
- CAD to FlightHub 2 dispatch integration
- VMS livestream integration
- GIS / PSIM telemetry integration
- evidence system / media archive integration
- FH2 OpenAPI / Event API / FlightHub Sync selection
- Public Cloud vs On-Premises FH2 API boundary
- Claude Code / Cursor assistance for FH2 middleware design

Do not use this skill for:

- general drone sales copy
- drone regulation analysis without integration design
- creating fake API endpoints
- bypassing FH2 permissions, authentication, security controls, or customer IT review
- operating real customer systems without explicit credentials and authorization

## Highest-priority deployment gate

Before giving any FH2 OpenAPI recommendation, first determine the FlightHub 2 deployment model.

Ask this exact question if the deployment model is not already known:

```text
Which FlightHub 2 deployment model are you integrating with?

1. FlightHub 2 Public Cloud
2. FlightHub 2 On-Premises / Private Deployment
3. AIO / private all-in-one appliance

The API surface and authentication model differ by deployment type, so I need this before recommending endpoints.
```

Rules:

- If the user answers **Public Cloud**, use only Public Cloud OpenAPI capabilities and public-cloud authentication patterns.
- If the user answers **On-Premises / Private Deployment**, use FH2 OpenAPI V2.0 On-Premises default module as the primary API reference. This deployment exposes a broader API surface.
- If the user answers **AIO**, treat it as equivalent to On-Premises / Private Deployment for integration interfaces and OpenAPI scope.
- If the deployment model is unknown, do not recommend concrete endpoints. Ask the deployment gate question first.
- Never infer the deployment model from token format, URL patterns, domain names, screenshots, customer region, or other context clues. If the user has not explicitly stated the deployment model, ask the deployment gate question.
- If the user requests an API not present in the relevant deployment reference, say it is not confirmed and direct the user to the latest Apifox reference.

## Karpathy-style execution principles

Use these principles whenever this skill moves from architecture advice into implementation planning, code generation, or repository changes.

1. **Think before coding** — State assumptions, ambiguities, and tradeoffs first. If the deployment model, target system, auth model, or acceptance criteria are unclear, ask before proceeding.
2. **Simplicity first** — Choose the smallest middleware design that satisfies the workflow. Do not add speculative abstractions, multi-tenant platforms, databases, queues, admin portals, or configuration layers unless the requirement demands them.
3. **Surgical changes** — If editing an existing project, touch only files directly required for the integration. Do not refactor unrelated code, rename unrelated modules, or clean up adjacent logic. List expected touched files before editing.
4. **Goal-driven execution** — Convert the task into verifiable goals before implementation. Finish with verification commands, observed results, and any unverified items.

## STOP checkpoints

Stop and ask for confirmation before proceeding when any of these conditions apply:

1. **Deployment is unknown** — ask the deployment gate question before endpoint guidance.
2. **Auth model is unclear** — do not generate final API code until token / OAuth / local account / SSO expectations are confirmed or clearly marked as placeholders.
3. **Production control is involved** — pause before generating or recommending code that can create tasks, dispatch drones, acquire control authority, execute flight commands, control payloads, or alter device configuration.
4. **Real customer systems are involved** — pause before operating or giving commands for live CAD, VMS, GIS, PSIM, evidence, MQTT broker, S3 bucket, or FH2 environments.
5. **Endpoint is not verified** — if an endpoint, event type, MQTT topic, or header is not confirmed in the relevant deployment reference, stop and direct the user to verify in Apifox.

When a STOP checkpoint is reached, respond with:

```text
STOP — I need confirmation before continuing.
Reason: [checkpoint reason]
Please confirm: [specific item needed]
```

## Source hierarchy

Use the bundled references in this order:

1. `references/api-guardrails.md` — mandatory constraints and anti-hallucination rules.
2. `references/fh2-openapi-v2-public-vs-private.md` — deployment decision logic.
3. `references/fh2-openapi-v2-private-default.md` — private deployment default module scope.
4. `references/dfr-integration-architecture.md` — DFR architecture and interface selection.
5. `references/middleware-patterns.md` — common middleware patterns.
6. `references/dfr-whitepaper-summary.md` — DFR operational best practices.
7. `references/source-map.md` — source provenance and latest-doc links.

If a task requires exact request/response schemas, tell the user to verify against the latest Apifox documentation before coding against production:

- On-Premises / default module: `https://41b04hdzmc.apifox.cn/`
- Public Cloud OpenAPI V2.0: `https://s.apifox.cn/5113ab93-b1c2-4f3c-bc06-c3656c5352fb`

## SOP

Follow this workflow for every integration task.

### Step 1 — Confirm deployment and target system

Confirm:

- FH2 deployment model: Public Cloud / On-Premises / AIO
- target system: CAD, VMS, GIS, PSIM, evidence, archive, dashboard, AI analytics, or another platform
- integration domain: dispatch trigger, livestream, telemetry, media, events, control, frontend embedding
- production phase: PoC, integration validation, security review, production deployment

If any of these are missing, ask only the questions that change the design.

The deployment model is never optional for FH2 OpenAPI guidance. Do not infer it silently.

### Step 2 — Pick the integration interface

Use this default mapping:

| Requirement | Preferred interface | Notes |
|---|---|---|
| Alarm-to-drone response | Auto Dispatch Workflow / inbound trigger | CAD or alarm system triggers FH2 workflow. |
| Programmatic state query or command | OpenAPI | Deployment-specific API surface applies. |
| Livestream to VMS / command center | FlightHub Sync or OpenAPI livestream | Pick protocol by target platform and latency. |
| Real-time telemetry to GIS / PSIM | Public Cloud Telemetry Data Forwarding or On-Premises MQTT Bridge | Public Cloud pushes to customer broker; On-Premises uses broker bridge. |
| Media / evidence archive | FlightHub Sync S3 + Event API | S3-compatible storage is preferred. |
| Event-driven downstream actions | Event API | Validate `x-dji-signature`, use idempotency. |
| Embedded drone UI | Frontend Components | On-Premises / AIO private deployment only. Not supported on Public Cloud. |

### Step 3 — Apply deployment-specific API boundary

Use `references/fh2-openapi-v2-public-vs-private.md` before naming endpoints.

Public Cloud patterns:

- Use Public Cloud OpenAPI V2.0 scope.
- Authentication commonly uses `X-User-Token`, `X-Project-Uuid`, and related public-cloud headers.
- Do not assume Frontend Components or private-only operational APIs are available.

On-Premises / Private Deployment patterns:

- Use the default module OpenAPI V2.0 reference as the primary API source.
- The API surface is broader than Public Cloud.
- On-Premises supports deeper control, frontend components, private network integration, and broader administrative / operations APIs.
- OAuth 2.0 and local / third-party account patterns may apply depending on deployment configuration.
- AIO uses the same integration interface and OpenAPI scope as On-Premises / Private Deployment for the purposes of this skill.

### Step 4 — Produce an integration design

For architecture tasks, output:

1. Deployment assumption and confirmation status
2. Target workflow summary
3. Recommended architecture
4. Interface / API mapping
5. Data flow
6. Security and permission controls
7. Implementation phases
8. Test plan
9. Open questions and must-verify items

### Step 5 — Produce coding guidance only after boundaries are clear

When the user asks for code, first provide a short implementation plan and specify which endpoints must be verified in Apifox.

For Auto Dispatch Workflow / inbound trigger code, explicitly warn that the DFR whitepaper uses lowercase `x-project-uuid`, while many OpenAPI references use PascalCase `X-Project-Uuid`. Do not silently normalize this header. Verify the required casing in the latest workflow documentation before generating production dispatch code.

Apply the Karpathy-style execution principles before generating code:

- state assumptions and uncertainties
- choose the minimum implementation path
- list the files or modules that would be touched
- define acceptance criteria and verification steps

When generating code:

- Use placeholders for tokens, project UUIDs, device SNs, URLs, and secrets.
- Never hardcode customer credentials.
- Add retry, timeout, logging, and idempotency behavior for event-driven flows.
- Separate FH2 adapter logic from CAD / VMS / GIS / evidence business logic.
- Mark all endpoint schemas as requiring final verification against the relevant Apifox documentation.

## Output specification

Default response structure:

```md
# [Integration Title]

## 1. Deployment Gate
- Deployment model:
- API boundary:
- Must verify:

## 2. Recommended Architecture
- Components:
- Data flow:
- Why this pattern:

## 3. Interface / API Mapping
| Need | FH2 interface | Candidate API / protocol | Deployment note | Verification source |
|---|---|---|---|---|

## 4. Implementation Plan
### Phase 1 — Validate
### Phase 2 — Integrate
### Phase 3 — Harden

## 5. Security Guardrails
- Auth:
- Permissions:
- Network:
- Audit:
- Data retention:

## 6. Test Plan
- Happy path:
- Failure path:
- Security checks:

## 7. Open Questions
- [ ] ...
```

For simple questions, answer directly but still honor the deployment gate.

## Critical guardrails

- Do not invent FH2 endpoints, headers, event types, MQTT topics, or control commands.
- Do not mix Public Cloud and On-Premises API surfaces.
- Do not treat the DFR whitepaper as a complete API manual.
- Do not claim regulatory or customer compliance approval from technical architecture alone.
- Do not recommend production flight control automation without human-in-the-loop, permissions, and customer safety review.
- Always distinguish verified facts from assumptions.
