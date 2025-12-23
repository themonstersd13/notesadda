import React, { useState, useEffect, useCallback } from 'react';
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
import { AboutView } from './views/AboutView';
import { PrivacyView } from './views/PrivacyView';
import { TermsView } from './views/TermsView';
import { SupportView } from './views/SupportView';
import { ProfileView } from './views/ProfileView'; 

// Data
import { BRANCHES, INITIAL_SUBJECTS_DATA } from './data/mockData';

export default function App() {
  const [view, setView] = useState('branches'); 
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  
  const [subjectsData, setSubjectsData] = useState(INITIAL_SUBJECTS_DATA);
  const [user, setUser] = useState({ name: "Guest", role: "guest", loggedIn: false });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);

  const fetchSubjects = useCallback(async () => {
    try {
        const res = await api.get('/subjects');
        if (res.data && Object.keys(res.data).length > 0) {
            setSubjectsData(res.data);
        }
    } catch (err) {
        console.error("Failed to load subjects", err);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
        setUser({ ...JSON.parse(userStr), loggedIn: true });
    }

    const applyHash = () => {
      const h = window.location.hash.replace('#', '');
      if (h) setView(h);
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [view, fetchSubjects]);

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

  // Helper to get readable branch name
  const currentBranchName = BRANCHES.find(b => b.id === selectedBranch)?.name;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-indigo-500/30 flex flex-col">
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

      <main className="relative z-10 container mx-auto px-4 pt-24 pb-12 flex-grow">
        
        {view === 'branches' && (
           <BranchSelectionView onSelectBranch={handleBranchSelect} />
        )}

        {view === 'home' && selectedBranch && (
          <HomeView 
            branchName={currentBranchName}
            onSelectYear={(year) => { setSelectedYear(year); setView('semester'); }}
            navigateTo={(v) => setView(v)}
            onBack={() => setView('branches')}
          />
        )}
        
        {view === 'home' && !selectedBranch && <BranchSelectionView onSelectBranch={handleBranchSelect} />}

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
            refreshData={fetchSubjects} 
          />
        )}

        {view === 'notes' && (
          <NotesListView 
            subject={selectedSubject}
            onBack={() => setView('subject')}
            user={user}
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

        {view === 'about' && <AboutView onBack={() => setView('branches')} onGetStarted={() => setView('branches')} />}
          {view === 'profile' && (
            <ProfileView onBack={() => setView('branches')} />
        )}
        {view === 'privacy' && <PrivacyView onBack={() => setView('branches')} />}
        {view === 'terms' && <TermsView onBack={() => setView('branches')} />}
        {view === 'support' && <SupportView onBack={() => setView('branches')} />}

      </main>

      <Footer />

      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
         {user.role === 'admin' && (
            <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-lg" title="Admin Mode Active">
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

      {isGeminiOpen && (
        <GeminiAssistant 
            onClose={() => setIsGeminiOpen(false)} 
            // Pass the current navigation context to the AI
            context={{
                branch: currentBranchName,
                semester: selectedSemester,
                subject: selectedSubject
            }}
        />
      )}
      
      {isLoginOpen && (
        <AuthModal 
            onClose={() => setIsLoginOpen(false)} 
            onLogin={(u) => { setUser(u); setIsLoginOpen(false); }} 
        />
      )}
    </div>
  );
}