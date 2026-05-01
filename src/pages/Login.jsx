import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle2, LayoutPanelLeft, ListTodo, ShieldCheck, LockKeyhole, Globe } from 'lucide-react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { authApi } from '../api/client';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  if (localStorage.getItem('sf_token')) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await authApi.login({ email, password });

      // Handle both response shapes: { token } or { data: { token } }
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

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-6xl w-full flex flex-col gap-8">
        
        {/* Header Logo */}
        <div className="flex items-center gap-3 self-start px-2">
          <div className="bg-indigo-500/20 p-2 rounded-xl border border-indigo-500/30">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-indigo-300 bg-clip-text text-transparent">Story Forge</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide">AI-powered PRD to Agile story converter</p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="grid lg:grid-cols-2 bg-[#0f172a]/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
          
          {/* Left Panel: Promotional */}
          <div className="p-12 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-indigo-500/5 to-transparent">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 blur-[120px] translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10">
              {/* Feature Illustration */}
              <div className="mb-12 relative flex justify-center items-center h-48">
                {/* PRD Card */}
                <div className="absolute left-10 top-0 w-32 h-40 bg-indigo-900/40 border border-indigo-500/30 rounded-2xl p-4 backdrop-blur-md transform -rotate-6 shadow-xl">
                  <div className="text-[10px] font-bold text-indigo-400 mb-2 uppercase tracking-tighter">PRD</div>
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-indigo-500/30 rounded-full" />
                    <div className="h-1.5 w-4/5 bg-indigo-500/30 rounded-full" />
                    <div className="h-1.5 w-full bg-indigo-500/30 rounded-full" />
                  </div>
                </div>

                {/* Arrow */}
                <div className="z-20 w-16 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full opacity-50 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-blue-500 rotate-45" />
                </div>

                {/* Agile Stories Card */}
                <div className="absolute right-10 bottom-0 w-32 h-40 bg-blue-900/40 border border-blue-500/30 rounded-2xl p-4 backdrop-blur-md transform rotate-6 shadow-xl">
                  <div className="flex items-center gap-1.5 mb-3">
                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    <div className="h-1.5 w-12 bg-blue-400/30 rounded-full" />
                  </div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    <div className="h-1.5 w-10 bg-blue-400/30 rounded-full" />
                  </div>
                  <div className="space-y-2 mt-6">
                    <div className="h-1.5 w-full bg-blue-500/30 rounded-full" />
                    <div className="h-1.5 w-3/4 bg-blue-500/30 rounded-full" />
                  </div>
                </div>

                {/* Floating Particles */}
                <Sparkles className="absolute top-4 right-20 w-4 h-4 text-indigo-400/40" />
                <div className="absolute bottom-10 left-32 w-2 h-2 rounded-full bg-blue-400/30 animate-pulse" />
              </div>

              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Transform PRDs <br /> 
                into <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Agile stories</span>
              </h2>
              
              <p className="text-slate-400 text-lg mb-10 max-w-sm leading-relaxed">
                Upload your PRD. Our AI analyzes, structures, and converts it into actionable user stories in seconds.
              </p>

              <div className="space-y-5">
                {[
                  { icon: <LayoutPanelLeft className="w-5 h-5 text-indigo-400" />, text: "AI-powered analysis" },
                  { icon: <ListTodo className="w-5 h-5 text-blue-400" />, text: "Structured user stories" },
                  { icon: <Globe className="w-5 h-5 text-indigo-400" />, text: "Dependency mapping" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700/50">
                      {item.icon}
                    </div>
                    <span className="text-slate-300 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Login Form */}
          <div className="p-12 lg:border-l border-slate-800 bg-[#0f172a]/20 backdrop-blur-lg">
            <div className="max-w-md mx-auto">
              <div className="mb-10 text-center lg:text-left">
                <h3 className="text-3xl font-bold text-white mb-2">Welcome back</h3>
                <p className="text-slate-400">Sign in to continue to Story Forge</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="email" 
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-slate-300">Password</label>
                    <Link to="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0f172a] px-3 text-slate-500">or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 rounded-xl py-3 text-sm font-medium transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.48 10.92v3.28h7.84c-.24 1.84-.909 3.16-2.09 4.34-1.2 1.2-3.07 2.48-6.13 2.48-4.75 0-8.49-3.74-8.49-8.49s3.74-8.49 8.49-8.49c2.57 0 4.41.97 5.79 2.29l2.31-2.31c-1.95-1.85-4.47-3-8.1-3C5.48 1 0 6.48 0 13.04S5.48 25.08 12.08 25.08c3.58 0 6.3-1.18 8.4-3.32 2.15-2.15 2.84-5.21 2.84-7.67 0-.74-.06-1.44-.18-2.12H12.48z" />
                  </svg>
                  Continue with Google
                </button>
                <button className="flex items-center justify-center gap-3 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 rounded-xl py-3 text-sm font-medium transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 23 23">
                    <path fill="#f3f3f3" d="M0 0h11.002v11.002H0zM11.998 0H23v11.002H11.998zM0 11.998h11.002V23H0zM11.998 11.998H23V23H11.998z" />
                  </svg>
                  Continue with Microsoft
                </button>
              </div>

              <p className="mt-8 text-center text-slate-400 text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between px-2 gap-6 pb-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500/60" />
              Enterprise-grade security
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <LockKeyhole className="w-4 h-4 text-emerald-500/60" />
              Your data is protected
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <Sparkles className="w-4 h-4 text-emerald-500/60" />
              Privacy first
            </div>
          </div>
          
          <p className="text-slate-500 text-xs">
            © 2024 Story Forge. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
