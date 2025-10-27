
import { DEFAULT_SITE_SETTINGS } from '../constants';
import type { Message, Token, SiteSettings, User, Session, Conversation } from '../types';

// تعريف المفاتيح المستخدمة في localStorage
const KEYS = {
  CONVERSATIONS: 'ramzi-chat-conversations',
  TOKENS: 'ramzi-chat-tokens',
  SETTINGS: 'ramzi-chat-settings',
  SESSION: 'ramzi-chat-session',
};

// --- دوال الإعدادات ---

// دالة للحصول على إعدادات الموقع
export const getSettings = (): SiteSettings => {
  try {
    const settings = localStorage.getItem(KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : DEFAULT_SITE_SETTINGS;
  } catch (error) {
    console.error("Failed to parse settings from localStorage", error);
    return DEFAULT_SITE_SETTINGS;
  }
};

// دالة لحفظ إعدادات الموقع
export const saveSettings = (settings: SiteSettings) => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  // إرسال حدث مخصص لإعلام المكونات الأخرى بالتغيير
  window.dispatchEvent(new Event('storage'));
};

// --- دوال الرموز ---

// دالة للحصول على جميع الرموز
export const getTokens = (): Token[] => {
  try {
    const tokens = localStorage.getItem(KEYS.TOKENS);
    return tokens ? JSON.parse(tokens) : [];
  } catch (error) {
    console.error("Failed to parse tokens from localStorage", error);
    return [];
  }
};

// دالة لإضافة رمز جديد
export const addToken = (): Token => {
  const tokens = getTokens();
  const newToken: Token = {
    id: `token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: Date.now(),
  };
  localStorage.setItem(KEYS.TOKENS, JSON.stringify([...tokens, newToken]));
  window.dispatchEvent(new Event('storage'));
  return newToken;
};

// دالة لحذف رمز
export const deleteToken = (tokenId: string) => {
  const tokens = getTokens();
  const updatedTokens = tokens.filter((token) => token.id !== tokenId);
  localStorage.setItem(KEYS.TOKENS, JSON.stringify(updatedTokens));
  window.dispatchEvent(new Event('storage'));
};

// دالة للتحقق من صحة الرمز
export const validateToken = (tokenId: string): boolean => {
  const tokens = getTokens();
  return tokens.some((token) => token.id === tokenId);
};

// --- دالة للحصول على كل المستخدمين ---
export const getAllUsers = (): User[] => {
    const tokens = getTokens();
    const users = tokens.map(token => ({
        id: token.id,
        name: `مستخدم-${token.id.substring(token.id.length - 4)}`
    }));
    return users;
};


// --- دوال المحادثات ---

// دالة للحصول على جميع المحادثات
const getAllConversations = (): Record<string, Conversation> => {
    try {
        const conversations = localStorage.getItem(KEYS.CONVERSATIONS);
        return conversations ? JSON.parse(conversations) : {};
    } catch (error) {
        console.error("Failed to parse conversations from localStorage", error);
        return {};
    }
};

// دالة لحفظ جميع المحادثات
const saveAllConversations = (conversations: Record<string, Conversation>) => {
    localStorage.setItem(KEYS.CONVERSATIONS, JSON.stringify(conversations));
    window.dispatchEvent(new Event('storage'));
};

// دالة للحصول على محادثات مستخدم معين
export const getUserConversations = (userId: string): Conversation[] => {
    const allConversations = getAllConversations();
    return Object.values(allConversations)
        .filter(convo => convo.participantIds.includes(userId))
        .sort((a, b) => b.lastUpdated - a.lastUpdated);
};

// دالة لإنشاء محادثة جديدة أو الحصول على محادثة حالية
export const createOrGetConversation = (currentUser: User, otherUser: User): Conversation => {
    const allConversations = getAllConversations();
    // إنشاء معرف ثابت للمحادثة بين شخصين
    const conversationId = [currentUser.id, otherUser.id].sort().join('--');

    if (allConversations[conversationId]) {
        return allConversations[conversationId];
    }

    const newConversation: Conversation = {
        id: conversationId,
        participantIds: [currentUser.id, otherUser.id],
        participantNames: {
            [currentUser.id]: currentUser.name,
            [otherUser.id]: otherUser.name,
        },
        messages: [],
        lastUpdated: Date.now(),
    };

    allConversations[conversationId] = newConversation;
    saveAllConversations(allConversations);
    return newConversation;
};

// دالة لإضافة رسالة جديدة لمحادثة
export const addMessageToConversation = (conversationId: string, text: string, user: User) => {
    const allConversations = getAllConversations();
    const conversation = allConversations[conversationId];

    if (!conversation) {
        console.error("Conversation not found!");
        return;
    }

    const newMessage: Message = {
        id: `msg-${Date.now()}`,
        text,
        user,
        timestamp: Date.now(),
    };

    conversation.messages.push(newMessage);
    conversation.lastUpdated = Date.now();
    
    if(!conversation.participantNames[user.id]){
      conversation.participantNames[user.id] = user.name;
    }

    saveAllConversations(allConversations);
};

// دالة لمسح رسائل محادثة
export const clearConversationMessages = (conversationId: string) => {
    const allConversations = getAllConversations();
    const conversation = allConversations[conversationId];
     if (conversation) {
        conversation.messages = [];
        conversation.lastUpdated = Date.now();
        saveAllConversations(allConversations);
    }
};


// --- دوال الجلسة ---

// دالة لحفظ جلسة المستخدم
export const saveSession = (session: Session) => {
  localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
};

// دالة للحصول على جلسة المستخدم الحالية
export const getSession = (): Session | null => {
  try {
    const session = localStorage.getItem(KEYS.SESSION);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error("Failed to parse session from localStorage", error);
    return null;
  }
};

// دالة لتسجيل الخروج
export const clearSession = () => {
  localStorage.removeItem(KEYS.SESSION);
};
