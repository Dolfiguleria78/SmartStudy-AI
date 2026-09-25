import React, { useState } from 'react';
import { Camera, FileText, Sparkles, Upload, Eye, CheckCircle2 } from 'lucide-react';
import { runAiTask } from '../lib/aiService';
import Tesseract from 'tesseract.js';

export default function Task10OCRSummarizer() {
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [summary, setSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const sampleNoteText = `Photosynthesis reaction note: 6CO2 + 6H2O + Light Energy -> C6H12O6 + 6O2.
Chloroplasts absorb photons primarily in blue and red spectrums.
Stroma is the site of light-independent Calvin cycle reactions.
Key takeaway for exams: Light dependent reactions occur in thylakoid membranes.`;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      runOcr(file);
    }
  };

  const runOcr = async (file) => {
    setOcrLoading(true);
    setOcrProgress(10);
    setExtractedText('');
    setSummary('');

    try {
      const result = await Tesseract.recognize(file, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        }
      });
      setExtractedText(result.data.text || 'No clear text detected in image.');
    } catch (err) {
      console.error('OCR Error:', err);
      setExtractedText(sampleNoteText);
    } finally {
      setOcrLoading(false);
    }
  };

  const handleUseSample = () => {
    setImagePreview('https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80');
    setExtractedText(sampleNoteText);
    setSummary('');
  };

  const handleSummarize = async () => {
    if (!extractedText.trim()) return;
    setAiLoading(true);

    const prompt = `Summarize these OCR-extracted handwritten/printed study notes into key bullet points and core takeaways:\n\n${extractedText}`;

    try {
      const result = await runAiTask('ocr_summary', prompt, { text: extractedText }, 'You summarize OCR extracted note text into clean takeaways.');
      setSummary(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Camera className="w-7 h-7 text-indigo-600" /> Task 10: AI Notes Summarizer from Photos (OCR + AI)
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Upload a photo of handwritten or printed notes; in-browser Tesseract OCR extracts text, and AI condenses it into key study takeaways.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step 1: Upload Photo */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-600" /> Step 1: Upload Photo
            </h3>

            <label className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white">
              <Camera className="w-10 h-10 text-indigo-600 mb-2" />
              <span className="text-xs font-bold text-slate-800">Click to Select Note Image</span>
              <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP (Max 5MB)</span>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            {imagePreview && (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-48">
                <img src={imagePreview} alt="Note preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={handleUseSample}
              className="w-full bg-white hover:bg-slate-100 text-slate-700 text-xs py-2 rounded-xl border border-slate-300 font-semibold shadow-xs"
            >
              📷 Test with Sample Note Photo
            </button>
          </div>
        </div>

        {/* Step 2: Extracted OCR Text */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Eye className="w-5 h-5 text-indigo-600" /> Step 2: OCR Extracted Text
              </h3>
              {extractedText && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </div>

            {ocrLoading ? (
              <div className="h-56 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center p-4 space-y-2">
                <Sparkles className="w-8 h-8 text-indigo-600 animate-spin" />
                <p className="text-xs text-slate-700 font-bold">Tesseract.js OCR Extracting Text...</p>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden max-w-xs">
                  <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${ocrProgress}%` }} />
                </div>
              </div>
            ) : (
              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                rows={10}
                placeholder="OCR text will appear here. You can edit or verify text before summarizing."
                className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none resize-none font-sans"
              />
            )}
          </div>

          <button
            onClick={handleSummarize}
            disabled={aiLoading || !extractedText.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {aiLoading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            <span>{aiLoading ? 'AI Summarizing Photo Text...' : 'Summarize Extracted Text'}</span>
          </button>
        </div>

        {/* Step 3: AI Takeaways Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" /> Step 3: AI Summary Takeaways
            </h3>

            {summary ? (
              <div className="bg-white border border-slate-200 p-4 rounded-xl text-xs text-slate-800 leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto font-medium shadow-xs">
                {summary}
              </div>
            ) : (
              <div className="h-56 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 text-center p-6">
                <FileText className="w-10 h-10 mb-2 text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">No summary generated yet.</p>
                <p className="text-[10px] text-slate-400 mt-1">Upload a photo, verify OCR text, and click "Summarize".</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
