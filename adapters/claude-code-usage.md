# Claude Code Usage

*English | [中文](./claude-code-usage.zh-CN.md)*

Last updated: 2026-07-09

## Recommended installation pattern

Place the folder in your local Claude / OpenCode skill directory according to your environment, then invoke it by asking for FlightHub 2 / DFR middleware design.

Example prompts:

```text
Use Awesome DFR Integration Skill to design a CAD-to-FlightHub 2 dispatch middleware.
```

```text
I need a FlightHub 2 On-Premises middleware that sends DFR telemetry to our GIS dashboard. Use the DFR integration skill and give me the architecture and API boundary.
```

```text
We use FlightHub 2 Public Cloud. Help design a VMS livestream integration for DFR operations.
```

```text
Use the FH2 integration skill to design an inspection middleware: let an operator upload a wayline, sync it to the FH2 route library, and run a scheduled substation thermal inspection.
```

```text
We use FlightHub 2 On-Premises. Design how inspection media flows to our third-party AI defect analysis platform.
```

## Expected first behavior

If the deployment model is not known, the assistant should first ask:

```text
Which FlightHub 2 deployment model are you integrating with?

1. FlightHub 2 Public Cloud
2. FlightHub 2 On-Premises / Private Deployment
3. AIO / private all-in-one appliance
```

After deployment is known, if the scenario is unclear, the assistant should ask:

```text
Which workflow scenario are you integrating?

1. DFR / emergency response
2. Inspection / patrol
3. Both
```

## Recommended follow-up flow

After deployment and scenario are confirmed, ask for:

- target platform: CAD / VMS / GIS / PSIM / evidence / dashboard / AI analytics
- integration domain: dispatch / wayline / planned task / livestream / telemetry / media / events / frontend component
- project phase: PoC / validation / security review / production
- expected output: architecture / API mapping / implementation plan / code skeleton
