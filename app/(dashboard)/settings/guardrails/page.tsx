"use client";

import { useState } from "react";
import { ShieldCheck, Check, RotateCcw, Save } from "lucide-react";

const SettingRow = ({ label, description, children }: { label: string, description: string, children: React.ReactNode }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b border-border/50 last:border-0 hover:bg-neutral-bg/50 transition-colors">
    <div className="flex-1">
      <div className="font-bold text-text-primary text-sm">{label}</div>
      <div className="text-text-secondary text-xs mt-1">{description}</div>
    </div>
    <div className="flex items-center gap-4 shrink-0">
      {children}
    </div>
  </div>
);

const Toggle = ({ checked, onChange }: { checked: boolean, onChange: (val: boolean) => void }) => (
  <button 
    className={`w-10 h-6 flex items-center px-1 rounded-full transition-colors ${checked ? 'bg-active' : 'bg-neutral'}`}
    onClick={() => onChange(!checked)}
  >
    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
  </button>
);

export default function GuardrailsPage() {
  const defaultState = {
    threshold: "500",
    maxAttempts: "2",
    startTime: "09:00",
    endTime: "21:00",
    enforceDND: true,
    suppressDowntime: true,
    exactAmountOnly: true,
    escalateFailures: true
  };

  const [state, setState] = useState(defaultState);
  const [isSaved, setIsSaved] = useState(true);

  const handleChange = (key: string, value: string | boolean) => {
    setState(prev => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    alert('Demo: Settings saved successfully.');
  };

  const handleReset = () => {
    setState(defaultState);
    setIsSaved(false);
  };

  return (
    <div className="max-w-[1000px] flex flex-col gap-8 pb-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-text-primary uppercase">
          GUARDRAILS
        </h1>
        <div className="text-sm text-text-primary font-mono mt-1">
          Recover revenue without harassing customers.
        </div>
      </div>

      <div className="bg-recovered-bg border border-recovered p-6">
        <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-recovered mb-4 flex items-center gap-2">
          <ShieldCheck size={16} /> Hard Limits (Always Enforced)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-sm text-recovered">
          <div className="flex items-center gap-2"><Check size={14} /> Bank downtime suppresses contact</div>
          <div className="flex items-center gap-2"><Check size={14} /> Quiet hours enforced</div>
          <div className="flex items-center gap-2"><Check size={14} /> DND blocks all automation</div>
          <div className="flex items-center gap-2"><Check size={14} /> Agent never asks for OTP/PIN/CVV</div>
          <div className="flex items-center gap-2"><Check size={14} /> Agent cannot alter payment amount</div>
        </div>
      </div>

      <div className="sharp-card flex flex-col">
        <div className="p-4 border-b border-border bg-neutral-bg flex justify-between items-center">
          <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary">
            Configurable Policies
          </h2>
          {!isSaved && (
            <div className="flex items-center gap-2">
              <button onClick={handleReset} className="text-xs font-mono uppercase tracking-widest flex items-center gap-1 text-text-secondary hover:text-text-primary px-3 py-1.5 transition-colors">
                <RotateCcw size={12} /> Reset
              </button>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-4 py-1.5 text-xs">
                <Save size={12} /> Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <SettingRow 
            label="Voice-call Threshold" 
            description="Minimum cart value required to trigger an AI voice call."
          >
            <div className="relative font-mono">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">₹</span>
              <input 
                type="number" 
                value={state.threshold} 
                onChange={(e) => handleChange('threshold', e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-border bg-surface text-sm focus:outline-none w-32"
              />
            </div>
          </SettingRow>

          <SettingRow 
            label="Maximum Voice Attempts" 
            description="Maximum number of times Sarvam AI will attempt to call a customer per recovery case."
          >
            <select 
              value={state.maxAttempts} 
              onChange={(e) => handleChange('maxAttempts', e.target.value)}
              className="px-3 py-1.5 border border-border bg-surface text-sm focus:outline-none w-32 font-mono"
            >
              <option value="1">1 Attempt</option>
              <option value="2">2 Attempts</option>
              <option value="3">3 Attempts</option>
            </select>
          </SettingRow>

          <SettingRow 
            label="Contact Window (Quiet Hours)" 
            description="Time window during which AI calls are permitted (IST)."
          >
            <div className="flex items-center gap-2 font-mono text-sm">
              <input 
                type="time" 
                value={state.startTime} 
                onChange={(e) => handleChange('startTime', e.target.value)}
                className="px-3 py-1.5 border border-border bg-surface focus:outline-none w-28"
              />
              <span className="text-text-secondary">to</span>
              <input 
                type="time" 
                value={state.endTime} 
                onChange={(e) => handleChange('endTime', e.target.value)}
                className="px-3 py-1.5 border border-border bg-surface focus:outline-none w-28"
              />
            </div>
          </SettingRow>

          <SettingRow 
            label="Customer Opt-out Enforcement" 
            description="Automatically block future contacts if a customer says 'Do not contact me' or stops the bot."
          >
            <Toggle checked={state.enforceDND} onChange={(v) => handleChange('enforceDND', v)} />
          </SettingRow>

          <SettingRow 
            label="Bank Downtime Suppression" 
            description="Wait for bank APIs to recover before nudging the customer to retry."
          >
            <Toggle checked={state.suppressDowntime} onChange={(v) => handleChange('suppressDowntime', v)} />
          </SettingRow>

          <SettingRow 
            label="Original Payment Amount Only" 
            description="Restrict payment links strictly to the exact failed checkout amount."
          >
            <Toggle checked={state.exactAmountOnly} onChange={(v) => handleChange('exactAmountOnly', v)} />
          </SettingRow>

          <SettingRow 
            label="Human Escalation" 
            description="Automatically escalate to human support team if all automated attempts fail."
          >
            <Toggle checked={state.escalateFailures} onChange={(v) => handleChange('escalateFailures', v)} />
          </SettingRow>
        </div>
      </div>
    </div>
  );
}
