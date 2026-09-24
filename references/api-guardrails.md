# API Guardrails

Last updated: 2026-07-09

## 0. Two gates: deployment first, scenario second

1. **Deployment gate (mandatory, first).** Determine Public Cloud / On-Premises / AIO before any OpenAPI guidance.
2. **Scenario gate (second).** Determine DFR / emergency vs inspection / patrol before interface selection, since the two scenarios use different interfaces. See `scenario-dfr-vs-inspection.md`.

Do not skip the deployment gate just because the scenario is clear. Do not mix DFR and inspection interface logic.

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

## 6.1 Map coordinate-system disclosure (mandatory)

Any UI that lets an operator pick a target position on a map MUST disclose the basemap's coordinate system and its offset risk relative to the aircraft's WGS-84 coordinates.

Disclose for **every** basemap, not only the obviously offset one. Silence on a basemap implies "no risk", which is itself misleading.

| Basemap | Coordinate system | Offset vs WGS-84 |
|---|---|---|
| AMap / 高德 | GCJ-02 | High — up to several hundred metres, across all of China |
| Google vector | GCJ-02 in Mainland China, WGS-84 elsewhere | Medium — region dependent |
| Google satellite | WGS-84 | Low — aligned, but imagery may be outdated and will visibly misalign with GCJ-02 vector layers in China |
| OpenStreetMap | WGS-84 | Low — no systematic offset, but data completeness and currency vary by region |

Every disclosure must also carry the operational guidance:

1. never treat the displayed map position as authoritative — the dock position is the reference
2. keep task assignment within about 10 m of the dock
3. keep the virtual cockpit in view and stay ready to take over

These notices must appear both on **first load of the default basemap** and on **every basemap switch**. Showing them only on switch means a user landing on the default basemap never sees the warning.

Reference implementation: `examples/dfr-public-cloud-demo/frontend/public/map-basemaps.json`.

## 6.1.1 Third-party service compliance

When a generated design or demo depends on an external provider (map tiles, geocoding, CDN, media services):

- State explicitly whether the endpoint is an **official, licensed API** or an **unofficial/undocumented one**.
- Unofficial endpoints (for example non-official map tile URLs) may be used for local demonstration only. They are unsupported, may break without notice, and **commercial use may violate the provider's terms of service**.
- Any artifact using an unofficial endpoint MUST carry a visible compliance notice, and the production path MUST name the official alternative (for example Google Maps Platform with an API key, or a licensed domestic provider).
- Never present an unofficial endpoint as production-ready just because it works without an API key.

## 6.2 Inspection safety and data guardrails

For inspection / patrol designs:

- AI / VLM defect results must not be treated as the sole basis for asset action; keep human review.
- Preserve payload and flight-control permission scoping for camera and control APIs.
- Classify and retain inspection imagery and defect data per customer policy.
- Log every planned-task dispatch and every downstream analysis handoff.
- Do not apply DFR real-time-takeover logic to unattended inspection, and do not drive DFR alarm response from a cron schedule.

## 7. Known technical details to preserve

- MQTT OSD telemetry frequency: `0.5 Hz`.
- Representative MQTT topics: `thing/product/{sn}/osd`, `thing/product/{sn}/state`, `thing/product/{sn}/events`, `thing/product/{sn}/services_reply`.
- Event API signature header: `x-dji-signature`, HMAC-SHA256 based on organization token.
- Event API delivery logs: 7-day delivery statistics in FH2 console.
- FlightHub Sync file sync supports S3-compatible storage.
- Media files and flight logs are FH2-to-third-party one-way sync; flight routes, models, and annotations can be bidirectional where supported.
