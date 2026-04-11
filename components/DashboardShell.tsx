'use client';

import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import HistoryPanel from './HistoryPanel';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => null);
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e0c]">
      <Navbar
        user={user}
        onMenuToggle={() => setSidebarOpen((p) => !p)}
        sidebarOpen={sidebarOpen}
      />
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onHistoryOpen={() => setHistoryOpen(true)}
      />
      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onReuse={() => setHistoryOpen(false)}
      />
      {/* Main content area — offset for sidebar on lg+ */}
      <main className="lg:ml-56 pt-12 min-h-screen">
        {children}
      </main>
    </div>
  );
}
