import React from 'react';
import Link from 'next/link';

export default function SidebarPage() {
  return (
    <nav>
      <h3>Categories</h3>
      <ul>
        <li>
          <Link href="/notes/filter/all">All</Link>
        </li>
        <li>
          <Link href="/notes/filter/Work">Work</Link>
        </li>
        <li>
          <Link href="/notes/filter/Personal">Personal</Link>
        </li>
      </ul>
    </nav>
  );
}