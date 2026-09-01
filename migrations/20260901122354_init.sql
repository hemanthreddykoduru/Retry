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
