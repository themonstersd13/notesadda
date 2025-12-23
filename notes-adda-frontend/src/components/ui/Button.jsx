import React from 'react';

export const Button = ({ children, onClick, variant = 'primary', className = '', icon: Icon, disabled = false }) => {
  const baseStyle = "px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-md hover:brightness-110 border border-indigo-500/20 shadow-sm", 
    secondary: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20",
    danger: "bg-red-500/20 border border-red-500/30 text-red-200 hover:bg-red-500/30",
    ghost: "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 shadow-none",
    success: "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};
