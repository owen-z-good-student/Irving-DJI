---
name: fh2-integration-skill
description: Use this skill when designing DJI Dock or FlightHub 2 (司空 2) middleware integrations for CAD, VMS, GIS, PSIM, evidence, dispatch, telemetry, livestream, media sync, Event API, or OpenAPI workflows. It covers two workflow scenarios — DFR / emergency response (alarm-driven, real-time livestream and human takeover) and inspection / patrol (plan-driven, periodic tasks, wayline planning, media capture, defect/AI/VLM recognition, data analysis and sharing). The skill guides AI coding assistants to ask the FlightHub 2 deployment model first, then the workflow scenario, choose Public Cloud or On-Premises API boundaries correctly, and produce integration architecture, API mapping, implementation plans, and guardrails for system integrators. Do not use for generic drone marketing copy, unrelated operations, or unsupported API invention.
intent: Help system integrators design lower-friction FlightHub 2 integration middleware for both DFR and inspection scenarios, using deployment-aware and scenario-aware OpenAPI guidance.
type: workflow
last_updated: 2026-08-06
version: 1.3.0-rc
---

# FH2 Integration Skill

## Skill goal

Help a system integrator design practical middleware around DJI Dock and FlightHub 2 (司空 2) for two scenarios — DFR / emergency response and inspection / patrol — using deployment-aware and scenario-aware FH2 interface selection, API boundaries, security guardrails, and staged implementation logic.

## Trigger keywords / trigger contexts

Use this skill when the user asks for any of the following:

**DFR / emergency scenario**

- DFR middleware architecture
- CAD to FlightHub 2 dispatch integration
- VMS livestream integration
- GIS / PSIM telemetry integration
- evidence system / media archive integration

**Inspection / patrol scenario**

- inspection / patrol task dispatch middleware
- wayline (航线) upload, sync, and planned/periodic task integration
- inspection media → AI / VLM defect recognition → third-party analysis platform
- 3D reconstruction / point cloud / orthophoto result sync
- keywords: inspection, patrol, wayline, thermal, defect detection, VLM, 巡检, 巡逻

**Common**

- DJI Dock / FlightHub 2 (司空 2) integration design
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

## Second gate: scenario gate

After the deployment model is known, determine the workflow scenario if it is not already clear.

Ask this question if the scenario is not already known:

```text
Which workflow scenario are you integrating?

1. DFR / emergency response — alarm-driven, urgent, real-time livestream and human takeover
2. Inspection / patrol — plan-driven, periodic, media capture and data analysis
3. Both

The interface selection, data flow, and security focus differ by scenario.
```

Rules:

- If **DFR**, use `references/dfr-integration-architecture.md` as the primary scenario reference.
- If **Inspection / patrol**, use `references/inspection-integration-architecture.md` as the primary scenario reference.
- If **Both**, design each scenario separately and explicitly mark shared components (S3 storage, Event API) and scenario-specific components.
- Do not apply DFR real-time-takeover logic to inspection. Do not apply inspection periodic-scheduling logic to DFR. See `references/scenario-dfr-vs-inspection.md`.
- The deployment gate always comes first; the scenario gate is second. The two gates are independent.

### Proactively offer the local dispatch trial (DFR / Public Cloud)

When **both** of the following hold, surface the local demo trial **once**, immediately after the scenario gate is answered — before moving into architecture design:

- deployment = **Public Cloud**, and
- scenario = **DFR** or **Both**

Why this matters: the dispatch call is **outbound-only** (browser → local backend `/api/proxy` → FH2 cloud). It traverses NAT without issue, so a user who already has an org key can drive a **real dispatch** from `localhost` with **no server, no public IP, and no tunnel**. This is the single fastest path from "reading docs" to "watching the dock open", and users rarely discover it on their own.

Offer it in roughly this shape (adapt wording, keep the substance):

```text
在进入方案设计前，有个可以立刻验证的事：

如果你已经有司空 2 组织密钥，本地 Demo 就能直接下发真实出警派遣 ——
不需要服务器、不需要公网 IP、不需要内网穿透。派遣请求是纯出站的，
本机就能打通到司空云端，机场会真实开舱起飞。

examples/dfr-public-cloud-demo/，起前后端 + 填组织密钥和项目 UUID 即可。

要我带你走一遍吗？还是先继续做方案设计？
```

Rules for this offer:

- **Mention it once.** If the user declines or ignores it, do not repeat it in later turns.
- **Always attach the safety line**: this drives real hardware — confirm airspace compliance, on-site human supervision, and use a test dock first. Never present the trial as consequence-free.
- **Do not** offer this for On-Premises / AIO — the demo is written against Public Cloud and its auth model differs.
- For **Inspection-only** scenarios, do not offer the dispatch trial. If a low-friction entry point is still useful, mention that the **Event API** page can be exercised locally by POSTing to `/webhook/{userId}` with `curl` — that path needs no external service at all.
- If the user asks what else runs locally, the dividing line is **traffic direction**: outbound-initiated features work; anything requiring FH2 to connect *inbound* (Event API callbacks, telemetry pushed to a customer broker, FlightHub Sync reading a customer bucket) needs a public endpoint or a tunnel.

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
4. `references/scenario-dfr-vs-inspection.md` — scenario decision logic (DFR vs inspection).
5. `references/dfr-integration-architecture.md` — DFR architecture and interface selection.
6. `references/inspection-integration-architecture.md` — inspection / patrol architecture and interface selection.
7. `references/middleware-patterns.md` — common middleware patterns (DFR + inspection).
8. `references/dfr-whitepaper-summary.md` — DFR operational best practices.
9. `references/source-map.md` — source provenance and latest-doc links.
10. `examples/dfr-public-cloud-demo/` — a runnable DFR Public Cloud reference implementation. DFR-only, teaching-grade, not production. See its `LIMITATIONS.md`.
11. `references/capability-overview.md` — plain-language capability menu for non-developers.
12. `references/integrate-with-existing-system.md` — connecting FH2 capability into a customer's existing platform.
13. `references/demo-localization.md` — language detection and localization of generated UI copy for global users.

## Language handling

Detect the user's language from their input and apply it at two levels:

- **Conversation** — reply in the user's input language.
- **Generated artifacts** — when producing UI copy (titles, labels, alerts, safety notices), follow `references/demo-localization.md`. Localize user-facing text only; never translate code identifiers, API field names, headers, or endpoint paths.

Language may also drive functional defaults where a provider is region-specific — for example basemap selection (Chinese locale → AMap, other locales → Google Maps). Never hard-code a single region's provider when the audience is global.

**Documentation links follow the conversation language.** The Apifox OpenAPI references exist in both English and Chinese editions. When citing them:

- Chinese conversation → serve the 中文 links.
- English or other languages → serve the English links.
- Language ambiguous, or the user is assembling docs for a mixed-language team → serve both, labelled.

Never serve an English-only link to a Chinese-speaking user when a Chinese edition exists — it forces avoidable translation effort on the reader. The canonical link sets are listed in the "OpenAPI source" section below and in `references/source-map.md`. Note that the two editions are **separate Apifox projects, not translations of one project**; they may drift. If a user reports that an endpoint is missing from one edition, direct them to check the other before concluding the capability does not exist.

Safety-critical notices must exist in every supported language and keep the same operational meaning. Localization changes presentation only; it must never alter API selection, gate logic, or security guardrails.

## OpenAPI source: prefer MCP when available

If the environment provides a FlightHub 2 / 司空 2 OpenAPI MCP tool (for example an Apifox MCP that reads the project OpenAPI spec), **prefer the MCP to read real endpoint paths, parameters, and schemas** before answering endpoint questions or matching a requirement to the API. Use the MCP to:

- confirm an endpoint actually exists before recommending it
- pull the real request/response schema before generating or editing code
- produce a requirement-to-endpoint match table

If no MCP is available, fall back to the latest Apifox documentation and tell the user to verify there. Never invent endpoints regardless of MCP availability.

If a task requires exact request/response schemas, verify against the FH2 OpenAPI MCP if available, otherwise against the latest Apifox documentation before coding against production:

**English documentation:**

- On-Premises / default module: `https://41b04hdzmc.apifox.cn/`
- Public Cloud OpenAPI V2.0: `https://s.apifox.cn/5113ab93-b1c2-4f3c-bc06-c3656c5352fb`

**中文文档 (Chinese documentation):**

- 私有化 / 默认模块: `https://henvmbbf6x.apifox.cn/8983503m0`
- 公有云 OpenAPI V2.0: `https://s.apifox.cn/4de4a239-c2cc-4572-9b65-90738289f37a`

Serve the link set that matches the user's conversation language. When the language is ambiguous, provide both.

## SOP

Follow this workflow for every integration task.

### Step 1 — Confirm deployment, scenario, and target system

Confirm:

- FH2 deployment model: Public Cloud / On-Premises / AIO
- workflow scenario: DFR / emergency, inspection / patrol, or both
- target system: CAD, VMS, GIS, PSIM, evidence, archive, dashboard, AI analytics, or another platform
- integration domain: dispatch trigger, wayline / planned task, livestream, telemetry, media, events, control, frontend embedding
- production phase: PoC, integration validation, security review, production deployment

If any of these are missing, ask only the questions that change the design.

The deployment model is never optional for FH2 OpenAPI guidance. Do not infer it silently. The scenario is required whenever DFR and inspection would lead to different interface selection.

### Step 2 — Pick the integration interface

Choose the table by scenario.

**DFR / emergency mapping**

| Requirement | Preferred interface | Notes |
|---|---|---|
| Alarm-to-drone response | Auto Dispatch Workflow / inbound trigger | CAD or alarm system triggers FH2 workflow. |
| Programmatic state query or command | OpenAPI | Deployment-specific API surface applies. |
| Livestream to VMS / command center | FlightHub Sync or OpenAPI livestream | Pick protocol by target platform and latency. |
| Real-time telemetry to GIS / PSIM | Public Cloud Telemetry Data Forwarding or On-Premises MQTT Bridge | Public Cloud pushes to customer broker; On-Premises uses broker bridge. |
| Media / evidence archive | FlightHub Sync S3 + Event API | S3-compatible storage is preferred. |
| Event-driven downstream actions | Event API | Validate `x-dji-signature`, use idempotency. |
| Embedded drone UI | Frontend Components | On-Premises / AIO private deployment only. Not supported on Public Cloud. |

**Inspection / patrol mapping**

| Requirement | Preferred interface | Notes |
|---|---|---|
| Wayline upload and sync to FH2 route library | Wayline endpoints (upload / finish-upload / list / detail) | Plan routes offline, sync, then reuse. |
| Planned / periodic inspection task dispatch | Flight task (planned task) + wayline | Non-urgent; schedulable via a scheduler. |
| Resume after interruption | Flight task resume (`resume-immediate`) | Breakpoint-resume flights. |
| Payload / camera selection during capture | `device/change-camera`, `device/change-lens` | Visible-light + thermal capture. |
| Inspection media capture and retrieval | Flight-task media endpoints + FlightHub Sync S3 | High-resolution imaging archive. |
| Defect / AI / VLM recognition results | Event API (`ai_alert_record`) + third-party analysis platform | AI defect / VLM outputs. |
| 3D reconstruction / point cloud / model | model / open_model endpoints | Digitized asset workflows. |

See `references/inspection-integration-architecture.md` for the full inspection interface guide.

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

### Lightweight output: requirement-to-endpoint match table

When the user already knows how to develop and mainly needs to locate which official APIs cover their requirement (rather than a full architecture), use this lighter output instead of the 7-section template.

Read the real spec via the FH2 OpenAPI MCP when available before filling this in.

```md
# [Requirement] — API Match

Deployment: [Public Cloud / On-Prem / AIO]   Scenario: [DFR / Inspection]

| # | Requirement item | Matching endpoint(s) | Coverage | Verified via | Notes |
|---|---|---|---|---|---|
| 1 | ... | `GET /openapi/...` | full / partial / none | MCP / Apifox / unverified | ... |

## Gaps
- [ ] requirement items with no matching API, and the suggested workaround

## Next code change
- files to touch:
- assumptions:
- verification steps:
```

Rules for this output:

- Mark coverage honestly as `full`, `partial`, or `none`. Do not force a match.
- If an endpoint cannot be confirmed via MCP or Apifox, mark `unverified` and say so.
- List gaps explicitly; a missing capability is a valid answer.

## Critical guardrails

- Do not invent FH2 endpoints, headers, event types, MQTT topics, or control commands.
- Do not mix Public Cloud and On-Premises API surfaces.
- Do not treat the DFR whitepaper as a complete API manual.
- Do not claim regulatory or customer compliance approval from technical architecture alone.
- Do not recommend production flight control automation without human-in-the-loop, permissions, and customer safety review.
- Always distinguish verified facts from assumptions.
