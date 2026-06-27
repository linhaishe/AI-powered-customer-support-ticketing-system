# Compliance

This file records compliance applicability, data constraints, review gates, evidence requirements, and open questions for implementation.

## Applicability

- **Mode**: strict.
- **Relevant domains**: privacy, customer data, cross-border ecommerce data, company policy, AI processing, auditability.
- **Applicable regulations, contracts, or policies**: unknown; company data-classification, privacy, cross-border, AI-provider, and retention policies must be confirmed.
- **Authoritative owner or reviewer**: unknown; requires legal/security/privacy/product owner assignment before real data or AI integration.
- **Not-applicable decisions**: none; compliance constraints are in scope.

## Data Classification

| Data Type | Owner | Sensitivity | Source | Storage Location | Retention | Access Rules | Notes |
| --------- | ----- | ----------- | ------ | ---------------- | --------- | ------------ | ----- |
| Mock service cases | Project repo | Internal/demo | `app/mock-service-data.ts` | Repository | Until replaced | Agents may read/edit as synthetic data | Must stay synthetic |
| Consumer PII | Source business systems | Private/customer-owned | Future BFF/source systems | Unknown | Unknown | Mask, summarize, aggregate, or omit by policy | Phone, email, address, payment identifiers |
| Conversation messages | Source business systems | Customer-owned/private | Future conversation service | Unknown | Unknown | Authorized service roles only; AI sees masked snapshot | May include hidden PII |
| Order/logistics/after-sales data | Source business systems | Customer-owned/business-sensitive | Future BFF/source systems | Unknown | Unknown | Resource-scoped and masked before frontend/AI | Cross-border rules may apply |
| Knowledge articles/SOPs | Platform operations | Internal/company policy | Future knowledge base | Unknown | Versioned | AI cites approved snippets only | Keep article version in citations |
| Context snapshots | AI service layer | Customer-owned/derived | Future BFF/AI workflow | Unknown | Unknown | AI reads only authorized masked snapshots | Historical basis for AI output |
| AI interactions and usage events | AI/audit layer | Audit/customer-derived | Future AI workflow | Unknown | Unknown | Append-only audit access | Includes outputs, citations, outcomes |
| Risk assessment events | Service/risk layer | Audit/business-sensitive | Future service workflow | Unknown | Unknown | Supervisor/risk owner access | Effective risk changes need reason |

## Regulated and Customer Data

- Collect only data needed for the documented product flow.
- Define consent, notice, purpose, owner, and retention before collecting sensitive, regulated, or customer-owned data.
- Sensitive data reads, exports, deletes, and permission changes require owner review.
- Logs, analytics, test fixtures, screenshots, prompts, and support artifacts must not include sensitive data unless policy explicitly permits it.
- Deletion, export, correction, audit, and retention workflows must be documented before implementation when users or customers have those rights.
- **Project-specific constraints**: AI context must be built from masked `ContextSnapshot` records and versioned `KnowledgeCitation` snippets.

## Cross-Border Data

- Identify where users, customers, infrastructure, vendors, backups, logs, and support access may be located.
- Do not assume cross-border transfer is allowed; record region, vendor, residency, and approval requirements.
- If residency or transfer rules are unknown, block implementation choices that would make reversal expensive.
- **Allowed regions**: unknown.
- **Restricted transfers**: real consumer PII, conversation text, order/payment identifiers, and AI context transfers are restricted until policy is confirmed.
- **Required approvals**: legal/security/privacy approval before real cross-border data or third-party AI processing.

## AI Coding Restrictions

- Do not include secrets, production data, unrestricted customer data, private internal documents, or regulated records in prompts, logs, screenshots, generated examples, or test fixtures.
- Use synthetic, anonymized, or sanitized data for examples and tests.
- Generated content that affects users, customers, compliance, legal, financial, or safety decisions requires human review before use.
- Record model/vendor restrictions when policy, contract, or data class limits where data may be processed.
- **Allowed AI inputs**: PRD, domain glossary, repository code, synthetic mock cases, and sanitized context.
- **Prohibited AI inputs**: real PII, production exports, raw customer conversations, credentials, private internal policy documents, unapproved logs.
- **Model/vendor constraints**: unknown; approved vendors, regions, retention settings, and logging controls need confirmation.

## Required Approvals and Evidence

- Compliance-impacting changes require a named reviewer before implementation or merge.
- Evidence should include relevant policy or decision source, reviewer, date/session, verification performed, and remaining risk.
- Temporary exceptions require owner, reason, expiry, compensating control, and follow-up task.
- **Required reviewers**: legal/security/privacy/product owner for real data, real AI, source-system, masking, retention, or cross-border changes.
- **Required evidence**: policy link or approval note, data-classification mapping, masking tests, audit evidence, and rollback/mitigation plan.

## Implementation Constraints

- Auth, permissions, retention, deletion, export, audit, logging, analytics, data sharing, and vendor integrations must follow the classifications above.
- Do not add new data collection, third-party processing, cross-border transfer, or AI processing without updating this file.
- If a compliance question is unresolved, choose the least data-exposing implementation path and record the blocker.

## Open Compliance Questions

| Question | Owner | Due Point | Implementation Impact |
| -------- | ----- | --------- | --------------------- |
| Which company policy maps fields to clear/masked/summary/aggregate/omitted visibility? | Unknown | Before real BFF/data integration | Blocks production masking implementation |
| Which regions and residency rules apply to Tianmao Global support data? | Unknown | Before deployment architecture | Blocks vendor, storage, and AI region choices |
| Which AI providers and models are approved for customer support context? | Unknown | Before real AI integration | Blocks AI SDK/provider work |
| What retention applies to snapshots, AI interactions, usage events, and risk events? | Unknown | Before persistence | Blocks schema and cleanup jobs |
| Who can approve sensitive-field reveals for supervisors? | Unknown | Before supervisor workflow | Blocks permission and audit implementation |
