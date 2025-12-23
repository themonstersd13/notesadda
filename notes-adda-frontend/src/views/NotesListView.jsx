import React, { useState, useEffect } from 'react';
import { ChevronLeft, FileText, Download, PlusCircle, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import api from '../services/api';

export const NotesListView = ({ subject, onBack }) => {
  const [notes, setNotes] = useState([]);
  const [addedIds, setAddedIds] = useState([]); // Track added items for UI feedback
  const [togglingIds, setTogglingIds] = useState([]); // Track likes in progress
  
  const isLoggedIn = !!localStorage.getItem('token');

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

  const addToMyDesk = (note) => {
      // 1. Get current items
      const existing = localStorage.getItem('myDeskItems');
      const items = existing ? JSON.parse(existing) : [];

      // 2. Create new item reference
      const newItem = {
          id: Date.now().toString(),
          title: note.title,
          type: 'file',
          fileUrl: note.fileUrl, // Store real Cloudinary URL
          parentId: null, // Add to Root by default
          color: 'indigo'
      };

      // 3. Save
      localStorage.setItem('myDeskItems', JSON.stringify([...items, newItem]));
      
      // 4. UI Feedback
      setAddedIds([...addedIds, note._id || note.id]);
      alert(`"${note.title}" added to My Desk!`);
  };

  const toggleLike = async (note) => {
      if (!isLoggedIn) {
          alert('Please login to like notes.');
          return;
      }

      const id = note._id || note.id;
      if (!id) {
          alert('Unable to identify note.');
          return;
      }

      if (togglingIds.includes(id)) return; // already toggling
      setTogglingIds(prev => [...prev, id]);

      try {
          console.log('toggleLike: sending request', { url: `/notes/${id}/like`, tokenPresent: !!localStorage.getItem('token') });
          const res = await api.post(`/notes/${id}/like`);
          const { likes, dislikes, liked } = res.data;
          setNotes(prev => prev.map(n => (n._id || n.id) === id ? { ...n, likes, dislikes, liked, disliked: false } : n));
      } catch (err) {
          console.error('Failed to toggle like', err);
          alert(err.response?.data?.message || 'Failed to toggle like. Try again.');
      } finally {
          setTogglingIds(prev => prev.filter(x => x !== id));
      }
  };

  const toggleDislike = async (note) => {
      if (!isLoggedIn) {
          alert('Please login to dislike notes.');
          return;
      }

      const id = note._id || note.id;
      if (!id) {
          alert('Unable to identify note.');
          return;
      }

      if (togglingIds.includes(id)) return; // already toggling
      setTogglingIds(prev => [...prev, id]);

      try {
          console.log('toggleDislike: sending request', { url: `/notes/${id}/dislike`, tokenPresent: !!localStorage.getItem('token') });
          const res = await api.post(`/notes/${id}/dislike`);
          const { likes, dislikes, disliked } = res.data;
          setNotes(prev => prev.map(n => (n._id || n.id) === id ? { ...n, likes, dislikes, disliked, liked: false } : n));
      } catch (err) {
          console.error('Failed to toggle dislike', err);
          alert(err.response?.data?.message || 'Failed to toggle dislike. Try again.');
      } finally {
          setTogglingIds(prev => prev.filter(x => x !== id));
      }
  };

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
                            <span>By {note.authorName || note.author || (note.uploadedBy && (note.uploadedBy.fullName || note.uploadedBy.username)) || 'Unknown'}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-600" />
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => toggleLike(note)}
                                    disabled={!isLoggedIn || togglingIds.includes(note._id || note.id)}
                                    className={`flex items-center gap-2 text-xs ${note.liked ? 'text-emerald-400' : 'text-slate-400'} hover:text-emerald-300 transition-colors`}
                                    title={note.liked ? 'Remove like' : 'Like'}
                                >
                                    <ThumbsUp size={14} className={note.liked ? 'text-emerald-400' : 'text-slate-400'} />
                                    <span>{note.likes || 0}</span>
                                </button>

                                <button
                                    onClick={() => toggleDislike(note)}
                                    disabled={!isLoggedIn || togglingIds.includes(note._id || note.id)}
                                    className={`flex items-center gap-2 text-xs ${note.disliked ? 'text-rose-400' : 'text-slate-400'} hover:text-rose-300 transition-colors`}
                                    title={note.disliked ? 'Remove dislike' : 'Dislike'}
                                >
                                    <ThumbsDown size={14} className={note.disliked ? 'text-rose-400' : 'text-slate-400'} />
                                    <span>{note.dislikes || 0}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {/* Add to Desk Button */}
                    <button 
                        onClick={() => addToMyDesk(note)}
                        className={`p-2 rounded-lg transition-colors border ${addedIds.includes(note._id || note.id) ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-700/50 text-slate-400 border-transparent hover:bg-indigo-500/20 hover:text-indigo-300'}`}
                        title="Add to My Desk"
                    >
                        {addedIds.includes(note._id || note.id) ? <Check size={18} /> : <PlusCircle size={18} />}
                    </button>

                    {/* Download Button */}
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