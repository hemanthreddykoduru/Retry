import { RecoveryCase, Customer } from './demo-data';

export interface GuardrailDecision {
  allowed: boolean;
  reasons: string[];
  nextAllowedAt?: Date;
}

export function checkVoiceGuardrails(
  recoveryCase: RecoveryCase, 
  customer: Customer, 
  merchantVoiceThresholdPaise: number = 50000, 
  currentInterventionCount: number = 0
): GuardrailDecision {
  const reasons: string[] = [];

  // 1. Opt-out
  if (customer.do_not_contact) {
    reasons.push("Customer has opted out of communications.");
  }

  // 2. Quiet hours (09:00 - 21:00 IST)
  const now = new Date();
  // Using generic UTC to IST offset for pure testable function logic (5.5 hours)
  const utcHour = now.getUTCHours();
  const utcMin = now.getUTCMinutes();
  const istTime = (utcHour + 5) + (utcMin + 30) / 60; 
  // Normalize to 0-24
  const istHour = istTime >= 24 ? istTime - 24 : istTime;
  
  if (istHour < 9 || istHour >= 21) {
    reasons.push("Outside permitted contact window (09:00 - 21:00 IST).");
  }

  // 3. Amount Threshold
  if (recoveryCase.amount < merchantVoiceThresholdPaise) {
    reasons.push(`Amount at risk (₹${recoveryCase.amount / 100}) is below merchant voice threshold (₹${merchantVoiceThresholdPaise / 100}).`);
  }

  // 4. Attempts
  if (currentInterventionCount >= 2) {
    reasons.push("Maximum voice call attempts (2) reached.");
  }

  // 5. Case State
  const invalidStates = ['recovered', 'closed_optout', 'closed_lost', 'escalated'];
  if (invalidStates.includes(recoveryCase.status)) {
    reasons.push(`Case is in an invalid state for voice contact: ${recoveryCase.status}.`);
  }

  // 6. Bank downtime
  if (recoveryCase.root_cause === 'bank_downtime') {
    reasons.push("Bank downtime cases are not eligible for voice calls to prevent frustration.");
  }

  return {
    allowed: reasons.length === 0,
    reasons
  };
}
