import React from 'react';
import { 
  BookOpen, Share2, Shield, Zap, Coffee, 
  Layout, Database, UploadCloud, Users, Heart
} from 'lucide-react';
import { Button } from '../components/ui/Button';

export const AboutView = ({ onBack, onGetStarted }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white mb-16 p-8 md:p-16 text-center border border-white/10 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-30"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-30"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
            Open Source Initiative
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Democratizing Education for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Engineers</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
            NotesAdda is a collaborative platform built to help students share study materials, access organized notes, and leverage AI for better learning.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={onGetStarted} className="px-8 py-3 text-lg">Start Exploring</Button>
            <Button variant="secondary" onClick={() => window.open('https://github.com/themonstersd13/notesadda/', '_blank')} className="px-8 py-3 text-lg">
                View on GitHub
            </Button>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-center">
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Why NotesAdda?</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                Engineering requires access to quality resources, but often notes are scattered across WhatsApp groups or lost in drives. 
                <br/><br/>
                We built a <strong>centralized, structured, and smart</strong> repository where:
                <ul className="list-disc pl-5 mt-4 space-y-2 marker:text-indigo-500">
                    <li>Seniors can pass down knowledge legacy.</li>
                    <li>Juniors find exactly what they need in seconds.</li>
                    <li>Everyone learns together.</li>
                </ul>
            </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <FeatureCard icon={Users} title="Community Driven" desc="Content by students, for students." />
            <FeatureCard icon={UploadCloud} title="Cloud Storage" desc="Securely hosted on Cloudinary." />
            <FeatureCard icon={Zap} title="AI Powered" desc="Gemini AI integration for instant help." />
            <FeatureCard icon={Shield} title="Verified" desc="Admin controls ensure quality." />
        </div>
      </div>

      {/* How to Use Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
                number="01" 
                title="Select Your Branch" 
                desc="Choose from CSE, IT, AI&ML, etc. to find tailored content for your curriculum."
            />
            <StepCard 
                number="02" 
                title="Browse or Search" 
                desc="Drill down by Year > Semester > Subject, or use the global search bar to find PDFs instantly."
            />
            <StepCard 
                number="03" 
                title="My Desk" 
                desc="Found something useful? Add it to 'My Desk' to create your own personalized library."
            />
        </div>
      </div>

      {/* Features Showcase */}
      <div className="bg-slate-100 dark:bg-slate-900/50 rounded-3xl p-8 md:p-12 mb-20 border border-slate-200 dark:border-slate-800">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Power Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailCard 
                  icon={Layout} 
                  title="My Desk Workspace" 
                  desc="A drag-and-drop enabled personal space. Create folders, upload private files, and save public notes for quick access."
              />
              <DetailCard 
                  icon={Share2} 
                  title="Contribute" 
                  desc="Upload your own notes. If a subject doesn't exist, our system auto-creates it dynamically!"
              />
              <DetailCard 
                  icon={Coffee} 
                  title="Gemini Assistant" 
                  desc="Stuck on a concept? Ask the built-in AI assistant to summarize topics or explain complex theories."
              />
          </div>
      </div>

      {/* Team & Credits */}
      <div className="text-center max-w-2xl mx-auto">
          <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Built with Passion</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
              Developed by <strong>Saurabh Doiphode & Srushti Garad</strong> at Walchand College of Engineering using the MERN Stack (MongoDB, Express, React, Node).
          </p>
          <div className="flex justify-center gap-4 text-sm font-mono text-slate-500">
              <span>React v18</span> • <span>Tailwind</span> • <span>Cloudinary</span> • <span>Gemini</span>
          </div>
      </div>

    </div>
  );
};

// Helper Components
const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:border-indigo-500/30 transition-all hover:-translate-y-1">
        <Icon className="text-indigo-500 mb-3" size={28} />
        <h3 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
    </div>
);

const StepCard = ({ number, title, desc }) => (
    <div className="relative p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="text-6xl font-bold text-slate-100 dark:text-slate-700 absolute top-4 right-6 pointer-events-none opacity-50">{number}</div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">{desc}</p>
    </div>
);

const DetailCard = ({ icon: Icon, title, desc }) => (
    <div className="flex gap-4 p-4 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors">
        <div className="shrink-0 w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Icon size={24} />
        </div>
        <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
        </div>
    </div>
);