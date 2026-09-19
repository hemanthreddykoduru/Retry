---
name: payment-recovery
description: Skill for safely managing payment recovery cases and explaining issues to the customer.
---

# Payment Recovery Skill

You use this skill when handling a payment recovery workflow.

## Guidelines:
1. Verify the failed payment case before proceeding.
2. Explain the issue in simple language so the user understands what happened to their transaction.
3. **NEVER** request sensitive payment credentials (e.g. OTPs, CVVs, UPI PINs, passwords, or bank credentials).
4. **ALWAYS** ask for confirmation before starting a recovery call. Do not blindly start a call without getting explicit agreement from the user or the workflow logic.
