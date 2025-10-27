
import React, { useState, useEffect, useRef } from 'react';
import type { Message, Session, SiteSettings } from '../types';
import { getMessages, addMessage, clearMessages } from '../services/storageService';
import MessageBubble from './MessageBubble';
import AdminPanel from './AdminPanel';

interface ChatScreenProps {
  session: Session;
  onLogout: () => void;
  settings: SiteSettings;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ session, onLogout, settings }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(session.isAdmin); // إظهار لوحة التحكم للمدير افتراضياً
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // دالة لتحديث الرسائل من localStorage
  const refreshMessages = () => {
    const currentMessages = getMessages();
    // تحديث الحالة فقط إذا كان هناك تغيير لتجنب إعادة العرض غير الضرورية
    setMessages(prevMessages => {
        if (JSON.stringify(prevMessages) !== JSON.stringify(currentMessages)) {
            return currentMessages;
        }
        return prevMessages;
    });
  };

  useEffect(() => {
    refreshMessages();
    
    // 1. استخدام 'storage' event للمزامنة الفورية في نفس المتصفح (بين التبويبات)
    window.addEventListener('storage', refreshMessages);
    
    // 2. استخدام التحقق الدوري (Polling) لمحاكاة المزامنة عبر المتصفحات المختلفة
    const intervalId = setInterval(refreshMessages, 1000); // التحقق كل ثانية

    // دالة التنظيف لإزالة المستمع والتحقق الدوري عند تفكيك المكون
    return () => {
      window.removeEventListener('storage', refreshMessages);
      clearInterval(intervalId);
    };
  }, []);
  
  // تأثير للتمرير إلى آخر رسالة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      addMessage(newMessage, session.user);
      setNewMessage('');
      refreshMessages(); // تحديث فوري للواجهة
    }
  };
  
  const handleClearChat = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في مسح جميع الرسائل للجميع؟')) {
      clearMessages();
      refreshMessages();
    }
  };

  return (
    <div className="h-full flex flex-col text-white">
      {/* منطقة الدردشة */}
      <main className="flex-grow p-4 space-y-4 overflow-y-auto">
        {session.isAdmin && (
            <div className="sticky top-0 z-5 bg-slate-900 py-2">
                 <button 
                    onClick={() => setShowAdminPanel(!showAdminPanel)}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg mb-4 transition duration-200"
                >
                    {showAdminPanel ? 'إخفاء لوحة التحكم' : 'إظهار لوحة التحكم'}
                </button>
            </div>
        )}
        {showAdminPanel && session.isAdmin && <AdminPanel />}
        
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} currentUser={session.user} />
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* منطقة إدخال الرسالة */}
      <footer className="p-4 bg-slate-800 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="flex-grow bg-slate-700 border-2 border-slate-600 rounded-full p-3 px-5 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-full transition duration-200 disabled:bg-cyan-800"
            disabled={!newMessage.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
        <div className="flex justify-between items-center mt-2 px-2">
           <button onClick={onLogout} className="text-sm text-slate-400 hover:text-red-400 transition">
             تسجيل الخروج
           </button>
           {session.isAdmin && (
             <button onClick={handleClearChat} className="text-sm text-slate-400 hover:text-yellow-400 transition">
               مسح الدردشة
             </button>
           )}
        </div>
      </footer>
    </div>
  );
};

export default ChatScreen;