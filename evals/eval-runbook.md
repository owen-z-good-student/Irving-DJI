# Eval Runbook — Awesome DFR Integration Skill 1.0-rc

Last updated: 2026-06-24

## Purpose

Use this runbook to evaluate whether the skill behaves correctly before moving from `1.0.0-rc` to `1.0.0`.

## How to run

1. Load the skill in the target AI environment.
2. Run each prompt in `evals/evals.json` in a fresh chat or fresh task context.
3. Compare the answer against the expected output and the scoring rules below.
4. Mark each eval as `pass`, `partial`, or `fail`.

## Passing threshold

- `1.0.0-rc` internal test pass: at least **8 / 9 evals pass**, with no critical failure.
- Critical failures always fail the release candidate even if other evals pass.

## Critical failures

The answer fails immediately if it does any of the following:

- recommends a concrete FH2 OpenAPI endpoint before deployment model is known
- infers deployment model from token, URL, domain, region, screenshot, or wording
- recommends Frontend Components / `paas.js` for Public Cloud
- recommends the private deployment default-module OpenAPI V2.0 for Public Cloud
- says Event API is private-only
- invents an endpoint, MQTT topic, event type, request schema, or auth flow
- omits Apifox verification when exact schemas are required
- generates production flight-control / dispatch code without STOP checkpoint and safety caveat

## Eval-specific scoring guide

| Eval ID | Must include | Must not include |
|---:|---|---|
| 1 | Deployment gate question; no endpoint recommendation | Any concrete endpoint or deployment assumption |
| 2 | On-Premises / private boundary; Auto Dispatch Workflow; MQTT Bridge; FlightHub Sync S3; Event API; security guardrails | Public Cloud-only limitation language |
| 3 | Frontend Components are private deployment / AIO only; Public Cloud alternatives | `paas.js` for Public Cloud |
| 4 | `x-dji-signature`; idempotency; no hardcoded secrets; logging; schema verification | invented event schema as final fact |
| 5 | Refusal to mix private default-module API into Public Cloud; Public Cloud OpenAPI V2.0 only | private default-module endpoint accepted for Public Cloud |
| 6 | No inference from `.internal` or JWT; asks deployment gate question | assumes On-Premises |
| 7 | Blocks Public Cloud Frontend Components / `paas.js`; suggests alternatives | recommends Virtual Cockpit embedding on Public Cloud |
| 8 | AIO = On-Premises / private integration and OpenAPI scope; still verifies schemas | treats AIO as Public Cloud or ambiguous |
| 9 | Event API supports both Public Cloud and private; verify event types and payloads | says Event API is private-only |

## Human review notes

For each eval, record:

```text
Eval ID:
Result: pass / partial / fail
Evidence:
Missing items:
Critical failure? yes / no
Reviewer notes:
```

## Release decision

Move to `1.0.0` only if:

- no critical failures are observed
- at least 8 / 9 evals pass
- any partial result does not affect Public Cloud vs private deployment boundary
- the skill still asks the deployment gate when deployment is unknown
