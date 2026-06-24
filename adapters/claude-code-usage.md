# Claude Code Usage

Last updated: 2026-06-24

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

## Expected first behavior

If the deployment model is not known, the assistant should first ask:

```text
Which FlightHub 2 deployment model are you integrating with?

1. FlightHub 2 Public Cloud
2. FlightHub 2 On-Premises / Private Deployment
3. AIO / private all-in-one appliance
```

## Recommended follow-up flow

After deployment is confirmed, ask for:

- target platform: CAD / VMS / GIS / PSIM / evidence / dashboard
- integration domain: dispatch / livestream / telemetry / media / events / frontend component
- project phase: PoC / validation / security review / production
- expected output: architecture / API mapping / implementation plan / code skeleton
