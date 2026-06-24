# ADR 0001: Generate AI Suggestions Asynchronously

## Status

Accepted

## Context

Customer service cases depend on business context that can change after the case is created, such as logistics status, after-sales status, customer follow-up messages, and knowledge base updates.

If AI suggestions are generated only when the agent opens the case, the agent experience depends on model latency and model availability. If suggestions are generated only once when the case is created, they can become stale before an agent reviews the case.

## Decision

AI suggestions are generated asynchronously after important case events:

- A service case is created.
- A customer sends a follow-up message.
- Key logistics, order, or after-sales context changes.
- Relevant knowledge base content changes.

The agent workspace shows the latest successful AI suggestion. If the current context version is newer than the context snapshot used by the latest AI suggestion, the UI shows a stale-suggestion warning and offers a manual refresh action.

AI suggestions are always linked to the context snapshot used when they were generated.

## Consequences

This keeps the agent workspace responsive because opening a case does not block on an AI call.

Agents can still see useful prior AI output when the model is unavailable, while the stale warning prevents treating old suggestions as current truth.

The system must track context versions, AI generation status, and context snapshots. This adds implementation complexity but makes audit and safety behavior clearer.
