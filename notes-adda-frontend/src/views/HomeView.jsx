import React from 'react';
import { Upload, Folder, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { MOCK_SEMESTERS } from '../data/mockData';

export const HomeView = ({ branchName, onSelectYear, navigateTo, onBack }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button variant="ghost" onClick={onBack} icon={ChevronLeft} className="pl-2 mb-6">Switch Branch</Button>
      
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium mb-6">
          <span className="uppercase tracking-wider">{branchName}</span>
        </div>
        <h1 className="text-5xl font-bold mb-6 tracking-tight text-slate-900 dark:text-white">
          Engineering Resources
        </h1>
        <div className="flex justify-center gap-4">
          <Button onClick={() => navigateTo('upload')} icon={Upload}>Contribute Notes</Button>
          <Button variant="secondary" onClick={() => navigateTo('mynotes')} icon={Folder}>My Desk</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.keys(MOCK_SEMESTERS).map((year) => (
          <div 
            key={year}
            onClick={() => onSelectYear(year)}
            className="group cursor-pointer relative p-8 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-md dark:shadow-none hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="text-2xl font-bold mb-2 relative z-10 text-slate-900 dark:text-white">{year}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm relative z-10 group-hover:text-indigo-600 dark:group-hover:text-indigo-200 transition-colors">
              Access semesters & subjects
            </p>
            <div className="mt-8 flex justify-end">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-500 flex items-center justify-center transition-colors">
                <ChevronRight size={20} className="text-slate-600 dark:text-white group-hover:text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};