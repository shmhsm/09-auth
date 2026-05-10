import axios from 'axios';

const baseURL = typeof window !== 'undefined' 
  ? '/api' 
  : `${process.env.NEXT_PUBLIC_API_URL}/api`;

export const instance = axios.create({
  baseURL,
  withCredentials: true, 
});