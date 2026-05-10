import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios'; 
import { api } from '@/app/api/api'; 
import { logErrorResponse } from '../../_utils/utils'; 
export async function POST() {
  try {
    const cookieStore = await cookies();
    
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join('; ');

    await api.post('/auth/logout', {}, {
      headers: {
        'Cookie': cookieHeader,
      },
    });

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { 
          error: error.message, 
          response: error.response?.data 
        },
        { status: error.response?.status || 500 }
      );
    }

    const message = error instanceof Error ? error.message : 'Internal Server Error';
    logErrorResponse({ message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}