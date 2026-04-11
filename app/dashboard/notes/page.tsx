'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import PageShell from '@/components/PageShell';
import NoteCard, { NoteCardData } from '@/components/NoteCard';
import LoadingDots from '@/components/LoadingDots';
import { Search } from 'lucide-react';

const EXAMPLE_TOPICS = [
  'Operating System Deadlock',
  'DBMS Normalization',
  'Calculus Limits',
  'Network Security',
  'Data Structures Trees',
  'Organic Chemistry',
];

export default function NotesPage() {
  const [topic, setTopic] = useState('');
  const [results, setResults] = useState<NoteCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState('');

  const handleSearch = async (t?: string) => {
    const q = (t ?? topic).trim();
    if (!q) return toast.error('Enter a topic to search');
    if (t) setTopic(t);
    setLoading(true);
    setResults([]);
    setSearched(q);
    try {
      const res = await fetch('/api/notes-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.results ?? []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Notes Finder"
      description="Find handwritten notes, PDFs, and topper notes for any topic"
      icon={<Search size={18} />}
    >
      <div className="space-y-5">
        {/* Search */}
        <div className="flex gap-2">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search topic — e.g. Operating System Deadlock, Calculus Limits..."
            className="flex-1 bg-[#141412] border border-[#242422] rounded-xl px-4 py-2.5 text-[13.5px] text-[#e0e0dc] placeholder-[#3a3a38] outline-none focus:border-[#3a3a38] transition-colors font-[450]"
          />
          <button
            onClick={() => handleSearch()}
            disabled={loading || !topic.trim()}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all flex-shrink-0 ${
              !loading && topic.trim()
                ? 'bg-[#e8e8e4] hover:bg-white text-[#0e0e0c]'
                : 'bg-[#1e1e1c] text-[#3a3a38] cursor-not-allowed'
            }`}
          >
            {loading ? <LoadingDots size="sm" /> : <><Search size={13} /> Search</>}
          </button>
        </div>

        {/* Example chips */}
        {!results.length && !loading && (
          <div className="animate-fade-in">
            <p className="text-[11px] text-[#3a3a38] uppercase tracking-widest mb-2">Popular topics</p>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLE_TOPICS.map((ex) => (
                <button
                  key={ex}
                  onClick={() => handleSearch(ex)}
                  className="px-2.5 py-1 rounded-md border border-[#1e1e1c] text-[12px] text-[#5a5a54] hover:text-[#a8a8a0] hover:border-[#2a2a28] hover:bg-[#141412] transition-all font-[450]"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-12">
            <LoadingDots />
            <span className="text-[13px] text-[#4a4a48]">Searching for notes…</span>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && !loading && (
          <div className="animate-slide-up space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] text-[#5a5a54] font-[450]">
                {results.length} resources found for <span className="text-[#a8a8a0]">{searched}</span>
              </p>
              <button
                onClick={() => handleSearch()}
                className="text-[12px] text-[#5a5a54] hover:text-[#a8a8a0] border border-[#1e1e1c] px-3 py-1 rounded-lg hover:bg-[#141412] transition-all font-[450]"
              >
                Refresh
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map((r, i) => (
                <NoteCard key={i} {...r} />
              ))}
            </div>
            <p className="text-[11px] text-[#3a3a38] text-center pt-1">
              Links open relevant search pages — results may vary by topic
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
