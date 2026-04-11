'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import PageShell from '@/components/PageShell';
import NoteCard, { NoteCardData } from '@/components/NoteCard';
import LoadingDots from '@/components/LoadingDots';
import { BookOpen, Filter } from 'lucide-react';

interface PaperResult extends NoteCardData {
  university?: string;
  year?: string;
  semester?: string;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => String(CURRENT_YEAR - i));
const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8'];

export default function PYQPage() {
  const [subject, setSubject] = useState('');
  const [university, setUniversity] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [results, setResults] = useState<PaperResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async () => {
    if (!subject.trim()) return toast.error('Enter a subject name');
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch('/api/pyq-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, university, year, semester }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResults(data.papers ?? []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Past Papers"
      description="Find previous year university question papers"
      icon={<BookOpen size={18} />}
    >
      <div className="space-y-5">
        {/* Main search */}
        <div className="rounded-xl border border-[#242422] bg-[#141412] p-4 space-y-3">
          <div>
            <label className="block text-[12px] font-medium text-[#6a6a64] mb-1.5">Subject *</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. Data Structures, Engineering Mathematics, Digital Electronics..."
              className="w-full bg-[#0e0e0c] border border-[#242422] rounded-lg px-3.5 py-2.5 text-[13.5px] text-[#e0e0dc] placeholder-[#3a3a38] outline-none focus:border-[#3a3a38] transition-colors font-[450]"
            />
          </div>

          {/* Toggle filters */}
          <button
            onClick={() => setShowFilters((f) => !f)}
            className="flex items-center gap-1.5 text-[12.5px] text-[#5a5a54] hover:text-[#a8a8a0] transition-colors font-[450]"
          >
            <Filter size={12} />
            {showFilters ? 'Hide filters' : 'Add filters (university, year, semester)'}
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 animate-fade-in">
              <div>
                <label className="block text-[12px] font-medium text-[#6a6a64] mb-1.5">University</label>
                <input
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. Mumbai, VTU, Anna..."
                  className="w-full bg-[#0e0e0c] border border-[#242422] rounded-lg px-3.5 py-2.5 text-[13px] text-[#e0e0dc] placeholder-[#3a3a38] outline-none focus:border-[#3a3a38] transition-colors font-[450]"
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#6a6a64] mb-1.5">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-[#0e0e0c] border border-[#242422] rounded-lg px-3.5 py-2.5 text-[13px] text-[#c0c0bc] outline-none focus:border-[#3a3a38] transition-colors font-[450]"
                >
                  <option value="">Any year</option>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#6a6a64] mb-1.5">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full bg-[#0e0e0c] border border-[#242422] rounded-lg px-3.5 py-2.5 text-[13px] text-[#c0c0bc] outline-none focus:border-[#3a3a38] transition-colors font-[450]"
                >
                  <option value="">Any semester</option>
                  {SEMESTERS.map((s) => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
            </div>
          )}

          <button
            onClick={handleSearch}
            disabled={loading || !subject.trim()}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13.5px] font-semibold transition-all ${
              !loading && subject.trim()
                ? 'bg-[#e8e8e4] hover:bg-white text-[#0e0e0c]'
                : 'bg-[#1e1e1c] text-[#3a3a38] cursor-not-allowed'
            }`}
          >
            {loading ? <><LoadingDots size="sm" /> Searching papers…</> : 'Find Question Papers'}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-12">
            <LoadingDots />
            <span className="text-[13px] text-[#4a4a48]">Searching for papers…</span>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && !loading && (
          <div className="animate-slide-up space-y-3">
            <p className="text-[12.5px] text-[#5a5a54] font-[450]">
              {results.length} papers found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map((r, i) => (
                <NoteCard key={i} {...r} />
              ))}
            </div>
            <p className="text-[11px] text-[#3a3a38] text-center pt-1">
              Links open search pages on university portals and Google
            </p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
