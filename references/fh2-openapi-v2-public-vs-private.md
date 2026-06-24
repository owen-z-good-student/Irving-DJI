# FlightHub 2 OpenAPI V2.0 — Public Cloud vs On-Premises

Last updated: 2026-06-24

## Core principle

Always determine the deployment model before recommending APIs.

FlightHub 2 Public Cloud and FlightHub 2 On-Premises / Private Deployment do not expose the same API surface. Private deployment is the default module reference for this skill and exposes more capabilities.

## Deployment decision tree

```text
User asks for FH2 integration
  ↓
Is deployment known?
  ├─ No → ask Public Cloud / On-Premises / AIO first
  ├─ Public Cloud → use Public Cloud OpenAPI V2.0 reference only
  ├─ On-Premises → use On-Premises default module as primary reference
  └─ AIO → use the same integration interface and OpenAPI scope as On-Premises / Private Deployment
```

## Public Cloud positioning

Public Cloud is best for:

- early solution validation
- public-cloud OpenAPI integration testing
- lighter setup and hosted operation
- validating DFR scenarios before private deployment decisions

Public Cloud integration interfaces from the whitepaper:

| Interface | Availability | Notes |
|---|---:|---|
| FlightHub Sync | Yes | Livestream forwarding, file sync, telemetry forwarding depending on configuration. |
| OpenAPI | Yes | Use Public Cloud OpenAPI V2.0 reference. |
| Event API | Yes | HTTP push callbacks with signature verification. Supported on both Public Cloud and private deployment. |
| Frontend Components | No | On-Premises / AIO private deployment only. |

Public Cloud authentication reference:

- Authentication is based on `X-User-Token` in the request header.
- Authorization is checked against `X-User-Token` and `X-Project-Uuid`.
- The organization key can be copied from the FlightHub 2 console path documented in Apifox.
- If authentication fails, check token freshness and project permissions.

## On-Premises / Private Deployment positioning

On-Premises is best for:

- production DFR deployments
- data sovereignty requirements
- customer intranet / air-gapped or controlled network design
- deep integration with CAD, GIS, VMS, PSIM, evidence systems
- Frontend Components
- broader operational and administrative OpenAPI access

On-Premises integration interfaces from the whitepaper:

| Interface | Availability | Notes |
|---|---:|---|
| FlightHub Sync | Yes | Livestream, file sync, telemetry integration. |
| OpenAPI | Yes | Use default module OpenAPI V2.0 as primary reference. |
| Event API | Yes | Supported on both Public Cloud and private deployment. On-Premises push IP depends on server configuration. |
| Frontend Components | Yes | `paas.js` is hosted by the private FH2 server. Only private deployment / AIO supports this path. |
| MQTT Bridge | Yes | Broker-to-broker bridge configured via REST API. |

On-Premises authentication reference:

- OAuth 2.0-based third-party login is supported on On-Premises deployments.
- Local account and third-party account options may be available based on customer configuration.
- Endpoint tables may still use `x-user-token` and `X-Project-Uuid`; confirm actual auth mode with the deployment owner.

## AIO positioning

AIO is a pre-configured private deployment appliance used between Public Cloud validation and full On-Premises production.

For integration interfaces and OpenAPI scope, treat AIO as equivalent to On-Premises / Private Deployment.

## Must-not-cross boundary examples

- Do not recommend Frontend Components for Public Cloud.
- Do not recommend the private-deployment default module OpenAPI V2.0 for Public Cloud. Public Cloud has its own Public Cloud OpenAPI V2.0 reference.
- Do not assume Public Cloud supports the full private default module endpoint set.
- Do not use private-only device configuration, control authority, network management, or advanced task-control APIs in a Public Cloud design unless confirmed in the Public Cloud reference.
- Do not assume On-Premises uses exactly the same token flow as Public Cloud; confirm OAuth / local account / SSO setup.

## Wrong examples to avoid

### Wrong example 1 — Frontend Components on Public Cloud

User says: "We use FlightHub 2 Public Cloud. Embed Virtual Cockpit into our command center."

Wrong answer: "Use Frontend Components and load `paas.js`."

Correct answer: Frontend Components are only for private deployment / AIO. For Public Cloud, use supported alternatives such as livestream, OpenAPI, Event API, or move to private deployment if embedded FH2 UI is mandatory.

### Wrong example 2 — Private default module endpoint in Public Cloud

User says: "We use Public Cloud. Use the On-Premises default module endpoint for device configuration."

Wrong answer: "Call the private default module endpoint directly."

Correct answer: Public Cloud must use the Public Cloud OpenAPI V2.0 reference only. Private default module endpoints must not be used unless the deployment is On-Premises / AIO.

### Wrong example 3 — Inferring deployment from URL

User says: "My base URL is `https://fh2.company.internal`; design a telemetry pipeline."

Wrong answer: "This is obviously On-Premises, so use MQTT Bridge."

Correct answer: Ask the deployment gate question. Do not infer deployment from URL, token, domain, or network wording.

### Wrong example 4 — Event API scope confusion

User asks: "Can I use Event API?"

Wrong answer: "Event API is private-only."

Correct answer: Event API is supported on both Public Cloud and private deployment. Exact event types and payload schemas still need verification in the relevant Apifox reference.

## Latest references

- On-Premises / default module: `https://41b04hdzmc.apifox.cn/`
- Public Cloud OpenAPI V2.0: `https://s.apifox.cn/5113ab93-b1c2-4f3c-bc06-c3656c5352fb`
