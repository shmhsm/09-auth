'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import Link from 'next/link';
import { fetchNotes } from '../../../../lib/api';
import NoteList from '../../../../components/NoteList/NoteList';
import Pagination from '../../../../components/Pagination/Pagination';
import SearchBox from '../../../../components/SearchBox/SearchBox';
import css from './NotesPage.module.css'; 

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const [debouncedSearch] = useDebounce(search, 500);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['notes', { page, search: debouncedSearch, tag }],
    queryFn: () => fetchNotes({ 
      page, 
      perPage: 6, 
      search: debouncedSearch, 
      tag
    }),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages || 0;

  return (
    <div>
      <SearchBox value={search} onChange={handleSearchChange} />
      
      <Link href="/notes/action/create" className={css.createLink}>
        Create note +
      </Link>
      
      {isLoading ? <p>Loading...</p> : <NoteList notes={data?.notes || []} />}

      {totalPages > 1 && (
        <Pagination 
          pageCount={totalPages} 
          onPageChange={(p) => setPage(p)} 
          forcePage={page - 1} 
        />
      )}
    </div>
  );
}