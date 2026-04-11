'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import CommandInput from '@/components/CommandInput';
import OutputCard from '@/components/OutputCard';
import HistoryPanel from '@/components/HistoryPanel';
import { FileText, Code2, Mail, Lightbulb } from 'lucide-react';

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
    description: 'Condense text into key points',
    color: 'text-[#7aafda]',
    example: 'Summarize this: ',
  },
  {
    icon: Code2,
    label: 'Explain Code',
    description: 'Break down any code snippet',
    color: 'text-[#7aba8a]',
    example: 'Explain this code: ',
  },
  {
    icon: Mail,
    label: 'Write Email',
    description: 'Draft professional emails',
    color: 'text-[#c4a96e]',
    example: 'Write a formal email for ',
  },
  {
    icon: Lightbulb,
    label: 'Generate Ideas',
    description: 'Brainstorm startup ideas',
    color: 'text-[#c48a6e]',
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
    <div className="min-h-screen bg-[#0e0e0c]">
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
      <main className="pt-12 min-h-screen flex flex-col">
        <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-10 flex flex-col gap-6">

          {/* Greeting — shown when no output */}
          {!output && !loading && (
            <div className="pt-8 animate-fade-in">
              <h1 className="text-[22px] font-semibold text-[#e8e8e4] tracking-tight mb-1">
                Hey {firstName}
              </h1>
              <p className="text-[14px] text-[#5a5a54] font-[450]">
                What do you need help with today?
              </p>
            </div>
          )}

          {/* Command Input */}
          <div className={output || loading ? 'pt-2' : ''}>
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
              <p className="text-[11px] font-medium text-[#3a3a38] uppercase tracking-widest mb-2.5">
                Tools
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.label}
                      onClick={() => handleToolClick(tool.example)}
                      className="group flex flex-col items-start gap-2 p-3 rounded-xl border border-[#1e1e1c] bg-[#141412] hover:bg-[#1a1a18] hover:border-[#2a2a28] transition-all duration-150 text-left"
                    >
                      <Icon size={14} className={tool.color} strokeWidth={1.75} />
                      <div>
                        <p className="text-[12.5px] font-medium text-[#c8c8c4] leading-tight">{tool.label}</p>
                        <p className="text-[11.5px] text-[#4a4a48] mt-0.5 leading-snug font-[450]">
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
            <div className="animate-fade-in">
              <button
                onClick={() => {
                  setOutput(null);
                  setQuery('');
                }}
                className="text-[13px] text-[#5a5a54] hover:text-[#a8a8a0] transition-colors border border-[#1e1e1c] hover:border-[#2a2a28] px-4 py-2 rounded-lg bg-[#141412] hover:bg-[#1a1a18] font-[450]"
              >
                Ask something else
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center py-5 text-[11.5px] text-[#2e2e2c] border-t border-[#141412]">
          Quico · Next.js, MongoDB, Claude
        </footer>
      </main>
    </div>
  );
}
