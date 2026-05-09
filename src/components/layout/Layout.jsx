import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LogOut, Settings, User, BookOpen, HelpCircle, LayoutDashboard, ChevronRight } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userData, setUserData] = useState({ name: 'User', email: 'user@example.com' });

  useEffect(() => {
    // Try to get user data
    const token = localStorage.getItem('sf_token');
    if (!token) return;

    // Simple decoding or fetch if needed
    setUserData({
      name: localStorage.getItem('sf_user_name') || 'Kabir',
      email: localStorage.getItem('sf_user_email') || 'kabirtyagi747@gmail.com'
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sf_token');
    localStorage.removeItem('sf_user_name');
    localStorage.removeItem('sf_user_email');
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/account', label: 'Account', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      {/* ── Sidebar ─────────────────────────── */}
      <aside style={{
        width: '260px',
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border-main)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50,
      }}>
        {/* User Profile Info */}
        <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-main)',
            margin: '0 auto 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)',
          }}>
            <User size={32} />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            marginBottom: '0.25rem',
            letterSpacing: '-0.02em',
          }}>{userData.name}</h2>
          <p style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>{userData.email}</p>
        </div>

        <hr className="divider-editorial" style={{ margin: '0 1.5rem' }} />

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1.125rem',
                  borderRadius: '14px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s ease',
                  background: isActive ? 'var(--bg-terracotta)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-body)',
                }}
              >
                <Icon size={18} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {isActive && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div style={{ padding: '1.5rem 1rem' }}>
          <button
            onClick={() => setShowLogoutModal(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 1.125rem',
              borderRadius: '14px',
              border: 'none',
              background: 'transparent',
              color: '#DC2626',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <main style={{ flex: 1, padding: '0' }}>
          <Outlet />
        </main>
      </div>

      <Toaster position="bottom-right" />

      {/* Logout Modal */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}>
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowLogoutModal(false)}
          />
          <div style={{
            position: 'relative',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-main)',
            borderRadius: '24px',
            padding: '2.5rem',
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#FEF2F2',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#DC2626',
              margin: '0 auto 1.5rem',
            }}>
              <LogOut size={28} />
            </div>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
              color: 'var(--text-main)',
            }}>Sign Out?</h3>
            <p style={{
              fontSize: '0.9375rem',
              color: 'var(--text-body)',
              marginBottom: '2rem',
              lineHeight: 1.6,
            }}>Are you sure you want to log out of your account on this device?</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="btn-secondary"
                style={{ flex: 1, padding: '0.875rem', justifyContent: 'center' }}
              >Cancel</button>
              <button
                onClick={handleLogout}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  borderRadius: '100px',
                  background: '#DC2626',
                  color: 'white',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#B91C1C'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#DC2626'; }}
              >Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}