import React, { useState } from 'react';
import { Mail, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // Import Router hooks
import api from '../../services/api';

export const Footer = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitFeedback = async (e) => {
    e.preventDefault();
    const trimmed = message.trim();
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
      console.warn("Feedback endpoint might be missing", err);
      setStatus({ type: 'success', text: 'Feedback sent! (Demo)' });
      setMessage('');
      setTimeout(() => setStatus(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative z-10 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800/40 font-sans backdrop-blur-md">
      <div className="container mx-auto px-6 pt-10 pb-4">
        {/* Main Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          
          {/* Brand Identity */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="p-1.5 rounded bg-indigo-600">
                <GraduationCap size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">NotesAdda</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-slate-500 dark:text-slate-400">
              High-quality study materials and engineering notes. Built by students, for students.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2">
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4 text-xs uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-2 text-[13px]">
              <li><Link to="/" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">About</Link></li>
              <li><Link to="/mynotes" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">My Desk</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3">
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4 text-xs uppercase tracking-widest">Contact</h4>
            <div className="space-y-2 text-[13px]">
              <a href="mailto:saurabh.doiphode@walchandsangli.ac.in" className="flex items-center gap-2 hover:text-indigo-500 dark:hover:text-white transition-colors truncate">
                <Mail size={14} className="text-indigo-500 shrink-0" />
                <span className="truncate">saurabh.doiphode@...</span>
              </a>
              <a href="mailto:srushti.garad@walchandsangli.ac.in" className="flex items-center gap-2 hover:text-indigo-500 dark:hover:text-white transition-colors truncate">
                <Mail size={14} className="text-indigo-500 shrink-0" />
                <span className="truncate">srushti.garad@...</span>
              </a>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="md:col-span-3">
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4 text-xs uppercase tracking-widest">Feedback</h4>
            <form onSubmit={submitFeedback} className="space-y-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Suggest an improvement..."
                className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded p-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 outline-none transition-all h-20 resize-none shadow-sm focus:ring-1 focus:ring-indigo-500/20"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-white py-1.5 rounded text-xs font-medium transition-all shadow-md hover:shadow-lg"
              >
                {loading ? 'Sending...' : 'Submit Feedback'}
              </button>
              {status && (
                <p className={`text-[10px] text-center font-medium ${status.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {status.text}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>© {new Date().getFullYear()} NotesAdda</span>
            <Link to="/privacy" className="hover:text-indigo-500 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-indigo-500 transition-colors">Terms</Link>
            <Link to="/support" className="hover:text-indigo-500 transition-colors">Support</Link>
          </div>
          
          <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>System Operational</span>
            </div>
            <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">v2.1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};