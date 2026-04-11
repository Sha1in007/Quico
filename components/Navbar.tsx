'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LogOut, Clock, ChevronDown } from 'lucide-react';

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
    <nav className="fixed top-0 left-0 right-0 z-50 h-12 border-b border-[#1e1e1c] bg-[#0e0e0c]/90 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-5 h-full flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#e8e8e4] tracking-tight text-[15px]">Quico</span>
          <span className="text-[#3a3a38]">/</span>
          <span className="text-[13px] text-[#5a5a54]">{user?.name?.split(' ')[0] || 'workspace'}</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          {/* History toggle */}
          <button
            onClick={onToggleHistory}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[13px] transition-all font-medium ${
              historyOpen
                ? 'bg-[#1e1e1c] text-[#e0e0dc]'
                : 'text-[#6a6a64] hover:text-[#c0c0bc] hover:bg-[#161614]'
            }`}
          >
            <Clock size={13} />
            <span className="hidden sm:block">History</span>
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#2a2a28] bg-[#161614] hover:bg-[#1e1e1c] transition-all text-[13px] font-medium text-[#c0c0bc]"
            >
              <div className="w-5 h-5 rounded-full bg-[#2e2e2c] flex items-center justify-center flex-shrink-0">
                <span className="text-[9px] font-bold text-[#a0a09a]">{initials}</span>
              </div>
              <span className="hidden sm:block max-w-[100px] truncate">
                {user?.name || 'User'}
              </span>
              <ChevronDown
                size={11}
                className={`text-[#4a4a48] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#161614] border border-[#2a2a28] rounded-lg shadow-xl z-20 overflow-hidden">
                  <div className="px-3.5 py-2.5 border-b border-[#1e1e1c]">
                    <p className="text-[13px] font-medium text-[#e0e0dc] truncate">{user?.name || 'User'}</p>
                    <p className="text-[12px] text-[#5a5a54] truncate mt-0.5">
                      {user?.email || ''}
                    </p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[13px] text-[#c06060] hover:bg-[#2a1c1c] transition-all disabled:opacity-50 font-medium"
                    >
                      <LogOut size={13} />
                      {loggingOut ? 'Logging out…' : 'Log out'}
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
