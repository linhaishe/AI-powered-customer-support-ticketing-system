# Wireframes

## Source Context

- **Product overview**: `context/project-overview.md`
- **Architecture context**: `context/architecture-context.md`
- **Design direction**: `context/design.md`
- **Mode**: strict

## Main User Flow

1. Platform agent opens `/`.
2. Workbench loads with metrics and first service case selected.
3. Agent selects or reviews a queue item.
4. Case context and AI assistant update together.
5. Agent accepts, edits, or ignores the draft; no real message is sent.

## Screen Map

| Flow Step | Screen or State | Primary User Goal | Key Data / Controls | Notes |
| --------- | --------------- | ----------------- | ------------------- | ----- |
| 1-4 | Customer Support Workbench | Triage and understand a selected service case | Metrics, queue, case details, AI panel | See `prototypes/screens/001-workbench.md` |
| 5 | Draft Review State | Decide how to use the AI draft | Draft textarea, accept/edit/ignore, safety note | See `prototypes/screens/002-draft-review.md` |
| Future high-risk branch | Supervisor Review | Approve or revise high-risk responses | Case context, AI evidence, risk controls, audit trail | See `prototypes/screens/003-supervisor-review.md` |

## Global Layout Rules

- Desktop uses a three-column workbench: queue, details, AI assistant.
- Mobile stacks metrics, queue, details, and AI assistant with no horizontal overflow.
- Primary draft actions stay near the draft and safety note.
- Risk, citations, and masking notes must be visible where they affect trust.
- Error and unavailable states preserve manual handling.

## Screen Wireframes

Separate strict-mode screen files exist, so this document remains the map:

- `prototypes/screens/001-workbench.md`
- `prototypes/screens/002-draft-review.md`
- `prototypes/screens/003-supervisor-review.md`

## Cross-Screen States

- **Authentication or access denied**: not implemented in phase one; future auth failures should show safe denial without exposing case data.
- **First-run or onboarding**: not needed; first screen is the workbench.
- **Empty project or no data**: future state should show manual SOP guidance and no AI draft.
- **Background work pending**: future AI pending state belongs in AI panel with draft controls disabled until safe.
- **Collaboration or multi-user state**: future supervisor review and operations handoff need audit trail.
- **Review or approval required**: high-risk commitments, risk changes, and sensitive field reveal need human review.
- **Destructive action confirmation**: refunds, compensation, after-sales closure, and external sends remain out of phase-one scope.

## Open Wireframe Questions

- Should future queue filters live in the queue header or top metrics area?
- Should AI citations be expandable inline or open a knowledge preview panel?
- Should supervisor review reuse the AI panel or become a separate route?
