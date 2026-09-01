# AGENTS.md — RETRY
> Read this file fully before writing any code. It is the single source of truth for this project. If anything conflicts with your assumptions, this file wins.

## 1. Mission

**Retry** is an **AI revenue-recovery agent for Indian online merchants**. Tagline: "Smarter second attempts." It integrates with a merchant's Razorpay-powered checkout, detects failed and silently-abandoned payments, diagnoses the root cause, and recovers the money through bounded, compliant interventions: smart retries, WhatsApp nudges with fresh payment links, and vernacular AI voice calls (Telugu/Hindi/English) via Sarvam. Every action is audited; every rupee recovered is measured and attributed.

Built for the Razorpay AI Buildathon (Track: AI Revenue Recovery). The judges' rubric: problem taste, build quality, AI judgment (rules where rules work, LLM only where it adds value), and graceful failure recovery. Measured metrics + audit trail + stopping rules are mandatory, not optional.

## 2. Tech Stack (fixed — do not substitute)

| Layer | Choice |
|---|---|
| App | Next.js (App Router) + TypeScript + Tailwind |
| Backend/DB | InsForge (Postgres). Every table is a typed REST/SDK endpoint. Use `@insforge/sdk` |
| Payments | Razorpay Node SDK, **test mode only** |
| Voice | Sarvam Voice Agents (outbound API + outcome webhook) |
| Messaging | Meta WhatsApp Cloud API (test sender number) |
| Local webhook dev | ngrok or Cloudflare Tunnel |
| Deploy | Vercel |

## 3. Repo Structure

```
retry/
  AGENTS.md                  ← this file
  app/
    page.tsx                 ← merchant dashboard (live)
    api/
      webhooks/razorpay/route.ts      ← signed webhook ingress
      webhooks/sarvam/route.ts        ← call outcome ingress
      snippet/event/route.ts          ← JS snippet heartbeat/events
      cron/worker/route.ts            ← abandonment timeout + scheduler tick
    cases/[id]/page.tsx               ← case detail + audit timeline
  lib/
    insforge.ts              ← createClient singleton
    razorpay.ts              ← Razorpay client singleton
    policy.ts                ← root-cause → intervention decision engine
    guardrails.ts            ← hard rules (caps, quiet hours, opt-out)
    audit.ts                 ← audit_log writer (every action calls this)
    whatsapp.ts              ← Cloud API send helpers
    sarvam.ts                ← outbound call trigger + variable payload
  scripts/
    seed.ts                  ← synthetic merchants + failure batch generator
    simulate.ts              ← baseline-vs-agent measurement harness
  db/schema.sql              ← authoritative DDL (section 5)
```

## 4. Environment Variables (.env.local — never commit)

```
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx
INSFORGE_BASE_URL=https://<project>.us-east.insforge.app
INSFORGE_API_KEY=ik_xxx
SARVAM_API_KEY=xxx
WHATSAPP_TOKEN=xxx
WHATSAPP_PHONE_NUMBER_ID=xxx
APP_BASE_URL=https://<tunnel-or-vercel-url>
```

## 5. Database Schema (authoritative — db/schema.sql)

```sql
create extension if not exists pgcrypto;

create table merchants (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  email text not null unique,
  api_key text not null unique default encode(gen_random_bytes(24), 'hex'),
  razorpay_key_id text,
  razorpay_key_secret text,
  webhook_secret text,
  whatsapp_phone_number_id text,
  voice_call_threshold int not null default 50000,   -- paise (₹500)
  created_at timestamptz not null default now()
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  name text,
  phone text not null,                                -- E.164
  preferred_language text not null default 'hi'
    check (preferred_language in ('te','hi','en')),
  do_not_contact boolean not null default false,
  created_at timestamptz not null default now(),
  unique (merchant_id, phone)
);

create table checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  customer_id uuid references customers(id),
  razorpay_order_id text,
  cart_value int not null,
  status text not null default 'active'
    check (status in ('active','abandoned','paid','expired')),
  started_at timestamptz not null default now(),
  last_heartbeat_at timestamptz not null default now()
);

create table payment_events (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid references merchants(id),
  razorpay_event_id text not null unique,             -- idempotency key
  event_type text not null,
  payload jsonb not null,
  processed boolean not null default false,
  received_at timestamptz not null default now()
);

create table recovery_cases (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references merchants(id) on delete cascade,
  customer_id uuid not null references customers(id),
  checkout_session_id uuid references checkout_sessions(id),
  trigger_source text not null
    check (trigger_source in ('payment_failed_webhook','snippet_timeout','uncaptured_auth')),
  failure_code text,
  failure_reason text,
  root_cause text check (root_cause in
    ('bank_downtime','insufficient_funds','auth_failure','network_drop',
     'limit_exceeded','customer_intent','unknown')),
  amount int not null,
  status text not null default 'open' check (status in
    ('open','diagnosing','awaiting_downtime_resolution','intervention_scheduled',
     'contacting','promise_logged','recovered','escalated','closed_lost','closed_optout')),
  attempt_count int not null default 0,
  max_attempts int not null default 3,
  razorpay_payment_link_id text,
  recovered_amount int,
  opened_at timestamptz not null default now(),
  closed_at timestamptz
);

create table interventions (
  id uuid primary key default gen_random_uuid(),
  recovery_case_id uuid not null references recovery_cases(id) on delete cascade,
  type text not null
    check (type in ('smart_retry','whatsapp_nudge','voice_call','human_escalation')),
  status text not null default 'queued'
    check (status in ('queued','sent','delivered','answered','completed','failed','skipped')),
  scheduled_for timestamptz not null default now(),
  executed_at timestamptz,
  outcome text,
  outcome_detail jsonb,
  created_at timestamptz not null default now()
);

create table call_sessions (
  id uuid primary key default gen_random_uuid(),
  intervention_id uuid not null references interventions(id) on delete cascade,
  sarvam_call_id text,
  language_used text,
  duration_sec int,
  transcript text,
  promise_to_pay boolean default false,
  promise_date date,
  objection_type text,
  raw_payload jsonb
);

create table promises (
  id uuid primary key default gen_random_uuid(),
  recovery_case_id uuid not null references recovery_cases(id) on delete cascade,
  promised_date date not null,
  amount int not null,
  status text not null default 'pending' check (status in ('pending','kept','broken')),
  created_at timestamptz not null default now()
);

create table audit_log (
  id bigint generated always as identity primary key,
  recovery_case_id uuid references recovery_cases(id) on delete cascade,
  actor text not null check (actor in ('agent','system','human')),
  action text not null,
  reasoning text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table daily_metrics (
  merchant_id uuid references merchants(id) on delete cascade,
  date date not null,
  failures_detected int default 0,
  cases_opened int default 0,
  cases_recovered int default 0,
  amount_at_risk int default 0,
  amount_recovered int default 0,
  calls_placed int default 0,
  whatsapps_sent int default 0,
  optouts int default 0,
  primary key (merchant_id, date)
);

create index on recovery_cases (merchant_id, status);
create index on checkout_sessions (status, last_heartbeat_at);
create index on interventions (status, scheduled_for);
create index on audit_log (recovery_case_id);
```

## 6. Integration Contracts

### 6.1 Razorpay webhooks (`POST /api/webhooks/razorpay`)
- Subscribe to: `payment.failed`, `payment.captured`, `order.paid`, `payment_link.paid`, `payment_link.expired`, `payment.downtime.started`, `payment.downtime.updated`, `payment.downtime.resolved`.
- **Verify `X-Razorpay-Signature` = HMAC-SHA256(rawBody, webhook_secret), hex.** Critical: hash the RAW body (`await req.text()`); verify BEFORE `JSON.parse`. Reject mismatch with 400.
- Store every event in `payment_events` first (idempotent: unique `razorpay_event_id`, on-conflict-do-nothing), then process. Razorpay retries deliveries — duplicates must be harmless.

### 6.2 Payment links (test mode)
- Create via `POST /v1/payment_links` ONLY when an intervention needs one (test mode caps at 30 links/account — never pre-generate).
- Always set `reference_id = recovery_cases.id` — this is the recovery-attribution key.
- `payment_link.paid` → match `reference_id` → case `recovered`, set `recovered_amount`, audit entry, update `daily_metrics`.

### 6.3 Sarvam voice (`lib/sarvam.ts` + `POST /api/webhooks/sarvam`)
- Trigger outbound call with variables: `customer_name`, `merchant_name`, `amount`, `order_id`, `failure_reason`, `payment_link_url`, `preferred_language`.
- Outcome webhook writes `call_sessions` row and updates the case:
  - `promise_to_pay` → insert `promises` row, case → `promise_logged`, schedule ONE bounded retry on `promise_date`
  - `link_requested` → queue `whatsapp_nudge` with payment link
  - `do_not_contact` → `customers.do_not_contact = true`, case → `closed_optout`
  - `no_answer`/`failed` → `attempt_count += 1`

### 6.4 WhatsApp Cloud API (`lib/whatsapp.ts`)
- `POST https://graph.facebook.com/v22.0/{WHATSAPP_PHONE_NUMBER_ID}/messages`
- Use approved template `payment_recovery` (utility): "Hi {{1}}, your payment of ₹{{2}} at {{3}} didn't go through. Complete it securely here: {{4}} — Retry for {{3}}"
- Inside a 24h customer-service window (customer messaged first), free-form text is allowed.

### 6.5 JS snippet (`/api/snippet/event`)
- Merchant embeds a `<script>` that POSTs `{ api_key, session_id, cart_value, customer_phone?, event: 'start'|'heartbeat'|'paid' }`.
- Worker (`/api/cron/worker`, run every minute): `active` sessions with `last_heartbeat_at` older than 10 minutes and no matching `payment.captured`/`order.paid` → mark `abandoned`, open `recovery_cases` with `trigger_source='snippet_timeout'`, `root_cause='network_drop'` (tentative).

## 7. Policy Engine (lib/policy.ts) — the core IP

| root_cause | Detection signal | Action |
|---|---|---|
| bank_downtime | `payment.downtime.started` active for the method/bank | NO customer contact. Case → `awaiting_downtime_resolution`; auto-retry when `downtime.resolved` |
| insufficient_funds | failure code in `payment.failed` payload | Salary-aware retry (schedule to 1st/2nd of month 9–11 AM) + `voice_call` if amount ≥ merchant threshold, else `whatsapp_nudge` |
| auth_failure | wrong PIN / OTP failure codes | Immediate `whatsapp_nudge`: "PIN/OTP issue — try again" + fresh payment link |
| network_drop | snippet timeout (no failure webhook) | Immediate `whatsapp_nudge` while intent is hot |
| limit_exceeded | limit failure codes | `whatsapp_nudge` suggesting alternate method + link |
| customer_intent / unknown | everything else | `voice_call` to diagnose (amount ≥ threshold), else `whatsapp_nudge` |

**LLM usage policy (AI judgment rubric):** rules make all decisions. LLM is used ONLY for: (a) classifying ambiguous free-text failure reasons, (b) voice-call dialogue, (c) drafting the `reasoning` text for `audit_log`. Never call an LLM where an if-statement works.

## 8. Guardrails (lib/guardrails.ts — hard code, never prompts)

- Max 2 `voice_call` interventions per case; `max_attempts` 3 total
- Quiet hours: no `voice_call`/`whatsapp_nudge` executes 21:00–09:00 IST; clamp `scheduled_for` at queue time
- `customers.do_not_contact = true` blocks ALL interventions, always
- Second broken promise → case `escalated`, `human_escalation` intervention, no further automation
- Payment link amount ALWAYS equals original cart value — never modified by the agent
- Every state change + every intervention writes an `audit_log` row (`actor`, `action`, human-readable `reasoning`, `metadata`)

## 9. Case State Machine

```
open → diagnosing → awaiting_downtime_resolution ─┐
     → intervention_scheduled → contacting ───────┤
     → promise_logged ────────────────────────────┤
                                                  ▼
   payment_link.paid / payment.captured ──→ recovered (set recovered_amount, close)
   payment_link.expired & attempts<cap ───→ intervention_scheduled (next action)
   attempts=cap ──────────────────────────→ escalated
   opt-out ───────────────────────────────→ closed_optout
   customer refuses ──────────────────────→ closed_lost
```

## 10. Milestones — build in this order, do not skip acceptance checks

- **M1 Ingestion:** webhook endpoint verifies signature; invalid signatures 400; a test `payment.failed` lands in `payment_events`. ✅ verified via Razorpay dashboard test event.
- **M2 Detection:** `payment.failed` → `recovery_cases` row with failure code/reason; snippet heartbeat endpoint + timeout worker creates abandonment cases; downtime events set/release `awaiting_downtime_resolution`.
- **M3 Recovery loop (no voice):** policy engine queues correct intervention per §7; WhatsApp sends; payment link created lazily with `reference_id`; `payment_link.paid` closes case as `recovered` with audit trail. ✅ one full end-to-end recovery in test mode.
- **M4 Voice:** Sarvam outbound trigger fires with correct variables; outcome webhook writes `call_sessions`, creates `promises`, enforces opt-out. ✅ real call to a verified test number completes the script.
- **M5 Measurement:** `scripts/seed.ts` generates 15 merchants + 100 failure cases (mix: downtime 35%, insufficient funds 25%, auth 20%, network drop 15%, other 5%); `scripts/simulate.ts` runs baseline (3 blind retries) vs agent policy over a simulated 7-day window; dashboard shows ₹ recovered, recovery rate, contacts avoided, live case feed (InsForge realtime).
- **M6 Hardening:** guardrails demoed (opt-out stops everything; quiet hours clamp); one failure path shown gracefully (e.g., Sarvam call fails → falls back to WhatsApp, logs it); README with architecture diagram + metrics.

## 11. Explicitly Out of Scope (this week)

- Real telephony hardening, DLT registration, production WhatsApp templates per merchant
- Full multi-merchant auth/UI (skeleton only: signup → api_key → snippet install instructions)
- `refund.*`, `settlement.*`, `invoice.*`, `payment.dispute.*` handling (mention in README roadmap only)
- Any live-mode Razorpay usage — TEST MODE ONLY

## 12. Conventions

- Money: integer **paise**, never floats. Display layer converts to ₹.
- All timestamps `timestamptz`; all scheduling in IST.
- Every external call wrapped in try/catch; failures write `audit_log` and degrade gracefully — the app must never crash on a bad webhook or a dead third-party API.
- Commit small, commit often, public repo.

<!-- INSFORGE:START -->
## InsForge backend

This project uses [InsForge](https://insforge.dev): an all-in-one, open-source Postgres-based backend (BaaS) that gives this app a database, authentication, file storage, edge functions, realtime, an AI model gateway, and payments through one platform.

- **Project:** **Retry** (API base `https://67eyaefq.us-east.insforge.app`)
- **Skills:** these InsForge skills are installed for supported coding agents. Reach for them before implementing any InsForge feature instead of guessing the API:
  - `insforge`: app code with the `@insforge/sdk` client (database CRUD, auth, storage, edge functions, realtime, AI, email, and Stripe payments).
  - `insforge-cli`: backend and infrastructure via the `insforge` CLI (projects, SQL, migrations, RLS policies, storage buckets, functions, secrets, payment setup, schedules, deploys).
  - `insforge-debug`: diagnosing failures (SDK/HTTP errors, RLS denials, auth and OAuth issues) and running security or performance audits.
  - `insforge-integrations`: wiring external auth providers (Clerk, Auth0, WorkOS, Better Auth, etc.) for JWT-based RLS, or the OKX x402 payment facilitator.
  - `find-skills`: discovering additional skills on demand.
- **Credentials:** app code reads keys from `.env.local`; the CLI reads `.insforge/project.json`. Never hardcode or commit keys.

Key patterns:

- Database inserts take an array: `insert([{ ... }])`.
- Reference users with `auth.users(id)`; use `auth.uid()` in RLS policies.
- For storage uploads, persist both the returned `url` and `key`.
<!-- INSFORGE:END -->
