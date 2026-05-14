
export const getToken = () => localStorage.getItem('acervo_token') || null;

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('acervo_token', token);
  } else {
    localStorage.removeItem('acervo_token');
  }
};

export const clearToken = () => localStorage.removeItem('acervo_token');
