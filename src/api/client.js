import axios from 'axios';

const isProd = import.meta.env.PROD;
const api = axios.create({
  baseURL: isProd 
    ? 'https://story-forge-khaki.vercel.app/api' 
    : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
  timeout: 300000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    if (status === 401) {
      localStorage.removeItem('sf_token');
      localStorage.removeItem('sf_user');
      if (!window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    const customError = new Error(message);
    if (error.response?.data) {
      customError.isRetryable = error.response.data.isRetryable;
      customError.retryAfter = error.response.data.retryAfter;
    }
    return Promise.reject(customError);
  }
);

export const prdApi = {
  getAll: () => api.get('/prd'),
  getById: (id) => api.get(`/prd/${id}`),
  upload: (formData) =>
    api.post('/prd/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadText: (content, title) => api.post('/prd/upload', { content, title }),
  process: (id) => api.post(`/prd/${id}/process`),
  getStatus: (id) => api.get(`/prd/${id}`, { params: { _t: Date.now() } }),
  delete: (id) => api.delete(`/prd/${id}`),
};

export const storyApi = {
  getGrouped: (prdId) => api.get(`/stories/${prdId}?grouped=true`),
  getByPrd: (prdId) => api.get(`/stories/${prdId}?grouped=true`),
  getStats: (prdId) => api.get(`/stories/${prdId}/stats`),
  update: (id, data) => api.put(`/stories/${id}`, data),
  export: (prdId, format) =>
    api.post(`/export/${prdId}`, { format }, { responseType: format === 'jira' ? 'json' : 'blob' }),
};

export const exportApi = {
  export: (prdId, format) =>
    api.post(`/export/${prdId}`, { format }, { responseType: format === 'jira' ? 'json' : 'blob' }),
};

export const analysisApi = {
  getIssues: (prdId) => api.get(`/analysis/${prdId}/issues`),
  getSummary: (prdId) => api.get(`/analysis/${prdId}/summary`),
  getDependencies: (prdId) => api.get(`/analysis/${prdId}/dependencies`),
  resolveIssue: (issueId) => api.patch(`/analysis/issues/${issueId}/resolve`),
};

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  getMe: () => api.get('/auth/me'),
  getSessions: () => api.get('/auth/sessions'),
  revokeSession: (id) => api.delete(`/auth/sessions/${id}`),
  revokeAllSessions: () => api.delete('/auth/sessions'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  updatePassword: (data) => api.patch('/auth/update-password', data),
};

export default api;