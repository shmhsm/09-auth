import axios from 'axios';
import type { Note, CreateNotePayload } from '../types/note';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

declare const process: {
  env: { NEXT_PUBLIC_NOTEHUB_TOKEN: string };
};

const API = axios.create({
  baseURL: 'https://67069678a0e04073fb30438c.mockapi.io',
});

API.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchNotes = async ({ page = 1, perPage = 6, search = '' }): Promise<FetchNotesResponse> => {

  const { data } = await API.get<FetchNotesResponse>('/notes', {
    params: { page, limit: perPage, search },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {

  const { data } = await API.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {

  const { data } = await API.post<Note>('/notes', payload);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {

  const { data } = await API.delete<Note>(`/notes/${id}`);
  return data;
};