import React, { useState } from 'react';
import { FileText, Download, Sparkles, User, Briefcase, GraduationCap, Code2, Target, Mail } from 'lucide-react';
import { runAiTask } from '../lib/aiService';
import { marked } from 'marked';
import jsPDF from 'jspdf';

export default function Task1ResumeBuilder() {
  const [formData, setFormData] = useState({
    name: 'Dolfi',
    contact: 'dolfiguleria130@email.com | (555) 234-5678 | linkedin.com/in/alexmorgan',
    objective: 'Passionate Computer Science student seeking a software development internship to apply modern web technology skills and build scalable applications.',
    education: 'B.tech in Computer Science - Maharishi Markandeshwar Deemede To Be University (2022 - 2026), GPA 3.8',
    skills: 'JavaScript, React, HTML5, CSS3, Python, Node.js, Git, SQL, TailWind',
    experience: 'Web Dev Club Project Lead - Built open-source student portal app (2024)\nPeer Tutor - Helped 30+ students in Data Structures & Web Programming'
  });

  const [loading, setLoading] = useState(false);
  const [resumeMarkdown, setResumeMarkdown] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const prompt = `Write a clean, highly professional resume in markdown format using these user details:
Name: ${formData.name}
Contact: ${formData.contact}
Objective: ${formData.objective}
Education: ${formData.education}
Skills: ${formData.skills}
Experience: ${formData.experience}

Make sure to format with clear H1 header for Name, bold contact details, H2 headers for sections, and bullet points.`;

    try {
      const output = await runAiTask('resume', prompt, formData, 'You are an expert resume builder HR specialist.');
      setResumeMarkdown(output);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const content = document.getElementById('resume-preview-content');
    if (!content) return;

    doc.html(content, {
      callback: function (pdf) {
        pdf.save(`${formData.name.replace(/\s+/g, '_')}_Resume.pdf`);
      },
      margin: [20, 20, 20, 20],
      autoPaging: 'text',
      x: 10,
      y: 10,
      width: 550,
      windowWidth: 700
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-7 h-7 text-indigo-600" /> Task 1: AI Resume Builder
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Fill in your details and let AI craft a polished, HR-ready resume text with export options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <form onSubmit={handleGenerate} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-200 pb-2">Your Profile Information</h3>

          <div className="space-y-1">
            <label className="text-xs text-slate-700 font-medium flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-indigo-600" /> Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-700 font-medium flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-600" /> Contact Info</label>
            <input
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-700 font-medium flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-indigo-600" /> Career Objective</label>
            <textarea
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              rows={2}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-700 font-medium flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-indigo-600" /> Education</label>
            <input
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-700 font-medium flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5 text-indigo-600" /> Technical & Soft Skills</label>
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-700 font-medium flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-indigo-600" /> Experience & Projects</label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            <span>{loading ? 'AI Generating Resume...' : 'Generate AI Resume'}</span>
          </button>
        </form>

        {/* Live Preview */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-800">Resume Live Preview</h3>
              {resumeMarkdown && (
                <button
                  onClick={handleDownloadPdf}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              )}
            </div>

            {resumeMarkdown ? (
              <div
                id="resume-preview-content"
                className="bg-white text-slate-900 p-6 rounded-xl border border-slate-200 shadow-sm overflow-y-auto max-h-[500px] prose prose-sm max-w-none font-sans"
                dangerouslySetInnerHTML={{ __html: marked.parse(resumeMarkdown) }}
              />
            ) : (
              <div className="h-72 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                <FileText className="w-12 h-12 mb-2 text-slate-300" />
                <p className="text-sm font-semibold text-slate-600">No resume generated yet.</p>
                <p className="text-xs text-slate-400">Fill the form and click "Generate AI Resume".</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
