'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageCircle, Layers, CheckSquare, GitBranch,
  FileText, Search, BookOpen, PlayCircle, ArrowRight,
} from 'lucide-react';

interface User { id: string; name: string; email: string; }

const TOOLS = [
  {
    href: '/dashboard/qa',
    icon: MessageCircle,
    label: 'Q&A Revision',
    description: 'Ask anything — short, long, or viva-style answers',
    accent: 'text-[#c4a96e]',
    border: 'hover:border-[#c4a96e]/30',
  },
  {
    href: '/dashboard/flashcards',
    icon: Layers,
    label: 'Flashcards',
    description: 'Generate flippable study cards from any topic',
    accent: 'text-[#7aafda]',
    border: 'hover:border-[#7aafda]/30',
  },
  {
    href: '/dashboard/quiz',
    icon: CheckSquare,
    label: 'Quiz',
    description: 'MCQ quizzes with timer, scoring, and explanations',
    accent: 'text-[#7aba8a]',
    border: 'hover:border-[#7aba8a]/30',
  },
  {
    href: '/dashboard/mindmap',
    icon: GitBranch,
    label: 'Mind Map',
    description: 'Visual mind maps from any subject or topic',
    accent: 'text-[#b89ada]',
    border: 'hover:border-[#b89ada]/30',
  },
  {
    href: '/dashboard/summary',
    icon: FileText,
    label: 'AI Summary',
    description: 'Short, exam-focused, or bullet-point summaries',
    accent: 'text-[#c4d07a]',
    border: 'hover:border-[#c4d07a]/30',
  },
  {
    href: '/dashboard/notes',
    icon: Search,
    label: 'Notes Finder',
    description: 'Find handwritten notes, PDFs, and topper notes',
    accent: 'text-[#7adac8]',
    border: 'hover:border-[#7adac8]/30',
  },
  {
    href: '/dashboard/pyq',
    icon: BookOpen,
    label: 'Past Papers',
    description: 'Previous year university question papers',
    accent: 'text-[#da9a7a]',
    border: 'hover:border-[#da9a7a]/30',
  },
  {
    href: '/dashboard/youtube',
    icon: PlayCircle,
    label: 'YouTube',
    description: 'Best study videos from top education channels',
    accent: 'text-[#da7a7a]',
    border: 'hover:border-[#da7a7a]/30',
  },
];

export default function DashboardHome() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => null);
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Greeting */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-[22px] font-semibold text-[#e8e8e4] tracking-tight mb-1">
          Hey {firstName} 👋
        </h1>
        <p className="text-[14px] text-[#5a5a54] font-[450]">
          What do you want to study today?
        </p>
      </div>

      {/* Tool grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 animate-fade-in">
        {TOOLS.map(({ href, icon: Icon, label, description, accent, border }) => (
          <Link
            key={href}
            href={href}
            className={`group flex flex-col gap-3 p-4 rounded-xl border border-[#1e1e1c] bg-[#141412] hover:bg-[#1a1a18] ${border} transition-all duration-150`}
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-[#1e1e1c] flex items-center justify-center">
                <Icon size={15} className={accent} strokeWidth={1.75} />
              </div>
              <ArrowRight
                size={13}
                className="text-[#3a3a38] group-hover:text-[#6a6a64] group-hover:translate-x-0.5 transition-all"
              />
            </div>
            <div>
              <p className="text-[13.5px] font-semibold text-[#d0d0cc] leading-tight">{label}</p>
              <p className="text-[12px] text-[#4a4a48] mt-0.5 leading-snug font-[450]">
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer hint */}
      <p className="text-center text-[11.5px] text-[#2a2a28] mt-12 font-[450]">
        Quico · Powered by Groq + llama-3.3-70b
      </p>
    </div>
  );
}
