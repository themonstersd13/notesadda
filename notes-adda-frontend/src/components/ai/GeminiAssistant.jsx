import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export const GeminiAssistant = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm your engineering study assistant. Ask me to summarize a topic, explain a concept, or find resources!" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;
    
    // 1. Add User Message
    const userText = query;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setQuery("");
    setLoading(true);

    try {
        // 2. Call Backend API
        // Ensure your backend server is running on port 5000 and has GEMINI_API_KEY in .env
        const res = await api.post('/ai/ask', { query: userText });
        
        // 3. Add AI Response
        setMessages(prev => [...prev, { role: 'ai', text: res.data.answer }]);
    } catch (err) {
        console.error(err);
        setMessages(prev => [...prev, { 
            role: 'error', 
            text: "I'm having trouble connecting to the AI brain right now. Please check your internet or API key." 
        }]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-8 w-80 md:w-96 bg-white dark:bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-lg overflow-hidden z-50 flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300 flex flex-col h-[500px]">
        
        {/* Header */}
        <div className="bg-emerald-900/20 p-4 border-b border-white/5 flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-400" />
                <span className="font-bold text-emerald-100">Gemini Assistant</span>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X size={16} />
            </button>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/90 scroll-smooth">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-md
                        ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 
                          msg.role === 'error' ? 'bg-red-500/20 text-red-200 border border-red-500/30 rounded-bl-none' :
                          'bg-slate-800 text-slate-200 rounded-bl-none border border-white/5'}`}>
                        
                        {msg.role === 'error' && <AlertCircle size={14} className="inline mr-2 mb-0.5" />}
                        {msg.text}
                    </div>
                </div>
            ))}
            
            {loading && (
                <div className="flex justify-start">
                    <div className="bg-slate-800/50 p-3 rounded-2xl rounded-bl-none border border-white/5 flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            )}
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-white/5 bg-slate-900">
            <div className="flex gap-2 relative">
                <input 
                    className="flex-1 bg-slate-800 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500 transition-all"
                    placeholder="Ask about your syllabus..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
                    disabled={loading}
                />
                <button 
                    onClick={handleSend} 
                    disabled={loading || !query.trim()}
                    className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white rounded-lg transition-all flex items-center justify-center"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    </div>
  );
};