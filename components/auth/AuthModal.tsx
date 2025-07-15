"use client";

import React, { useState } from "react";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
  redirectTo?: string;
}

export function AuthModal({ 
  isOpen, 
  onClose, 
  defaultMode = "login",
  redirectTo = "/dashboard" 
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(defaultMode);

  if (!isOpen) return null;

  const handleSuccess = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {mode === "login" ? (
          <LoginForm
            onSwitchToSignUp={() => setMode("register")}
            redirectTo={redirectTo}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={() => setMode("login")}
            redirectTo={redirectTo}
          />
        )}
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}