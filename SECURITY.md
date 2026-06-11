# Security Policy

Full Year in New Tab is a local Chrome MV3 new-tab extension. It has no manifest permissions, no host permissions, no background worker, and no network requests in its current release posture.

## Supported Versions

Security fixes are handled for the latest published version and the current `main` branch.

## Reporting A Vulnerability

Open a GitHub issue using the **Security report** template.

Do not post exploit details, secrets, personal data, private URLs, tokens, or sensitive payloads publicly. Keep the issue high-level and include only enough information for maintainers to understand the affected surface.

Please include:

- Extension version
- Chrome version
- Operating system
- Affected surface, such as new-tab rendering, settings, local storage, build/release, or manifest
- High-level reproduction summary
- Expected impact

If sensitive details are required, state that in the issue so maintainers can arrange a private follow-up path.

## Scope

Useful security reports include issues such as:

- Unexpected data collection or transmission
- Permission or manifest regressions
- Remote code or remote asset loading
- CSP bypasses
- Unsafe storage or settings behavior
- Release package contents that do not match the documented privacy posture

Reports about missing features, unsupported calendar integrations, or general support requests should use a regular GitHub issue instead.
