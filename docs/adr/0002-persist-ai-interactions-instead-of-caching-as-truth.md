# ADR 0002: Persist AI Interactions Instead of Treating Cached AI Output as Truth

## Status

Accepted

## Context

AI suggestions are generated from volatile business context, including order status, logistics status, after-sales status, customer messages, knowledge base content, prompt templates, and model behavior.

Using a simple Redis cache keyed only by service case ID can show stale or unsafe suggestions after the business context changes.

## Decision

AI output is persisted as an `AIInteraction`, not treated as ordinary cache data.

The agent workspace reads the latest successful `AIInteraction` for the service case. Each interaction is linked to the context snapshot, knowledge version, prompt version, and model version used when it was generated.

Redis can be used only for short-lived idempotency and duplicate-generation prevention. The idempotency key must include:

- Service case ID
- Context version
- Knowledge version
- Prompt version
- Model version

## Consequences

Historical AI suggestions remain auditable because each suggestion can be traced back to the exact context used during generation.

The system can warn agents when the latest business context is newer than the latest AI interaction.

Redis stays a performance and coordination tool, not the source of truth for AI decisions.
