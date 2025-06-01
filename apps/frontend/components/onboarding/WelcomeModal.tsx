'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ChevronRight, CheckCircle2 } from 'lucide-react';

// Mock TourTrigger component for now
const TourTrigger = ({ tourId, children }: { tourId: string; children: React.ReactNode }) => (
  <button className="text-primary hover:text-primary-600 transition-colors">
    {children}
  </button>
);

interface WelcomeModalProps {
  userName?: string;
  isOpen: boolean;
  onClose: () => void;
  isFirstTimeUser?: boolean;
}

export function WelcomeModal({ userName = 'there', isOpen, onClose, isFirstTimeUser = false }: WelcomeModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Save onboarding completion to localStorage
    localStorage.setItem('onboardingCompleted', 'true');
    if (dontShowAgain) {
      localStorage.setItem('bitebase-welcome-modal-dont-show-again', 'true');
    }
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1000] bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="relative">
          <div className="bg-primary h-32 w-full"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 p-1 rounded-full transition-colors"
            aria-label="Close welcome modal"
          >
            <X size={20} />
          </button>
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 border-4 border-white">
            <div className="bg-primary text-white h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold">
              B
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-16 px-8 pb-8">
          {currentStep === 0 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Welcome to BiteBase Intelligence, {userName}!</h2>
              <p className="text-gray-600 mb-6">
                Your restaurant market intelligence platform is ready to help you make data-driven decisions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-primary transition-colors">
                  <div className="bg-primary-100 text-primary h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">Market Analysis</h3>
                  <p className="text-sm text-gray-500">Understand your local market and competition</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-primary transition-colors">
                  <div className="bg-primary-100 text-primary h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">Data-Driven Insights</h3>
                  <p className="text-sm text-gray-500">Make decisions based on real market data</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 text-center hover:border-primary transition-colors">
                  <div className="bg-primary-100 text-primary h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-medium mb-1">AI Recommendations</h3>
                  <p className="text-sm text-gray-500">Get intelligent suggestions for your business</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-2 text-center">The 4P Framework</h2>
              <p className="text-gray-600 mb-6 text-center">
                BiteBase is organized around the 4P marketing framework to help you optimize every aspect of your restaurant.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex items-start">
                    <div className="bg-primary-100 text-primary h-10 w-10 rounded-full flex items-center justify-center mr-3">
                      <span className="font-bold">P</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Product (Menu)</h3>
                      <p className="text-sm text-gray-500">Optimize your menu items and food offerings</p>
                      <ul className="text-xs text-gray-500 mt-2 space-y-1">
                        <li className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1 text-primary" />
                          Menu item management
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1 text-primary" />
                          Category organization
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex items-start">
                    <div className="bg-primary-100 text-primary h-10 w-10 rounded-full flex items-center justify-center mr-3">
                      <span className="font-bold">P</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Price (Strategy)</h3>
                      <p className="text-sm text-gray-500">Optimize your pricing for maximum profitability</p>
                      <ul className="text-xs text-gray-500 mt-2 space-y-1">
                        <li className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1 text-primary" />
                          Price optimization
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1 text-primary" />
                          Competitor analysis
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex items-start">
                    <div className="bg-primary-100 text-primary h-10 w-10 rounded-full flex items-center justify-center mr-3">
                      <span className="font-bold">P</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Place (Location)</h3>
                      <p className="text-sm text-gray-500">Analyze and optimize your restaurant location</p>
                      <ul className="text-xs text-gray-500 mt-2 space-y-1">
                        <li className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1 text-primary" />
                          Location analysis
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1 text-primary" />
                          Foot traffic insights
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex items-start">
                    <div className="bg-primary-100 text-primary h-10 w-10 rounded-full flex items-center justify-center mr-3">
                      <span className="font-bold">P</span>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Promotion</h3>
                      <p className="text-sm text-gray-500">Market your restaurant effectively</p>
                      <ul className="text-xs text-gray-500 mt-2 space-y-1">
                        <li className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1 text-primary" />
                          Marketing campaigns
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="h-3 w-3 mr-1 text-primary" />
                          Customer engagement
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
              <p className="text-gray-600 mb-6">
                Choose how you'd like to begin using BiteBase Intelligence.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Link
                  href="/restaurant-setup"
                  className="border border-gray-200 rounded-lg p-6 hover:border-primary hover:bg-primary/5 transition-all text-center"
                >
                  <div className="bg-primary/10 text-primary h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-lg mb-2">Complete Setup</h3>
                  <p className="text-sm text-gray-500">
                    Go through our guided setup process to configure your restaurant profile.
                  </p>
                </Link>

                <Link
                  href="/dashboard"
                  className="border border-gray-200 rounded-lg p-6 hover:border-primary hover:bg-primary/5 transition-all text-center"
                >
                  <div className="bg-primary/10 text-primary h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-lg mb-2">Explore Dashboard</h3>
                  <p className="text-sm text-gray-500">
                    Skip setup for now and start exploring the dashboard.
                  </p>
                </Link>
              </div>

              <div className="mt-4">
                <TourTrigger tourId="dashboard">
                  <span className="text-sm">Or take a guided tour of the dashboard</span>
                </TourTrigger>
              </div>
            </div>
          )}

          {/* Don't show again checkbox - only for first-time users */}
          {isFirstTimeUser && (
            <div className="flex items-center justify-center space-x-2 py-3 border-t border-gray-100 mt-4">
              <input
                type="checkbox"
                id="welcome-dont-show-again"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
              />
              <label
                htmlFor="welcome-dont-show-again"
                className="text-sm text-gray-600 cursor-pointer select-none"
              >
                Don't show this welcome message again
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            {currentStep < 2 ? (
              <>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Skip for now
                </button>
                <button
                  onClick={handleNext}
                  className="btn-primary px-4 py-2 rounded-md flex items-center"
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                onClick={handleComplete}
                className="btn-primary px-6 py-2 rounded-md mx-auto"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
