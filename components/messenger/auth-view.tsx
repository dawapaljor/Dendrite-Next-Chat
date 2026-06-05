'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginMatrixUser, registerMatrixUser } from "@/lib/matrix";

interface AuthViewProps {
  onAuthSuccess: () => void;
}

export default function AuthView({ onAuthSuccess }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg("Please fill in all credentials.");
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      if (isLogin) {
        await loginMatrixUser(username.trim(), password);
      } else {
        await registerMatrixUser(username.trim(), password);
      }
      onAuthSuccess();
    } catch (err: any) {
      console.error("Authentication action failed:", err);
      let msg = "Connection error. Please try again.";
      if (err.errcode === "M_FORBIDDEN") {
        msg = "Incorrect username or password.";
      } else if (err.errcode === "M_USER_IN_USE") {
        msg = "Username already exists.";
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-radial from-[#131726] to-[#0a0c14] p-6 select-none">
      {/* Soft background glow circles */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-sm text-white relative z-10 space-y-8 px-4">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="mx-auto h-10 w-auto max-w-[180px] flex items-center justify-center mb-1">
            <img src="/tchrd-logo-small.svg" alt="Logo" className="h-8 w-auto object-contain" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-white">
            Next Chat
          </h2>
          <p className="text-[11px] text-slate-400">
            Connect to secure server at <span className="font-mono text-blue-400/90">im.tibcert.org</span>
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
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Username</label>
              <Input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="bg-slate-900/30 border-0 focus-visible:ring-1 focus-visible:ring-blue-500/50 text-white text-xs h-10 px-3.5 rounded-lg w-full"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-slate-900/30 border-0 focus-visible:ring-1 focus-visible:ring-blue-500/50 text-white text-xs h-10 px-3.5 rounded-lg w-full"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs h-10 font-semibold rounded-lg shadow-sm active:scale-98 transition flex items-center justify-center gap-1.5 cursor-pointer border-0"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isLogin ? "Signing in..." : "Creating Account..."}
                </>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Register"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>

            <div className="text-center text-xs text-slate-450">
              {isLogin ? "New user to this server?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMsg(null);
                }}
                disabled={loading}
                className="text-blue-400 hover:text-blue-300 font-semibold bg-transparent border-0 outline-none cursor-pointer"
              >
                {isLogin ? "Register Account" : "Log In"}
              </button>
            </div>
          </div>
        </form>

        {/* Footer info (Clean list block, no borders) */}
        <div className="pt-4 flex items-center justify-center gap-1.5 opacity-60">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="text-[10px] text-slate-400">Matrix Encryption Enabled</span>
        </div>
      </div>
    </div>
  );
}
