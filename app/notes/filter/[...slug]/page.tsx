import NoteList from '../../../../components/NoteList/NoteList';
import { fetchNotes } from '../../../../lib/api';
import css from './NotesPage.module.css';

interface Props {
  params: Promise<{ tag?: string[] }>;
}

export default async function FilteredNotesPage({ params }: Props) {
  const { tag } = await params;
  
  const selectedTag = tag?.[0];
  const queryTag = selectedTag === 'all' ? undefined : selectedTag;

  const data = await fetchNotes({ 
    search: '', 
    page: 1, 
    perPage: 12, 
    tag: queryTag 
  });

  return (
    <div className={css.container}>
      <h1 className={css.title}>
        {queryTag ? `Notes: ${queryTag}` : 'All Notes'}
      </h1>
      <NoteList notes={data.notes} />
    </div>
  );
}