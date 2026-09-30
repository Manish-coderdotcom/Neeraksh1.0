import React, { useState } from 'react';
import { 
  Waves, 
  Lock, 
  Key, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Satellite, 
  Compass, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [researcherId, setResearcherId] = useState('dr.satyam@neeraksh.gov');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Required password: "seelampur ki baatein" (case-insensitive & trimmed)
    const normalizedInput = password.trim().toLowerCase();
    const correctPassword = "seelampur ki baatein";

    if (!normalizedInput) {
      setErrorMsg('Please enter your operational clearance key.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (normalizedInput === correctPassword) {
        setLoginSuccess(true);
        localStorage.setItem('oceanembed_auth', 'authenticated');
        localStorage.setItem('oceanembed_user', researcherId);
        setTimeout(() => {
          onLoginSuccess();
        }, 800);
      } else {
        setErrorMsg('Invalid operational clearance key. Access denied.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#020a13] bg-bathy-grid text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background bioluminescent ambient glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Authentication Card */}
      <div className="relative z-10 w-full max-w-md bg-[#05131f]/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/50">
        {/* Header Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-white shadow-xl shadow-emerald-500/25 border border-emerald-300/40 mb-3 animate-subtle-pulse">
            <Waves className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans']">
            Neer<span className="text-emerald-400">aksh</span> Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Subsurface Ocean Intelligence & Autonomous Profiler Gateway
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono tracking-wider uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Operational Research Clearance</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Researcher Identifier Input */}
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
              Researcher Identifier / Call Sign
            </label>
            <input
              type="text"
              value={researcherId}
              onChange={(e) => setResearcherId(e.target.value)}
              className="w-full bg-[#030a12] border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none font-mono transition"
              placeholder="e.g. researcher@oceanembed.gov"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-mono uppercase text-slate-400">
                Operational Clearance Key
              </label>
              <span className="text-[10px] font-mono text-emerald-400">
                Key Required
              </span>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Key className="w-4 h-4 text-emerald-400" />
              </div>

              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#030a12] border border-slate-800 focus:border-emerald-500 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none font-mono transition"
                placeholder="Enter clearance password..."
                autoFocus
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 flex items-center gap-2 text-xs text-rose-300 font-mono animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {loginSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/70 flex items-center gap-2 text-xs text-emerald-300 font-mono animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold">Access Granted: Initializing Neeraksh Subsurface Digital Twin...</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || loginSuccess}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/40 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Verifying Cryptographic Handshake...</span>
              </span>
            ) : loginSuccess ? (
              <span>Authenticated</span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span>Authenticate & Access Platform</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </form>

        {/* Security & Provenance Badge Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-[10px] font-mono text-slate-500 text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Satellite className="w-3 h-3 text-emerald-400" />
            <span>Sentinel-3 / CMEMS / ARGO GDAC Authenticated</span>
          </div>
          <div className="text-slate-600">
            Internal clearance key configured: <span className="text-emerald-500/70">seelampur ki baatein</span>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="mt-8 text-center text-xs font-mono text-slate-600">
        Neeraksh Research Consortium • 2026 Operational Release
      </div>
    </div>
  );
};
