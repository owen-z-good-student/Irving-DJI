# DFR Integration Architecture

Last updated: 2026-06-24

## FH2 role in DFR

FlightHub 2 is the coordination layer in a DFR deployment. It manages:

- device lifecycle
- mission planning and scheduling
- dock and aircraft status
- livestream sessions
- telemetry forwarding
- media and evidence files
- Event API notifications
- third-party integration interfaces

## DFR target architecture

```text
Alarm / CAD / PSIM
  → Auto Dispatch Workflow / inbound trigger
  → FlightHub 2
  → DJI Dock / aircraft mission execution
  → livestream + telemetry + media + events
  → VMS / CAD / GIS / PSIM / evidence system
```

## Four main integration domains

| Priority | Domain | Preferred interface | Protocol | Target system |
|---|---|---|---|---|
| P0 | DFR emergency trigger | Auto Dispatch Workflow / inbound trigger | HTTPS POST | FH2 |
| P0 | Live video streaming | FlightHub Sync or OpenAPI livestream | RTMP / RTSP / WebRTC | VMS / CAD / command center |
| P1 | Drone telemetry | Public Cloud Telemetry Data Forwarding or On-Premises MQTT Bridge | MQTT | CAD / GIS / PSIM |
| P2 | Media and evidence archive | FlightHub Sync S3 + Event API | S3 / HTTPS | evidence / archive system |

## Interface selection guide

### Auto Dispatch Workflow

Use when the external system needs to trigger a drone response from an alarm, CAD incident, PSIM event, or security trigger.

Key DFR facts:

- External systems call an FH2 workflow POST endpoint or inbound trigger endpoint.
- The request uses `X-User-Token` and lowercase `x-project-uuid` according to the DFR whitepaper.
- Event levels are 1–5.
- Default threshold is 3.
- Auto-dispatch fires when event level is greater than or equal to threshold.
- Auto-recommend mode selects a suitable idle device and can use the recommended-device list as fallback.
- Manual assignment mode uses a fixed device or per-trigger manual selection.

### Livestream

Use when the target system needs real-time aerial video.

Options:

- FlightHub Sync livestream forwarding: best when a VMS / CAD can receive RTMP or RTSP and the goal is fast configuration.
- OpenAPI livestream: best when the third-party platform must start, manage, and close streams as part of its own workflow.

Protocol selection:

| Protocol | Model | Latency | Best fit |
|---|---|---:|---|
| RTMP | push | 1–3s | event-driven stream push to CAD / security platforms |
| RTSP | pull | 1–3s | traditional VMS and multi-client command center viewing |
| WebRTC | browser-oriented | <500ms | web command platform and latency-sensitive operations |

Direct streaming is enough when concurrency is low, one system consumes the feed, the target supports the output protocol, and the network is stable. Use a media relay when multiple systems, protocol conversion, public internet / NAT traversal, or high concurrency are required.

### Telemetry

Use when the target platform needs drone position, battery, attitude, flight mode, mission progress, or alerts.

Deployment-specific pattern:

- Public Cloud: FH2 acts as an MQTT client and pushes telemetry to a customer-managed broker.
- On-Premises: MQTT Bridge uses broker-to-broker connection between FH2 internal EMQX and customer broker, configured through REST API.

Representative topics:

- `thing/product/{sn}/osd` — position, attitude, velocity, battery at 0.5 Hz
- `thing/product/{sn}/state` — device properties and state changes
- `thing/product/{sn}/events` — mission events and progress
- `thing/product/{sn}/services_reply` — service command acknowledgements

If the target system does not support MQTT, design a middleware bridge:

- MQTT → WebSocket for live GIS / command UI
- MQTT → Redis / database for device status and reporting
- MQTT → Kafka for city-scale multi-system distribution

### Media and evidence

Use when mission photos, videos, logs, models, or AI results need to reach evidence or archive systems.

Preferred pattern:

```text
FH2 → FlightHub Sync → S3-compatible storage → evidence/archive workflow
FH2 → Event API → downstream system receives media/file-sync events
```

Data direction:

| Data type | Direction |
|---|---|
| media files | FH2 → third-party storage |
| flight logs | FH2 → third-party storage |
| flight routes | bidirectional where supported |
| 3D models | FH2 → third-party storage; bidirectional where OpenAPI-based integration supports it |
| custom zones / annotations | bidirectional where supported |

### Event API

Use when downstream systems should act without polling.

Deployment support:

- Event API is supported on both FlightHub 2 Public Cloud and On-Premises / AIO private deployment.
- Exact event types, payload schemas, source IPs, and configuration paths must still be verified in the relevant Apifox / FH2 documentation for the chosen deployment.

Important rules:

- FH2 sends HTTP POST callbacks.
- Validate `x-dji-signature` using HMAC-SHA256.
- Use idempotent processing based on event ID or equivalent business key.
- Use 7-day delivery logs for troubleshooting.

Common DFR event types:

- `media_file_uploaded`
- `file_sync_success`
- `device_exit_return_home`
- `ai_alert_record`
- `model_post_reconstruction`
- `model_reconstruction_percent_change`
- `map_geo_elements_update`
- RTSP address update payload identified by `converter_id` and `sn`

## Recommended integration sequence

| Phase | Deployment form | Integration steps | Exit criterion |
|---|---|---|---|
| Phase 1 | Public Cloud | configure Auto Dispatch Workflow; connect test CAD; configure RTMP/RTSP to test VMS | test alarm creates FH2 mission and stream appears on VMS |
| Phase 2 | AIO | reconnect workflow to private FH2; connect production VMS; configure telemetry bridge | P0 + P1 stack works on private infrastructure |
| Phase 3 | On-Premises | add OpenAPI livestream orchestration; configure S3 evidence sync; subscribe Event API | alarm → dispatch → feed → closure → archived evidence verified |
