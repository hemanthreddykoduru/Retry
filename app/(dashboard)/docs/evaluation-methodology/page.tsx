export default function EvaluationMethodologyPage() {
  return (
    <div className="max-w-[800px] mx-auto flex flex-col gap-8 pb-10 mt-10">
      <div className="flex flex-col gap-2 border-b border-[#E6E8EC] pb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-[#17191F]">
          Evaluation Methodology
        </h1>
        <div className="text-[15px] text-[#5B6270]">
          How Retry evaluates state machine effectiveness and simulated voice interactions.
        </div>
      </div>

      <div className="prose prose-slate max-w-none text-[#17191F]">
        <h2 className="text-xl font-semibold mb-4 mt-8">Synthetic Data Batch</h2>
        <ul className="list-disc pl-5 space-y-2 text-[#5B6270]">
          <li><strong>Volume:</strong> 100 simulated test-mode recovery cases.</li>
          <li><strong>Amounts:</strong> Handled natively in paise. ₹899 (89900 paise) up to ₹4,999 (499900 paise).</li>
          <li><strong>Distributions:</strong>
            <ul className="list-circle pl-5 mt-2 space-y-1">
              <li>35% Bank downtime (No contact, auto-retry)</li>
              <li>25% Insufficient funds (Payment link / voice call threshold based)</li>
              <li>20% PIN/OTP failure (Voice call)</li>
              <li>15% Network drop-off (Payment link immediately)</li>
              <li>5% Unknown (Human escalation)</li>
            </ul>
          </li>
        </ul>

        <h2 className="text-xl font-semibold mb-4 mt-10">Constraints Tested</h2>
        <ol className="list-decimal pl-5 space-y-3 text-[#5B6270]">
          <li><strong>DND / Opt-Outs:</strong> Cases flagged as <code>do_not_contact</code> or opting out during a voice call immediately transition to <code>closed_optout</code> and halt all scheduled interventions.</li>
          <li><strong>Quiet Hours:</strong> Mock configuration prevents automated outbound engagement during 21:00 to 09:00 IST.</li>
          <li><strong>Cart Thresholds:</strong> Only payments &gt; ₹500 trigger a live Sarvam call; everything else routes to deterministic payment links.</li>
          <li><strong>Call Caps:</strong> Max 2 attempts.</li>
        </ol>

        <h2 className="text-xl font-semibold mb-4 mt-10">Metrics Extracted</h2>
        <ul className="list-disc pl-5 space-y-2 text-[#5B6270]">
          <li><strong>Recovery Rate:</strong> Percentage of captured intents relative to failures.</li>
          <li><strong>Contacts Avoided:</strong> Cases actively suppressed from automation (e.g., bank downtime).</li>
          <li><strong>Amount Recovered:</strong> Total test-mode paise captured through fallback links.</li>
        </ul>
      </div>
    </div>
  );
}
