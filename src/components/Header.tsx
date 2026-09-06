import React, { useState } from 'react';
import { Sparkles, BookOpen, ExternalLink, HelpCircle, X, CheckCircle2 } from 'lucide-react';

export const Header: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <header className="border-b border-stone-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 flex items-center justify-center shadow-xs shadow-purple-500/20 text-white font-bold text-lg">
            <svg
              className="w-5 h-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L3 8.5V15.5L12 22L21 15.5V8.5L12 2ZM12 4.25L18.75 9.14L12 14.03L5.25 9.14L12 4.25ZM5 10.87L11 15.22V20.21L5 15.86V10.87ZM13 20.21V15.22L19 10.87V15.86L13 20.21Z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 text-lg tracking-tight">
                Obsidian Note Generator
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                <Sparkles className="w-3 h-3 text-purple-600" />
                Gemini 3.7
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              Turn messy lecture transcripts into high-yield, structured Obsidian Markdown
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHelp(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors cursor-pointer"
            title="Formatting Guide & Obsidian Conventions"
          >
            <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Obsidian Guide</span>
          </button>
        </div>
      </div>

      {/* Guide / Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-stone-900 text-lg">
                  Obsidian Note Formatting Rules
                </h3>
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm text-stone-600 leading-relaxed">
              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                <p className="font-semibold text-purple-900 mb-1">Strict Output Standards</p>
                <ul className="space-y-1.5 text-xs text-purple-950">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Direct Title:</strong> Starts with <code className="text-purple-700 font-mono"># Title</code> — zero conversational intros.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Visual Rhythm:</strong> First 2-3 words of bullet points bolded for instant skimming.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>ASCII Architecture:</strong> Mental models & directory structures in tagged text blocks.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Obsidian Callouts:</strong> Rendered with <code className="text-purple-700 font-mono">&gt; [!tip]</code>, <code className="text-purple-700 font-mono">&gt; [!info]</code>, etc.</span>
                  </li>
                </ul>
              </div>

              <div>
                <p className="font-semibold text-stone-800 mb-1">Preset Styles Available:</p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    <strong className="text-stone-900">Preset A: Technical & Code Guide</strong>
                    <p className="text-stone-500 mt-0.5">Quick setup commands, step-by-step flag breakdowns, code blocks, folder structures, and key pitfalls.</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    <strong className="text-stone-900">Preset B: Conceptual & Strategic Framework</strong>
                    <p className="text-stone-500 mt-0.5">Core idea, bold concept definitions, numbered workflow arrows, practical tips, and a 10-Second Recall checklist.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
