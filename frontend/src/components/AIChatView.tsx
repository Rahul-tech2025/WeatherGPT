'use strict';
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { sendAIChatMessage } from '../services/api';
import { CitySearchResult } from '../types/weather';

interface AIChatViewProps {
  currentCity: CitySearchResult;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  provider?: string;
}

export default function AIChatView({ currentCity }: AIChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `👋 Greetings! I am **WeatherGPT AI**, an intelligent conversational meteorological system powered by **Google Gemini** and verified by **Custom Scikit-Learn Machine Learning Models**.\n\nI can analyze upcoming atmospheric trends in **${currentCity.name}**, recommend outdoor precautions, or break down our temperature and rainfall model evaluation metrics!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      provider: 'Grounded Dual AI Engine'
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsLoading(true);

    try {
      const response = await sendAIChatMessage(
        userMsg.text,
        currentCity.name,
        currentCity.latitude,
        currentCity.longitude
      );

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: response.provider
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: '⚠️ I encountered a temporary latency while querying the meteorological reasoning pipeline. Please ensure the WeatherGPT backend server (Port 5000) is running.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'Local Failover'
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    `Will it rain in ${currentCity.name} tomorrow?`,
    `What precautions should I take for outdoor work today?`,
    `Explain the Linear Regression temperature formula`,
    `Should I carry an umbrella today?`
  ];

  return (
    <div className="w-full glass-card rounded-[2.5rem] border border-white/[0.08] backdrop-blur-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex flex-col h-[740px] overflow-hidden relative">
      
      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-1/3 w-96 h-28 bg-gradient-to-r from-blue-600/15 via-cyan-500/15 to-transparent blur-3xl pointer-events-none" />

      {/* Chat Header */}
      <div className="p-5 sm:p-6 border-b border-white/[0.08] bg-slate-950/60 backdrop-blur-2xl flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-xl shadow-lg shadow-blue-500/30 ring-1 ring-white/30">
            🤖
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-white text-base sm:text-lg tracking-tight">WeatherGPT Intelligent Assistant</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Gemini 1.5/2.0 Grounded
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Real-time Open-Meteo telemetry &amp; Scikit-learn ML validation
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 bg-white/[0.04] px-3.5 py-1.5 rounded-xl border border-white/[0.06]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-white font-semibold">{currentCity.name}, {currentCity.countryCode}</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 scrollbar-thin">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-sm shadow-md ${
                isUser
                  ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white ring-1 ring-white/20'
                  : 'bg-slate-900 border border-white/10 text-cyan-400 ring-1 ring-cyan-500/20'
              }`}>
                {isUser ? '👤' : '✨'}
              </div>

              {/* Message Bubble Container */}
              <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`rounded-2xl p-4.5 text-sm leading-relaxed shadow-lg ${
                    isUser
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-tr-sm ring-1 ring-white/20'
                      : 'bg-slate-900/80 border border-white/[0.08] text-slate-200 rounded-tl-sm backdrop-blur-xl shadow-inner'
                  }`}
                >
                  <div className="whitespace-pre-line font-normal">{m.text}</div>
                </div>

                {/* Metadata Stamp */}
                <div className="flex items-center gap-2 mt-1.5 px-1">
                  {m.provider && (
                    <span className="text-[10px] font-mono font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/40">
                      {m.provider}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500 font-medium">{m.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Reasoning Pulse */}
        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-cyan-400 text-sm">
              ✨
            </div>
            <div className="flex items-center space-x-2 px-4 py-3 bg-slate-900/80 border border-white/[0.08] rounded-2xl rounded-tl-sm text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-medium">Reasoning over atmospheric telemetry...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="px-5 py-2.5 bg-slate-950/40 border-t border-white/[0.04] flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap pl-1">Quick Prompts:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs border border-white/[0.08] hover:border-cyan-400/40 transition-all font-medium"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <div className="p-4 bg-slate-950/80 border-t border-white/[0.08] backdrop-blur-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask WeatherGPT regarding ${currentCity.name}'s forecast, clothing tips, or ML metrics...`}
            className="flex-1 bg-slate-900/70 border border-white/[0.08] focus:border-cyan-500/50 rounded-2xl px-4.5 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/15 transition-all font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 flex items-center space-x-2"
          >
            <span>Send</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>

    </div>
  );
}
