import { useState, useCallback } from 'react';
import Header from './components/Header';
import AnalyzerPanel from './components/AnalyzerPanel';
import ResultsPanel from './components/ResultsPanel';
import JustificationPanel from './components/JustificationPanel';
import { AnalysisResult } from './types';


function extractDomain(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.hostname;
  } catch {
    return url;
  }
}

export default function App() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysis = useCallback(async (url: string, _screenshot?: File) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('https://p1-evolve-1.onrender.com/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: url }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor de análisis');
      }

      const data = await response.json();
      const aiText = data.analysis || "";

      
      const aiTextLower = aiText.toLowerCase();
      const isMalicious = aiTextLower.includes('phishing') || aiTextLower.includes('malicioso');
      const isSuspicious = aiTextLower.includes('sospechoso') || aiTextLower.includes('advertencia');
      
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (isMalicious) riskLevel = 'high';
      else if (isSuspicious) riskLevel = 'medium';

      const scoreMatch = aiText.match(/NIVEL DE RIESGO:\s*(\d+)/i);
      const riskScore = scoreMatch ? parseInt(scoreMatch[1], 10) : (riskLevel === 'high' ? 90 : riskLevel === 'medium' ? 45 : 10);

      const formattedFindings = [
        {
          id: 'ai-1',
          category: 'Análisis de Inteligencia Artificial',
          severity: riskLevel === 'high' ? 'critical' : riskLevel === 'medium' ? 'high' : 'low',
          title: `Veredicto: ${riskLevel.toUpperCase()}`,
          description: aiText,
          indicators: ['Procesado en tiempo real', 'Validación heurística LLM'],
        }
      ];

      setResult({
        riskScore,
        riskLevel,
        url,
        timestamp: new Date().toISOString(),
        domain: extractDomain(url),
        // @ts-ignore
        findings: formattedFindings,
      });

    } catch (error) {
      console.error("Error analizando con la IA:", error);
      alert("No se pudo conectar con el servidor de análisis de IA. Asegúrate de tener corriendo el backend.");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-200 font-mono">
      <Header />
      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 space-y-6">
            <AnalyzerPanel onAnalyze={handleAnalysis} isAnalyzing={isAnalyzing} />
            {result && <ResultsPanel result={result} />}
          </div>
          <div className="xl:col-span-2">
            <JustificationPanel result={result} isAnalyzing={isAnalyzing} />
          </div>
        </div>
      </main>
    </div>
  );
} 