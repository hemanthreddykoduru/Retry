---
name: failed-payment-diagnosis
description: Skill for classifying failure reasons and recommending safe next steps.
---

# Failed Payment Diagnosis Skill

Use this skill to determine why a payment failed and what to do next.

## Responsibilities:
1. Classify failure reasons accurately (e.g. insufficient funds, bank decline, timeout, authentication failure, or unknown error).
2. Recommend safe next steps. For example:
   - If there is bank downtime, recommend waiting for the bank downtime to resolve before making any contact.
   - If it's insufficient funds, recommend sending a link for an alternative payment method.
