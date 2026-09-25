import React, { useState } from 'react';
import { Layers, RotateCcw, Shuffle, ChevronLeft, ChevronRight, Sparkles, FlipHorizontal } from 'lucide-react';
import { runAiTask } from '../lib/aiService';

export default function Task8Flashcards() {
  const [topic, setTopic] = useState('Web Development & API Fundamentals');
  const [cards, setCards] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setCards(null);
    setCurrentIndex(0);
    setIsFlipped(false);

    const prompt = `Generate 8-10 revision flashcards on topic: "${topic}".
Return ONLY a valid JSON array of objects with keys:
- id (number)
- question (string)
- answer (string)`;

    try {
      const data = await runAiTask('flashcards', prompt, { topic }, 'You generate question/answer revision flashcards strictly in JSON array format.', true);
      if (Array.isArray(data)) {
        setCards(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShuffle = () => {
    if (!cards) return;
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-7 h-7 text-indigo-600" /> Task 8: AI Flashcard Generator for Revision
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Paste study text or topic to generate interactive 3D flippable revision cards.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleGenerate} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter Revision Topic (e.g. World History / Biology Terms)"
          required
          className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
        >
          {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          <span>{loading ? 'Creating Deck...' : 'Generate Flashcards'}</span>
        </button>
      </form>

      {/* Card Carousel & 3D Flip Deck */}
      {cards && cards.length > 0 ? (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>Card {currentIndex + 1} of {cards.length}</span>
            <button
              onClick={handleShuffle}
              className="bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 flex items-center gap-1.5 shadow-xs"
            >
              <Shuffle className="w-3.5 h-3.5" /> Shuffle Deck
            </button>
          </div>

          {/* 3D Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer h-72 w-full relative perspective-1000 group"
          >
            <div
              className={`w-full h-full duration-500 transform-style-3d transition-transform ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front Side */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white border-2 border-indigo-500 rounded-3xl p-8 shadow-xl backface-hidden flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs text-indigo-100 font-bold uppercase tracking-wider">
                  <span>Question (Front)</span>
                  <span className="flex items-center gap-1"><FlipHorizontal className="w-3.5 h-3.5" /> Click to Flip</span>
                </div>
                <div className="text-xl font-bold text-white text-center px-4 leading-relaxed">
                  {cards[currentIndex].question}
                </div>
                <div className="text-center text-xs text-indigo-100 font-medium">Tap card to reveal answer 🔄</div>
              </div>

              {/* Back Side */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white border-2 border-purple-500 rounded-3xl p-8 shadow-xl backface-hidden rotate-y-180 flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs text-purple-100 font-bold uppercase tracking-wider">
                  <span>Answer (Back)</span>
                  <span className="flex items-center gap-1"><FlipHorizontal className="w-3.5 h-3.5" /> Click to Flip</span>
                </div>
                <div className="text-lg font-semibold text-white text-center px-4 leading-relaxed">
                  {cards[currentIndex].answer}
                </div>
                <div className="text-center text-xs text-purple-100 font-medium">Tap card to flip back 🔄</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => { setIsFlipped(false); setCurrentIndex((prev) => Math.max(0, prev - 1)); }}
              disabled={currentIndex === 0}
              className="bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 px-4 py-2 rounded-xl border border-slate-300 flex items-center gap-1.5 text-xs font-semibold shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl border border-indigo-200 text-xs font-bold flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> Flip Card
            </button>

            <button
              onClick={() => { setIsFlipped(false); setCurrentIndex((prev) => Math.min(cards.length - 1, prev + 1)); }}
              disabled={currentIndex === cards.length - 1}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl h-72 flex flex-col items-center justify-center text-slate-400 text-center p-6 shadow-xs">
          <Layers className="w-12 h-12 mb-2 text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">No flashcards deck generated yet.</p>
          <p className="text-xs text-slate-400">Enter a topic above and click "Generate Flashcards".</p>
        </div>
      )}
    </div>
  );
}
