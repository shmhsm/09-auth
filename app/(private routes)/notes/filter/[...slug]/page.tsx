import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/notes';
import NotesClient from './Notes.client';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const filter = slug?.[0] || 'all';
  const displayFilter = filter.charAt(0).toUpperCase() + filter.slice(1);

  return {
    title: `Notes: ${displayFilter} | NoteHub`,
    description: `View all notes in category: ${displayFilter}. Manage your thoughts effectively with NoteHub.`,
    openGraph: {
      title: `${displayFilter} Notes | NoteHub`,
      description: `Explore and manage your ${displayFilter} notes.`,
      url: `https://08-zustand-roan-three.vercel.app/notes/filter/${filter}`, 
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub Preview',
        },
      ],
      type: 'website',
    },
  };
}

export default async function FilteredNotesPage({ params }: Props) {
  const { slug } = await params;
  const selectedTag = slug?.[0];
  const queryTag = selectedTag === 'all' ? undefined : selectedTag;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', { tag: queryTag, search: '', page: 1 }],
    queryFn: () => fetchNotes({ search: '', page: 1, perPage: 12, tag: queryTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={queryTag} />
    </HydrationBoundary>
  );
}