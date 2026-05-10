import { ReactNode } from 'react';
import css from './AuthLayout.module.css';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <section className={css.authWrapper}>
      <div className={css.container}>
        {children}
      </div>
    </section>
  );
}