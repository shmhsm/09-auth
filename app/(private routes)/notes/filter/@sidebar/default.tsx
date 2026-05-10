import Link from 'next/link';

export default function Sidebar() {
  const tags = ['all', 'Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];
  return (
    <nav>
      <h3>Categories</h3>
      <ul>
        {tags.map((tag) => (
          <li key={tag}>
            <Link href={`/notes/filter/${tag}`}>
              {tag === 'all' ? 'All notes' : tag}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}