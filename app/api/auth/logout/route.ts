import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { api } from '@/app/api/api';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.toString();

    await api.post('/auth/logout', {}, {
      headers: {
        Cookie: allCookies,
      },
    });

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Logout error:', error.message);
    }
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}