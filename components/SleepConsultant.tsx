import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SLEEP_CONSULTANT_PROMPT } from '../constants';
import { ChatMessage } from '../types';

const SleepConsultant: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your MMM Sleep Expert. Tell me, how did you sleep last night? Any discomfort or specific needs?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Check for API key before initializing GoogleGenAI
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  useEffect(() => {
    if (!apiKey) {
      setApiError("API Key is not configured. Please set VITE_GEMINI_API_KEY in .env.local");
    } else {
      setApiError(null);
    }
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, apiKey]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    if (!ai) {
      setApiError("API Key is not configured. Please set VITE_GEMINI_API_KEY in .env.local");
      return;
    }

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages, { role: 'user', text: userMsg }].map(m => ({
          parts: [{ text: m.text }],
          role: m.role
        })),
        config: {
          systemInstruction: SLEEP_CONSULTANT_PROMPT,
          temperature: 0.7,
        }
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm sorry, I'm having trouble connecting right now." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to AI expert." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[400px] bg-white shadow-2xl z-[100] border-l border-slate-100 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" /><path d="M12 2.252A8.001 8.001 0 0117.748 8H12V2.252z" /></svg>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest">AI Consultant</h3>
            <p className="text-[10px] opacity-70">Powered by Gemini Pro</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:rotate-90 transition-transform">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {apiError && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center">
            {apiError}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
              m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 p-4 rounded-2xl flex gap-1 items-center">
              <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce delay-75"></div>
              <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="e.g. I have severe lower back pain..."
            className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={isTyping || !ai}
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SleepConsultant;