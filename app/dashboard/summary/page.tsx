'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import PageShell from '@/components/PageShell';
import LoadingDots from '@/components/LoadingDots';
import { FileText, Sparkles, Copy, Check } from 'lucide-react';

const MODES = [
  { id: 'short', label: 'Short', desc: '3-5 sentence overview', color: 'text-[#a0a09a] border-[#3a3a38]/40 bg-[#3a3a38]/10' },
  { id: 'exam', label: 'Exam Ready', desc: 'Structured with questions', color: 'text-[#7aafda] border-[#7aafda]/40 bg-[#7aafda]/10' },
  { id: 'lastday', label: 'Last Day', desc: 'Night-before cheatsheet', color: 'text-[#c4a96e] border-[#c4a96e]/40 bg-[#c4a96e]/10' },
  { id: 'bullets', label: 'Bullet Points', desc: 'Hierarchical summary', color: 'text-[#7aba8a] border-[#7aba8a]/40 bg-[#7aba8a]/10' },
] as const;

type Mode = typeof MODES[number]['id'];

export default function SummaryPage() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<Mode>('exam');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    const t = text.trim();
    if (!t) return toast.error('Paste some text or enter a topic');
    setLoading(true);
    setSummary('');
    try {
      const res = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: t, mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSummary(data.summary);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageShell
      title="AI Summary"
      description="Summarize any topic or text in your preferred format"
      icon={<FileText size={18} />}
    >
      <div className="space-y-4">
        {/* Mode selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                mode === m.id ? m.color : 'border-[#242422] bg-[#141412] text-[#5a5a54] hover:border-[#2a2a28] hover:text-[#a8a8a0]'
              }`}
            >
              <span className="text-[13px] font-medium">{m.label}</span>
              <span className="text-[11px] opacity-70 mt-0.5">{m.desc}</span>
            </button>
          ))}
        </div>

        {/* Text input */}
        <div className="rounded-xl border border-[#242422] bg-[#141412] overflow-hidden">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text, chapter notes, or just type a topic name (e.g. 'Photosynthesis', 'Linked Lists')..."
            rows={6}
            disabled={loading}
            className="w-full bg-transparent text-[#e0e0dc] placeholder-[#3a3a38] text-[13.5px] resize-none outline-none p-4 leading-relaxed font-[450]"
          />
          <div className="px-4 pb-3 flex justify-between items-center border-t border-[#1a1a18]">
            <span className="text-[11px] text-[#3a3a38]">{text.length} characters</span>
            <button
              onClick={handleGenerate}
              disabled={loading || !text.trim()}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
                !loading && text.trim()
                  ? 'bg-[#e8e8e4] hover:bg-white text-[#0e0e0c]'
                  : 'bg-[#1e1e1c] text-[#3a3a38] cursor-not-allowed'
              }`}
            >
              {loading ? <LoadingDots size="sm" /> : <><Sparkles size={12} /> Summarise</>}
            </button>
          </div>
        </div>

        {/* Output */}
        {(loading || summary) && (
          <div className="rounded-xl border border-[#242422] bg-[#141412] overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1a1a18]">
              <span className={`text-[11.5px] font-medium px-2 py-0.5 rounded-md border ${
                MODES.find((m) => m.id === mode)?.color ?? ''
              }`}>
                {MODES.find((m) => m.id === mode)?.label}
              </span>
              {summary && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] text-[#5a5a54] hover:text-[#a8a8a0] hover:bg-[#1a1a18] border border-[#1e1e1c] transition-all font-[450]"
                >
                  {copied ? <><Check size={11} className="text-[#7aba8a]" />Copied</> : <><Copy size={11} />Copy</>}
                </button>
              )}
            </div>
            <div className="px-4 py-4">
              {loading ? (
                <div className="flex items-center gap-2.5 py-3">
                  <LoadingDots />
                  <span className="text-[13px] text-[#4a4a48]">Summarising…</span>
                </div>
              ) : (
                <div className="markdown-output">
                  <ReactMarkdown>{summary}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
