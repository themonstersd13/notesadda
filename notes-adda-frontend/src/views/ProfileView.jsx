import React, { useState, useEffect } from 'react';
import { 
    User, Mail, Linkedin, Calendar, Upload, Save, 
    Award, ThumbsUp, FileText, Camera, ChevronLeft 
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import api from '../services/api';

export const ProfileView = ({ onBack }) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        bio: '',
        currentYear: 'First Year',
        linkedin: '',
        contactEmail: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/profile/me');
            setData(res.data);
            setFormData({
                bio: res.data.profile.bio || '',
                currentYear: res.data.profile.currentYear || 'First Year',
                linkedin: res.data.profile.linkedin || '',
                contactEmail: res.data.profile.contactEmail || ''
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await api.put('/profile/me', formData);
            setIsEditing(false);
            fetchProfile(); // Refresh
        } catch (err) {
            alert('Failed to update profile');
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Optimistic update
            const objectUrl = URL.createObjectURL(file);
            setData(prev => ({ ...prev, profile: { ...prev.profile, profilePhoto: objectUrl } }));
            
            await api.post('/profile/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchProfile(); // Sync with real URL
        } catch (err) {
            alert('Photo upload failed');
        }
    };

    if (loading) return <div className="text-center py-20 text-slate-500">Loading Profile...</div>;
    if (!data) return <div className="text-center py-20">Please log in to view your profile.</div>;

    const { user, profile, stats } = data;

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in pb-12">
            <Button variant="ghost" onClick={onBack} icon={ChevronLeft} className="mb-6">Back</Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: ID Card Style */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="text-center relative overflow-hidden border-t-4 border-t-indigo-500">
                        {/* Avatar */}
                        <div className="relative w-32 h-32 mx-auto mb-4 group">
                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-indigo-100 dark:border-indigo-900 bg-slate-200">
                                {profile.profilePhoto ? (
                                    <img src={profile.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <User size={48} />
                                    </div>
                                )}
                            </div>
                            <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
                                <Camera size={24} />
                                <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                            </label>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.fullName}</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">@{user.username}</p>
                        
                        <div className="flex justify-center gap-4 text-sm mb-6">
                            <div className="text-center">
                                <div className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">{stats.contributions}</div>
                                <div className="text-slate-500 text-xs">Uploads</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">{stats.reactions}</div>
                                <div className="text-slate-500 text-xs">Reactions</div>
                            </div>
                        </div>

                        {isEditing ? (
                            <div className="space-y-3 text-left">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Current Year</label>
                                    <select 
                                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded p-2 text-sm"
                                        value={formData.currentYear}
                                        onChange={e => setFormData({...formData, currentYear: e.target.value})}
                                    >
                                        <option>First Year</option>
                                        <option>Second Year</option>
                                        <option>Third Year</option>
                                        <option>Final Year</option>
                                    </select>
                                </div>
                                <Input 
                                    placeholder="LinkedIn URL" 
                                    value={formData.linkedin} 
                                    onChange={e => setFormData({...formData, linkedin: e.target.value})}
                                />
                                <Input 
                                    placeholder="Contact Email (Optional)" 
                                    value={formData.contactEmail} 
                                    onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                                />
                                <textarea 
                                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded p-3 text-sm resize-none"
                                    placeholder="Write a short bio..."
                                    rows="3"
                                    value={formData.bio}
                                    onChange={e => setFormData({...formData, bio: e.target.value})}
                                />
                                <div className="flex gap-2 pt-2">
                                    <Button onClick={handleSave} className="w-full justify-center">Save Profile</Button>
                                    <Button variant="ghost" onClick={() => setIsEditing(false)} className="w-full">Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {profile.bio && (
                                    <p className="text-sm text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                                        "{profile.bio}"
                                    </p>
                                )}
                                
                                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 text-left px-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={16} className="text-indigo-500" />
                                        <span>{profile.currentYear} Student</span>
                                    </div>
                                    {profile.contactEmail && (
                                        <div className="flex items-center gap-3">
                                            <Mail size={16} className="text-indigo-500" />
                                            <span>{profile.contactEmail}</span>
                                        </div>
                                    )}
                                    {profile.linkedin && (
                                        <div className="flex items-center gap-3">
                                            <Linkedin size={16} className="text-indigo-500" />
                                            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:underline text-indigo-600 dark:text-indigo-400 truncate">
                                                LinkedIn Profile
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <Button variant="secondary" className="w-full mt-4" onClick={() => setIsEditing(true)}>
                                    Edit Profile
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>

                {/* RIGHT COLUMN: Contributions */}
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                        <Award className="text-amber-500" /> My Contributions
                    </h3>

                    <div className="space-y-4">
                        {stats.uploads.length === 0 ? (
                            <div className="text-center p-12 bg-slate-100 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800">
                                <p className="text-slate-500 mb-4">You haven't contributed any notes yet.</p>
                                <Button onClick={onBack}>Go Upload Something!</Button>
                            </div>
                        ) : (
                            stats.uploads.map((note) => (
                                <div key={note._id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${note.fileType === 'pdf' ? 'bg-rose-100 text-rose-500 dark:bg-rose-900/20' : 'bg-blue-100 text-blue-500 dark:bg-blue-900/20'}`}>
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{note.title}</h4>
                                            <p className="text-xs text-slate-500">
                                                {note.subject} • {note.semester}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
                                            <ThumbsUp size={12} />
                                            {note.likes || 0}
                                        </div>
                                        <a 
                                            href={note.fileUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-medium"
                                        >
                                            View
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};