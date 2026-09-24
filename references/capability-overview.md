# Capability Overview — What FH2 Integration Can Do

Last updated: 2026-07-09

## Purpose

A plain-language capability menu for users who are **not** experienced developers and first ask "what can this actually do?" before choosing an integration plan.

Use this file to explain options in business terms, then use the architecture references to design. This file is for **explaining and selecting**, not for endpoint-level design.

Rules when using this file:

- You may describe capabilities without knowing the deployment model.
- You must still ask the deployment gate before naming concrete endpoints.
- Mark capabilities that are deployment-limited (noted below).

## The menu — DFR / emergency response

| Capability | What it means in practice | Typical target system |
|---|---|---|
| Alarm-triggered dispatch | An alarm or incident in your system automatically sends a drone to the location | CAD, alarm platform, PSIM |
| Live video to command center | Aerial video appears in your existing video wall or web dashboard | VMS, command center |
| Live position and status | Drone position, battery, and status appear on your map | GIS, PSIM, dashboard |
| Evidence and media archive | Photos, videos, and flight logs land in your storage automatically | Evidence system, archive |
| Event notifications | Your system is notified when things happen, without polling | Any downstream system |
| Embedded drone UI | FH2 operational UI embedded inside your platform | Your web platform (**private deployment / AIO only**) |

## The menu — Inspection / patrol

| Capability | What it means in practice | Typical target system |
|---|---|---|
| Route library | Plan inspection routes once, reuse them repeatedly | Your ops platform |
| Scheduled inspection | Inspections run on a schedule without a person starting them | Scheduler, ops platform |
| Visible-light + thermal capture | Capture both normal and thermal imagery per inspection item | Asset / inspection system |
| Media offload to your storage | Captured imagery lands in your S3-compatible storage | Archive, analysis platform |
| Defect / AI recognition results | Findings from AI / VLM analysis flow into your system | Analysis platform, reporting |
| 3D reconstruction / point cloud | Digitized asset models for planning and record | GIS, asset management |

## Deployment-limited capabilities

| Capability | Public Cloud | On-Premises / AIO |
|---|:---:|:---:|
| OpenAPI | Yes (Public Cloud scope) | Yes (broader scope) |
| Event API | Yes | Yes |
| FlightHub Sync (livestream / file / telemetry) | Yes | Yes |
| MQTT Bridge | — | Yes |
| Frontend Components (embedded FH2 UI) | **No** | Yes |
| Deep device configuration / control APIs | Limited | Broader |

Always confirm the exact availability in the deployment-specific reference before promising a capability.

## Guided conversation flow for non-developers

Use this order. Ask only what changes the answer.

1. **What problem are you solving?** — emergency response, or routine inspection, or both.
2. **Who consumes the result?** — command center, map, evidence system, analysis platform, or a person on screen.
3. **What do you already have?** — existing platform, storage, video system, account system. (See `integrate-with-existing-system.md`.)
4. **What stage are you at?** — demo for leadership, pilot, or production.
5. **Then** ask the deployment gate and scenario gate, and move to the architecture references.

## Typical starter plans

| If the user says | Suggest starting with |
|---|---|
| "I just want to show my leadership something" | Run `examples/dfr-public-cloud-demo/`, Public Cloud, DFR flow |
| "Alarms should send a drone" | DFR: dispatch trigger + livestream first |
| "We inspect the same site every week" | Inspection: route library + scheduled task first |
| "We need the footage stored as evidence" | Media to S3 + Event API |
| "We want it inside our own platform" | See `integrate-with-existing-system.md` |

## Boundary

This file describes capability categories. It does not list endpoints, and it is not a commitment that a specific API exists in a specific deployment. Confirm with the FH2 OpenAPI MCP or the latest Apifox documentation before design or coding.
