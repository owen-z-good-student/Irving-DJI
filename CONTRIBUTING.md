# Contributing

Thanks for improving Awesome DFR Integration Skill.

## Contribution scope

Useful contributions include:

- clearer deployment-boundary wording
- new DFR middleware patterns
- additional eval prompts
- fixes for outdated API references
- security guardrail improvements
- Claude Code / Cursor adapter improvements

## Rules

1. Do not invent FlightHub 2 endpoints, headers, event types, MQTT topics, or request schemas.
2. Keep Public Cloud and On-Premises / AIO API surfaces separate.
3. Do not add secrets, customer data, internal-only screenshots, or production identifiers.
4. When exact API behavior matters, link to the latest official documentation.
5. Update `CHANGELOG.md` for user-visible changes.

## Testing

Before proposing a change, run or manually review the eval prompts in:

```text
evals/evals.json
evals/eval-runbook.md
```

Release-candidate quality requires at least 8 / 9 evals to pass with no critical failure.
