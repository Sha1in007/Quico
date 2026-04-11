'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import PageShell from '@/components/PageShell';
import QuizPlayer, { QuizQuestion } from '@/components/QuizPlayer';
import LoadingDots from '@/components/LoadingDots';
import { CheckSquare, Zap } from 'lucide-react';

const DIFFICULTY_OPTIONS = [
  { id: 'easy', label: 'Easy', desc: 'Recall & definitions', color: 'text-[#7aba8a] border-[#7aba8a]/40 bg-[#7aba8a]/10' },
  { id: 'medium', label: 'Medium', desc: 'Application & understanding', color: 'text-[#c4a96e] border-[#c4a96e]/40 bg-[#c4a96e]/10' },
  { id: 'hard', label: 'Hard', desc: 'Analysis & comparison', color: 'text-[#c48a6e] border-[#c48a6e]/40 bg-[#c48a6e]/10' },
] as const;

const COUNT_OPTIONS = [5, 10, 15, 20];

type Difficulty = typeof DIFFICULTY_OPTIONS[number]['id'];

export default function QuizPage() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return toast.error('Enter a topic first');
    setLoading(true);
    setQuestions([]);
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, difficulty, count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (!data.questions?.length) throw new Error('No questions generated');
      setQuestions(data.questions);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Quiz Generator"
      description="Instant MCQ quizzes with timer and explanations"
      icon={<CheckSquare size={18} />}
    >
      <div className="space-y-5">
        {/* Config (always visible) */}
        <div className="rounded-xl border border-[#242422] bg-[#141412] p-4 space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-[#6a6a64] mb-1.5">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder="e.g. Operating Systems, Data Structures, Organic Chemistry..."
              className="w-full bg-[#0e0e0c] border border-[#242422] rounded-lg px-3.5 py-2.5 text-[13.5px] text-[#e0e0dc] placeholder-[#3a3a38] outline-none focus:border-[#3a3a38] transition-colors font-[450]"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-[12px] font-medium text-[#6a6a64] mb-2">Difficulty</label>
            <div className="flex gap-2 flex-wrap">
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`flex flex-col px-3.5 py-2 rounded-xl border text-left transition-all ${
                    difficulty === d.id
                      ? d.color
                      : 'border-[#242422] text-[#5a5a54] hover:border-[#2a2a28] hover:text-[#a8a8a0]'
                  }`}
                >
                  <span className="text-[13px] font-medium">{d.label}</span>
                  <span className="text-[11px] opacity-70">{d.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <div>
            <label className="block text-[12px] font-medium text-[#6a6a64] mb-2">Questions</label>
            <div className="flex gap-2">
              {COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`px-3 py-1.5 rounded-lg border text-[13px] font-medium transition-all ${
                    count === n
                      ? 'border-[#c4a96e]/40 bg-[#c4a96e]/10 text-[#c4a96e]'
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
              <><LoadingDots size="sm" /> Generating {count} questions…</>
            ) : (
              <><Zap size={14} /> Start Quiz</>
            )}
          </button>
        </div>

        {/* Quiz player */}
        {questions.length > 0 && (
          <div className="animate-slide-up">
            <QuizPlayer
              questions={questions}
              topic={topic}
              difficulty={difficulty}
              onRestart={() => setQuestions([])}
            />
          </div>
        )}
      </div>
    </PageShell>
  );
}
