"use client";

import React, { useState } from 'react';
import { LoginForm, RegisterForm } from "@/components/auth";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Tab Switcher */}
        <div className="flex mb-6 bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              mode === "login"
                ? 'bg-green-600 text-white shadow-md' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              mode === "register"
                ? 'bg-green-600 text-white shadow-md' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Auth Forms */}
        {mode === "login" ? (
          <LoginForm onSwitchToSignUp={() => setMode("register")} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}