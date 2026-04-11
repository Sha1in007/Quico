'use client';

import { useState, useEffect, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, Trophy, RotateCcw } from 'lucide-react';

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizPlayerProps {
  questions: QuizQuestion[];
  topic: string;
  difficulty: string;
  onRestart: () => void;
}

const TIME_PER_Q: Record<string, number> = { easy: 45, medium: 60, hard: 90 };

function getGrade(pct: number) {
  if (pct >= 90) return { label: 'Excellent!', color: 'text-[#7aba8a]' };
  if (pct >= 75) return { label: 'Good job!', color: 'text-[#c4a96e]' };
  if (pct >= 50) return { label: 'Keep practicing', color: 'text-[#c48a6e]' };
  return { label: 'Needs revision', color: 'text-[#c06060]' };
}

export default function QuizPlayer({ questions, topic, difficulty, onRestart }: QuizPlayerProps) {
  const timePerQ = TIME_PER_Q[difficulty] ?? 60;
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timePerQ);
  const [results, setResults] = useState<boolean[]>([]);

  const q = questions[idx];
  const total = questions.length;

  const handleAnswer = useCallback((optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
    const correct = optIdx === q.correct;
    if (correct) setScore((s) => s + 1);
    setResults((r) => [...r, correct]);
  }, [selected, q?.correct]);

  const handleNext = useCallback(() => {
    if (idx + 1 >= total) {
      setFinished(true);
    } else {
      setIdx((i) => i + 1);
      setSelected(null);
      setTimeLeft(timePerQ);
    }
  }, [idx, total, timePerQ]);

  // Countdown timer
  useEffect(() => {
    if (finished || selected !== null) return;
    if (timeLeft <= 0) { handleAnswer(-1); return; }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, finished, selected, handleAnswer]);

  if (!q && !finished) return null;

  // Score screen
  if (finished) {
    const pct = Math.round((score / total) * 100);
    const grade = getGrade(pct);
    return (
      <div className="flex flex-col items-center gap-6 py-8 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-[#1a1a18] border border-[#2a2a28] flex items-center justify-center">
          <Trophy size={28} className="text-[#c4a96e]" />
        </div>
        <div className="text-center">
          <p className="text-[13px] text-[#5a5a54] mb-1 font-[450]">{topic} · {difficulty}</p>
          <p className={`text-[28px] font-bold ${grade.color}`}>{pct}%</p>
          <p className={`text-[15px] font-medium mt-1 ${grade.color}`}>{grade.label}</p>
          <p className="text-[13px] text-[#5a5a54] mt-2">
            {score} correct out of {total} questions
          </p>
        </div>

        {/* Per-question results */}
        <div className="flex gap-1.5 flex-wrap justify-center">
          {results.map((r, i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                r ? 'bg-[#7aba8a]/15 text-[#7aba8a] border border-[#7aba8a]/20' :
                    'bg-[#c06060]/15 text-[#c06060] border border-[#c06060]/20'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#2a2a28] text-[13px] text-[#a8a8a0] hover:text-[#e8e8e4] hover:bg-[#1a1a18] transition-all font-[450]"
          >
            <RotateCcw size={13} />
            New Quiz
          </button>
          <button
            onClick={() => { setIdx(0); setSelected(null); setScore(0); setFinished(false); setTimeLeft(timePerQ); setResults([]); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#e8e8e4] hover:bg-white text-[#0e0e0c] text-[13px] font-semibold transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const timePct = (timeLeft / timePerQ) * 100;
  const timerColor = timePct > 50 ? '#7aba8a' : timePct > 25 ? '#c4a96e' : '#c06060';

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Header: progress + timer */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-[11.5px] text-[#4a4a48]">
            <span>Question {idx + 1} / {total}</span>
            <span className="capitalize">{difficulty}</span>
          </div>
          <div className="h-1 bg-[#1a1a18] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c4a96e] rounded-full transition-all duration-300"
              style={{ width: `${((idx + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Clock size={12} style={{ color: timerColor }} />
          <span className="font-mono text-[13px] font-medium" style={{ color: timerColor }}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="rounded-xl border border-[#2a2a28] bg-[#141412] p-5">
        <p className="text-[15px] font-[450] text-[#e0e0dc] leading-relaxed">{q.q}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correct;
          const isSelected = i === selected;
          const isWrong = isSelected && !isCorrect;
          const revealed = selected !== null;

          let style =
            'border-[#242422] bg-[#141412] text-[#c0c0bc] hover:border-[#3a3a38] hover:bg-[#1a1a18]';
          if (revealed && isCorrect)
            style = 'border-[#7aba8a]/40 bg-[#7aba8a]/10 text-[#7aba8a]';
          else if (isWrong)
            style = 'border-[#c06060]/40 bg-[#c06060]/10 text-[#c06060]';
          else if (revealed)
            style = 'border-[#1e1e1c] bg-[#0e0e0c] text-[#4a4a48] opacity-60';

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={revealed}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-[13.5px] font-[450] transition-all ${style} disabled:cursor-not-allowed`}
            >
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                revealed && isCorrect ? 'bg-[#7aba8a]/20 text-[#7aba8a]' :
                isWrong ? 'bg-[#c06060]/20 text-[#c06060]' :
                'bg-[#1e1e1c] text-[#5a5a54]'
              }`}>
                {revealed && isCorrect ? <CheckCircle size={14} /> :
                 isWrong ? <XCircle size={14} /> :
                 String.fromCharCode(65 + i)}
              </span>
              <span className="leading-snug">{opt.replace(/^[A-D]\.\s*/, '')}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation + Next */}
      {selected !== null && (
        <div className="animate-fade-in space-y-3">
          <div className="rounded-xl border border-[#2a2a28] bg-[#141412] p-4">
            <p className="text-[11.5px] font-semibold text-[#5a5a54] uppercase tracking-wider mb-1.5">
              Explanation
            </p>
            <p className="text-[13.5px] text-[#a8a8a0] leading-relaxed font-[450]">
              {q.explanation}
            </p>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-3 rounded-xl bg-[#e8e8e4] hover:bg-white text-[#0e0e0c] text-[13.5px] font-semibold transition-all"
          >
            {idx + 1 >= total ? 'See Results' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  );
}
