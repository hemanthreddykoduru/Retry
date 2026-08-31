# RETRY — UI/UX Build Brief for Antigravity
> **Read this entire file before modifying UI code.** This is the authoritative visual and interaction specification for Retry. If a generic SaaS/dashboard convention conflicts with this document, use this document.

## 1. Product Context

**Product:** Retry — an AI revenue-recovery agent for Indian online merchants.

**Tagline:** Smarter second attempts.

**What Retry does:** It detects a failed or silently abandoned payment, diagnoses the root cause, selects a safe intervention (wait for bank recovery, WhatsApp payment link, smart retry, or Telugu/Hindi/English voice call), and proves the recovery with an auditable event trail.

**Primary user:** A merchant owner, payments operator, or revenue operations team member.

**Primary demo audience:** Razorpay AI Buildathon judges watching a 5-minute screen recording. The UI must make these facts obvious in seconds:

1. Retry detects revenue loss in real time.
2. It diagnoses before contacting a customer.
3. It knows when **not** to contact a customer during bank downtime.
4. It takes bounded action: a retry, WhatsApp payment link, or vernacular voice call.
5. It measures recovered money and logs every decision.
6. It obeys guardrails: no spam, opt-out wins, quiet hours, escalation.

## 2. Reference and Rule

**Visual inspiration:** [Reticle](https://www.reticle.sh/)

Reticle is an inspiration for **product philosophy only**: evidence-forward, calm, technical, typography-led, and measurable. Do not copy its logo, name, exact UI, layout, source code, wording, or branding.

### The central design principle

> **Evidence, not decoration.**

Retry is not a generic AI chatbot dashboard. It is an operational system. Every visual element should answer one of these questions:

- What failed?
- Why did it fail?
- What did the agent decide?
- What action happened?
- Did the merchant recover money?
- Is the customer being protected by a guardrail?

Use receipt-like audit lines instead of vague AI claims. Prefer measured numbers, compact tables, timestamps, event labels, and clear state transitions.

## 3. Non-Negotiable Visual Rules

### Do

- Use a calm light theme.
- Use large, honest operational metrics.
- Use monospace typography for money, timestamps, event IDs, webhook events, policy decisions, and audit logs.
- Use whitespace, thin borders, and typography to create hierarchy.
- Make the main dashboard readable in a 1440px-wide demo recording without scrolling.
- Use semantic colors only to communicate status.
- Use label + color + icon/dot for status; do not communicate state only through color.
- Keep interactions fast and restrained.

### Do not

- Do not use gradients.
- Do not use glassmorphism, blurry blobs, 3D illustrations, stock photos, neon effects, or excessive shadows.
- Do not add animated charts purely for decoration.
- Do not use giant rounded cards. Radius must stay modest.
- Do not add a chatbot panel as the hero UI.
- Do not show fake “AI confidence” values unless they are derived from a real classifier or explicitly labeled simulated.
- Do not use a dark terminal aesthetic for every screen. This is a merchant product, not a hacker toy.

## 4. Design Tokens

Use Tailwind tokens or CSS variables. Keep the palette small.

```css
:root {
  --background: #fafafa;       /* zinc-50 */
  --surface: #ffffff;
  --border: #e4e4e7;           /* zinc-200 */
  --border-strong: #d4d4d8;    /* zinc-300 */
  --text-primary: #18181b;     /* zinc-900 */
  --text-secondary: #71717a;   /* zinc-500 */
  --text-muted: #a1a1aa;      /* zinc-400 */

  --recovered: #059669;        /* emerald-600 */
  --recovered-bg: #ecfdf5;     /* emerald-50 */
  --waiting: #d97706;          /* amber-600 */
  --waiting-bg: #fffbeb;       /* amber-50 */
  --active: #2563eb;           /* blue-600 */
  --active-bg: #eff6ff;        /* blue-50 */
  --lost: #dc2626;             /* red-600 */
  --lost-bg: #fef2f2;          /* red-50 */
  --neutral: #52525b;          /* zinc-600 */
  --neutral-bg: #f4f4f5;       /* zinc-100 */
}
```

### Typography

- UI/heading font: `Inter`, `Geist`, or system sans-serif.
- Data/log font: `Geist Mono`, `JetBrains Mono`, or `ui-monospace`.
- Headline letter-spacing: slightly tight (`tracking-tight`).
- Section labels: uppercase, `text-[11px]`, `font-medium`, `tracking-[0.12em]`, zinc-500.
- Operational values: `font-mono tabular-nums`.
- Never use more than 3 font sizes in one component.

### Shape and elevation

- Primary border radius: `8px` (`rounded-lg`) maximum.
- Small controls: `6px` (`rounded-md`).
- Cards: white surface, 1px zinc-200 border.
- Shadows: avoid; if absolutely needed, use only a very subtle `shadow-sm` on floating menus.
- Dividers: 1px zinc-200; use them generously instead of colored backgrounds.

## 5. App Information Architecture

Build these routes/screens:

| Route | Purpose |
|---|---|
| `/` | Merchant operations dashboard; the strongest demo page |
| `/cases` | Dense recovery case table with filters and status |
| `/cases/[id]` | Individual case detail, chronological audit trail, interventions, payment attribution |
| `/integration` | Merchant onboarding/integration page: webhook URL, install snippet, system health |
| `/settings` | Guardrail configuration: call threshold, quiet hours, contact caps |

If time is limited, fully polish `/`, `/cases`, and `/cases/[id]` first. `/integration` and `/settings` can be simpler but must look coherent.

## 6. Global Shell

### Desktop layout

Use a simple application shell:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ RETRY  /  Revenue Recovery                  NammaMart Demo Store   ● Healthy │
├───────────────┬─────────────────────────────────────────────────────────────┤
│ Overview      │                                                             │
│ Recovery cases│                     Main page content                        │
│ Integration   │                                                             │
│ Guardrails    │                                                             │
│               │                                                             │
│               │                                                             │
│               │                                                             │
└───────────────┴─────────────────────────────────────────────────────────────┘
```

### Header

- Height: approximately 56–64px.
- White background, bottom border.
- Left: `RETRY` in bold sans-serif + a tiny monospace label `/ Revenue Recovery`.
- Right: merchant selector (`NammaMart Demo Store`) and system health.
- Health label: green dot + `All systems operational`.
- Do not put a large user-avatar menu in the demo header.

### Sidebar

- Width: 200–220px.
- Plain white, right border.
- Small logo wordmark at top.
- Navigation items: icon + label; compact and quiet.
- Active item: zinc-900 text + very light zinc background or a 2px left border.
- Do not use pill-shaped navigation.

## 7. Dashboard (`/`)

This is the most important page. It must tell the entire Retry story in one view.

### 7.1 Page heading

```text
OVERVIEW
Revenue recovery, measured and attributable.
Aug 24–31, 2026  ·  Last event received 12 seconds ago
```

- Heading: 26–32px, tight tracking.
- Subtitle: 14px, zinc-500.
- Use actual-looking timestamps, but clearly support live data when it exists.

### 7.2 Metric row

Show exactly four metric cards in a 4-column grid on desktop.

```text
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│ RECOVERED REVENUE   │ │ RECOVERY RATE       │ │ CONTACTS AVOIDED    │ │ COST / RECOVERY     │
│ ₹48,620             │ │ 61.2%               │ │ 37                  │ │ ₹79                 │
│ +121% vs baseline   │ │ +23.4 pts baseline  │ │ Bank downtime cases │ │ Voice + WhatsApp    │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘ └─────────────────────┘
```

Rules:

- Large value: 28–36px, font-mono, tabular numbers.
- Label: uppercase 11px, tracked.
- Comparison/detail: 12px, muted; use emerald only for a positive comparison.
- Do not add icons unless they clarify status.
- Use the following semantic colors:
  - Recovered revenue: emerald emphasis.
  - Recovery rate: normal text / blue detail.
  - Contacts avoided: amber emphasis; this is a deliberate non-action.
  - Cost per recovery: normal dark text.

### 7.3 Live recovery receipts

This is the hero panel. Occupy roughly 65–70% of width on desktop.

```text
LIVE RECOVERY RECEIPTS                                      ● LIVE
Every decision is attributable, bounded, and auditable.

10:42:18  payment.failed          ₹1,499  issuer_bank_downtime
10:42:19  policy.decided                  suppress_contact · downtime confirmed
10:57:04  downtime.resolved               smart retry scheduled · 11:05 IST
11:06:11  payment.captured       ₹1,499  RECOVERED
──────────────────────────────────────────────────────────────────────────────
14:21:08  checkout.abandoned       ₹899  no heartbeat for 10m
14:21:09  policy.decided                  WhatsApp nudge · intent still fresh
14:21:10  payment_link.created     ₹899  ref: rc_82f1
14:28:44  payment_link.paid        ₹899  RECOVERED
──────────────────────────────────────────────────────────────────────────────
15:11:22  payment.failed         ₹1,999  insufficient_funds
15:11:23  policy.decided                  Telugu voice call · cart ≥ ₹500
15:12:47  sarvam.outcome                 promise_to_pay · Sep 02, 10:00 IST
```

Implementation details:

- Panel has a white surface, 1px border, `rounded-lg`.
- Title row includes a small green status dot and `LIVE` mono label.
- Events use `font-mono`, 12–13px, tabular numbers.
- Keep columns aligned: timestamp / event / amount / detail.
- Use small semantic status text: `RECOVERED` emerald, `suppress_contact` amber, `FAILED` red.
- New event rows may fade in over 150ms. No other decorative motion.
- Each group should be clickable and open its corresponding case detail page.
- On narrow screens, stack each event into timestamp then summary; do not let text become unreadable.

### 7.4 Diagnosis breakdown

Place this in the remaining 30–35% width beside the live receipt panel.

```text
FAILURE DIAGNOSIS
100 cases · ₹83,600 at risk

Bank downtime                 35     ₹31,240   ████████████
Insufficient funds            25     ₹22,100   █████████
PIN / OTP failure             20     ₹14,820   ███████
Silent network drop-off       15     ₹11,340   █████
Unknown / other                5      ₹4,100   ██
```

Rules:

- No chart-library donut chart. Use simple horizontal proportional bars.
- Bars are neutral zinc by default; use amber for bank downtime and blue for network/auth categories if needed.
- Amounts are monospace and right-aligned.
- Footer note: `37 customer contacts prevented by downtime-aware policy.`

### 7.5 Bottom insight strip

Use a thin full-width panel below the main content:

```text
POLICY IMPACT
37 customers were not contacted because Retry identified active bank downtime.
That is 37 unnecessary calls avoided — without sacrificing recovery.
```

This is a key differentiator. Use amber left-border or amber dot, not an oversized yellow card.

## 8. Recovery Cases (`/cases`)

### Header

```text
RECOVERY CASES
112 cases detected · ₹83,600 revenue at risk

[All status ▾] [All root causes ▾] [Last 7 days ▾]                    [Export CSV]
```

### Dense data table

```text
CASE        CUSTOMER        AMOUNT     ROOT CAUSE          NEXT ACTION                 STATUS
rc_8f21     Ananya R.       ₹1,499     Bank downtime       Retry after resolution     ● Waiting
rc_b182     Ravi K.           ₹899     Silent drop-off     WhatsApp delivered         ● Contacting
rc_c931     Srilatha P.     ₹1,999     Insufficient funds  Telugu call / promise      ● Promise logged
rc_a744     Kiran M.          ₹749     OTP failure         Payment link sent          ● Recovered
rc_6e02     Nikhil S.       ₹2,499     Customer opt-out    No further action          ● Closed
```

Rules:

- Use a proper HTML table for accessibility and scanability.
- Sticky column header on vertical scroll.
- Rows are 48–56px tall, with bottom borders.
- `CASE`, amount, IDs, and technical action text use monospace.
- Customer phone numbers must be partially masked: `+91 98••• 1207`.
- Status uses colored dot + label. Never only a color.
- Clicking a row routes to `/cases/[id]`.
- Add a small search field if easy; no complex filter UI needed.

## 9. Case Detail (`/cases/[id]`)

The case page is where judges see that Retry is a serious system rather than a UI mockup.

### Top summary

```text
RECOVERY CASE  /  rc_c931                                      ● PROMISE LOGGED
Srilatha P.  ·  +91 98••• 1207  ·  Telugu preferred

₹1,999 at risk                      Insufficient funds
Opened Aug 31, 15:11 IST             Recovery path: Voice call → Payment link
```

- Back link: `← Recovery cases`
- Status at top right.
- Show the amount large and monospace.

### Decision receipt / chronology

```text
AUDIT RECEIPT
15:11:22  WEBHOOK RECEIVED
          payment.failed · razorpay payment: pay_Qx82...

15:11:23  AGENT DIAGNOSIS
          cause: insufficient_funds
          reasoning: decline code indicates insufficient balance; amount is above merchant voice threshold.

15:11:24  POLICY DECISION
          action: voice_call
          guardrail: contact allowed · attempt 1 of 2 · within permitted hours

15:12:47  SARVAM CALL COMPLETED
          language: Telugu · duration: 01:14
          outcome: promise_to_pay · Sep 02, 10:00 IST

15:12:48  PAYMENT LINK CREATED
          amount: ₹1,999 · reference: rc_c931
```

Rules:

- Each record has a timestamp rail on the left and event body on the right.
- Event title uses mono uppercase or tracked uppercase label.
- Human-readable reason under technical state.
- Keep raw payload closed in a `<details>`/accordion section at bottom: `View raw Razorpay payload`.
- Include an `Intervention history` mini-table for delivery/call statuses.

### Right-side policy panel (desktop)

```text
GUARDRAILS APPLIED
✓ Contact window: permitted (15:11 IST)
✓ Voice attempts: 1 / 2 used
✓ Customer DND: not enabled
✓ Amount: original ₹1,999
✓ No discount generated by agent

NEXT SCHEDULED ACTION
Sep 02, 10:00 IST · Smart retry
```

This should look like proof, not a settings card. Use thin border and simple check rows.

## 10. Integration (`/integration`)

Purpose: demonstrate that Retry is a real merchant-integratable platform.

### Page content

```text
INTEGRATION
Connect Retry to your checkout in under 10 minutes.

1. Configure Razorpay webhooks
https://api.retry.example/api/webhooks/razorpay
[Copy]

Subscribed events
payment.failed · payment.captured · payment_link.paid · payment.downtime.*

2. Install drop-off detection
<script src="https://cdn.retry.example/v1/snippet.js" data-key="rk_demo_..."></script>
[Copy snippet]

3. Confirm system health
● Razorpay webhook connected
● Checkout heartbeat received 2 minutes ago
● WhatsApp test sender connected
● Sarvam voice agent ready
```

Rules:

- Code snippets on zinc-950 background with light mono text are allowed here only.
- `Copy` actions must work and display a small “Copied” confirmation.
- Do not implement complicated onboarding forms. This page is a credible demo skeleton.

## 11. Guardrails (`/settings`)

Make safety a first-class product surface.

```text
GUARDRAILS
Automation must recover revenue without harassing customers.

Voice call threshold                         ₹500
Only call for carts at or above this value.  [ 500 ]

Contact window                               09:00 — 21:00 IST
No calls or messages outside permitted hours.

Maximum voice attempts                       2
After two no-answers, escalate to human review.

Customer opt-out                             Enforced
“Do not contact” blocks every future automated action.

Payment-link amount                          Original cart value only
Retry cannot increase charges or invent discounts.
```

- Inputs can be functional or demo-state controlled.
- Use plain rows with labels, descriptions, and a right-side value/control.
- Highlight “Customer opt-out: Enforced” using neutral/emerald proof styling.

## 12. Required UI States

Build all states below; judges notice failure handling.

| State | UI behavior |
|---|---|
| `recovered` | Emerald dot, “Recovered ₹X”, close timestamp, payment link attribution |
| `awaiting_downtime_resolution` | Amber dot, “No customer contact — bank downtime active” |
| `contacting` | Blue dot, latest intervention and its delivery/call state |
| `promise_logged` | Blue/amber dot, promised date and amount |
| `escalated` | Red dot, clearly state automation stopped and human review is needed |
| `closed_optout` | Zinc dot, “Customer requested no contact — all automation stopped” |
| External API failure | Small inline error inside event receipt, then visible fallback action: “Sarvam call failed → WhatsApp nudge queued” |
| Empty state | Explain the value: “No recovery cases yet. Retry will appear here when it receives a failed payment or checkout timeout.” |
| Loading state | Subtle skeleton rows; no bouncy spinners |

## 13. Demo Seed Data

Use plausible, internally consistent data. Never label synthetic data as “live production.” For the Buildathon demo, label it subtly: `Demo workspace · test-mode events`.

### Required signature cases

1. **Downtime-aware non-contact**
   - Customer: Ananya R.
   - Amount: ₹1,499
   - Root cause: issuer bank downtime
   - Receipt: failure → downtime matched → `suppress_contact` → downtime resolved → retry → recovered
   - Outcome: recovered
   - Showcase metric: contact avoided

2. **Silent checkout abandonment**
   - Customer: Ravi K.
   - Amount: ₹899
   - Root cause: network drop / no checkout heartbeat for 10 min
   - Receipt: abandonment detected → WhatsApp payment link → paid
   - Outcome: recovered

3. **Telugu voice-agent recovery**
   - Customer: Srilatha P.
   - Amount: ₹1,999
   - Root cause: insufficient funds
   - Receipt: failed payment → policy determines cart ≥ ₹500 → Sarvam Telugu call → promise-to-pay → link → payment
   - Outcome: promise logged or recovered (use recovered for final video)

4. **Opt-out safety path**
   - Customer: Kiran M.
   - Amount: ₹749
   - Receipt: call/WhatsApp initiated → customer says “do not contact” → customer DND enabled → all future actions blocked
   - Outcome: closed opt-out

5. **Graceful provider failure**
   - Customer: Nikhil S.
   - Amount: ₹2,499
   - Receipt: Sarvam call API fails → audit log records error → WhatsApp fallback scheduled
   - Outcome: contacting / fallback completed

## 14. Component Inventory

Create reusable components; do not build the dashboard as one enormous page file.

```text
components/
  app-shell.tsx
  sidebar.tsx
  header.tsx
  metric-card.tsx
  status-badge.tsx
  receipt-feed.tsx
  receipt-row.tsx
  diagnosis-breakdown.tsx
  case-table.tsx
  case-status.tsx
  audit-timeline.tsx
  guardrail-proof.tsx
  code-snippet-card.tsx
  empty-state.tsx
  system-health.tsx
```

### Required component behavior

- `StatusBadge`: label + dot + semantic status; never color only.
- `ReceiptRow`: accepts timestamp, event, amount, detail, state, and optional `caseId`.
- `MetricCard`: accepts label, value, subtext, trend/state; values use tabular numbers.
- `AuditTimeline`: accepts chronological records and renders technical event + human-readable reasoning.
- `GuardrailProof`: label, pass/fail/neutral state, explanation.

## 15. Responsive Requirements

- Target desktop first: 1440px width; judges likely watch this view.
- At <1024px: hide/collapse sidebar, make metric cards 2 columns, stack dashboard panels.
- At <640px: metric cards single column; tables scroll horizontally but retain readable columns; audit timeline remains usable.
- Never reduce monospace data below 11px.
- Do not make mobile the primary visual target this week.

## 16. Accessibility and Trust

- Use semantic HTML: `nav`, `main`, `section`, `table`, `button`.
- Every icon-only control needs `aria-label` and tooltip.
- Status color must be accompanied by a text label and dot/icon.
- Ensure contrast meets WCAG AA for normal text.
- Mask customer phone data everywhere except deliberately authorized internal test data.
- Mark data source status truthfully: `Razorpay test mode`, `Demo workspace`, or `Live webhook connected` as appropriate.

## 17. Implementation Priority

Build UI in this order:

1. App shell + design tokens + dashboard layout.
2. Four metric cards + live recovery receipt feed.
3. Diagnosis breakdown + case table.
4. Case detail audit timeline + guardrail proof.
5. Integration and guardrail settings pages.
6. Realtime event append / subtle number count-up only after core screens work.

Do not spend time on custom illustrations, marketing pages, animated backgrounds, or polished empty states before the case detail and receipt feed work.

## 18. Definition of Done

The UI is ready for the Razorpay Buildathon demo when:

- A reviewer understands Retry's detect → diagnose → intervene → recover loop in under 20 seconds on `/`.
- The dashboard visibly distinguishes a successful recovery from a deliberately suppressed customer contact during downtime.
- The voice-agent case has a clear Telugu call outcome and payment-link attribution.
- The case-detail timeline makes every agent action explainable.
- Guardrails are visible and credible, especially opt-out and call-attempt limits.
- The app is calm, fast, high-contrast, and contains no generic AI-SaaS visual clutter.
- It looks like a real operational product, not a frontend mockup.
