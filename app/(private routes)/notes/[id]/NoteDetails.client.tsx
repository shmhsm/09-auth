'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '../../../lib/api/notes';
import css from './NoteDetails.module.css';

interface NoteDetailsProps {
  id: string;
}

export default function NoteDetails({ id }: NoteDetailsProps) {
  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  if (isLoading) return <p>Loading note...</p>;
  if (isError || !note) return <p>Error loading note details.</p>;

  return (
    <article className={css.container}>
      <h1 className={css.title}>{note.title}</h1>
      <div className={css.meta}>
        <span className={css.tag}>{note.tag}</span>
        <span className={css.date}>
          {new Date(note.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className={css.content}>{note.content}</p>
    </article>
  );
}