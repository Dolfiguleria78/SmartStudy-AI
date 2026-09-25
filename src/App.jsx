import React, { useState } from 'react';
import Header from './components/Header';

import Task1ResumeBuilder from './pages/Task1ResumeBuilder';
import Task2NotesGenerator from './pages/Task2NotesGenerator';
import Task3PPTGenerator from './pages/Task3PPTGenerator';
import Task4MindMap from './pages/Task4MindMap';
import Task5GoogleSheets from './pages/Task5GoogleSheets';
import Task6QuizGenerator from './pages/Task6QuizGenerator';
import Task7DoubtChatbot from './pages/Task7DoubtChatbot';
import Task8Flashcards from './pages/Task8Flashcards';
import Task9StudyPlanner from './pages/Task9StudyPlanner';
import Task10OCRSummarizer from './pages/Task10OCRSummarizer';

import {
  FileText,
  BookOpen,
  Presentation,
  GitFork,
  Database,
  HelpCircle,
  MessageSquare,
  Layers,
  Calendar,
  Camera
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('task1');

  const tasks = [
    { id: 'task1', title: '1. AI Resume Builder', icon: FileText, component: Task1ResumeBuilder },
    { id: 'task2', title: '2. Notes Generator', icon: BookOpen, component: Task2NotesGenerator },
    { id: 'task3', title: '3. PPT Generator', icon: Presentation, component: Task3PPTGenerator },
    { id: 'task4', title: '4. Syllabus Mind Map', icon: GitFork, component: Task4MindMap },
    { id: 'task5', title: '5. Google Sheets API', icon: Database, component: Task5GoogleSheets },
    { id: 'task6', title: '6. Quiz / MCQ Engine', icon: HelpCircle, component: Task6QuizGenerator },
    { id: 'task7', title: '7. Doubt Tutor Chatbot', icon: MessageSquare, component: Task7DoubtChatbot },
    { id: 'task8', title: '8. Revision Flashcards', icon: Layers, component: Task8Flashcards },
    { id: 'task9', title: '9. AI Study Planner', icon: Calendar, component: Task9StudyPlanner },
    { id: 'task10', title: '10. OCR Photo Summary', icon: Camera, component: Task10OCRSummarizer }
  ];

  const ActiveComponent = tasks.find((t) => t.id === activeTab)?.component || Task1ResumeBuilder;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      <Header />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Sidebar */}
        <nav className="lg:col-span-3 space-y-1 bg-white border border-slate-200 rounded-2xl p-3 shadow-xs h-fit">
          <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 mb-2">
            10 AI Micro Tasks
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-1 gap-1">
            {tasks.map((task) => {
              const Icon = task.icon;
              const isActive = activeTab === task.id;
              return (
                <button
                  key={task.id}
                  onClick={() => setActiveTab(task.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-indigo-600'}`} />
                  <span className="truncate">{task.title}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Active Task Workspace */}
        <main className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs min-h-[600px]">
          <ActiveComponent />
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 font-medium">
        🎓 10 In-Class Student AI Tasks Web App • Built with React 19 & Google Gemini API
      </footer>
    </div>
  );
}