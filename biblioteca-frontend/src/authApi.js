// api de autenticação para login, cadastro e gerenciamento de sessão do usuário

import { getToken } from './authUtils';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// wrapper de fetch que adiciona token jwt automaticamente em todas as requisicoes
const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      // adiciona token no header authorization se existir
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.erro || `Erro ${response.status}`);
  }

  return response.json();
};

export const login = (credentials) =>
  apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });

export const register = (userData) =>
  apiFetch('/auth/cadastro', { method: 'POST', body: JSON.stringify(userData) });

export const getMe = () => apiFetch('/auth/me');

export const logout = () => {
  localStorage.removeItem('acervo_token');
};

