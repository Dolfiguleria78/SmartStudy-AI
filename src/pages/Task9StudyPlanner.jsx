import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, BookOpen, RotateCcw } from 'lucide-react';
import { runAiTask } from '../lib/aiService';

export default function Task9StudyPlanner() {
  const [formData, setFormData] = useState({
    subjects: 'Mathematics, Physics, Computer Science',
    hoursPerDay: '4',
    examDate: '2026-10-15'
  });

  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);

  const subjectColors = {
    Mathematics: 'bg-blue-50 text-blue-900 border-blue-200',
    Physics: 'bg-purple-50 text-purple-900 border-purple-200',
    'Computer Science': 'bg-emerald-50 text-emerald-900 border-emerald-200',
    CS: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    Chemistry: 'bg-rose-50 text-rose-900 border-rose-200',
    Default: 'bg-amber-50 text-amber-900 border-amber-200'
  };

  const getBadgeStyle = (subj) => {
    return subjectColors[subj] || subjectColors.Default;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const prompt = `Generate a day-wise study timetable for a student with details:
Subjects: ${formData.subjects}
Study Hours per day: ${formData.hoursPerDay} hours
Exam Target Date: ${formData.examDate}

Return ONLY a valid JSON array of objects representing days of the week:
[
  {
    "day": "Monday",
    "slots": [
      { "time": "09:00 - 10:30 AM", "subject": "Mathematics", "topic": "Calculus Derivatives" },
      { "time": "02:00 - 03:30 PM", "subject": "Physics", "topic": "Electromagnetism" }
    ]
  }
]`;

    try {
      const subjectArray = formData.subjects.split(',').map((s) => s.trim());
      const data = await runAiTask('timetable', prompt, { subjects: subjectArray, hoursPerDay: formData.hoursPerDay }, 'You generate structured student timetable schedules strictly in JSON format.', true);
      if (Array.isArray(data)) {
        setSchedule(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-7 h-7 text-indigo-600" /> Task 9: AI Study Planner / Timetable Generator
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Input your subjects and daily available hours to let AI build a balanced weekly study schedule grid.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleGenerate} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-200 pb-2">Planner Parameters</h3>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 font-medium flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Subjects (comma-separated)</label>
              <input
                type="text"
                value={formData.subjects}
                onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                required
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 font-medium flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-600" /> Available Study Hours / Day</label>
              <input
                type="number"
                min="1"
                max="12"
                value={formData.hoursPerDay}
                onChange={(e) => setFormData({ ...formData, hoursPerDay: e.target.value })}
                required
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 font-medium flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-indigo-600" /> Target Exam Date</label>
              <input
                type="date"
                value={formData.examDate}
                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                required
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all mt-4 cursor-pointer"
          >
            {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            <span>{loading ? 'Building Timetable...' : 'Generate AI Timetable'}</span>
          </button>
        </form>

        {/* Schedule Grid View */}
        <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-base font-bold text-slate-800">Day-Wise Study Timetable Grid</h3>
            {schedule && (
              <button
                onClick={handleGenerate}
                className="bg-white hover:bg-slate-100 text-xs text-slate-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-300 flex items-center gap-1 shadow-xs"
              >
                <RotateCcw className="w-3 h-3" /> Regenerate
              </button>
            )}
          </div>

          {schedule ? (
            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {schedule.map((dayItem, dIdx) => (
                <div key={dIdx} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
                  <h4 className="text-sm font-bold text-indigo-700 border-b border-slate-100 pb-1.5 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" /> {dayItem.day}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {dayItem.slots.map((slot, sIdx) => (
                      <div key={sIdx} className={`p-3 rounded-xl border ${getBadgeStyle(slot.subject)} space-y-1`}>
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span>{slot.subject}</span>
                          <span className="opacity-80 flex items-center gap-1 font-mono"><Clock className="w-3 h-3" /> {slot.time}</span>
                        </div>
                        <p className="text-xs text-slate-800 font-semibold">{slot.topic}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-72 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 text-center p-6">
              <Calendar className="w-12 h-12 mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No timetable generated yet.</p>
              <p className="text-xs text-slate-400">Fill subjects and click "Generate AI Timetable".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
