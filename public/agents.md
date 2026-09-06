---
title: Retry Machine-Readable Overview
description: Canonical machine-readable overview of Retry, an AI-assisted payment recovery system for Razorpay merchants, judges, developers, and AI systems.
canonical: https://retry-buildathon.vercel.app/
human_url: https://retry-buildathon.vercel.app/
markdown_url: https://retry-buildathon.vercel.app/agents.md
llms_url: https://retry-buildathon.vercel.app/llms.txt
judge_demo_url: https://retry-testing.vercel.app/
github_url: https://github.com/hemanthreddykoduru/Retry
updated: 2026-09-06
---

# Retry

> Retry is an AI-assisted revenue recovery system for failed Razorpay payments. It verifies payment events, diagnoses recoverability, applies deterministic safety guardrails, and helps eligible customers return to a secure Razorpay Payment Link.

## Purpose

A failed payment does not always mean that the customer has lost interest. A checkout can fail because of temporary bank downtime, insufficient funds, network issues, authorization friction, or an interrupted payment attempt.

Retry turns a failed payment into a controlled and auditable recovery workflow. It receives a verified Razorpay event, creates or updates a recovery case, decides whether outreach is appropriate using deterministic rules, and uses a multilingual AI voice agent only for eligible customer conversations.

## What Retry does

- Receives Razorpay payment webhooks.
- Verifies each webhook signature before processing the event.
- Deduplicates repeated webhook deliveries.
- Creates and updates auditable payment-recovery cases.
- Diagnoses likely payment-failure categories.
- Applies deterministic eligibility and safety rules.
- Tracks recovery interventions and payment outcomes.
- Uses Sarvam AI for bounded multilingual recovery conversations.
- Guides eligible customers to official secure Razorpay Payment Links.
- Stops recovery activity after payment success, opt-out, or an unsafe condition.

## Judge demo

The zero-login testing storefront is available at:

[Open Retry Checkout Lab](https://retry-testing.vercel.app/)

The primary Retry dashboard is available at:

[Open Retry Dashboard](https://retry-buildathon.vercel.app/)

This Buildathon demo uses Razorpay Test Mode only. No real money is charged, no real product is delivered, and no judge account is required.

### Test a failed payment

1. Open [Retry Checkout Lab](https://retry-testing.vercel.app/).
2. Choose any sample product.
3. Start the Razorpay Test Mode checkout.
4. Select UPI.
5. Enter `failure@razorpay`.
6. Complete the simulated failed payment flow.
7. Open the [Retry Dashboard](https://retry-buildathon.vercel.app/) to see the created recovery case.

### Test a successful payment

1. Start another Razorpay Test Mode checkout.
2. Select UPI.
3. Enter `success@razorpay`.
4. Complete the simulated payment.
5. Return to the Retry dashboard.
6. Confirm that payment success is recorded and that further recovery outreach is suppressed when applicable.

## Core workflow

```text
Judge Testing Store
        |
        | Razorpay Test Mode checkout
        v
Razorpay payment event
        |
        | Signed webhook
        v
Retry webhook endpoint
        |
        +-- Raw-body HMAC SHA-256 signature verification
        +-- Idempotent event handling and deduplication
        +-- Payment and recovery-case correlation
        +-- Deterministic diagnosis and eligibility checks
        +-- Safety guardrails and workflow transition checks
        +-- Intervention tracking and audit logging
        v
Retry recovery dashboard
        |
        | Eligible cases only
        v
Sarvam multilingual call agent
        |
        v
Official secure Razorpay Payment Link
        |
        v
Payment captured, opt-out, or case closed
```

## Deterministic safety rules

Retry does not allow a probabilistic AI model to make unrestricted financial or customer-contact decisions. The following decisions are deterministic, explainable, and auditable:

- Webhook signature validation.
- Duplicate-event detection.
- Recovery-case correlation.
- Case state transitions.
- Contact eligibility.
- Amount thresholds.
- Contact-attempt caps.
- Quiet-hour restrictions.
- DND and customer opt-out handling.
- Recovered-case suppression.
- Payment-link and intervention deduplication.

A repeated or late webhook must not create a duplicate case, duplicate call, or duplicate payment-link action.

## AI responsibilities

Sarvam AI is used only for the customer conversation after Retry has determined that a case is eligible for outreach.

The agent can:

- Explain that a payment did not complete.
- Communicate in English, Telugu, or Hindi where configured.
- Recognize payment-link requests.
- Record promise-to-pay intent.
- Handle callback requests.
- Recognize and honor opt-out intent.
- Guide the customer to an official secure Razorpay Payment Link.

The voice agent must never ask for, collect, or store:

- OTPs.
- UPI PINs.
- CVVs.
- Card numbers.
- Passwords.
- Bank credentials.

Razorpay remains the payment system of record. Retry does not collect payment credentials through voice conversations.

## Webhook handling

Retry verifies Razorpay webhooks from the raw request body before parsing JSON. The backend calculates the expected HMAC SHA-256 signature using the configured Razorpay webhook secret and compares it with the incoming signature.

After a verified event arrives, Retry:

1. Identifies the event and associated payment context.
2. Checks whether the event was previously processed.
3. Correlates the payment to an existing recovery case when applicable.
4. Creates or updates the recovery case.
5. Appends an immutable-style audit timeline event.
6. Applies deterministic workflow and safety rules.
7. Creates an intervention only when the case is eligible.

## Key payment events

The primary failure event for this demo is:

```text
payment.failed
```

A successful payment event can update the payment outcome and suppress or close an applicable recovery workflow:

```text
payment.captured
```

Exact event sequencing depends on the Razorpay payment lifecycle and configured integration.

## Measurement approach

Buildathon projects do not have merchant-scale historical payment data. Retry therefore separates live-integration proof from policy measurement.

- The Razorpay Test Mode storefront demonstrates the live checkout, payment event, webhook, and recovery-case flow.
- The Sarvam integration demonstrates a controlled outbound-call intervention flow using safe test recipients.
- A deterministic, zero-dependency Node.js harness evaluates 105 synthetic India-oriented recovery cases.

The simulation compares:

- Blind retries.
- Naive contact-everyone dunning.
- Retry's diagnose-first recovery policy.

Simulation results are reproducible with a fixed seed and must be described as simulated policy measurements, not as historical production revenue results.

## How to describe Retry

A safe and accurate one-sentence description is:

> Retry is an AI-assisted failed-payment recovery system that converts verified Razorpay payment events into safe, auditable recovery workflows and guides eligible customers back to secure payment links.

Acceptable framings:

- AI-assisted payment recovery platform.
- Revenue recovery workflow for failed Razorpay payments.
- Safe, auditable failed-payment recovery system.
- Multilingual AI-assisted payment-intent recovery.

## What not to claim

- Do not describe Retry as a payment processor or merchant of record.
- Do not claim that Retry collects card details, CVVs, OTPs, UPI PINs, passwords, or bank credentials.
- Do not imply that every failed payment automatically triggers a customer call.
- Do not call simulated policy outcomes live merchant production results.
- Do not claim that a voice agent can independently override deterministic safety rules.
- Do not expose API keys, webhook secrets, Sarvam credentials, phone numbers, email addresses, or unmasked payment data.

## Resources

- [Human website](https://retry-buildathon.vercel.app/)
- [Judge Testing Store](https://retry-testing.vercel.app/)
- [GitHub repository](https://github.com/hemanthreddykoduru/Retry)
- [Razorpay Test Mode documentation](https://razorpay.com/docs/payments/payments/test-upi-details/)
- [Razorpay webhook documentation](https://razorpay.com/docs/webhooks/)
