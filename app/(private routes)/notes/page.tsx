import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/clientApi';
import NotesClient from './Notes.client'; 
import css from './Notes.module.css';

export const metadata: Metadata = {
  title: 'Notes | NoteHub',
};

export default async function NotesPage() {
  const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['notes'],
        queryFn: () => fetchNotes({}), 
        });

  return (
    <main className={css.container}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient />
      </HydrationBoundary>
    </main>
  );
}