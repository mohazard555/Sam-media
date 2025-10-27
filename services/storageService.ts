import { DEFAULT_SITE_SETTINGS } from '../constants';
import type { Message, Token, SiteSettings, User, Session } from '../types';

// تعريف المفاتيح المستخدمة في localStorage
const KEYS = {
  MESSAGES: 'ramzi-chat-messages',
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

// --- دوال الرسائل ---

// دالة للحصول على جميع الرسائل
export const getMessages = (): Message[] => {
  try {
    const messages = localStorage.getItem(KEYS.MESSAGES);
    return messages ? JSON.parse(messages) : [];
  } catch (error) {
    console.error("Failed to parse messages from localStorage", error);
    return [];
  }
};

// دالة لإضافة رسالة جديدة
export const addMessage = (text: string, user: User) => {
  const messages = getMessages();
  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    text,
    user,
    timestamp: Date.now(),
  };
  localStorage.setItem(KEYS.MESSAGES, JSON.stringify([...messages, newMessage]));
  window.dispatchEvent(new Event('storage'));
};

// دالة لمسح جميع الرسائل
export const clearMessages = () => {
  localStorage.removeItem(KEYS.MESSAGES);
  window.dispatchEvent(new Event('storage'));
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
