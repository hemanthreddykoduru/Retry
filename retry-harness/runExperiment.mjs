// ─────────────────────────────────────────────────────────────────────────────
// RETRY — Revenue Recovery Measurement Harness
// Track 03: AI Revenue Recovery · Razorpay AI Buildathon 2026
//
// PURPOSE
//   Produces the "money slide" WITHOUT any live integration (no WhatsApp, no
//   Sarvam, no Razorpay uptime). It simulates a batch of failed/abandoned
//   payments with an India-realistic failure mix, runs THREE recovery policies
//   over the SAME batch (paired design), and reports measured rupees recovered,
//   recovery rate, customer contacts, cost per recovery, promise-kept rate, an
//   HONEST exception list, and a failure-injection summary.
//
//   Run:  node runExperiment.mjs
//   Zero dependencies. Deterministic (seeded RNG) so results reproduce exactly.
//
// HONESTY NOTE (say this in the video + README)
//   These numbers are SIMULATED on synthetic data using the recovery model in
//   RECOVERY_MODEL below. The point is a defensible, reproducible batch result —
//   not a claim of production numbers. Live test-mode integrations recover a
//   real test payment link on camera; this harness proves the policy at scale.
// ─────────────────────────────────────────────────────────────────────────────

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "out");

// ── Deterministic PRNG (mulberry32) ─────────────────────────────────────────
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260830); // fixed seed = reproducible batch

// ── Config: batch composition ───────────────────────────────────────────────
const N_MERCHANTS = 15;
const CASES_PER_MERCHANT = 7;            // ~105 cases
const VOICE_THRESHOLD_PAISE = 50000;     // ₹500 — call only above this
const OPT_OUT_RATE = 0.05;               // of contacted customers
const QUIET_HOURS_SHARE = 0.30;          // share of cases arriving 9PM–9AM
const DIAGNOSIS_ACCURACY = 0.92;         // rules classifier vs ground truth
const PROMISE_GIVEN_RATE = 0.65;         // voice cases that give a promise-to-pay
const PROMISE_KEPT_RATE = 0.70;          // of promises, fraction kept

// India failure mix (weights sum to 1). Source: spec §7.
const FAILURE_MIX = [
  ["bank_downtime",      0.35],
  ["insufficient_funds", 0.25],
  ["auth_failure",       0.20],
  ["network_drop",       0.15],
  ["unknown",            0.05],
];

// Decline codes emitted per root cause (the diagnosis classifier maps these back)
const DECLINE_CODES = {
  bank_downtime:      "GATEWAY_ERROR",
  insufficient_funds: "BAD_REQUEST_INSUFFICIENT_FUNDS",
  auth_failure:       "BAD_REQUEST_PAYMENT_FAILED",   // wrong OTP/PIN / 3DS
  network_drop:       "SNIPPET_TIMEOUT",              // silent abandonment
  unknown:            "PAYMENT_FAILED_UNSPECIFIED",
};

// ── Recovery model: P(recover) by root cause × policy arm ────────────────────
// DEFENSIBLE ASSUMPTIONS (documented so the panel can interrogate them):
//  • baseline      = 3 blind retries, no customer contact.
//  • naive_dunning = contact EVERYONE immediately (typical dunning tool).
//  • retry       = diagnose first, then the matched, bounded intervention.
//  Rationale highlights:
//   - bank_downtime largely SELF-RESOLVES once the bank is back, so contacting
//     is wasted spend/annoyance; retry waits + retries and NEVER calls.
//   - insufficient_funds benefits from salary-aware timing + a voice promise.
//   - auth_failure is a fixable UX error → a targeted WhatsApp hint + fresh link.
//   - network_drop had real intent → an instant nudge while intent is hot.
const RECOVERY_MODEL = {
  bank_downtime:      { baseline: 0.55, naive_dunning: 0.58, retry: 0.72 },
  insufficient_funds: { baseline: 0.30, naive_dunning: 0.45, retry: 0.60 },
  auth_failure:       { baseline: 0.25, naive_dunning: 0.40, retry: 0.62 },
  network_drop:       { baseline: 0.20, naive_dunning: 0.50, retry: 0.65 },
  unknown:            { baseline: 0.15, naive_dunning: 0.25, retry: 0.38 },
};

// Cost model (paise). Retries are free; contact costs money.
const COST_WHATSAPP = 35;   // ₹0.35 utility message
const COST_VOICE    = 300;  // ₹3 ≈ Sarvam credits for ~1.5 min

// ── Helpers ──────────────────────────────────────────────────────────────────
const rupees = (paise) => "₹" + (paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 });
const pct = (x) => (100 * x).toFixed(1) + "%";
function pick(weighted) {
  const r = rand();
  let acc = 0;
  for (const [k, w] of weighted) { acc += w; if (r < acc) return k; }
  return weighted[weighted.length - 1][0];
}
function randAmountPaise() {
  // log-ish spread ₹120–₹8000, so some cases clear the voice threshold and some don't
  const base = 120 + Math.floor(rand() * rand() * 7880);
  return base * 100;
}

// ── 1. Generate the synthetic batch (with ground truth) ──────────────────────
function generateBatch() {
  const cases = [];
  for (let m = 1; m <= N_MERCHANTS; m++) {
    for (let c = 0; c < CASES_PER_MERCHANT; c++) {
      const trueCause = pick(FAILURE_MIX);
      const amount = randAmountPaise();
      cases.push({
        id: `case_${m}_${c}`,
        merchant_id: `merchant_${m}`,
        trueCause,                                   // ground truth (never shown to policy)
        declineCode: DECLINE_CODES[trueCause],
        amount,
        language: pick([["te", 0.34], ["hi", 0.5], ["en", 0.16]]),
        quietHours: rand() < QUIET_HOURS_SHARE,
        // latent recoverability draw — the customer's intrinsic willingness/ability.
        // SAME draw is reused across all three arms => a fair PAIRED comparison.
        latent: rand(),
        optOutDraw: rand(),
        promiseGivenDraw: rand(),
        promiseKeptDraw: rand(),
        diagnosisNoise: rand(),
      });
    }
  }
  return cases;
}

// ── 2. Diagnosis (deterministic rules; no LLM) ───────────────────────────────
// Maps a decline code / trigger to a root cause. We inject small noise to model
// real-world misclassification, so the harness can also report classifier
// accuracy AND show that a wrong diagnosis costs recovery (retry only).
const CODE_TO_CAUSE = Object.fromEntries(
  Object.entries(DECLINE_CODES).map(([cause, code]) => [code, cause])
);
function diagnose(kase) {
  const truth = CODE_TO_CAUSE[kase.declineCode] ?? "unknown";
  if (kase.diagnosisNoise > DIAGNOSIS_ACCURACY) {
    // misclassify to a neighbouring cause
    const alt = ["insufficient_funds", "auth_failure", "network_drop", "unknown"]
      .filter((x) => x !== truth);
    return alt[Math.floor(kase.diagnosisNoise * alt.length) % alt.length];
  }
  return truth;
}

// ── 3. Policy engine (bounded + gated) → does this arm contact, and how? ──────
// Returns { contacts:[{type,costPaise}], usesVoice:bool }
function planInterventions(arm, kase, diagnosedCause) {
  if (arm === "baseline") return { contacts: [], usesVoice: false };        // retries only
  if (arm === "naive_dunning") {
    return { contacts: [{ type: "whatsapp_nudge", costPaise: COST_WHATSAPP }], usesVoice: false };
  }
  // retry: diagnose-first, matched + bounded
  switch (diagnosedCause) {
    case "bank_downtime":
      return { contacts: [], usesVoice: false };                            // WAIT + retry, never contact
    case "insufficient_funds":
      return kase.amount >= VOICE_THRESHOLD_PAISE
        ? { contacts: [{ type: "voice_call", costPaise: COST_VOICE }], usesVoice: true }
        : { contacts: [{ type: "whatsapp_nudge", costPaise: COST_WHATSAPP }], usesVoice: false };
    case "auth_failure":
    case "network_drop":
      return { contacts: [{ type: "whatsapp_nudge", costPaise: COST_WHATSAPP }], usesVoice: false };
    default: // unknown → a call to ask what went wrong
      return { contacts: [{ type: "voice_call", costPaise: COST_VOICE }], usesVoice: true };
  }
}

// ── 4. Simulate one case under one arm ───────────────────────────────────────
function simulate(arm, kase, audit) {
  const diagnosed = arm === "retry" ? diagnose(kase) : null;
  const plan = planInterventions(arm, kase, diagnosed);
  const willContact = plan.contacts.length > 0;

  // Guardrail: opt-out is checked before any contact and stops everything.
  if (willContact && kase.optOutDraw < OPT_OUT_RATE) {
    audit(kase.id, arm, "honor_opt_out",
      "Customer previously opted out / opted out on contact — no further action.", { arm });
    return { status: "closed_optout", recovered: false, recoveredAmount: 0,
             contacts: 1, costPaise: plan.contacts[0].costPaise, promiseGiven: false, promiseKept: false };
  }

  // Probability of recovery under this arm.
  let p;
  if (arm === "retry") {
    // Acting on the DIAGNOSED cause: if we misdiagnosed, the matched intervention
    // is wrong and we do no better than a blind retry for the TRUE cause.
    p = diagnosed === kase.trueCause
      ? RECOVERY_MODEL[kase.trueCause].retry
      : RECOVERY_MODEL[kase.trueCause].baseline;
    // Guardrail cost: quiet-hours clamp delays "instant" nudges → small hit on
    // network_drop's hot-intent advantage. Honest trade-off, not hidden.
    if (kase.trueCause === "network_drop" && kase.quietHours) p -= 0.10;
  } else {
    p = RECOVERY_MODEL[kase.trueCause][arm];
  }

  const recovered = kase.latent < p;
  const contacts = willContact ? 1 : 0;
  const costPaise = willContact ? plan.contacts[0].costPaise : 0;

  // Promise-to-pay tracking (voice cases only).
  let promiseGiven = false, promiseKept = false;
  if (plan.usesVoice && kase.promiseGivenDraw < PROMISE_GIVEN_RATE) {
    promiseGiven = true;
    promiseKept = kase.promiseKeptDraw < PROMISE_KEPT_RATE;
  }

  if (arm === "retry") {
    audit(kase.id, arm, recovered ? "recovered" : "no_recovery",
      `Diagnosed=${diagnosed} (true=${kase.trueCause}); ` +
      `${willContact ? plan.contacts[0].type : "retry_only"}; p=${p.toFixed(2)}; ` +
      `${recovered ? "link paid" : (promiseGiven ? (promiseKept ? "promise kept" : "promise broken→escalate") : "exhausted→exception")}.`,
      { amount: kase.amount, diagnosed, trueCause: kase.trueCause });
  }

  return {
    status: recovered ? "recovered" : "closed_lost",
    recovered,
    recoveredAmount: recovered ? kase.amount : 0,
    contacts, costPaise, promiseGiven, promiseKept,
    diagnosed,
  };
}

// ── 5. Run an arm over the whole batch ───────────────────────────────────────
function runArm(arm, batch, audit) {
  const agg = {
    arm, atRisk: 0, recovered: 0, recoveredAmount: 0, cases: batch.length,
    contacts: 0, costPaise: 0, optouts: 0, promisesGiven: 0, promisesKept: 0,
    byCause: {}, exceptions: [],
  };
  for (const kase of batch) {
    agg.atRisk += kase.amount;
    const r = simulate(arm, kase, audit);
    agg.contacts += r.contacts;
    agg.costPaise += r.costPaise;
    if (r.status === "closed_optout") agg.optouts++;
    if (r.promiseGiven) agg.promisesGiven++;
    if (r.promiseKept) agg.promisesKept++;
    const cause = kase.trueCause;
    agg.byCause[cause] ??= { total: 0, recovered: 0, amount: 0, recoveredAmount: 0 };
    agg.byCause[cause].total++;
    agg.byCause[cause].amount += kase.amount;
    if (r.recovered) {
      agg.recovered++;
      agg.recoveredAmount += r.recoveredAmount;
      agg.byCause[cause].recovered++;
      agg.byCause[cause].recoveredAmount += r.recoveredAmount;
    } else if (arm === "retry") {
      agg.exceptions.push({ id: kase.id, cause, amount: kase.amount, status: r.status });
    }
  }
  return agg;
}

// ── 6. Failure injection: malformed + duplicate webhooks ─────────────────────
// Proves the ingest path degrades gracefully instead of crashing.
function ingestWithFailures() {
  const seen = new Set();
  const raw = [
    { id: "evt_ok_1", amount: 45000, code: "BAD_REQUEST_INSUFFICIENT_FUNDS" },
    { id: "evt_ok_1", amount: 45000, code: "BAD_REQUEST_INSUFFICIENT_FUNDS" }, // duplicate
    { id: "evt_bad_1", amount: null, code: "GATEWAY_ERROR" },                   // missing amount
    { id: "evt_bad_2", amount: 12000 },                                         // missing code
    { id: "evt_bad_3", amount: "seventy", code: "???" },                        // junk amount
    { id: "evt_ok_2", amount: 99000, code: "GATEWAY_ERROR" },
  ];
  const res = { processed: 0, deduped: 0, needsReview: 0 };
  for (const e of raw) {
    try {
      if (seen.has(e.id)) { res.deduped++; continue; }        // idempotency via event id
      seen.add(e.id);
      if (typeof e.amount !== "number" || !e.code) { res.needsReview++; continue; } // route, don't crash
      res.processed++;
    } catch { res.needsReview++; }                            // never throw out of ingest
  }
  return res;
}

// ── 7. Reporting ─────────────────────────────────────────────────────────────
function diagnosisAccuracy(batch) {
  let correct = 0;
  for (const k of batch) if (diagnose(k) === k.trueCause) correct++;
  return correct / batch.length;
}

function main() {
  mkdirSync(OUT, { recursive: true });
  const batch = generateBatch();

  const auditRows = [];
  const audit = (caseId, actor, action, reasoning, meta = {}) =>
    auditRows.push({ ts: new Date().toISOString(), caseId, actor, action, reasoning, meta });

  const baseline = runArm("baseline", batch, () => {});
  const naive = runArm("naive_dunning", batch, () => {});
  const retry = runArm("retry", batch, audit);

  const diagAcc = diagnosisAccuracy(batch);
  const failures = ingestWithFailures();
  const contactsAvoided = naive.contacts - retry.contacts;
  const costPerRec = (a) => (a.recovered ? Math.round(a.costPaise / a.recovered) : 0);
  const lift = (retry.recoveredAmount / baseline.recoveredAmount);

  // ---- console report ----
  const L = console.log;
  L("\n══════════════════════════════════════════════════════════════════");
  L("  RETRY — Revenue Recovery, measured across a batch (SIMULATED)");
  L("══════════════════════════════════════════════════════════════════");
  L(`  Batch: ${batch.length} cases · ${N_MERCHANTS} merchants · amount at risk ${rupees(baseline.atRisk)}`);
  L(`  Failure mix: ` + FAILURE_MIX.map(([k, w]) => `${k} ${pct(w)}`).join(" · "));
  L(`  Diagnosis (rules) accuracy vs ground truth: ${pct(diagAcc)}`);

  L("\n  ── MONEY SLIDE ─────────────────────────────────────────────────");
  const row = (name, a) =>
    L(`  ${name.padEnd(16)}  recovered ${rupees(a.recoveredAmount).padStart(12)}  ` +
      `rate ${pct(a.recovered / a.cases).padStart(6)}  ` +
      `contacts ${String(a.contacts).padStart(3)}  ` +
      `cost/rec ${rupees(costPerRec(a)).padStart(7)}`);
  row("baseline", baseline);
  row("naive dunning", naive);
  row("RETRY", retry);
  L(`\n  ▸ Retry vs baseline recovered-₹ lift: ${lift.toFixed(2)}×`);
  L(`  ▸ Unnecessary customer contacts AVOIDED vs naive dunning: ${contactsAvoided} ` +
    `(${pct(contactsAvoided / naive.contacts)} fewer) — the diagnosis-first KPI`);
  L(`  ▸ Retry recovers ${rupees(retry.recoveredAmount)} vs naive ${rupees(naive.recoveredAmount)} ` +
    `while contacting ${pct(retry.contacts / naive.contacts)} as many people`);
  L(`  ▸ Promise-to-pay: ${retry.promisesGiven} captured, ${retry.promisesKept} kept ` +
    `(${pct(retry.promisesGiven ? retry.promisesKept / retry.promisesGiven : 0)} kept-rate)`);
  L(`  ▸ Opt-outs honored (Retry): ${retry.optouts}`);

  L("\n  ── Retry recovery by root cause ──────────────────────────────");
  for (const [cause, s] of Object.entries(retry.byCause)) {
    L(`  ${cause.padEnd(18)} ${String(s.recovered).padStart(2)}/${String(s.total).padEnd(2)} recovered  ` +
      `${rupees(s.recoveredAmount).padStart(11)} of ${rupees(s.amount)}`);
  }

  L("\n  ── HONEST exception list (top unrecovered by Retry) ──────────");
  const topEx = [...retry.exceptions].sort((a, b) => b.amount - a.amount).slice(0, 5);
  for (const e of topEx) L(`  ${e.id.padEnd(14)} ${e.cause.padEnd(18)} ${rupees(e.amount).padStart(9)}  ${e.status}`);
  L(`  … ${retry.exceptions.length} cases unresolved (${rupees(retry.exceptions.reduce((s, e) => s + e.amount, 0))} left on the table)`);

  L("\n  ── Failure injection (graceful degradation) ────────────────────");
  L(`  ingested ${failures.processed} · deduped ${failures.deduped} duplicate · ` +
    `routed ${failures.needsReview} malformed → needs_review · crashes 0`);

  L("\n  ── Audit log sample (agent reasoning) ──────────────────────────");
  for (const r of auditRows.slice(0, 4)) L(`  [${r.action}] ${r.caseId}: ${r.reasoning}`);
  L("");

  // ---- write artifacts ----
  writeFileSync(join(OUT, "results.json"), JSON.stringify(
    { generatedAt: new Date().toISOString(), simulated: true, seed: 20260830,
      batch: batch.length, diagnosisAccuracy: diagAcc, contactsAvoided, lift,
      arms: { baseline, naive_dunning: naive, retry } }, null, 2));

  writeFileSync(join(OUT, "audit_log.csv"),
    "ts,case_id,actor,action,reasoning\n" +
    auditRows.map((r) => `${r.ts},${r.caseId},${r.actor},${r.action},"${r.reasoning.replace(/"/g, "'")}"`).join("\n"));

  const money = `# Retry — money slide (simulated, seed 20260830, ${batch.length} cases)

| Policy | ₹ recovered | recovery rate | customer contacts | cost / recovery |
|---|---:|---:|---:|---:|
| Baseline (blind retries) | ${rupees(baseline.recoveredAmount)} | ${pct(baseline.recovered / baseline.cases)} | ${baseline.contacts} | ${rupees(costPerRec(baseline))} |
| Naive dunning (contact all) | ${rupees(naive.recoveredAmount)} | ${pct(naive.recovered / naive.cases)} | ${naive.contacts} | ${rupees(costPerRec(naive))} |
| **Retry (diagnose-first)** | **${rupees(retry.recoveredAmount)}** | **${pct(retry.recovered / retry.cases)}** | **${retry.contacts}** | **${rupees(costPerRec(retry))}** |

- **${lift.toFixed(2)}×** recovered-₹ vs baseline · amount at risk ${rupees(baseline.atRisk)}
- **${contactsAvoided} unnecessary contacts avoided** vs naive dunning (${pct(contactsAvoided / naive.contacts)} fewer) — recovers comparable ₹ while contacting ${pct(retry.contacts / naive.contacts)} as many people
- Promise-to-pay kept-rate: ${pct(retry.promisesGiven ? retry.promisesKept / retry.promisesGiven : 0)} · opt-outs honored: ${retry.optouts}
- Rules diagnosis accuracy: ${pct(diagAcc)} · ${retry.exceptions.length} cases left unresolved (honest exception list in results.json)
- Failure injection: ${failures.deduped} duplicate deduped, ${failures.needsReview} malformed routed to needs_review, 0 crashes

_Numbers are simulated via a documented recovery model (see RECOVERY_MODEL in runExperiment.mjs); live test-mode integrations recover a real payment link on camera._
`;
  writeFileSync(join(OUT, "money_slide.md"), money);
  L(`  wrote out/results.json, out/audit_log.csv, out/money_slide.md\n`);
}

main();
