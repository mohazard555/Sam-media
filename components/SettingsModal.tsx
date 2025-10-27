
import React, { useState } from 'react';
import type { SiteSettings } from '../types';
import { saveSettings } from '../services/storageService';

interface SettingsModalProps {
  initialSettings: SiteSettings;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ initialSettings, onClose }) => {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    saveSettings(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-slate-800 text-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">تعديل إعدادات الموقع</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">اسم الموقع</label>
            <input
              type="text"
              id="name"
              name="name"
              value={settings.name}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-slate-300 mb-1">شعار الموقع (رابط أو رمز)</label>
            <input
              type="text"
              id="logo"
              name="logo"
              value={settings.logo}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">وصف الموقع</label>
            <textarea
              id="description"
              name="description"
              value={settings.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;