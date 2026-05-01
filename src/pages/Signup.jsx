import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Sparkles, CheckCircle2, LayoutPanelLeft, ListTodo, ShieldCheck, LockKeyhole, Globe, User } from 'lucide-react';
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
        toast.success('Account created successfully!');
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to sign up');
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
              <h2 className="text-4xl font-bold mb-6 leading-tight">
                Join <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Story Forge</span> <br /> 
                today
              </h2>
              
              <p className="text-slate-400 text-lg mb-10 max-w-sm leading-relaxed">
                Start transforming your PRDs into high-quality Agile artifacts in seconds.
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

          {/* Right Panel: Signup Form */}
          <div className="p-12 lg:border-l border-slate-800 bg-[#0f172a]/20 backdrop-blur-lg">
            <div className="max-w-md mx-auto">
              <div className="mb-10 text-center lg:text-left">
                <h3 className="text-3xl font-bold text-white mb-2">Create an account</h3>
                <p className="text-slate-400">Get started with Story Forge for free</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="text" 
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="email" 
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
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

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <p className="mt-8 text-center text-slate-400 text-sm">
                Already have an account? {' '}
                <Link to="/login" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                  Sign in
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
