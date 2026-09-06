import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Copy,
  Check,
  Lightbulb,
  Info,
  AlertTriangle,
  AlertOctagon,
  Bookmark,
  Code2,
  HelpCircle,
  Layers,
} from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

// Helper to copy code snippet
function CodeBlock({
  language,
  value,
}: {
  language: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAsciiTreeOrFlow =
    language === 'text' ||
    value.includes('↓') ||
    value.includes('→') ||
    value.includes('└──') ||
    value.includes('├──') ||
    value.includes('──');

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-stone-200/80 bg-stone-950 text-stone-100 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-stone-900 border-b border-stone-800 text-xs font-mono text-stone-400">
        <div className="flex items-center gap-2">
          {isAsciiTreeOrFlow ? (
            <Layers className="w-3.5 h-3.5 text-purple-400" />
          ) : (
            <Code2 className="w-3.5 h-3.5 text-stone-400" />
          )}
          <span className="uppercase tracking-wider font-semibold">
            {isAsciiTreeOrFlow && language === 'text' ? 'ASCII Architecture / Flow' : language || 'text'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors text-xs cursor-pointer"
          title="Copy code snippet"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-stone-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed text-stone-200 selection:bg-purple-900 selection:text-white">
        <code>{value}</code>
      </pre>
    </div>
  );
}

// Callout type config for Obsidian Callouts
const CALLOUT_CONFIGS: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
    iconClass: string;
  }
> = {
  tip: {
    icon: Lightbulb,
    title: 'Tip',
    bgClass: 'bg-emerald-50/60',
    borderClass: 'border-emerald-300',
    textClass: 'text-emerald-950',
    iconClass: 'text-emerald-600',
  },
  info: {
    icon: Info,
    title: 'Info',
    bgClass: 'bg-sky-50/60',
    borderClass: 'border-sky-300',
    textClass: 'text-sky-950',
    iconClass: 'text-sky-600',
  },
  note: {
    icon: Bookmark,
    title: 'Note',
    bgClass: 'bg-purple-50/60',
    borderClass: 'border-purple-300',
    textClass: 'text-purple-950',
    iconClass: 'text-purple-600',
  },
  warning: {
    icon: AlertTriangle,
    title: 'Warning',
    bgClass: 'bg-amber-50/60',
    borderClass: 'border-amber-300',
    textClass: 'text-amber-950',
    iconClass: 'text-amber-600',
  },
  danger: {
    icon: AlertOctagon,
    title: 'Danger',
    bgClass: 'bg-rose-50/60',
    borderClass: 'border-rose-300',
    textClass: 'text-rose-950',
    iconClass: 'text-rose-600',
  },
  question: {
    icon: HelpCircle,
    title: 'Question',
    bgClass: 'bg-indigo-50/60',
    borderClass: 'border-indigo-300',
    textClass: 'text-indigo-950',
    iconClass: 'text-indigo-600',
  },
  example: {
    icon: Code2,
    title: 'Example',
    bgClass: 'bg-violet-50/60',
    borderClass: 'border-violet-300',
    textClass: 'text-violet-950',
    iconClass: 'text-violet-600',
  },
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="obsidian-preview font-sans text-stone-800 leading-relaxed max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mt-6 mb-4 pb-2.5 border-b border-stone-200 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight mt-6 mb-3 pb-1 border-b border-stone-100">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-stone-800 tracking-tight mt-5 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="my-3 text-stone-700 text-base leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-3 ml-5 list-disc space-y-1.5 text-stone-700 marker:text-purple-600">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 ml-5 list-decimal space-y-1.5 text-stone-700 marker:text-purple-700 font-medium">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-1 leading-relaxed text-stone-700">
              {children}
            </li>
          ),
          hr: () => (
            <hr className="my-6 border-t border-stone-200/80" />
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-stone-900">
              {children}
            </strong>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="my-5 overflow-x-auto rounded-xl border border-stone-200 shadow-xs">
              <table className="w-full text-left text-sm text-stone-700 border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-stone-100 text-stone-900 border-b border-stone-200 text-xs font-semibold uppercase tracking-wider">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-semibold text-stone-900 border-r border-stone-200 last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2.5 border-b border-stone-100 border-r border-stone-100 last:border-r-0 text-stone-700">
              {children}
            </td>
          ),
          blockquote: ({ children }) => {
            // Check for Obsidian Callout format: > [!tip] Title
            const textContent = React.Children.toArray(children)
              .map((c: any) => (typeof c === 'string' ? c : c?.props?.children || ''))
              .join(' ');

            const calloutMatch = textContent.match(/\[!(tip|info|note|warning|danger|question|example)\]\s*(.*)/i);

            if (calloutMatch) {
              const type = calloutMatch[1].toLowerCase();
              const customTitle = calloutMatch[2]?.trim();
              const config = CALLOUT_CONFIGS[type] || CALLOUT_CONFIGS.note;
              const Icon = config.icon;

              return (
                <div
                  className={`my-4 p-4 rounded-xl border-l-4 ${config.borderClass} ${config.bgClass} shadow-2xs`}
                >
                  <div className="flex items-center gap-2 font-semibold text-sm mb-1.5">
                    <Icon className={`w-4 h-4 ${config.iconClass}`} />
                    <span className={config.textClass}>
                      {customTitle || config.title}
                    </span>
                  </div>
                  <div className="text-stone-700 text-sm pl-6 leading-relaxed">
                    {children}
                  </div>
                </div>
              );
            }

            return (
              <blockquote className="my-4 pl-4 border-l-4 border-purple-400 bg-purple-50/30 py-2 pr-3 rounded-r-lg text-stone-700 italic text-sm">
                {children}
              </blockquote>
            );
          },
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const value = String(children).replace(/\n$/, '');
            const isInline = !match && !value.includes('\n');

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md font-mono text-[0.85em] bg-stone-100 text-purple-700 border border-stone-200/70"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                language={match ? match[1] : 'text'}
                value={value}
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
