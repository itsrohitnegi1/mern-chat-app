
import React from 'react';
import { GeminiIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="flex items-center p-4 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 shadow-md sticky top-0 z-10">
      <GeminiIcon className="w-8 h-8 mr-3 text-blue-400" />
      <h1 className="text-xl font-bold text-slate-200 tracking-wider">
        Gemini Real-Time Chat
      </h1>
    </header>
  );
};

export default Header;
