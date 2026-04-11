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
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[360px] z-50 bg-[#0e0e0c] border-l border-[#1e1e1c] flex flex-col shadow-2xl transition-transform duration-250 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#1e1e1c]">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-[#d8d8d4] text-[14px] tracking-tight">History</h2>
            {history.length > 0 && (
              <span className="text-[11px] bg-[#1a1a18] border border-[#2a2a28] px-1.5 py-0.5 rounded-md text-[#5a5a54] font-mono">
                {history.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={clearAll}
                disabled={clearingAll}
                className="text-[12px] text-[#905050] hover:text-[#c06060] px-2 py-1 rounded-md hover:bg-[#2a1c1c] transition-all disabled:opacity-50 font-[450]"
              >
                {clearingAll ? 'Clearing…' : 'Clear all'}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-md flex items-center justify-center text-[#4a4a48] hover:text-[#a8a8a0] hover:bg-[#1a1a18] transition-all"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* History list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={16} className="text-[#4a4a48] animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#141412] border border-[#2a2a28] flex items-center justify-center mb-3">
                <Clock size={16} className="text-[#3a3a38]" />
              </div>
              <p className="text-[13px] text-[#4a4a48] font-[450]">No history yet</p>
              <p className="text-[12px] text-[#3a3a38] mt-1">Your queries will show up here</p>
            </div>
          ) : (
            <div className="p-2 flex flex-col gap-1">
              {history.map((entry) => (
                <div
                  key={entry._id}
                  className="group rounded-lg border border-transparent hover:border-[#242422] hover:bg-[#141412] transition-all p-3"
                >
                  {/* Intent badge + time */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11.5px] text-[#5a5a54] flex items-center gap-1 font-[450]">
                      <span>{entry.emoji}</span>
                      {entry.label}
                    </span>
                    <span className="text-[11px] text-[#3a3a38] font-mono">
                      {timeAgo(entry.createdAt)}
                    </span>
                  </div>

                  {/* Query */}
                  <p className="text-[13px] text-[#a8a8a0] line-clamp-2 leading-relaxed mb-2.5 font-[450]">
                    {entry.query}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        onReuse(entry.query);
                        onClose();
                      }}
                      className="flex items-center gap-1 text-[12px] text-[#7a9a7a] hover:text-[#9abc9a] px-2 py-1 rounded-md hover:bg-[#1a221a] transition-all font-[450]"
                    >
                      <RotateCcw size={10} />
                      Reuse
                    </button>
                    <button
                      onClick={() => deleteEntry(entry._id)}
                      disabled={deletingId === entry._id}
                      className="flex items-center gap-1 text-[12px] text-[#905050] hover:text-[#c06060] px-2 py-1 rounded-md hover:bg-[#2a1c1c] transition-all disabled:opacity-50 font-[450]"
                    >
                      {deletingId === entry._id ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <Trash2 size={10} />
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
