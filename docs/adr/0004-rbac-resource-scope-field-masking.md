# ADR 0004: Use RBAC with Resource Scope and Field-Level Masking

## Status

Accepted

## Context

The service workbench handles customer service cases, order context, logistics details, after-sales data, merchant information, knowledge base content, and AI interaction logs. Different user roles need different actions, resource visibility, and field visibility.

Pure RBAC can express which actions a role may perform, but it cannot fully express queue ownership, merchant ownership, regional access, or whether sensitive customer fields should be masked.

## Decision

Use RBAC with resource scope and field-level masking.

- RBAC decides which actions a role can perform.
- Resource scope decides which service cases, merchant records, queues, regions, and knowledge areas the actor can access.
- Field-level masking decides which fields are returned as clear text, masked text, summaries, or omitted values.

The AI service account can only read whitelisted and masked context snapshots and can write AI interactions and audit events. It cannot directly read production databases with broad privileges.

## Consequences

Authorization can represent platform agents, supervisors, merchant operators, platform operators, admins, and AI service accounts without exposing unnecessary customer or merchant data.

BFF endpoints must enforce action permissions, resource scope checks, and field masking before returning data to the frontend or AI layer.

Permission tests must cover both resource access and field visibility, not just endpoint access.
