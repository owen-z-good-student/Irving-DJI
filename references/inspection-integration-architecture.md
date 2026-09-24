# Inspection / Patrol Integration Architecture

Last updated: 2026-07-09

This file covers the inspection / patrol scenario only. For DFR / emergency response, see `dfr-integration-architecture.md`. For the scenario decision, see `scenario-dfr-vs-inspection.md`.

## FH2 role in inspection

FlightHub 2 is the coordination layer for planned, periodic drone inspection. It manages:

- wayline (route) library and planning
- planned / scheduled flight tasks
- dock and aircraft readiness
- media capture (visible-light and thermal)
- media, model, and reconstruction files
- Event API notifications (including AI / defect results where supported)
- third-party analysis and archive integration

Inspection is **plan-driven and periodic**, not alarm-driven. There is usually no real-time human takeover requirement; the value is in repeatable capture, high-resolution imaging, and downstream analysis.

## Inspection target architecture

```text
Route planning (point cloud / VME / FPV)
  → wayline upload + sync to FH2 route library
  → planned / periodic flight task (scheduler-driven)
  → DJI Dock / aircraft executes wayline
  → media capture (visible-light + thermal)
  → FlightHub Sync S3 + media endpoints
  → Event API (media / AI / model events)
  → third-party AI / VLM defect analysis + reporting + archive
```

## Inspection five-stage workflow

Based on the FH2 / Dock 3 inspection workflow:

1. Pre-flight preparation — confirm site, power, network, open space, dock readiness.
2. Task planning — plan wayline based on point cloud / VME in the FPV view; preview waypoints and camera FOV.
3. Data capture — visible-light and thermal capture per inspection item.
4. Flight execution — planned / periodic execution; breakpoint resume where supported.
5. Data analysis and sharing — media offload, review, AI / VLM defect recognition, 3D reconstruction, share to third-party platforms.

## Interface selection guide

| Requirement | Preferred interface | Notes |
|---|---|---|
| Upload wayline and sync to FH2 route library | **FlightHub Sync mounted external bucket (bidirectional)**, or wayline endpoints: upload / finish-upload / list / detail | Writing into a mounted bucket avoids wayline OpenAPI entirely. See detail below. |
| Planned / periodic inspection task | Flight task (planned task) + wayline | Schedulable; not urgent. |
| Resume after interruption | Flight task resume (`resume-immediate`) | Breakpoint-resume flight. |
| Camera / payload selection | `device/change-camera`, `device/change-lens` | Visible-light + thermal switching. |
| Media capture retrieval | Flight-task media endpoints + FlightHub Sync S3 | High-resolution imaging archive. |
| Defect / AI / VLM results | Event API (`ai_alert_record`) + third-party analysis | AI defect / VLM outputs. |
| 3D reconstruction / point cloud | model / open_model endpoints | Digitized asset workflow. |

All endpoint names above are examples from the司空 2 OpenAPI reference. Verify exact paths, parameters, and request/response bodies in the latest Apifox documentation before coding against production.

## Interface selection detail

### Wayline planning and sync

Use when the customer wants to plan inspection routes offline and reuse them.

There are **two ways** to get a wayline into the FH2 route library. Choose by what the customer already has.

**Option A — FlightHub Sync mounted external bucket (usually simpler)**

FlightHub Sync supports mounting a MinIO / S3-compatible external bucket. Once configured, files **added** on either side are synced **bidirectionally**. This means a middleware can put a wayline into the route library by simply **writing the `.kmz` into the mounted bucket** — no wayline OpenAPI call is required.

The sync is **incremental (additive) only**: deletions do NOT propagate. Removing an object from the bucket leaves the wayline in the FH2 route library, and vice versa. Do not present bucket deletion as a way to remove a wayline from FH2.

```text
middleware writes .kmz into the mounted bucket
  → FlightHub Sync ingests it into the FH2 route library
  → waylines created in FH2 also appear in that bucket (bidirectional)
```

**Directory layout (verified against a live FH2 deployment):**

```text
fh_sync/check_file.txt                                    ← connectivity probe written by FH2
fh_sync/{orgUuid}/{projectUuid}/wayline/{file}.kmz        ← write here to push INTO FH2
wayline/fh_sync/{orgUuid}/{projectUuid}/wayline/{uuid}.kmz ← what FH2 writes back OUT
```

**The two directions are NOT symmetric.** FH2 prepends an extra `wayline/` segment when syncing *out* to the bucket, but does **not** accept that prefix when ingesting *in*. Concretely:

| Direction | Path | Controllable |
|---|---|---|
| FH2 → bucket | `wayline/fh_sync/{org}/{project}/wayline/{file}` | No — FH2 adds the leading `wayline/` itself |
| bucket → FH2 | `fh_sync/{org}/{project}/wayline/{file}` | Yes — the leading prefix must be **absent** or the file is ignored |

A consequence worth expecting: after your uploaded file is ingested, FH2 syncs it back under the prefixed path, so **the same wayline appears twice in the bucket** under two different keys. Treat the prefixed copy as FH2-owned and the unprefixed one as your write buffer; deduplicate by the `name_base64` object tag rather than by object key.

A file dropped anywhere else in the bucket is **ignored** by FH2. The middleware must therefore know the organization and project UUID. The practical way to obtain them: create one wayline in FH2, let it sync down, then parse the UUIDs out of the resulting object path.

Design notes:

- The bucket and preset path used by the middleware MUST match the FH2 storage configuration.
- FH2 requires **two** configuration steps: a *storage configuration* (bucket type, endpoint, AK/SK, preset path) **and** a *sync rule* (data type, linked storage, project, direction). Mounting storage alone does not sync anything.
- Choose the **S3-compatible** bucket type for MinIO; the Aliyun OSS type expects an OSS `Region` rather than an endpoint.
- Sync is not instant; latency depends on the sync scan cycle. Do not assume write-then-immediately-usable.
- Sync is additive: **deletion does not propagate in either direction**. Removing the object only removes the bucket copy. Do not tell users that deleting the file removes the FH2 wayline.
- This path avoids STS credentials and upload-completion callbacks entirely.

**Option B — Wayline OpenAPI endpoints**

Use when external-bucket mounting is not available or the customer wants explicit API control. Typical endpoint family: upload → finish-upload notification → list → detail. Verify exact paths and payloads in Apifox.

**Either way**, creating the flight task that *runs* the wayline still requires the flight-task OpenAPI endpoint.

Reference implementation of Option A: `examples/dfr-public-cloud-demo/` (`/api/wayline/*`).

### Planned / periodic task dispatch

Use when inspection must run on a schedule (for example daily thermal inspection, 7×24 patrol).

Design pattern:

- A scheduler (cron / job queue) drives task creation, not an external alarm.
- Create a flight task that references a synced wayline.
- Monitor task status and collect completion events.
- Support breakpoint resume (`resume-immediate`) for interrupted flights where the API supports it.

### Data capture (visible-light + thermal)

Use when inspection items require both visible-light and thermal imaging (for example substation: conductor overheating on thermal, insulator damage on visible-light).

- Camera / lens switching endpoints control which payload captures.
- Capture configuration (altitude, speed, gimbal angle, echo/frequency for LiDAR) belongs to the wayline / task definition; confirm supported fields in Apifox.

### Data analysis and sharing

Use when captured media, defects, or models must reach a third-party analysis or archive platform.

Preferred pattern:

```text
FH2 task completes
  → media_file_uploaded / file_sync_success events
  → FlightHub Sync pushes media to S3-compatible storage
  → third-party AI / VLM platform pulls media and runs defect detection
  → ai_alert_record events (where supported) surface defect findings
  → results linked back into asset / reporting system
```

Model / reconstruction:

- Use model / open_model endpoints for 3D reconstruction and point cloud.
- Use `model_reconstruction` / `model_post_reconstruction` events (where supported) to drive downstream sync.

## Deployment notes for inspection

- Both Public Cloud and On-Premises / AIO support inspection interfaces. On-Premises exposes broader wayline, device configuration, and control APIs and is better for data-sovereignty-sensitive inspection (for example private / air-gapped substation networks).
- Frontend Components (route editor, flight records embedding) are On-Premises / AIO only. Do not recommend them for Public Cloud.
- Apply the deployment gate before naming endpoints, exactly as in the DFR flow.

## Recommended integration sequence

| Phase | Focus | Exit criterion |
|---|---|---|
| Phase 1 | Wayline upload + sync + single planned task | An uploaded wayline appears in the FH2 route library and a planned task runs it. |
| Phase 2 | Periodic scheduling + media offload to S3 | Scheduled inspection runs unattended and media lands in storage. |
| Phase 3 | AI / VLM defect analysis + model sync | Captured media flows to a third-party analysis platform and results are linked back. |

## Safety and data guardrails for inspection

- AI / VLM defect results must not be treated as the sole basis for asset action; keep human review.
- Preserve payload / control permission scoping for camera and flight control.
- Classify and retain inspection imagery and defect data per customer policy.
- Log every planned-task dispatch and every downstream analysis handoff.

## Latest reference

Verify exact endpoint schemas in the latest Apifox documentation:

**English documentation:**

- On-Premises / default module: `https://41b04hdzmc.apifox.cn/`
- Public Cloud OpenAPI V2.0: `https://s.apifox.cn/5113ab93-b1c2-4f3c-bc06-c3656c5352fb`

**中文文档 (Chinese documentation):**

- 私有化 / 默认模块: `https://henvmbbf6x.apifox.cn/8983503m0`
- 公有云 OpenAPI V2.0: `https://s.apifox.cn/4de4a239-c2cc-4572-9b65-90738289f37a`

Serve the link set that matches the user's conversation language. When the language is ambiguous, provide both.
