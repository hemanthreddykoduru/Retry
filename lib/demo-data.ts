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

export const mockCases: RecoveryCase[] = [];

export const formatCurrency = (paise: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(paise / 100);
};

export const diagnosisData = [
  { label: "Bank downtime", cases: 0, amount: 0, percentage: 0 },
  { label: "Insufficient funds", cases: 0, amount: 0, percentage: 0 },
  { label: "PIN / OTP failure", cases: 0, amount: 0, percentage: 0 },
  { label: "Silent network drop-off", cases: 0, amount: 0, percentage: 0 },
  { label: "Unknown / other", cases: 0, amount: 0, percentage: 0 },
];

export const metricsData = {
  failures_detected: 0,
  cases_opened: 0,
  cases_recovered: 0,
  amount_at_risk: 0,
  amount_recovered: 0,
  calls_placed: 0,
  whatsapps_sent: 0,
  optouts: 0,
  cases_contacted: 0,
  contacts_avoided: 0,
  recovered_revenue_paise: 0,
  recovered_revenue_trend: 0,
  recovery_rate: 0,
  recovery_rate_trend: 0,
  cost_per_recovery: 0,
  revenue_at_risk_paise: 0,
  revenue_at_risk_trend: 0
};

export const liveReceipts = mockCases.map(c => {
  const latestLog = c.audit_logs?.[c.audit_logs.length - 1];
  return {
    id: c.id,
    time: latestLog ? new Date(latestLog.created_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true }) + ' IST' : '',
    event: latestLog ? latestLog.action : 'opened',
    amount: c.amount,
    detail: latestLog ? latestLog.reasoning : '',
    state: c.status
  };
});
