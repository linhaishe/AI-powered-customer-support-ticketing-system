# User Flow

## Source Context

- **Product overview**: `context/project-overview.md`
- **Architecture context**: `context/architecture-context.md`
- **Design direction**: `context/design.md`
- **Wireframes**: `prototypes/wireframes.md`

## Actors

| Actor | Goal | Permissions / Constraints | Notes |
| ----- | ---- | ------------------------- | ----- |
| Platform agent | Understand a service case and prepare a safe reply | Phase one uses mock persona; future access limited to assigned/team queue cases | Primary MVP user |
| Supervisor | Review high-risk cases and risk changes | Future role; high-risk approval and sensitive field audit required | Not implemented in phase one |
| Platform operations | Improve rules and knowledge coverage | Future role; aggregate/masked data by default | Not implemented in phase one |
| Merchant operations | Review merchant-owned service issues | Future role; masked/summarized views only | Not implemented in phase one |
| AI service account | Generate suggestions from masked context | Reads only authorized snapshots and knowledge snippets; cannot execute actions | Future service actor |

## Primary Flow

1. Platform agent opens `/`.
   - System response: workbench loads with metrics and first high-risk mock case selected.
   - Next screen/state: Customer Support Workbench.
2. Platform agent selects or reviews a service case.
   - System response: case detail and AI assistant panel show matching context and AI output.
   - Next screen/state: Case Review.
3. Platform agent reviews AI summary, suggested risk, actions, citations, draft, and safety note.
   - System response: draft controls remain local and no source-system action is available.
   - Next screen/state: Draft Review.
4. Platform agent accepts, edits, or ignores the draft.
   - System response: local status updates for the selected service case.
   - Next screen/state: Accepted, Editing, or Ignored state.
5. Completion condition: agent has a reviewed draft decision while the MVP has not sent any real message or business action.

## Branches and Exceptions

### Edit Draft

- **Trigger**: agent chooses to modify tone, language, or unsafe commitments.
- **Actor action**: edit the draft body.
- **System behavior**: marks the selected case as editing and preserves local text.
- **Recovery or next state**: agent may accept later or keep manual handling.
- **Open question**: future version needs audit semantics for edited-and-used versus edited-only.

### Ignore Suggestion

- **Trigger**: AI guidance does not match agent judgment.
- **Actor action**: choose ignore.
- **System behavior**: marks suggestion ignored for the selected case.
- **Recovery or next state**: agent handles manually.
- **Open question**: future negative-feedback reasons need taxonomy.

### High-Risk Case

- **Trigger**: effective risk level is high or AI suggests high risk.
- **Actor action**: review warning and avoid unsupported commitments.
- **System behavior**: shows safety note and future supervisor review boundary.
- **Recovery or next state**: future supervisor queue.
- **Open question**: exact supervisor approval policy is unknown.

## Asynchronous or Background Work

- **Work item**: future AI generation.
- **Start trigger**: case context snapshot changes or agent requests AI refresh.
- **Visible status**: pending/running/success/stale/error state in AI panel.
- **Failure handling**: preserve manual handling path and show latest successful AIInteraction only when safe.

## Review and Approval Gates

- High-risk reply: supervisor or authorized reviewer confirms before source-system send.
- Risk level change: record `RiskAssessmentEvent` with actor, reason, old/new risk, and timestamp.
- Sensitive field reveal: record viewer, field, case, reason, and timestamp.
- Knowledge or policy change: platform operations reviews article version before AI can cite it.

## Cross-Role Handoff

- Platform agent -> Supervisor: high-risk case context, AI output, draft, citations, and safety concerns.
- Supervisor -> Platform agent: approved reply, requested edits, or escalation decision.
- Platform agent -> Platform operations: knowledge gap or inaccurate AI suggestion.
- Platform operations -> AI service account: approved updated knowledge article version.

## Open Flow Questions

- What exact state should distinguish accepted, edited-and-used, dismissed, reported-inaccurate, and not-used?
- Should supervisor review be a separate route, panel mode, or queue filter?
- When does a resolved service case become closed and no longer reopenable?
