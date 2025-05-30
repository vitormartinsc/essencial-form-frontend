// Utilitário para requisições autenticadas com refresh automático do token JWT

const API_URL = process.env.REACT_APP_API_URL || 'https://essencal-form-backend.onrender.com';

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;
  try {
    const response = await fetch(`${API_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('accessToken', data.access);
      return data.access;
    }
  } catch (err) {
    // Ignora
  }
  return null;
}

export async function authFetch(url, options = {}, retry = true) {
  let accessToken = localStorage.getItem('accessToken');
  const headers = options.headers ? { ...options.headers } : {};
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  try {
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401 && retry) {
      // Tenta refresh
      const newToken = await refreshAccessToken();
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        return fetch(url, { ...options, headers });
      } else {
        // Se o refresh falhar, redireciona para login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.hash = '#/login';
        return; // Para execução
      }
    }
    return response;
  } catch (err) {
    throw err;
  }
}

// Use authFetch no lugar de fetch para requisições autenticadas.
