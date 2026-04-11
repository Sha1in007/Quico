'use client';

export default function LoadingDots({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dotSize = size === 'sm' ? 'w-1 h-1' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-1.5 h-1.5';

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`${dotSize} bg-[#4a4a48] rounded-full bounce-dot`}
        />
      ))}
    </div>
  );
}
