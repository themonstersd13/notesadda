import React from 'react';
import { Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const PrivacyView = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 animate-in fade-in">
        <Button variant="ghost" onClick={onBack} className="mb-8">← Back</Button>
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <Shield size={32} />
                </div>
                <h1 className="text-3xl font-bold">Privacy Policy</h1>
            </div>

            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed space-y-6">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                
                <section>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">1. Data Collection</h3>
                    <p>We collect minimal data necessary for the platform's operation: your name, email (if provided via login), and the files you contribute. We do not track your location or share data with third-party advertisers.</p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">2. Uploaded Content</h3>
                    <p>Any notes or files you upload to the "Contribute" section are considered public contributions. They are accessible to other students. Please ensure you have the right to share the content.</p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">3. Cookies</h3>
                    <p>We use local storage to remember your preferences (like Dark Mode and My Desk items) and authentication tokens. We do not use tracking cookies.</p>
                </section>

                <section>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">4. AI Usage</h3>
                    <p>When you use the Gemini Assistant, your queries are sent to Google's API to generate responses. We do not store these conversations permanently on our servers.</p>
                </section>
            </div>
        </div>
    </div>
  );
};