# ADR 0001: Mock-First AI Service Workbench

## Status
Accepted

## Date
2026-06-27

## Owners
Product and engineering reviewers for the Tianmao Global AI Customer Service Center MVP.

## Context
The PRD asks for a demonstrable first-phase AI customer service workbench that simulates Tianmao Global service, order, logistics, after-sales, merchant, platform-rule, and knowledge-base context. The product has meaningful safety and compliance boundaries: customer PII, cross-border data, AI-generated recommendations, effective risk levels, and high-risk business actions such as refund, compensation, after-sales approval, and message sending.

## Decision
Build phase one as a mock-first Next.js workbench. Use local synthetic data, deterministic structured AI-assist output, root-route workbench rendering, and local draft action state. Defer real BFF, database, AI provider, retrieval, cache, queue, RBAC, masking, source-system actions, and audit persistence until follow-on feature specifications define their boundaries.

## Alternatives Considered
- Real BFF and database first: deferred because auth, masking, audit, retention, and schema decisions need policy and architecture confirmation.
- Real AI API first: deferred because context snapshots, citation versioning, schema validation, redaction, fallback behavior, and provider approvals are not yet implemented.
- Complete customer service platform first: rejected for phase one because the PRD explicitly scopes the MVP to a demonstrable AI support workbench.

## Consequences
- Positive: Product, UI, domain terminology, and AI safety boundaries can be demonstrated quickly.
- Positive: Future implementation can replace mock layers incrementally.
- Positive: Real customer data and high-risk business actions remain out of scope while governance is established.
- Negative or trade-offs: Phase one does not prove production integration, real AI quality, persistence, or authorization behavior.
- Follow-up work: create feature specs for BFF/API aggregation, persistence, AI SDK integration, context snapshots, masking, audit events, and supervisor review.

## Related Records
- Feature specs: none created during kickoff.
- Issues, tickets, or PRs: none created during kickoff.
- Product requirements: `docs/prd.md`
- Domain glossary: `CONTEXT.md`
- Architecture context: `context/architecture-context.md`
