import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Eye,
  FileCode,
  Sparkles,
  Layers,
  ListOrdered,
  Table,
  Zap,
  Loader2,
  Share2,
  RefreshCw,
  Send,
  SlidersHorizontal,
} from 'lucide-react';
import { GeneratedNote, RefineAction } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { slugify, countWords } from '../utils/slugify';

interface OutputSectionProps {
  note: GeneratedNote;
  onUpdateMarkdown: (newMarkdown: string) => void;
  onRefine: (action: RefineAction, customPrompt?: string) => Promise<void>;
  isRefining: boolean;
}

export const OutputSection: React.FC<OutputSectionProps> = ({
  note,
  onUpdateMarkdown,
  onRefine,
  isRefining,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'raw'>('preview');
  const [copied, setCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);

  const wordCount = countWords(note.markdown);
  const charCount = note.markdown.length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  // Extract clean title from markdown or note
  const getNoteTitle = (): string => {
    const match = note.markdown.match(/^#\s+(.+)$/m);
    if (match && match[1]) {
      return match[1].replace(/[#*`_]/g, '').trim();
    }
    return note.title || 'obsidian-note';
  };

  const filename = `${slugify(getNoteTitle())}.md`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(note.markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([note.markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRefineClick = async (action: RefineAction) => {
    if (isRefining) return;
    await onRefine(action);
  };

  const handleCustomRefineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim() || isRefining) return;
    await onRefine('custom', customPrompt.trim());
    setCustomPrompt('');
    setShowCustomPrompt(false);
  };

  // Line numbers for raw editor
  const lineCount = note.markdown.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col space-y-0">
      {/* Top Header & Export Controls */}
      <div className="p-4 sm:p-6 border-b border-stone-200 bg-stone-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Metadata */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
              {filename}
            </span>
            <span className="text-xs text-stone-400 font-medium">
              {wordCount} words • ~{readTimeMin} min read
            </span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 mt-1">
            {getNoteTitle()}
          </h3>
        </div>

        {/* Action Buttons: Copy & Download */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Toggle */}
          <div className="flex items-center p-1 bg-stone-200/70 rounded-xl border border-stone-300/60 mr-1">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('raw')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'raw'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Raw Markdown</span>
            </button>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            id="copy-obsidian-button"
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white shadow-emerald-500/20 ring-2 ring-emerald-400'
                : 'bg-stone-900 hover:bg-stone-800 text-white hover:shadow'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-300" />
                <span>Copy for Obsidian</span>
              </>
            )}
          </button>

          {/* Download .md Button */}
          <button
            type="button"
            id="download-md-button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 transition-colors shadow-2xs cursor-pointer"
            title="Download .md file"
          >
            <Download className="w-4 h-4 text-stone-500" />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      {/* Quick Refinements Toolbar */}
      <div className="px-4 sm:px-6 py-3 bg-purple-50/40 border-b border-purple-100 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-1.5 text-purple-900 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Quick AI Refinements:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={isRefining}
            onClick={() => handleRefineClick('add_ascii_flow')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-purple-100 text-purple-900 border border-purple-200 font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>Add ASCII Flow</span>
          </button>

          <button
            type="button"
            disabled={isRefining}
            onClick={() => handleRefineClick('add_recall')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-purple-100 text-purple-900 border border-purple-200 font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 text-purple-600" />
            <span>Add 10-Sec Recall</span>
          </button>

          <button
            type="button"
            disabled={isRefining}
            onClick={() => handleRefineClick('add_comparison_table')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-purple-100 text-purple-900 border border-purple-200 font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <Table className="w-3.5 h-3.5 text-purple-600" />
            <span>Add Comparison Table</span>
          </button>

          <button
            type="button"
            disabled={isRefining}
            onClick={() => handleRefineClick('make_concise')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-purple-100 text-purple-900 border border-purple-200 font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            <ListOrdered className="w-3.5 h-3.5 text-purple-600" />
            <span>Make More Concise</span>
          </button>

          <button
            type="button"
            disabled={isRefining}
            onClick={() => setShowCustomPrompt(!showCustomPrompt)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-900 font-semibold transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-700" />
            <span>Custom Edit</span>
          </button>
        </div>
      </div>

      {/* Custom Refine Input Form */}
      {showCustomPrompt && (
        <form
          onSubmit={handleCustomRefineSubmit}
          className="p-3 sm:px-6 bg-purple-100/40 border-b border-purple-200/70 flex items-center gap-2"
        >
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g., 'Add a troubleshooting common errors section', 'Convert code blocks to TypeScript'..."
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-purple-200 bg-white text-stone-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={!customPrompt.trim() || isRefining}
            className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-semibold text-xs hover:bg-purple-700 disabled:opacity-50 flex items-center gap-1 cursor-pointer"
          >
            <Send className="w-3 h-3" />
            <span>Apply</span>
          </button>
        </form>
      )}

      {/* Refining Spinner Overlay Notification */}
      {isRefining && (
        <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center gap-2 text-xs font-semibold text-amber-900 animate-pulse">
          <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
          <span>Refining note with Gemini AI... please wait</span>
        </div>
      )}

      {/* Content Area: Live Preview or Raw Editor */}
      <div className="p-5 sm:p-8 min-h-[400px]">
        {activeTab === 'preview' ? (
          <div className="prose prose-stone max-w-none">
            <MarkdownRenderer content={note.markdown} />
          </div>
        ) : (
          <div className="relative flex rounded-xl border border-stone-200 bg-stone-950 font-mono text-xs sm:text-sm text-stone-200 overflow-hidden shadow-inner">
            {/* Line numbers gutter */}
            <div className="select-none py-4 px-3 bg-stone-900/80 text-stone-500 text-right font-mono border-r border-stone-800/80">
              <pre className="m-0 leading-6">{lineNumbers}</pre>
            </div>
            {/* Textarea */}
            <textarea
              id="raw-markdown-editor"
              value={note.markdown}
              onChange={(e) => onUpdateMarkdown(e.target.value)}
              rows={Math.max(16, lineCount + 2)}
              className="w-full py-4 px-4 bg-transparent text-stone-100 font-mono resize-y focus:outline-none leading-6 selection:bg-purple-800"
              spellCheck={false}
            />
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 gap-2">
        <div className="flex items-center gap-2">
          <span>Obsidian-ready Markdown</span>
          <span>•</span>
          <span>GFM Tables & Callouts enabled</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Ready to paste directly into your Obsidian Vault</span>
        </div>
      </div>
    </div>
  );
};
