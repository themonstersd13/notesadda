import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '../../services/api';

export const AuthModal = ({ onClose, onLogin }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (isRegister) {
        try {
            const res = await api.post('/auth/register', { username, password, fullName });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            onLogin({ ...res.data.user, loggedIn: true });
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    } else {
        try {
            const res = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            onLogin({ ...res.data.user, loggedIn: true });
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <Card className="w-full max-w-md bg-slate-900 shadow-2xl border-indigo-500/30 relative">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                         <div className="animate-in slide-in-from-top-2">
                            <label className="text-sm text-slate-400 mb-1 block">Full Name</label>
                            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />
                        </div>
                    )}
                    
                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">Username / Email</label>
                        <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="student@college.edu" />
                    </div>
                    
                    <div>
                        <label className="text-sm text-slate-400 mb-1 block">Password</label>
                        <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
                    </div>

                    {isRegister && (
                        <div className="animate-in slide-in-from-top-2">
                            <label className="text-sm text-slate-400 mb-1 block">Confirm Password</label>
                            <Input value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} type="password" placeholder="••••••••" />
                        </div>
                    )}

                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    
                    <div className="pt-2">
                        <Button className="w-full justify-center" onClick={handleSubmit}>
                            {isRegister ? 'Register' : 'Login'}
                        </Button>
                    </div>
                    
                    <div className="text-center mt-4 text-sm text-slate-400">
                        {isRegister ? "Already have an account? " : "Don't have an account? "}
                        <button 
                            type="button"
                            onClick={() => { setIsRegister(!isRegister); setError(''); }}
                            className="text-indigo-400 hover:text-indigo-300 font-medium underline"
                        >
                            {isRegister ? "Login" : "Register"}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
