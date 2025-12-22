import React from 'react';
import { Folder } from 'lucide-react';

export const MyNotesWorkspace = () => {
    return (
        <div className="text-center p-12 bg-slate-800/20 rounded-xl border border-dashed border-slate-700">
            <Folder size={48} className="mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-bold text-slate-300">My Desk Workspace</h3>
            <p className="text-slate-500">Drag & drop feature temporarily disabled for this view.</p>
        </div>
    )
};
