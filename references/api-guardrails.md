# API Guardrails

Last updated: 2026-06-24

## 1. Deployment boundary is mandatory

Before giving FH2 OpenAPI guidance, determine the deployment model:

- Public Cloud
- On-Premises / Private Deployment
- AIO / private all-in-one appliance

If unknown, ask the deployment question first.

Never infer deployment model from token format, base URL, domain suffix, screenshots, region, customer type, or wording such as "private network". If the user has not explicitly stated Public Cloud, On-Premises, or AIO, ask the deployment question.

## 1.1 STOP checkpoints

Stop and ask for confirmation before continuing when:

| Checkpoint | Stop condition | Required confirmation |
|---|---|---|
| Deployment gate | Deployment model is not explicitly stated | Public Cloud / On-Premises / AIO |
| Auth gate | Token, OAuth, local account, SSO, or project permission model is unclear | Which auth model applies and which values are placeholders |
| Production control gate | The design may create tasks, dispatch drones, acquire control authority, issue flight commands, control payloads, or change device configuration | Authorized environment, human operator, and safety review path |
| Live system gate | The user asks to operate live CAD, VMS, GIS, PSIM, evidence, MQTT broker, S3, or FH2 systems | Explicit authorization and target environment |
| Unverified API gate | Endpoint, event type, MQTT topic, header, or schema is not confirmed in the relevant deployment reference | Verification in latest Apifox documentation |

Use this response pattern:

```text
STOP — I need confirmation before continuing.
Reason: [checkpoint reason]
Please confirm: [specific item needed]
```

## 1.2 Karpathy-style coding guardrails

When generating code, editing a repository, or planning implementation:

1. **Think before coding** — surface assumptions, ambiguities, and tradeoffs. Ask when unclear.
2. **Simplicity first** — use the smallest middleware design that works. Avoid speculative abstractions, platforms, queues, databases, or configurability.
3. **Surgical changes** — touch only files directly tied to the requested FH2 integration. No unrelated refactors or cleanup.
4. **Goal-driven execution** — define acceptance criteria and verification steps, then report verification results and unverified items.

## 2. Do not mix API surfaces

Public Cloud OpenAPI V2.0 and On-Premises OpenAPI V2.0 do not expose the same capability surface.

Rules:

- Public Cloud: use only public-cloud-documented capabilities.
- On-Premises / AIO: use the On-Premises default module as the primary reference.
- AIO has the same integration interface and OpenAPI scope as On-Premises / Private Deployment for this skill.
- Frontend Components are private-deployment / AIO only and must not be recommended for Public Cloud.
- Private-deployment OpenAPI V2.0 default module is private-deployment / AIO only. Public Cloud must use its own Public Cloud OpenAPI V2.0 reference.
- On-Premises exposes broader administrative, control, configuration, and operations APIs than Public Cloud.

### Wrong examples to block

| User request | Wrong behavior | Correct behavior |
|---|---|---|
| Public Cloud user asks for Virtual Cockpit embedding | Recommend Frontend Components or `paas.js` | Say Frontend Components are private-deployment / AIO only; suggest livestream / OpenAPI / Event API alternatives or private deployment if embedded UI is mandatory |
| Public Cloud user asks to use a private default-module endpoint | Use the private endpoint anyway | Refuse to assume support; check Public Cloud OpenAPI V2.0 only |
| User gives `.internal` URL and token but no deployment model | Infer On-Premises | Ask the deployment gate question |
| User asks whether Event API is supported | Say private-only | Say Event API is supported on both Public Cloud and private deployment; exact event types / payloads still require relevant Apifox verification |

## 3. Authentication guardrails

Public Cloud patterns:

- `X-User-Token` is used for identity and permission verification.
- `X-Project-Uuid` is required for project-scoped operations.
- Additional headers may include `X-Request-Id`, `X-Language`, and `X-Share-Token` depending on endpoint.
- Do not hardcode tokens.

On-Premises / private deployment patterns:

- Local account, OAuth 2.0, third-party account, and SSO patterns may apply depending on customer deployment configuration.
- The On-Premises default module examples often use `x-user-token`, `X-Project-Uuid`, and `X-Request-Id` in endpoint tables.
- Confirm the actual authentication setup with the deployment owner before coding.

Auto Dispatch Workflow pattern:

- DFR Auto Dispatch Workflow / inbound trigger uses `X-User-Token` and lowercase `x-project-uuid` according to the DFR whitepaper.
- This lowercase project header differs from the PascalCase `X-Project-Uuid` convention used in many OpenAPI references.
- Validate against the latest workflow documentation before production use.

## 4. Anti-hallucination rules

Never invent:

- endpoints
- request bodies
- response fields
- event names
- MQTT topics
- control commands
- feature availability across deployment models

If a requested capability is not found in the relevant reference, respond:

```text
I cannot confirm this capability in the current deployment reference. Please verify it in the latest Apifox documentation before using it in production.
```

## 5. Security minimums for generated designs

Every generated middleware design should include:

- token storage and rotation plan
- project-level permission scope
- request tracing via request IDs where supported
- idempotency for callbacks and events
- retries with backoff for network calls
- signature verification for Event API
- IP allowlisting where applicable
- audit logs for API calls and downstream actions
- customer-owned retention and deletion policy

## 6. DFR safety guardrails

Do not present automated dispatch as a fully autonomous enforcement decision.

Design should preserve:

- human-in-the-loop decision authority
- manual cancel / intervention path
- mission eligibility checks
- geofence / no-fly-zone constraints
- airspace and customer SOP approval
- evidence chain-of-custody controls

## 7. Known technical details to preserve

- MQTT OSD telemetry frequency: `0.5 Hz`.
- Representative MQTT topics: `thing/product/{sn}/osd`, `thing/product/{sn}/state`, `thing/product/{sn}/events`, `thing/product/{sn}/services_reply`.
- Event API signature header: `x-dji-signature`, HMAC-SHA256 based on organization token.
- Event API delivery logs: 7-day delivery statistics in FH2 console.
- FlightHub Sync file sync supports S3-compatible storage.
- Media files and flight logs are FH2-to-third-party one-way sync; flight routes, models, and annotations can be bidirectional where supported.
