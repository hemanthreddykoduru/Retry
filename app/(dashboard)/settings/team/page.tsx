export default function TeamPage() {
  return (
    <div className="flex flex-col h-full gap-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">
          Workspace
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Team Members
        </h1>
      </div>

      <div className="sharp-card flex flex-col">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-background/50 text-[11px] font-medium tracking-[0.12em] uppercase text-text-secondary">
          <div className="col-span-5">Member</div>
          <div className="col-span-4">Role</div>
          <div className="col-span-3 text-right">Status</div>
        </div>
        
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border/50 items-center">
          <div className="col-span-5 font-mono text-sm">Hemanth Reddy</div>
          <div className="col-span-4 text-sm text-text-secondary">Admin</div>
          <div className="col-span-3 text-right"><span className="px-2 py-1 bg-recovered-bg text-recovered text-[10px] uppercase font-bold tracking-widest">Active</span></div>
        </div>
        
        <div className="p-6 border-t border-border mt-auto">
          <button className="btn-secondary">Invite Member</button>
        </div>
      </div>
    </div>
  );
}
