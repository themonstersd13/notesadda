import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Save, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { BRANCHES } from '../data/mockData';

export const SubjectView = ({ branch, semester, subjectsData, setSubjectsData, user, onBack, onSelectSubject }) => {
  const subjects = subjectsData[branch]?.[semester] || [];
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");

  const handleDelete = (index, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure? This action is simulating a DB delete.")) return;
    const updatedList = [...subjects];
    updatedList.splice(index, 1);
    updateSubjectsDB(updatedList);
  };

  const handleEditStart = (index, currentName, e) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditValue(currentName);
  };

  const handleEditSave = (e) => {
    e.stopPropagation();
    const updatedList = [...subjects];
    updatedList[editingIndex] = editValue;
    updateSubjectsDB(updatedList);
    setEditingIndex(null);
  };

  const handleAddSubject = () => {
      if(!newValue.trim()) return;
      const updatedList = [...subjects, newValue];
      updateSubjectsDB(updatedList);
      setNewValue("");
      setIsAdding(false);
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
                <p className="text-slate-400 text-sm">{BRANCHES.find(b => b.id === branch)?.name}</p>
            </div>
         </div>
         {user.role === 'admin' && (
             <Button variant="success" icon={Plus} onClick={() => setIsAdding(!isAdding)}>
                 {isAdding ? "Cancel" : "Add Subject"}
             </Button>
         )}
      </div>

      {isAdding && (
          <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-2">
              <Input 
                 placeholder="Enter new subject name..." 
                 value={newValue} 
                 onChange={(e) => setNewValue(e.target.value)} 
                 className="!bg-slate-900"
              />
              <Button variant="primary" onClick={handleAddSubject}>Add</Button>
          </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {subjects.length === 0 && (
            <div className="text-center p-12 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                No subjects found for this semester. Admins can add them.
            </div>
        )}
        
        {subjects.map((sub, idx) => (
          <div 
            key={idx}
            onClick={() => editingIndex === null && onSelectSubject(sub)}
            className="group flex items-center justify-between p-5 rounded-2xl bg-slate-800/30 border border-white/5 hover:bg-slate-800/50 hover:border-indigo-500/30 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                {sub.charAt(0)}
              </div>
              
              {editingIndex === idx ? (
                  <div className="flex-1 flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                      <Button variant="success" onClick={handleEditSave} className="!p-2"><Save size={16} /></Button>
                  </div>
              ) : (
                  <span className="font-medium text-lg">{sub}</span>
              )}
            </div>

            <div className="flex items-center gap-3">
                {user.role === 'admin' && editingIndex !== idx && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => handleEditStart(idx, sub, e)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg">
                            <Edit2 size={18} />
                        </button>
                        <button onClick={(e) => handleDelete(idx, e)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}
                <ChevronRight size={18} className="text-slate-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
