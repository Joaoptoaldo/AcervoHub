// gerencia token jwt no localStorage do navegador

export const getToken = () => localStorage.getItem('acervo_token') || null;

export const setToken = (token) => {
  if (token) {
    // salva token no localStorage para manter sessao ativa
    localStorage.setItem('acervo_token', token);
  } else {
    localStorage.removeItem('acervo_token');
  }
};

export const clearToken = () => localStorage.removeItem('acervo_token');
