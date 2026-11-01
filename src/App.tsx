import React, { useState, useEffect, useMemo } from 'react';
import { ReportData, LayoutStyle, EMPTY_REPORT, TextIssue } from './types';
import { Header } from './components/Header';
import { EditorForm } from './components/EditorForm';
import { ReportPreview } from './components/ReportPreview';
import { ProofreadInspector } from './components/ProofreadInspector';
import { checkEntireReport, applyFixToReport } from './utils/checker';
import { triggerNativePrint, downloadElementAsPdf } from './utils/pdfExport';
import { ZoomIn, ZoomOut, Maximize2, AlertCircle, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'infocraft_student_report_v1';
const STYLE_STORAGE_KEY = 'infocraft_layout_style';

export default function App() {
  // Load saved draft or start with completely empty report (no examples!)
  const [report, setReport] = useState<ReportData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return EMPTY_REPORT;
  });

  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>(() => {
    try {
      const savedStyle = localStorage.getItem(STYLE_STORAGE_KEY);
      if (savedStyle && ['editorial', 'journal', 'dossier'].includes(savedStyle)) {
        return savedStyle as LayoutStyle;
      }
    } catch {
      // Fallback
    }
    return 'editorial';
  });

  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [extraAiIssues, setExtraAiIssues] = useState<TextIssue[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [report]);

  useEffect(() => {
    try {
      localStorage.setItem(STYLE_STORAGE_KEY, layoutStyle);
    } catch (e) {
      console.warn('Failed to save style to localStorage', e);
    }
  }, [layoutStyle]);

  // Live error detection on current student inputs
  const detectedIssues = useMemo(() => {
    const baseIssues = checkEntireReport(report);
    // Merge with any extra AI suggestions that are still applicable
    return [...baseIssues, ...extraAiIssues];
  }, [report, extraAiIssues]);

  const spellingCount = useMemo(
    () => detectedIssues.filter((i) => i.type === 'spelling').length,
    [detectedIssues]
  );

  const grammarCount = useMemo(
    () =>
      detectedIssues.filter(
        (i) => i.type === 'grammar' || i.type === 'punctuation'
      ).length,
    [detectedIssues]
  );

  const handleApplyFix = (issue: TextIssue) => {
    const updated = applyFixToReport(report, issue);
    setReport(updated);
    // Remove fixed AI issues from state
    if (issue.id.startsWith('ai-issue-')) {
      setExtraAiIssues((prev) => prev.filter((i) => i.id !== issue.id));
    }
    showToast(`Fixed: "${issue.suggestion}"`);
  };

  const handleReset = () => {
    const confirmReset = window.confirm(
      'Are you sure you want to clear all fields and start fresh? All entered text and pictures will be cleared.'
    );
    if (confirmReset) {
      setReport(EMPTY_REPORT);
      setExtraAiIssues([]);
      localStorage.removeItem(STORAGE_KEY);
      showToast('All fields have been reset to blank state.');
    }
  };

  const handlePrint = () => {
    triggerNativePrint();
  };

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    showToast('Rendering high-resolution PDF...');
    try {
      const sanitizedTitle = (report.title || 'Information_Report')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 40);
      await downloadElementAsPdf(
        'printable-report-document',
        `${sanitizedTitle}.pdf`
      );
      showToast('PDF downloaded successfully!');
    } catch (err: any) {
      console.error(err);
      showToast('Error generating PDF file. Please use Print / Save PDF instead.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Top Application Header */}
      <Header
        layoutStyle={layoutStyle}
        onSelectLayoutStyle={setLayoutStyle}
        viewMode={viewMode}
        onSelectViewMode={setViewMode}
        spellingCount={spellingCount}
        grammarCount={grammarCount}
        onOpenInspector={() => setIsInspectorOpen((prev) => !prev)}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        isDownloadingPdf={isDownloadingPdf}
        onReset={handleReset}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Side: Editor Form */}
        {(viewMode === 'split' || viewMode === 'edit') && (
          <div
            className={`flex-1 overflow-y-auto px-4 sm:px-6 py-6 no-print ${
              viewMode === 'split' ? 'max-w-2xl border-r border-slate-200' : 'max-w-4xl mx-auto'
            }`}
          >
            <div className="mb-4 bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 flex items-start justify-between gap-3 text-xs text-blue-900">
              <div>
                <span className="font-bold block mb-0.5">
                  Information Text Layout Studio
                </span>
                <span>
                  Fill in your report sections below. Real-time indicators will highlight
                  any spelling or grammar flags. When finished, switch styles or click
                  <strong> Print / Save PDF</strong>.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsInspectorOpen(true)}
                className="shrink-0 bg-white text-blue-700 font-semibold px-2.5 py-1 rounded border border-blue-200 hover:bg-blue-50 shadow-2xs flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Proofreader
              </button>
            </div>

            <EditorForm
              report={report}
              onChange={setReport}
              issues={detectedIssues}
              onOpenInspector={() => setIsInspectorOpen(true)}
            />
          </div>
        )}

        {/* Right Side: Printable Layout Document Preview */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div
            className={`flex-1 overflow-y-auto bg-slate-200/70 flex flex-col items-center ${
              viewMode === 'split' ? 'p-2 sm:p-6' : 'p-4 sm:p-8'
            }`}
          >
            {/* Sheet Zoom Controls in Preview Mode */}
            <div className="no-print w-full max-w-[210mm] flex items-center justify-between pb-3 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>
                  Print Preview (
                  {layoutStyle === 'editorial'
                    ? '1. Magazine Editorial'
                    : layoutStyle === 'journal'
                    ? '2. Science Encyclopedia'
                    : '3. Explorer Dossier'}
                  )
                </span>
              </div>

              <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(50, z - 10))}
                  className="p-1 hover:bg-slate-100 rounded text-slate-600"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-1.5 font-mono text-[11px] font-semibold">
                  {zoom}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(150, z + 10))}
                  className="p-1 hover:bg-slate-100 rounded text-slate-600"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(100)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-600"
                  title="Reset Zoom"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Render Printable Report Document */}
            <ReportPreview
              report={report}
              layoutStyle={layoutStyle}
              zoom={zoom}
            />
          </div>
        )}

        {/* Proofreading Assistant Drawer */}
        {isInspectorOpen && (
          <div className="no-print fixed inset-y-0 right-0 z-40 sm:relative sm:z-auto sm:inset-auto">
            <ProofreadInspector
              issues={detectedIssues}
              report={report}
              onApplyFix={handleApplyFix}
              onClose={() => setIsInspectorOpen(false)}
              onAddAiIssues={(aiIssues) =>
                setExtraAiIssues((prev) => [...prev, ...aiIssues])
              }
            />
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
