export type CaseStatus = 'recovered' | 'waiting' | 'contacting' | 'promise_logged' | 'escalated' | 'closed_optout' | 'failed';

export interface ReceiptEvent {
  id: string;
  time: string;
  event: string;
  amount: number;
  detail: string;
  state: CaseStatus | 'suppress_contact';
}

export const liveReceipts: ReceiptEvent[] = [
  {
    id: "rc_1",
    time: "10:42:18",
    event: "payment.failed",
    amount: 149900,
    detail: "issuer_bank_downtime",
    state: "failed"
  },
  {
    id: "rc_2",
    time: "10:42:19",
    event: "policy.decided",
    amount: 0,
    detail: "suppress_contact · downtime confirmed",
    state: "suppress_contact"
  },
  {
    id: "rc_3",
    time: "10:57:04",
    event: "downtime.resolved",
    amount: 0,
    detail: "smart retry scheduled · 11:05 IST",
    state: "waiting"
  },
  {
    id: "rc_4",
    time: "11:06:11",
    event: "payment.captured",
    amount: 149900,
    detail: "RECOVERED",
    state: "recovered"
  },
  {
    id: "rc_5",
    time: "14:21:08",
    event: "checkout.abandoned",
    amount: 89900,
    detail: "no heartbeat for 10m",
    state: "failed"
  },
  {
    id: "rc_6",
    time: "14:21:09",
    event: "policy.decided",
    amount: 0,
    detail: "WhatsApp nudge · intent still fresh",
    state: "contacting"
  },
  {
    id: "rc_7",
    time: "14:21:10",
    event: "payment_link.created",
    amount: 89900,
    detail: "ref: rc_82f1",
    state: "waiting"
  },
  {
    id: "rc_8",
    time: "14:28:44",
    event: "payment_link.paid",
    amount: 89900,
    detail: "RECOVERED",
    state: "recovered"
  },
  {
    id: "rc_9",
    time: "15:11:22",
    event: "payment.failed",
    amount: 199900,
    detail: "insufficient_funds",
    state: "failed"
  },
  {
    id: "rc_10",
    time: "15:11:23",
    event: "policy.decided",
    amount: 0,
    detail: "Telugu voice call · cart ≥ ₹500",
    state: "contacting"
  },
  {
    id: "rc_11",
    time: "15:12:47",
    event: "sarvam.outcome",
    amount: 0,
    detail: "promise_to_pay · Sep 02, 10:00 IST",
    state: "promise_logged"
  }
];

export const diagnosisData = [
  { label: "Bank downtime", cases: 35, amount: 3124000, percentage: 35 },
  { label: "Insufficient funds", cases: 25, amount: 2210000, percentage: 25 },
  { label: "PIN / OTP failure", cases: 20, amount: 1482000, percentage: 20 },
  { label: "Silent network drop-off", cases: 15, amount: 1134000, percentage: 15 },
  { label: "Unknown / other", cases: 5, amount: 410000, percentage: 5 },
];

export const formatCurrency = (paise: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(paise / 100);
};
