import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ваша-база-данных.com', 
});

interface NoteData {
  title: string;
  content: string;
  tag: string;
}

export const fetchNotes = async ({ search = '', page = 1, perPage = 12, tag = '' }) => {
  const response = await api.get('/notes', {
    params: { search, page, perPage, tag },
  });
  return response.data;
};

export const fetchNoteById = async (id: string) => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (noteData: NoteData) => {
  const response = await api.post('/notes', noteData);
  return response.data;
};