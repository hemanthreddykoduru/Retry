# Retry Measurement Harness

A **zero-dependency, deterministic** simulation that produces Retry's "money slide"
without any live integration. This is your insurance policy: even if WhatsApp
approval, Sarvam, or Razorpay flake on demo day, you already have a defensible,
reproducible batch result that scores against Track 03's bar.

## Run

```bash
cd retry-harness
node runExperiment.mjs      # Node 18+ (ESM). No npm install needed.
```

Outputs to `./out/`:
- `money_slide.md` — paste-ready table for your README/video
- `results.json` — full per-arm aggregates + honest exception list
- `audit_log.csv` — per-action agent reasoning (judge-facing trail)

## What it does

Generates 105 synthetic failed-payment cases across 15 merchants using an
India-realistic failure mix, then runs the **same batch** (paired design) under
three policies and measures the outcome:

| Arm | Policy |
|---|---|
| `baseline` | 3 blind retries, no customer contact |
| `naive_dunning` | contact everyone immediately (a typical dunning tool) |
| `retry` | diagnose first → matched, bounded intervention |

Reports: ₹ recovered per arm, recovery rate, **contacts avoided vs naive
dunning** (the diagnosis-first KPI), cost per recovery, promise-kept rate,
rules-diagnosis accuracy, an **honest exception list**, and a
**failure-injection** summary (duplicate + malformed webhooks handled without
crashing).

## Honesty (say this out loud in the video + README)

The numbers are **simulated** via the documented `RECOVERY_MODEL` in
`runExperiment.mjs`. That is deliberate — Track 03 asks for *measured money
recovered across a batch*, and a transparent model on 100+ cases beats a single
cherry-picked live recovery. Your live test-mode integration then recovers **one
real payment link on camera** to prove the plumbing is real.

## How to defend it to the panel

- **The model is explicit and interrogable** — every probability is a named
  constant with a rationale (see comments). Offer a sensitivity band: "even if my
  recovery assumptions are 20% optimistic, Retry still wins on cost-per-recovery."
- **The advantage is structural, not magic**: Retry skips contacting
  self-resolving bank-downtime cases, so it recovers comparable ₹ while contacting
  far fewer people. That is the KPI no existing tool reports.
- **Determinism** (fixed seed) means anyone can reproduce your exact numbers.

## How this maps to the real app

The harness IS your core logic, decoupled from I/O — reuse it:
- `diagnose()` → your decline-code/downtime → `root_cause` classifier (rules).
- `planInterventions()` → your bounded **policy engine** (guardrails live here).
- `simulate()`'s outcome logic → replace with real Razorpay/WhatsApp/Sarvam calls
  behind the same interface; the audit-log and attribution shape stay identical.

## Tune

Edit the constants at the top of `runExperiment.mjs`: batch size, failure mix,
`RECOVERY_MODEL`, costs, guardrail thresholds. Re-run to regenerate all artifacts.
Keep the seed fixed for reproducible submission numbers.
