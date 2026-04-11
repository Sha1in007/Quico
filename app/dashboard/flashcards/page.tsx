'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import PageShell from '@/components/PageShell';
import FlashcardDeck, { Flashcard } from '@/components/FlashcardDeck';
import LoadingDots from '@/components/LoadingDots';
import { Layers, Sparkles } from 'lucide-react';

const COUNT_OPTIONS = [5, 10, 15, 20];

export default function FlashcardsPage() {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(10);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error('Enter a topic first');
    setLoading(true);
    setCards([]);
    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (!data.cards?.length) throw new Error('No cards generated');
      setCards(data.cards);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate flashcards');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Flashcard Generator"
      description="Generate study flashcards from any topic"
      icon={<Layers size={18} />}
    >
      <div className="space-y-5">
        {/* Config */}
        <div className="rounded-xl border border-[#242422] bg-[#141412] p-4 space-y-4">
          {/* Topic input */}
          <div>
            <label className="block text-[12px] font-medium text-[#6a6a64] mb-1.5">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="e.g. DBMS Normalization, Operating System Deadlock, Calculus Limits..."
              className="w-full bg-[#0e0e0c] border border-[#242422] rounded-lg px-3.5 py-2.5 text-[13.5px] text-[#e0e0dc] placeholder-[#3a3a38] outline-none focus:border-[#3a3a38] transition-colors font-[450]"
            />
          </div>

          {/* Count */}
          <div>
            <label className="block text-[12px] font-medium text-[#6a6a64] mb-2">Number of Cards</label>
            <div className="flex gap-2">
              {COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`px-3 py-1.5 rounded-lg border text-[13px] font-medium transition-all ${
                    count === n
                      ? 'border-[#7aafda]/40 bg-[#7aafda]/10 text-[#7aafda]'
                      : 'border-[#242422] text-[#5a5a54] hover:border-[#2a2a28] hover:text-[#a8a8a0]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13.5px] font-semibold transition-all ${
              !loading && topic.trim()
                ? 'bg-[#e8e8e4] hover:bg-white text-[#0e0e0c]'
                : 'bg-[#1e1e1c] text-[#3a3a38] cursor-not-allowed'
            }`}
          >
            {loading ? (
              <><LoadingDots size="sm" /> Generating {count} cards…</>
            ) : (
              <><Sparkles size={14} /> Generate Flashcards</>
            )}
          </button>
        </div>

        {/* Deck */}
        {cards.length > 0 && (
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[13px] font-medium text-[#a8a8a0]">
                {cards.length} cards · <span className="text-[#5a5a54]">{topic}</span>
              </p>
              <button
                onClick={handleGenerate}
                className="text-[12.5px] text-[#5a5a54] hover:text-[#a8a8a0] border border-[#1e1e1c] hover:border-[#2a2a28] px-3 py-1.5 rounded-lg bg-[#141412] hover:bg-[#1a1a18] transition-all font-[450]"
              >
                Regenerate
              </button>
            </div>
            <FlashcardDeck cards={cards} topic={topic} />
          </div>
        )}
      </div>
    </PageShell>
  );
}
