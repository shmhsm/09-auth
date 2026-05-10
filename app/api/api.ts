
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://ac.goit.global/fullstack/react/api',
});

export const instance = api;