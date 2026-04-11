'use client';

import { useState, useMemo } from 'react';
import { Shuffle, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

export interface Flashcard {
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface FlashcardDeckProps {
  cards: Flashcard[];
  topic: string;
}

const DIFF_STYLE = {
  easy: 'text-[#7aba8a] bg-[#7aba8a]/10 border-[#7aba8a]/20',
  medium: 'text-[#c4a96e] bg-[#c4a96e]/10 border-[#c4a96e]/20',
  hard: 'text-[#c48a6e] bg-[#c48a6e]/10 border-[#c48a6e]/20',
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashcardDeck({ cards, topic }: FlashcardDeckProps) {
  const [deck, setDeck] = useState<Flashcard[]>(cards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? deck : deck.filter((c) => c.difficulty === filter)),
    [deck, filter],
  );

  const card = filtered[index];
  const total = filtered.length;

  const goTo = (i: number) => { setIndex(i); setFlipped(false); };
  const prev = () => { if (index > 0) goTo(index - 1); };
  const next = () => { if (index < total - 1) goTo(index + 1); };
  const doShuffle = () => { setDeck(shuffle(deck)); setIndex(0); setFlipped(false); };

  const counts = useMemo(() => ({
    easy: cards.filter((c) => c.difficulty === 'easy').length,
    medium: cards.filter((c) => c.difficulty === 'medium').length,
    hard: cards.filter((c) => c.difficulty === 'hard').length,
  }), [cards]);

  if (!card) return (
    <div className="text-center py-12 text-[#4a4a48] text-[13px]">
      No cards match this filter.
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Controls row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Filter tabs */}
        <div className="flex items-center gap-1">
          {(['all', 'easy', 'medium', 'hard'] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setIndex(0); setFlipped(false); }}
              className={`px-2.5 py-1 rounded-md text-[12px] font-[450] transition-all capitalize ${
                filter === f
                  ? 'bg-[#2a2a28] text-[#e8e8e4]'
                  : 'text-[#5a5a54] hover:text-[#a8a8a0] hover:bg-[#1a1a18]'
              }`}
            >
              {f === 'all' ? `All (${cards.length})` :
               f === 'easy' ? `Easy (${counts.easy})` :
               f === 'medium' ? `Medium (${counts.medium})` :
               `Hard (${counts.hard})`}
            </button>
          ))}
        </div>

        {/* Shuffle */}
        <button
          onClick={doShuffle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2a2a28] text-[12.5px] text-[#5a5a54] hover:text-[#a8a8a0] hover:bg-[#1a1a18] transition-all font-[450]"
        >
          <Shuffle size={12} />
          Shuffle
        </button>
      </div>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11.5px] text-[#4a4a48]">
          <span>Card {index + 1} of {total}</span>
          <span className="font-mono">{Math.round(((index + 1) / total) * 100)}%</span>
        </div>
        <div className="h-1 bg-[#1a1a18] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#c4a96e] rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Card with 3D flip */}
      <div
        style={{ perspective: '1200px' }}
        onClick={() => setFlipped((f) => !f)}
        className="cursor-pointer select-none"
      >
        <div
          style={{
            position: 'relative',
            height: '280px',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.55s cubic-bezier(0.45, 0, 0.55, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front — Question */}
          <div
            style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}
            className="rounded-2xl border border-[#2a2a28] bg-[#141412] flex flex-col items-center justify-center p-8 gap-4"
          >
            <span className="text-[10.5px] font-semibold text-[#3a3a38] uppercase tracking-widest">
              Question
            </span>
            <p className="text-[16px] font-[450] text-[#e0e0dc] text-center leading-relaxed">
              {card.question}
            </p>
            <span className="text-[11px] text-[#3a3a38] mt-2">Tap to reveal answer</span>
          </div>

          {/* Back — Answer */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              position: 'absolute',
              inset: 0,
              transform: 'rotateY(180deg)',
            }}
            className="rounded-2xl border border-[#2e2e2a] bg-[#1a1a14] flex flex-col items-center justify-center p-8 gap-4"
          >
            <span className="text-[10.5px] font-semibold text-[#4a4a3a] uppercase tracking-widest">
              Answer
            </span>
            <p className="text-[15px] font-[450] text-[#d8d8c8] text-center leading-relaxed">
              {card.answer}
            </p>
            <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md border capitalize ${DIFF_STYLE[card.difficulty]}`}>
              {card.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={prev}
          disabled={index === 0}
          className="w-9 h-9 rounded-lg border border-[#2a2a28] flex items-center justify-center text-[#5a5a54] hover:text-[#a8a8a0] hover:bg-[#1a1a18] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          onClick={() => { setIndex(0); setFlipped(false); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#2a2a28] text-[12px] text-[#5a5a54] hover:text-[#a8a8a0] hover:bg-[#1a1a18] transition-all font-[450]"
        >
          <RotateCcw size={11} />
          Reset
        </button>

        <button
          onClick={next}
          disabled={index === total - 1}
          className="w-9 h-9 rounded-lg border border-[#2a2a28] flex items-center justify-center text-[#5a5a54] hover:text-[#a8a8a0] hover:bg-[#1a1a18] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
