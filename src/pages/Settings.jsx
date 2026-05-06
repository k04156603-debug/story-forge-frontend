import React, { useState, useEffect, useCallback } from 'react';
import { Monitor, Moon, Sun, Smartphone, Tablet, Laptop, Globe, Trash2, ShieldAlert, Check, RefreshCw } from 'lucide-react';
import { authApi } from '../api/client';
import { toast } from 'react-hot-toast';

// ── Theme helpers ─────────────────────────────────────────────────────────────
const THEME_KEY = 'sf_theme';

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    root.setAttribute('data-theme', theme);
  }
}

// ── Device icon ───────────────────────────────────────────────────────────────
function DeviceIcon({ type }) {
  const cls = 'w-5 h-5';
  if (type === 'Mobile') return <Smartphone className={cls} />;
  if (type === 'Tablet') return <Tablet className={cls} />;
  return <Laptop className={cls} />;
}

// ── Time formatter ────────────────────────────────────────────────────────────
function timeAgo(date) {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Settings() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'dark');
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [revoking, setRevoking] = useState(null);

  // Apply theme on mount + change
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Fetch sessions
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

  const themes = [
    { id: 'light', label: 'Light', icon: Sun, desc: 'Clean and bright' },
    { id: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes' },
    { id: 'system', label: 'System', icon: Monitor, desc: 'Follows your device' },
  ];

  const otherSessions = sessions.filter(s => !s.isCurrent);
  const currentSession = sessions.find(s => s.isCurrent);

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ background: 'var(--bg-base, #0f0f1a)' }}>
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Manage your preferences and active sessions
          </p>
        </div>

        {/* ── Theme Section ────────────────────────────────────────────────── */}
        <section
          className="rounded-2xl p-6 border"
          style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Sun className="w-4 h-4" style={{ color: '#a78bfa' }} />
            <h2 className="text-base font-semibold text-white">Appearance</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {themes.map(({ id, label, icon: Icon, desc }) => {
              const active = theme === id;
              return (
                <button
                  key={id}
                  onClick={() => setTheme(id)}
                  className="relative flex flex-col items-center gap-2 rounded-xl p-4 border transition-all duration-200"
                  style={{
                    background: active ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.03)',
                    borderColor: active ? '#a78bfa' : 'rgba(255,255,255,0.07)',
                    cursor: 'pointer',
                  }}
                >
                  {active && (
                    <span
                      className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: '#a78bfa' }}
                    >
                      <Check className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: active ? 'rgba(167,139,250,0.25)' : 'rgba(255,255,255,0.06)' }}
                  >
                    <Icon className="w-5 h-5" style={{ color: active ? '#a78bfa' : 'rgba(255,255,255,0.5)' }} />
                  </div>
                  <span className="text-sm font-medium" style={{ color: active ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                    {label}
                  </span>
                  <span className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {desc}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Active Sessions ──────────────────────────────────────────────── */}
        <section
          className="rounded-2xl p-6 border"
          style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" style={{ color: '#34d399' }} />
              <h2 className="text-base font-semibold text-white">Active Sessions</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchSessions}
                className="p-1.5 rounded-lg transition-all"
                style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)' }}
                title="Refresh"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              {otherSessions.length > 1 && (
                <button
                  onClick={handleRevokeAll}
                  disabled={revoking === 'all'}
                  className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
                  style={{
                    background: 'rgba(239,68,68,0.12)',
                    color: '#f87171',
                    border: '1px solid rgba(239,68,68,0.2)',
                    cursor: revoking === 'all' ? 'not-allowed' : 'pointer',
                  }}
                >
                  <ShieldAlert className="w-3 h-3" />
                  {revoking === 'all' ? 'Revoking…' : 'Revoke all others'}
                </button>
              )}
            </div>
          </div>

          {loadingSessions ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div
                  key={i}
                  className="rounded-xl p-4 animate-pulse"
                  style={{ background: 'rgba(255,255,255,0.04)', height: 72 }}
                />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: 'rgba(255,255,255,0.3)' }}>
              No active sessions found
            </p>
          ) : (
            <div className="space-y-3">
              {/* Current session first */}
              {currentSession && (
                <SessionCard session={currentSession} isCurrent onRevoke={handleRevoke} revoking={revoking} />
              )}
              {/* Other sessions */}
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
    <div
      className="flex items-center gap-4 rounded-xl p-4 border transition-all"
      style={{
        background: isCurrent ? 'rgba(52,211,153,0.06)' : 'rgba(255,255,255,0.03)',
        borderColor: isCurrent ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.06)',
      }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: isCurrent ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.06)' }}
      >
        <DeviceIcon type={session.device} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-white truncate">
            {session.browser} on {session.os}
          </span>
          {isCurrent && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(52,211,153,0.2)', color: '#34d399' }}
            >
              This device
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          {session.ip && (
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {session.ip}
            </span>
          )}
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {timeAgo(session.lastActive)}
          </span>
        </div>
      </div>

      {/* Revoke */}
      {!isCurrent && (
        <button
          onClick={() => onRevoke(session.id)}
          disabled={revoking === session.id}
          className="p-2 rounded-lg transition-all flex-shrink-0"
          style={{
            background: 'rgba(239,68,68,0.1)',
            color: '#f87171',
            cursor: revoking === session.id ? 'not-allowed' : 'pointer',
            opacity: revoking === session.id ? 0.6 : 1,
          }}
          title="Revoke session"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}