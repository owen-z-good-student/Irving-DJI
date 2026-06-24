# FH2 OpenAPI V2.0 — On-Premises Default Module Reference

Last updated: 2026-06-24

## Positioning

The On-Premises default module is the primary API reference for private FH2 deployments in this skill.

Use it when the user confirms:

- FlightHub 2 On-Premises
- private deployment
- private all-in-one appliance / AIO

Private deployment and AIO have the same integration interface and OpenAPI scope for this skill. They expose a broader API surface than Public Cloud and are better suited for production DFR integrations that require deeper control, local data boundaries, and enterprise system integration.

## General glossary

Common identifiers:

| Term | Meaning |
|---|---|
| `sn` / `device_sn` | DJI device serial number. |
| `gateway_sn` | Access gateway device SN, typically dock or remote controller. |
| `drone_sn` | Aircraft SN. |
| `uuid` | Resource UUID. |
| `org_uuid` | Organization UUID. |
| `project_uuid` / `workspace_id` | Project / workspace UUID. `workspace_id` may be legacy naming. |
| `bid` | Business request ID. |
| `tid` | Transaction ID. |

Conventions:

- Most timestamps are Unix seconds unless stated otherwise.
- Coordinates use WGS84 unless stated otherwise.
- Field naming generally uses `snake_case`.
- General response envelope usually follows `code`, `message`, `data`.

## Capability map

Use this map for high-level design. Always verify exact schemas in Apifox before coding.

| Domain | Example capabilities | DFR relevance |
|---|---|---|
| Common / health | DRC service health, system health | Preflight checks, monitoring. |
| Access / storage STS | project-level upload credentials, flight record upload credentials, custom STS | media upload, evidence archiving, file handoff. |
| Security | decrypt encrypted device SN in flight records | downstream device lookup and readable records. |
| Project management | create, update, get, delete projects; quick join; subscriptions | deployment setup and operational administration. |
| Organization management | organization details, member management, role management | IT / security and project governance. |
| Device management | device list, project device details, thing model, HMS, RTK, pairing, SIM, network configuration | fleet readiness, health monitoring, troubleshooting. |
| Real-time control | flight control commands, airborne task, point-to-fly, relay task, control authority, payload control | DFR mission intervention and supervised operations. |
| Flight task | create tasks, query tasks, active wayline, operation logs, track, media resources | dispatch, monitoring, evidence linkage. |
| Wayline | upload, list, detail, folder / file management | preplanned response routes and patrol paths. |
| Map | annotation layer, annotation feature, custom flight area, offline map, signal heatmap | shared operational picture and safety boundaries. |
| Livestream | start livestream, stream forwarder, sharing, recording, intra-project stream | VMS / command center video integration. |
| Media | folder, file list, file details, download URL, tags | evidence and archive workflows. |
| Model | reconstruction and model-resource management | post-incident 3D reconstruction and GIS workflows. |

## Private deployment design notes

### Control authority matters

For control-related APIs, verify whether the caller must hold control authority for the device or project. Designs should include:

- acquire / request control authority
- check current authority holder
- release / cancel authority
- handle preemption and denial paths

### Device shadow and configuration APIs are powerful

Configuration dispatch APIs can modify device-level attributes. Treat them as high-risk:

- do not use for Public Cloud unless confirmed
- require project / organization permissions
- serialize commands where required
- log every command
- validate device-side success, not only server acceptance

### Flight control requires human oversight

Private APIs can support richer operational flows such as point-to-fly, wayline task control, relay task, and payload control. DFR designs should still preserve:

- manual intervention
- command cancellation
- safety checks
- incident commander authority
- pilot oversight

### Livestream and media are integration anchors

For most DFR middleware, start with:

1. alarm / dispatch trigger
2. livestream to VMS or command center
3. telemetry to GIS / PSIM
4. media and Event API to evidence system

## Example endpoint families to verify in Apifox

These are examples from the On-Premises default module scope. Verify exact paths, parameters, and request bodies in the latest Apifox documentation.

| Need | Example endpoint family |
|---|---|
| Health check | `/openapi/v2.0/drc/health` |
| Project storage STS | `/openapi/v2.0/storage/api/v1/workspaces/{workspace_id}/sts` |
| Project CRUD | `/openapi/v2.0/manage/api/v1/projects/{uuid}` and related project endpoints |
| Device list | project / organization device list endpoints |
| Flight control command | DRC real-time command endpoints |
| Airborne wayline task | airborne-dispatched wayline task endpoints |
| Point-to-fly | fly-to target point endpoints |
| Wayline task control | pause / resume / cancel wayline task endpoints |
| Livestream start | project-level or organization-level livestream push endpoints |
| Media files | media list, details, and download URL endpoints |
| Map annotations | annotation layer / feature endpoints |
| Model reconstruction | model task and resource endpoints |

## Latest reference

Use the latest On-Premises / default module documentation:

`https://41b04hdzmc.apifox.cn/`
