# Source Map

Last updated: 2026-07-09

## Primary sources used for this skill draft

1. DFR whitepaper final PDF
   - Title: `Dock as First Responder — Enterprise Deployment & Operations Guide`
   - Date shown in document: `2026.6`
   - Source type: final whitepaper PDF provided by the skill maintainer

2. FH2 OpenAPI V2.0 Public Cloud markdown
   - Source type: exported markdown reference provided by the skill maintainer
   - Public latest reference provided by user (EN): `https://s.apifox.cn/5113ab93-b1c2-4f3c-bc06-c3656c5352fb`
   - Public latest reference provided by user (中文): `https://s.apifox.cn/4de4a239-c2cc-4572-9b65-90738289f37a`

3. FH2 OpenAPI V2.0 On-Premises default module markdown
   - Source type: exported default-module markdown reference provided by the skill maintainer
   - Latest reference provided by user (EN): `https://41b04hdzmc.apifox.cn/`
   - Latest reference provided by user (中文): `https://henvmbbf6x.apifox.cn/8983503m0`

## Verification notes

- Apifox documents may continue to evolve.
- Treat this skill as a design assistant and context pack, not an immutable API schema.
- Before production coding, verify exact endpoint paths, headers, request bodies, response bodies, and permissions in the latest Apifox documentation.

## Source boundaries

- The DFR whitepaper provides integration strategy, architecture, workflow, deployment choice, and security-review framing.
- The OpenAPI markdown / Apifox documentation provides endpoint-level API details.
- If whitepaper guidance and current Apifox endpoint details differ, prefer the latest official API documentation for endpoint behavior and mark the discrepancy for review.
