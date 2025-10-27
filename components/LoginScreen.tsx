
import React, { useState } from 'react';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../constants';
import { validateToken } from '../services/storageService';
import type { Session, SiteSettings, User } from '../types';

interface LoginScreenProps {
  onLogin: (session: Session) => void;
  settings: SiteSettings;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, settings }) => {
  const [loginMode, setLoginMode] = useState<'user' | 'admin'>('user');
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // محاكاة تأخير بسيط للتحقق
    setTimeout(() => {
      if (loginMode === 'admin') {
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          const adminSession: Session = {
            user: { id: 'admin', name: 'المدير' },
            isAdmin: true,
          };
          onLogin(adminSession);
        } else {
          setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
          setLoading(false);
        }
      } else { // 'user' mode
        if (!token) {
          setError('الرجاء إدخال رمز الدخول.');
          setLoading(false);
          return;
        }
        const isValid = validateToken(token);
        if (isValid) {
          const user: User = {
            id: token,
            // اسم مستخدم بسيط ومميز
            name: `مستخدم-${token.substring(token.length - 4)}`
          };
          const userSession: Session = { user, isAdmin: false };
          onLogin(userSession);
        } else {
          setError('رمز الدخول غير صالح أو منتهي الصلاحية.');
          setLoading(false);
        }
      }
    }, 500);
  };

  const renderUserForm = () => (
    <input
      type="password"
      value={token}
      onChange={(e) => setToken(e.target.value)}
      placeholder="أدخل رمز الدخول الخاص بك"
      className="w-full bg-slate-700 text-white border-2 border-slate-600 rounded-lg p-3 mb-4 text-center focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
      dir="ltr"
    />
  );

  const renderAdminForm = () => (
    <div className="space-y-4 mb-4">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="اسم المستخدم"
        autoComplete="username"
        className="w-full bg-slate-700 text-white border-2 border-slate-600 rounded-lg p-3 text-center focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="كلمة المرور"
        autoComplete="current-password"
        className="w-full bg-slate-700 text-white border-2 border-slate-600 rounded-lg p-3 text-center focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
        dir="ltr"
      />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="text-6xl mb-4">{settings.logo}</div>
        <h1 className="text-4xl font-bold text-white mb-2">{settings.name}</h1>
        <p className="text-slate-400 mb-8">{settings.description}</p>
        
        <div className="bg-slate-800 shadow-2xl rounded-lg p-8">
          <div className="flex justify-center border-b border-slate-700 mb-6">
            <button
              onClick={() => { setLoginMode('user'); setError(''); }}
              className={`flex-1 py-2 font-semibold transition rounded-t-lg ${loginMode === 'user' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}
            >
              دخول مستخدم
            </button>
            <button
              onClick={() => { setLoginMode('admin'); setError(''); }}
              className={`flex-1 py-2 font-semibold transition rounded-t-lg ${loginMode === 'admin' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}
            >
              دخول مدير
            </button>
          </div>

          <form onSubmit={handleLogin} noValidate>
            {loginMode === 'user' ? renderUserForm() : renderAdminForm()}
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-cyan-800 disabled:cursor-not-allowed"
            >
              {loading ? '...جاري التحقق' : 'دخول'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;