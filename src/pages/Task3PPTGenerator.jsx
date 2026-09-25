import React, { useState } from 'react';
import { Presentation, ChevronLeft, ChevronRight, Sparkles, Download, Layers } from 'lucide-react';
import { runAiTask } from '../lib/aiService';
import pptxgen from 'pptxgenjs';

export default function Task3PPTGenerator() {
  const [topic, setTopic] = useState('Machine Learning in Healthcare');
  const [slides, setSlides] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);

    const prompt = `Generate a 5-slide presentation on the topic: "${topic}".
Return ONLY a valid JSON array of objects with the following keys for each slide:
- slideNumber (number)
- title (string)
- bullets (array of 3-4 strings)
- speakerNotes (string)`;

    try {
      const data = await runAiTask('presentation', prompt, { topic }, 'You generate presentation slides strictly in valid JSON format.', true);
      if (Array.isArray(data)) {
        setSlides(data);
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportToPptx = () => {
    if (!slides) return;
    const ppt = new pptxgen();
    ppt.layout = 'LAYOUT_16x9';

    slides.forEach((s) => {
      const slide = ppt.addSlide();
      slide.background = { color: 'F8FAFC' };
      
      // Title
      slide.addText(s.title, {
        x: 0.8,
        y: 0.8,
        w: '80%',
        fontSize: 28,
        bold: true,
        color: '4F46E5'
      });

      // Bullets
      const bulletItems = s.bullets.map((b) => ({ text: b, options: { fontSize: 18, color: '1E293B', bullet: true, spaceBefore: 12 } }));
      slide.addText(bulletItems, {
        x: 0.8,
        y: 2.0,
        w: '80%',
        h: 4.5
      });
    });

    ppt.writeFile({ fileName: `${topic.replace(/\s+/g, '_')}_Presentation.pptx` });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Presentation className="w-7 h-7 text-indigo-600" /> Task 3: AI Presentation (PPT) Generator
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Enter any topic to generate structured presentation slides in JSON and navigate them interactively or download as PPTX.
        </p>
      </div>

      {/* Input */}
      <form onSubmit={handleGenerate} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter Presentation Topic (e.g. Renewable Energy Solutions)"
          required
          className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
        >
          {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          <span>{loading ? 'Building Slides...' : 'Generate PPT Slides'}</span>
        </button>
      </form>

      {/* Slides Deck View */}
      {slides && slides.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" /> Slide {currentIndex + 1} of {slides.length}
            </span>
            <button
              onClick={exportToPptx}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-2 shadow-xs"
            >
              <Download className="w-4 h-4" /> Download .PPTX
            </button>
          </div>

          {/* Slide Deck Canvas */}
          <div className="bg-gradient-to-br from-white via-indigo-50/30 to-slate-50 border-2 border-indigo-200 rounded-3xl p-8 sm:p-12 shadow-sm min-h-[380px] flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-6 relative z-10">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-indigo-900">
                {slides[currentIndex].title}
              </h3>

              <ul className="space-y-3">
                {slides[currentIndex].bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-800 text-base sm:text-lg font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {slides[currentIndex].speakerNotes && (
              <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-500 italic">
                💬 <strong className="text-slate-700">Speaker Notes:</strong> {slides[currentIndex].speakerNotes}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 px-4 py-2 rounded-xl border border-slate-300 flex items-center gap-1.5 text-sm font-semibold"
            >
              <ChevronLeft className="w-5 h-5" /> Previous Slide
            </button>

            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentIndex === i ? 'bg-indigo-600 w-6' : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentIndex((prev) => Math.min(slides.length - 1, prev + 1))}
              disabled={currentIndex === slides.length - 1}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white px-4 py-2 rounded-xl flex items-center gap-1.5 text-sm font-semibold shadow-xs"
            >
              Next Slide <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl h-72 flex flex-col items-center justify-center text-slate-400 text-center p-6 shadow-xs">
          <Presentation className="w-12 h-12 mb-2 text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">Ready to create slide presentation.</p>
          <p className="text-xs text-slate-400">Enter a topic above and click "Generate PPT Slides".</p>
        </div>
      )}
    </div>
  );
}
