'use client';

import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedPage: number) => void;
  forcePage: number;
}

export default function Pagination({ pageCount, onPageChange, forcePage }: PaginationProps) {
  return (
    <ReactPaginate
      previousLabel={'←'}
      nextLabel={'→'}
      pageCount={pageCount}
      onPageChange={(data) => onPageChange(data.selected + 1)}
      forcePage={forcePage}
      containerClassName={css.pagination}
      activeClassName={css.active}
    />
  );
}