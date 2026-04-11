'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LogOut, Menu, ChevronDown, X } from 'lucide-react';

interface NavbarProps {
  user: { name: string; email: string } | null;
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

export default function Navbar({ user, onMenuToggle, sidebarOpen }: NavbarProps) {
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

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-12 border-b border-[#1a1a18] bg-[#0e0e0c]/95 backdrop-blur-xl">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left: hamburger + brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-[#5a5a54] hover:text-[#c0c0bc] hover:bg-[#141412] transition-all"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <span className="font-semibold text-[#e8e8e4] tracking-tight text-[14.5px]">Quico</span>
          <span className="hidden sm:block text-[11px] bg-[#1a1a18] border border-[#2a2a28] px-2 py-0.5 rounded-md text-[#5a5a54] font-[450]">
            Study
          </span>
        </div>

        {/* Right: user dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#242422] bg-[#141412] hover:bg-[#1a1a18] transition-all text-[13px] font-[450] text-[#c0c0bc]"
          >
            <div className="w-5 h-5 rounded-full bg-[#2a2a28] flex items-center justify-center flex-shrink-0">
              <span className="text-[9px] font-bold text-[#a0a09a]">{initials}</span>
            </div>
            <span className="hidden sm:block max-w-[100px] truncate">{user?.name || 'User'}</span>
            <ChevronDown
              size={11}
              className={`text-[#4a4a48] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-[#141412] border border-[#2a2a28] rounded-lg shadow-xl z-20 overflow-hidden">
                <div className="px-3.5 py-2.5 border-b border-[#1e1e1c]">
                  <p className="text-[13px] font-medium text-[#e0e0dc] truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-[12px] text-[#5a5a54] truncate mt-0.5">{user?.email || ''}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[13px] text-[#c06060] hover:bg-[#2a1c1c] transition-all disabled:opacity-50 font-[450]"
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
    </nav>
  );
}
