'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface PageShellProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function PageShell({
  title,
  description,
  icon,
  children,
  actions,
}: PageShellProps) {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto px-4 py-7">
      {/* Back button */}
      <button
        onClick={() => router.push('/dashboard')}
        className="flex items-center gap-1 text-[12px] text-[#3a3a38] hover:text-[#8a8a84] mb-5 transition-colors font-[450]"
      >
        <ChevronLeft size={13} />
        Dashboard
      </button>

      {/* Page header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-9 h-9 rounded-xl bg-[#1a1a18] border border-[#2a2a28] flex items-center justify-center flex-shrink-0 text-[#c4a96e]">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-[19px] font-semibold text-[#e8e8e4] tracking-tight leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-[13px] text-[#5a5a54] mt-0.5 font-[450]">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>

      {children}
    </div>
  );
}
