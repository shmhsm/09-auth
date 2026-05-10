'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import Modal from '../../../../components/Modal/Modal';
import css from './NoteModal.module.css'; 

interface Props {
  id: string;
}

export default function NotePreview({ id }: Props) {
  const router = useRouter();

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <div className={css.modalContent}>
        {isLoading && <p>Loading note details...</p>}
        
        {isError && <p className={css.error}>Error loading note details.</p>}
        
        {note && (
          <article className={css.article}>
            <h2 className={css.title}>{note.title}</h2>
            
            <div className={css.tagBadge}>
              <span>Tag: </span>
              <strong>{note.tag}</strong>
            </div>
            
            <p className={css.text}>{note.content || note.content}</p>
            
            <div className={css.footer}>
              <time className={css.date}>
                Created at: {new Date(note.createdAt).toLocaleDateString()}
              </time>
            </div>
          </article>
        )}
      </div>
    </Modal>
  );
}