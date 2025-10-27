
import React from 'react';
import type { SiteSettings } from '../types';

interface HeaderProps {
  settings: SiteSettings;
  isAdmin: boolean;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ settings, isAdmin, onSettingsClick }) => {
  return (
    <header className="bg-slate-800 text-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{settings.logo}</span>
        <h1 className="text-xl font-bold">{settings.name}</h1>
      </div>
      {isAdmin && (
        <button
          onClick={onSettingsClick}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0L7.86 5.89C7.43 6.07 7.01 6.31 6.63 6.63L4.11 5.37c-1.39-.71-2.95.24-2.95 1.77l.71 2.52c.18.43.31.85.31 1.29s-.13.86-.31 1.29l-.71 2.52c0 1.53 1.56 2.48 2.95 1.77l2.52-.71c.42-.18.84-.31 1.29-.31s.86.13 1.29.31l2.52.71c1.39.71 2.95-.24 2.95-1.77l-.71-2.52c-.18-.43-.31-.85-.31-1.29s.13-.86.31-1.29l.71-2.52c0-1.53-1.56-2.48-2.95-1.77l-2.52.71c-.42.18-.84.31-1.29.31s-.86-.13-1.29-.31L8.51 3.17zm-1.49 8.33a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd" />
          </svg>
          <span>الإعدادات</span>
        </button>
      )}
    </header>
  );
};

export default Header;