'use client';

import { useRouter } from 'next/navigation';
import { useNoteStore } from '../../lib/store/noteStore';
import css from './NoteForm.module.css';

export default function NoteForm() {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearDraft();
    router.back();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <input
        name="title"
        value={draft.title}
        onChange={handleChange}
        placeholder="Title"
        className={css.input}
        required
      />
      <textarea
        name="content"
        value={draft.content}
        onChange={handleChange}
        placeholder="Content"
        className={css.textarea}
        required
      />
      <select 
        name="tag" 
        value={draft.tag} 
        onChange={handleChange} 
        className={css.select}
      >
        <option value="Todo">Todo</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Meeting">Meeting</option>
        <option value="Shopping">Shopping</option>
      </select>

      <div className={css.buttons}>
        <button 
          type="button" 
          onClick={() => router.back()} 
          className={css.cancelBtn}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitBtn}>
          Create
        </button>
      </div>
    </form>
  );
}