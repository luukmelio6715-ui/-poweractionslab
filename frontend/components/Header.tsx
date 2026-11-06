import React from 'react';
import { ShieldCheck, Plus, Database, FolderKanban } from 'lucide-react';

interface HeaderProps {
  currentView: 'projecten' | 'historie';
  onViewChange: (view: 'projecten' | 'historie') => void;
  onOpenNewRequest: () => void;
  totalPendingRequests: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenNewRequest,
  totalPendingRequests
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">ScopeCraft</span>
                <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-semibold border border-indigo-200">
                  Dashboard Scope Guard
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Van ad-hoc klantvraag naar historische ureninschatting & akkoord
              </p>
            </div>
          </div>

          {/* Nav Tabs & Action */}
          <div className="flex items-center space-x-3">
            <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => onViewChange('projecten')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  currentView === 'projecten'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FolderKanban className="w-4 h-4" />
                <span>Projecten & Meerwerk</span>
                {totalPendingRequests > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {totalPendingRequests}
                  </span>
                )}
              </button>

              <button
                onClick={() => onViewChange('historie')}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  currentView === 'historie'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Historische Data & Benchmarks</span>
              </button>
            </nav>

            <button
              onClick={onOpenNewRequest}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-sm transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4" />
              <span>Nieuwe Klantvraag</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
