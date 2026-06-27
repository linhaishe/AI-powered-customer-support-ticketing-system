# Future Supervisor Review

## Purpose

Define the future high-risk review surface so phase-one data and UI decisions do not block escalation workflows.

## Source Context

- **Flow step**: high-risk branch in `prototypes/user-flow.md`.
- **Design rules**: serious risk tone, evidence-first layout, clear review gates.
- **Architecture constraints**: not implemented in phase one; future risk changes create `RiskAssessmentEvent`.

## Entry Conditions

- A service case is high risk, escalated, or contains a draft requiring supervisor approval.
- Supervisor is authenticated and authorized in a future implementation.

## Layout

| Region | Content | Controls | Notes |
| ------ | ------- | -------- | ----- |
| High-risk queue | Escalated cases and risk reasons | Select case, filter | Future route or panel mode |
| Case evidence | Customer issue, history, order/logistics/after-sales context | Sensitive reveal request | Sensitive fields audited |
| AI evidence | Summary, citations, suggested risk, safety note | Report inaccurate | Preserve snapshot and citation versions |
| Draft review | Agent draft, edits, warnings | Approve, request edits, escalate | No direct source-system send from AI |
| Audit panel | Actor, decision, reason, old/new risk | Submit decision | Creates future risk/audit events |

## Primary Actions

- Approve reply — records supervisor approval for future source-system send path.
- Request edits — returns case to platform agent with required changes.
- Confirm or raise risk — records a `RiskAssessmentEvent`.

## Secondary Actions

- Escalate to logistics, after-sales, merchant operations, or platform policy owner.
- Reveal sensitive field with reason when policy allows.

## States

- **Empty**: no high-risk cases; show clear empty queue.
- **Loading**: show skeletons without revealing stale sensitive data.
- **Error**: preserve queue and explain recovery.
- **Success/complete**: decision recorded with actor, reason, timestamp, and evidence.
- **Permission denied**: supervisor lacks scope; hide case data.

## Data and Permissions

- **Reads**: team/high-risk cases, masked context, AI interactions, citations, draft history.
- **Writes**: review decision, risk assessment event, approval/revision request.
- **Sensitive data**: supervisor reveal requires reason and audit trail.
- **Review gate**: AI cannot approve, lower risk, or execute source-system actions.

## Interaction Notes

- Keep effective risk and suggested risk visually distinct.
- Never let AI language imply automatic approval.
- Surface stale context when order/logistics/after-sales changed after AI generation.

## Open Screen Questions

- Should this be a route, modal, or right-panel mode?
- Which supervisor roles can reveal cleartext fields?
- What SLA applies to supervisor review?
