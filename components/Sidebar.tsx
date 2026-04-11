'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, MessageCircle, Layers, CheckSquare,
  GitBranch, FileText, Search, BookOpen, PlayCircle, Clock, GraduationCap,
} from 'lucide-react';

const NAV = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/qa', label: 'Q&A Revision', icon: MessageCircle },
  { href: '/dashboard/flashcards', label: 'Flashcards', icon: Layers },
  { href: '/dashboard/quiz', label: 'Quiz', icon: CheckSquare },
  { href: '/dashboard/mindmap', label: 'Mind Map', icon: GitBranch },
  { href: '/dashboard/summary', label: 'Summary', icon: FileText },
  { href: '/dashboard/notes', label: 'Notes Finder', icon: Search },
  { href: '/dashboard/pyq', label: 'Past Papers', icon: BookOpen },
  { href: '/dashboard/youtube', label: 'YouTube', icon: PlayCircle },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onHistoryOpen: () => void;
}

export default function Sidebar({ open, onClose, onHistoryOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-12 left-0 h-[calc(100vh-48px)] w-56 z-40 bg-[#0e0e0c] border-r border-[#1a1a18] flex flex-col transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          <p className="px-2.5 pb-1 pt-1 text-[10px] font-semibold text-[#3a3a38] uppercase tracking-widest">
            Study Tools
          </p>

          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href) && pathname !== '/dashboard';
            const isHome = href === '/dashboard' && pathname === '/dashboard';
            const isActive = isHome || (!exact && active);

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-[450] transition-all duration-100 ${
                  isActive
                    ? 'bg-[#1e1e1c] text-[#e8e8e4]'
                    : 'text-[#5a5a54] hover:text-[#b0b0ac] hover:bg-[#141412]'
                }`}
              >
                <Icon
                  size={14}
                  className={isActive ? 'text-[#c4a96e]' : 'text-current'}
                  strokeWidth={isActive ? 2 : 1.75}
                />
                {label}
              </Link>
            );
          })}

          <div className="pt-2">
            <p className="px-2.5 pb-1 pt-1 text-[10px] font-semibold text-[#3a3a38] uppercase tracking-widest">
              More
            </p>
            <button
              onClick={() => { onHistoryOpen(); onClose(); }}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-[450] text-[#5a5a54] hover:text-[#b0b0ac] hover:bg-[#141412] transition-all duration-100"
            >
              <Clock size={14} strokeWidth={1.75} />
              History
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[#1a1a18]">
          <div className="flex items-center gap-2 px-2 py-1">
            <GraduationCap size={12} className="text-[#c4a96e]" />
            <span className="text-[11px] text-[#3a3a38] font-[450]">Quico Study Platform</span>
          </div>
        </div>
      </aside>
    </>
  );
}
