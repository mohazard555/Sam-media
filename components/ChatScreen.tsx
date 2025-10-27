
import React, { useState, useEffect, useCallback } from 'react';
import type { Conversation, Session, SiteSettings, User } from '../types';
import { 
    getUserConversations, 
    addMessageToConversation, 
    createOrGetConversation 
} from '../services/storageService';
import AdminPanel from './AdminPanel';
import ConversationList from './ConversationList';
import ChatView from './ChatView';

interface ChatScreenProps {
  session: Session;
  onLogout: () => void;
  settings: SiteSettings;
  onSettingsClick: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ session, onLogout, settings, onSettingsClick }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [view, setView] = useState<'chat' | 'admin'>('chat');

  const refreshConversations = useCallback(() => {
    const userConvos = getUserConversations(session.user.id);
    setConversations(userConvos);
  }, [session.user.id]);

  useEffect(() => {
    refreshConversations();
    const handleStorageChange = () => refreshConversations();
    window.addEventListener('storage', handleStorageChange);
    const intervalId = setInterval(handleStorageChange, 1000); 

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [refreshConversations]);
  
  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setView('chat'); 
  };
  
  const handleCreateConversation = (otherUser: User) => {
    const conversation = createOrGetConversation(session.user, otherUser);
    setActiveConversationId(conversation.id);
    setView('chat');
    refreshConversations(); 
  };

  const handleSendMessage = (text: string) => {
    if (activeConversationId) {
      addMessageToConversation(activeConversationId, text, session.user);
      refreshConversations(); 
    }
  };
  
  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  return (
    <div className="h-full flex flex-row-reverse text-white"> {/* row-reverse for RTL */}
        <aside className="w-full md:w-1/3 lg:w-1/4 h-full bg-slate-800 flex flex-col border-l border-slate-700">
             <div className="p-4 border-b border-slate-700 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{settings.logo}</span>
                  <h1 className="text-xl font-bold">{settings.name}</h1>
                </div>
                {session.isAdmin && (
                  <button onClick={onSettingsClick} className="text-slate-300 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </button>
                )}
             </div>
             <div className="p-4 border-b border-slate-700 flex items-center justify-between shrink-0">
                <div className="font-bold">{session.user.name}</div>
                <button onClick={onLogout} className="text-sm text-slate-400 hover:text-red-400 transition">
                    تسجيل الخروج
                </button>
             </div>
             {session.isAdmin && (
                <div className="p-4 border-b border-slate-700 shrink-0">
                    <button 
                        onClick={() => setView(view === 'admin' ? 'chat' : 'admin')}
                        className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                    >
                        {view === 'admin' ? 'العودة للدردشة' : 'لوحة التحكم'}
                    </button>
                </div>
             )}
             
             <ConversationList 
                conversations={conversations}
                session={session}
                onSelectConversation={handleSelectConversation}
                onCreateConversation={handleCreateConversation}
                activeConversationId={activeConversationId}
             />
        </aside>
        
        <main className="flex-grow h-full flex flex-col bg-slate-900">
            {view === 'admin' && session.isAdmin ? (
                <div className="p-4 overflow-y-auto h-full">
                    <AdminPanel />
                </div>
            ) : (
                <ChatView
                    conversation={activeConversation}
                    session={session}
                    onSendMessage={handleSendMessage}
                />
            )}
        </main>
    </div>
  );
};

export default ChatScreen;
