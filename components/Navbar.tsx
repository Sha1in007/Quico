'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LogOut, History, Zap, User, ChevronDown } from 'lucide-react';

interface NavbarProps {
  user: { name: string; email: string } | null;
  onToggleHistory: () => void;
  historyOpen: boolean;
}

export default function Navbar({ user, onToggleHistory, historyOpen }: NavbarProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out');
      router.push('/login');
    } catch {
      toast.error('Logout failed');
      setLoggingOut(false);
    }
  };

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-[#1e1e30] bg-[#080810]/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
            <Zap size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-white tracking-tight">Quico</span>
          <span className="hidden sm:block text-[11px] text-[#5050708] bg-[#1a1a2e] border border-[#252538] px-2 py-0.5 rounded-full text-[#7070a0]">
            AI Tools
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* History toggle */}
          <button
            onClick={onToggleHistory}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
              historyOpen
                ? 'bg-violet-600/20 text-violet-400 border border-violet-600/30'
                : 'text-[#8080a0] hover:text-white hover:bg-[#12121e] border border-transparent'
            }`}
          >
            <History size={15} />
            <span className="hidden sm:block">History</span>
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-[#252538] bg-[#12121e] hover:bg-[#1a1a2e] transition-all"
            >
              <div className="w-6 h-6 rounded-md bg-violet-600/30 border border-violet-600/40 flex items-center justify-center">
                <span className="text-[10px] font-bold text-violet-400">{initials}</span>
              </div>
              <span className="hidden sm:block text-sm text-[#c0c0d8] max-w-[120px] truncate">
                {user?.name || 'User'}
              </span>
              <ChevronDown
                size={13}
                className={`text-[#606080] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-52 bg-[#12121e] border border-[#252538] rounded-xl shadow-2xl z-20 overflow-hidden animate-fade-in">
                  <div className="px-4 py-3 border-b border-[#1e1e30]">
                    <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-[#6060808] text-[#606080] truncate mt-0.5">
                      {user?.email || 'No email'}
                    </p>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                    >
                      <LogOut size={14} />
                      {loggingOut ? 'Logging out...' : 'Log out'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
