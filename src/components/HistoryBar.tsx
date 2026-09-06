import React from 'react';
import { History, FileText, Trash2, Clock, ChevronRight } from 'lucide-react';
import { GeneratedNote } from '../types';

interface HistoryBarProps {
  history: GeneratedNote[];
  activeNoteId: string | null;
  onSelectNote: (note: GeneratedNote) => void;
  onClearHistory: () => void;
  onDeleteNote: (id: string, e: React.MouseEvent) => void;
}

export const HistoryBar: React.FC<HistoryBarProps> = ({
  history,
  activeNoteId,
  onSelectNote,
  onClearHistory,
  onDeleteNote,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-4 sm:p-5">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-purple-600" />
          <h3 className="font-bold text-stone-800 text-sm">Recent Generated Notes</h3>
          <span className="px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold">
            {history.length}
          </span>
        </div>
        <button
          onClick={onClearHistory}
          className="text-xs text-stone-400 hover:text-rose-600 transition-colors font-medium cursor-pointer"
        >
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {history.map((item) => {
          const isActive = item.id === activeNoteId;
          const dateStr = new Date(item.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={item.id}
              onClick={() => onSelectNote(item)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group relative ${
                isActive
                  ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-400/20'
                  : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 hover:border-stone-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-200/70 text-stone-700 font-semibold uppercase">
                    {item.preset}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {dateStr}
                    </span>
                    <button
                      onClick={(e) => onDeleteNote(item.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-stone-400 hover:text-rose-600 transition-opacity"
                      title="Delete note"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <h4 className="font-bold text-xs text-stone-900 line-clamp-1">
                  {item.title}
                </h4>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2">
                <span>{item.wordCount} words</span>
                <span className="text-purple-600 font-semibold flex items-center group-hover:translate-x-0.5 transition-transform">
                  Load <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
