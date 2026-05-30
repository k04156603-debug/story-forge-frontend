import { useState, useEffect } from 'react';
import { Sun, Moon, Laptop, Globe, Bell, Mail, Smartphone, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useStore from '../store/useStore';
import { useTranslation } from '../utils/i18n';

export default function Settings() {
  const { language, setLanguage } = useStore();
  const { t } = useTranslation();
  
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('sf_theme');
    if (saved === 'midnight') return 'system';
    return saved || 'light';
  });
  const [notifications, setNotifications] = useState({ email: true, inApp: false });

  useEffect(() => {
    const applyTheme = (currentTheme) => {
      if (currentTheme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      } else {
        document.documentElement.setAttribute('data-theme', currentTheme);
      }
    };

    applyTheme(theme);
    localStorage.setItem('sf_theme', theme);

    // Listener for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') applyTheme('system');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleNotification = (type) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
    const emailMsg = language === 'Spanish' ? 'Notificaciones por correo actualizadas'
                   : language === 'French' ? 'Notifications par e-mail mises à jour'
                   : language === 'German' ? 'E-Mail-Benachrichtigungen aktualisiert'
                   : language === 'Hindi' ? 'ईमेल सूचनाएं अपडेट की गईं'
                   : 'Email notifications updated';
    const inAppMsg = language === 'Spanish' ? 'Alertas en la aplicación actualizadas'
                   : language === 'French' ? 'Alertes dans l\'application mises à jour'
                   : language === 'German' ? 'In-App-Meldungen aktualisiert'
                   : language === 'Hindi' ? 'इन-ऐप अलर्ट अपडेट किए गए'
                   : 'In-app notifications updated';
    toast.success(type === 'email' ? emailMsg : inAppMsg);
  };

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Laptop },
  ];

  const toggleStyle = (isActive) => ({
    width: '44px',
    height: '24px',
    borderRadius: '100px',
    background: isActive ? 'var(--accent)' : 'var(--border-main)',
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',
    padding: 0,
  });

  const toggleCircleStyle = (isActive) => ({
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: 'var(--bg-card)',
    position: 'absolute',
    top: '3px',
    left: isActive ? '23px' : '3px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2.5rem 6rem' }}>
      
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: '3rem' }}>
        <p className="label-section" style={{ marginBottom: '0.75rem' }}>APPLICATION</p>
        <h1 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '2.5rem',
          fontWeight: 800,
          color: 'var(--text-main)',
          letterSpacing: '-0.02em',
        }}>{t('appSettings')}</h1>
        <p style={{ color: 'var(--text-body)', marginTop: '0.5rem' }}>{t('managePreferences')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
        
        {/* ── Theme & Language ────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <section className="card-editorial animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="label-section" style={{ marginBottom: '1.5rem' }}>{t('themePreference')}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const isActive = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '1.5rem 1rem',
                      borderRadius: '16px',
                      border: isActive ? '2px solid var(--accent)' : '1px solid var(--border-main)',
                      background: isActive ? 'var(--bg-terracotta)' : 'var(--bg-app)',
                      color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    <Icon size={24} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{t(opt.id)}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="card-editorial animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="label-section" style={{ marginBottom: '1.25rem' }}>{t('language')}</h2>
            <div style={{ position: 'relative' }}>
              <select
                value={language}
                onChange={(e) => {
                  const newLang = e.target.value;
                  setLanguage(newLang);
                  const toastMsgs = {
                    English: "Language updated to English",
                    Spanish: "Idioma actualizado a Español",
                    French: "Langue mise à jour en Français",
                    German: "Sprache auf Deutsch aktualisiert",
                    Hindi: "भाषा को हिंदी में अपडेट किया गया"
                  };
                  toast.success(toastMsgs[newLang] || `Language updated to ${newLang}`);
                }}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  borderRadius: '14px',
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  appearance: 'none',
                  outline: 'none',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Hindi</option>
              </select>
              <div style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <Globe size={18} color="var(--text-muted)" />
              </div>
            </div>
          </section>
        </div>

        {/* ── Notifications ───────────────────── */}
        <section className="card-editorial animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="label-section" style={{ marginBottom: '1.5rem' }}>{t('notifications')}</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              padding: '1.25rem', 
              background: 'var(--bg-app)', 
              borderRadius: '16px',
              border: '1px solid var(--border-main)'
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                <Mail size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)' }}>{t('emailNotifications')}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('emailUpdates')}</p>
              </div>
              <button 
                onClick={() => toggleNotification('email')}
                style={toggleStyle(notifications.email)}
              >
                <div style={toggleCircleStyle(notifications.email)} />
              </button>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              padding: '1.25rem', 
              background: 'var(--bg-app)', 
              borderRadius: '16px',
              border: '1px solid var(--border-main)'
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                <Bell size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)' }}>{t('inAppAlerts')}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('inAppUpdates')}</p>
              </div>
              <button 
                onClick={() => toggleNotification('inApp')}
                style={toggleStyle(notifications.inApp)}
              >
                <div style={toggleCircleStyle(notifications.inApp)} />
              </button>
            </div>
          </div>

          <div style={{ 
            marginTop: '2rem', 
            padding: '1.25rem', 
            borderRadius: '16px', 
            background: 'var(--bg-terracotta)', 
            border: '1px solid rgba(196, 113, 59, 0.1)',
            display: 'flex',
            gap: '1rem'
          }}>
            <CheckCircle2 size={20} color="var(--accent)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
              {t('syncText')}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}