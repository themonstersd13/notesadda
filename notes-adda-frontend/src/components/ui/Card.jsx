import React from 'react';

export const Card = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick} 
    className={`bg-white dark:bg-slate-800/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md dark:shadow-none hover:border-indigo-500/30 dark:hover:border-white/20 transition-all duration-300 ${className}`}
  >
    {children}
  </div>
);