import { useState, useCallback, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, Link2, Search, Image, X, Loader2 } from 'lucide-react';

interface Props {
  onAnalyze: (url: string, screenshot?: File) => void;
  isAnalyzing: boolean;
}

export default function AnalyzerPanel({ onAnalyze, isAnalyzing }: Props) {
  const [url, setUrl] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const acceptFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setScreenshot(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) acceptFile(file);
    },
    [acceptFile]
  );

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) acceptFile(file);
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!url.trim() && !screenshot) return;
    onAnalyze(url.trim() || 'unknown://target', screenshot ?? undefined);
  };

  const canSubmit = (url.trim().length > 0 || screenshot !== null) && !isAnalyzing;

  return (
    <div className="bg-[#0d1221] border border-slate-800/60 rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-800/60 flex items-center gap-2">
        <Search className="w-4 h-4 text-cyan-400" />
        <h2 className="text-xs font-bold tracking-widest text-slate-300 uppercase">
          Threat Analyzer
        </h2>
      </div>

      <div className="p-5 space-y-4">
        {/* URL Input */}
        <div>
          <label className="block text-[10px] tracking-widest text-slate-500 uppercase mb-2">
            Target URL
          </label>
          <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-700/60 rounded-lg px-3 py-2.5 focus-within:border-cyan-500/60 transition-colors">
            <Link2 className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && canSubmit && handleSubmit()}
              placeholder="https://suspicious-site.example.com/login"
              className="flex-1 bg-transparent text-xs text-slate-200 placeholder-slate-600 outline-none"
            />
            {url && (
              <button onClick={() => setUrl('')} className="text-slate-600 hover:text-slate-400 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[10px] text-slate-600 tracking-widest uppercase">or</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Drop Zone */}
        <div>
          <label className="block text-[10px] tracking-widest text-slate-500 uppercase mb-2">
            Screenshot Upload
          </label>
          {preview ? (
            <div className="relative rounded-lg overflow-hidden border border-slate-700/60 group">
              <img src={preview} alt="Screenshot" className="w-full h-36 object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={removeScreenshot}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 border border-red-500/40 text-red-400 rounded-md text-xs hover:bg-red-500/30 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 px-3 py-2">
                <p className="text-[10px] text-slate-400 truncate">{screenshot?.name}</p>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
                ${isDragging
                  ? 'border-cyan-500/70 bg-cyan-500/5 scale-[1.01]'
                  : 'border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/30'
                }
              `}
            >
              <div className={`transition-transform duration-200 ${isDragging ? 'scale-110' : ''}`}>
                <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center">
                  {isDragging ? (
                    <Upload className="w-5 h-5 text-cyan-400 animate-bounce" />
                  ) : (
                    <Image className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-1">
                  {isDragging ? 'Drop screenshot here' : 'Drag & drop screenshot'}
                </p>
                <p className="text-[10px] text-slate-600">
                  PNG, JPG, WEBP supported
                </p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`
            w-full py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all duration-200
            flex items-center justify-center gap-2
            ${canSubmit
              ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30'
              : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }
          `}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing Threat...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Run Analysis
            </>
          )}
        </button>

        {isAnalyzing && (
          <div className="space-y-2">
            {['Resolving domain...', 'Checking threat feeds...', 'Running ML classifier...'].map((step, i) => (
              <AnalysisStep key={step} label={step} delay={i * 600} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AnalysisStep({ label, delay }: { label: string; delay: number }) {
  return (
    <div
      className="flex items-center gap-2 text-[10px] text-slate-500 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
      {label}
    </div>
  );
}
