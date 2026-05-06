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

// Response interceptor - unwrap data
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message;
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
  getStatus: (id) => api.get(`/prd/${id}/status`),
  delete: (id) => api.delete(`/prd/${id}`),
};

// Story API
export const storyApi = {
  getGrouped: (prdId) => api.get(`/stories/${prdId}/grouped`),
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