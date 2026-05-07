import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Upload, Settings, Sparkles, LogOut } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'New PRD' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('sf_token');
    navigate('/login');
  };

  return (
    <>
      <aside
        className="fixed left-0 top-0 bottom-0 w-[72px] backdrop-blur-xl flex flex-col items-center py-6 z-50"
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderRight: '1px solid var(--sidebar-border)',
          transition: 'background-color 0.2s ease',
        }}
      >
        {/* Logo */}
        <Link to="/" className="mb-8 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all">
            <Sparkles size={20} className="text-white" />
          </div>
        </Link>

        {/* Nav Items */}
        <nav className="flex flex-col items-center gap-2 flex-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                title={label}
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 group relative"
                style={{
                  backgroundColor: active ? 'rgba(167,139,250,0.15)' : 'transparent',
                  color: active ? "var(--sidebar-icon-active)" : "var(--sidebar-icon)",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = 'var(--hover-bg)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <Icon size={20} />
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary-500" />
                )}
                <span
                  className="absolute left-full ml-3 px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50"
                  style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Icons */}
        <div className="flex flex-col items-center gap-2">
          <Link
            to="/settings"
            title="Settings"
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors group relative"
            style={{ color: 'var(--sidebar-icon)' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--hover-bg)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--sidebar-icon)'; }}
          >
            <Settings size={20} />
            <span
              className="absolute left-full ml-3 px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50"
              style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            >
              Settings
            </span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            title="Logout"
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors group relative"
            style={{ color: 'var(--sidebar-icon)' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--sidebar-icon)'; }}
          >
            <LogOut size={20} />
            <span
              className="absolute left-full ml-3 px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50"
              style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          <div
            className="relative rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl"
            style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}
          >
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <LogOut size={26} className="text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2" style={{ color: 'var(--text-primary)' }}>
              Logout of Device?
            </h3>
            <p className="text-sm text-center mb-8 leading-relaxed" style={{ color: 'var(--sidebar-icon)' }}>
              You will be signed out of your Story Forge account on this device. You can log back in anytime.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-xl transition-all font-medium text-sm"
                style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)', backgroundColor: 'transparent' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--hover-bg)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--sidebar-icon)'; }}
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 hover:text-red-300 transition-all font-medium text-sm"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}