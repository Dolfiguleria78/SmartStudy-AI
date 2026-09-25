import React, { useState } from 'react';
import { Database, Plus, RefreshCw, Sparkles, Table, Lightbulb } from 'lucide-react';
import { runAiTask } from '../lib/aiService';

export default function Task5GoogleSheets() {
  const [apiUrl, setApiUrl] = useState('https://script.google.com/macros/s/AKfycbx_mock_demo_endpoint/exec');
  const [dataList, setDataList] = useState([
    { id: 1, studentName: 'Emma Watson', subject: 'Mathematics', marks: 88, attendance: '95%' },
    { id: 2, studentName: 'Liam Johnson', subject: 'Physics', marks: 74, attendance: '88%' },
    { id: 3, studentName: 'Sophia Chen', subject: 'Computer Science', marks: 96, attendance: '98%' },
    { id: 4, studentName: 'Noah Smith', subject: 'Chemistry', marks: 65, attendance: '82%' }
  ]);

  const [newRow, setNewRow] = useState({ studentName: '', subject: 'Computer Science', marks: '', attendance: '' });
  const [aiInsight, setAiInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const handleFetchData = async () => {
    setFetching(true);
    try {
      if (apiUrl && !apiUrl.includes('mock')) {
        const res = await fetch(apiUrl);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json)) setDataList(json);
        }
      }
    } catch (err) {
      console.warn('Using live state demo table:', err);
    } finally {
      setTimeout(() => setFetching(false), 500);
    }
  };

  const handleAddRow = (e) => {
    e.preventDefault();
    if (!newRow.studentName || !newRow.marks) return;

    const rowObj = {
      id: Date.now(),
      studentName: newRow.studentName,
      subject: newRow.subject,
      marks: parseInt(newRow.marks, 10),
      attendance: newRow.attendance ? `${newRow.attendance}%` : '90%'
    };

    setDataList((prev) => [...prev, rowObj]);
    setNewRow({ studentName: '', subject: 'Computer Science', marks: '', attendance: '' });

    if (apiUrl && !apiUrl.includes('mock')) {
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rowObj)
      }).catch(console.warn);
    }
  };

  const handleGenerateAiInsight = async () => {
    setLoading(true);
    const prompt = `Analyze this Google Sheet student dataset and provide a concise summary and key insight trends:\n${JSON.stringify(dataList, null, 2)}`;

    try {
      const insight = await runAiTask('sheet_insight', prompt, { rowCount: dataList.length }, 'You are a data analyst summarizing sheet metrics.');
      setAiInsight(insight);
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
          <Database className="w-7 h-7 text-indigo-600" /> Task 5: Google Sheets Backend & Dynamic Frontend
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Connect your Google Apps Script Web App URL to read & write live sheet data, then generate AI trend insights.
        </p>
      </div>

      {/* Apps Script Endpoint Config */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 shrink-0">
          <Database className="w-4 h-4 text-indigo-600" /> Apps Script Endpoint URL:
        </div>
        <input
          type="text"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          className="flex-1 w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:border-indigo-600 focus:outline-none font-mono"
        />
        <button
          onClick={handleFetchData}
          disabled={fetching}
          className="bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-300 flex items-center gap-1.5 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${fetching ? 'animate-spin' : ''}`} /> Fetch Sheet Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" /> Add Record to Sheet
          </h3>

          <form onSubmit={handleAddRow} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-700 font-medium">Student Name</label>
              <input
                type="text"
                value={newRow.studentName}
                onChange={(e) => setNewRow({ ...newRow, studentName: e.target.value })}
                required
                placeholder="e.g. Maya Lin"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-700 font-medium">Subject</label>
              <input
                type="text"
                value={newRow.subject}
                onChange={(e) => setNewRow({ ...newRow, subject: e.target.value })}
                required
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-slate-700 font-medium">Marks (/100)</label>
                <input
                  type="number"
                  value={newRow.marks}
                  onChange={(e) => setNewRow({ ...newRow, marks: e.target.value })}
                  required
                  placeholder="85"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-700 font-medium">Attendance %</label>
                <input
                  type="number"
                  value={newRow.attendance}
                  onChange={(e) => setNewRow({ ...newRow, attendance: e.target.value })}
                  placeholder="92"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-xl text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Submit Row to Google Sheet
            </button>
          </form>

          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={handleGenerateAiInsight}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-xl text-xs shadow-md shadow-purple-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
              <span>{loading ? 'Analyzing Sheet Data...' : 'AI Analyze Sheet Insights'}</span>
            </button>
          </div>
        </div>

        {/* Right Table & Insights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Table className="w-5 h-5 text-indigo-600" /> Live Data Table ({dataList.length} Rows)
              </h3>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-600 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Marks</th>
                    <th className="p-3">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dataList.map((row, index) => (
                    <tr key={row.id || index} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-400 font-medium">{index + 1}</td>
                      <td className="p-3 font-bold text-slate-900">{row.studentName}</td>
                      <td className="p-3 font-medium">{row.subject}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                          row.marks >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {row.marks}
                        </span>
                      </td>
                      <td className="p-3 font-medium">{row.attendance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Insight Box */}
          {aiInsight && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 shadow-xs space-y-2">
              <h4 className="text-sm font-bold text-purple-900 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-purple-700" /> AI Data Insights Summary
              </h4>
              <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-medium">
                {aiInsight}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
