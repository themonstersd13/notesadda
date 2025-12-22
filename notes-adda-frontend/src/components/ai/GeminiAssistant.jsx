import React, { useState } from 'react';
import { X, Sparkles, ChevronRight } from 'lucide-react';

export const GeminiAssistant = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm your study assistant. Need a summary of a topic or help finding a specific PDF?" }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!query.trim()) return;
    const newMessages = [...messages, { role: 'user', text: query }];
    setMessages(newMessages);
    setQuery("");
    setLoading(true);

    setTimeout(() => {
        setMessages(prev => [...prev, { 
            role: 'ai', 
            text: `(AI Mock Response): This feature requires backend integration. I would typically summarize "${query}" here.` 
        }]);
        setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-24 right-8 w-80 md:w-96 bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-900/20 overflow-hidden z-50 flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300">
        <div className="bg-emerald-900/20 p-4 border-b border-white/5 flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-400" />
                <span className="font-bold text-emerald-100">Gemini Assistant</span>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white"><X size={16} /></button>
        </div>
        <div className="h-80 overflow-y-auto p-4 space-y-3 bg-slate-900/90">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none'}`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {loading && <div className="text-xs text-slate-500 animate-pulse">Gemini is thinking...</div>}
        </div>
        <div className="p-3 border-t border-white/5 bg-slate-900">
            <div className="flex gap-2">
                <input 
                    className="flex-1 bg-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500"
                    placeholder="Ask about a topic..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg transition-colors">
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    </div>
  );
};
