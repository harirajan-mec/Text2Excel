import React from 'react';
import { FileSpreadsheet, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 p-2 rounded-lg">
            <FileSpreadsheet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Text2Excel <span className="text-xs font-medium px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Powered</span>
            </h1>
          </div>
        </div>
        <a 
          href="#" 
          className="text-sm text-slate-500 hover:text-slate-800 transition-colors hidden sm:block"
        >
          Documentation
        </a>
      </div>
    </header>
  );
};