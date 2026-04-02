'use client';

import { useEffect, useState } from 'react';
import { X, Trash2, Clock, Loader2, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

interface HistoryEntry {
  _id: string;
  query: string;
  result: string;
  intent: string;
  label: string;
  emoji: string;
  createdAt: string;
}

interface HistoryPanelProps {
  open: boolean;
  onClose: () => void;
  onReuse: (query: string) => void;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function HistoryPanel({ open, onClose, onReuse }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [clearingAll, setClearingAll] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      setHistory(data.history || []);
    } catch {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchHistory();
  }, [open]);

  const deleteEntry = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch('/api/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setHistory((prev) => prev.filter((h) => h._id !== id));
        toast.success('Deleted');
      }
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const clearAll = async () => {
    if (!confirm('Clear all history? This cannot be undone.')) return;
    setClearingAll(true);
    try {
      const res = await fetch('/api/history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
      if (res.ok) {
        setHistory([]);
        toast.success('History cleared');
      }
    } catch {
      toast.error('Failed to clear history');
    } finally {
      setClearingAll(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] z-50 bg-[#0c0c18] border-l border-[#1e1e30] flex flex-col shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e30]">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-violet-400" />
            <h2 className="font-semibold text-white">History</h2>
            {history.length > 0 && (
              <span className="text-xs bg-[#1a1a2e] border border-[#252538] px-2 py-0.5 rounded-full text-[#7070a0]">
                {history.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={clearAll}
                disabled={clearingAll}
                className="text-xs text-red-400/70 hover:text-red-400 px-2 py-1 rounded-lg hover:bg-red-400/10 transition-all disabled:opacity-50"
              >
                {clearingAll ? 'Clearing...' : 'Clear all'}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6060808] text-[#606080] hover:text-white hover:bg-[#1a1a2e] transition-all"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* History list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={20} className="text-violet-400 animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-5 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#12121e] border border-[#252538] flex items-center justify-center mb-3">
                <Clock size={20} className="text-[#404060]" />
              </div>
              <p className="text-sm text-[#606080]">No history yet</p>
              <p className="text-xs text-[#404060] mt-1">Your queries will appear here</p>
            </div>
          ) : (
            <div className="p-3 flex flex-col gap-2">
              {history.map((entry) => (
                <div
                  key={entry._id}
                  className="group rounded-xl border border-[#1e1e30] bg-[#12121e] hover:border-[#252538] hover:bg-[#161625] transition-all p-3.5"
                >
                  {/* Intent badge + time */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#7070a0] flex items-center gap-1">
                      <span>{entry.emoji}</span>
                      {entry.label}
                    </span>
                    <span className="text-[11px] text-[#404060]">
                      {timeAgo(entry.createdAt)}
                    </span>
                  </div>

                  {/* Query */}
                  <p className="text-sm text-[#c0c0d8] line-clamp-2 leading-relaxed mb-3">
                    {entry.query}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        onReuse(entry.query);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 bg-violet-400/10 hover:bg-violet-400/20 px-2.5 py-1.5 rounded-lg transition-all"
                    >
                      <RotateCcw size={11} />
                      Reuse
                    </button>
                    <button
                      onClick={() => deleteEntry(entry._id)}
                      disabled={deletingId === entry._id}
                      className="flex items-center gap-1.5 text-xs text-red-400/70 hover:text-red-400 bg-red-400/5 hover:bg-red-400/10 px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50"
                    >
                      {deletingId === entry._id ? (
                        <Loader2 size={11} className="animate-spin" />
                      ) : (
                        <Trash2 size={11} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
