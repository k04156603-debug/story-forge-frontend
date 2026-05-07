import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  return (
    <div
      className="min-h-screen bg-grid"
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', transition: 'background-color 0.2s ease, color 0.2s ease' }}
    >
      <Sidebar />
      <main className="ml-[72px] min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </div>
  );
}