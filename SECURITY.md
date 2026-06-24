# Security Policy

## Sensitive information

Do not commit credentials, tokens, customer data, project UUIDs, device serial numbers, private endpoints, screenshots containing secrets, or production configuration files.

Use placeholders in examples:

- `<X_USER_TOKEN>`
- `<PROJECT_UUID>`
- `<DEVICE_SN>`
- `<FH2_BASE_URL>`
- `<WEBHOOK_SECRET>`

## Production use

This skill is a design aid. Before using generated code or architecture in production, verify:

- FlightHub 2 deployment model
- exact API endpoint and schema
- authentication and permission model
- Event API signature behavior
- network and firewall requirements
- customer safety and IT review requirements

## Reporting issues

For documentation or integration-guidance issues, open a GitHub issue with:

- deployment model: Public Cloud / On-Premises / AIO
- affected integration domain: dispatch / livestream / telemetry / media / Event API / Frontend Components
- expected behavior
- observed behavior
- relevant documentation link

Do not include secrets or customer-sensitive details.
