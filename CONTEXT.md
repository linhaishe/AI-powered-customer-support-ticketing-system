# Domain Glossary

## ServiceCase

A single, independently trackable customer service request that can be assigned, followed up, risk-rated, and closed.

Service cases are split by service intent, not by message count. One customer message can create multiple service cases when it contains multiple independent intents, such as logistics delay, refund request, and complaint escalation.

## Conversation

The original customer service message thread that contains customer messages, agent replies, and system events.

A conversation can be linked to multiple service cases when one thread contains multiple service intents.

## CaseMessage

A single message or event inside a conversation. A case message is not itself the boundary for creating a service case.

## RelatedCase

A service case linked to another service case through the same conversation, order, after-sales process, customer, or escalation chain.

## Resolved ServiceCase

A service case that an agent believes has been handled, but that can still be reopened when the customer follows up on the same service intent within the reopen window.

## Closed ServiceCase

A service case that is no longer eligible for automatic reopening. New follow-up requests after closure create a new related service case.

## Reopen Window

The time window after a service case is resolved during which a matching follow-up message can reopen the original case. The default reopen window is 72 hours.

A follow-up can reopen a resolved service case when it matches the same consumer, order, and service intent.

## ContextSnapshot

A point-in-time copy of the business context used to make or explain a decision.

AI suggestions must be traceable to the context snapshot that was available when the suggestion was generated. Later order, logistics, or after-sales changes do not rewrite the historical basis for an AI suggestion.

## RiskLevel

The current effective business risk level of a service case.

The service case risk level is the value used for routing, escalation, review, and reporting.

## SuggestedRiskLevel

The risk level suggested by an AI interaction.

AI can suggest raising a service case risk level, but AI cannot automatically lower the effective risk level. Rule-based assessments and human-confirmed assessments take precedence over AI suggestions.

## RiskAssessmentEvent

An auditable event that records a risk level change or risk recommendation.

Risk assessment events capture the previous risk level, proposed risk level, source of the change, reason, actor, and timestamp.

## KnowledgeCitation

A versioned knowledge snippet used as evidence for an AI suggestion or reply draft.

A knowledge citation includes the article ID, article version, title, applicable locale, applicable region, snippet, and reason for relevance. Historical AI interactions keep the citation version that was used at generation time.

## KnowledgeArticle

A managed knowledge base article, policy, SOP, or service rule.

Knowledge articles can have multiple versions. AI suggestions cite specific versioned snippets instead of treating the whole article as a citation.

## AIUsageEvent

An auditable event that records how an agent interacted with an AI suggestion or reply draft.

Allowed usage outcomes are accepted, edited-and-used, dismissed, reported-inaccurate, and not-used.

## AI Adoption Rate

The share of viewed AI suggestions that were either accepted or edited-and-used.

AI adoption rate is calculated as `(accepted + edited-and-used) / viewed AI suggestions`.

## Draft Direct Acceptance Rate

The share of viewed reply drafts that were accepted without meaningful edits.

Draft direct acceptance rate is calculated as `accepted / viewed reply drafts`.

## AI Negative Feedback Rate

The share of viewed AI suggestions that agents reported as inaccurate, unsafe, unsupported, or otherwise unusable.

AI negative feedback rate is calculated as `reported-inaccurate / viewed AI suggestions`.
