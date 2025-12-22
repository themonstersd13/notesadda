import React, { useState, useEffect } from 'react'; // 1. Imported Hooks
import { ChevronLeft, FileText, Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import api from '../services/api';

export const NotesListView = ({ subject, onBack }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
        try {
            const res = await api.get('/notes', {
                params: { subject: subject } 
            });
            setNotes(res.data);
        } catch (err) {
            console.error("Failed to fetch notes:", err);
        }
    };
    
    if (subject) fetchNotes();
  }, [subject]);

  return (
    <div className="animate-in slide-in-from-right-8 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} icon={ChevronLeft}>Back</Button>
          <div>
            <h2 className="text-2xl font-bold">{subject}</h2>
            <p className="text-slate-400 text-sm">Study Materials</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* 2. Check if notes exist, and map over 'notes' state, NOT 'MOCK_NOTES' */}
        {notes.length === 0 ? (
            <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No notes found for this subject yet. Be the first to contribute!
            </div>
        ) : (
            notes.map((note) => (
            <div key={note._id || note.id} className="group p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:border-indigo-500/30 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${note.fileType === 'pdf' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    <FileText size={20} />
                </div>
                <div>
                    <h4 className="font-medium group-hover:text-indigo-300 transition-colors">{note.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>By {note.authorName || note.author || 'Unknown'}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-600" />
                    <span>{note.likes || 0} Likes</span>
                    </div>
                </div>
                </div>
                <div className="flex items-center gap-2">
                <a 
                    href={note.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                >
                    <Button variant="secondary" className="!px-3 !py-1.5 text-xs">
                        <Download size={14} />
                    </Button>
                </a>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};