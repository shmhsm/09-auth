'use client';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import Modal from '../Modal/Modal';
import css from './NotePreview.module.css';

export default function NotePreview({ id }: { id: string }) {
  const router = useRouter();
  const { data: note, isLoading } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <Modal isOpen={true} onClose={() => router.back()}>
      <div className={css.container}>
        {isLoading ? (
          <p>Loading...</p>
        ) : note ? (
          <div className={css.card}>
            <h2 className={css.title}>{note.title}</h2>
            <span className={css.tag}>{note.tag}</span>
            <p className={css.content}>{note.content}</p>
          </div>
        ) : (
          <p>Note not found</p>
        )}
      </div>
    </Modal>
  );
}