export type NoteTag = 'work' | 'personal' | 'important';

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}