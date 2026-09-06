import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';
import { HistoryBar } from './components/HistoryBar';
import { GeneratedNote, GenerateNotePayload, NotePreset, RefineAction } from './types';
import { countWords } from './utils/slugify';
import { AlertCircle, X, Sparkles, ArrowDown } from 'lucide-react';

const STORAGE_KEY = 'obsidian_notes_history_v1';

export default function App() {
  const [activePreset, setActivePreset] = useState<NotePreset>('technical');
  const [currentNote, setCurrentNote] = useState<GeneratedNote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedNote[]>([]);

  const outputRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          setCurrentNote(parsed[0]);
        }
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newNote: GeneratedNote) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== newNote.id);
      const updated = [newNote, ...filtered].slice(0, 15);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save to localStorage', e);
      }
      return updated;
    });
  };

  const handleGenerateNote = async (payload: GenerateNotePayload) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/generate-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      const markdown = data.markdown || '';
      const title = data.title || payload.title || 'Obsidian Note';

      const newNote: GeneratedNote = {
        id: `note-${Date.now()}`,
        title,
        markdown,
        timestamp: Date.now(),
        preset: payload.preset,
        sourceUrl: payload.sourceUrl,
        videoTitle: payload.title,
        wordCount: countWords(markdown),
        charCount: markdown.length,
      };

      setCurrentNote(newNote);
      saveToHistory(newNote);

      // Smooth scroll down to output
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error('Error generating note:', err);
      setErrorMessage(err.message || 'An error occurred while generating the note.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineNote = async (action: RefineAction, customPrompt?: string) => {
    if (!currentNote) return;
    setIsRefining(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/refine-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentMarkdown: currentNote.markdown,
          action,
          customPrompt,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server responded with status ${res.status}`);
      }

      const data = await res.json();
      const updatedMarkdown = data.markdown || currentNote.markdown;

      const updatedNote: GeneratedNote = {
        ...currentNote,
        markdown: updatedMarkdown,
        wordCount: countWords(updatedMarkdown),
        charCount: updatedMarkdown.length,
        timestamp: Date.now(),
      };

      setCurrentNote(updatedNote);
      saveToHistory(updatedNote);
    } catch (err: any) {
      console.error('Error refining note:', err);
      setErrorMessage(err.message || 'Failed to refine note.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleUpdateMarkdown = (newMarkdown: string) => {
    if (!currentNote) return;
    const updatedNote: GeneratedNote = {
      ...currentNote,
      markdown: newMarkdown,
      wordCount: countWords(newMarkdown),
      charCount: newMarkdown.length,
    };
    setCurrentNote(updatedNote);
    saveToHistory(updatedNote);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
    if (currentNote?.id === id) {
      const remaining = history.filter((n) => n.id !== id);
      setCurrentNote(remaining.length > 0 ? remaining[0] : null);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900">
      {/* Navigation Header */}
      <Header />

      {/* Main Content Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start justify-between gap-3 shadow-xs animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Failed to process note</p>
                <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-700 p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Section 1: Input & Presets Section */}
        <InputSection
          onGenerate={handleGenerateNote}
          isLoading={isLoading}
          activePreset={activePreset}
          onPresetChange={setActivePreset}
        />

        {/* Section 2: Output & Obsidian Exporter Section */}
        <div ref={outputRef} className="pt-2">
          {currentNote ? (
            <OutputSection
              note={currentNote}
              onUpdateMarkdown={handleUpdateMarkdown}
              onRefine={handleRefineNote}
              isRefining={isRefining}
            />
          ) : (
            <div className="bg-white/60 border border-dashed border-stone-300 rounded-2xl p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto border border-purple-100 shadow-2xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-800 text-base">
                Ready to Generate Obsidian Notes
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                Paste your video transcript above, choose a preset style, or click one of the quick test buttons to generate structured Markdown notes.
              </p>
            </div>
          )}
        </div>

        {/* Section 3: History & Saved Notes Bar */}
        <HistoryBar
          history={history}
          activeNoteId={currentNote?.id || null}
          onSelectNote={(note) => {
            setCurrentNote(note);
            setTimeout(() => {
              outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }}
          onClearHistory={handleClearHistory}
          onDeleteNote={handleDeleteNote}
        />
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-stone-200/80 bg-white/50 py-4 text-center text-xs text-stone-500">
        <p>
          Designed for Computer Science Students & Technical Note Takers • Compatible with Obsidian, Logseq & Foam
        </p>
      </footer>
    </div>
  );
}
