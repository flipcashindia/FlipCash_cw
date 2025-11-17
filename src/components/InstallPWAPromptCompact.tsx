// src/components/InstallPWAPromptCompact.tsx
import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'pwa-install-dismissed';
const DISMISS_DURATION = 5 * 60 * 1000; // 15 minutes

export const InstallPWAPromptCompact: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) return;

    const dismissedTime = localStorage.getItem(DISMISSED_KEY);
    if (dismissedTime) {
      const timeSinceDismissed = Date.now() - parseInt(dismissedTime, 10);
      if (timeSinceDismissed < DISMISS_DURATION) return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const timer = setTimeout(() => {
      setShowPrompt(true);
      setTimeout(() => setIsVisible(true), 100);
    }, 3000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    // const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    handleDismiss();
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, Date.now().toString());
    setIsVisible(false);
    setTimeout(() => setShowPrompt(false), 300);
  };

  if (!showPrompt) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="bg-[#FEC925] shadow-lg">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#1C1C1B] flex-1">
              📱 Install FlipCash for quick access
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstall}
                className="px-3 py-1.5 bg-[#1C1C1B] text-white text-sm font-semibold rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Install
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