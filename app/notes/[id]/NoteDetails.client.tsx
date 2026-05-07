'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '../../../lib/api';

export default function NoteDetailsClient() {
  const { id } = useParams() as { id: string };

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (!note) return <p>Note not found</p>;

  return (
    <article>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
      <span>{note.tag}</span>
    </article>
  );
}