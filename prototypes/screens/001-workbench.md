# Customer Support Workbench

## Purpose

Help a platform agent triage a cross-border service case, understand business context, and review AI assistance before deciding how to respond.

## Source Context

- **Flow step**: primary flow steps 1 through 4.
- **Design rules**: three-column operational workspace with warm paper surfaces and clear evidence blocks.
- **Architecture constraints**: phase one reads only local mock data and does not perform real sends or business actions.

## Entry Conditions

- Route `/` opens.
- Phase-one mock data is available.
- First service case is selected by default.

## Layout

| Region | Content | Controls | Notes |
| ------ | ------- | -------- | ----- |
| Product bar | Product name, role, queue scope, AI masking note | None in phase one | Keep compact and factual |
| Metrics strip | Today cases, AI adoption, high-risk cases, average handle time | None in phase one | Four cards maximum |
| Service queue | Case ID, timestamp, title, risk, issue type, order, status | Select case | Selected state must be persistent |
| Case details | Original message, history, order, logistics, after-sales, merchant, rules | None in phase one | Context cards may wrap on smaller screens |
| AI assistant | Summary, category, sentiment, suggested risk, actions, citations, draft, safety | Accept/edit/ignore | Draft actions are local only |

## Primary Actions

- Select case — refreshes case details and AI assistant for the selected service case.
- Accept draft — marks selected case as accepted, waiting for send confirmation.
- Edit draft — enters local editing state for selected case draft.
- Ignore suggestion — marks selected case as manually handled.

## Secondary Actions

- Read citations — validates AI evidence before using the draft.
- Review safety note — prevents unsupported refund, compensation, or delivery promises.

## States

- **Empty**: not expected in phase one; future empty data should show manual SOP guidance.
- **Loading**: future data load should reserve panel space and avoid showing stale drafts as current.
- **Error**: show manual handling path and preserve selected case when possible.
- **Success/complete**: accepted/editing/ignored status appears for selected case.
- **Permission denied**: future auth state should hide case data.

## Data and Permissions

- **Reads**: synthetic mock service cases and AI assistant outputs.
- **Writes**: local draft text and local draft action state only.
- **Sensitive data**: current data is synthetic; future consumer PII must be masked before display or AI context.
- **Review gate**: high-risk business commitments require future supervisor review.

## Interaction Notes

- Keyboard focus must be visible on queue rows and draft controls.
- Long case titles and draft text must wrap without horizontal overflow.
- Switching cases must not carry the wrong draft action state into the new case.

## Open Screen Questions

- Should queue filtering and sorting be part of the first follow-on feature?
- Should the AI panel support a stale state before real AI is introduced?
