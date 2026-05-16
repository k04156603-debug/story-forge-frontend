import React, { useState } from 'react';
import { Mail, Lock, KeyRound, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/client';
import { toast } from 'react-hot-toast';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email });
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authApi.verifyOTP({ email, otp });
      toast.success('OTP verified');
      setStep(3);
    } catch (err) {
      toast.error(err.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setIsLoading(true);
    try {
      await authApi.resetPassword({ email, otp, password });
      toast.success('Password reset successful');
      setStep(4);
    } catch (err) {
      toast.error(err.message || 'Failed to reset password');
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
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-app)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'var(--font-sans)',
    }}>
      <div 
        className="animate-fade-in-up"
        style={{
          maxWidth: '440px',
          width: '100%',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-main)',
          borderRadius: '20px',
          padding: '2.5rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'rgba(196, 113, 59, 0.1)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            {step === 1 && <Mail size={24} color="var(--terracotta)" />}
            {step === 2 && <ShieldCheck size={24} color="var(--terracotta)" />}
            {step === 3 && <Lock size={24} color="var(--terracotta)" />}
            {step === 4 && <CheckCircle2 size={24} color="var(--terracotta)" />}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            marginBottom: '0.5rem',
          }}>
            {step === 1 && "Forgot Password?"}
            {step === 2 && "Enter OTP"}
            {step === 3 && "Reset Password"}
            {step === 4 && "All Set!"}
          </h2>
          <p style={{ color: 'var(--text-body)', fontSize: '0.9375rem' }}>
            {step === 1 && "No worries! Enter your email and we'll send an OTP."}
            {step === 2 && `We've sent a 6-digit code to ${email}`}
            {step === 3 && "Create a strong new password for your account."}
            {step === 4 && "Your password has been successfully updated."}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleRequestOTP}>
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <Mail size={18} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }} />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary hover-lift"
              style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <KeyRound size={18} style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }} />
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ ...inputStyle, letterSpacing: '0.25em', fontWeight: 'bold' }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary hover-lift"
              style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
            </button>
            <button 
              type="button" 
              onClick={() => setStep(1)}
              style={{
                width: '100%',
                marginTop: '1rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Back to email
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }} />
                <input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }} />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary hover-lift"
              style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : "Reset Password"}
            </button>
          </form>
        )}

        {step === 4 && (
          <button
            onClick={() => navigate('/login')}
            className="btn-primary hover-lift"
            style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}
          >
            Go to Login <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
          </button>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link to="/login" style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}>
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
