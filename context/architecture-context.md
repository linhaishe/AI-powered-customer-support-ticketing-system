# Architecture Context

## Stack

| Layer | Technology | Role | Status |
| ----- | ---------- | ---- | ------ |
| Framework | Next.js 16.2.9 App Router | Root route, future API routes, and full-stack evolution | Confirmed |
| UI runtime | React 19.2.4 | Client-side workbench interactions | Confirmed |
| Language | TypeScript with `strict: true` | Domain types, props, future API and AI schemas | Confirmed |
| Styling | Tailwind CSS 4 via `@tailwindcss/postcss` | Utility styling and future tokenized UI rules | Confirmed |
| Phase-one data | Local mock data in `app/mock-service-data.ts` | Synthetic service cases and AI outputs | Confirmed |
| Phase-one UI | `app/customer-service-workbench.tsx` | Workbench layout, case switching, and draft state | Confirmed |
| Future BFF/API | Next.js route handlers under `app/api` | Aggregation, validation, masking, authorization, audit writes | Assumed |
| Future database | PostgreSQL or MySQL | Durable service, conversation, snapshot, knowledge, AI, usage, and risk records | Open |
| Future AI | AI SDK with structured JSON output | Replace local AI-assist output after validation and safety filtering | Open |
| Future async/cache | Redis plus queue or background worker | Idempotency, safe cache, stale AI state, and async AI jobs | Open |

## System Boundaries

- `app/page.tsx` — root route entry; should stay thin and render the workbench.
- `app/customer-service-workbench.tsx` — phase-one client workbench UI; does not own durable authorization, masking, persistence, or AI provider logic.
- `app/mock-service-data.ts` — synthetic domain data and phase-one TypeScript shapes; must stay separate from production data.
- `app/globals.css` — global Tailwind import and base theme variables.
- `docs/prd.md` — product source of truth for phase-one scope.
- `CONTEXT.md` — domain glossary and terminology authority.
- `context/` — durable project context package for future AI agents.
- `prototypes/` — flow and wireframe notes; not production UI code.

## Data and Storage Model

- **Phase-one mock data**: local synthetic records in `app/mock-service-data.ts`; no retention or production access constraints beyond keeping it synthetic.
- **Service case metadata**: future relational storage for `ServiceCase`, status, priority, risk, assignment, reopen state, and related-case links.
- **Conversation data**: future relational storage for `Conversation` and `CaseMessage`; may contain PII and must be masked before AI/frontend use.
- **Business context**: future order, logistics, after-sales, and merchant data comes from source systems through BFF aggregation rather than direct frontend or AI database access.
- **AI context**: future `ContextSnapshot` stores the authorized and masked point-in-time context used for an AI suggestion.
- **Knowledge evidence**: future `KnowledgeCitation` stores versioned snippet, article ID/version, locale, region, and reason for relevance.
- **Audit records**: future `AIInteraction`, `AIUsageEvent`, and `RiskAssessmentEvent` are append-only audit records.
- **Cache and background state**: deferred; should not be introduced until BFF boundaries and masking policy are defined.

## Auth, Permissions, and Collaboration Model

- Phase one has no real authentication; the UI shows a platform-agent role label only.
- Future model uses RBAC plus resource scope plus field-level masking.
- Platform agents read assigned or queue-scoped service cases.
- Supervisors read team, high-risk, and escalated cases, with audit for sensitive field reveals.
- Platform operations default to aggregate or masked data.
- Merchant operations read only merchant-owned masked/summarized case views.
- AI service accounts read only masked `ContextSnapshot` records and authorized knowledge snippets.
- Permission checks are required before sensitive reads, draft publication, external sends, exports, risk changes, admin actions, and source-system business actions.

## Integrations and External Services

- **Tianmao service/order/logistics/after-sales/merchant systems**: future source systems for business context; deferred in phase one, must fail closed and preserve manual handling.
- **Knowledge base**: future versioned SOP/policy source; AI may cite approved snippets only.
- **AI provider**: future structured generation provider; unavailable or failed output must not display unsafe partial drafts.
- **Payment/refund/after-sales systems**: future source systems for business actions; AI workbench must not execute these actions directly.
- **Audit/logging system**: future sink for AI, usage, and risk events; must avoid raw PII in logs unless approved.

## AI, Automation, or Background Work

### Phase-One Local AI Assistance

- **Input**: selected mock service case and preauthored mock AI fields.
- **Execution**: synchronous client-side rendering.
- **Output**: summary, category, sentiment, suggested risk, actions, citations, draft, and safety note.
- **Review boundary**: agent may accept/edit/ignore locally, but no real customer message or business action is sent.

### Future Structured AI Assistance

- **Input**: masked `ContextSnapshot`, service intent, locale, region, and versioned knowledge snippets.
- **Execution**: validated server-side or background AI workflow.
- **Output**: schema-validated `AIInteraction` with citations and safety metadata.
- **Review boundary**: human confirms draft use and any high-risk action; AI cannot lower effective risk or execute source-system actions.

## Reusable Templates, Starter Data, or Seeds

- Mock service cases should cover customs delay/refund demand, refund settlement, import tax, and damaged item after-sales delay.
- Future fixtures should remain synthetic and explicitly marked as demo data.
- Prompt templates and AI schemas should live outside large UI components when real AI is introduced.

## Invariants

1. `ServiceCase` is split by service intent, not message count.
2. A `Conversation` can link to multiple `ServiceCase` records.
3. AI suggestions must be traceable to the `ContextSnapshot` and `KnowledgeCitation` versions used at generation time.
4. AI may suggest raising risk but must not automatically lower effective `RiskLevel`.
5. High-risk actions require human confirmation and execution in source business systems.
6. Field-level masking must run before data reaches the frontend or AI context.
7. Production secrets, unrestricted customer data, and private internal documents must not enter AI agent context.

## Risks and Open Technical Questions

- Database choice, schema migration strategy, and retention policy are open.
- Approved AI provider, model, region, and logging/retention settings are open.
- BFF authorization and masking policy need design before real data integration.
- Async job, cache, and stale AI behavior need design before real AI generation.
- CI is not yet configured; do not create workflow files during kickoff without a separate request.
