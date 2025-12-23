import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { BRANCHES } from '../data/mockData';
import api from '../services/api';

export const SubjectView = ({ branch, semester, subjectsData, setSubjectsData, user, onBack, onSelectSubject, refreshData }) => {
  const subjects = subjectsData[branch]?.[semester] || [];
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e, subjectName) => {
    e.stopPropagation();
    if (!window.confirm(`Delete subject "${subjectName}"? This cannot be undone.`)) return;
    
    try {
        // Send delete request with body
        await api.delete('/subjects', { 
            data: { branch, semester, name: subjectName } 
        });
        
        // Optimistic Update
        const updatedList = subjects.filter(s => s !== subjectName);
        updateSubjectsDB(updatedList);
        
        // Ensure sync
        if(refreshData) refreshData();
    } catch (err) {
        alert("Failed to delete subject: " + (err.response?.data?.message || err.message));
    }
  };

  const handleAddSubject = async () => {
      if(!newValue.trim()) return;
      setLoading(true);
      try {
          await api.post('/subjects', {
              branch,
              semester,
              name: newValue
          });
          
          const updatedList = [...subjects, newValue];
          updateSubjectsDB(updatedList);
          setNewValue("");
          setIsAdding(false);
          
          if(refreshData) refreshData();
      } catch (err) {
          alert("Failed to add subject: " + (err.response?.data?.message || err.message));
      } finally {
          setLoading(false);
      }
  };

  const updateSubjectsDB = (newList) => {
      setSubjectsData(prev => ({
          ...prev,
          [branch]: {
              ...prev[branch],
              [semester]: newList
          }
      }));
  };

  return (
    <div className="animate-in zoom-in-95 duration-500">
       <div className="flex items-center justify-between mb-8">
         <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} icon={ChevronLeft}>Back</Button>
            <div>
                <h2 className="text-2xl font-bold">{semester}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{BRANCHES.find(b => b.id === branch)?.name}</p>
            </div>
         </div>
         {user.role === 'admin' && (
             <Button variant="success" icon={Plus} onClick={() => setIsAdding(!isAdding)}>
                 {isAdding ? "Cancel" : "Add Subject"}
             </Button>
         )}
      </div>

      {isAdding && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-2">
              <Input 
                 placeholder="Enter new subject name..." 
                 value={newValue} 
                 onChange={(e) => setNewValue(e.target.value)} 
                 className="bg-white dark:bg-slate-900"
              />
              <Button variant="primary" onClick={handleAddSubject} disabled={loading}>
                  {loading ? "Adding..." : "Add"}
              </Button>
          </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {subjects.length === 0 && (
            <div className="text-center p-12 text-slate-500 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl">
                No subjects found for this semester.
                {user.role === 'admin' && " You can add one above."}
            </div>
        )}
        
        {subjects.map((sub, idx) => (
          <div 
            key={idx}
            onClick={() => onSelectSubject(sub)}
            className="group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 hover:shadow-lg dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
                {sub.charAt(0)}
              </div>
              <span className="font-medium text-lg text-slate-800 dark:text-slate-200">{sub}</span>
            </div>

            <div className="flex items-center gap-3">
                {user.role === 'admin' && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={(e) => handleDelete(e, sub)} 
                            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete Subject"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}
                <ChevronRight size={18} className="text-slate-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};