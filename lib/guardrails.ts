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
  currentInterventionCount: number = 0,
  merchantPolicies: any = {}
): GuardrailDecision {
  const reasons: string[] = [];

  // 1. Opt-out
  if (customer.do_not_contact) {
    reasons.push("Customer has opted out of communications.");
  }

  // 1.5 Recovery Delay (Cool-off)
  const now = new Date();
  if (recoveryCase.opened_at) {
    const openedAt = new Date(recoveryCase.opened_at);
    const diffMinutes = (now.getTime() - openedAt.getTime()) / (1000 * 60);
    const coolOffMinutes = parseInt(merchantPolicies.delayMinutes || '15', 10);
    
    if (diffMinutes < coolOffMinutes) {
      reasons.push(`In recovery cool-off period. Please wait ${Math.ceil(coolOffMinutes - diffMinutes)} more minutes before initiating contact.`);
    }
  }

  // 2. Quiet hours
  const utcHour = now.getUTCHours();
  const utcMin = now.getUTCMinutes();
  const istTime = (utcHour + 5) + (utcMin + 30) / 60; 
  const istHour = istTime >= 24 ? istTime - 24 : istTime;
  
  const startTimeStr = merchantPolicies.startTime || '09:00';
  const endTimeStr = merchantPolicies.endTime || '21:00';
  const startHour = parseInt(startTimeStr.split(':')[0], 10);
  const endHour = parseInt(endTimeStr.split(':')[0], 10);
  
  // Check if current time is outside the contact window
  const isQuietHours = endHour > startHour 
    ? (istHour < startHour || istHour >= endHour)
    : (istHour >= endHour && istHour < startHour); // Handles overnight windows if needed
    
  if (isQuietHours) {
    reasons.push(`Outside permitted contact window (${startTimeStr} - ${endTimeStr} IST).`);
  }

  // 3. Amount Threshold
  if (recoveryCase.amount < merchantVoiceThresholdPaise) {
    reasons.push(`Amount at risk (₹${recoveryCase.amount / 100}) is below merchant voice threshold (₹${merchantVoiceThresholdPaise / 100}).`);
  }

  // 4. Attempts
  const maxAttemptsStr = merchantPolicies.maxAttempts || '2';
  const maxAttempts = parseInt(maxAttemptsStr.replace(/\D/g, ''), 10) || 2;
  if (currentInterventionCount >= maxAttempts) {
    reasons.push(`Maximum voice call attempts (${maxAttempts}) reached.`);
  }

  // 5. Case State
  const invalidStates = ['recovered', 'closed_optout', 'closed_lost', 'escalated'];
  if (invalidStates.includes(recoveryCase.status)) {
    reasons.push(`Case is in an invalid state for voice contact: ${recoveryCase.status}.`);
  }

  // 6. Bank downtime
  // Default to true if not explicitly set
  const suppressDowntime = merchantPolicies.suppressDowntime !== false;
  if (recoveryCase.root_cause === 'bank_downtime' && suppressDowntime) {
    reasons.push("Bank downtime cases are not eligible for voice calls to prevent frustration.");
  }

  return {
    allowed: reasons.length === 0,
    reasons
  };
}
