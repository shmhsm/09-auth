import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/serverApi';
import NoteDetails from '../../notes/[id]/NoteDetails.client'; 
import css from './page.module.css';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  
  const note = await fetchNoteById(id, cookieHeader);

  return {
    title: `${note?.title || 'Note Details'} | NoteHub`,
    description: note?.content?.slice(0, 160) || 'Read the full details of this note.',
    openGraph: {
      title: note?.title,
      description: note?.content?.slice(0, 160),
      url: `https://08-zustand-roan-three.vercel.app/notes/${id}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
}

export default async function NotePage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies(); // Получаем куки
  const cookieHeader = cookieStore.toString();
  
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id, cookieHeader),
  });

  return (
    <main className={css.main}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetails id={id} />
      </HydrationBoundary>
    </main>
  );
}