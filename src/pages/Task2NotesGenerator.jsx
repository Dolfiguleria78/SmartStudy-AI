import React, { useState } from 'react';
import { BookOpen, Copy, Download, Sparkles, Check } from 'lucide-react';
import { runAiTask } from '../lib/aiService';
import { marked } from 'marked';
import jsPDF from 'jspdf';

export default function Task2NotesGenerator() {
  const [inputText, setInputText] = useState(
    `Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy that, through cellular respiration, can later be released to fuel the organisms' activities. Some of this chemical energy is stored in carbohydrate molecules, such as sugars and starches, which are synthesized from carbon dioxide and water. Photosynthesis is largely responsible for producing and maintaining the oxygen content of the Earth's atmosphere, and supplies most of the energy necessary for life on Earth.`
  );
  const [loading, setLoading] = useState(false);
  const [notesMarkdown, setNotesMarkdown] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    const prompt = `Convert this raw study text into clean, structured bullet-point study notes with bold headings, bullet points, key terms, and summary takeaways:\n\n${inputText}`;

    try {
      const output = await runAiTask('notes', prompt, { text: inputText }, 'You are an elite academic note summarizer.');
      setNotesMarkdown(output);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(notesMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([notesMarkdown], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'AI_Study_Notes.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(notesMarkdown.replace(/[*#]/g, ''), 180);
    doc.text(lines, 10, 10);
    doc.save('AI_Study_Notes.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-indigo-600" /> Task 2: AI-Powered Notes Generator
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Paste any textbook topic or chapter paragraph and let AI convert it into concise markdown study notes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Raw Input */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-200 pb-2">Paste Topic / Raw Text</h3>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={12}
              placeholder="Paste raw textbook text here..."
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none mt-3 resize-none font-sans"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !inputText.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            <span>{loading ? 'Converting into Structured Notes...' : 'Generate AI Bullet Notes'}</span>
          </button>
        </div>

        {/* Output Notes */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-base font-bold text-slate-800">Structured Study Notes</h3>
              {notesMarkdown && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="bg-white hover:bg-slate-100 text-slate-700 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-slate-300 font-medium"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleDownloadTxt}
                    className="bg-white hover:bg-slate-100 text-slate-700 text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 border border-slate-300 font-medium"
                  >
                    <Download className="w-3.5 h-3.5" /> .TXT
                  </button>
                  <button
                    onClick={handleDownloadPdf}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" /> .PDF
                  </button>
                </div>
              )}
            </div>

            {notesMarkdown ? (
              <div
                className="bg-white border border-slate-200 p-5 rounded-xl text-slate-800 text-sm overflow-y-auto max-h-[460px] prose prose-indigo max-w-none mt-3 shadow-xs"
                dangerouslySetInnerHTML={{ __html: marked.parse(notesMarkdown) }}
              />
            ) : (
              <div className="h-72 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 p-6 text-center mt-3">
                <BookOpen className="w-12 h-12 mb-2 text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">No notes generated yet.</p>
                <p className="text-xs text-slate-400">Paste your topic text and click "Generate AI Bullet Notes".</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
