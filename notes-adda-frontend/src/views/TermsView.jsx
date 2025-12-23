import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const TermsView = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 animate-in fade-in">
        <Button variant="ghost" onClick={onBack} className="mb-8">← Back</Button>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <FileText size={32} />
                </div>
                <h1 className="text-3xl font-bold">Terms of Service</h1>
            </div>

            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed space-y-6">
                <section>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">1. Acceptance</h3>
                    <p>By using NotesAdda, you agree to these terms. This platform is for educational purposes only.</p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">2. User Conduct</h3>
                    <p>You agree not to upload malicious files, copyrighted material without permission, or offensive content. Admins reserve the right to remove any content without notice.</p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">3. Disclaimer</h3>
                    <p>Notes are contributed by students. We do not guarantee the accuracy of the study materials found on this platform. Use them as a supplementary resource.</p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">4. Termination</h3>
                    <p>We reserve the right to terminate access for users who violate these terms.</p>
                </section>
            </div>
        </div>
    </div>
  );
};