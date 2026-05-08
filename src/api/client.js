import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 300000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - unwrap data + handle 401
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    // If session revoked or token invalid — clear storage and redirect to login
    if (status === 401) {
      localStorage.removeItem('sf_token');
      localStorage.removeItem('sf_user');
      // Only redirect if not already on login/signup page
      if (!window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(new Error(message));
  }
);

// PRD API
export const prdApi = {
  getAll: () => api.get('/prd'),
  getById: (id) => api.get(`/prd/${id}`),
  upload: (formData) =>
    api.post('/prd/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadText: (content, title) => api.post('/prd/text', { content, title }),
  process: (id) => api.post(`/prd/${id}/process`),
  getStatus: (id) => api.get(`/prd/${id}`),
  delete: (id) => api.delete(`/prd/${id}`),
};

// Story API
export const storyApi = {
  getGrouped: (prdId) => api.get(`/stories/${prdId}/grouped`),
  getByPrd: (prdId) => api.get(`/stories/${prdId}/grouped`),
  getStats: (prdId) => api.get(`/stories/${prdId}/stats`),
  update: (id, data) => api.patch(`/stories/${id}`, data),
  export: (prdId, format) => api.get(`/export/${prdId}/${format}`, { responseType: 'blob' }),
};

// Export API
export const exportApi = {
  export: (prdId, format) =>
    api.get(`/export/${prdId}/${format}`, { responseType: 'blob' }),
};

// Analysis API
export const analysisApi = {
  getIssues: (prdId) => api.get(`/analysis/${prdId}/issues`),
  getSummary: (prdId) => api.get(`/analysis/${prdId}/summary`),
  getDependencies: (prdId) => api.get(`/analysis/${prdId}/dependencies`),
};

// Auth API
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  getMe: () => api.get('/auth/me'),

  // Sessions
  getSessions: () => api.get('/auth/sessions'),
  revokeSession: (id) => api.delete(`/auth/sessions/${id}`),
  revokeAllSessions: () => api.delete('/auth/sessions'),
};

export default api;