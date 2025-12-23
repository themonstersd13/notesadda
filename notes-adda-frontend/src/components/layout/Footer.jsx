import React, { useState } from 'react';
import { Mail, Github, Twitter, Linkedin, Send, GraduationCap } from 'lucide-react';
import api from '../../services/api';

export const Footer = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitFeedback = async (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    // no minimum length required; only require a non-empty message
    if (!trimmed) {
      setStatus({ type: 'error', text: 'Please enter a message.' });
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      await api.post('/feedback', { message: trimmed });
      setStatus({ type: 'success', text: 'Feedback sent!' });
      setMessage('');
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setStatus({ type: 'error', text: 'Failed to send.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gradient-to-tr from-slate-800/90 to-slate-900/95 text-slate-300 border-t border-slate-800/40 font-sans">
      <div className="container mx-auto px-6 pt-10 pb-4">
        {/* Main Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          
          {/* Brand Identity */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="p-1.5 rounded bg-indigo-600">
                <GraduationCap size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">NotesAdda</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-slate-500">
              High-quality study materials and engineering notes. Built by students, for students.
            </p>
            <div className="flex gap-4 text-slate-500">
              <a href="#" className="hover:text-white transition-colors"><Github size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2 text-[13px]">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">My Notes</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3">
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Contact</h4>
            <div className="space-y-2 text-[13px]">
              <a href="mailto:saurabh.doiphode@walchandsangli.ac.in" className="flex items-center gap-2 hover:text-white transition-colors truncate">
                <Mail size={14} className="text-indigo-500 shrink-0" />
                <span>saurabh.doiphode@...</span>
              </a>
              <a href="mailto:srushti.garad@walchandsangli.ac.in" className="flex items-center gap-2 hover:text-white transition-colors truncate">
                <Mail size={14} className="text-indigo-500 shrink-0" />
                <span>srushti.garad@...</span>
              </a>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="md:col-span-3">
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-widest">Feedback</h4>
            <form onSubmit={submitFeedback} className="space-y-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Suggest an improvement..."
                className="w-full bg-slate-900/80 border border-slate-800 rounded p-3 text-sm text-slate-100 focus:border-indigo-500 outline-none transition-all h-20 resize-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-800 disabled:text-slate-600 text-white py-1.5 rounded text-xs font-medium transition-all"
              >
                {loading ? 'Sending...' : 'Submit Feedback'}
              </button>
              {status && (
                <p className={`text-[10px] text-center ${status.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {status.text}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar - Minimalist */}
        <div className="pt-4 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[11px] text-slate-600">
            <span>© {new Date().getFullYear()} NotesAdda</span>
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Support</a>
          </div>
          
          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></span>
              
            </div>
            <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800/50">v2.1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};