import { Shield, Activity, Bell, Settings, Wifi } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-slate-800/60 bg-[#0d1221]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-cyan-400" strokeWidth={1.5} />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-widest text-white uppercase">
                PhishGuard
              </h1>
              <p className="text-[10px] text-slate-500 tracking-widest uppercase">
                Threat Analysis Platform
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs text-slate-500">
            <StatusIndicator label="Threat Feeds" active />
            <StatusIndicator label="ML Engine" active />
            <StatusIndicator label="OSINT" active />
          </div>

          <div className="flex items-center gap-2">
            <NavBtn icon={<Activity className="w-4 h-4" />} label="Live" badge="12" />
            <NavBtn icon={<Bell className="w-4 h-4" />} label="Alerts" badge="3" />
            <NavBtn icon={<Settings className="w-4 h-4" />} label="Config" />
          </div>
        </div>
      </div>
    </header>
  );
}

function StatusIndicator({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <Wifi className={`w-3 h-3 ${active ? 'text-emerald-400' : 'text-slate-600'}`} />
      <span className={active ? 'text-emerald-400' : 'text-slate-600'}>{label}</span>
    </div>
  );
}

function NavBtn({
  icon,
  label,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
}) {
  return (
    <button className="relative flex items-center gap-1.5 px-3 py-1.5 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors text-xs">
      {icon}
      <span className="hidden sm:inline">{label}</span>
      {badge && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-[9px] text-black font-bold rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}
