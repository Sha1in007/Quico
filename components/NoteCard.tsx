'use client';

import { ExternalLink, Download, FileText, HardDrive, BookOpen, Star } from 'lucide-react';

export interface NoteCardData {
  title: string;
  source: string;
  type: 'drive' | 'pdf' | 'notes' | 'topper';
  url: string;
  description: string;
}

const TYPE_CONFIG = {
  drive: { label: 'Google Drive', icon: HardDrive, color: 'text-[#7aafda] bg-[#7aafda]/10 border-[#7aafda]/20' },
  pdf: { label: 'PDF', icon: FileText, color: 'text-[#c4a96e] bg-[#c4a96e]/10 border-[#c4a96e]/20' },
  notes: { label: 'Notes', icon: BookOpen, color: 'text-[#7aba8a] bg-[#7aba8a]/10 border-[#7aba8a]/20' },
  topper: { label: "Topper's", icon: Star, color: 'text-[#c48a6e] bg-[#c48a6e]/10 border-[#c48a6e]/20' },
};

export default function NoteCard({ title, source, type, url, description }: NoteCardData) {
  const cfg = TYPE_CONFIG[type] ?? TYPE_CONFIG.notes;
  const Icon = cfg.icon;

  return (
    <div className="group rounded-xl border border-[#1e1e1c] bg-[#141412] hover:border-[#2a2a28] hover:bg-[#1a1a18] transition-all p-4 flex flex-col gap-3">
      {/* Badge + source */}
      <div className="flex items-center justify-between gap-2">
        <span className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-md border ${cfg.color}`}>
          <Icon size={10} />
          {cfg.label}
        </span>
        <span className="text-[11px] text-[#3a3a38] font-[450] truncate">{source}</span>
      </div>

      {/* Title */}
      <p className="text-[13.5px] font-medium text-[#d8d8d4] leading-snug line-clamp-2">{title}</p>

      {/* Description */}
      {description && (
        <p className="text-[12px] text-[#5a5a54] leading-relaxed line-clamp-2 font-[450]">
          {description}
        </p>
      )}

      {/* Action button */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-[#2a2a28] text-[12.5px] font-medium text-[#a8a8a0] hover:text-[#e8e8e4] hover:border-[#3a3a38] hover:bg-[#222220] transition-all"
      >
        <ExternalLink size={12} />
        Open / Search
      </a>
    </div>
  );
}
