
import React, { useEffect, useRef } from 'react';
import type { Conversation, Session } from '../types';
import MessageBubble from './MessageBubble';

interface ChatViewProps {
  conversation: Conversation | null;
  session: Session;
  onSendMessage: (text: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ conversation, session, onSendMessage }) => {
  const [newMessage, setNewMessage] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // التمرير للأسفل عند وصول رسالة جديدة
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [conversation?.messages]);

  useEffect(() => {
    // مسح حقل الإدخال عند تغيير المحادثة
    setNewMessage('');
  }, [conversation?.id]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && conversation) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const getOtherParticipantName = (): string => {
    if (!conversation) return "";
    const otherParticipantId = conversation.participantIds.find(id => id !== session.user.id);
    return otherParticipantId ? conversation.participantNames[otherParticipantId] || `مستخدم غير معروف` : "ملاحظات شخصية";
  };

  if (!conversation) {
    return (
      <div className="flex-grow flex justify-center items-center text-slate-400 bg-slate-900">
        <div className="text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <h2 className="mt-2 text-xl font-semibold text-white">مرحباً بك في دردشة رمزي</h2>
            <p className="mt-1 text-slate-400">حدد محادثة من القائمة على اليمين، أو ابحث عن مستخدم لبدء محادثة جديدة.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col text-white bg-slate-900 min-h-0">
      {/* رأسية المحادثة */}
      <header className="p-3 bg-slate-800 border-b border-slate-700 flex items-center gap-3 shrink-0">
         <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center font-bold text-white shrink-0">
            {getOtherParticipantName().charAt(0)}
        </div>
        <h2 className="font-bold text-lg">{getOtherParticipantName()}</h2>
      </header>
      
      {/* منطقة الرسائل */}
      <main className="flex-grow p-4 space-y-4 overflow-y-auto">
        {conversation.messages.length > 0 ? (
          conversation.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} currentUser={session.user} />
          ))
        ) : (
          <div className="text-center text-slate-500 mt-8">
            <p>لا توجد رسائل في هذه المحادثة بعد.</p>
            <p>ابدأ الحوار!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* إدخال الرسالة */}
      <footer className="p-4 bg-slate-800 shrink-0">
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
            className="bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-full transition duration-200 disabled:bg-cyan-800 disabled:cursor-not-allowed"
            disabled={!newMessage.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatView;
