# AI Project Kickoff Skill Design

## Summary

Create a Codex skill named `ai-project-kickoff` for turning a PRD or product brief into durable project context before implementation begins.

The skill generates a durable project context package and prototype notes. Its output format is built from the concrete architecture and document style captured in this design, so future runs do not require a `refs/` directory. It defaults to new projects, can support existing or partially documented projects, and stays self-contained while optionally using other available skills for deeper brainstorming, challenge review, UI exploration, or later implementation planning.

## Goals

- Create a repeatable one-command kickoff workflow for AI-assisted product development.
- Produce a durable project context package that helps AI agents work consistently across sessions.
- Support front-end-heavy full-stack products without binding the workflow to one framework.
- Keep generated documentation useful over long-lived project iterations.
- Preserve the concrete document architecture and content depth captured from the sample project context.
- Include project governance: security, permissions, code review, testing, change management, ADRs, and compliance notes.
- Add a prototype and wireframe stage before finalizing UI context.
- Support default UI context and UI context derived from reference website links.
- Ask and wait for unknown decisions that materially affect security, compliance, system boundaries, cost, or irreversible architecture; record other unknowns as assumptions or open questions.

## Non-Goals

- Do not scaffold application code.
- Do not create feature-level specifications, implementation plans, task lists, or pull requests.
- Do not create CI/CD workflow files; define the project CI/CD contract for a later implementation workflow.
- Do not initialize Next.js, database, auth, or deployment services.
- Do not require any external skill to function.
- Do not copy another website's brand, assets, or proprietary design.
- Do not produce exhaustive enterprise process documentation for simple personal projects.

## Skill Name

`ai-project-kickoff`

## Skill Description

```yaml
description: Use when a durable project context package is needed before implementing a new or lightly documented product project.
```

## Leading Phrase

Use `project context package` as the leading phrase. The skill is not just a question flow; it produces a durable package of context, prototypes, governance, and specs that future AI coding sessions can rely on.

The stronger working phrase is `durable project context package`: the generated package should always use the built-in architecture and content depth from this design rather than falling back to broad placeholders.

## Recommended Skill Structure

Use a workflow skill with progressive disclosure:

```txt
ai-project-kickoff/
  SKILL.md
  references/
    # Core workflow
    output-structure.md
    question-bank.md

    # MVP context package
    project-overview.md
    architecture-context.md
    design.md
    progress-tracker.md

    # Standard implementation guidance
    implementation-rules.md
    governance.md

    # Strict/team expansion
    adr-template.md
    compliance.md

    # Supporting references
    optional-skill-calls.md
    validation.md
```

`SKILL.md` should stay concise and describe the core workflow. Detailed templates and mode-specific guidance should live in `references/`.

The `references/` files are deployment artifacts. When this design is converted into a real skill, create those files alongside `SKILL.md`. During design review or manual trial runs, if a referenced file does not exist yet, use the fallback sections in this document and continue instead of blocking.

Before deployment, move the blueprint-heavy sections from this design document into reference files. The deployed `SKILL.md` should keep only frontmatter, purpose, inputs, blocking selections, steps, completion criteria, and context pointers.

Deployment split:

| Design section | Deployment target |
| --- | --- |
| `Default Output Structure` | `references/output-structure.md` |
| `Project Modes` and `Fallback Question Bank` | `references/question-bank.md` |
| `context/project-overview.md` blueprint | `references/project-overview.md` |
| `context/architecture-context.md` blueprint | `references/architecture-context.md` |
| `context/design.md`, `Default UI Direction`, and `UI Context From Reference Links` | `references/design.md` |
| `context/progress-tracker.md` blueprint | `references/progress-tracker.md` |
| Code standards and AI workflow rules | `references/implementation-rules.md` |
| Security, permissions, code review, testing/CI, and change management | `references/governance.md` |
| ADR guidance and template | `references/adr-template.md` |
| Compliance guidance | `references/compliance.md` |
| `Optional Skill Calls` | `references/optional-skill-calls.md` |
| `Review And Validation` | `references/validation.md` |

Do not copy the blueprint-heavy design sections into the deployed `SKILL.md`; doing so would create sprawl.

## Revised `SKILL.md`

````markdown
---
name: ai-project-kickoff
description: Use when a durable project context package is needed before implementing a new or lightly documented product project.
---

# AI Project Kickoff

## Purpose

Create a durable project context package before implementation starts. The package gives future AI agents enough product, architecture, UI, governance, and spec context to work consistently across sessions.

## Inputs

- Product idea, PRD, notes, or user conversation.
- Existing repository files when the project already has code or docs.
- Optional reference websites for UI direction.
- Optional user preference for documentation root, project mode, stack, or governance depth.

## Output

Create or update:

- `AGENTS.md`
- `context/`
- `prototypes/`

Adapt paths when the user requests a custom documentation root or the repository already has a compatible structure.

## Reference Availability

All referenced files must ship with this skill.

## Mode Selection

Before generating files, ask the user to choose one mode:

- `lightweight`: fast personal project startup.
- `standard`: default product kickoff.
- `strict`: work, team, compliance-sensitive, or high-risk projects.

Do not create files until the user selects a mode.

Done when the user-selected mode is visible in the response before file generation starts.

## UI Source Selection

Before writing `context/design.md`, ask the user to choose one UI source:

- Reference URLs
- Default product-app style
- Custom visual direction

Do not write `context/design.md` until the UI source is selected or the user explicitly says to use the default.

Done when the selected UI source is visible before `context/design.md` is created.

Read `references/question-bank.md` before selecting mode or asking questions. If it is unavailable, use `Fallback Question Bank`.

## Steps

1. Detect project state
   - Inspect local files when a workspace exists.
   - Classify the project as new, existing with little documentation, or partially documented.
   - Done when the project state and existing documentation/code patterns are named.

2. Load built-in output blueprints
   - Read the core MVP blueprints under `references/`: `project-overview.md`, `architecture-context.md`, `design.md`, and `progress-tracker.md`.
   - Read `references/implementation-rules.md` and `references/governance.md` for standard and strict modes.
   - Read `references/adr-template.md` and `references/compliance.md` only when strict/team mode, important architecture decisions, or regulated data make them relevant.
   - If those references are unavailable, use the matching sections in `Built-In Output Blueprints`, `Core Documents`, and `Governance Layer`.
   - Treat the built-in blueprints as the required output architecture for product, architecture, UI, standards, workflow, progress, and security documents.
   - Done when each target output file is mapped to a built-in blueprint or an existing compatible local convention.

3. Select output location
   - Use the default output structure unless the user requested another root or the repo already has a compatible convention.
   - Read `references/output-structure.md`; if unavailable, use `Default Output Structure`.
   - Done when every output path is known.

4. Select mode and gather inputs
   - Ask the user to choose `lightweight`, `standard`, or `strict`.
   - Do not create files before the user chooses.
   - Done when the selected mode is visible and product, users, scope, stack assumptions, governance depth, and open questions are captured or explicitly marked unknown.

5. Create product overview
   - Read `references/project-overview.md`; if unavailable, use the `context/project-overview.md` section in `Core Documents`.
   - Create `context/project-overview.md`.
   - Done when the document has a concrete project name, concise overview, numbered goals, core user flow, grouped features, in-scope and out-of-scope lists, and measurable success criteria.

6. Create architecture context
   - Read `references/architecture-context.md`; if unavailable, use the `context/architecture-context.md` section in `Core Documents`.
   - Create `context/architecture-context.md`.
   - Keep recommendations framework-neutral unless the user asks for a default.
   - Done when stack, system boundaries, storage model, auth/collaboration model, starter designs or reusable templates, AI/background generation model, and invariants are documented with concrete project choices.

7. Create wireframe artifacts
   - Read `context/project-overview.md`, `context/design.md`,
     `context/architecture-context.md`, and
     `references/output-structure.md` before creating artifacts.
   - Create `prototypes/wireframes.md` for every project. Include the
     main user flow, then one structured wireframe per key screen.
   - Create `prototypes/user-flow.md` only when the project has multiple
     roles, multi-step journeys, branching paths, asynchronous work, or
     high-risk actions.
   - Use the selected UI source and `context/design.md`; do not invent a
     separate visual direction.
   - Done when every main flow step maps to a named screen or state, and
     every key screen has a readable wireframe specification.

8. Create design.md
   - Read `references/design.md`. If it is unavailable, use the built-in
     `Default UI Direction` and `UI Context From Reference Links` guidance.
   - Confirm the user's UI source selection before writing:
     `Reference URLs`, `Default product-app style`, or
     `Custom visual direction`.
   - For `Reference URLs`, ask for one or more live URLs. Use the
     `website-to-design-md` skill and write its synthesized output to
     `context/design.md`.
   - If no URL is supplied, a URL is inaccessible, or browser tooling is
     unavailable, record the limitation as an open question and ask whether
     to continue with `Default product-app style` or `Custom visual direction`.
   - For `Default product-app style`, apply `Default UI Direction`.
   - For `Custom visual direction`, translate the user's direction into
     tokenized, project-specific UI rules.
   - Do not copy brand names, proprietary assets, exact copy, or distinctive
     trade dress from reference sites.
   - Done when `context/design.md` names the selected source and contains
     evidence-backed or clearly labeled assumed rules for theme tokens,
     typography, radius, spacing, layout patterns, icon rules, component
     conventions, interaction states, and applicable domain-specific UI rules.

9. Create governance and standards docs
   - Read `references/implementation-rules.md` for every project. Read `references/governance.md` for `standard` or `strict` mode, or when the PRD indicates a security, permission, data, review, testing, CI/CD, or change-management risk.
   - Read `references/adr-template.md` when the project has durable architecture choices to record or the selected mode is `strict`.
   - Read `references/compliance.md` when the project touches finance, healthcare, education, privacy-sensitive data, customer-owned data, cross-border data, or company policy constraints.
   - If unavailable, use `Core Documents`, `Governance Layer`, and the compliance/security notes in this design.
   - Create `context/implementation-rules.md` for every project.
   - Create `context/governance.md` for `standard` or `strict` mode, or when the PRD indicates a governance risk.
   - Create `context/compliance.md` when compliance is relevant or the selected mode is `strict`; otherwise record the not-applicable decision in `context/governance.md` when it exists, or in `context/progress-tracker.md`.
   - Create `context/adr/NNNN-decision.md` only for durable architecture choices; create an initial ADR in `strict` mode when a durable choice exists.
   - Done when `context/implementation-rules.md` exists and every mode-triggered governance, compliance, or ADR output exists with project-specific rules rather than generic filler.

10. Create progress tracker and handoff state
   - Read `references/progress-tracker.md`; if unavailable, use the `context/progress-tracker.md` section in `Core Documents`.
   - Create `context/progress-tracker.md`.
   - Record the recommended next workflow: feature specification, implementation planning, task decomposition, or implementation. Do not create those follow-on artifacts.
   - Done when current phase, current goal, completed/in-progress/next-up states, open questions, architecture decisions, session notes, and the next recommended workflow are recorded.

11. Review and validate the project context package
   - Read `references/validation.md`; if unavailable, use `Review And Validation`.
   - Check missing sections, contradictions, generic placeholders, deviations from the built-in blueprints, oversized scope, undefined security boundaries, missing tests, and oversized feature specs.
   - Done when every validation issue is fixed or listed as an explicit open question.

12. Review output with the user
   - Summarize created files, assumptions, risks, and open questions.
   - Done when the user has a clear approval/revision path.

13. Optionally transition to implementation planning
   - Read `references/optional-skill-calls.md`; if unavailable, skip optional skill calls unless the user explicitly asks.
   - Use `writing-plans` only after the project context package is approved and the user wants an implementation plan.
   - Done when the next step is either approval, revision, or implementation planning.

## Completion Criteria

The skill is complete only when:

- The project context package is saved in the agreed location.
- Required documents for the selected mode exist.
- Every generated document has required sections populated or marked explicitly not applicable.
- Every generated document follows the built-in blueprint's concrete structure and specificity.
- Product, architecture, UI, governance, progress, and specs do not contradict each other.
- Open questions and assumptions are visible.
- The final response lists created files and recommended next step.
````

## Draft Review Fallback Matrix

This table is for design review, manual trial runs, and partial local drafts. Do not copy it into the deployed `SKILL.md` when all reference files ship with the skill.

| Missing reference | Fallback section in this design |
| --- | --- |
| `references/output-structure.md` | `Default Output Structure` |
| `references/question-bank.md` | `Fallback Question Bank` |
| `references/project-overview.md` | `context/project-overview.md` in `Core Documents` |
| `references/architecture-context.md` | `context/architecture-context.md` in `Core Documents` |
| `references/design.md` | `context/design.md`, `Default UI Direction`, and `UI Context From Reference Links` |
| `references/progress-tracker.md` | `context/progress-tracker.md` in `Core Documents` |
| `references/implementation-rules.md` | `Implementation Rules` |
| `references/governance.md` | `Governance Layer` |
| `references/adr-template.md` | `context/adr/` in `Core Documents` |
| `references/compliance.md` | `Governance Layer` |
| `references/optional-skill-calls.md` | `Optional Skill Calls` |
| `references/validation.md` | `Review And Validation` |

## Intentional Blocking Repetition

`Mode Selection` repeats inside Step 4, and `UI Source Selection` repeats inside Step 8. Keep both repetitions until pressure testing shows agents reliably stop for those choices. They counter the observed failure where an agent silently defaulted to `standard` mode and skipped UI source selection.

## Default Output Structure

```txt
AGENTS.md
context/
  project-overview.md
  architecture-context.md
  design.md
  progress-tracker.md
  implementation-rules.md
  ai-workflow-rules.md
prototypes/
  user-flow.md
  wireframes.md
```

For `standard` mode, add `context/governance.md`. For `strict` mode, add governance, required ADRs for major decisions, and a compliance assessment:

```txt
context/
  governance.md
  compliance.md
  adr/
    0001-decision-title.md
```

If the user requests a custom documentation root, or the project already has a compatible structure, the skill should adapt rather than force the default layout.

## Project Modes

The skill supports three interaction modes:

| Mode | Purpose | Behavior |
| --- | --- | --- |
| `lightweight` | Fast personal project startup | Ask a small number of key questions and generate a concise first draft. |
| `standard` | Default product kickoff | Clarify product, users, flow, scope, stack, UI, governance, and the next workflow handoff. |
| `strict` | Work or high-risk projects | Add challenge questions around assumptions, security, compliance, review, testing, and operational risk. |

Mode is a blocking choice. The agent must ask the user to select one mode before creating files.

## Mode Output Layers

Use these output layers to keep MVP runs lean while preserving enterprise/team depth:

| Mode | Required output |
| --- | --- |
| `lightweight` | Concise project overview, architecture context, UI context, implementation rules, and progress tracker. Keep minimum safety and local verification rules in `context/implementation-rules.md`; create governance only when the PRD triggers it. |
| `standard` | Core MVP context plus `context/implementation-rules.md` and `context/governance.md`. Generate ADRs only for important durable architecture choices. |
| `strict` | Standard output plus expanded governance gates, required ADRs for major decisions, and `context/compliance.md` recording applicable requirements or a documented not-applicable decision. |

## Fallback Question Bank

Use this only when `references/question-bank.md` is unavailable.

Ask the fewest questions needed to proceed. Prefer one compact batch, then make explicit assumptions for anything still unknown.

### Core Questions

- What is the product name and one-sentence idea?
- Who are the primary users?
- What is the main user flow from entry to successful outcome?
- What are the must-have MVP capabilities?
- What should be explicitly out of scope?
- Is there an existing or preferred stack?
- Should the UI feel more like an app workspace, operational dashboard, content site, editor, marketplace, or something else?
- Are there auth, collaboration, storage, privacy, or compliance constraints?

### Strict Mode Additions

- What data is sensitive, private, customer-owned, or regulated?
- Which actions require owner/admin permission?
- What changes require human review before implementation?
- What must be tested before a feature is considered done?
- What assumptions are risky enough to record as open questions?

## Project State Detection

At the start, detect whether the current workspace is:

- A new project.
- An existing project with code but little documentation.
- A partially documented project.

For existing projects, inspect local files and follow current patterns. Do not propose unrelated rewrites.

## Workflow

```txt
1. Detect project state
2. Load built-in output blueprints and inspect existing project context
3. Select output location
4. Select mode
5. Gather product inputs
6. Create project-overview.md draft from the product overview blueprint
7. Create architecture-context.md draft from the architecture blueprint
8. Create prototype and wireframe artifacts
9. Create design.md from the UI blueprint, prototypes, UI references, and defaults
10. Create code standards, workflow rules, security, review, testing/CI, change-management, compliance, and ADR docs
11. Create progress tracker, MVP milestones, assumptions, and next-workflow handoff
12. Review output with the user
13. Optionally transition to implementation planning after approval
```

## Built-In Output Blueprints

The skill should not depend on a runtime `refs/` directory. The sample `refs/` files used during this design process have been distilled into these built-in output blueprints. Future runs should follow this architecture even when the user provides only a product idea or rough PRD.

| Target output | Built-in blueprint | Must preserve |
| --- | --- | --- |
| `context/project-overview.md` | Product overview | Project-name H1, concise overview, numbered goals, linear core user flow, grouped feature sections, in-scope/out-of-scope lists, measurable success criteria |
| `context/architecture-context.md` | Architecture context | Stack table with Layer/Technology/Role, concrete system boundaries, storage split, auth/collaboration model, reusable starter designs, AI generation model, invariants |
| `context/design.md` | UI context | Token-first theme rules, typography source, radius scale, domain-specific UI rules, component library rules, layout patterns, icon rules |
| `context/progress-tracker.md` | Progress tracker | Current phase, current goal, completed items with verification commands, in-progress state, next-up state, open questions, architecture decisions, session notes |
| `context/implementation-rules.md` | Implementation rules | Code standards, AI workflow rules, small modules, strict typing, thin routes, spec-driven work, split triggers, doc sync, and verification expectations |
| `context/governance.md` | Governance | Security and permissions, human review gates, testing/CI expectations, issue/ticket/PR traceability, least privilege, and controlled environments |
| `context/adr/NNNN-decision.md` | Architecture decision record | Durable decisions for database, permission model, queue, cache, deployment, and other high-impact architecture choices |
| `context/compliance.md` | Compliance | Finance, healthcare, education, privacy, cross-border data, and company policy constraints or explicit not-applicable notes |

Existing local docs may refine naming or paths, but absence of `refs/` is normal and must not reduce output quality.

## Core Documents

### `AGENTS.md`

Acts as the AI agent entry point. It should tell agents to read the current context files before implementation, keep docs in sync, and avoid work beyond the active request.

It should point to:

```txt
context/project-overview.md
context/architecture-context.md
context/design.md
context/progress-tracker.md
context/implementation-rules.md

If present:
context/governance.md
context/compliance.md
context/adr/
```

### `context/project-overview.md`

Use the built-in product overview blueprint.

Required shape:

```md
# <Project Name>

## Overview
## Goals
## Core User Flow
## Features
### <Feature Area>
## Scope
### In Scope
### Out Of Scope
## Success Criteria
```

The document should read like a product brief, not a form. Goals and success criteria should be numbered. Features should be grouped by product capability, with concrete behavior under each group.

### `context/architecture-context.md`

Use the built-in architecture context blueprint.

Required shape:

```md
# Architecture Context

## Stack
## System Boundaries
## Storage Model
## Auth and Collaboration Model
## Starter System Designs
## AI Generation Model
### Design Generation
### Spec Generation
## Invariants
```

`Stack` should be a table with `Layer`, `Technology`, and `Role`. `System Boundaries` should name actual directories or modules. `Storage Model` should clearly separate relational metadata from generated artifacts. `Invariants` should be numbered rules future agents can check before implementation.

### `context/design.md`

Use the built-in UI context blueprint.

Required shape:

```md
# UI Context

## Theme
## Typography
## Border Radius
## Canvas
### Node Color Palette
### Edge Style
### Node Shapes
### Connection Handles
### Canvas Background
## Component Library
## Layout Patterns
## Icons
```

For products with canvas, graph, flow, editor, dashboard, or visual-builder behavior, include concrete domain UI rules like node palettes, edge behavior, handle behavior, and workspace layout. For products without those surfaces, replace canvas subsections with the equivalent domain-specific UI rules rather than leaving generic placeholders.

Theme rules should prefer tokens over raw colors. If a generated app uses Tailwind or CSS variables, document the token names and forbid raw color drift when appropriate.

### `context/implementation-rules.md`

Use the built-in implementation rules blueprint. This combines code standards and AI workflow rules so MVP runs stay readable.

Required shape:

```md
# Implementation Rules

## Code Standards
## TypeScript And Framework Rules
## Styling Rules
## API And Data Boundaries
## File Organization
## AI Workflow
## Scoping Rules
## When To Split Work
## Handling Missing Requirements
## Protected Foundation Components
## Keeping Docs In Sync
## Before Moving To The Next Unit
```

The generated rules should be enforceable and project-specific: strict typing, boundary validation, thin routes, storage placement, file ownership, spec-driven workflow, split triggers, missing-requirement handling, protected files, and what must be true before moving to the next feature unit.

### `context/progress-tracker.md`

Use the built-in progress tracker blueprint, but keep new-project output concise.

Required shape:

```md
# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase
## Current Goal
## Completed
## In Progress
## Next Up
## Open Questions
## Architecture Decisions
## Session Notes
```

Completed items should include the feature name, date when known, implementation summary, and verification commands when available. `Architecture Decisions` should capture durable decisions from context files, not every session detail.

### `context/governance.md`

Use the built-in governance blueprint. This keeps security, review, testing/CI, and change management in one document by default.

Required shape:

```md
# Governance

## Security And Permissions
## Data Access Boundaries
## AI Agent Restrictions
## Code Review Gates
## High-Risk Changes
## Testing And CI/CD
## Change Management
## Issue Ticket And PR Traceability
## Compliance Applicability
```

The file should be concrete enough to affect implementation. It must state that AI agents cannot access production secrets, unrestricted customer data, or internal private documents. Use sanitized data, least privilege, and controlled development or staging environments. AI-generated changes must not merge directly without human review. High-risk changes include authentication, authorization, payments, data deletion, permission logic, migration scripts, secrets handling, production access, and customer-data handling. Feature spec verification checklists should be converted into unit, integration, E2E, typecheck, lint, build, or CI/CD checks whenever practical. Every feature spec should map to an issue, ticket, or PR so the team can trace why the change exists, what changed, who approved it, and which verification evidence supports it.

### `context/adr/`

Use ADR files for important decisions such as framework choice, database, auth model, queue provider, cache strategy, or deployment target.

ADR template:

```md
# ADR 0001: <Decision>

## Status
Accepted

## Context
## Decision
## Consequences
```

### `context/compliance.md`

Use the built-in compliance blueprint.

Required shape:

```md
# Compliance

## Applicability
## Regulated Data
## Company Policy Constraints
## Cross-Border Data
## AI Coding Restrictions
## Required Approvals
## Open Compliance Questions
```

If the project involves finance, healthcare, education, privacy-sensitive data, customer-owned data, or cross-border data handling, AI coding workflow must follow company compliance policy. If compliance is not applicable, record why instead of leaving the document generic.

## Prototype And Wireframe Stage

Prototypes are produced after the project overview draft and before final UI context.

Recommended order:

```txt
1. Product Discovery -> project-overview.md draft
2. Architecture Framing -> architecture-context.md draft
3. Prototype / Wireframe -> prototypes/
4. UI Context -> design.md
5. Governance Layer -> security, review, testing/CI, change management, compliance, workflow, standards, ADR
6. MVP Plan -> progress tracker and specs
```

Default prototype output:

```txt
prototypes/
  user-flow.md
  wireframes.md
  screens/
    001-dashboard.md
    002-editor.md
```

If visual exploration is useful, also generate temporary or optional HTML previews:

```txt
prototypes/
  previews/
    dashboard.html
    editor.html
```

Markdown artifacts are the durable source of truth. HTML previews are supporting artifacts.

Prototype detail by mode:

| Mode | Prototype Output |
| --- | --- |
| `lightweight` | Text-only screen sketches with purpose, regions, actions, and states. |
| `standard` | User flow, screen inventory, main layouts, component map, and state coverage. |
| `strict` | Adds responsive variants, role-based states, permission-sensitive UI, edge cases, and design review checklist. |

## Default UI Direction

Use this only when the user selects `Default product-app style` or explicitly says to use the default.

Use `references/design.md` for default UI context.

## UI Context From Reference Links

When users select `Reference URLs`, the skill should analyze design language rather than copy brand assets.

Sample the referenced pages before writing `context/design.md` when browsing or browser tooling is available. If browsing tools are unavailable but the URL is visible, infer only cautious UI assumptions from the URL text and user-provided context, mark them as assumptions to confirm, and continue with `Default UI Direction`. If a URL is inaccessible, record the failed URL as an open question and continue with `Default UI Direction`.

Extract:

- Layout density.
- Navigation style.
- Typography feel.
- Color direction.
- Component patterns.
- Spacing rhythm.
- Icon style.
- Interaction states, including hover, active, focus, empty, loading, and error states.
- Responsive behavior when visible.

Do not copy:

- Brand names.
- Proprietary assets.
- Images or illustrations.
- Exact text.
- Distinctive trade dress.

Then convert findings into project-specific UI rules. Example:

```md
- Use a dense operational dashboard layout.
- Prefer compact controls and high table readability.
- Keep surfaces restrained and section boundaries clear.
- Avoid marketing-style hero composition inside the app shell.
```

## Governance Layer

Default governance includes:

- `context/governance.md`
- Security and permissions boundaries.
- Human review gates for high-risk changes.
- Testing and CI/CD expectations.
- Feature spec to issue/ticket/PR traceability.
- Compliance applicability notes.
- ADR links when durable architecture decisions exist.
- Review and testing expectations referenced from `context/implementation-rules.md`.
- Tracking fields inside feature specs

Strict or team mode may add:

- stricter required reviewer rules in `context/governance.md`
- stricter release gates in `context/governance.md`
- required ADRs for major architecture choices
- expanded policy evidence in `context/compliance.md`
- additional compliance review notes when company process requires a separate artifact

Use standalone compliance documentation only when the product involves regulated or sensitive areas such as finance, healthcare, education, privacy-sensitive data, or cross-border data handling.

## Handoff To Feature Delivery

This skill ends after the project context package is reviewed. It records the recommended next workflow in `context/progress-tracker.md` but does not create feature specifications, implementation plans, task lists, code, pull requests, or CI/CD workflow files.

Follow-on skills must read `AGENTS.md` and the relevant context files before generating feature-level artifacts.

## Optional Skill Calls

The skill should be self-contained. Optional skill calls are enhancements, not requirements.

Use optional skill calls only when available and appropriate:

- `brainstorming`: for unclear product direction.
- `grilling`: for strict challenge mode or assumption testing.
- UI or browser visual tools: for layout comparisons or visual prototype review.
- `writing-plans`: after the generated docs are approved and the user wants an implementation plan.

## Review And Validation

Before finishing, the skill should review generated docs for:

- Missing required sections.
- Contradictions between product, architecture, UI, and specs.
- Overly broad MVP scope.
- Undefined security boundaries.
- Missing human review gates for high-risk changes.
- Missing success criteria.
- Missing test expectations.
- Verification checklist items that should be automated but are not mapped to unit, integration, E2E, typecheck, lint, build, or CI/CD checks.
- Missing ADRs for durable architecture choices.
- Missing compliance applicability notes for regulated, privacy-sensitive, or cross-border data.
- Long session notes that should be consolidated.
- A missing or ambiguous next-workflow handoff.

## Decisions

The agreed design chooses:

- `ai-project-kickoff` as the skill name.
- Workflow plus references as the implementation structure.
- Front-end-first, framework-neutral positioning.
- Default output in `AGENTS.md`, `context/`, and `prototypes/`.
- Default governance with security, permissions, code review, testing/CI, change management, compliance, and ADR artifacts.
- Strict/team mode strengthens review, release, and compliance gates.
- Prototype output before final UI context.

## Validation Notes

RED: An agent run with the earlier draft silently defaulted to `standard` mode and skipped UI source selection before generating the project context package.

GREEN: After adding blocking `Mode Selection` and `UI Source Selection` wording, the agent must ask for both choices before file generation. The run passes only when the selected mode and selected UI source are visible before any files are created.

REFACTOR: Keep the intentional blocking repetition in `Mode Selection`/Step 4 and `UI Source Selection`/Step 8 until repeated pressure tests show agents reliably stop for both choices.
