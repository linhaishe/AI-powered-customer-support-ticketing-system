# ADR 0003: Capacity Assumptions for the Service Workbench

## Status

Accepted

## Context

The technical design includes BFF aggregation, SQL query control, Redis, asynchronous jobs, vector search, and AI generation. These choices need realistic capacity assumptions so the architecture does not read like technology stacking.

## Decision

Use a medium-to-large platform capacity target for the designed architecture:

- Daily service cases: 100,000
- Peak agent workbench read QPS: 300
- Peak AI generation task QPS: 50
- Knowledge articles: 50,000
- Average messages per service case: 8
- Average order context per service case: 1 order, 1 logistics trace, and 0 to 1 after-sales case
- AI generation target: P95 within 15 seconds
- Agent workbench BFF target: P95 within 500 ms

## Consequences

The agent workbench must avoid synchronous AI generation on page open.

BFF endpoints must use pagination and targeted context aggregation.

Hot but safe-to-cache data, such as knowledge snippets and recently fetched logistics snapshots, can use Redis with explicit freshness rules.

AI generation work should run through an asynchronous queue with idempotency keys based on context, knowledge, prompt, and model versions.
