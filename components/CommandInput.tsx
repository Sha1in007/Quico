'use client';

import { useRef, useEffect, KeyboardEvent } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';
import LoadingDots from './LoadingDots';

interface CommandInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

const SUGGESTIONS = [
  { label: 'Summarize', example: 'Summarize this: ', emoji: '📝' },
  { label: 'Explain Code', example: 'Explain this code: ', emoji: '💻' },
  { label: 'Write Email', example: 'Write a formal email for ', emoji: '✉️' },
  { label: 'Generate Ideas', example: 'Give me startup ideas for ', emoji: '💡' },
];

export default function CommandInput({
  value,
  onChange,
  onSubmit,
  loading,
}: CommandInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [value]);

  // Focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && value.trim()) onSubmit();
    }
  };

  const handleSuggestion = (example: string) => {
    onChange(example);
    textareaRef.current?.focus();
  };

  return (
    <div className="w-full">
      {/* Main input box */}
      <div
        className={`relative rounded-2xl border transition-all duration-200 bg-[#0f0f1a] ${
          value
            ? 'border-violet-600/50 glow-violet'
            : 'border-[#252538] hover:border-[#363656]'
        }`}
      >
        <div className="flex items-start gap-3 p-4">
          <div className="mt-0.5 flex-shrink-0">
            <Sparkles size={18} className="text-violet-400" />
          </div>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              'Ask anything — summarize text, explain code, write an email, generate ideas...'
            }
            disabled={loading}
            rows={1}
            className="flex-1 bg-transparent text-white placeholder-[#505068] text-[15px] resize-none outline-none leading-relaxed disabled:opacity-60"
          />

          <button
            onClick={onSubmit}
            disabled={loading || !value.trim()}
            className={`flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              value.trim() && !loading
                ? 'bg-violet-600 hover:bg-violet-500 text-white'
                : 'bg-[#1a1a2e] text-[#404060] cursor-not-allowed'
            }`}
          >
            {loading ? <LoadingDots size="sm" /> : <ArrowUp size={16} strokeWidth={2.5} />}
          </button>
        </div>

        {/* Hint */}
        <div className="px-4 pb-3 flex items-center gap-2 text-[11px] text-[#404060]">
          <kbd className="bg-[#1a1a2e] border border-[#252538] px-1.5 py-0.5 rounded text-[10px]">
            ↵
          </kbd>
          <span>to send</span>
          <span className="mx-1">·</span>
          <kbd className="bg-[#1a1a2e] border border-[#252538] px-1.5 py-0.5 rounded text-[10px]">
            Shift+↵
          </kbd>
          <span>for new line</span>
        </div>
      </div>

      {/* Quick suggestion chips */}
      {!value && (
        <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => handleSuggestion(s.example)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-[#12121e] border border-[#252538] text-[#8080a0] hover:text-white hover:border-[#363656] hover:bg-[#1a1a2e] transition-all"
            >
              <span>{s.emoji}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
