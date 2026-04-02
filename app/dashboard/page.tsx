'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import CommandInput from '@/components/CommandInput';
import OutputCard from '@/components/OutputCard';
import HistoryPanel from '@/components/HistoryPanel';
import { Sparkles, FileText, Code2, Mail, Lightbulb } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AIOutput {
  query: string;
  result: string;
  label: string;
  emoji: string;
}

const TOOLS = [
  {
    icon: FileText,
    label: 'Summarize',
    description: 'Condense any text into key points',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    example: 'Summarize this: ',
  },
  {
    icon: Code2,
    label: 'Explain Code',
    description: 'Understand any code snippet',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20',
    example: 'Explain this code: ',
  },
  {
    icon: Mail,
    label: 'Write Email',
    description: 'Draft professional emails fast',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/20',
    example: 'Write a formal email for ',
  },
  {
    icon: Lightbulb,
    label: 'Generate Ideas',
    description: 'Brainstorm startup & project ideas',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/20',
    example: 'Give me startup ideas for ',
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [query, setQuery] = useState('');
  const [output, setOutput] = useState<AIOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Fetch current user
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => null);
  }, []);

  const handleSubmit = async () => {
    const trimmed = query.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setOutput(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      setOutput({
        query: trimmed,
        result: data.result,
        label: data.label,
        emoji: data.emoji,
      });

      setQuery('');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReuseQuery = (q: string) => {
    setQuery(q);
  };

  const handleToolClick = (example: string) => {
    setQuery(example);
  };

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="min-h-screen bg-[#080810]">
      <Navbar
        user={user}
        onToggleHistory={() => setHistoryOpen((p) => !p)}
        historyOpen={historyOpen}
      />

      {/* History panel */}
      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onReuse={handleReuseQuery}
      />

      {/* Main content */}
      <main className="pt-14 min-h-screen flex flex-col">
        <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-10 flex flex-col gap-8">

          {/* Hero section — shown when no output */}
          {!output && !loading && (
            <div className="text-center pt-6 animate-fade-in">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-600/15 border border-violet-600/25 mb-5 shadow-lg shadow-violet-600/10">
                <Sparkles size={26} className="text-violet-400" />
              </div>

              {/* Greeting */}
              <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-2">
                Hi {firstName} 👋
              </h1>
              <p className="text-[#6666aa] text-base max-w-md mx-auto leading-relaxed">
                What do you want to do today? Type anything or pick a tool below.
              </p>
            </div>
          )}

          {/* Command Input */}
          <div className={`${output || loading ? 'pt-4' : ''}`}>
            <CommandInput
              value={query}
              onChange={setQuery}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>

          {/* Output card */}
          {(output || loading) && (
            <OutputCard
              query={output?.query || query}
              result={output?.result || null}
              label={output?.label || null}
              emoji={output?.emoji || null}
              loading={loading}
            />
          )}

          {/* Tool cards — shown when no output */}
          {!output && !loading && (
            <div className="animate-fade-in">
              <p className="text-xs font-medium text-[#555570] uppercase tracking-widest mb-3 text-center">
                Available Tools
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.label}
                      onClick={() => handleToolClick(tool.example)}
                      className={`group flex flex-col items-start gap-2.5 p-4 rounded-xl border bg-[#0f0f1a] hover:bg-[#161625] transition-all duration-200 text-left ${tool.border} hover:border-opacity-60`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${tool.bg} border ${tool.border} flex items-center justify-center`}>
                        <Icon size={16} className={tool.color} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white leading-tight">{tool.label}</p>
                        <p className="text-xs text-[#5555708] text-[#555570] mt-0.5 leading-snug">
                          {tool.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* New query button after output */}
          {output && !loading && (
            <div className="text-center animate-fade-in">
              <button
                onClick={() => {
                  setOutput(null);
                  setQuery('');
                }}
                className="text-sm text-[#6666aa] hover:text-violet-400 transition-colors border border-[#252538] hover:border-violet-500/40 px-5 py-2.5 rounded-xl bg-[#0f0f1a] hover:bg-[#1a1a2e]"
              >
                ✦ Ask something else
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center py-6 text-xs text-[#333350] border-t border-[#0f0f1a]">
          Quico — built with Next.js, MongoDB & Claude AI
        </footer>
      </main>
    </div>
  );
}
