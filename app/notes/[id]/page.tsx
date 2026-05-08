import { Metadata } from 'next';
import { fetchNoteById } from '../../../lib/api';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return {
    title: `${note?.title || 'Note'} | NoteHub`,
    description: note?.content?.slice(0, 160),
    openGraph: {
      title: note?.title,
      url: `https://08-zustand-roan-three.vercel.app/${id}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}