import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Sparkles, Award, RotateCcw } from 'lucide-react';
import { runAiTask } from '../lib/aiService';

export default function Task6QuizGenerator() {
  const [topic, setTopic] = useState('Operating Systems & Memory Management');
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setQuestions(null);
    setSelectedAnswers({});
    setShowResults(false);
    setCurrentQIndex(0);

    const prompt = `Generate 5 multiple choice questions (MCQs) for students on the topic: "${topic}".
Return ONLY a valid JSON array of objects with keys:
- id (number)
- question (string)
- options (array of 4 strings)
- answerIndex (number 0-3 for correct option)
- explanation (string)`;

    try {
      const data = await runAiTask('quiz', prompt, { topic }, 'You generate multiple choice quiz questions strictly in JSON array format.', true);
      if (Array.isArray(data)) {
        setQuestions(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (optIndex) => {
    if (selectedAnswers[currentQIndex] !== undefined) return;
    setSelectedAnswers({ ...selectedAnswers, [currentQIndex]: optIndex });
  };

  const calculateScore = () => {
    if (!questions) return 0;
    return questions.reduce((score, q, idx) => {
      return selectedAnswers[idx] === q.answerIndex ? score + 1 : score;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-indigo-600" /> Task 6: AI Quiz / MCQ Generator
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Enter a topic or study text to auto-generate multiple-choice questions with interactive instant evaluation.
        </p>
      </div>

      {/* Input */}
      <form onSubmit={handleGenerate} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter Topic for Quiz (e.g. Organic Chemistry / Python Data Types)"
          required
          className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
        >
          {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          <span>{loading ? 'Generating MCQs...' : 'Generate AI Quiz'}</span>
        </button>
      </form>

      {/* Quiz Engine View */}
      {questions && questions.length > 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          {!showResults ? (
            <>
              {/* Progress */}
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-slate-500">
                  Question {currentQIndex + 1} of {questions.length}
                </span>
                <span className="text-xs text-indigo-600 font-mono font-bold bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                  Score: {calculateScore()} / {questions.length}
                </span>
              </div>

              {/* Question */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {questions[currentQIndex].question}
                </h3>

                <div className="space-y-2.5">
                  {questions[currentQIndex].options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[currentQIndex] === oIdx;
                    const isAnswered = selectedAnswers[currentQIndex] !== undefined;
                    const isCorrect = oIdx === questions[currentQIndex].answerIndex;

                    let btnClass = 'bg-white border-slate-200 text-slate-800 hover:border-indigo-400 hover:bg-slate-50';
                    if (isAnswered) {
                      if (isCorrect) btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                      else if (isSelected) btnClass = 'bg-rose-50 border-rose-400 text-rose-900 font-bold';
                      else btnClass = 'bg-white border-slate-200 text-slate-400';
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleOptionSelect(oIdx)}
                        disabled={isAnswered}
                        className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between font-medium cursor-pointer ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                        {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {selectedAnswers[currentQIndex] !== undefined && (
                  <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-1 shadow-xs">
                    <p className="font-bold text-indigo-700">💡 Explanation:</p>
                    <p>{questions[currentQIndex].explanation}</p>
                  </div>
                )}
              </div>

              {/* Next/Finish Control */}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQIndex === 0}
                  className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-4 py-2 rounded-xl border border-slate-300 disabled:opacity-40"
                >
                  Previous
                </button>

                {currentQIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQIndex((prev) => prev + 1)}
                    disabled={selectedAnswers[currentQIndex] === undefined}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 disabled:opacity-40"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={() => setShowResults(true)}
                    disabled={selectedAnswers[currentQIndex] === undefined}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 disabled:opacity-40"
                  >
                    View Quiz Results
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Results Screen */
            <div className="text-center py-8 space-y-4">
              <div className="inline-flex p-4 bg-indigo-100 rounded-full text-indigo-600 border border-indigo-200">
                <Award className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">Quiz Completed!</h3>
              <p className="text-slate-600 text-sm">
                You scored <strong className="text-emerald-600 text-xl font-bold">{calculateScore()}</strong> out of <strong className="text-slate-900 text-xl font-bold">{questions.length}</strong> questions correctly!
              </p>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => { setShowResults(false); setCurrentQIndex(0); setSelectedAnswers({}); }}
                  className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-300 flex items-center gap-1.5 shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" /> Retake Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl h-72 flex flex-col items-center justify-center text-slate-400 text-center p-6 shadow-xs">
          <HelpCircle className="w-12 h-12 mb-2 text-slate-300" />
          <p className="text-sm font-semibold text-slate-600">No active quiz session.</p>
          <p className="text-xs text-slate-400">Enter a topic and click "Generate AI Quiz".</p>
        </div>
      )}
    </div>
  );
}
