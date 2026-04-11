'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import PageShell from '@/components/PageShell';
import MindMapCanvas, { MindNode } from '@/components/MindMapCanvas';
import LoadingDots from '@/components/LoadingDots';
import { GitBranch, Sparkles } from 'lucide-react';

const EXAMPLES = [
  'Operating System Deadlock',
  'DBMS Normalization',
  'Photosynthesis',
  "Newton's Laws of Motion",
  'Machine Learning Algorithms',
  'French Revolution',
];

export default function MindmapPage() {
  const [topic, setTopic] = useState('');
  const [tree, setTree] = useState<MindNode | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (t?: string) => {
    const q = (t ?? topic).trim();
    if (!q) return toast.error('Enter a topic first');
    if (t) setTopic(t);
    setLoading(true);
    setTree(null);
    try {
      const res = await fetch('/api/mindmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (!data.tree?.label) throw new Error('Invalid mindmap data');
      setTree(data.tree);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate mindmap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Mind Map Generator"
      description="Visual mind maps from any topic or chapter"
      icon={<GitBranch size={18} />}
    >
      <div className="space-y-5">
        {/* Input */}
        <div className="rounded-xl border border-[#242422] bg-[#141412] p-4 space-y-3">
          <div>
            <label className="block text-[12px] font-medium text-[#6a6a64] mb-1.5">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="Enter any subject topic to visualize..."
              className="w-full bg-[#0e0e0c] border border-[#242422] rounded-lg px-3.5 py-2.5 text-[13.5px] text-[#e0e0dc] placeholder-[#3a3a38] outline-none focus:border-[#3a3a38] transition-colors font-[450]"
            />
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={loading || !topic.trim()}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13.5px] font-semibold transition-all ${
              !loading && topic.trim()
                ? 'bg-[#e8e8e4] hover:bg-white text-[#0e0e0c]'
                : 'bg-[#1e1e1c] text-[#3a3a38] cursor-not-allowed'
            }`}
          >
            {loading ? (
              <><LoadingDots size="sm" /> Building mindmap…</>
            ) : (
              <><Sparkles size={14} /> Generate Mind Map</>
            )}
          </button>

          {/* Examples */}
          <div>
            <p className="text-[11px] text-[#3a3a38] uppercase tracking-widest mb-2">Try these</p>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  onClick={() => handleGenerate(ex)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-md border border-[#1e1e1c] text-[12px] text-[#5a5a54] hover:text-[#a8a8a0] hover:border-[#2a2a28] hover:bg-[#1a1a18] transition-all font-[450] disabled:opacity-40"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mindmap */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-16 rounded-xl border border-[#1e1e1c] bg-[#141412]">
            <LoadingDots />
            <span className="text-[13px] text-[#4a4a48]">Building your mind map…</span>
          </div>
        )}

        {tree && !loading && (
          <div className="animate-slide-up">
            <MindMapCanvas tree={tree} topic={topic} />
          </div>
        )}
      </div>
    </PageShell>
  );
}
