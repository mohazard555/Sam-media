
// واجهة لرسالة الدردشة
export interface Message {
  id: string;
  text: string;
  timestamp: number;
  user: User;
}

// واجهة للمستخدم
export interface User {
  id: string; // معرف فريد للمستخدم (يمكن أن يكون هو الرمز نفسه)
  name: string; // اسم المستخدم، يمكن جعله "مستخدم" + جزء من المعرف
}

// واجهة لرمز الدخول
export interface Token {
  id: string;
  createdAt: number;
}

// واجهة لبيانات المحادثة
export interface Conversation {
  id: string; // معرف فريد للمحادثة
  participantIds: string[]; // معرفات المستخدمين المشاركين
  participantNames: Record<string, string>; // { "userId1": "name1", "userId2": "name2" }
  messages: Message[];
  lastUpdated: number;
}

// واجهة لإعدادات الموقع
export interface SiteSettings {
  name: string;
  logo: string;
  description: string;
}

// واجهة لبيانات الجلسة الحالية للمستخدم
export interface Session {
  user: User;
  isAdmin: boolean;
}
