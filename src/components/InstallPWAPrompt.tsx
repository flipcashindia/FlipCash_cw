// src/components/InstallPWAPrompt.tsx
import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'pwa-install-dismissed';
const DISMISS_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export const InstallPWAPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      return; // App is already installed
    }

    // Check if user dismissed the prompt recently
    const dismissedTime = localStorage.getItem(DISMISSED_KEY);
    if (dismissedTime) {
      const timeSinceDismissed = Date.now() - parseInt(dismissedTime, 10);
      if (timeSinceDismissed < DISMISS_DURATION) {
        return; // Still within dismiss period
      }
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show prompt after 3 seconds
    const timer = setTimeout(() => {
      setShowPrompt(true);
      // Trigger slide-down animation
      setTimeout(() => setIsVisible(true), 100);
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // For iOS, show manual instructions
      if (isIOS) {
        alert(
          'To install this app on your iOS device:\n\n' +
          '1. Tap the Share button (square with arrow)\n' +
          '2. Scroll down and tap "Add to Home Screen"\n' +
          '3. Tap "Add" in the top right corner'
        );
      }
      return;
    }

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    handleDismiss();
  };

  const handleDismiss = () => {
    // Store the dismiss timestamp
    localStorage.setItem(DISMISSED_KEY, Date.now().toString());
    
    // Slide up animation
    setIsVisible(false);
    
    // Remove from DOM after animation
    setTimeout(() => {
      setShowPrompt(false);
    }, 300);
  };

  // Don't show if conditions aren't met
  if (!showPrompt && !isIOS) {
    return null;
  }

  if (!showPrompt) {
    return null;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="bg-gradient-to-r from-[#FEC925] to-[#e6b31f] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-[#1C1C1B] rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-[#FEC925]" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-[#1C1C1B] mb-1">
                Install FlipCash App
              </h3>
              <p className="text-sm text-[#1C1C1B] opacity-90">
                {isIOS 
                  ? 'Add to your home screen for a better experience'
                  : 'Install our app for quick access and offline features'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1B] hover:bg-opacity-90 text-white font-semibold rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Install</span>
              </button>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-[#1C1C1B] hover:bg-opacity-10 rounded-lg transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5 text-[#1C1C1B]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};