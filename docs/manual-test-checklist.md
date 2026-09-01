# Manual Test Checklist

Use this checklist to verify application logic through the Demo Lab and UI manually.

## Scenarios

### 1. Bank Downtime Suppression
- **Action:** Click "Trigger Bank Downtime" in Demo Lab.
- **Expected State:** 
  - Case state moves to `awaiting_downtime_resolution`.
  - Audit log confirms: `downtime_suppression`.
  - Global metrics: Contacts Avoided increases by 1.
- **Action:** Click "Resolve Downtime".
- **Expected State:**
  - Case state moves to `intervention_scheduled`.
  - Audit log confirms: `retry_scheduled`.

### 2. Insufficient Funds (Voice Call)
- **Action:** Click "Trigger Insufficient Funds".
- **Expected State:**
  - Audit log confirms `policy.decided` and assigns Telugu voice call.
  - Intervention `voice_call` is queued.
  - Guardrails pass (if cart >= ₹500, not DND, within quiet hours).

### 3. Silent Checkout Abandonment
- **Action:** Click "Trigger Silent Checkout Drop".
- **Expected State:**
  - `checkout.abandoned` event logged.
  - Case state updates correctly to `contacting` (payment link).
  - Payment link generated in UI.

### 4. Sarvam Provider Failure
- **Action:** Click "Simulate Sarvam Failure".
- **Expected State:**
  - `sarvam.call_failed` event fires.
  - Fallback creates a Payment Link and updates the UI state to `manual_payment_link_follow_up_required`.

### 5. Customer Promise to Pay
- **Action:** Click "Simulate Promise-to-Pay".
- **Expected State:**
  - `sarvam.promise_to_pay` fires.
  - Case status moves to `promise_logged`.

### 6. Opt-out / DND
- **Action:** Click "Simulate Opt-out (DND)".
- **Expected State:**
  - Case status moves to `closed_optout`.
  - All automations stop.

### 7. Recovery Success
- **Action:** Click "Simulate Link Paid".
- **Expected State:**
  - Case status moves to `recovered`.
  - Global "Recovery Rate" and "Recovered Revenue" increase.
  - Idempotent (clicking again does not double-count).
