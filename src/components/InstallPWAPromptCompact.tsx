// src/components/InstallPWAPromptCompact.tsx
import React, { useState, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react'; // Added Share for iOS

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'pwa-install-dismissed';
const DISMISS_DURATION = 5 * 60 * 1000; // Corrected comment to match 5 mins

export const InstallPWAPromptCompact: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Check iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // 2. Check if installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    // 3. Check dismissal
    const dismissedTime = localStorage.getItem(DISMISSED_KEY);
    if (dismissedTime) {
      const timeSinceDismissed = Date.now() - parseInt(dismissedTime, 10);
      if (timeSinceDismissed < DISMISS_DURATION) return;
    }

    // 4. Handle Android/Chrome Event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Only show prompt IF we captured the event
      triggerAnimation(); 
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. Handle iOS (Show without event)
    if (iOS) {
      triggerAnimation();
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const triggerAnimation = () => {
    setTimeout(() => {
      setShowPrompt(true);
      setTimeout(() => setIsVisible(true), 100);
    }, 3000);
  };

  const handleInstall = async () => {
    // Handle iOS Instructions
    if (isIOS) {
      alert('Tap the Share button below, then "Add to Home Screen"');
      return;
    }

    // Handle Android/Desktop
    if (!deferredPrompt) return;
    
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, Date.now().toString());
    setIsVisible(false);
    setTimeout(() => setShowPrompt(false), 300);
  };

  // CRITICAL: Don't render if we have no way to install (unless it's iOS)
  if (!showPrompt) return null;
  if (!isIOS && !deferredPrompt) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="bg-[#FEC925] shadow-lg pt-safe-top"> {/* Added pt-safe-top */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#1C1C1B] flex-1">
               📱 Install FlipCash App
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstall}
                className="px-3 py-1.5 bg-[#1C1C1B] text-white text-sm font-semibold rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-1.5"
              >
                {/* Swap icon for iOS context */}
                {isIOS ? <Share className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                {isIOS ? 'Add' : 'Install'}
              </button>
              <button
                onClick={handleDismiss}
                className="p-1.5 hover:bg-[#1C1C1B] hover:bg-opacity-10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-[#1C1C1B]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};