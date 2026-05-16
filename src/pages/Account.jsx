import { useState, useEffect } from 'react';
import { User, Shield, Monitor, LogOut, Clock, CheckCircle2, Mail, BadgeCheck, Loader2 } from 'lucide-react';
import { authApi } from '../api/client';
import toast from 'react-hot-toast';

export default function Account() {
  const [userData, setUserData] = useState({ name: 'Guest User', email: 'Not logged in' });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatSmartName = (name, email) => {
    if (!email || email === 'Not logged in' || email === 'undefined') {
      return (name && name !== 'undefined') ? name : 'Guest User';
    }
    
    let namePart = email.split('@')[0].replace(/[0-9]/g, '');
    const lastNames = ['tyagi', 'ranjan', 'sharma', 'singh', 'kumar', 'verma', 'gupta', 'das', 'roy', 'mishra', 'yadav', 'khan', 'ali', 'shukla', 'pandey'];
    
    let formattedName = namePart;
    for (const ln of lastNames) {
      if (namePart.endsWith(ln) && namePart.length > ln.length) {
        const first = namePart.substring(0, namePart.length - ln.length);
        formattedName = `${first} ${ln}`;
        break;
      }
    }
    formattedName = formattedName.replace(/[._-]/g, ' ');
    const finalName = formattedName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    if (finalName.length < 3 && name && name !== 'Guest User') return name;
    return finalName;
  };

  useEffect(() => {
    const storedName = localStorage.getItem('sf_user_name');
    const storedEmail = localStorage.getItem('sf_user_email');

    setUserData({
      name: formatSmartName(storedName, storedEmail),
      email: storedEmail || 'Not logged in'
    });

    const fetchSessions = async () => {
      try {
        const res = await authApi.getSessions();
        setSessions(res.data || res || []);
      } catch (e) {}
    };
    fetchSessions();
  }, []);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await authApi.updatePassword({
        currentPassword: passwords.current,
        newPassword: passwords.next
      });
      toast.success('Password updated successfully');
      setPasswords({ current: '', next: '', confirm: '' });
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    marginBottom: '1.5rem',
    color: 'var(--text-main)',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    background: 'var(--bg-app)',
    border: '1px solid var(--border-main)',
    color: 'var(--text-main)',
    fontSize: '0.875rem',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2.5rem 6rem' }}>
      
      {/* ── Profile Header ────────────────────── */}
      <div className="animate-fade-in-up" style={{ 
        position: 'relative', 
        marginBottom: '3rem',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'linear-gradient(to right, #0F172A, #1E293B)',
        height: '200px',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '2.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', zIndex: 10 }}>
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '24px',
            background: 'var(--bg-card)',
            border: '4px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          }}>
            <User size={48} />
          </div>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#FFFFFF',
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em',
            }}>{userData.name}</h1>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.875rem',
                background: 'rgba(255,255,255,0.05)',
                padding: '0.375rem 0.75rem',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <Mail size={14} />
                {userData.email}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
        
        {/* ── Security Settings ───────────────── */}
        <section className="card-editorial animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div style={sectionHeaderStyle}>
            <Shield size={20} color="var(--accent)" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Security Settings</h2>
          </div>

          <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label className="label-section" style={{ display: 'block', marginBottom: '0.5rem' }}>Current Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={passwords.current}
                onChange={e => setPasswords({...passwords, current: e.target.value})}
                style={inputStyle}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="label-section" style={{ display: 'block', marginBottom: '0.5rem' }}>New Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={passwords.next}
                  onChange={e => setPasswords({...passwords, next: e.target.value})}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="label-section" style={{ display: 'block', marginBottom: '0.5rem' }}>Confirm New</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={passwords.confirm}
                  onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                  style={inputStyle}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '0.875rem' }} disabled={loading}>
              <BadgeCheck size={18} />
              Update Password
            </button>
          </form>
        </section>

        {/* ── Session Info ────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section className="card-editorial animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div style={sectionHeaderStyle}>
              <Monitor size={20} color="var(--accent)" />
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Session Info</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ 
                padding: '1rem', 
                borderRadius: '12px', 
                background: 'var(--bg-app)', 
                border: '1px solid var(--border-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ color: 'var(--accent)' }}><Clock size={20} /></div>
                <div>
                  <p className="label-section" style={{ marginBottom: '0.125rem' }}>Last Login</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{new Date().toLocaleString()}</p>
                </div>
              </div>

              <div style={{ 
                padding: '1rem', 
                borderRadius: '12px', 
                background: 'var(--bg-app)', 
                border: '1px solid var(--border-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{ color: '#16A34A' }}><Monitor size={20} /></div>
                <div>
                  <p className="label-section" style={{ marginBottom: '0.125rem' }}>Active Sessions</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{sessions.length || 3} active sessions</p>
                </div>
              </div>

              <button 
                disabled={loading}
                onClick={async () => {
                  setLoading(true);
                  try {
                    await authApi.revokeAllSessions();
                    toast.success('Signed out of all other devices');
                    // Refresh session list
                    const res = await authApi.getSessions();
                    setSessions(res.data || res || []);
                  } catch (err) {
                    toast.error(err.message || 'Failed to revoke sessions');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="btn-secondary" 
                style={{ 
                  justifyContent: 'center', 
                  color: '#DC2626', 
                  borderColor: '#FECACA',
                  background: '#FEF2F2',
                  marginTop: '0.5rem',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                LOGOUT FROM ALL OTHER DEVICES
              </button>
            </div>
          </section>

          <section className="card-editorial animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ color: 'var(--accent)' }}><Shield size={20} /></div>
              <div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
                  Session information helps keep your account secure. If you see unfamiliar activity, change your password immediately.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
