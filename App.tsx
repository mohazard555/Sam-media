
import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import ChatScreen from './components/ChatScreen';
import SettingsModal from './components/SettingsModal';
import BackgroundIcons from './components/BackgroundIcons';
import type { Session, SiteSettings } from './types';
import { getSession, saveSession, clearSession, getSettings } from './services/storageService';

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(getSettings());
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // تحديث الإعدادات عند حدوث تغيير
  const refreshSettings = () => {
    setSettings(getSettings());
  };

  useEffect(() => {
    // التحقق من وجود جلسة سابقة عند تحميل التطبيق
    const existingSession = getSession();
    if (existingSession) {
      setSession(existingSession);
    }
    // تحديث الإعدادات
    refreshSettings();

    // إضافة مستمع لحدث التخزين لتحديث الإعدادات
    window.addEventListener('storage', refreshSettings);
    return () => {
      window.removeEventListener('storage', refreshSettings);
    };
  }, []);

  const handleLogin = (newSession: Session) => {
    setSession(newSession);
    saveSession(newSession);
  };

  const handleLogout = () => {
    setSession(null);
    clearSession();
  };

  return (
    <div className="h-screen w-screen bg-slate-900 relative overflow-hidden">
      <BackgroundIcons />
      <div className="relative z-10 h-full w-full">
        {!session ? (
          <LoginScreen onLogin={handleLogin} settings={settings} />
        ) : (
          <ChatScreen 
            session={session} 
            onLogout={handleLogout} 
            settings={settings}
            onSettingsClick={() => setShowSettingsModal(true)} 
          />
        )}
        {session?.isAdmin && showSettingsModal && (
          <SettingsModal 
            initialSettings={settings} 
            onClose={() => setShowSettingsModal(false)} 
          />
        )}
      </div>
    </div>
  );
};

export default App;
