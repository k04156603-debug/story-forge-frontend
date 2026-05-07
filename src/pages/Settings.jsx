import React, { useState, useEffect, useCallback } from 'react';
import {
  Monitor, Moon, Sun, Smartphone, Tablet, Laptop,
  Globe, Trash2, ShieldAlert, Check, RefreshCw,
  Waves, Heart, Zap
} from 'lucide-react';
import { authApi } from '../api/client';
import { toast } from 'react-hot-toast';

const THEME_KEY = 'sf_theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme
  );
}

function DeviceIcon({ type }) {
  const cls = 'w-5 h-5';
  if (type === 'Mobile') return <Smartphone className={cls} />;
  if (type === 'Tablet') return <Tablet className={cls} />;
  return <Laptop className={cls} />;
}

function timeAgo(date) {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

const themes = [
  {
    id: 'dark',
    label: 'Dark',
    icon: Moon,
    desc: 'Easy on the eyes',
    preview: { bg: '#020617', surface: '#0f172a', accent: '#818cf8', text: '#f1f5f9' },
  },
  {
    id: 'light',
    label: 'Light',
    icon: Sun,
    desc: 'Clean & bright',
    preview: { bg: '#eef0f5', surface: '#ffffff', accent: '#4f46e5', text: '#0d0d0d' },
  },
  {
    id: 'system',
    label: 'System',
    icon: Monitor,
    desc: 'Follows device',
    preview: { bg: '#1e293b', surface: '#0f172a', accent: '#818cf8', text: '#f1f5f9' },
  },
  {
    id: 'ocean',
    label: 'Ocean',
    icon: Waves,
    desc: 'Deep sea blues',
    preview: { bg: '#020c18', surface: '#041628', accent: '#00b4dc', text: '#e0f4ff' },
  },
  {
    id: 'love',
    label: 'Love',
    icon: Heart,
    desc: 'Warm rose tones',
    preview: { bg: '#150008', surface: '#200010', accent: '#ff3278', text: '#ffe4f0' },
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    icon: Zap,
    desc: 'Neon on black',
    preview: { bg: '#000000', surface: '#0a0a0a', accent: '#00ff64', text: '#00ff64' },
  },
];

export default function Settings() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark');
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [revoking, setRevoking] = useState(null);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const fetchSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      const res = await authApi.getSessions();
      setSessions(res.data || res || []);
    } catch {
      toast.error('Failed to load sessions');
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const handleRevoke = async (id) => {
    setRevoking(id);
    try {
      await authApi.revokeSession(id);
      setSessions(prev => prev.filter(s => s.id !== id));
      toast.success('Session revoked');
    } catch {
      toast.error('Failed to revoke session');
    } finally {
      setRevoking(null);
    }
  };

  const handleRevokeAll = async () => {
    setRevoking('all');
    try {
      await authApi.revokeAllSessions();
      setSessions(prev => prev.filter(s => s.isCurrent));
      toast.success('All other sessions revoked');
    } catch {
      toast.error('Failed to revoke sessions');
    } finally {
      setRevoking(null);
    }
  };

  const otherSessions = sessions.filter(s => !s.isCurrent);
  const currentSession = sessions.find(s => s.isCurrent);

  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Manage your preferences and active sessions
          </p>
        </div>

        {/* ── Appearance ─────────────────────────── */}
        <section className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-5">
            <Sun className="w-4 h-4" style={{ color: 'var(--accent, #818cf8)' }} />
            <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Appearance</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {themes.map(({ id, label, icon: Icon, desc, preview }) => {
              const active = theme === id;
              return (
                <button
                  key={id}
                  onClick={() => setTheme(id)}
                  className="relative rounded-xl overflow-hidden transition-all duration-200 text-left"
                  style={{
                    border: active ? `2px solid ${preview.accent}` : '2px solid rgba(255,255,255,0.08)',
                    boxShadow: active ? `0 0 20px ${preview.accent}50` : 'none',
                    cursor: 'pointer',
                    transform: active ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  {/* Mini theme preview */}
                  <div className="h-16 w-full relative flex items-end p-1.5 gap-1"
                    style={{ backgroundColor: preview.bg }}>
                    {/* Sidebar strip */}
                    <div className="absolute left-0 top-0 bottom-0 w-5 flex flex-col items-center gap-1 pt-2"
                      style={{ backgroundColor: preview.surface }}>
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: preview.accent, opacity: 0.9 }} />
                      <div className="w-2.5 h-1.5 rounded-sm" style={{ backgroundColor: preview.text, opacity: 0.2 }} />
                      <div className="w-2.5 h-1.5 rounded-sm" style={{ backgroundColor: preview.text, opacity: 0.2 }} />
                    </div>
                    {/* Content area */}
                    <div className="ml-5 flex flex-col gap-1 flex-1">
                      <div className="h-2 rounded-sm w-3/4" style={{ backgroundColor: preview.text, opacity: 0.25 }} />
                      <div className="flex gap-1">
                        <div className="h-4 flex-1 rounded-sm" style={{ backgroundColor: preview.surface, opacity: 0.8 }} />
                        <div className="h-4 flex-1 rounded-sm" style={{ backgroundColor: preview.accent, opacity: 0.35 }} />
                        <div className="h-4 flex-1 rounded-sm" style={{ backgroundColor: preview.surface, opacity: 0.8 }} />
                      </div>
                    </div>
                    {/* Active check */}
                    {active && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: preview.accent }}>
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <div className="px-2.5 py-2 flex items-center gap-1.5"
                    style={{ backgroundColor: 'var(--bg-surface)', borderTop: `1px solid ${preview.accent}40` }}>
                    <Icon className="w-3 h-3 flex-shrink-0"
                      style={{ color: active ? preview.accent : 'var(--text-muted)' }} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-tight truncate"
                        style={{ color: active ? preview.accent : 'var(--text-primary)' }}>
                        {label}
                      </p>
                      <p className="text-[9px] leading-tight truncate"
                        style={{ color: 'var(--text-muted)' }}>
                        {desc}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Active Sessions ─────────────────────── */}
        <section className="rounded-2xl p-6 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" style={{ color: '#34d399' }} />
              <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Active Sessions</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={fetchSessions} className="p-1.5 rounded-lg transition-all"
                style={{ color: 'var(--text-muted)', backgroundColor: 'var(--hover-bg)' }} title="Refresh">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              {otherSessions.length > 1 && (
                <button onClick={handleRevokeAll} disabled={revoking === 'all'}
                  className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                  style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', cursor: revoking === 'all' ? 'not-allowed' : 'pointer' }}>
                  <ShieldAlert className="w-3 h-3" />
                  {revoking === 'all' ? 'Revoking…' : 'Revoke all others'}
                </button>
              )}
            </div>
          </div>

          {loadingSessions ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="rounded-xl animate-pulse"
                  style={{ backgroundColor: 'var(--hover-bg)', height: 72 }} />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: 'var(--text-muted)' }}>
              No active sessions found
            </p>
          ) : (
            <div className="space-y-3">
              {currentSession && (
                <SessionCard session={currentSession} isCurrent onRevoke={handleRevoke} revoking={revoking} />
              )}
              {otherSessions.map(s => (
                <SessionCard key={s.id} session={s} onRevoke={handleRevoke} revoking={revoking} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SessionCard({ session, isCurrent, onRevoke, revoking }) {
  return (
    <div className="flex items-center gap-4 rounded-xl p-4 border transition-all"
      style={{
        backgroundColor: isCurrent ? 'rgba(52,211,153,0.06)' : 'var(--hover-bg)',
        borderColor: isCurrent ? 'rgba(52,211,153,0.2)' : 'var(--border-color)',
      }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: isCurrent ? 'rgba(52,211,153,0.15)' : 'var(--bg-card)',
          color: isCurrent ? '#34d399' : 'var(--text-secondary)',
        }}>
        <DeviceIcon type={session.device} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
            {session.browser} on {session.os}
          </span>
          {isCurrent && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(52,211,153,0.2)', color: '#34d399' }}>
              This device
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          {session.ip && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{session.ip}</span>}
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{timeAgo(session.lastActive)}</span>
        </div>
      </div>
      {!isCurrent && (
        <button onClick={() => onRevoke(session.id)} disabled={revoking === session.id}
          className="p-2 rounded-lg transition-all flex-shrink-0"
          style={{
            background: 'rgba(239,68,68,0.1)', color: '#f87171',
            cursor: revoking === session.id ? 'not-allowed' : 'pointer',
            opacity: revoking === session.id ? 0.6 : 1,
          }}
          title="Revoke session">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}