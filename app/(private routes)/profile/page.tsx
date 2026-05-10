import { cookies } from 'next/headers';
import Link from 'next/link';
import Image from 'next/image';
import { getMe } from '@/lib/api/serverApi';
import css from './ProfilePage.module.css';

export const metadata = {
  title: 'Profile | NoteHub',
};

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const user = await getMe(cookieStore.toString());

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || 'https://ac.goit.global/fullstack/react/avatar-default.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority 
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}