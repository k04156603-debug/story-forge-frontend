import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LayoutPanelLeft, ListTodo, Globe, User, Loader2, ShieldCheck, LockKeyhole } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/client';
import { toast } from 'react-hot-toast';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setIsLoading(true);
    try {
      const response = await authApi.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        localStorage.setItem('sf_token', response.token);
        localStorage.setItem('sf_user_name', formData.name);
        localStorage.setItem('sf_user_email', formData.email);
        toast.success('Account created successfully!');
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
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
      background: 'var(--bg-app)',
      color: 'var(--text-main)',
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
            color: 'var(--text-main)',
            letterSpacing: '-0.02em',
          }}>
            Story Forge
          </span>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
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
            borderRight: '1px solid var(--border-main)',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '2.25rem',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              color: 'var(--text-main)',
              letterSpacing: '-0.025em',
            }}>
              Join{' '}
              <span style={{ color: 'var(--terracotta)', fontStyle: 'italic' }}>Story Forge</span>
              <br />today
            </h2>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-body)',
              marginBottom: '2.5rem',
              maxWidth: '380px',
              lineHeight: 1.6,
            }}>
              Start transforming your PRDs into high-quality Agile artifacts in seconds.
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
                    background: 'var(--bg-surface)',
                    border: '1px solid rgba(196, 113, 59, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>
                  <span style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.9375rem' }}>{item.text}</span>
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
                  color: 'var(--text-main)',
                  marginBottom: '0.375rem',
                }}>
                  Create an account
                </h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-body)' }}>
                  Get started with Story Forge for free
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--text-main)',
                    marginBottom: '0.5rem',
                  }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{
                      position: 'absolute',
                      left: '0.875rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }} />
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      style={inputStyle}
                      required
                      onFocus={e => { e.target.style.borderColor = 'var(--warm-gray)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--warm-gray-subtle)'; }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--text-main)',
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
                      color: 'var(--text-muted)',
                    }} />
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      style={inputStyle}
                      required
                      onFocus={e => { e.target.style.borderColor = 'var(--warm-gray)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--warm-gray-subtle)'; }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--text-main)',
                    marginBottom: '0.5rem',
                  }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{
                      position: 'absolute',
                      left: '0.875rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
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
                        color: 'var(--text-muted)',
                        padding: 0,
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--text-main)',
                    marginBottom: '0.5rem',
                  }}>
                    Confirm Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{
                      position: 'absolute',
                      left: '0.875rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      style={inputStyle}
                      required
                      onFocus={e => { e.target.style.borderColor = 'var(--warm-gray)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--warm-gray-subtle)'; }}
                    />
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
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Loader2 size={16} className="animate-spin" />
                      Creating account…
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <p style={{
                marginTop: '2rem',
                textAlign: 'center',
                fontSize: '0.875rem',
                color: 'var(--text-body)',
              }}>
                Already have an account?{' '}
                <Link to="/login" style={{
                  color: 'var(--terracotta)',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}>
                  Sign in
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
                color: 'var(--text-muted)',
              }}>
                {item.icon}
                {item.text}
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>© 2024 Story Forge. All rights reserved.</p>
        </div>
      </div>

      {/* Responsive */}
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
