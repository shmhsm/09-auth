import { Metadata } from 'next';
import Link from 'next/link';
import css from './Home.module.css';

export const metadata: Metadata = {
  title: '404 - Page Not Found | NoteHub',
  description: 'Sorry, the page you are looking for does not exist.',
  openGraph: {
    title: '404 - Not Found',
    description: 'The requested page was not found.',
    url: 'https://08-zustand-roan-three.vercel.app/4',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

export default function NotFound() {
  return (
    <div className={css.container}>
      <h1>404</h1>
      <p>This page doesn`t exist.</p>
      <Link href="/">Go Home</Link>
    </div>
  );
}