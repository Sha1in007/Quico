'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import PageShell from '@/components/PageShell';
import LoadingDots from '@/components/LoadingDots';
import { MessageCircle, Send } from 'lucide-react';

const MODES = [
  { id: 'short', label: 'Short Answer', desc: '2-4 sentences, student-friendly' },
  { id: 'long', label: 'Long Answer', desc: '10-mark style, structured' },
  { id: 'viva', label: 'Viva Mode', desc: 'Oral exam, concise + confident' },
] as const;

type Mode = typeof MODES[number]['id'];

export default function QAPage() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<Mode>('short');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setAnswer('');
    try {
      const res = await fetch('/api/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnswer(data.answer);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to get answer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Q&A Revision"
      description="Ask any question — get student-friendly answers"
      icon={<MessageCircle size={18} />}
    >
      <div className="space-y-4">
        {/* Mode tabs */}
        <div className="flex gap-2 flex-wrap">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex flex-col px-3.5 py-2 rounded-xl border text-left transition-all ${
                mode === m.id
                  ? 'border-[#c4a96e]/40 bg-[#c4a96e]/8 text-[#c4a96e]'
                  : 'border-[#242422] bg-[#141412] text-[#5a5a54] hover:border-[#2a2a28] hover:text-[#a8a8a0]'
              }`}
            >
              <span className="text-[13px] font-medium">{m.label}</span>
              <span className="text-[11px] opacity-70 mt-0.5">{m.desc}</span>
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="rounded-xl border border-[#242422] bg-[#141412] hover:border-[#2a2a28] transition-all">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            placeholder="Ask anything — e.g. Explain deadlock in easy words, Difference between TCP and UDP, What is 5 marks answer of normalization..."
            rows={3}
            disabled={loading}
            className="w-full bg-transparent text-[#e0e0dc] placeholder-[#3a3a38] text-[14px] resize-none outline-none p-4 leading-relaxed font-[450]"
          />
          <div className="px-4 pb-3 flex items-center justify-between">
            <span className="text-[11px] text-[#3a3a38]">
              <kbd className="bg-[#1e1e1c] border border-[#2a2a28] px-1.5 py-0.5 rounded text-[10px] font-mono">↵</kbd> to ask
            </span>
            <button
              onClick={handleSubmit}
              disabled={loading || !query.trim()}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                query.trim() && !loading
                  ? 'bg-[#e8e8e4] hover:bg-white text-[#0e0e0c]'
                  : 'bg-[#1e1e1c] text-[#3a3a38] cursor-not-allowed'
              }`}
            >
              {loading ? <LoadingDots size="sm" /> : <><Send size={12} /> Ask</>}
            </button>
          </div>
        </div>

        {/* Answer */}
        {(loading || answer) && (
          <div className="rounded-xl border border-[#242422] bg-[#141412] overflow-hidden animate-slide-up">
            <div className="px-4 py-2.5 border-b border-[#1e1e1c] flex items-center gap-2">
              <span className={`text-[11.5px] font-medium px-2 py-0.5 rounded-md border ${
                mode === 'short' ? 'text-[#c4a96e] bg-[#c4a96e]/10 border-[#c4a96e]/20' :
                mode === 'long' ? 'text-[#7aafda] bg-[#7aafda]/10 border-[#7aafda]/20' :
                'text-[#7aba8a] bg-[#7aba8a]/10 border-[#7aba8a]/20'
              }`}>
                {MODES.find((m) => m.id === mode)?.label}
              </span>
              <p className="text-[12.5px] text-[#5a5a54] truncate">{query}</p>
            </div>
            <div className="px-4 py-4">
              {loading ? (
                <div className="flex items-center gap-2.5 py-3">
                  <LoadingDots />
                  <span className="text-[13px] text-[#4a4a48]">Thinking…</span>
                </div>
              ) : (
                <div className="markdown-output">
                  <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick examples */}
        {!answer && !loading && (
          <div className="pt-2 animate-fade-in">
            <p className="text-[11px] text-[#3a3a38] font-medium uppercase tracking-widest mb-2">Try asking</p>
            <div className="flex flex-wrap gap-2">
              {[
                'Explain deadlock in easy words',
                'Difference between stack and queue',
                'What is normalization in DBMS',
                'Explain inheritance in OOP with example',
                'What is Big O notation',
              ].map((ex) => (
                <button
                  key={ex}
                  onClick={() => setQuery(ex)}
                  className="px-3 py-1.5 rounded-lg border border-[#1e1e1c] bg-[#141412] text-[12px] text-[#5a5a54] hover:text-[#a8a8a0] hover:border-[#2a2a28] hover:bg-[#1a1a18] transition-all font-[450]"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
