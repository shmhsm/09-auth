'use client';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '../../../../lib/api';
import Modal from '../../../../components/Modal/Modal'; 
export default function NotePreview({ id }: { id: string }) {
  const router = useRouter();
  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  return (
    <Modal isOpen={true} onClose={handleClose}>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading note.</p>}
      {note && (
        <article>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
        </article>
      )}
    </Modal>
  );
}