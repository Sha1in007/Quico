'use client';

import { ExternalLink, Clock } from 'lucide-react';

export interface VideoCardData {
  title: string;
  channel: string;
  url: string;
  duration: string;
  lang: 'hindi' | 'english';
  description: string;
}

export default function VideoCard({ title, channel, url, duration, lang, description }: VideoCardData) {
  return (
    <div className="group rounded-xl border border-[#1e1e1c] bg-[#141412] hover:border-[#2a2a28] hover:bg-[#1a1a18] transition-all overflow-hidden">
      {/* Thumbnail placeholder */}
      <div className="relative w-full aspect-video bg-[#0e0e0c] border-b border-[#1a1a18] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-[#1e1e1c] border border-[#2a2a28] flex items-center justify-center">
          <div className="w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-l-[13px] border-l-[#c4a96e] ml-1" />
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-[#0e0e0c]/90 px-1.5 py-0.5 rounded text-[10px] text-[#a8a8a0] font-mono">
          <Clock size={9} />
          {duration}
        </div>
        {/* Language badge */}
        <div className={`absolute top-2 left-2 text-[10px] font-medium px-1.5 py-0.5 rounded border ${
          lang === 'hindi'
            ? 'text-[#c48a6e] bg-[#c48a6e]/10 border-[#c48a6e]/20'
            : 'text-[#7aafda] bg-[#7aafda]/10 border-[#7aafda]/20'
        }`}>
          {lang === 'hindi' ? 'हिंदी' : 'English'}
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5 flex flex-col gap-2">
        <p className="text-[13px] font-medium text-[#d8d8d4] leading-snug line-clamp-2">{title}</p>
        <p className="text-[11.5px] text-[#5a5a54] font-[450]">{channel}</p>
        {description && (
          <p className="text-[11.5px] text-[#4a4a48] leading-relaxed line-clamp-2">{description}</p>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg border border-[#2a2a28] text-[12px] font-medium text-[#a8a8a0] hover:text-[#e8e8e4] hover:border-[#3a3a38] hover:bg-[#222220] transition-all mt-1"
        >
          <ExternalLink size={11} />
          Watch on YouTube
        </a>
      </div>
    </div>
  );
}
