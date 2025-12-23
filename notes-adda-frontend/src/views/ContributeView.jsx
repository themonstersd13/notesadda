import React, { useState } from 'react';
import { ChevronLeft, Upload } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { MOCK_SEMESTERS } from '../data/mockData';
import api from '../services/api';
export const ContributeView = ({ onBack, branches, subjectsData, setSubjectsData }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isNewSubject, setIsNewSubject] = useState(false);
  
  const [formData, setFormData] = useState({
      title: '',
      branch: 'cse',
      semester: 'Semester 1',
      subject: '',
      newSubjectName: ''
  });

  const availableSubjects = subjectsData[formData.branch]?.[formData.semester] || [];

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to contribute notes.');
        return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('file', file);
formDataToSend.append('title', formData.title);
formDataToSend.append('branch', formData.branch);
formDataToSend.append('semester', formData.semester);

if (isNewSubject) {
    formDataToSend.append('subject', formData.newSubjectName);
    formDataToSend.append('isNewSubject', 'true');
} else {
    formDataToSend.append('subject', formData.subject);
}

try {
    setUploading(true);
    await api.post('/notes', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    alert("Upload Successful!");
    onBack();
} catch (err) {
    alert("Upload Failed: " + (err.response?.data?.message || err.message));
} finally {
    setUploading(false);
}
  };

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
      <Button variant="ghost" onClick={onBack} icon={ChevronLeft}>Back to Home</Button>
      
      <Card className="mt-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Upload className="text-indigo-400" /> Contribute Notes
        </h2>
        
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Title</label>
            <Input 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                placeholder="e.g. DBMS Unit 1 Handwritten Notes" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Branch</label>
                <select 
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:border-indigo-500 outline-none"
                    value={formData.branch}
                    onChange={(e) => setFormData({...formData, branch: e.target.value, subject: ''})}
                >
                    {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
             </div>
             
             <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Semester</label>
                <select 
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:border-indigo-500 outline-none"
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: e.target.value, subject: ''})}
                >
                    {Object.values(MOCK_SEMESTERS).flat().map(s => <option key={s} value={s}>{s}</option>)}
                </select>
             </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-400">Subject</label>
             {!isNewSubject ? (
                 <select 
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:border-indigo-500 outline-none"
                    value={formData.subject}
                    onChange={(e) => {
                        if (e.target.value === 'OTHER_NEW') {
                            setIsNewSubject(true);
                            setFormData({...formData, subject: ''});
                        } else {
                            setFormData({...formData, subject: e.target.value});
                        }
                    }}
                >
                    <option value="">Select a Subject...</option>
                    {availableSubjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    <option value="OTHER_NEW" className="text-indigo-300 font-bold">+ Other / Syllabus Changed</option>
                </select>
             ) : (
                 <div className="flex gap-2 animate-in fade-in">
                     <Input 
                        placeholder="Enter the new subject name..."
                        value={formData.newSubjectName}
                        onChange={(e) => setFormData({...formData, newSubjectName: e.target.value})}
                        className="flex-1"
                     />
                     <Button variant="secondary" onClick={() => setIsNewSubject(false)}>Cancel</Button>
                 </div>
             )}
          </div>

          <div className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-indigo-500/50 transition-colors bg-slate-900/20">
            <input type="file" id="file-upload" className="hidden" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.png,.jpg,.jpeg" />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Upload size={24} />
              </div>
              <div>
                <span className="text-indigo-400 font-medium">Click to upload</span>
                <span className="text-slate-500"> or drag and drop</span>
              </div>
              <p className="text-xs text-slate-600">PDF, PNG, JPG (MAX. 10MB)</p>
            </label>
            {file && (
                <div className="mt-4 px-4 py-2 bg-indigo-500/20 text-indigo-200 rounded-lg text-sm inline-block">
                    {file.name}
                </div>
            )}
          </div>

          <Button variant="primary" className="w-full justify-center" onClick={handleUpload}>
            {uploading ? "Processing..." : "Submit Contribution"}
          </Button>
        </form>
      </Card>
    </div>
  );
};
