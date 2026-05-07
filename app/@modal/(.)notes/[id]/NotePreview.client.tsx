'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '../../../../lib/api';
import css from './NoteModal.module.css';

interface Props {
  id: string;
}

export default function NotePreview({ id }: Props) {
  const router = useRouter();

   const { data: note, isLoading } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  const closeModal = () => {
    router.back();
  };

  if (isLoading) return null;
  if (!note) return null;

  return (
    <div className={css.backdrop} onClick={closeModal}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button className={css.closeButton} onClick={closeModal}>
          &times;
        </button>
        
        <article className={css.content}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.text}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>#{note.tag}</span>
          </div>
        </article>
      </div>
    </div>
  );
}