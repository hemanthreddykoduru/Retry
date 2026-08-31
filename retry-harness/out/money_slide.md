# Retry — money slide (simulated, seed 20260830, 105 cases)

| Policy | ₹ recovered | recovery rate | customer contacts | cost / recovery |
|---|---:|---:|---:|---:|
| Baseline (blind retries) | ₹74,184 | 32.4% | 0 | ₹0 |
| Naive dunning (contact all) | ₹93,201 | 42.9% | 105 | ₹1 |
| **Retry (diagnose-first)** | **₹1,12,929** | **61.0%** | **71** | **₹1** |

- **1.52×** recovered-₹ vs baseline · amount at risk ₹2,01,765
- **34 unnecessary contacts avoided** vs naive dunning (32.4% fewer) — recovers comparable ₹ while contacting 67.6% as many people
- Promise-to-pay kept-rate: 71.4% · opt-outs honored: 1
- Rules diagnosis accuracy: 90.5% · 41 cases left unresolved (honest exception list in results.json)
- Failure injection: 1 duplicate deduped, 3 malformed routed to needs_review, 0 crashes

_Numbers are simulated via a documented recovery model (see RECOVERY_MODEL in runExperiment.mjs); live test-mode integrations recover a real payment link on camera._
