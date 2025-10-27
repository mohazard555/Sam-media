
import React from 'react';
import type { Message, User } from '../types';

interface MessageBubbleProps {
  message: Message;
  currentUser: User;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, currentUser }) => {
  const isCurrentUser = message.user.id === currentUser.id;
  const time = new Date(message.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`flex flex-col max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-3 ${
          isCurrentUser
            ? 'bg-cyan-600 text-white rounded-br-none'
            : 'bg-slate-600 text-white rounded-bl-none'
        }`}
      >
        {!isCurrentUser && (
            <p className="text-sm font-bold text-cyan-300 mb-1">{message.user.name}</p>
        )}
        <p className="text-md break-words">{message.text}</p>
        <p className={`text-xs mt-2 opacity-70 ${isCurrentUser ? 'text-right' : 'text-left'}`}>{time}</p>
      </div>
    </div>
  );
};

export default MessageBubble;