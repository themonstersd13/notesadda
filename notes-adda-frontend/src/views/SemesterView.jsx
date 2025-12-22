import React from 'react';
import { BookOpen, ChevronLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { MOCK_SEMESTERS } from '../data/mockData';

export const SemesterView = ({ year, onBack, onSelectSemester }) => {
  const semesters = MOCK_SEMESTERS[year] || [];
  
  return (
    <div className="animate-in zoom-in-95 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={onBack} icon={ChevronLeft}>Back</Button>
        <h2 className="text-2xl font-bold">{year}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {semesters.map((sem) => (
          <Card key={sem} className="cursor-pointer group hover:bg-slate-800/60" onClick={() => onSelectSemester(sem)}>
            <div className="flex items-center justify-between">
            <div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{sem}</h3>
                <p className="text-slate-400 text-sm">View Subjects</p>
            </div>
            <BookOpen className="text-slate-600 group-hover:text-indigo-500 transition-colors" size={32} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
