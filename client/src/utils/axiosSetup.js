import axios from 'axios';

// Attach Authorization header from session storage if available
axios.interceptors.request.use((config) => {
  try {
    const stored = sessionStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
  } catch {
    // ignore
  }
  return config;
});

// Optional: handle 401 globally
axios.interceptors.response.use(
  (resp) => resp,
  (error) => {
    if (error?.response?.status === 401) {
      // If token invalid/expired, clear session to force re-login
      sessionStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);
