"use client";

import { useState } from "react";
import { User, Bell, Shield, LogOut, Trash2, Mail, Users, MapPin, Building, Activity, Copy, AlertTriangle } from "lucide-react";

const TabButton = ({ id, icon: Icon, label, activeTab, setActiveTab }: { id: string, icon: React.ElementType, label: string, activeTab: string, setActiveTab: (id: string) => void }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-wider uppercase w-full text-left transition-colors border-l-2 ${
      activeTab === id 
        ? 'bg-neutral-bg border-text-primary text-text-primary' 
        : 'border-transparent text-text-secondary hover:bg-neutral-bg/50 hover:text-text-primary'
    }`}
  >
    <Icon size={16} /> {label}
  </button>
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  };

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-8 pb-12 w-full">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-text-primary uppercase">
          WORKSPACE SETTINGS
        </h1>
        <div className="text-sm text-text-primary font-mono mt-1">
          Manage your store profile, team, and security.
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Navigation */}
        <div className="w-full md:w-64 shrink-0 sharp-card overflow-hidden">
          <TabButton id="profile" icon={Building} label="Merchant Profile" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="team" icon={Users} label="Team" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="notifications" icon={Bell} label="Notifications" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="security" icon={Shield} label="Data & Security" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton id="account" icon={User} label="Account" activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full sharp-card p-6 min-h-[500px]">
          
          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-6 max-w-lg">
              <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary border-b border-border pb-2 mb-2">Merchant Profile</h2>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono uppercase tracking-widest text-text-secondary">Business Name</label>
                <input type="text" defaultValue="NammaMart Demo Store" className="px-3 py-2 border border-border bg-surface focus:outline-none" />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono uppercase tracking-widest text-text-secondary">Support Email</label>
                <input type="email" defaultValue="support@nammamart.demo" className="px-3 py-2 border border-border bg-surface focus:outline-none font-mono" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono uppercase tracking-widest text-text-secondary">Timezone</label>
                <select className="px-3 py-2 border border-border bg-surface focus:outline-none font-mono">
                  <option>Asia/Kolkata (IST)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-mono uppercase tracking-widest text-text-secondary">Merchant ID</label>
                <div className="flex items-center">
                  <div className="bg-neutral-bg border border-border p-2 font-mono text-sm flex-1">m_demo_••••••••</div>
                  <button onClick={() => copyToClipboard('m_demo_12345')} className="p-2 border border-l-0 border-border bg-surface hover:bg-neutral-bg transition-colors"><Copy size={18} /></button>
                </div>
              </div>

              <button className="btn-primary mt-4 self-start" onClick={() => alert('Demo: Saved')}>Save Profile</button>
            </div>
          )}

          {/* TEAM */}
          {activeTab === 'team' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-end border-b border-border pb-2 mb-2">
                <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary">Team Members</h2>
                <button className="text-xs font-mono uppercase tracking-widest bg-neutral-bg border border-border px-3 py-1 hover:bg-surface">Invite Member</button>
              </div>

              <div className="border border-border">
                <div className="grid grid-cols-12 gap-4 p-3 border-b border-border bg-neutral-bg text-[10px] font-bold tracking-[0.12em] uppercase text-text-secondary">
                  <div className="col-span-5">User</div>
                  <div className="col-span-3">Role</div>
                  <div className="col-span-4 text-right">Status</div>
                </div>
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-border items-center">
                  <div className="col-span-5 font-mono text-sm">
                    <div className="font-bold text-text-primary">Hemanth R. (You)</div>
                    <div className="text-xs text-text-secondary">hemanth@nammamart.demo</div>
                  </div>
                  <div className="col-span-3">
                    <span className="px-2 py-0.5 border border-border bg-neutral-bg text-[10px] font-mono uppercase tracking-widest">Owner</span>
                  </div>
                  <div className="col-span-4 text-right text-xs font-mono text-recovered">Active</div>
                </div>
                <div className="grid grid-cols-12 gap-4 p-4 items-center">
                  <div className="col-span-5 font-mono text-sm">
                    <div className="font-bold text-text-primary">Support Agent</div>
                    <div className="text-xs text-text-secondary">support@nammamart.demo</div>
                  </div>
                  <div className="col-span-3">
                    <span className="px-2 py-0.5 border border-border bg-neutral-bg text-[10px] font-mono uppercase tracking-widest">Editor</span>
                  </div>
                  <div className="col-span-4 text-right text-xs font-mono text-waiting">Pending Invite</div>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="flex flex-col gap-6 max-w-lg">
              <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary border-b border-border pb-2 mb-2">Email Notifications</h2>
              
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="font-bold text-text-primary text-sm">Daily Recovery Digest</div>
                  <div className="text-text-secondary text-xs mt-1">Receive a morning summary of cases opened and revenue recovered.</div>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 mt-1" />
              </div>
              
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="font-bold text-text-primary text-sm">Escalated Case Alerts</div>
                  <div className="text-text-secondary text-xs mt-1">Get notified immediately when an automated recovery fails and requires human intervention.</div>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 mt-1" />
              </div>

              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="font-bold text-text-primary text-sm">Webhook Health Monitor</div>
                  <div className="text-text-secondary text-xs mt-1">Alerts if Razorpay webhooks stop arriving or signatures fail validation.</div>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 mt-1" />
              </div>

              <button className="btn-primary mt-4 self-start" onClick={() => alert('Demo: Saved')}>Save Preferences</button>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <div className="flex flex-col gap-6 max-w-2xl">
              <div className="flex justify-between items-center border-b border-border pb-2 mb-2">
                <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary">Data & Security</h2>
                <div className="bg-active-bg border border-active text-active px-2 py-1 text-[10px] uppercase tracking-widest font-bold">
                  TEST MODE
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-border p-4 bg-neutral-bg flex flex-col gap-2">
                  <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-text-secondary">Webhook Security</div>
                  <div className="text-sm font-mono text-text-primary flex items-center gap-2"><Shield size={14} className="text-recovered"/> Signatures Validated</div>
                  <div className="text-xs text-text-muted mt-1">All payloads are cryptographically verified using your Razorpay secret.</div>
                </div>
                <div className="border border-border p-4 bg-neutral-bg flex flex-col gap-2">
                  <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-text-secondary">Data Retention</div>
                  <div className="text-sm font-mono text-text-primary flex items-center gap-2">90 Days</div>
                  <div className="text-xs text-text-muted mt-1">Audit logs and intervention transcripts are retained for 90 days.</div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <label className="text-xs font-mono uppercase tracking-widest text-text-secondary">API Keys</label>
                <div className="p-4 border border-border bg-surface text-sm font-mono text-text-secondary flex justify-between items-center">
                  <span>sk_test_••••••••••••••</span>
                  <span className="text-[10px] bg-neutral-bg px-2 py-1 uppercase tracking-widest">Hidden</span>
                </div>
              </div>
            </div>
          )}

          {/* ACCOUNT */}
          {activeTab === 'account' && (
            <div className="flex flex-col gap-6 max-w-lg">
              <h2 className="text-[11px] font-bold tracking-[0.12em] uppercase text-text-secondary border-b border-border pb-2 mb-2">My Account</h2>
              
              <button className="flex items-center gap-2 text-sm font-bold p-3 border border-border hover:bg-neutral-bg transition-colors max-w-xs justify-center">
                <LogOut size={16} /> Log Out
              </button>

              <div className="mt-8 border border-lost p-6 bg-lost-bg">
                <h3 className="text-lost font-bold text-sm mb-2 flex items-center gap-2"><AlertTriangle size={16} /> Danger Zone</h3>
                <p className="text-xs text-text-secondary mb-4">Deleting your account removes all recovery history, guardrail configurations, and connected integrations. This action cannot be undone.</p>
                <button 
                  className="btn-secondary text-lost border-lost hover:bg-lost-bg/50"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete Account
                </button>
              </div>

              {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-surface border border-border p-6 max-w-sm w-full sharp-card">
                    <h3 className="font-bold text-lg mb-2">Delete Account?</h3>
                    <p className="text-sm text-text-secondary mb-6">In demo mode, destructive production deletion is disabled. This modal is for demonstration purposes only.</p>
                    <div className="flex justify-end gap-3">
                      <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                      <button className="btn-secondary text-lost border-lost bg-lost-bg" onClick={() => setShowDeleteModal(false)}>Got it</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
