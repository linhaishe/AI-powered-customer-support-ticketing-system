# Draft Review State

## Purpose

Let the platform agent express how they used the AI reply draft while preserving the boundary that the MVP does not send messages.

## Source Context

- **Flow step**: primary flow step 5.
- **Design rules**: keep draft, citations, safety note, and actions visually attached.
- **Architecture constraints**: phase one writes local UI state only.

## Entry Conditions

- A service case is selected.
- AI assistant panel has a draft and safety note.
- Agent chooses accept, edit, or ignore.

## Layout

| Region | Content | Controls | Notes |
| ------ | ------- | -------- | ----- |
| AI evidence | Summary, suggested risk, handling actions, citations | None | Evidence remains above draft |
| Draft body | Reply draft text | Editable when editing | Line height must support multilingual text |
| Safety note | Warning about unsupported commitments | None | Visible before and after actions |
| Action row | Accept, edit, ignore | Buttons | Disabled/review states appear here in future |
| Outcome status | Accepted, editing, ignored, or awaiting review | None | Must be scoped to selected case |

## Primary Actions

- Accept draft — records local accepted state and shows "waiting for send confirmation".
- Edit draft — enables draft editing and records local editing state.
- Ignore suggestion — records local ignored state and leaves manual handling available.

## Secondary Actions

- Review citation — confirms knowledge basis before using draft.
- Switch case — loads that case's own draft and outcome state.

## States

- **Empty**: no draft available; show manual SOP path.
- **Loading**: future AI refresh pending; do not show partial draft as usable.
- **Error**: AI unavailable; keep manual handling path.
- **Success/complete**: selected outcome status shown.
- **Permission denied**: future permission failure hides draft and sensitive case data.

## Data and Permissions

- **Reads**: selected mock case AI output.
- **Writes**: local draft text and draft action state.
- **Sensitive data**: draft may mention customer issue; future real drafts must be generated from masked snapshot.
- **Review gate**: accepted draft still requires future send confirmation and high-risk review when applicable.

## Interaction Notes

- Accepted does not mean sent.
- Editing does not remove the need for citation or safety review.
- Ignored should not be treated as AI negative feedback unless the future UI collects a reason.

## Open Screen Questions

- Should edited drafts compare original vs edited text for audit?
- Should ignore collect a reason immediately or only in later audit workflow?
