
import React, { useState, useEffect } from 'react';
import type { Conversation, Session, User } from '../types';
import { getAllUsers } from '../services/storageService';

interface ConversationListProps {
  conversations: Conversation[];
  session: Session;
  onSelectConversation: (conversationId: string) => void;
  onCreateConversation: (user: User) => void;
  activeConversationId: string | null;
}

const ConversationList: React.FC<ConversationListProps> = ({ conversations, session, onSelectConversation, onCreateConversation, activeConversationId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);

  useEffect(() => {
    // جلب جميع المستخدمين لوظيفة البحث
    setAllUsers(getAllUsers().filter(u => u.id !== session.user.id));
  }, [session.user.id]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }
    const results = allUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, allUsers]);

  const handleCreateNewChat = (user: User) => {
      onCreateConversation(user);
      setSearchTerm(''); // مسح البحث بعد إنشاء المحادثة
  };
  
  const getOtherParticipantName = (convo: Conversation): string => {
    const otherParticipantId = convo.participantIds.find(id => id !== session.user.id);
    return otherParticipantId ? convo.participantNames[otherParticipantId] || `مستخدم غير معروف` : session.user.name;
  };
  
  const getLastMessage = (convo: Conversation): string => {
    if (convo.messages.length === 0) return "لا توجد رسائل بعد";
    const lastMsg = convo.messages[convo.messages.length - 1];
    const sender = lastMsg.user.id === session.user.id ? "أنت" : lastMsg.user.name.split('-')[0];
    return `${sender}: ${lastMsg.text.substring(0, 20)}${lastMsg.text.length > 20 ? '...' : ''}`;
  }

  return (
    <div className="flex flex-col flex-grow min-h-0">
      <div className="p-4 border-b border-slate-700 shrink-0">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ابحث أو ابدأ محادثة جديدة..."
          className="w-full bg-slate-700 border-2 border-slate-600 rounded-full p-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition text-white"
        />
      </div>

      <div className="flex-grow overflow-y-auto">
        {/* نتائج البحث */}
        {searchTerm && (
          <div>
            <h3 className="p-3 text-sm font-bold text-slate-400">نتائج البحث</h3>
            {searchResults.length > 0 ? (
              searchResults.map(user => (
                <div
                  key={user.id}
                  onClick={() => handleCreateNewChat(user)}
                  className="flex items-center gap-3 p-3 mx-2 rounded-lg cursor-pointer hover:bg-slate-700 transition"
                >
                  <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center font-bold shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-sm text-slate-400">انقر لبدء المحادثة</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-4 text-slate-400 text-center">لم يتم العثور على مستخدمين.</p>
            )}
          </div>
        )}

        {/* قائمة المحادثات */}
        {!searchTerm && (
          <div>
            {conversations.length > 0 ? (
              conversations.map(convo => (
                <div
                  key={convo.id}
                  onClick={() => onSelectConversation(convo.id)}
                  className={`flex items-center gap-3 p-3 m-2 rounded-lg cursor-pointer transition border-r-4 ${activeConversationId === convo.id ? 'bg-slate-700 border-cyan-500' : 'border-transparent hover:bg-slate-700/50'}`}
                >
                  <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center font-bold text-white shrink-0">
                      {getOtherParticipantName(convo).charAt(0)}
                  </div>
                  <div className="flex-grow overflow-hidden">
                    <p className="font-semibold text-white truncate">{getOtherParticipantName(convo)}</p>
                    <p className="text-sm text-slate-400 truncate">{getLastMessage(convo)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-6 text-slate-400 text-center">لا توجد محادثات. ابحث عن مستخدم لبدء واحدة!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
