
import React, { useState, useEffect } from 'react';
import type { Token, Message } from '../types';
import { getTokens, addToken, deleteToken, getMessages } from '../services/storageService';

const AdminPanel: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  
  // دالة لجلب البيانات وتحديثها
  const refreshData = () => {
    setTokens(getTokens());
    const messages = getMessages();
    // محاكاة المستخدمين النشطين عبر استخراج أسماء المستخدمين الفريدة من الرسائل
    const uniqueUserNames = [...new Set(messages.map(msg => msg.user.name))];
    setActiveUsers(uniqueUserNames);
  };

  useEffect(() => {
    refreshData();
    // إضافة مستمع لحدث التخزين لتحديث الواجهة تلقائياً
    window.addEventListener('storage', refreshData);
    return () => {
      window.removeEventListener('storage', refreshData);
    };
  }, []);

  const handleCreateToken = () => {
    addToken();
    refreshData(); // تحديث فوري بعد الإنشاء
  };

  const handleDeleteToken = (tokenId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الرمز؟')) {
      deleteToken(tokenId);
      refreshData(); // تحديث فوري بعد الحذف
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('تم نسخ الرمز!');
    });
  };

  return (
    <div className="p-4 md:p-6 bg-slate-800 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-cyan-300">لوحة تحكم المدير</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* قسم إدارة الرموز */}
        <div className="bg-slate-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 border-b border-slate-600 pb-2">إدارة رموز الدخول</h3>
          <button 
            onClick={handleCreateToken}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg mb-4 transition duration-200"
          >
            إنشاء رمز جديد
          </button>
          <div className="max-h-60 overflow-y-auto pr-2">
            {tokens.length > 0 ? tokens.map(token => (
              <div key={token.id} className="flex items-center justify-between bg-slate-800 p-2 rounded-lg mb-2">
                <div className="flex flex-col">
                    <span className="font-mono text-sm text-yellow-300 truncate" title={token.id}>{token.id}</span>
                    <span className="text-xs text-slate-400">
                        {new Date(token.createdAt).toLocaleString('ar-EG')}
                    </span>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => copyToClipboard(token.id)} title="نسخ" className="text-slate-400 hover:text-white transition">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM5 11a1 1 0 100 2h4a1 1 0 100-2H5z" /></svg>
                   </button>
                   <button onClick={() => handleDeleteToken(token.id)} title="حذف" className="text-red-500 hover:text-red-400 transition">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                   </button>
                </div>
              </div>
            )) : <p className="text-slate-400 text-center">لا توجد رموز حالياً.</p>}
          </div>
        </div>

        {/* قسم المستخدمين النشطين */}
        <div className="bg-slate-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 border-b border-slate-600 pb-2">المستخدمون النشطون (محاكاة)</h3>
          <div className="max-h-60 overflow-y-auto pr-2">
            {activeUsers.length > 0 ? activeUsers.map(name => (
              <div key={name} className="flex items-center gap-3 bg-slate-800 p-2 rounded-lg mb-2">
                <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                <span>{name}</span>
              </div>
            )) : <p className="text-slate-400 text-center">لا يوجد مستخدمون نشطون حالياً.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;