'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import PageShell from '@/components/PageShell';
import VideoCard, { VideoCardData } from '@/components/VideoCard';
import LoadingDots from '@/components/LoadingDots';
import { PlayCircle } from 'lucide-react';

const LANG_OPTIONS = [
  { id: 'both', label: 'Hindi + English', desc: 'All videos' },
  { id: 'hindi', label: 'हिंदी', desc: 'Hindi only' },
  { id: 'english', label: 'English', desc: 'English only' },
] as const;

type Lang = typeof LANG_OPTIONS[number]['id'];

const EXAMPLE_TOPICS = [
  'Graph Theory', 'Deadlock in OS', 'DBMS Joins', 'React Hooks',
  'Sorting Algorithms', 'Thermodynamics', 'Electrostatics',
];

export default function YouTubePage() {
  const [topic, setTopic] = useState('');
  const [lang, setLang] = useState<Lang>('both');
  const [videos, setVideos] = useState<VideoCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState('');

  const handleSearch = async (t?: string) => {
    const q = (t ?? topic).trim();
    if (!q) return toast.error('Enter a topic to search');
    if (t) setTopic(t);
    setLoading(true);
    setVideos([]);
    setSearched(q);
    try {
      const res = await fetch('/api/youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: q, lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVideos(data.videos ?? []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="YouTube Study Videos"
      description="Best explanation videos from top Indian education channels"
      icon={<PlayCircle size={18} />}
    >
      <div className="space-y-5">
        {/* Search form */}
        <div className="rounded-xl border border-[#242422] bg-[#141412] p-4 space-y-3">
          <div className="flex gap-2">
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search topic — e.g. Sorting Algorithms, Newton Laws, React Hooks..."
              className="flex-1 bg-[#0e0e0c] border border-[#242422] rounded-lg px-3.5 py-2.5 text-[13.5px] text-[#e0e0dc] placeholder-[#3a3a38] outline-none focus:border-[#3a3a38] transition-colors font-[450]"
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading || !topic.trim()}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[13.5px] font-semibold transition-all flex-shrink-0 ${
                !loading && topic.trim()
                  ? 'bg-[#e8e8e4] hover:bg-white text-[#0e0e0c]'
                  : 'bg-[#1e1e1c] text-[#3a3a38] cursor-not-allowed'
              }`}
            >
              {loading ? <LoadingDots size="sm" /> : 'Find Videos'}
            </button>
          </div>

          {/* Language filter */}
          <div className="flex gap-2">
            {LANG_OPTIONS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                className={`flex flex-col px-3 py-1.5 rounded-lg border text-left transition-all ${
                  lang === l.id
                    ? 'border-[#da7a7a]/40 bg-[#da7a7a]/8 text-[#da7a7a]'
                    : 'border-[#242422] text-[#5a5a54] hover:border-[#2a2a28] hover:text-[#a8a8a0]'
                }`}
              >
                <span className="text-[12.5px] font-medium">{l.label}</span>
                <span className="text-[10.5px] opacity-60">{l.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Example chips */}
        {!videos.length && !loading && (
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
            <span className="text-[13px] text-[#4a4a48]">Finding best videos…</span>
          </div>
        )}

        {/* Results */}
        {videos.length > 0 && !loading && (
          <div className="animate-slide-up space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] text-[#5a5a54] font-[450]">
                {videos.length} videos for <span className="text-[#a8a8a0]">{searched}</span>
              </p>
              <button
                onClick={() => handleSearch()}
                className="text-[12px] text-[#5a5a54] hover:text-[#a8a8a0] border border-[#1e1e1c] px-3 py-1 rounded-lg hover:bg-[#141412] transition-all font-[450]"
              >
                Refresh
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {videos.map((v, i) => (
                <VideoCard key={i} {...v} />
              ))}
            </div>
            <p className="text-[11px] text-[#3a3a38] text-center pt-1">
              Links open YouTube search — click to find the latest videos
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
