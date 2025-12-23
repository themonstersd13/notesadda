import React from 'react';
import { HelpCircle, Mail, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const SupportView = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 animate-in fade-in">
        <Button variant="ghost" onClick={onBack} className="mb-8">← Back</Button>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-xl text-violet-600 dark:text-violet-400">
                    <HelpCircle size={32} />
                </div>
                <h1 className="text-3xl font-bold">Support & Help</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">FAQs</h3>
                        <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                            <li className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                <strong className="block text-slate-900 dark:text-white mb-1">How do I contribute?</strong>
                                Click the "Contribute" button in the Navbar, fill in the details, and upload your PDF.
                            </li>
                            <li className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                <strong className="block text-slate-900 dark:text-white mb-1">My subject isn't listed?</strong>
                                Select "Other / New Subject" in the upload form to automatically create a new subject bucket.
                            </li>
                            <li className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                <strong className="block text-slate-900 dark:text-white mb-1">Is it free?</strong>
                                Yes, NotesAdda is completely free and open-source.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contact Us</h3>
                    <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                            Facing technical issues or have a feature request? Reach out to our maintainers directly.
                        </p>
                        <div className="space-y-3">
                            <a href="mailto:saurabh.doiphode@walchandsangli.ac.in" className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl hover:shadow-md transition-all">
                                <Mail className="text-indigo-500" size={20} />
                                <div className="text-sm">
                                    <div className="font-bold text-slate-900 dark:text-white">Saurabh Doiphode</div>
                                    <div className="text-slate-500 text-xs">saurabh.doiphode@walchandsangli.ac.in</div>
                                </div>
                            </a>
                            <a href="mailto:srushti.garad@walchandsangli.ac.in" className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl hover:shadow-md transition-all">
                                <Mail className="text-pink-500" size={20} />
                                <div className="text-sm">
                                    <div className="font-bold text-slate-900 dark:text-white">Srushti Garad</div>
                                    <div className="text-slate-500 text-xs">srushti.garad@walchandsangli.ac.in</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};