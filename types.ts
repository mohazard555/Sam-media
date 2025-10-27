
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
