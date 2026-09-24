# Integrating FH2 Into an Existing System

Last updated: 2026-07-09

## Purpose

Most customers already have a platform (public-cloud SaaS, internal ops system, command center, or asset system). They do not want a second standalone drone system — they want FH2 capability **inside** what they already run.

This file covers how to connect FH2 into an existing system, including how to reuse `examples/dfr-public-cloud-demo/` as an adapter layer rather than as a finished product.

Read this together with `middleware-patterns.md` (Pattern 5, OpenAPI adapter layer) and the scenario architecture references.

## Core principle: adapter layer, not a second product

```text
Your existing platform (UI, accounts, business logic)
  → your domain service
    → FH2 adapter layer          ← this is what you build
      → FH2 OpenAPI / Event API / FlightHub Sync / storage
```

Keep the adapter thin and separate. It owns token injection, project scoping, tracing, retries, schema validation, and deployment-specific differences. Your business logic must not call FH2 directly.

## Three integration depths

Pick the shallowest depth that satisfies the requirement.

| Depth | What you integrate | Effort | Best when |
|---|---|---|---|
| **L1 — Notify** | Receive Event API callbacks into your platform | Low | You only need to know that something happened (media ready, task done, alert raised) |
| **L2 — Consume** | Pull data and media, show live video and position in your UI | Medium | Your platform must display drone data alongside existing data |
| **L3 — Control** | Trigger dispatch, create tasks, manage waylines and livestream sessions from your platform | High | Your platform becomes the operator-facing entry point |

Most "link it with our existing cloud system" requests are satisfied by **L1 + L2**. Do not jump to L3 unless the user needs to command flights from their own UI.

## Reusing the demo as an adapter layer

`examples/dfr-public-cloud-demo/` ships with its own Vue frontend. When integrating into an existing platform, **keep the backend, drop or ignore the frontend**.

| Demo part | Reuse in an existing system? | How |
|---|---|---|
| `backend/server.js` dispatch proxy | Yes | Keep the allowlist and request validation; expose it as an internal API your platform calls |
| `backend` webhook receiver | Yes | Point FH2 Event API at it; forward normalized events into your message bus or DB. **Add `x-dji-signature` verification first.** |
| `backend` storage endpoints | Maybe | Replace MinIO config with your own S3; or skip and let your platform read storage directly |
| `backend` WebSocket push | Maybe | Useful if your platform has no realtime channel; otherwise use your existing one |
| `frontend/` Vue app | No | Reference only. Rebuild the needed views inside your own UI |
| `backend` per-user JSON config | No | Replace with your platform's config/secret management |

## Connecting the pieces to an existing platform

### Accounts and permissions

- FH2 organization key and project UUID are **service-level credentials**, not per-end-user credentials.
- Keep them in the adapter layer / backend secret store. Never expose them to your platform's browser clients.
- Map your platform's users and roles to FH2 project scope in the adapter, and enforce your own authorization before calling FH2.
- On Public Cloud, do not assume SSO integration with FH2. On On-Premises / AIO, OAuth 2.0 / SSO options may exist — confirm with the deployment owner.

### Showing drone UI inside your platform

- **Public Cloud:** Frontend Components are not available. Deliver capability through livestream (RTMP / RTSP / WebRTC), OpenAPI data, and Event API, rendered by your own UI.
- **On-Premises / AIO:** Frontend Components can embed FH2 UI directly, which is usually the fastest path to an operator view.

### Live video into an existing system

- If your platform already has a video pipeline or VMS, forward the stream into it rather than embedding a separate player.
- Choose the protocol by what your platform already accepts: RTMP push, RTSP pull, or WebRTC for low-latency browser viewing.

### Events into an existing system

- Receive Event API callbacks in the adapter, verify `x-dji-signature`, deduplicate by event ID, then publish into your existing queue / webhook / DB.
- Do not let FH2 call your business services directly.

### Storage and evidence

- Prefer syncing media into storage your platform already uses, then link objects to your existing records.
- Keep bucket or prefix separation per project, and retain your own metadata for chain of custody.

## Recommended sequence for "demo now, integrate later"

| Phase | Goal | Output |
|---|---|---|
| Phase 1 | Show leadership what is possible | Run the demo standalone on Public Cloud; no integration with the existing system yet |
| Phase 2 | Prove one-way integration | L1 + L2: events and media flow into the existing platform; drone data visible in the existing UI |
| Phase 3 | Operator entry point | L3 where justified: dispatch / task control from the existing platform, with permissions and human-in-the-loop |
| Phase 4 | Harden | Signature verification, secret management, audit logs, retention, failure handling |

Be explicit with the user that Phase 1 is a demo, not an integration. The demo is teaching-grade; see its `LIMITATIONS.md`.

## Guardrails

- Confirm the deployment model before promising any embedding or API capability.
- Do not expose FH2 tokens to the customer's browser clients.
- Do not let a demo-grade component (unverified webhook, file-based storage) enter the integrated path without hardening.
- Verify every endpoint with the FH2 OpenAPI MCP if available, otherwise the latest Apifox documentation.
- Keep human-in-the-loop for any dispatch or flight-control capability surfaced inside the customer's platform.
