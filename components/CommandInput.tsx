'use client';

import { useRef, useEffect, KeyboardEvent } from 'react';
import { ArrowUp } from 'lucide-react';
import LoadingDots from './LoadingDots';

interface CommandInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

const SUGGESTIONS = [
  { label: 'Summarize', example: 'Summarize this: ', emoji: '📝' },
  { label: 'Explain code', example: 'Explain this code: ', emoji: '💻' },
  { label: 'Write email', example: 'Write a formal email for ', emoji: '✉️' },
  { label: 'Brainstorm ideas', example: 'Give me startup ideas for ', emoji: '💡' },
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
    ta.style.height = `${Math.min(ta.scrollHeight, 220)}px`;
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
        className={`relative rounded-xl border transition-all duration-150 bg-[#141412] input-focus ${
          value
            ? 'border-[#3a3a38]'
            : 'border-[#262624] hover:border-[#323230]'
        }`}
      >
        <div className="flex items-start gap-3 px-4 pt-3.5 pb-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything — summarize, explain code, write an email…"
            disabled={loading}
            rows={1}
            className="flex-1 bg-transparent text-[#e0e0dc] placeholder-[#3e3e3a] text-[14.5px] resize-none outline-none leading-relaxed disabled:opacity-50 font-[450]"
          />

          <button
            onClick={onSubmit}
            disabled={loading || !value.trim()}
            className={`flex-shrink-0 w-7 h-7 mt-0.5 rounded-lg flex items-center justify-center transition-all ${
              value.trim() && !loading
                ? 'bg-[#e8e8e4] hover:bg-white text-[#0e0e0c]'
                : 'bg-[#1e1e1c] text-[#3a3a38] cursor-not-allowed'
            }`}
          >
            {loading ? <LoadingDots size="sm" /> : <ArrowUp size={14} strokeWidth={2.5} />}
          </button>
        </div>

        {/* Hint */}
        <div className="px-4 pb-3 pt-1 flex items-center gap-2 text-[11px] text-[#3a3a38]">
          <kbd className="bg-[#1e1e1c] border border-[#2a2a28] px-1.5 py-0.5 rounded text-[10px] font-mono">↵</kbd>
          <span>send</span>
          <span className="opacity-50">·</span>
          <kbd className="bg-[#1e1e1c] border border-[#2a2a28] px-1.5 py-0.5 rounded text-[10px] font-mono">⇧↵</kbd>
          <span>new line</span>
        </div>
      </div>

      {/* Quick suggestion chips */}
      {!value && (
        <div className="flex flex-wrap gap-1.5 mt-2.5 animate-fade-in">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => handleSuggestion(s.example)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12.5px] bg-[#141412] border border-[#242422] text-[#5a5a54] hover:text-[#a8a8a0] hover:border-[#323230] hover:bg-[#1a1a18] transition-all font-[450]"
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
