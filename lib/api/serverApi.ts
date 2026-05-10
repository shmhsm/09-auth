// lib/api/serverApi.ts
import { instance } from './api';
import { User } from '../../types/user';
import { Note } from '../../types/note';

interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}

interface NotesResponse {
  notes: Note[];
  total: number;
  pages: number;
}

const getAuthHeaders = (cookies: string) => ({
  headers: { Cookie: cookies },
});

export const getMe = async (cookies: string): Promise<User> => {
  const response = await instance.get('/users/me', getAuthHeaders(cookies));
  return response.data;
};

export const fetchNotes = async (cookies: string, params: FetchNotesParams): Promise<NotesResponse> => {
  const response = await instance.get('/notes', {
    ...getAuthHeaders(cookies),
    params,
  });
  return response.data;
};

export const fetchNoteById = async (cookies: string, id: string): Promise<Note> => {
  const response = await instance.get(`/notes/${id}`, getAuthHeaders(cookies));
  return response.data;
};

export const checkSession = async (cookies: string): Promise<User | null> => {
  const response = await instance.get('/auth/session', getAuthHeaders(cookies));
  return response.data || null;
};