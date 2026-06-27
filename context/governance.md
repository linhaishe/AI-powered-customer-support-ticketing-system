# Governance

This file defines the project rules for security, permissions, agent boundaries, review, testing, release, and traceability.

## Security and Permissions

- Apply least privilege to user roles, service accounts, API keys, local tools, CI, deployment, and third-party integrations.
- Separate development, staging, and production environments when the project has deployed or customer-facing data.
- Secrets must live only in approved secret stores or local environment files excluded from version control.
- Never commit tokens, credentials, private keys, customer data, production data exports, or internal private documents.
- Permission checks are required before sensitive reads, mutations, exports, destructive actions, admin actions, and external sends.
- **Project-specific owner**: security/product owner is currently unknown; until assigned, human review is required for permission, masking, and data-access work.
- **Open permission questions**: exact RBAC roles, resource scopes, and sensitive field reveal approval rules need company confirmation.

## Data Access Boundaries

- Classify data before using it: public, internal, customer-owned, private, regulated, secret, or generated.
- Use sanitized, synthetic, or development data for agent work unless explicit approval allows another source.
- Production data access requires a named owner, reason, time limit, and evidence trail.
- Customer-owned, regulated, private, or cross-border data must not be copied into prompts, logs, screenshots, fixtures, or public issues unless approved policy allows it.
- Deletion, export, retention, backup, and audit behavior must be documented before implementation when the project stores user or customer data.
- **Allowed data classes**: synthetic mock service cases, PRD text, domain glossary, repository code, and sanitized examples.
- **Restricted data classes**: real consumer PII, production logs, order exports, payment details, internal Tianmao documents, source-system credentials, and unmasked customer conversations.

## AI Agent Restrictions

- Agents may read and edit repository files inside the approved workspace and may run project-local verification commands.
- Agents must not access production secrets, unrestricted customer data, private internal documents, personal accounts, payment dashboards, legal/compliance systems, or source-system admin consoles unless explicitly approved for a narrow task.
- Agents must ask before destructive actions, irreversible migrations, external sends, production deploys, billing changes, permission changes, or deleting user/customer data.
- Agents must record assumptions and unresolved questions in `context/progress-tracker.md`.
- **Allowed agent actions**: create/update context docs, implement mock-first UI/code changes requested by the user, and run local lint/build checks.
- **Prohibited agent actions**: send customer messages, issue refunds/compensation, approve after-sales cases, lower effective risk, access production data, or expose secrets.

## Code Review Gates

- Human review is required before merging changes that affect authentication, authorization, billing, deletion, migrations, compliance, external messaging, generated content publication, secrets, deployment, or customer-visible workflows.
- Reviewers must verify that implementation matches `context/project-overview.md`, `context/architecture-context.md`, `context/design.md`, and `context/implementation-rules.md`.
- High-risk changes require evidence of testing and a rollback or mitigation plan.
- **Default reviewer**: product/engineering owner, currently unknown.
- **Approval rule**: one human approval for ordinary work; extra product/security/compliance approval for high-risk work.

## High-Risk Changes

Treat these as high-risk until the project defines otherwise:

- Authentication and session handling.
- Authorization, roles, ownership, resource scope, and field-level masking.
- Refunds, compensation, after-sales approvals, source-system writes, or financial data.
- Data deletion, export, import, retention, migration, backup, restore, and audit logs.
- Generated content that can be sent to customers or used for decisions.
- External email, SMS, notifications, webhooks, APIs, and third-party writes.
- Compliance, privacy, legal, safety, security, and production deployment changes.

For each high-risk change, document trigger, owner, required review, required verification, rollback/mitigation, and user-visible impact.

## Testing and CI/CD

### Test Strategy

- Use the smallest meaningful verification for narrow changes and broader checks for shared behavior, cross-boundary contracts, data migrations, permissions, or user-facing workflows.
- Unit tests should cover pure risk logic, AI output shape normalization, masking helpers, and usage-event calculations when those modules exist.
- Integration tests should cover BFF/data boundaries, storage, external-service adapters, background work, and role checks when tooling exists.
- End-to-end or manual walkthroughs should cover queue switching, AI panel consistency, draft accept/edit/ignore, high-risk warnings, and stale AI states.
- UI verification covers responsive layout, overflow, keyboard access, loading/error/empty states, and main workflow completion.

### Required Checks

- Existing repository commands: `npm run lint`, `npm run build`.
- Missing command policy: typecheck/test/E2E commands are future tasks; do not invent fake commands during kickoff.
- Evidence must include command, result, and skipped checks with reason.

### GitHub Actions CI

- No CI workflow is currently present.
- Record CI setup as a future implementation task; do not create workflow files during kickoff unless explicitly requested.
- For future GitHub Actions CI, default to pull requests and pushes to the default branch.
- Use least-privilege permissions; start with `contents: read` and add only documented permissions.
- Do not expose production or customer secrets to pull-request workflows.

### Pull Request Gates

- Required reviewers: product/engineering owner; security/compliance owner for high-risk work.
- Required checks: `npm run lint` and `npm run build` until fuller CI exists.
- High-risk approval: extra owner/security/compliance approval is required for data, permissions, AI, or source-system effects.
- Temporary exceptions require owner, reason, expiry, and follow-up task.

### CD and Release Policy

- Deployment trigger: not applicable during kickoff.
- Required environment approvals: unknown until deployment target is chosen.
- Rollback or mitigation: required before real data, auth, AI, or source-system integrations ship.
- Release evidence: local verification plus human review for MVP changes; later CI evidence when CI exists.

## Change Management

- Record durable architecture decisions as ADRs when they affect boundaries, data, security, integration, cost, deployment, or long-term maintainability.
- Link implementation work to the relevant feature spec, issue, PR, ADR, or context section when those artifacts exist.
- Record migrations, rollout steps, compatibility concerns, and rollback plans before executing high-risk changes.
- Communicate user-visible behavior changes, breaking changes, permission changes, and data migrations through the project's approved channel.

## Issue Ticket and PR Traceability

- Feature work should trace from context or spec to implementation and verification.
- PRs or implementation summaries should mention relevant context files and any updated decisions.
- High-risk work must include verification evidence and approval evidence.
- Exceptions must include owner, reason, expiry, and follow-up.

## Compliance Applicability

- `context/compliance.md` exists and is required because the project is in `strict` mode and touches privacy-sensitive, customer-owned, cross-border, and AI-processed customer service data.
- Do not assert compliance without authoritative policy, reviewer, or evidence.

## Open Governance Questions

- Who is the named product/engineering owner for ordinary reviews?
- Who is the named security/privacy/compliance owner for high-risk reviews?
- Which CI platform and deployment target should be used later?
- What exact policy controls field-level masking, retention, and sensitive-field reveal?
