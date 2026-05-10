import { NextResponse } from 'next/server';
import { instance } from '../../api';

export async function POST() {
  try {
    await instance.post('/auth/logout');

    const response = NextResponse.json({ message: 'Logout successful' });
    response.cookies.set('session', '', { expires: new Date(0) });

    return response;
  } catch {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}