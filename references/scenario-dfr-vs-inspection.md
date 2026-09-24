# Scenario Decision — DFR vs Inspection

Last updated: 2026-07-09

## Purpose

FlightHub 2 (司空 2) supports two integration scenarios with different interface selection, data flow, and security focus. Choose the scenario before designing, after the deployment gate.

- **DFR / emergency response** — alarm-driven, urgent, real-time livestream and human takeover. See `dfr-integration-architecture.md`.
- **Inspection / patrol** — plan-driven, periodic, media capture and data analysis. See `inspection-integration-architecture.md`.

Many customers run both. When both apply, design each separately and mark shared vs scenario-specific components.

## Core comparison

| Dimension | DFR / emergency | Inspection / patrol |
|---|---|---|
| Trigger source | External alarm / CAD / PSIM event | Plan / schedule (cron, periodic) |
| Timing | Seconds-level urgency | Periodic, routine |
| Primary interface | Auto Dispatch Workflow / inbound trigger | Wayline + planned flight task |
| Task nature | One-off, on-demand dispatch | Repeatable, scheduled |
| Data flow focus | Real-time livestream + human takeover | Capture → analysis → sharing |
| Payload focus | Zoom observation, situational awareness | Visible-light + thermal capture |
| Post-processing | On-scene decision, evidence | AI / VLM defect detection, 3D reconstruction |
| Human role | Command center + pilot takeover | Review analyst, unattended capture |
| Shared components | S3 storage, Event API | S3 storage, Event API |

## Decision tree

```text
Deployment known? (Public Cloud / On-Prem / AIO)
  ↓ yes
What triggers the flight?
  ├─ External alarm / incident / CAD → DFR
  ├─ Schedule / periodic plan / route library → Inspection
  └─ Both → design both, mark shared components
```

## Mismatch red lines (do not do)

| Wrong | Why | Correct |
|---|---|---|
| Applying DFR real-time human-takeover flow to a scheduled inspection | Inspection is unattended and periodic; takeover UI is not the point | Use planned task + wayline; add review, not live takeover |
| Applying inspection periodic-scheduling to a DFR alarm response | DFR must fire on external event, not on a cron | Use Auto Dispatch Workflow / inbound trigger |
| Using Auto Dispatch Workflow to run a routine daily inspection | Dispatch workflow is for alarm-to-drone response | Use wayline + planned flight task |
| Treating AI / VLM defect output as automatic asset action | Inspection analysis needs human review | Surface findings; keep human-in-the-loop |
| Ignoring the deployment gate because scenario is clear | Deployment still changes the API surface | Always confirm deployment first, scenario second |

## Shared vs scenario-specific components

Shared (both scenarios):

- FlightHub Sync S3 media storage
- Event API callbacks (validate `x-dji-signature`, idempotency)
- Deployment-aware authentication and permission scope
- Audit logging

DFR-specific:

- Auto Dispatch Workflow / inbound trigger
- Real-time livestream to VMS / command center
- Real-time telemetry to GIS / PSIM
- Human takeover path

Inspection-specific:

- Wayline upload / sync / library
- Planned / periodic flight task + breakpoint resume
- Camera / payload switching for capture
- AI / VLM defect analysis + third-party analysis platform
- 3D reconstruction / point cloud / model sync
