import React from 'react';
import css from './LayoutNotes.module.css';

interface FilterLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  modal: React.ReactNode;
}

export default function FilterLayout(props: FilterLayoutProps) {
  const { children, sidebar, modal } = props;

  return (
    <div className={css.layout}>
      <aside className={css.sidebar}>
        {sidebar}
      </aside>
      <main className={css.content}>
        {children}
      </main>
      {modal}
    </div>
  );
}