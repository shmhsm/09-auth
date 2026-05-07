'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes } from '../../../../lib/api';
import NoteList from '../../../../components/NoteList/NoteList';
import Pagination from '../../../../components/Pagination/Pagination';
import SearchBox from '../../../../components/SearchBox/SearchBox';
import Modal from '../../../../components/Modal/Modal';
import NoteForm from '../../../../components/NoteForm/NoteForm';

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage: 6, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages || 0;

  return (
    <div>
      <SearchBox value={search} onChange={handleSearchChange} />
      
      <button onClick={() => setIsModalOpen(true)}>Add Note</button>
      
      {isLoading ? <p>Loading...</p> : <NoteList notes={data?.notes || []} />}

      {totalPages > 1 && (
        <Pagination 
          pageCount={totalPages} 
          onPageChange={(p) => setPage(p)} 
          forcePage={page - 1} 
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} /> 
        </Modal>
      )}
    </div>
  );
}