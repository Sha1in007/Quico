'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingDots from './LoadingDots';

interface OutputCardProps {
  query: string;
  result: string | null;
  label: string | null;
  emoji: string | null;
  loading: boolean;
}

const intentColors: Record<string, string> = {
  summarize: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  explain_code: 'text-green-400 bg-green-400/10 border-green-400/20',
  generate_email: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  generate_ideas: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  general: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
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
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!loading && !result) return null;

  return (
    <div className="w-full rounded-2xl border border-[#252538] bg-[#0f0f1a] overflow-hidden animate-slide-up">
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1e1e30]">
        <div className="flex items-center gap-3 min-w-0">
          {label && (
            <span
              className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
                intentColors[label?.toLowerCase().replace(' ', '_')] ||
                intentColors.general
              }`}
            >
              <span>{emoji}</span>
              {label}
            </span>
          )}
          <p className="text-sm text-[#606080] truncate">{query}</p>
        </div>

        {result && (
          <button
            onClick={handleCopy}
            className="flex-shrink-0 ml-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#8080a0] hover:text-white bg-[#12121e] hover:bg-[#1a1a2e] border border-[#1e1e30] transition-all"
          >
            {copied ? (
              <>
                <Check size={12} className="text-green-400" />
                <span className="text-green-400">Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      {/* Card body */}
      <div className="px-5 py-5">
        {loading ? (
          <div className="flex items-center gap-3 py-4">
            <LoadingDots />
            <span className="text-sm text-[#606080]">Quico is thinking...</span>
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
                        background: '#0a0a14',
                        border: '1px solid #252538',
                        borderRadius: '10px',
                        margin: '0.75rem 0',
                        fontSize: '0.85rem',
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
