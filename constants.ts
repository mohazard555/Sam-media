import type { SiteSettings } from './types';

// في تطبيق حقيقي، يجب أن تكون هذه متغيرات بيئة
export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'password123';

// الإعدادات الافتراضية للموقع
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  name: "رمزي",
  logo: "🔑",
  description: "تواصل آمن عبر الرموز الخاصة",
};
