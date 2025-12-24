import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
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

// Wrapper component to handle routing logic inside the Router context
function AppContent() {
  const [subjectsData, setSubjectsData] = useState(INITIAL_SUBJECTS_DATA);
  const [user, setUser] = useState({ name: "Guest", role: "guest", loggedIn: false });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

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
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [location.pathname, fetchSubjects]);

  // Context for AI (Extract from URL if possible)
  const getAIContext = () => {
      const pathParts = location.pathname.split('/');
      // Simple heuristic based on URL structure
      if (pathParts.includes('notes')) return { subject: decodeURIComponent(pathParts[pathParts.length-1]) };
      return {};
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans selection:bg-indigo-500/30 flex flex-col">
      <BackgroundEffects />

      <Navbar 
        user={user} 
        onLoginClick={() => setIsLoginOpen(true)} 
        onLogout={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser({ name: "Guest", role: "guest", loggedIn: false });
            navigate('/');
        }}
        subjectsData={subjectsData}
        onSearchSelect={(result) => {
            if (result.type === 'Branch') navigate(`/branch/${result.id}`);
            else if (result.type === 'Subject') navigate(`/branch/${result.data.branchId}/semester/${result.data.semester}/subject/${result.data.subject}`);
        }}
      />

      <main className="relative z-10 container mx-auto px-4 pt-24 pb-12 flex-grow">
        <Routes>
            <Route path="/" element={<BranchSelectionView onSelectBranch={(id) => navigate(`/branch/${id}`)} />} />
            
            <Route path="/branch/:branchId" element={<HomeWrapper navigate={navigate} />} />
            <Route path="/branch/:branchId/semester/:semester" element={<SemesterWrapper navigate={navigate} />} />
            <Route path="/branch/:branchId/semester/:semester/subject/:subject" element={<SubjectWrapper subjectsData={subjectsData} setSubjectsData={setSubjectsData} user={user} navigate={navigate} refreshData={fetchSubjects} />} />
            <Route path="/notes/:subject" element={<NotesWrapper user={user} navigate={navigate} />} />
            
            <Route path="/mynotes" element={<MyNotesWorkspace />} />
            <Route path="/upload" element={<ContributeView branches={BRANCHES} subjectsData={subjectsData} setSubjectsData={setSubjectsData} onBack={() => navigate(-1)} />} />
            
            <Route path="/about" element={<AboutView onBack={() => navigate('/')} onGetStarted={() => navigate('/')} />} />
            <Route path="/privacy" element={<PrivacyView onBack={() => navigate(-1)} />} />
            <Route path="/terms" element={<TermsView onBack={() => navigate(-1)} />} />
            <Route path="/support" element={<SupportView onBack={() => navigate(-1)} />} />
            
            {/* Profile Routes */}
            <Route path="/profile" element={<ProfileView onBack={() => navigate(-1)} />} />
            <Route path="/u/:username" element={<ProfileView onBack={() => navigate('/')} publicView={true} />} />
        </Routes>
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

      {isGeminiOpen && <GeminiAssistant onClose={() => setIsGeminiOpen(false)} context={getAIContext()} />}
      
      {isLoginOpen && (
        <AuthModal 
            onClose={() => setIsLoginOpen(false)} 
            onLogin={(u) => { setUser(u); setIsLoginOpen(false); }} 
        />
      )}
    </div>
  );
}

// --- ROUTE WRAPPERS TO HANDLE PARAMS ---

const HomeWrapper = ({ navigate }) => {
    const { branchId } = useParams();
    const branchName = BRANCHES.find(b => b.id === branchId)?.name;
    // Map URL structure to component expectations
    return <HomeView 
        branchName={branchName} 
        onSelectYear={(year) => navigate(`/branch/${branchId}/semester/${year}`)} // Using 'year' param as semester grouping in View
        navigateTo={(path) => navigate(`/${path}`)}
        onBack={() => navigate('/')} 
    />;
};

const SemesterWrapper = ({ navigate }) => {
    const { branchId, semester: year } = useParams(); // URL uses 'semester' param slot for 'Year 1' etc
    return <SemesterView 
        year={year} 
        onBack={() => navigate(`/branch/${branchId}`)}
        onSelectSemester={(sem) => navigate(`/branch/${branchId}/semester/${sem}/subject/list`)} // Temporary hack, subject view handles list
    />;
};

// Adjusted route logic: SemesterView (Year Selection) -> SubjectView (Semester Selection)
// The original flow was: Home (Year) -> Semester (Sem) -> Subject (List)
// Let's align routes:
// 1. /branch/:id -> Shows Years (HomeView)
// 2. /branch/:id/year/:year -> Shows Semesters (SemesterView)
// 3. /branch/:id/semester/:sem -> Shows Subjects (SubjectView)

const SubjectWrapper = ({ subjectsData, setSubjectsData, user, navigate, refreshData }) => {
    const { branchId, semester } = useParams();
    return <SubjectView 
        branch={branchId}
        semester={semester}
        subjectsData={subjectsData}
        setSubjectsData={setSubjectsData}
        user={user}
        onBack={() => navigate(`/branch/${branchId}`)} // Simplification
        onSelectSubject={(sub) => navigate(`/notes/${sub}`)}
        refreshData={refreshData}
    />;
};

const NotesWrapper = ({ user, navigate }) => {
    const { subject } = useParams();
    return <NotesListView subject={subject} onBack={() => navigate(-1)} user={user} />;
};

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}