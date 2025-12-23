import React, { useState, useEffect } from 'react';
import { Search, LogOut, ChevronRight, BookOpen, GraduationCap, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/Button';
import { BRANCHES } from '../../data/mockData';

export const Navbar = ({ user, setView, onLoginClick, onLogout, subjectsData, onSearchSelect }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme (light / dark)
  const [theme, setTheme] = useState(() => {
    try {
      const t = localStorage.getItem('theme');
      if (t) return t;
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  // --- DYNAMIC SEARCH LOGIC ---
  useEffect(() => {
    if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
    }

    const query = searchTerm.toLowerCase();
    const results = [];

    // 1. Search Branches
    BRANCHES.forEach(branch => {
        if (branch.name.toLowerCase().includes(query)) {
            results.push({ type: 'Branch', title: branch.name, id: branch.id, data: branch });
        }
    });

    // 2. Search Subjects (Flattened)
    // subjectsData structure: { branchId: { semester: [subjects] } }
    Object.entries(subjectsData).forEach(([branchId, semesters]) => {
        Object.entries(semesters).forEach(([semester, subjects]) => {
            subjects.forEach(subject => {
                if (subject.toLowerCase().includes(query)) {
                    results.push({ 
                        type: 'Subject', 
                        title: subject, 
                        subtitle: `${BRANCHES.find(b=>b.id===branchId)?.name || branchId} • ${semester}`,
                        data: { branchId, semester, subject }
                    });
                }
            });
        });
    });

    setSearchResults(results.slice(0, 8)); // Limit to 8 results
  }, [searchTerm, subjectsData]);

  const handleResultClick = (result) => {
    setSearchTerm("");
    setSearchResults([]);
    onSearchSelect(result);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${isScrolled ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl dark:border-white/10 py-3 shadow-sm' : 'bg-transparent border-transparent py-5'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => setView('branches')}
        >
          <div className="p-1.5 rounded bg-indigo-600 flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white ml-2 tracking-tight">NotesAdda <span className="text-xs text-slate-400 dark:text-slate-400 font-normal ml-2">v2.1</span></span>
        </div>



        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 mr-2">
            <button onClick={() => setView('home')} className="text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">Home</button>
            <button onClick={() => setView('about')} className="text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">About</button>
            <button onClick={() => setView('branches')} className="text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">My Notes</button>
          </div>

          <div className="hidden md:block relative z-50">
             <div className="relative">
                 <input 
                    type="text" 
                    placeholder="Search branches, subjects..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-full pl-10 pr-4 py-1.5 text-sm w-48 focus:w-80 transition-all focus:border-indigo-500 focus:outline-none dark:focus:bg-slate-900" 
                 />
                 <Search size={14} className="absolute left-3.5 top-2.5 text-slate-500" />
             </div>

             {/* SEARCH DROPDOWN */}
             {searchResults.length > 0 && (
                 <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                     {searchResults.map((res, idx) => (
                         <div 
                            key={idx} 
                            onClick={() => handleResultClick(res)}
                            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer border-b border-slate-200 dark:border-slate-800 last:border-0 flex items-center gap-3"
                         >
                             <div className={`p-2 rounded-lg ${res.type === 'Branch' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                 {res.type === 'Branch' ? <ChevronRight size={14} /> : <BookOpen size={14} />}
                             </div>
                             <div>
                                 <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{res.title}</p>
                                 {res.subtitle && <p className="text-xs text-slate-500 dark:text-slate-400">{res.subtitle}</p>}
                             </div>
                         </div>
                     ))}
                 </div>
             )}
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-white/6 transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={16} className="text-slate-300" /> : <Moon size={16} className="text-slate-700" />}
            </button>
          </div>

          {user.loggedIn ? (
            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-300 hidden md:inline">
                    {user.name} {user.role === 'admin' && <span className="text-red-400 text-xs border border-red-500/30 px-1 rounded ml-1">ADMIN</span>}
                </span>
                <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-full transition-colors" title="Logout">
                    <LogOut size={18} className="text-slate-400" />
                </button>
            </div>
          ) : (
             <Button variant="primary" onClick={onLoginClick} className="!px-4 !py-1.5 !text-sm">Login / Register</Button>
          )}
        </div>
      </div>
    </nav>
  );
};
