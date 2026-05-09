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
import { useEffect } from 'react';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('sf_token');

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
  }, []);

  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
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
      </Routes>
    </BrowserRouter>
  );
}