import React, { useState, useEffect } from 'react';
import { Key, Sparkles, CheckCircle, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../lib/aiService';

export default function Header() {
  const [apiKey, setApiKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const key = getStoredApiKey();
    setApiKey(key);
    setHasKey(!!key);
  }, []);

  const handleSave = () => {
    setStoredApiKey(apiKey);
    setHasKey(!!apiKey);
    setIsOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-40 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl shadow-md shadow-indigo-200 text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              SmartStudy AI
            </h1>
            <p className="text-xs text-slate-500 font-medium">10 AI Micro Apps for Classroom & Revision Tasks</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium border ${
            hasKey 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {hasKey ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
            <span>{hasKey ? 'Live Gemini API Connected' : 'Smart Demo Mode Active'}</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-xs px-3.5 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium transition-colors shadow-xs"
          >
            <Key className="w-3.5 h-3.5 text-indigo-600" />
            <span>{hasKey ? 'API Key Configured' : 'Set Gemini API Key'}</span>
          </button>
        </div>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-600" /> API Key Setup
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your free **Google Gemini API Key** to enable live AI responses.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-700 font-semibold">Gemini API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 font-mono"
              />
            </div>

            <div className="bg-indigo-50/60 rounded-xl p-3 text-xs text-indigo-950 space-y-1 border border-indigo-100">
              <div className="flex items-center gap-1.5 font-semibold text-indigo-700">
                <Info className="w-4 h-4" /> Get Free Key:
              </div>
              <p>You can generate a free API key from Google AI Studio:</p>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 hover:underline pt-0.5 font-semibold"
              >
                aistudio.google.com <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => { setApiKey(''); setStoredApiKey(''); setHasKey(false); setIsOpen(false); }}
                className="px-4 py-2 text-xs font-medium rounded-lg text-slate-600 hover:bg-slate-100"
              >
                Clear & Use Demo Mode
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
