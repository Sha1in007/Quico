'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingDots from './LoadingDots';

interface OutputCardProps {
  query: string;
  result: string | null;
  label: string | null;
  emoji: string | null;
  loading: boolean;
}

const intentBadge: Record<string, string> = {
  summarize: 'text-[#7aafda] bg-[#7aafda]/10 border-[#7aafda]/20',
  explain_code: 'text-[#7aba8a] bg-[#7aba8a]/10 border-[#7aba8a]/20',
  generate_email: 'text-[#c4a96e] bg-[#c4a96e]/10 border-[#c4a96e]/20',
  generate_ideas: 'text-[#c48a6e] bg-[#c48a6e]/10 border-[#c48a6e]/20',
  general: 'text-[#a0a09a] bg-[#a0a09a]/10 border-[#a0a09a]/20',
};

export default function OutputCard({
  query,
  result,
  label,
  emoji,
  loading,
}: OutputCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Copied');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!loading && !result) return null;

  return (
    <div className="w-full rounded-xl border border-[#242422] bg-[#141412] overflow-hidden animate-slide-up">
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e1c]">
        <div className="flex items-center gap-2.5 min-w-0">
          {label && (
            <span
              className={`flex-shrink-0 flex items-center gap-1 text-[11.5px] font-medium px-2 py-0.5 rounded-md border ${
                intentBadge[label?.toLowerCase().replace(' ', '_')] ||
                intentBadge.general
              }`}
            >
              <span>{emoji}</span>
              {label}
            </span>
          )}
          <p className="text-[12.5px] text-[#5a5a54] truncate font-[450]">{query}</p>
        </div>

        {result && (
          <button
            onClick={handleCopy}
            className="flex-shrink-0 ml-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] text-[#5a5a54] hover:text-[#a8a8a0] bg-[#1a1a18] hover:bg-[#222220] border border-[#242422] transition-all font-[450]"
          >
            {copied ? (
              <>
                <Check size={11} className="text-[#7aba8a]" />
                <span className="text-[#7aba8a]">Copied</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Card body */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="flex items-center gap-2.5 py-3">
            <LoadingDots />
            <span className="text-[13px] text-[#4a4a48]">Working on it…</span>
          </div>
        ) : (
          <div className="markdown-output">
            <ReactMarkdown
              components={{
                code({ node, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;
                  return isInline ? (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  ) : (
                    <SyntaxHighlighter
                      style={oneDark as any}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{
                        background: '#141412',
                        border: '1px solid #2a2a28',
                        borderRadius: '8px',
                        margin: '0.75rem 0',
                        fontSize: '0.84rem',
                      }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  );
                },
              }}
            >
              {result || ''}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
