export type RootCause = 'bank_downtime' | 'insufficient_funds' | 'auth_failure' | 'network_drop' | 'limit_exceeded' | 'customer_intent' | 'unknown';
export type CaseStatus = 'open' | 'diagnosing' | 'awaiting_downtime_resolution' | 'intervention_scheduled' | 'contacting' | 'promise_logged' | 'recovered' | 'escalated' | 'closed_lost' | 'closed_optout';

export interface ReceiptEvent {
  id: string;
  time: string;
  event: string;
  amount: number;
  detail: string;
  state: CaseStatus;
}

export interface Customer {
  id: string;
  merchant_id: string;
  name: string | null;
  phone: string;
  preferred_language: 'te' | 'hi' | 'en';
  do_not_contact: boolean;
  created_at: string;
}

export interface AuditLog {
  id: number;
  recovery_case_id: string;
  actor: 'agent' | 'system' | 'human';
  action: string;
  reasoning: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Intervention {
  id: string;
  recovery_case_id: string;
  type: "smart_retry" | "whatsapp_nudge" | "payment_link_follow_up" | "email_nudge" | "human_escalation" | "voice_call";
  status: 'queued' | 'sent' | 'delivered' | 'answered' | 'completed' | 'failed' | 'skipped';
  scheduled_for: string;
  executed_at: string | null;
  outcome: string | null;
}

export interface RecoveryCase {
  id: string;
  merchant_id: string;
  customer_id: string;
  checkout_session_id: string | null;
  trigger_source: 'payment_failed_webhook' | 'snippet_timeout' | 'uncaptured_auth';
  failure_code: string | null;
  failure_reason: string | null;
  root_cause: RootCause;
  amount: number;
  status: CaseStatus;
  attempt_count: number;
  max_attempts: number;
  razorpay_payment_link_id: string | null;
  recovered_amount: number | null;
  opened_at: string;
  closed_at: string | null;

  // Populated relations for UI convenience
  customer?: Customer;
  audit_logs?: AuditLog[];
  interventions?: Intervention[];
}

export const mockCustomers: Customer[] = [
  { id: "cus_1", merchant_id: "m_1", name: "Rahul S.", phone: "+919876543210", preferred_language: "hi", do_not_contact: false, created_at: "2026-08-30T10:00:00Z" },
  { id: "cus_2", merchant_id: "m_1", name: "Priya M.", phone: "+919876543211", preferred_language: "en", do_not_contact: false, created_at: "2026-08-30T11:00:00Z" },
  { id: "cus_3", merchant_id: "m_1", name: "Kiran V.", phone: "+919876543212", preferred_language: "te", do_not_contact: false, created_at: "2026-08-30T12:00:00Z" }
];

export const mockCases: RecoveryCase[] = [
  {
    id: "rc_1a2b3c",
    merchant_id: "m_1",
    customer_id: "cus_1",
    checkout_session_id: "cs_1",
    trigger_source: "payment_failed_webhook",
    failure_code: "BAD_REQUEST_ERROR",
    failure_reason: "Issuer bank is down",
    root_cause: "bank_downtime",
    amount: 149900,
    status: "recovered",
    attempt_count: 1,
    max_attempts: 3,
    razorpay_payment_link_id: null,
    recovered_amount: 149900,
    opened_at: "2026-08-31T10:42:18Z",
    closed_at: "2026-08-31T11:06:11Z",
    customer: mockCustomers[0],
    audit_logs: [
      { id: 1, recovery_case_id: "rc_1a2b3c", actor: "system", action: "payment.failed", reasoning: "Webhook received from Razorpay: BAD_REQUEST_ERROR", metadata: {}, created_at: "2026-08-31T10:42:18Z" },
      { id: 2, recovery_case_id: "rc_1a2b3c", actor: "agent", action: "guardrail.checked", reasoning: "Detected active downtime for issuer bank (HDFC). Action suppressed to avoid customer frustration.", metadata: {}, created_at: "2026-08-31T10:42:19Z" },
      { id: 3, recovery_case_id: "rc_1a2b3c", actor: "system", action: "downtime.resolved", reasoning: "Bank downtime resolved. Scheduled smart retry.", metadata: {}, created_at: "2026-08-31T10:57:04Z" },
      { id: 4, recovery_case_id: "rc_1a2b3c", actor: "agent", action: "payment.captured", reasoning: "Payment successfully captured in the background. Revenue recovered without human contact.", metadata: {}, created_at: "2026-08-31T11:06:11Z" }
    ],
    interventions: [
      { id: "int_1", recovery_case_id: "rc_1a2b3c", type: "smart_retry", status: "completed", scheduled_for: "2026-08-31T11:05:00Z", executed_at: "2026-08-31T11:05:30Z", outcome: "captured" }
    ]
  },
  {
    id: "rc_2d3e4f",
    merchant_id: "m_1",
    customer_id: "cus_2",
    checkout_session_id: "cs_2",
    trigger_source: "snippet_timeout",
    failure_code: null,
    failure_reason: null,
    root_cause: "network_drop",
    amount: 89900,
    status: "contacting",
    attempt_count: 1,
    max_attempts: 3,
    razorpay_payment_link_id: "plink_123",
    recovered_amount: null,
    opened_at: "2026-08-31T14:21:08Z",
    closed_at: null,
    customer: mockCustomers[1],
    audit_logs: [
      { id: 5, recovery_case_id: "rc_2d3e4f", actor: "system", action: "checkout.abandoned", reasoning: "No heartbeat for 10m", metadata: {}, created_at: "2026-08-31T14:21:08Z" },
      { id: 6, recovery_case_id: "rc_2d3e4f", actor: "agent", action: "policy.decided", reasoning: "Network drop detected. Selected WhatsApp nudge since intent is still fresh.", metadata: {}, created_at: "2026-08-31T14:21:09Z" },
      { id: 7, recovery_case_id: "rc_2d3e4f", actor: "system", action: "payment_link.created", reasoning: "Created Razorpay payment link", metadata: { link: "plink_123" }, created_at: "2026-08-31T14:21:10Z" }
    ],
    interventions: [
      { id: "int_2", recovery_case_id: "rc_2d3e4f", type: "payment_link_follow_up", status: "delivered", scheduled_for: "2026-08-31T14:21:10Z", executed_at: "2026-08-31T14:21:12Z", outcome: null }
    ]
  },
  {
    id: "rc_c931",
    merchant_id: "m_1",
    customer_id: "cus_3",
    checkout_session_id: "cs_3",
    trigger_source: "payment_failed_webhook",
    failure_code: "INSUFFICIENT_FUNDS",
    failure_reason: "Insufficient balance",
    root_cause: "insufficient_funds",
    amount: 199900,
    status: "promise_logged",
    attempt_count: 1,
    max_attempts: 3,
    razorpay_payment_link_id: null,
    recovered_amount: null,
    opened_at: "2026-08-31T15:11:22Z",
    closed_at: null,
    customer: { ...mockCustomers[2], name: "Srilatha P.", phone: "+919876541207" },
    audit_logs: [
      { id: 8, recovery_case_id: "rc_c931", actor: "system", action: "payment.failed", reasoning: "Webhook received: INSUFFICIENT_FUNDS", metadata: {}, created_at: "2026-08-31T15:11:22Z" },
      { id: 9, recovery_case_id: "rc_c931", actor: "agent", action: "policy.decided", reasoning: "Telugu voice call selected because cart is ≥ ₹500.", metadata: {}, created_at: "2026-08-31T15:11:23Z" },
      { id: 10, recovery_case_id: "rc_c931", actor: "agent", action: "guardrail.checked", reasoning: "Passed constraints: 09:00-21:00 IST, threshold ₹500 met, not DND.", metadata: {}, created_at: "2026-08-31T15:11:24Z" },
      { id: 11, recovery_case_id: "rc_c931", actor: "system", action: "sarvam.outcome", reasoning: "Call completed. Customer promised to pay.", metadata: { promise_date: "2026-09-02" }, created_at: "2026-08-31T15:12:47Z" }
    ],
    interventions: [
      { id: "int_3", recovery_case_id: "rc_c931", type: "voice_call", status: "completed", scheduled_for: "2026-08-31T15:11:30Z", executed_at: "2026-08-31T15:11:45Z", outcome: "promise_to_pay" }
    ]
  }
];

export const formatCurrency = (paise: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(paise / 100);
};

export const diagnosisData = [
  { label: "Bank downtime", cases: 35, amount: 3124000, percentage: 35 },
  { label: "Insufficient funds", cases: 25, amount: 2210000, percentage: 25 },
  { label: "PIN / OTP failure", cases: 20, amount: 1482000, percentage: 20 },
  { label: "Silent network drop-off", cases: 15, amount: 1134000, percentage: 15 },
  { label: "Unknown / other", cases: 5, amount: 410000, percentage: 5 },
];

export const metricsData = {
  failures_detected: 100,
  cases_opened: 100,
  cases_recovered: 61,
  amount_at_risk: 7942000,
  amount_recovered: 4862000, // 48620 rupees
  calls_placed: 42,
  whatsapps_sent: 58,
  optouts: 2,
  cases_contacted: 63,
  contacts_avoided: 37,
  recovered_revenue_paise: 4862000,
  recovered_revenue_trend: 121,
  recovery_rate: 61.2,
  recovery_rate_trend: 23.4,
  cost_per_recovery: 79,
  revenue_at_risk_paise: 7942000,
  revenue_at_risk_trend: 10
};

export const liveReceipts = mockCases.map(c => {
  const latestLog = c.audit_logs?.[c.audit_logs.length - 1];
  return {
    id: c.id,
    time: latestLog ? new Date(latestLog.created_at).toLocaleTimeString('en-IN', { hour12: false }) + ' IST' : '',
    event: latestLog ? latestLog.action : 'opened',
    amount: c.amount,
    detail: latestLog ? latestLog.reasoning : '',
    state: c.status
  };
});
