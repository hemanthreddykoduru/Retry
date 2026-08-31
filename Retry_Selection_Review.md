# Retry — Selection Review & De‑risked Plan
*Track 03: AI Revenue Recovery · reviewed against the Buildathon's four criteria: problem taste, build quality, AI judgment, failure recovery.*

---

## Verdict in one paragraph

Retry is a **selectable idea on the right track**. The concept — diagnose before you contact, recover in the customer's language, and measure every rupee — lines up almost exactly with what Track 03 says it rewards. Your problem taste is already strong; the landscape gap is real and you can articulate it. **The thing that will decide selection is not the idea — it's whether a solo builder can ship a *working, measured, gracefully-failing* system in six days without the demo collapsing under its own scope.** Everything below is about protecting that outcome.

The single most important move: **build the deterministic core + the measurement harness first, so you have a submittable project by Wednesday. Treat live WhatsApp and live voice as enhancements layered on top of a project that already scores.**

---

## What will get Retry selected (lean into these)

1. **The money slide.** Track 03's bar is literally "measured money recovered across a batch." A clean baseline‑vs‑agent number on 100+ cases, with an honest exception list, is your highest‑scoring asset. Judges said "one cherry‑picked match proves nothing" — so a *batch* with a documented model beats any single live recovery.
2. **Diagnosis‑before‑contact as the headline.** "I never call a customer when it was the bank's fault" is a crisp, memorable, *defensible* differentiator. It also demonstrates AI/engineering judgment — you're choosing *not* to act, which most dunning tools can't.
3. **Guardrails you can show on camera.** Opt‑out stops everything, quiet‑hours clamp, max‑2‑calls, escalation after two failures, HMAC on every webhook. This is the "bounded, gated, auditable" language the rubric uses. Demo one of these live.
4. **Vernacular voice.** A real Telugu call is a genuine wow and matches a stated wanted direction. Keep it — but see the risk section: record it early and don't let it become a single point of failure.
5. **The audit trail.** A per‑action log with the agent's *reasoning* is exactly what "explainable" means to them. Make it judge‑facing and readable.

## What will sink it (fix these before writing feature code)

1. **Scope. This is a 3‑week team build compressed into 6 solo days.** WhatsApp template approval, Sarvam number rental, JS heartbeat snippet, downtime correlation, policy engine, Next.js realtime dashboard, measurement harness. If you build breadth‑first, you'll have eight things at 60% on Sep 4 — and the rubric explicitly prefers one well‑executed thing over a half‑built ambitious one. **Cut to a protected core (below).**
2. **External dependencies on the critical path.** WhatsApp utility‑template approval can take 24–48h *and can be rejected*; Sarvam number rental + credits + a real outbound call for the video is a chain of things that can each fail on demo day. **De‑risk: submit the template today, but make your money slide and your core demo work even if WhatsApp/Sarvam are down.**
3. **Attribution hand‑waving.** If "would this have recovered?" is a vibe, a sharp panelist will dismantle it. You need a *documented* recovery‑probability model (per root‑cause × intervention), stated as simulated, with a sensitivity check. Honesty here is a feature, not a weakness — it shows you understand measurement.

---

## Re‑sequenced plan: "submittable by Wednesday"

Your spec's day plan is good but back‑loads the highest‑scoring work (measurement = Day 4) behind the riskiest work (live integrations). Flip it. Build inside‑out.

| Day | Protected‑core focus (must exist) | Enhancement (only if core is done) |
|---|---|---|
| **Sun Aug 30** | Repo + schema migrated. **Synthetic failure generator (100+ cases, India mix) + ground‑truth recoverability.** Webhook endpoint + HMAC verify + idempotency. *Submit WhatsApp template + request Sarvam number now (async, off critical path).* | — |
| **Mon Aug 31** | **Rules diagnosis (decline code + downtime → root_cause). Bounded policy engine with all guardrails in code.** | JS heartbeat snippet (or simulate abandonment in the batch) |
| **Tue Sep 1** | **Measurement harness: baseline vs naive‑dunning vs Retry over the batch → money slide + exception list + audit log.** ⬅ *After today you already have a submittable project.* | Real Razorpay test payment‑link + `payment_link.paid` attribution loop |
| **Wed Sep 2** | Minimal dashboard reading the harness output (recovered ₹, funnel, reasons, audit feed). | Live WhatsApp send on the happy path |
| **Thu Sep 3** | Failure‑path polish + one failure handled on camera. Tighten the exception list and cost model. | **Sarvam Telugu call — record the take today**, not on deadline day |
| **Fri Sep 4** | README + architecture diagram + metrics. **Record 5‑min video. SUBMIT tonight.** | Re‑record with live voice if it's solid |
| **Sat Sep 5** | Buffer only. Never submit at the deadline hour. | — |

The rule: **if a day slips, you cut the enhancement, never the core.** By Tuesday night the project scores on all four criteria even if no external API ever fires live.

---

## Protected core vs nice‑to‑have

**Must ship (the project scores without these being live):**
- Synthetic batch generator with ground truth
- Rules‑based diagnosis (root_cause classifier)
- Bounded/gated policy engine + guardrails in code
- Measurement harness → money slide + honest exception list + audit log
- README with the landscape table, architecture diagram, metrics, and a failure story
- 5‑minute video

**Nice‑to‑have (layer on only after the core is done, each independently droppable):**
- Live WhatsApp Cloud API send (fallback: show the queued message + template, note approval status)
- Live Sarvam Telugu call (fallback: a pre‑recorded call clip, clearly labelled)
- Live JS heartbeat snippet on a real checkout (fallback: abandonment simulated in the batch)
- Realtime dashboard (fallback: dashboard renders from a static harness‑output JSON)

Design so each nice‑to‑have degrades to a fallback that still tells the story. That is your insurance policy against demo‑day failure.

---

## The AI‑judgment story (a scored criterion — make it explicit)

The rubric marks you *down* for forcing an LLM where rules are better, and *up* for using AI where it genuinely adds value. Retry has a clean answer — say it out loud in the README and the panel:

- **Deterministic rules (no LLM):** decline‑code → root_cause mapping, downtime correlation, the entire policy/guardrail engine, retry scheduling, attribution matching by `reference_id`. *These must be exact, testable, and auditable — an LLM would only add nondeterminism and risk.*
- **AI where it earns its place:** the open‑ended **voice conversation** (real NLU across Telugu/Hindi/English — impossible with rules), and **transcript → structured outcome** extraction (promise‑to‑pay, objection type, callback time from messy free speech). Optionally, drafting the WhatsApp copy in the right tone/language.
- **The line you deliver:** "Money math and policy are deterministic and audited; AI is confined to the natural‑language surface where it's the only thing that works." That single sentence wins the AI‑judgment criterion.

---

## Attribution honesty (protect your credibility)

Your baseline‑vs‑agent lift must be built on a model you can defend, and you must **label the numbers as simulated** in the video and README. Do this and it's a strength; hide it and a panelist will catch it.

- Define, per root_cause, a recovery probability under three arms — **baseline** (blind retries, no contact), **naive dunning** (contact everyone immediately), and **Retry** (diagnose‑first, matched intervention). Document the numbers and their rationale (e.g., bank‑downtime cases largely self‑resolve once the bank recovers, so contacting them is wasted spend and annoyance).
- Report a **sensitivity band**: "even if my recovery assumptions are 20% too optimistic, Retry still beats naive dunning on cost‑per‑recovery." That sentence signals maturity.
- Headline the KPI nobody else has: **unnecessary customer contacts avoided** (Retry recovers ≈ as much as naive dunning while contacting far fewer people, because it skips self‑resolving downtime cases).

The included harness (`retry-harness/`) implements exactly this three‑arm model so you have real, reproducible numbers today.

---

## Failure recovery checklist (a scored criterion — cover on camera)

Show at least one of these handled gracefully, and list the rest in the README:

- Malformed / unparseable webhook payload → routed to a `needs_review` sink, pipeline keeps running.
- Duplicate webhook (`razorpay_event_id` unique) → deduped, no double‑case, no double‑charge.
- Unknown / unmapped decline code → `root_cause = unknown` → safe default (ask via call), never crash.
- WhatsApp send failure or template not yet approved → fall back to retry‑only, log and continue.
- Sarvam call timeout / no‑answer → `attempt_count + 1` up to the cap, then escalate.
- Payment‑link creation failure (30‑link test cap) → lazy creation + per‑case cache, graceful error.
- HMAC signature mismatch → reject the webhook, audit the rejection.

---

## Panel interview defense (rehearse these)

- **"Are these numbers real?"** → "They're simulated on a 100+ case synthetic batch with an India failure mix; here's the recovery model per root‑cause and a sensitivity band. The live integrations are wired on test‑mode APIs — this recovered a real test payment link on camera."
- **"Why not just contact everyone like existing dunning tools?"** → contacts‑avoided KPI + the downtime self‑resolution argument + cost per recovery.
- **"Where's the AI, and why isn't it doing more?"** → the deterministic‑vs‑NLU boundary above; forcing an LLM onto policy would break auditability.
- **"What happens when it breaks?"** → walk the failure checklist and show the audit log.
- **"Is automated voice calling compliant?"** → merchant has an existing customer relationship; quiet‑hours clamp; instant opt‑out honored and persisted; max‑2‑calls; escalation to human. Note TRAI/DND as a real constraint you designed around.
- **"What would you build next at Razorpay?"** → Track‑2 crossover (`payment.dispute.created` chargeback evidence), more rails, telephony hardening.

---

## Small corrections / notes on the spec

- **Test‑mode downtime webhooks:** you likely can't organically trigger `payment.downtime.*` in test mode — drive the batch by **POSTing your own HMAC‑signed webhook payloads** to your endpoint. That's the right approach anyway and keeps the harness independent of Razorpay uptime.
- **WhatsApp Cloud API test tier** caps recipients (a handful of verified test numbers) and needs template approval — fine for a demo, but state it and keep the retry‑only fallback.
- **Keep secrets out of the repo** (`razorpay_key_secret`, webhook secrets) — use env vars; judges look at repo hygiene under "build quality."
- **Move the money slide earlier than Day 4.** It's your highest‑scoring artifact; it should exist by Tuesday.

---

## Bottom line

You don't need a bigger idea — you need to **guarantee the core lands.** Build the harness and the deterministic engine first (I've given you a running head start on the harness), keep live WhatsApp/voice as recordable enhancements, be honest that the batch is simulated, and lead every asset with the money slide and the diagnosis‑before‑contact story. Do that and Retry is a strong bet to get the call.
