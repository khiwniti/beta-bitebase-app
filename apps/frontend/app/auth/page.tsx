"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import BiteBaseLogo from '../../components/BiteBaseLogo';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@bitebase/ui";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        router.push('/dashboard');
      } else {
        await signUp(email, password, { displayName: name });
        router.push('/restaurant-settings');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithGoogle();
      if (result.isNewUser) {
        router.push('/restaurant-settings');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google sign-in');
      setLoading(false);
    }
  };

  const handleSkipAuth = () => {
    // Skip authentication and go directly to dashboard
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-teal-400/5 to-green-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '15s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-blue-400/5 to-teal-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '20s' }}></div>
      </div>

      {/* Left side - Immersive Brand Experience */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 text-white relative overflow-hidden">
        {/* 3D Map Background for Geospatial Theme */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-700 to-teal-800 opacity-90"></div>
        
        {/* Map Grid Overlay */}
        <div className="absolute inset-0 opacity-10" 
             style={{
               backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.1) 75%, rgba(255, 255, 255, 0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.1) 25%, rgba(255, 255, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.1) 75%, rgba(255, 255, 255, 0.1) 76%, transparent 77%, transparent)',
               backgroundSize: '50px 50px'
             }}>
        </div>

        {/* Animated Location Markers */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}></div>
        <div className="absolute top-2/3 right-1/3 w-3 h-3 bg-white rounded-full animate-ping" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}></div>

        {/* Content */}
        <div className="max-w-md relative z-10 transform transition-all duration-1000 ease-out">
          {/* Logo with Glow Effect */}
          <div className="mb-10 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-lg animate-pulse"></div>
              <BiteBaseLogo size="lg" variant="white" animated={true} />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight text-center">
            {isLogin ? 'Welcome Back to BiteBase' : 'Join BiteBase Intelligence'}
          </h1>

          {/* Description with Geospatial Focus */}
          <p className="text-xl mb-10 leading-relaxed text-center opacity-90">
            {isLogin
              ? 'Access powerful geospatial analytics for your restaurant business.'
              : 'Discover the perfect location for your next restaurant with AI-powered geospatial insights.'}
          </p>

          {/* Key Features with Modern Icons */}
          <div className="space-y-6">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-white/20">
              <div className="rounded-full bg-white/20 p-3 mr-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">Location Intelligence</h3>
                <p className="text-white/80">AI-powered geospatial analysis</p>
              </div>
            </div>

            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-white/20">
              <div className="rounded-full bg-white/20 p-3 mr-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">Market Analysis</h3>
                <p className="text-white/80">Comprehensive competitive insights</p>
              </div>
            </div>

            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-white/20">
              <div className="rounded-full bg-white/20 p-3 mr-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">Demographic Insights</h3>
                <p className="text-white/80">Target your ideal customer base</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sleek Auth Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-10">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <BiteBaseLogo size="lg" variant="gradient" animated={true} />
          </div>

          {/* Tab Switcher */}
          <div className="flex mb-8 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                isLogin 
                  ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
                !isLogin 
                  ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isLogin ? 'Welcome back' : 'Get started now'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isLogin 
                ? 'Sign in to access your BiteBase dashboard' 
                : 'Create your account to start analyzing locations'}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-300 p-4 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required={!isLogin}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                {isLogin && (
                  <Link
                    href="/reset-password"
                    className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                placeholder={isLogin ? "••••••••" : "Create a secure password"}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full justify-center py-3 px-5 text-base font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : (
                  isLogin ? 'Sign in to dashboard' : 'Create account'
                )}
              </Button>
            </div>
          </form>

          {/* Social Sign-in */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign {isLogin ? 'in' : 'up'} with Google
              </button>
            </div>
          </div>

          {/* Quick Access Section */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Quick Access
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSkipAuth}
                className="w-full flex items-center justify-center px-4 py-3 border-2 border-blue-200 dark:border-blue-800 rounded-lg text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Skip to Dashboard
              </button>
              
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                Access the platform without authentication
              </p>
            </div>
          </div>

          {/* Terms and Privacy */}
          <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
            By continuing, you agree to BiteBase's{' '}
            <Link href="/terms" className="text-emerald-600 dark:text-emerald-400 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-emerald-600 dark:text-emerald-400 hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
