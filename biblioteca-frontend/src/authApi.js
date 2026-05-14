// authApi.js - API calls autenticação AcervoHub
// Usa authUtils + fetch com retry + error handling
// Backend: /auth/login, /auth/cadastro, /auth/me (AUTH-API.md)

import { getToken } from './authUtils';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
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

// Login - retorna { token, user }
export const login = (credentials) =>
  apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });

// Register - retorna { message, user }
export const register = (userData) =>
  apiFetch('/auth/cadastro', { method: 'POST', body: JSON.stringify(userData) });

// Get current user
export const getMe = () => apiFetch('/auth/me');

// Logout
export const logout = () => {
  localStorage.removeItem('acervo_token');
};

