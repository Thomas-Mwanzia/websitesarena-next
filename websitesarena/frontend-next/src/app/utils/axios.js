import axios from 'axios';

// Create an axios instance with a base URL
const api = axios.create({
  // Use NEXT_PUBLIC_API_URL for cross-origin or leave empty to use relative paths
  // in production when frontend & backend are on the same origin.
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    // Prefer developer token when on developer dashboard pages
    try {
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      const isDevPath = pathname?.startsWith('/dashboard/developer') || (config.url && config.url.includes('/api/developers'));
      if (isDevPath) {
        const devToken = localStorage.getItem('developer_token');
        if (devToken) config.headers.Authorization = `Bearer ${devToken}`;
      } else {
        const clientToken = localStorage.getItem('token') || localStorage.getItem('admin_token');
        if (clientToken) config.headers.Authorization = `Bearer ${clientToken}`;
      }
      // Fallback: if no token set yet, still allow developer_token if present
      if (!config.headers.Authorization) {
        const fallback = localStorage.getItem('developer_token') || localStorage.getItem('token');
        if (fallback) config.headers.Authorization = `Bearer ${fallback}`;
      }
    } catch (e) {
      // ignore errors reading window/localStorage on server
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Decide redirect based on which token was present
      const hadDevToken = !!localStorage.getItem('developer_token');
      const hadClientToken = !!localStorage.getItem('token') || !!localStorage.getItem('admin_token');

      // Remove tokens
      localStorage.removeItem('developer_token');
      localStorage.removeItem('token');
      localStorage.removeItem('admin_token');

      if (hadDevToken) {
        window.location.href = '/signin'; // developer sign in
      } else if (hadClientToken) {
        window.location.href = '/clientauth'; // client auth page
      } else {
        window.location.href = '/signin';
      }
    } else if (!error.response && window.location.pathname !== '/network-error') {
      window.location.href = '/network-error';
    }
    return Promise.reject(error);
  }
);

export default api;
