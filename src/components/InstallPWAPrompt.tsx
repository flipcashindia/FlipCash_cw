// src/components/InstallPWAPrompt.tsx
import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Share, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'pwa-install-dismissed';
const DISMISS_DURATION = 15 * 60 * 1000; // 15 minutes

export const InstallPWAPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Check device type
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // 2. Check if already in standalone mode (installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    // 3. Check dismissal history
    const dismissedTime = localStorage.getItem(DISMISSED_KEY);
    if (dismissedTime) {
      const timeSinceDismissed = Date.now() - parseInt(dismissedTime, 10);
      if (timeSinceDismissed < DISMISS_DURATION) return;
    }

    // 4. Event Listener for Android/Desktop
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      triggerPrompt();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. For iOS, we trigger manually since it doesn't fire the event
    if (iOS) {
      triggerPrompt();
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const triggerPrompt = () => {
    setTimeout(() => {
      setShowPrompt(true);
      setTimeout(() => setIsVisible(true), 50);
    }, 3000);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, Date.now().toString());
    setIsVisible(false);
    setTimeout(() => setShowPrompt(false), 300);
  };

  if (!showPrompt) return null;
  if (!isIOS && !deferredPrompt) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center px-4 transition-opacity duration-300 ease-in-out ${
        isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      {/* Backdrop - Blurred and Darkened (Clicking here does nothing now) */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Card */}
      <div 
        className={`relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
        }`}
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#FEC925] to-[#e6b31f] p-6 flex flex-col items-center pt-8 pb-6 relative">
          
          {/* Close Button (X Icon) */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors text-[#1C1C1B]"
            aria-label="Close install prompt"
          >
            <X className="w-5 h-5" />
          </button>

          {/* App Icon */}
          <div className="w-20 h-20 bg-[#1C1C1B] rounded-2xl shadow-lg flex items-center justify-center mb-4 transform rotate-3">
            <Smartphone className="w-10 h-10 text-[#FEC925]" />
          </div>

          <h3 className="text-xl font-bold text-[#1C1C1B] text-center">
            Install FlipCash
          </h3>
        </div>

        {/* Content Body */}
        <div className="p-6 bg-white space-y-5">
          <div className="text-center space-y-2">
            <h4 className="font-semibold text-gray-900">
              {isIOS ? 'Install on iPhone' : 'Get the App'}
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              {isIOS 
                ? 'Install our app to your home screen for the best full-screen experience.' 
                : 'Add FlipCash to your home screen for quick access, offline features, and a better experience.'}
            </p>
          </div>

          {/* iOS Specific Instructions */}
          {isIOS && (
            <div className="bg-gray-50 p-4 rounded-xl space-y-3 text-sm text-gray-700 border border-gray-100">
              <div className="flex items-center gap-3">
                <Share className="w-5 h-5 text-blue-500" />
                <span>1. Tap the <strong>Share</strong> button below</span>
              </div>
              <div className="flex items-center gap-3">
                <PlusSquare className="w-5 h-5 text-gray-600" />
                <span>2. Select <strong>Add to Home Screen</strong></span>
              </div>
            </div>
          )}

          {/* Action Button (Android/Desktop Only) */}
          {!isIOS && (
            <button
              onClick={handleInstallClick}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1C1C1B] hover:bg-gray-800 text-white font-bold rounded-xl shadow-lg shadow-gray-200 transition-all active:scale-95"
            >
              <Download className="w-5 h-5" />
              Install App
            </button>
          )}

          {/* Dismiss Link (Bottom text) */}
          <button 
            onClick={handleDismiss}
            className="w-full text-center text-sm text-gray-400 font-medium hover:text-gray-600 transition-colors"
          >
            Not now, maybe later
          </button>
        </div>
      </div>
    </div>
  );
};