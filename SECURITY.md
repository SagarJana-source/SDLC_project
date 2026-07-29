# Security

## Prototype security policy

The prototype must use synthetic or sanitized information only.

Do not commit:

- Passwords, tokens, API keys, certificates, or connection strings
- Production source code or proprietary data without authorization
- Personal, customer, financial, health, or regulated data
- Unredacted agent transcripts containing sensitive information
- Generated credentials or local environment files

## Agent and integration controls

- Use least-privilege credentials.
- Keep production systems out of scope.
- Require human approval for external writes.
- Restrict Git operations to a sandbox repository.
- Log agent actions and approval decisions.
- Validate retrieved content before passing it to tools.
- Treat external documents and issue text as untrusted input.

## Reporting a concern

Report security concerns privately to the designated project security owner. Do not place sensitive exploit details or credentials in a public issue.

The security contact remains to be assigned before publishing the repository.
