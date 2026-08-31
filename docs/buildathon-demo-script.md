# Buildathon Demo Script

Follow this script to demonstrate the Retry platform end-to-end.

## 1. Landing Page
**Context:** Show the Reticle-inspired, evidence-first design. Point out the absence of generic SaaS elements. Explain the core philosophy: "Stop retrying blind."
**Action:** Click **"Open demo"** or **"View live recovery demo"** to enter the workspace.

## 2. Dashboard Overview
**Context:** Highlight the status bar showing "Demo Mode" and connections to Sarvam/Razorpay mock modes. Point out the aggregate metrics (Recovery Rate, Contacts Avoided, Recovered Revenue).
**Action:** Navigate to the **"Demo"** tab in the sidebar.

## 3. Trigger Scenarios (Demo Lab)
**Context:** This lab lets us inject deterministic synthetic events into the server-side state.

**Scenario A: Silent Checkout Abandonment**
1. Click **"Trigger Silent Checkout Drop"**.
2. Wait 2 seconds. The system detects a heartbeat timeout.
3. Switch to **"Cases"** to view the newly created case. It immediately queues a `payment_link_follow_up`.

**Scenario B: Insufficient Funds (Telugu Voice Call)**
1. Click **"Trigger Insufficient Funds"**.
2. Switch to **"Cases"**. Click into the new case.
3. See that a Sarvam voice call in Telugu (`TE-IN`) is queued because the cart value exceeds the threshold.

**Scenario C: Bank Downtime Suppression**
1. Click **"Trigger Bank Downtime"**.
2. Open the case detail. Note the `guardrail.checked` event and the case state: `awaiting_downtime_resolution`.
3. Go back to Demo Lab, click **"Resolve Downtime"**. 
4. Check the case again; it transitions to `intervention_scheduled`.

## 4. Sarvam Outcomes & Links
**Context:** Demonstrate deterministic outcomes.
1. In Demo Lab, click **"Simulate Sarvam Failure"**.
2. Look at a pending voice case. It transitions to `sarvam.call_failed -> manual_payment_link_follow_up_required` and generates a secure link.

## 5. End of Demo
**Context:** Return to Analytics. Point out how these simulated scenarios have updated the global metrics synchronously without isolated React state tricks.
