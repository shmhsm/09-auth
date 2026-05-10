import { cookies } from 'next/headers';
import { api } from '@/app/api/api';
import { Note } from '@/types/note'; 
import { User } from '@/types/user'; 

export const checkSession = async () => {
  const cookieStore = await cookies();
  return api.get('/auth/session', {
    headers: { Cookie: cookieStore.toString() },
  });
};

export const getMe = async (): Promise<User> => { 
  const cookieStore = await cookies();
  const { data } = await api.get('/users/me', {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => { 
  const cookieStore = await cookies();
  const { data } = await api.get(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
};