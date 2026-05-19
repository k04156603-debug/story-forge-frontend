import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import UploadPrd from './pages/UploadPrd';
import Processing from './pages/Processing';
import Results from './pages/Results';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import Account from './pages/Account';
import Help from './pages/Help';
import AuthCallback from './pages/AuthCallback';
import ForgotPassword from './pages/ForgotPassword';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('sf_token');

  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('sf_theme') || 'system';
    const applyTheme = (currentTheme) => {
      if (currentTheme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', currentTheme);
      }
    };
    applyTheme(savedTheme);

    // Also listen for system changes if set to system
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if ((localStorage.getItem('sf_theme') || 'system') === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadPrd />} />
          <Route path="/processing/:id" element={<Processing />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account" element={<Account />} />
          <Route path="/help" element={<Help />} />
        </Route>
        <Route path="*" element={<div style={{ padding: '2rem', color: 'white' }}>404 - Page Not Found. Current Path: {window.location.pathname}</div>} />
      </Routes>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
}