import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  ShieldCheck, 
  Key, 
  Sparkles, 
  ArrowRight,
  Database,
  CheckCircle2,
  Users,
  Code
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    loginWithCredentials, 
    signUpWithCredentials, 
    loginWithOAuth, 
    users, 
    currentUser, 
    switchPersona,
    supabaseAuthConfig,
    setSupabaseAuthConfig,
    addToast
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup' | 'personas' | 'supabase'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Developer');
  const [isLoading, setIsLoading] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState(supabaseAuthConfig.url || '');
  const [supabaseKey, setSupabaseKey] = useState(supabaseAuthConfig.anonKey || '');

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    await loginWithCredentials(email, password);
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) return;
    setIsLoading(true);
    await signUpWithCredentials(fullName, email, password, selectedRole);
    setIsLoading(false);
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    setSupabaseAuthConfig({
      url: supabaseUrl,
      anonKey: supabaseKey,
      isConfigured: !!(supabaseUrl && supabaseKey)
    });
    addToast({
      type: 'success',
      title: 'Supabase Cloud Auth Configured',
      message: 'Client connected to project endpoint.'
    });
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 font-mono text-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg brutal-panel p-5 sm:p-6 bg-[#161b22] border-[3px] border-black shadow-[12px_12px_0px_#000] space-y-5">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded border-2 border-black bg-[#ffee00] text-black shadow-[2px_2px_0px_#000]">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display text-base font-black text-white uppercase tracking-tight">
                DataPilot Authentication
              </h2>
              <p className="text-[10px] text-slate-400">
                Secure Session & Role-Based Access Control
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="brutal-badge bg-white text-black hover:bg-[#ffee00] cursor-pointer p-1.5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex rounded bg-[#0d1117] p-1 border-2 border-black shadow-[3px_3px_0px_#000] overflow-x-auto scrollbar-none">
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-1.5 px-2 text-center font-black rounded transition-all cursor-pointer ${
              mode === 'signin' ? 'bg-[#ffee00] text-black shadow-[2px_2px_0px_#000]' : 'text-slate-300 hover:text-white'
            }`}
          >
            SIGN IN
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-1.5 px-2 text-center font-black rounded transition-all cursor-pointer ${
              mode === 'signup' ? 'bg-[#00f0ff] text-black shadow-[2px_2px_0px_#000]' : 'text-slate-300 hover:text-white'
            }`}
          >
            CREATE ACCOUNT
          </button>
          <button
            onClick={() => setMode('personas')}
            className={`flex-1 py-1.5 px-2 text-center font-black rounded transition-all cursor-pointer ${
              mode === 'personas' ? 'bg-[#00ff66] text-black shadow-[2px_2px_0px_#000]' : 'text-slate-300 hover:text-white'
            }`}
          >
            1-CLICK DEMO
          </button>
          <button
            onClick={() => setMode('supabase')}
            className={`flex-1 py-1.5 px-2 text-center font-black rounded transition-all cursor-pointer ${
              mode === 'supabase' ? 'bg-[#ff007f] text-white shadow-[2px_2px_0px_#000]' : 'text-slate-300 hover:text-white'
            }`}
          >
            SUPABASE
          </button>
        </div>

        {/* Tab 1: Sign In Form */}
        {mode === 'signin' && (
          <div className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arvind@company.com"
                    className="w-full brutal-box pl-9 pr-3 py-2 text-white bg-[#0d1117] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Password</label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full brutal-box pl-9 pr-3 py-2 text-white bg-[#0d1117] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full brutal-btn brutal-btn-yellow py-2 text-xs font-black min-h-[40px] mt-2"
              >
                {isLoading ? 'AUTHENTICATING...' : 'SIGN IN TO WORKSPACE'}
              </button>
            </form>

            <div className="relative flex items-center justify-center border-t border-black my-2 pt-2">
              <span className="bg-[#161b22] px-2 text-[10px] font-black text-slate-400 uppercase">OR SOCIAL AUTH</span>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => loginWithOAuth('github')}
                className="brutal-btn bg-black text-white hover:bg-slate-900 py-2 text-xs font-black min-h-[38px] flex items-center justify-center space-x-1.5"
              >
                <Code className="h-4 w-4 text-[#ffee00]" />
                <span>GITHUB AUTH</span>
              </button>

              <button
                onClick={() => loginWithOAuth('google')}
                className="brutal-btn bg-white text-black hover:bg-slate-100 py-2 text-xs font-black min-h-[38px] flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="h-4 w-4 text-[#ff007f] fill-[#ff007f]" />
                <span>GOOGLE AUTH</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Create Account (Sign Up) */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Arvind Sharma"
                  className="w-full brutal-box pl-9 pr-3 py-2 text-white bg-[#0d1117] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arvind@company.com"
                  className="w-full brutal-box pl-9 pr-3 py-2 text-white bg-[#0d1117] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full brutal-box px-3 py-2 text-white bg-[#0d1117] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Team Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full brutal-box px-2 py-2 text-white bg-[#0d1117] outline-none font-bold"
                >
                  <option value="Owner">Owner</option>
                  <option value="Admin">Admin</option>
                  <option value="Developer">Developer</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full brutal-btn bg-[#00f0ff] text-black hover:bg-[#00d0df] py-2 text-xs font-black min-h-[40px] mt-2"
            >
              {isLoading ? 'CREATING ACCOUNT...' : 'CREATE NEW ACCOUNT'}
            </button>
          </form>
        )}

        {/* Tab 3: 1-Click Fast Persona Switcher */}
        {mode === 'personas' && (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-300">
              Instantly test and preview workspace permissions by switching between pre-configured enterprise team roles:
            </p>

            <div className="space-y-2">
              {users.map((u) => {
                const isSelected = currentUser.id === u.id;

                return (
                  <div
                    key={u.id}
                    onClick={() => {
                      switchPersona(u.id);
                      setIsAuthModalOpen(false);
                    }}
                    className={`cursor-pointer brutal-box p-3 flex items-center justify-between transition-all ${
                      isSelected 
                        ? 'bg-[#ffee00] text-black shadow-[3px_3px_0px_#000]' 
                        : 'bg-[#0d1117] text-white hover:bg-[#21262d]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={u.name}
                        className="h-9 w-9 rounded-full border-2 border-black object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-xs">{u.name}</span>
                          <span className={`brutal-badge text-[8px] ${
                            isSelected ? 'bg-black text-white' : 'bg-[#ffee00] text-black'
                          }`}>
                            {u.role}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">{u.email}</p>
                      </div>
                    </div>

                    {isSelected ? (
                      <CheckCircle2 className="h-5 w-5 text-black" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Live Supabase / Firebase Connection */}
        {mode === 'supabase' && (
          <form onSubmit={handleSaveSupabase} className="space-y-3">
            <div className="brutal-box p-3 bg-[#0d1117] space-y-1">
              <span className="text-[#ff007f] font-black text-xs">// SUPABASE GOTRUE CLOUD AUTH</span>
              <p className="text-[11px] text-slate-400">
                Connect your cloud Supabase database URL and Public Anon Key to authenticate live users directly against your Postgres `auth.users` schema.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Supabase Project URL</label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full brutal-box px-3 py-2 text-white bg-[#0d1117] outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-300 uppercase mb-1">Supabase Anon Public Key</label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full brutal-box px-3 py-2 text-white bg-[#0d1117] outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full brutal-btn bg-[#ff007f] text-white hover:bg-[#e0006f] py-2 text-xs font-black min-h-[40px] mt-2"
            >
              SAVE & CONNECT SUPABASE
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
