import React, { useState } from 'react';
import { GitFork, Sparkles, ZoomIn, Info } from 'lucide-react';
import { runAiTask } from '../lib/aiService';

export default function Task4MindMap() {
  const [syllabus, setSyllabus] = useState(
    `Data Structures & Algorithms Syllabus:
Unit 1: Linear Data Structures (Arrays, Linked Lists, Stacks, Queues)
Unit 2: Non-Linear Structures (Binary Trees, BST, Graphs, Heaps)
Unit 3: Sorting & Searching (Bubble Sort, Quick Sort, Binary Search)
Unit 4: Dynamic Programming & Greedy Algorithms (Knapsack, Dijkstra)`
  );
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const parseMarkdownToTree = (mdText) => {
    const lines = mdText.split('\n').filter((l) => l.trim().length > 0);
    const root = { title: 'Syllabus Mind Map', children: [] };
    let currentUnit = null;

    lines.forEach((line) => {
      const clean = line.replace(/^[#*\-\d.]+\s*/, '').trim();
      if (line.startsWith('#') || line.toLowerCase().includes('unit')) {
        currentUnit = { title: clean, children: [] };
        root.children.push(currentUnit);
      } else if (currentUnit) {
        currentUnit.children.push({ title: clean, children: [] });
      } else {
        root.children.push({ title: clean, children: [] });
      }
    });

    return root;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!syllabus.trim()) return;
    setLoading(true);

    const prompt = `Convert this syllabus text into a clear hierarchical nested Markdown outline (Unit -> Subtopic -> Key Concept):\n\n${syllabus}`;

    try {
      const markdown = await runAiTask('mindmap', prompt, { syllabus }, 'You generate structured markdown outlines for mind maps.');
      const parsed = parseMarkdownToTree(markdown);
      setTreeData(parsed);
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
          <GitFork className="w-7 h-7 text-indigo-600" /> Task 4: AI Mind Map Generator for Syllabus
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Paste your syllabus and let AI structure it into an interactive hierarchical Mind Map node visualizer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Syllabus */}
        <form onSubmit={handleGenerate} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-200 pb-2">Paste Course Syllabus</h3>
            <textarea
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              rows={10}
              placeholder="Paste syllabus text here..."
              required
              className="w-full bg-white border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none mt-3 resize-none font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            <span>{loading ? 'Building Mind Map...' : 'Generate AI Mind Map'}</span>
          </button>
        </form>

        {/* Visualizer Canvas */}
        <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <ZoomIn className="w-5 h-5 text-indigo-600" /> Mind Map Node Visualizer
            </h3>
            <span className="text-xs text-slate-500 font-medium">Click node for topic insight</span>
          </div>

          {treeData ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 min-h-[380px] overflow-x-auto space-y-6 shadow-xs">
              {/* Root */}
              <div className="flex justify-center">
                <div className="bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-full shadow-md text-sm tracking-wide">
                  {treeData.title}
                </div>
              </div>

              {/* Units */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                {treeData.children.map((unit, uIdx) => (
                  <div key={uIdx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 hover:border-indigo-300 transition-colors">
                    <div
                      onClick={() => setSelectedNode(unit.title)}
                      className="cursor-pointer text-sm font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1.5"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                      <span>{unit.title}</span>
                    </div>

                    {unit.children && unit.children.length > 0 && (
                      <div className="pl-4 space-y-1.5 border-l-2 border-indigo-200 mt-2">
                        {unit.children.map((sub, sIdx) => (
                          <div
                            key={sIdx}
                            onClick={() => setSelectedNode(sub.title)}
                            className="cursor-pointer text-xs font-medium text-slate-700 hover:bg-white p-1.5 rounded-lg transition-colors flex items-center justify-between group border border-transparent hover:border-slate-200"
                          >
                            <span>• {sub.title}</span>
                            <Info className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-72 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 text-center p-6">
              <GitFork className="w-12 h-12 mb-2 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No Mind Map generated yet.</p>
              <p className="text-xs text-slate-400">Paste your syllabus and click "Generate AI Mind Map".</p>
            </div>
          )}
        </div>
      </div>

      {/* Node Detail Modal */}
      {selectedNode && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h3 className="text-base font-bold text-indigo-700 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-600" /> Topic Deep Dive: {selectedNode}
              </h3>
              <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              <strong>AI Topic Breakdown:</strong> "{selectedNode}" represents a core module in the syllabus. Master the theoretical definitions, time complexity tradeoffs, and implementation patterns to score high in exam questions.
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedNode(null)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-xs"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
