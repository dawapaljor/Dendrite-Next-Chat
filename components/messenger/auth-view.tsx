'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginMatrixUser, registerMatrixUser } from "@/lib/matrix";
import { translations, Language } from "@/lib/translations";

interface AuthViewProps {
  onAuthSuccess: () => void;
}

export default function AuthView({ onAuthSuccess }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('app_language');
    if (saved === 'en' || saved === 'bo') {
      setTimeout(() => {
        setLang(saved);
      }, 0);
    }
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Language;
    setLang(newLang);
    localStorage.setItem('app_language', newLang);
  };

  const t = translations[lang];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername || !password.trim()) {
      setErrorMsg(t.fillCredentials);
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      if (isLogin) {
        await loginMatrixUser(cleanUsername, password);
      } else {
        await registerMatrixUser(cleanUsername, password);
      }
      onAuthSuccess();
    } catch (err: any) {
      console.error("Authentication action failed:", err);
      let msg = t.connectionError;
      if (err.errcode === "M_FORBIDDEN") {
        msg = t.incorrectCredentials;
      } else if (err.errcode === "M_USER_IN_USE") {
        msg = t.usernameExists;
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-radial from-[#131726] to-[#0a0c14] p-6 select-none ${lang === 'bo' ? 'lang-bo' : ''}`}>
      {/* Soft background glow circles */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-slate-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-zinc-500/5 rounded-full blur-3xl pointer-events-none"></div>



      <div className="w-full max-w-sm text-white relative z-10 space-y-8 px-4">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="mx-auto h-10 w-auto max-w-[180px] flex items-center justify-center mb-1">
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto object-contain" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-white">
            {t.nextChat}
          </h2>
          <p className="text-[11px] text-slate-400">
            {t.connectSecureServer}
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/10 text-rose-400 text-[11px] font-medium text-center">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t.username}</label>
              <Input
                type="text"
                name="username"
                autoComplete="username"
                placeholder={t.enterUsername}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="bg-slate-900/30 border-0 focus-visible:ring-1 focus-visible:ring-white/20 text-white text-xs h-10 px-3.5 rounded-lg w-full"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t.password}</label>
              <Input
                type="password"
                name="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder={t.enterPassword}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-slate-900/30 border-0 focus-visible:ring-1 focus-visible:ring-white/20 text-white text-xs h-10 px-3.5 rounded-lg w-full"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-slate-200 text-slate-950 text-xs h-10 font-semibold rounded-lg shadow-sm active:scale-98 transition flex items-center justify-center gap-1.5 cursor-pointer border-0"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isLogin ? t.signingIn : t.creatingAccount}
                </>
              ) : (
                <>
                  {isLogin ? t.signIn : t.register}
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>

            <div className="text-center text-xs text-slate-600">
              {isLogin ? t.newUser : t.alreadyHaveAccount}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMsg(null);
                }}
                disabled={loading}
                className="text-slate-300 hover:text-white font-semibold bg-transparent border-0 outline-none cursor-pointer"
              >
                {isLogin ? t.registerAccount : t.logIn}
              </button>
            </div>
          </div>
        </form>

        {/* Language Selector */}
        <div className="flex justify-center">
          <select
            value={lang}
            onChange={handleLanguageChange}
            className="text-xs bg-[#171a2b]/85 hover:bg-[#20243d]/85 border border-slate-700/60 text-slate-200 font-bold px-3 py-1.5 rounded-lg transition cursor-pointer shadow-sm appearance-none pr-7 outline-none focus:ring-1 focus:ring-white/20"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center' }}
          >
            <option value="en">English</option>
            <option value="bo">བོད་ཡིག</option>
          </select>
        </div>
        {/* Footer info (Clean list block, no borders) */}
        <div className="pt-4 flex items-center justify-center gap-1.5 opacity-60">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="text-[10px] text-slate-400">{t.encryptionEnabled}</span>
        </div>
      </div>

    </div>
  );
}
