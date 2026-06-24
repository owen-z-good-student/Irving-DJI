# DFR Middleware Patterns

Last updated: 2026-06-24

## Pattern 1 — CAD / alarm to FH2 dispatch middleware

Use when a CAD, alarm system, PSIM, or security platform triggers DFR response.

```text
CAD / alarm event
  → validation and normalization
  → severity / level mapping
  → FH2 Auto Dispatch Workflow inbound trigger
  → mission generation
  → status / event feedback to CAD
```

Design checklist:

- validate coordinates as WGS84
- map incident type to FH2 workflow ID / trigger type
- map alarm severity to event level 1–5
- apply threshold policy before auto-dispatch
- log request ID and incident ID
- keep manual cancel / override path
- handle duplicate alarms idempotently

## Pattern 2 — Livestream bridge to VMS / command center

Use when the command center needs drone video inside an existing VMS or web dashboard.

```text
FH2 livestream source
  → direct RTSP / RTMP / WebRTC path or media relay
  → VMS / CAD display / command dashboard
```

Direct streaming is best for:

- one target system
- low concurrency
- target supports FH2 output protocol
- stable network

Media relay is best for:

- multiple consumers
- protocol conversion
- cross-site distribution
- public internet / NAT / firewall traversal
- production monitoring and restart automation

## Pattern 3 — Telemetry bridge to GIS / PSIM

Use when live device state must appear on a map or operations screen.

```text
FH2 telemetry forwarding / MQTT Bridge
  → customer MQTT broker
  → middleware subscriber
  → WebSocket / Redis / database / Kafka
  → GIS / PSIM / command dashboard
```

Recommended conversions:

| Target need | Conversion path |
|---|---|
| live map | MQTT → WebSocket |
| operations dashboard | MQTT → Redis + WebSocket |
| reporting / audit | MQTT → database |
| multi-system city-scale fanout | MQTT → Kafka |

## Pattern 4 — Evidence archive pipeline

Use when mission outputs need to be attached to an incident record.

```text
FH2 mission completes
  → media_file_uploaded event
  → FlightHub Sync pushes media to S3-compatible storage
  → file_sync_success event
  → evidence system imports or links file
  → incident record updated in CAD / archive system
```

Design checklist:

- use independent S3 buckets or prefixes per project
- record object key, file size, receive time, and hash where possible
- implement retry for failed sync
- preserve chain-of-custody metadata in the evidence system
- avoid giving broad bucket permissions

## Pattern 5 — OpenAPI adapter layer

Use when the third-party platform needs state query, task control, livestream session management, media retrieval, or administrative operations.

Recommended service boundary:

```text
Business system
  → internal domain service
  → FH2 adapter
  → FH2 OpenAPI
```

Keep the FH2 adapter separate from business logic. This makes deployment-specific API differences easier to isolate.

Adapter responsibilities:

- token injection
- project UUID injection
- request tracing
- schema validation
- retry / timeout / error mapping
- API version boundary
- security logging

## Pattern 6 — Frontend component embedding

Use when a host platform needs FH2 UI capability without rebuilding drone operational UI.

Typical components:

- Virtual Cockpit
- Route Editor
- Flight Records
- Project / Map

Boundary:

- available only for On-Premises / AIO private deployment
- do not recommend Frontend Components, `paas.js`, Virtual Cockpit embedding, Route Editor embedding, Flight Records embedding, or Project / Map embedding for Public Cloud
- authorize control-capable components only for necessary roles
