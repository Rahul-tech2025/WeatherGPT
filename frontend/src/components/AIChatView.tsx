'use client';

import React, { useState, useRef, useEffect } from 'react';
import { sendAIChatMessage } from '../services/api';
import { CitySearchResult } from '../types/weather';
import FluidAIWaveform from './FluidAIWaveform';

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
      text: `Greetings. I am **WeatherGPT Intelligence**, powered by **Google Gemini** and verified by **Custom Scikit-Learn Machine Learning Models**.\n\nI can analyze upcoming atmospheric trends in **${currentCity.name}**, recommend outdoor precautions, or break down our temperature and rainfall model evaluation metrics.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      provider: 'Dual AI Engine',
    },
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
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
        provider: response.provider,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'Temporary latency encountered while querying the meteorological reasoning pipeline. Please verify the WeatherGPT backend server (Port 5000) is running.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: 'Local Failover',
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
    `Should I carry an umbrella today?`,
  ];

  return (
    <div className="w-full glass-card rounded-[2.5rem] border border-white/[0.10] backdrop-blur-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col h-[740px] overflow-hidden relative bg-[#080c14]/90">
      {/* Chat Header */}
      <div className="p-5 sm:p-6 border-b border-white/[0.08] bg-[#030508]/80 backdrop-blur-2xl flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/20 flex items-center justify-center text-white shadow-lg">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="9" y="9" width="6" height="6" />
              <line x1="9" y1="1" x2="9" y2="4" />
              <line x1="15" y1="1" x2="15" y2="4" />
              <line x1="9" y1="20" x2="9" y2="23" />
              <line x1="15" y1="20" x2="15" y2="23" />
              <line x1="20" y1="9" x2="23" y2="9" />
              <line x1="20" y1="14" x2="23" y2="14" />
              <line x1="1" y1="9" x2="4" y2="9" />
              <line x1="1" y1="14" x2="4" y2="14" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-white text-base sm:text-lg tracking-tight">WeatherGPT AI Assistant</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-white border border-white/20">
                Gemini Grounded
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Real-time telemetry synthesis &amp; Scikit-learn validation
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-300 bg-white/[0.04] px-3.5 py-1.5 rounded-xl border border-white/[0.08]">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-white font-semibold font-mono">{currentCity.name}, {currentCity.countryCode}</span>
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
              {/* Avatar (Monochrome SVGs) */}
              <div
                className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-sm shadow-md ${
                  isUser
                    ? 'bg-white text-black font-bold ring-1 ring-white/50'
                    : 'bg-[#0d121d] border border-white/15 text-white'
                }`}
              >
                {isUser ? (
                  <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
                  </svg>
                )}
              </div>

              {/* Message Bubble Container */}
              <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`rounded-2xl p-4.5 text-sm leading-relaxed shadow-lg ${
                    isUser
                      ? 'bg-white text-black font-medium rounded-tr-sm ring-1 ring-white/30'
                      : 'bg-[#0d121d] border border-white/[0.10] text-slate-200 rounded-tl-sm backdrop-blur-xl shadow-inner'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>
                </div>

                {/* Metadata Stamp */}
                <div className="flex items-center gap-2 mt-1.5 px-1">
                  {m.provider && (
                    <span className="text-[10px] font-mono font-semibold text-slate-300 bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/10">
                      {m.provider}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500 font-medium font-mono">{m.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Reasoning Pulse with Liquid Waveform */}
        {isLoading && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-white text-sm shadow-md">
                <svg className="w-4 h-4 text-white animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                  <line x1="2" y1="12" x2="6" y2="12" />
                  <line x1="18" y1="12" x2="22" y2="12" />
                </svg>
              </div>
              <div className="flex items-center space-x-2 px-4 py-3 bg-[#0d121d] border border-white/[0.08] rounded-2xl rounded-tl-sm text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span className="font-medium">Synthesizing telemetry with Gemini...</span>
              </div>
            </div>
            <div className="w-full max-w-sm pl-11">
              <FluidAIWaveform isActive={true} className="h-10" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="px-5 py-2.5 bg-black/40 border-t border-white/[0.04] flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap pl-1">Prompts:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs border border-white/[0.08] hover:border-white/30 transition-all font-medium"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <div className="p-4 bg-[#030508]/80 border-t border-white/[0.08] backdrop-blur-2xl">
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
            placeholder={`Ask regarding ${currentCity.name}'s forecast, clothing tips, or Scikit ML metrics...`}
            className="flex-1 bg-white/[0.04] border border-white/[0.08] focus:border-white/30 rounded-2xl px-4.5 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-200 text-black font-extrabold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-white/10 flex items-center space-x-2"
          >
            <span>Send</span>
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
