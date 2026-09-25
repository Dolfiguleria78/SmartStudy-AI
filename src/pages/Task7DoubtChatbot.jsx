import React, { useState } from 'react';
import { MessageSquare, Send, Trash2, Bot, User, Sparkles } from 'lucide-react';
import { runAiTask } from '../lib/aiService';

export default function Task7DoubtChatbot() {
  const [subject, setSubject] = useState('Computer Science');
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am your AI Subject Doubt Tutor. Ask me any concept, formula, or problem in Computer Science, Physics, Chemistry, or Math!'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userMsg = inputQuery;
    setInputQuery('');

    const newHistory = [...messages, { role: 'user', content: userMsg }];
    setMessages(newHistory);
    setLoading(true);

    const systemPrompt = `You are an encouraging and clear academic tutor for the subject "${subject}". Explain concepts simply, step-by-step with real-world examples and bullet points.`;
    const prompt = `Student Question: ${userMsg}\n\nPrevious conversation history:\n${newHistory.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}`;

    try {
      const reply = await runAiTask('chat', prompt, { query: userMsg, subject }, systemPrompt);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Chat history cleared. I am ready to answer your next question in ${subject}!`
      }
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-indigo-600" /> Task 7: AI Subject Doubt-Solving Chatbot
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Select a subject, type your doubt, and get step-by-step explanations with example context.
        </p>
      </div>

      {/* Top Controls */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-700">Subject Tutor Mode:</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-white border border-slate-300 text-xs text-slate-900 font-semibold rounded-lg px-3 py-1.5 focus:border-indigo-600 focus:outline-none"
          >
            <option value="Computer Science">Computer Science & Programming</option>
            <option value="Physics">Physics & Numerical Mechanics</option>
            <option value="Mathematics">Mathematics & Calculus</option>
            <option value="Chemistry">Chemistry & Reactions</option>
            <option value="Biology">Biology & Life Sciences</option>
          </select>
        </div>

        <button
          onClick={handleClearChat}
          className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 flex items-center gap-1.5 self-end sm:self-auto shadow-xs"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Clear Chat History
        </button>
      </div>

      {/* Chat UI Container */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Message Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`p-2 rounded-xl text-white shrink-0 ${
                m.role === 'user' ? 'bg-indigo-600' : 'bg-slate-200 text-slate-700'
              }`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-xs font-medium'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-line shadow-xs font-medium'
              }`}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-200 text-indigo-600 rounded-xl">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-600 flex items-center gap-2 font-medium">
                <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" /> Tutor is formulating explanation...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Ask any question about ${subject}...`}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-5 rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
