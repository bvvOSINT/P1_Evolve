import { Clock, Globe, TrendingUp, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';
import { AnalysisResult } from '../types';

interface Props {
  result: AnalysisResult;
}

const riskConfig = {
  low: {
    label: 'LOW RISK',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/20',
    track: 'bg-emerald-500',
    icon: ShieldCheck,
    meterColor: '#10b981',
    desc: 'No significant threats detected. Exercise standard precautions.',
  },
  medium: {
    label: 'MEDIUM RISK',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    glow: 'shadow-amber-500/20',
    track: 'bg-amber-500',
    icon: ShieldAlert,
    meterColor: '#f59e0b',
    desc: 'Suspicious patterns detected. Proceed with caution.',
  },
  high: {
    label: 'HIGH RISK',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    glow: 'shadow-red-500/20',
    track: 'bg-red-500',
    icon: ShieldX,
    meterColor: '#ef4444',
    desc: 'Active phishing indicators detected. Do not proceed.',
  },
};

export default function ResultsPanel({ result }: Props) {
  const cfg = riskConfig[result.riskLevel];
  const Icon = cfg.icon;
  const criticalCount = result.findings.filter((f) => f.severity === 'critical').length;
  const highCount = result.findings.filter((f) => f.severity === 'high').length;

  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference - (result.riskScore / 100) * circumference;

  return (
    <div className={`bg-[#0d1221] border rounded-xl overflow-hidden shadow-lg ${cfg.border} ${cfg.glow}`}>
      <div className={`px-5 py-4 border-b ${cfg.border} ${cfg.bg} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${cfg.color}`} />
          <h2 className={`text-xs font-bold tracking-widest uppercase ${cfg.color}`}>
            {cfg.label}
          </h2>
        </div>
        <span className="text-[10px] text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(result.timestamp).toLocaleTimeString()}
        </span>
      </div>

      <div className="p-5">
        {/* Risk Meter */}
        <div className="flex items-center gap-6 mb-5">
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" fill="none" stroke="#1e293b" strokeWidth="6" />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke={cfg.meterColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-all duration-1000 ease-out"
                style={{ filter: `drop-shadow(0 0 6px ${cfg.meterColor}60)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold ${cfg.color}`}>{result.riskScore}</span>
              <span className="text-[9px] text-slate-500 tracking-widest">SCORE</span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <p className="text-xs text-slate-400 leading-relaxed">{cfg.desc}</p>
            <div className="flex gap-3">
              <StatBadge label="Critical" value={criticalCount} color="text-red-400 bg-red-500/10 border-red-500/20" />
              <StatBadge label="High" value={highCount} color="text-amber-400 bg-amber-500/10 border-amber-500/20" />
              <StatBadge
                label="Total"
                value={result.findings.length}
                color="text-slate-400 bg-slate-700/40 border-slate-600/30"
              />
            </div>
          </div>
        </div>

        {/* Domain Info */}
        <div className="bg-slate-900/60 rounded-lg px-4 py-3 space-y-2 border border-slate-800/60">
          <InfoRow icon={<Globe className="w-3.5 h-3.5 text-slate-500" />} label="Domain" value={result.domain} />
          <InfoRow
            icon={<TrendingUp className="w-3.5 h-3.5 text-slate-500" />}
            label="Findings"
            value={`${result.findings.length} indicators`}
          />
        </div>
      </div>
    </div>
  );
}

function StatBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`flex flex-col items-center px-2.5 py-1.5 rounded-md border text-center ${color}`}>
      <span className="text-sm font-bold">{value}</span>
      <span className="text-[9px] tracking-wider">{label}</span>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {icon}
      <span className="text-slate-500 w-16 shrink-0">{label}</span>
      <span className="text-slate-300 truncate font-medium">{value}</span>
    </div>
  );
}
