import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, LayoutPanelLeft, ListTodo, Globe, Loader2, ShieldCheck, LockKeyhole } from 'lucide-react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { authApi } from '../api/client';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (localStorage.getItem('sf_token')) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await authApi.login({ email, password });
      const token = response?.token || response?.data?.token;
      if (token) {
        localStorage.setItem('sf_token', token);
        toast.success('Successfully logged in!');
        navigate('/');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || ''}/api/auth/google`;
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem 0.875rem 2.75rem',
    borderRadius: '12px',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-main)',
    color: 'var(--text-main)',
    fontSize: '0.9375rem',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--ivory)',
      color: 'var(--rich-black)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ maxWidth: '1040px', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Header Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.25rem' }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.375rem',
            fontWeight: 700,
            color: 'var(--rich-black)',
            letterSpacing: '-0.02em',
          }}>
            Story Forge
          </span>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-muted-ed)',
            marginLeft: '0.25rem',
          }}>
            PRD → AGILE
          </span>
        </div>

        {/* Main Card */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-main)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>

          {/* Left Panel */}
          <div style={{
            padding: '3.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRight: '1px solid var(--warm-gray-subtle)',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.25rem',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              color: 'var(--rich-black)',
              letterSpacing: '-0.025em',
            }}>
              Transform PRDs<br />
              into <span style={{ color: 'var(--terracotta)', fontStyle: 'italic' }}>Agile stories</span>
            </h2>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-body)',
              marginBottom: '2.5rem',
              maxWidth: '380px',
              lineHeight: 1.6,
            }}>
              Upload your PRD. Our AI analyzes, structures, and converts it into actionable user stories in seconds.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { icon: <LayoutPanelLeft size={18} color="var(--terracotta)" />, text: "AI-powered analysis" },
                { icon: <ListTodo size={18} color="var(--terracotta)" />, text: "Structured user stories" },
                { icon: <Globe size={18} color="var(--terracotta)" />, text: "Dependency mapping" }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'var(--terracotta-bg)',
                    border: '1px solid rgba(196, 113, 59, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>
                  <span style={{ fontWeight: 500, color: 'var(--rich-black)', fontSize: '0.9375rem' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div style={{ padding: '3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--rich-black)',
                  marginBottom: '0.375rem',
                }}>
                  Welcome back
                </h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-body)' }}>
                  Sign in to continue to Story Forge
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--rich-black)',
                    marginBottom: '0.5rem',
                  }}>
                    Email address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{
                      position: 'absolute',
                      left: '0.875rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted-ed)',
                    }} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={inputStyle}
                      required
                      onFocus={e => { e.target.style.borderColor = 'var(--warm-gray)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--warm-gray-subtle)'; }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--rich-black)' }}>Password</label>
                    <Link to="/forgot-password" style={{
                      fontSize: '0.8125rem',
                      color: 'var(--terracotta)',
                      textDecoration: 'none',
                      fontWeight: 500,
                    }}>
                      Forgot password?
                    </Link>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{
                      position: 'absolute',
                      left: '0.875rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted-ed)',
                    }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ ...inputStyle, paddingRight: '2.75rem' }}
                      required
                      onFocus={e => { e.target.style.borderColor = 'var(--warm-gray)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--warm-gray-subtle)'; }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.875rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted-ed)',
                        padding: 0,
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '0.875rem',
                    fontSize: '0.9375rem',
                    marginTop: '0.5rem',
                  }}
                >
                  {isLoading ? (
                    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.125rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Loader2 size={16} className="animate-spin" />
                        Signing in…
                      </span>
                      <span style={{ fontSize: '0.7rem', opacity: 0.6, fontWeight: 400 }}>Server is waking up, please wait</span>
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div style={{ position: 'relative', margin: '2rem 0' }}>
                <hr className="divider-editorial" />
                <span style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'var(--bg-card)',
                  padding: '0 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted-ed)',
                }}>
                  or continue with
                </span>
              </div>

              {/* OAuth Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  onClick={handleGoogleLogin}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-main)',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--text-main)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-surface)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.909 3.16-2.09 4.34-1.2 1.2-3.07 2.48-6.13 2.48-4.75 0-8.49-3.74-8.49-8.49s3.74-8.49 8.49-8.49c2.57 0 4.41.97 5.79 2.29l2.31-2.31c-1.95-1.85-4.47-3-8.1-3C5.48 1 0 6.48 0 13.04S5.48 25.08 12.08 25.08c3.58 0 6.3-1.18 8.4-3.32 2.15-2.15 2.84-5.21 2.84-7.67 0-.74-.06-1.44-.18-2.12H12.48z" />
                  </svg>
                  Google
                </button>
                <button
                  disabled
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-main)',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    cursor: 'not-allowed',
                    opacity: 0.4,
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--text-main)',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 23 23">
                    <path fill="#888" d="M0 0h11.002v11.002H0zM11.998 0H23v11.002H11.998zM0 11.998h11.002V23H0zM11.998 11.998H23V23H11.998z" />
                  </svg>
                  Microsoft
                </button>
              </div>

              <p style={{
                marginTop: '2rem',
                textAlign: 'center',
                fontSize: '0.875rem',
                color: 'var(--text-body)',
              }}>
                Don't have an account?{' '}
                <Link to="/signup" style={{
                  color: 'var(--terracotta)',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}>
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '1rem',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem' }}>
            {[
              { icon: <ShieldCheck size={14} color="var(--terracotta)" />, text: "Enterprise-grade security" },
              { icon: <LockKeyhole size={14} color="var(--terracotta)" />, text: "Your data is protected" },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--text-muted-ed)',
              }}>
                {item.icon}
                {item.text}
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted-ed)' }}>© 2024 Story Forge. All rights reserved.</p>
        </div>
      </div>

      {/* Responsive: collapse grid on mobile */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="border-right: 1px solid var(--warm-gray-subtle)"] {
            border-right: none !important;
            border-bottom: 1px solid var(--warm-gray-subtle) !important;
          }
        }
      `}</style>
    </div>
  );
}