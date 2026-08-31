# Evaluation Methodology

Retry is designed to act on a test-mode data batch to evaluate the effectiveness of the state machine, webhook processing, and simulated Sarvam voice interactions.

## Synthetic Data Batch
- **Volume:** 100 simulated test-mode recovery cases.
- **Amounts:** Handled natively in paise. ₹899 (89900 paise) up to ₹4,999 (499900 paise).
- **Distributions:**
  - 35% Bank downtime (No contact, auto-retry)
  - 25% Insufficient funds (Payment link / voice call threshold based)
  - 20% PIN/OTP failure (Voice call)
  - 15% Network drop-off (Payment link immediately)
  - 5% Unknown (Human escalation)

## Constraints Tested
1. **DND / Opt-Outs:** Cases flagged as `do_not_contact` or opting out during a voice call immediately transition to `closed_optout` and halt all scheduled interventions.
2. **Quiet Hours:** Mock configuration prevents automated outbound engagement during 21:00 to 09:00 IST.
3. **Cart Thresholds:** Only payments > ₹500 trigger a live Sarvam call; everything else routes to deterministic payment links.
4. **Call Caps:** Max 2 attempts.

## Metrics Extracted
- **Recovery Rate:** Percentage of captured intents relative to failures.
- **Contacts Avoided:** Cases actively suppressed from automation (e.g., bank downtime).
- **Amount Recovered:** Total test-mode paise captured through fallback links.
