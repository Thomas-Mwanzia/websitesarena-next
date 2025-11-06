import axios from 'axios';
import ROUTES from './routes';

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
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
      // Try to pick the correct auth page based on context.
      // Priority:
      // 1. If a dev token existed -> developer sign in
      // 2. If a client/admin token existed -> client auth
      // 3. Otherwise inspect the failing request URL or pathname to decide
      let hadDevToken = false;
      let hadClientToken = false;
      try {
        hadDevToken = !!localStorage.getItem('developer_token');
        hadClientToken = !!localStorage.getItem('token') || !!localStorage.getItem('admin_token');
      } catch (e) {
        // ignore (e.g., server environment)
      }

      // Remove tokens locally to ensure logged-out state
      try {
        localStorage.removeItem('developer_token');
        localStorage.removeItem('token');
        localStorage.removeItem('admin_token');
      } catch (e) {
        // ignore
      }

      // Determine fallback based on request context when no tokens were present
      const reqUrl = error.config?.url || '';
      const pathname = (typeof window !== 'undefined' && window.location && window.location.pathname) ? window.location.pathname : '';

      if (hadDevToken) {
        window.location.href = ROUTES.SIGNIN; // developer sign in
      } else if (hadClientToken) {
        window.location.href = ROUTES.CLIENT_AUTH; // client auth page
      } else {
        // Inspect request URL / pathname to pick a sensible target
        const isClientApi = /\/api\/(clients|users|clients?)/.test(reqUrl) || pathname.startsWith('/client') || pathname.startsWith('/dashboard/client') || pathname.startsWith('/clientauth');
        const isDevApi = /\/api\/developers?/.test(reqUrl) || pathname.startsWith('/dashboard/developer') || pathname.startsWith('/signin');

        if (isClientApi) {
          window.location.href = ROUTES.CLIENT_AUTH;
        } else if (isDevApi) {
          window.location.href = ROUTES.SIGNIN;
        } else {
          // Default to client auth for unauthenticated visitors
          window.location.href = ROUTES.CLIENT_AUTH;
        }
      }
    } else if (!error.response && typeof window !== 'undefined' && window.location.pathname !== ROUTES.NETWORK_ERROR) {
      window.location.href = ROUTES.NETWORK_ERROR;
    }
    return Promise.reject(error);
  }
);

export default api;
