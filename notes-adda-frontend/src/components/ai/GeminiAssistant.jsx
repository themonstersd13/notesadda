import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export const GeminiAssistant = ({ onClose, context }) => {
  const [query, setQuery] = useState("");
  // Initial greeting is context-aware if possible
  const getGreeting = () => {
      if (context && context.subject) {
          return `Hi! I see you're studying ${context.subject}. Ask me to explain a concept, find formulas, or summarize this subject!`;
      }
      return "Hi! I'm your engineering study assistant. Ask me to summarize a topic, explain a concept, or find resources!";
  };

  const [messages, setMessages] = useState([
    { role: 'ai', text: getGreeting() }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userText = query;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setQuery("");
    setLoading(true);

    // --- CONSTRUCT CONTEXTUAL PROMPT ---
    let finalPrompt = userText;
    
    // If we have context (Branch/Subject), inject it silently into the query sent to AI
    if (context) {
        let contextString = "Context: Student";
        if (context.branch) contextString += ` in ${context.branch} Engineering`;
        if (context.semester) contextString += `, ${context.semester}`;
        if (context.subject) contextString += `, currently studying "${context.subject}"`;
        contextString += ".";
        
        // This effectively tells Gemini: "Student is in CSE Sem 5 studying DBMS. Question: What is 3NF?"
        finalPrompt = `${contextString}\n\nTask: Answer the following question concisely and relevant to the context above.\n\nQuestion: ${userText}`;
    }

    try {
        const res = await api.post('/ai/ask', { query: finalPrompt });
        setMessages(prev => [...prev, { role: 'ai', text: res.data.answer }]);
    } catch (err) {
        setMessages(prev => [...prev, { role: 'error', text: "I'm having trouble connecting to the AI brain right now." }]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-8 w-80 md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-emerald-500/30 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300 h-[500px]">
        
        {/* Header */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 border-b border-emerald-100 dark:border-white/5 flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-emerald-900 dark:text-emerald-100">Gemini Assistant</span>
            </div>
            <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <X size={16} />
            </button>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/90 scroll-smooth">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
                        ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 
                          msg.role === 'error' ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-none' :
                          'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-white/5'}`}>
                        {msg.role === 'error' && <AlertCircle size={14} className="inline mr-2 mb-0.5" />}
                        {msg.text}
                    </div>
                </div>
            ))}
            
            {loading && (
                <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-800/50 p-3 rounded-2xl rounded-bl-none border border-slate-200 dark:border-white/5 flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            )}
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900">
            <div className="flex gap-2 relative">
                <input 
                    className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-500 transition-all"
                    placeholder={context && context.subject ? `Ask about ${context.subject}...` : "Ask a question..."}
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