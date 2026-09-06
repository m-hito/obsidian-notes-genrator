import React, { useState, useEffect } from 'react';
import {
  Code,
  Compass,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Link,
  BookMarked,
  Layers,
  Wand2,
  Trash2,
  FileText,
  Info,
  Loader2,
} from 'lucide-react';
import { NotePreset, GenerateNotePayload } from '../types';
import { SAMPLES } from '../sampleData';
import { countWords } from '../utils/slugify';

interface InputSectionProps {
  onGenerate: (payload: GenerateNotePayload) => void;
  isLoading: boolean;
  activePreset: NotePreset;
  onPresetChange: (preset: NotePreset) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  onGenerate,
  isLoading,
  activePreset,
  onPresetChange,
}) => {
  const [transcript, setTranscript] = useState('');
  const [title, setTitle] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [enrichContext, setEnrichContext] = useState(true);
  const [showOptionalContext, setShowOptionalContext] = useState(false);

  const wordCount = countWords(transcript);
  const charCount = transcript.length;

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLES.find((s) => s.id === sampleId);
    if (sample) {
      setTranscript(sample.transcript);
      setTitle(sample.title);
      setSourceUrl(sample.sourceUrl);
      onPresetChange(sample.preset);
      if (sample.title || sample.sourceUrl) {
        setShowOptionalContext(true);
      }
    }
  };

  const handleClear = () => {
    setTranscript('');
    setTitle('');
    setSourceUrl('');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!transcript.trim() || isLoading) return;

    onGenerate({
      transcript: transcript.trim(),
      title: title.trim() || undefined,
      sourceUrl: sourceUrl.trim() || undefined,
      preset: activePreset,
      enrichContext,
    });
  };

  // Keyboard shortcut: Cmd+Enter or Ctrl+Enter to generate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (transcript.trim() && !isLoading) {
          e.preventDefault();
          handleSubmit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [transcript, isLoading, title, sourceUrl, activePreset, enrichContext]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 sm:p-7 space-y-6">
      {/* Header & Quick Sample Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Transcript or Messy Notes Input
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Paste raw video captions, lecture audio transcript, or unstructured bullets
          </p>
        </div>

        {/* Quick Sample Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-medium text-stone-400 mr-1">Quick Test:</span>
          <button
            type="button"
            onClick={() => handleLoadSample('sample-react')}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-100 hover:bg-purple-50 hover:text-purple-700 text-stone-700 border border-stone-200 hover:border-purple-200 transition-colors cursor-pointer"
          >
            ⚛️ React + Vite Setup
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('sample-genai')}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-100 hover:bg-purple-50 hover:text-purple-700 text-stone-700 border border-stone-200 hover:border-purple-200 transition-colors cursor-pointer"
          >
            🧠 GenAI App Planning
          </button>
          <button
            type="button"
            onClick={() => handleLoadSample('sample-system-design')}
            className="hidden md:inline-block px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-100 hover:bg-purple-50 hover:text-purple-700 text-stone-700 border border-stone-200 hover:border-purple-200 transition-colors cursor-pointer"
          >
            ⚡ System Caching
          </button>
          {transcript && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Clear input"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="space-y-2">
        <div className="relative rounded-xl border border-stone-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition-all bg-stone-50/40">
          <textarea
            id="transcript-input"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your raw lecture transcript, YouTube video transcript, or messy scratchpad bullet points here...
(e.g., 'In this lecture we install Tailwind CSS with Vite... run npm create vite@latest...')"
            rows={7}
            className="w-full p-4 text-sm font-mono text-stone-800 placeholder:text-stone-400 bg-transparent resize-y min-h-[140px] focus:outline-none leading-relaxed"
          />

          {/* Footer Stats inside textarea */}
          <div className="flex items-center justify-between px-4 py-2 bg-stone-100/70 border-t border-stone-200/70 text-xs text-stone-500 font-mono rounded-b-xl">
            <div className="flex items-center gap-3">
              <span><strong>{wordCount}</strong> words</span>
              <span className="text-stone-300">•</span>
              <span><strong>{charCount}</strong> characters</span>
            </div>
            {wordCount > 0 && (
              <span className="text-stone-400">
                Estimated video: ~{Math.max(1, Math.round(wordCount / 140))} min
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Optional Context (Course Title & Source URL) */}
      <div className="border border-stone-200/80 rounded-xl overflow-hidden bg-stone-50/30">
        <button
          type="button"
          onClick={() => setShowOptionalContext(!showOptionalContext)}
          className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-100/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-purple-600" />
            <span>Optional Context & Source Attribution</span>
            {(title || sourceUrl) && (
              <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                Configured
              </span>
            )}
          </div>
          {showOptionalContext ? (
            <ChevronUp className="w-4 h-4 text-stone-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-stone-400" />
          )}
        </button>

        {showOptionalContext && (
          <div className="p-4 pt-2 border-t border-stone-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white">
            <div>
              <label htmlFor="course-title" className="block text-xs font-semibold text-stone-700 mb-1">
                Video or Course Title
              </label>
              <input
                id="course-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Complete React Course - Vite Setup"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-200 bg-stone-50/50 text-stone-900 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor="source-url" className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <Link className="w-3 h-3 text-stone-500" />
                Source URL (YouTube, Udemy, Coursera)
              </label>
              <input
                id="source-url"
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://tailwindcss.com/docs/installation/using-vite"
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-stone-200 bg-stone-50/50 text-stone-900 focus:outline-none focus:border-purple-500 focus:bg-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Note Style Presets (Segmented / Radio Control) */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-500">
          Note Style Preset
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Preset A: Technical & Code Guide */}
          <button
            type="button"
            onClick={() => onPresetChange('technical')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activePreset === 'technical'
                ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-500/20 shadow-xs'
                : 'border-stone-200 bg-stone-50/40 hover:bg-stone-100/70 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className={`p-1.5 rounded-lg ${
                  activePreset === 'technical' ? 'bg-purple-600 text-white' : 'bg-stone-200 text-stone-700'
                }`}
              >
                <Code className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-stone-900">Technical & Code</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Step-by-step commands, ASCII directory trees, code blocks, and parameter explanations.
            </p>
          </button>

          {/* Preset B: Conceptual & Strategic Framework */}
          <button
            type="button"
            onClick={() => onPresetChange('conceptual')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activePreset === 'conceptual'
                ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-500/20 shadow-xs'
                : 'border-stone-200 bg-stone-50/40 hover:bg-stone-100/70 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className={`p-1.5 rounded-lg ${
                  activePreset === 'conceptual' ? 'bg-purple-600 text-white' : 'bg-stone-200 text-stone-700'
                }`}
              >
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-stone-900">Conceptual Framework</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Core idea, bold concepts, numbered arrow workflows, practical tips, and 10-Second Recall.
            </p>
          </button>

          {/* Preset C: Auto-Detect */}
          <button
            type="button"
            onClick={() => onPresetChange('auto')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activePreset === 'auto'
                ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-500/20 shadow-xs'
                : 'border-stone-200 bg-stone-50/40 hover:bg-stone-100/70 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className={`p-1.5 rounded-lg ${
                  activePreset === 'auto' ? 'bg-purple-600 text-white' : 'bg-stone-200 text-stone-700'
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-stone-900">Auto-Detect Blend</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              AI analyzes transcript density to balance code setup with mental models and takeaways.
            </p>
          </button>
        </div>
      </div>

      {/* Enrichment Toggle & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-stone-100">
        {/* Toggle */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              id="enrichment-toggle"
              checked={enrichContext}
              onChange={(e) => setEnrichContext(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-800">
              <span>Enrich with AI Context</span>
              <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 text-[10px] font-bold">
                Recommended
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Automatically explain CLI flags and terms mentioned in passing
            </p>
          </div>
        </label>

        {/* Action Button */}
        <button
          type="button"
          id="generate-obsidian-button"
          disabled={!transcript.trim() || isLoading}
          onClick={() => handleSubmit()}
          className={`flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md cursor-pointer ${
            !transcript.trim() || isLoading
              ? 'bg-stone-200 text-stone-400 shadow-none cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/30 active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Structuring Obsidian Note...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Generate Obsidian Note</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-purple-800/60 rounded text-purple-200">
                ⌘↵
              </kbd>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
