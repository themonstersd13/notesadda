import React from 'react';

export const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 ${className}`}>
    {children}
  </div>
);
