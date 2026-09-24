# Cursor Rules Adapter

Last updated: 2026-06-24

If your team uses Cursor, you can copy the following content into a project rule, for example:

```text
.cursor/rules/fh2-integration.mdc
```

## Cursor rule content

```md
---
description: DFR and FlightHub 2 middleware integration guidance for DJI Dock, CAD, VMS, GIS, PSIM, evidence, telemetry, livestream, Event API, FlightHub Sync, and OpenAPI workflows.
globs:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.js"
  - "**/*.py"
  - "**/*.md"
alwaysApply: false
---

# Awesome DFR Integration Rule

When designing DJI Dock / FlightHub 2 middleware, first confirm the FlightHub 2 deployment model:

1. Public Cloud
2. On-Premises / Private Deployment
3. AIO / private all-in-one appliance

Do not recommend FH2 OpenAPI endpoints until the deployment model is known.

After deployment is known, confirm the workflow scenario:

1. DFR / emergency response — alarm-driven, real-time livestream and human takeover
2. Inspection / patrol — plan-driven, periodic, wayline + planned task, media capture and analysis
3. Both

Do not mix DFR and inspection interface logic. Do not apply DFR real-time-takeover to inspection, or cron scheduling to DFR alarm response.

Use these boundaries:

- Public Cloud: use only Public Cloud OpenAPI V2.0 capabilities.
- On-Premises / AIO: use the FH2 OpenAPI V2.0 On-Premises default module as the primary reference.
- Private deployment exposes broader API capabilities than Public Cloud.
- Do not invent endpoints, headers, MQTT topics, event types, or request schemas.
- Verify exact endpoint schemas in the latest Apifox documentation before production code.

For DFR middleware designs, output:

1. deployment gate
2. recommended architecture
3. interface / API mapping
4. implementation plan
5. security guardrails
6. test plan
7. open questions

Preserve security controls: token protection, project-level permissions, Event API signature verification, idempotent callbacks, request tracing, audit logs, and human-in-the-loop safety review.
```
