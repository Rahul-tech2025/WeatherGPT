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
      text: `👋 Hello! I am **WeatherGPT AI**, your intelligent meteorological assistant powered by Google Gemini and custom Scikit-learn Machine Learning models.\n\nAsk me about tomorrow's rain forecast, what to wear in **${currentCity.name}**, or our ML model validation metrics!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      provider: 'WeatherGPT Grounded Engine'
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
        text: '⚠️ Sorry, I encountered an issue retrieving the live weather reasoning. Please check that the WeatherGPT backend server is active.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const samplePrompts = [
    `Will it rain in ${currentCity.name} tomorrow?`,
    `What should I wear in ${currentCity.name} today?`,
    `Explain the Scikit-learn ML predictions for tomorrow`,
    `Should I carry an umbrella today?`
  ];

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-2xl flex flex-col h-[750px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-5 md:p-6 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-xl shadow-lg shadow-blue-500/20">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base md:text-lg">WeatherGPT AI Assistant</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Grounded Dual AI
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Grounded on real-time Open-Meteo telemetry & custom Scikit-learn ML models
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
          <span>Active Context:</span>
          <span className="text-white font-medium">{currentCity.name}, {currentCity.countryCode}</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-md'
                  : 'bg-slate-800/80 border border-slate-700/70 text-slate-200 rounded-tl-sm shadow-sm'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
            </div>

            <div className="flex items-center gap-2 mt-1 px-1">
              {m.provider && (
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/40 px-1.5 py-0.5 rounded border border-indigo-800/30">
                  {m.provider}
                </span>
              )}
              <span className="text-[10px] text-slate-500">{m.timestamp}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-4 max-w-[200px] bg-slate-800/60 border border-slate-700 rounded-2xl rounded-tl-sm text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            <span>Reasoning over weather data...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-5 py-2 bg-slate-900/40 border-t border-slate-800/50 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-slate-500 text-[11px] whitespace-nowrap">Suggested:</span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] border border-slate-700 hover:border-indigo-400/50 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
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
            placeholder={`Ask WeatherGPT about weather or ML in ${currentCity.name}...`}
            className="flex-1 bg-slate-800/90 border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 flex items-center gap-1.5"
          >
            <span>Send</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
