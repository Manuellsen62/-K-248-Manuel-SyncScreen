import React, { useState } from 'react';
import { useAppState } from '../state/AppStateContext';
import { Mail, Lock, Eye, EyeOff, Sparkles, KeyRound } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    
    if (!email) {
      setErrorMsg('Bitte gib deine E-Mail-Adresse ein.');
      return;
    }
    if (!password) {
      setErrorMsg('Bitte gib dein Passwort ein.');
      return;
    }

    const result = login(email, password);
    if (!result.success) {
      setErrorMsg(result.error || 'Fehler beim Anmelden.');
    }
  };

  const fillCredentialsAndLogin = (eMail: string, pass: string) => {
    setEmail(eMail);
    setPassword(pass);
    setErrorMsg(null);
    // Auto-login on click for extreme ease of testing
    setTimeout(() => {
      login(eMail, pass);
    }, 50);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-white to-sky-50/50">
      <div className="flex-1 flex flex-col justify-center items-stretch my-auto mt-6">
        
        {/* Core application Logo / Title */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-14 h-14 bg-sky-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/20 mb-3 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-display font-bold tracking-tight text-slate-800">
            SyncSpace
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-[240px]">
            Zentrale Koordinationsplattform für teamübergreifende Integrationen
          </p>
        </div>

        {errorMsg && (
          <div id="login-error-alert" className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-xs font-medium text-red-700 animate-shake">
            {errorMsg}
          </div>
        )}

        {/* Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">
              E-Mail-Adresse
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="login-email-input"
                type="email"
                placeholder="z.B. sergej@syncspace.ch"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-slate-600 ml-1">
                Passwort
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="login-password-input"
                type={showPassword ? "text" : "password"}
                placeholder="Passwort eingeben"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-sans"
              />
              <button
                type="button"
                id="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            id="login-submit-button"
            className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-medium rounded-xl text-sm justify-center items-center flex transition-all shadow-md shadow-sky-500/10 mt-6 cursor-pointer"
          >
            Anmelden
          </button>
        </form>

        {/* Demo Quick Logins inside the mobile frame */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-center text-[11px] font-semibold text-slate-400 tracking-wider uppercase mb-3 flex items-center justify-center space-x-1">
            <KeyRound className="w-3.5 h-3.5 text-sky-500/60" />
            <span>Schnell-Login für Tester (1-Klick)</span>
          </p>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => fillCredentialsAndLogin('sergej@syncspace.ch', 'sergej123')}
              className="flex items-center justify-between p-2.5 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl transition-all shadow-xs cursor-pointer text-left"
            >
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-cyan-100 text-cyan-700 text-[10px] font-bold flex items-center justify-center rounded-full">
                  SM
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">Sergej</p>
                  <p className="text-[10px] text-slate-400">Scrum Master</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">Auto-Login</span>
            </button>

            <button
              onClick={() => fillCredentialsAndLogin('piotr@syncspace.ch', 'piotr123')}
              className="flex items-center justify-between p-2.5 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl transition-all shadow-xs cursor-pointer text-left"
            >
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-pink-100 text-pink-700 text-[10px] font-bold flex items-center justify-center rounded-full">
                  PO
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">Piotr</p>
                  <p className="text-[10px] text-slate-400">Product Owner</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">Auto-Login</span>
            </button>

            <button
              onClick={() => fillCredentialsAndLogin('eugen@syncspace.ch', 'eugen123')}
              className="flex items-center justify-between p-2.5 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl transition-all shadow-xs cursor-pointer text-left"
            >
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center justify-center rounded-full">
                  EN
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">Eugen</p>
                  <p className="text-[10px] text-slate-400">Entwickler</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">Auto-Login</span>
            </button>
          </div>
        </div>

      </div>

      <div className="text-center text-[10px] text-slate-400 mt-6">
        SyncSpace v1.0 • Sichere Ende-zu-Ende Verschlüsselung
      </div>
    </div>
  );
};
