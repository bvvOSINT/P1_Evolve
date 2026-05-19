export type RiskLevel = 'low' | 'medium' | 'high';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Finding {
  id: string;
  category: string;
  severity: Severity;
  title: string;
  description: string;
  indicators: string[];
}

export interface AnalysisResult {
  riskScore: number;
  riskLevel: RiskLevel;
  url: string;
  domain: string;
  timestamp: string;
  findings: Finding[];
}
