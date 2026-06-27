# Tianmao Global AI Customer Service Center

## Overview

Tianmao Global AI Customer Service Center is a cross-border ecommerce support workbench for platform customer service agents. It aggregates service case, conversation, order, logistics, after-sales, merchant, platform-rule, and knowledge context, then provides AI-assisted summaries, risk signals, handling guidance, knowledge citations, and editable reply drafts so agents can respond faster without letting AI execute high-risk business actions.

## Goals

1. Help platform agents understand complex cross-border service cases quickly.
2. Make AI guidance traceable through context snapshots, knowledge citations, risk signals, and visible safety notes.
3. Validate a mock-first MVP that can later evolve into BFF aggregation, persistence, real AI, retrieval, caching, async jobs, RBAC, masking, and audit logs.

## Core User Flow

1. Platform agent opens `/` and lands directly in the support workbench.
2. System selects the first high-risk mock service case by default.
3. Agent reviews top metrics, the risk-ranked queue, and the selected case context.
4. Agent checks AI summary, category, sentiment, suggested risk, recommended actions, citations, draft, and safety warning.
5. Agent accepts, edits, or ignores the AI draft; the MVP records only local UI state and does not send a real message.

## Features

### Workbench Shell

- Single `/` route displays the workbench instead of a landing page.
- Three operational regions: service queue, case details, and AI assistant panel.
- Top metrics for service volume, AI adoption, high-risk cases, and average handle time.

### Service Case Context

- 3 to 4 mock cross-border service cases.
- Case switching refreshes details and AI output together.
- Case details include consumer issue, conversation history, order, logistics, after-sales, merchant, and platform rules.

### AI Assistance

- Structured AI panel shows summary, issue type, sentiment, suggested risk level, handling actions, citations, draft reply, and safety note.
- AI draft supports accept, edit, and ignore states.
- High-risk cases surface supervisor review or cautious-commitment warnings.

### Domain and Governance Foundation

- Domain model uses `ServiceCase`, `Conversation`, `CaseMessage`, `ContextSnapshot`, `KnowledgeCitation`, `AIInteraction`, `AIUsageEvent`, and `RiskAssessmentEvent`.
- Later real systems use RBAC, resource scope, and field-level masking.
- AI service accounts can read only masked snapshots and authorized knowledge snippets.

## Scope

### In Scope

- Mock-driven customer support workbench.
- Local TypeScript mock data for service, order, logistics, after-sales, merchant, knowledge, citation, and AI assistant results.
- Local deterministic AI-assist output.
- Draft accept/edit/ignore UI feedback.
- Visible AI safety boundaries, PII masking language, knowledge evidence, and risk warnings.
- Durable context, governance, compliance, ADR, and wireframe documentation.

### Out Of Scope

- Real login and authorization in phase one.
- Real database persistence.
- Real AI API, vector retrieval, or AI SDK integration.
- Real Tianmao internal system integration.
- Real customer message sending.
- Automated refunds, compensation, after-sales approval, after-sales closure, or risk lowering.
- Operational insight pages, knowledge management UI, audit UI, and settings UI.

## Success Criteria

1. A reviewer can understand the product problem within 1 minute of opening the app.
2. The workbench displays at least 3 cross-border service cases and updates detail and AI panels when the selected case changes.
3. The main customs-delay scenario shows stale logistics, customer dissatisfaction, high risk, citations, safety warning, and an English reply draft.
4. Accept, edit, and ignore actions show clear feedback and never send a real message.
5. Desktop layout has no obvious overlap, clipping, or text overflow.
6. Code remains structured so mock data, local AI, and frontend-only state can later be replaced with BFF/API, persistence, real AI, async jobs, and audit logs.
7. `npm run lint` and `npm run build` pass before implementation work is considered complete.

## Assumptions and Open Questions

### Assumptions

- Current kickoff mode is `strict` because the PRD includes privacy-sensitive customer service data, cross-border context, AI recommendations, risk levels, and human-review requirements.
- UI source is `Reference URLs`, with `https://posthog.com/` used only for design-language inspiration.
- Phase one remains mock-only and does not require CI creation during kickoff.

### Open Questions

- Which company policy defines exact field-level masking for phone, email, address, payment, images, and conversation text?
- Which production regions and data residency rules will apply?
- Which AI provider/model family is approved for customer support context?
- Who owns supervisor review rules for high-risk logistics, refund, compensation, and tax cases?
