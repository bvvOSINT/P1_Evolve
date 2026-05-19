import { useState } from 'react';
import {
  FileSearch,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCircle2,
  Link2,
  Lock,
  Eye,
  Wifi,
  Database,
  Loader2,
} from 'lucide-react';
import { AnalysisResult, Finding, Severity } from '../types';

interface Props {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

const severityConfig: Record<Severity, { label: string; color: string; bg: string; border: string; icon: React.ComponentType<{ className?: string }> }> = {
  critical: {
    label: 'Critical',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: AlertOctagon,
  },
  high: {
    label: 'High',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    icon: AlertTriangle,
  },
  medium: {
    label: 'Medium',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: Info,
  },
  low: {
    label: 'Low',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: CheckCircle2,
  },
};

const categoryIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  'URL Structure': Link2,
  'SSL Certificate': Lock,
  'Content Analysis': Eye,
  'Network Reputation': Wifi,
  'Threat Intelligence': Database,
};

export default function JustificationPanel({ result, isAnalyzing }: Props) {
  const [expanded, setExpanded] = useState<string | null>('1');
  const [filter, setFilter] = useState<Severity | 'all'>('all');

  const filtered = result?.findings.filter((f) => filter === 'all' || f.severity === filter) ?? [];

  return (
    <div className="bg-[#0d1221] border border-slate-800/60 rounded-xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold tracking-widest text-slate-300 uppercase">
            Detailed Justification
          </h2>
          {result && (
            <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded-full">
              {result.findings.length} findings
            </span>
          )}
        </div>

        {result && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
            <FilterBtn active={filter === 'critical'} onClick={() => setFilter('critical')} label="Critical" color="text-red-400" />
            <FilterBtn active={filter === 'high'} onClick={() => setFilter('high')} label="High" color="text-orange-400" />
            <FilterBtn active={filter === 'medium'} onClick={() => setFilter('medium')} label="Medium" color="text-amber-400" />
            <FilterBtn active={filter === 'low'} onClick={() => setFilter('low')} label="Low" color="text-emerald-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 overflow-y-auto">
        {isAnalyzing && <LoadingState />}

        {!isAnalyzing && !result && <EmptyState />}

        {!isAnalyzing && result && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-slate-600">
            <Info className="w-8 h-8 mb-2" />
            <p className="text-xs">No findings match this filter.</p>
          </div>
        )}

        {!isAnalyzing && result && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((finding) => (
              <FindingCard
                key={finding.id}
                finding={finding}
                isExpanded={expanded === finding.id}
                onToggle={() => setExpanded(expanded === finding.id ? null : finding.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FindingCard({
  finding,
  isExpanded,
  onToggle,
}: {
  finding: Finding;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const sev = severityConfig[finding.severity];
  const SevIcon = sev.icon;
  const CatIcon = categoryIcon[finding.category] ?? Info;

  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${sev.border} ${isExpanded ? sev.bg : 'bg-slate-900/40 hover:bg-slate-900/60'}`}>
      {/* Card Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        <div className={`p-1.5 rounded-lg ${sev.bg} border ${sev.border} shrink-0`}>
          <SevIcon className={`w-4 h-4 ${sev.color}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className={`text-[10px] font-bold tracking-widest uppercase ${sev.color}`}>
              {sev.label}
            </span>
            <span className="text-[10px] text-slate-600">•</span>
            <span className="text-[10px] text-slate-500 tracking-wide flex items-center gap-1">
              <CatIcon className="w-3 h-3" />
              {finding.category}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-200 truncate">{finding.title}</p>
        </div>

        <div className={`shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-0' : ''} text-slate-500`}>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-800/60 pt-3">
          <p className="text-xs text-slate-400 leading-relaxed">{finding.description}</p>

          <div>
            <p className="text-[10px] tracking-widest text-slate-500 uppercase mb-2.5">
              Indicators of Compromise
            </p>
            <div className="space-y-1.5">
              {finding.indicators.map((indicator) => (
                <div key={indicator} className="flex items-start gap-2.5">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${sev.color.replace('text-', 'bg-')}`} />
                  <span className="text-xs text-slate-300">{indicator}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium ${sev.bg} ${sev.color} border ${sev.border}`}>
            <SevIcon className="w-3 h-3" />
            Severity: {sev.label}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterBtn({
  active,
  onClick,
  label,
  color = 'text-slate-400',
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-md text-[10px] font-medium tracking-wider transition-all ${
        active
          ? `${color} bg-slate-700 border border-slate-600`
          : 'text-slate-500 hover:text-slate-400 border border-transparent'
      }`}
    >
      {label}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center px-8">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-4">
        <FileSearch className="w-8 h-8 text-slate-600" />
      </div>
      <p className="text-sm text-slate-500 mb-2">No analysis running</p>
      <p className="text-xs text-slate-600 max-w-xs leading-relaxed">
        Enter a URL or upload a screenshot on the left panel to start the phishing analysis.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-3 w-full max-w-xs">
        {['URL Scan', 'Screenshot OCR', 'Threat Intel'].map((item) => (
          <div key={item} className="bg-slate-800/40 border border-slate-700/40 rounded-lg px-2 py-3 text-center">
            <p className="text-[10px] text-slate-500">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-2 border-slate-800 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
        <span className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" />
      </div>
      <p className="text-sm text-slate-400 mb-1">Analyzing threat vectors...</p>
      <p className="text-xs text-slate-600">Correlating with 50+ intelligence feeds</p>
      <div className="mt-6 space-y-2 w-64">
        {[80, 60, 90, 45].map((w, i) => (
          <div key={i} className="h-3 bg-slate-800 rounded animate-pulse" style={{ width: `${w}%`, animationDelay: `${i * 150}ms` }} />
        ))}
      </div>
    </div>
  );
}
