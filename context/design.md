---
version: alpha
name: "Tianmao Global AI Customer Service Center Design Direction"
source: "Reference URLs"
status: "Needs review"
---

# Design

## Overview

The interface should feel like a dense operational workspace for experienced support agents: fast to scan, evidence-rich, and careful around risk. The visual direction translates the inspected PostHog reference into a warm paper-like product-app language with crisp text, restrained borders, compact panels, amber primary actions, and document-style evidence blocks. Confidence is high for the workbench density and token direction; brand-specific visual identity still needs product review.

## Source and Evidence

- **Selected UI source**: Reference URLs.
- **Evidence used**: `https://posthog.com/`, inspected with `agent-browser` at desktop `1440x1000` and mobile `390x900`.
- **Observed traits**: warm off-white page background, `#FDFDF8`-like main surface, compact documentation/editor feel, black/gray text, amber/orange raised buttons, modest `6px` button radius, body text around `15px` to `16px`, headings around `21px` to `24px`, mobile content stacking with `16px` article padding.
- **Do not copy**: PostHog brand name, logos, illustrations, exact copy, jokes, installation metaphors, proprietary assets, or distinctive trade dress.

## Theme Tokens

### Colors

| Token | Value | Role | Notes |
| ----- | ----- | ---- | ----- |
| `background` | `#EEEFE9` | Page/app background | Warm paper base inspired by observed `rgb(238,239,233)` |
| `surface` | `#FDFDF8` | Panels, cards, modals, controls | Main workbench surface inspired by observed `rgb(253,253,248)` |
| `muted-surface` | `#F4F4F0` | Citations, inactive rows, metadata blocks | Use for evidence blocks and secondary context |
| `text` | `#111827` | Primary text | Case titles, section headings, critical labels |
| `body-text` | `#374151` | Body text | Customer message, draft content, rules |
| `muted-text` | `#65675E` | Secondary text | Timestamps, helper copy, metadata |
| `border` | `#D2D3CC` | Dividers and control borders | Keep panels crisp without heavy shadows |
| `primary` | `#EB9D2A` | Primary action/accent | Accept/edit action emphasis; do not use for all badges |
| `primary-shadow` | `#CD8407` | Raised-action lower layer | Optional button depth, not required for every control |
| `danger` | `#F35454` | High-risk, destructive, unsafe | Use for warnings and high-risk badges |
| `warning` | `#F7A501` | Medium-risk, stale, attention | Use for risk and stale AI states |
| `success` | `#36C46F` | Successful/accepted state | Use sparingly for confirmed local outcome |
| `info` | `#30ABC6` | Low-risk or informational | Use for neutral safety and routing notes |

### Typography

| Role | Font | Size | Weight | Line Height | Notes |
| ---- | ---- | ---- | ------ | ----------- | ----- |
| Page title | `Arial, Helvetica, sans-serif` | `24px` | `700` | `32px` | Current app baseline; no viewport scaling |
| Section heading | `Arial, Helvetica, sans-serif` | `18px` to `21px` | `700` | `28px` to `30px` | Panel titles and case titles |
| Body | `Arial, Helvetica, sans-serif` | `14px` to `15px` | `400` | `22px` to `24px` | Dense readable case and draft text |
| Label | `Arial, Helvetica, sans-serif` | `12px` to `14px` | `600` to `700` | `16px` to `20px` | Field labels, badges, controls |
| Caption | `Arial, Helvetica, sans-serif` | `12px` | `500` | `16px` | Timestamps, citations, secondary metadata |

### Spacing and Layout

- **Base grid**: 4px increments with 8px rhythm for panels and controls.
- **Page max width**: full viewport app shell with content constrained only for readability; current app uses max width around `1760px`.
- **Section rhythm**: dense operational spacing; use `12px` to `20px` gaps between related blocks.
- **Control spacing**: buttons use compact `8px` to `16px` horizontal padding; badges use `4px` to `8px` padding.
- **Responsive behavior**: desktop uses queue/details/AI columns; mobile stacks metrics, queue, details, and AI panel without horizontal overflow.

### Radius and Shape

| Token | Value | Role |
| ----- | ----- | ---- |
| `radius-sm` | `4px` | Inputs, small controls, tags |
| `radius-md` | `6px` | Buttons, menus, repeated items |
| `radius-lg` | `8px` | Modals, prominent grouped controls |

### Elevation

- Prefer borders and surface changes over shadows.
- Use elevation only for future overlays, dropdowns, sticky panels, or modals.
- Panels may remain square-edged to preserve the operational document feel.

## Layout Patterns

- **Primary app shell**: top product bar, metrics strip, three-column workbench.
- **Main workflow screen**: queue on left, selected case context in the center, AI assistant on the right.
- **Detail or edit screen**: document-like draft editor attached to AI evidence and safety notes.
- **Empty/loading/error states**: keep manual handling available; never show partial unsafe AI drafts.

## Component Conventions

- **Buttons**: amber primary for main draft actions; neutral secondary for inspection and manual actions; danger only for destructive or unsafe actions; disabled buttons explain why.
- **Forms**: labels are close to fields, helper text appears below, validation never hides user-entered drafts.
- **Lists/tables/cards**: use lists for service queues, cards for repeated context modules, tables only for dense future admin/audit surfaces.
- **Navigation**: phase one has no multi-page nav; future navigation should not obscure the main workbench.
- **Modals/popovers**: use for future supervisor approval or sensitive reveal confirmations only when inline review would be too crowded.
- **Icons**: future icon buttons should use an approved icon library; high-risk actions need text labels plus accessible names.

## Interaction States

- **Hover**: subtle background tint or border change; no layout shift.
- **Focus**: visible high-contrast outline for keyboard users.
- **Selected/current**: persistent selected queue row and matching case/AI content.
- **Disabled**: lower contrast plus reason when tied to review or permissions.
- **Loading**: reserved panel space with manual fallback; never render incomplete draft content as usable.
- **Error/destructive**: explain recovery path and whether the agent can continue manually.

## Domain-Specific UI Rules

- AI suggestions are evidence panels, not final decisions.
- Knowledge citations must show version, locale/region when known, snippet/relevance reason, and citation boundary.
- Risk badges distinguish effective risk from AI-suggested risk.
- AI can suggest raising risk but cannot visually imply risk was lowered automatically.
- Draft acceptance means accepted for review, not sent to the customer.
- High-risk refund, compensation, delivery-date, and after-sales commitments need clear human review copy.
- Masked, summarized, aggregate, and omitted field visibility should be visible where it affects trust.

## Do's and Don'ts

| Do | Don't |
| -- | ----- |
| Build the first screen as the usable workbench | Create a marketing landing page before the app surface |
| Keep queue, evidence, and AI actions tightly connected | Split AI evidence far away from draft actions |
| Use warm paper surfaces and restrained borders | Copy PostHog branding, logos, jokes, or exact visual assets |
| Preserve serious risk and compliance tone | Make high-risk actions playful or casual |
| Verify desktop and mobile overflow | Let long case titles or draft text break panels |

## Open Design Questions

- Should Tianmao Global have its own approved brand color system, or should the MVP keep the current neutral/amber operational palette?
- Should future supervisor review be a separate route, modal, or right-panel mode?
- Should citation snippets be expandable inline or open in a future knowledge preview surface?
