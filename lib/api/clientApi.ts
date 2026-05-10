// lib/api/clientApi.ts
import { instance } from './api';
import { User } from '../../types/user';
import { Note } from '../../types/note';

interface AuthPayload {
  email: string;
  password?: string;
}

interface UpdateUserPayload {
  username: string;
}

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

// --- Авторизация ---
export const register = async (data: AuthPayload): Promise<User> => {
  const response = await instance.post('/auth/register', data);
  return response.data;
};

export const login = async (data: AuthPayload): Promise<User> => {
  const response = await instance.post('/auth/login', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await instance.post('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
  const response = await instance.get('/auth/session');
  return response.data || null;
};

// --- Пользователь ---
export const getMe = async (): Promise<User> => {
  const response = await instance.get('/users/me');
  return response.data;
};

export const updateMe = async (data: UpdateUserPayload): Promise<User> => {
  const response = await instance.patch('/users/me', data);
  return response.data;
};

// --- Нотатки ---
export const fetchNotes = async (params: FetchNotesParams): Promise<NotesResponse> => {
  const response = await instance.get('/notes', { params });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await instance.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (payload: Omit<Note, 'id' | 'createdAt'>): Promise<Note> => {
  const response = await instance.post('/notes', payload);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await instance.delete(`/notes/${id}`);
  return response.data;
};