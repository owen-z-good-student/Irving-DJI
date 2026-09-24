# FH2 Middleware Patterns

Last updated: 2026-07-09

Patterns 1–6 are primarily DFR / emergency scenario. Patterns 7–9 are inspection / patrol scenario. See `scenario-dfr-vs-inspection.md` for choosing.

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

## Pattern 7 — Scheduled inspection task dispatch middleware (inspection)

Use when inspection must run on a schedule instead of on an external alarm.

```text
scheduler (cron / job queue)
  → select synced wayline
  → create planned flight task (references wayline)
  → monitor task status / completion events
  → breakpoint resume on interruption (where supported)
```

Design checklist:

- drive task creation from a scheduler, never from a DFR alarm trigger
- reference a wayline already synced to the FH2 route library
- persist task status and handle completion / failure events
- support `resume-immediate` breakpoint resume where the API supports it
- log every planned dispatch with task ID and wayline ID
- keep a manual pause / cancel path

## Pattern 8 — Inspection media to AI / VLM defect analysis (inspection)

Use when captured inspection media must be analyzed for defects by a third-party platform.

```text
FH2 task completes
  → media_file_uploaded / file_sync_success events
  → FlightHub Sync pushes media to S3-compatible storage
  → third-party AI / VLM platform pulls media, runs defect detection
  → ai_alert_record events (where supported) surface findings
  → results linked into asset / reporting system
```

Design checklist:

- separate visible-light and thermal media where inspection items differ
- treat AI / VLM output as findings, not automatic asset action; keep human review
- record object key, capture time, task ID, and defect metadata
- implement retry for failed analysis handoff
- verify `ai_alert_record` payload in Apifox before treating fields as final

## Pattern 9 — Model / reconstruction result sync (inspection)

Use when 3D reconstruction, point cloud, or orthophoto outputs must reach a GIS / asset platform.

```text
FH2 model reconstruction
  → model_reconstruction_percent_change / model_post_reconstruction events
  → model / open_model endpoints provide resource + download URL
  → middleware pulls result and syncs to GIS / archive
```

Design checklist:

- drive sync from reconstruction events rather than polling where possible
- use model / open_model resource and download-URL endpoints
- verify exact event names and resource schemas in Apifox
- record model UUID, resource UUID, and reconstruction status
