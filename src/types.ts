export type NotePreset = 'technical' | 'conceptual' | 'auto';

export type RefineAction =
  | 'add_ascii_flow'
  | 'add_recall'
  | 'add_comparison_table'
  | 'make_concise'
  | 'custom';

export interface GeneratedNote {
  id: string;
  title: string;
  markdown: string;
  timestamp: number;
  preset: NotePreset;
  sourceUrl?: string;
  videoTitle?: string;
  wordCount: number;
  charCount: number;
}

export interface GenerateNotePayload {
  transcript: string;
  title?: string;
  sourceUrl?: string;
  preset: NotePreset;
  enrichContext: boolean;
}
