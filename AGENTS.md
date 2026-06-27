<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Tianmao Global AI Customer Service Center Agent Guide

## Purpose

This repository is a mock-first Next.js 16 MVP for a Tianmao Global AI-assisted customer service workbench. AI agents should use the context package as the durable source for product scope, domain language, architecture boundaries, UI rules, governance, and handoff state before making changes.

## Required Context

Before changing product behavior, architecture, UI, data, permissions, or implementation workflow, read the relevant files:

- `docs/prd.md` — source PRD and phase-one acceptance criteria.
- `CONTEXT.md` — domain glossary for service cases, AI usage, masking, and risk concepts.
- `context/project-overview.md` — product goals, users, scope, success criteria, assumptions, and open questions.
- `context/architecture-context.md` — stack, system boundaries, data model, integrations, permissions, automation, and invariants.
- `context/design.md` — UI source, theme tokens, layout patterns, component conventions, and interaction states.
- `context/implementation-rules.md` — code standards, workflow rules, verification, documentation updates, and protected files.
- `context/governance.md` — security, permission, review, CI/CD, and traceability rules.
- `context/compliance.md` — customer-data, cross-border, and AI processing constraints.
- `context/progress-tracker.md` — current phase, active goal, open questions, risks, verification, and next workflow.

## Working Rules

- Work in small, verifiable units tied to the current goal or an approved feature spec.
- Do not invent product behavior, architecture, routes, storage, roles, or UI patterns that are not in the context files.
- If a requirement is missing or contradictory, record the ambiguity in `context/progress-tracker.md` and ask for resolution when it blocks safe progress.
- Keep generated, vendor-managed, shared foundation, and high-risk files unchanged unless the task explicitly requires editing them.
- Update the relevant context files when implementation changes product scope, architecture boundaries, storage, permissions, design rules, verification expectations, or progress state.

## Verification

- Run the project-specific checks listed in `context/implementation-rules.md` before claiming work is complete.
- Current required checks for implementation work are `npm run lint` and `npm run build`.
- If a check cannot run, record the command, reason, and residual risk in `context/progress-tracker.md`.
- Manual review is required for high-risk changes such as permissions, masking, customer data, generated customer replies, external messages, refunds, compensation, after-sales closure, or irreversible automation.

## Handoff

- Keep `context/progress-tracker.md` current at the end of each work session.
- Include completed work, in-progress state, next recommended workflow, open questions, decisions, and verification evidence.
- Prefer links to context files over duplicating long explanations in this file.
