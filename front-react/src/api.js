import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const login = async (username, password) => {
  return await api.post('/login', { username, password });
};

export const register = async (username, password) => {
  return await api.post('/registrar', { username, password });
};
