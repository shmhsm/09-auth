// components/NoteForm/NoteForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNoteStore } from '../../lib/store/noteStore';
import { createNote } from '../../lib/api/notes'; 
import css from './NoteForm.module.css';

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const mutation = useMutation({
    mutationFn: (newNote: typeof draft) => createNote(newNote),
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.back();
    },
    onError: (error) => {
      alert('Failed to create note: ' + error.message);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDraft({ [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(draft);
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <input name="title" value={draft.title} onChange={handleChange} required className={css.input} />
      <textarea name="content" value={draft.content} onChange={handleChange} required className={css.textarea} />
      <select name="tag" value={draft.tag} onChange={handleChange} className={css.select}>
        <option value="Todo">Todo</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
      </select>

      <div className={css.buttons}>
        <button type="button" onClick={() => router.back()} className={css.cancelBtn} disabled={mutation.isPending}>
          Cancel
        </button>
        <button type="submit" className={css.submitBtn} disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  );
}