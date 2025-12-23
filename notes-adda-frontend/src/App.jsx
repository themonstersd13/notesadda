import React, { useState, useEffect } from 'react'; // <--- FIX 1: Added useEffect
import { Shield, Sparkles } from 'lucide-react';
import api from './services/api';

// Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BackgroundEffects } from './components/layout/BackgroundEffects';
import { AuthModal } from './components/auth/AuthModal';
import { GeminiAssistant } from './components/ai/GeminiAssistant';

// Views
import { BranchSelectionView } from './views/BranchSelectionView';
import { HomeView } from './views/HomeView';
import { SemesterView } from './views/SemesterView';
import { SubjectView } from './views/SubjectView';
import { NotesListView } from './views/NotesListView';
import { ContributeView } from './views/ContributeView';
import { MyNotesWorkspace } from './views/MyNotesWorkspace';

// Data
import { BRANCHES, INITIAL_SUBJECTS_DATA } from './data/mockData';

export default function App() {
  // --- STATE DECLARATIONS (MUST COME FIRST) ---
  const [view, setView] = useState('branches'); 
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectsData, setSubjectsData] = useState(INITIAL_SUBJECTS_DATA);
  
  const [user, setUser] = useState({ name: "Guest", role: "guest", loggedIn: false });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);

  // --- USE EFFECT (MUST COME AFTER STATE) ---
  useEffect(() => {
    // 1. Fetch Subjects from Backend
    const fetchSubjects = async () => {
        try {
            const res = await api.get('/subjects');
            // Only update if backend returns data, otherwise keep initial mock data
            if (res.data && Object.keys(res.data).length > 0) {
                setSubjectsData(res.data);
            }
        } catch (err) {
            console.error("Failed to load subjects, using fallback data", err);
        }
    };
    fetchSubjects();
    
    // 2. Check for logged in user (Session Persistence)
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
        setUser({ ...JSON.parse(userStr), loggedIn: true });
    }

    // Hash-based navigation (e.g., footer links)
    const applyHash = () => {
      const h = window.location.hash.replace('#', '');
      if (h) setView(h);
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => {
      window.removeEventListener('hashchange', applyHash);
    };
  }, []);

  // --- HANDLERS ---
  const navigateTo = (destination) => setView(destination);

  const handleBranchSelect = (branchId) => {
    setSelectedBranch(branchId);
    setView('home');
  };

  const handleSearchSelect = (result) => {
    if (result.type === 'Branch') {
        setSelectedBranch(result.id);
        setView('home');
    } else if (result.type === 'Subject') {
        setSelectedBranch(result.data.branchId);
        setSelectedSemester(result.data.semester);
        setSelectedSubject(result.data.subject);
        setView('notes');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-indigo-500/30">
      <BackgroundEffects />

      <Navbar 
        user={user} 
        setView={setView} 
        onLoginClick={() => setIsLoginOpen(true)} 
        onLogout={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser({ name: "Guest", role: "guest", loggedIn: false });
        }}
        subjectsData={subjectsData}
        onSearchSelect={handleSearchSelect}
      />

      <main className="relative z-10 container mx-auto px-4 pt-24 pb-12 min-h-screen">
        
        {view === 'branches' && (
           <BranchSelectionView onSelectBranch={handleBranchSelect} />
        )}

        {view === 'home' && selectedBranch && (
          <HomeView 
            branchName={BRANCHES.find(b => b.id === selectedBranch)?.name}
            onSelectYear={(year) => { setSelectedYear(year); setView('semester'); }}
            navigateTo={navigateTo}
            onBack={() => setView('branches')}
          />
        )}

        {view === 'semester' && (
          <SemesterView 
            year={selectedYear} 
            onBack={() => setView('home')}
            onSelectSemester={(sem) => { setSelectedSemester(sem); setView('subject'); }}
          />
        )}

        {view === 'subject' && (
          <SubjectView 
            branch={selectedBranch}
            semester={selectedSemester}
            subjectsData={subjectsData}
            setSubjectsData={setSubjectsData}
            user={user}
            onBack={() => setView('semester')}
            onSelectSubject={(sub) => { setSelectedSubject(sub); setView('notes'); }}
          />
        )}

        {view === 'notes' && (
          <NotesListView 
            subject={selectedSubject}
            onBack={() => setView('subject')}
          />
        )}

        {view === 'mynotes' && <MyNotesWorkspace />}
        
        {view === 'upload' && (
          <ContributeView 
            branches={BRANCHES}
            subjectsData={subjectsData}
            setSubjectsData={setSubjectsData}
            onBack={() => setView('branches')} 
          />
        )}
      </main>

      <Footer />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
         {user.role === 'admin' && (
            <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 shadow-lg" title="Admin Mode Active">
                <Shield size={24} />
            </div>
         )}
        <button 
          onClick={() => setIsGeminiOpen(!isGeminiOpen)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-900 shadow-xl shadow-emerald-500/20 hover:scale-110 transition-all duration-300"
        >
          <Sparkles size={24} className={isGeminiOpen ? 'animate-spin' : ''} />
        </button>
      </div>

      {isGeminiOpen && <GeminiAssistant onClose={() => setIsGeminiOpen(false)} />}
      
      {isLoginOpen && (
        <AuthModal 
            onClose={() => setIsLoginOpen(false)} 
            onLogin={(u) => { setUser(u); setIsLoginOpen(false); }} 
        />
      )}
    </div>
  );
}