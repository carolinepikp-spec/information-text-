import React from 'react';
import { LayoutStyle } from '../types';
import {
  Printer,
  Download,
  SpellCheck,
  AlertCircle,
  CheckCircle,
  Columns,
  Edit3,
  Eye,
  RotateCcw,
  BookOpenCheck,
} from 'lucide-react';

interface HeaderProps {
  layoutStyle: LayoutStyle;
  onSelectLayoutStyle: (style: LayoutStyle) => void;
  viewMode: 'split' | 'edit' | 'preview';
  onSelectViewMode: (mode: 'split' | 'edit' | 'preview') => void;
  spellingCount: number;
  grammarCount: number;
  onOpenInspector: () => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  isDownloadingPdf: boolean;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  layoutStyle,
  onSelectLayoutStyle,
  viewMode,
  onSelectViewMode,
  spellingCount,
  grammarCount,
  onOpenInspector,
  onPrint,
  onDownloadPdf,
  isDownloadingPdf,
  onReset,
}) => {
  const totalIssues = spellingCount + grammarCount;

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
            <BookOpenCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                InfoCraft
              </h1>
              <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                Layout Studio
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Information Text Builder & Ready-to-Print PDF Generator
            </p>
          </div>
        </div>

        {/* Middle: 3 Layout Style Selectors */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 hidden md:inline">
            Style:
          </span>
          <button
            type="button"
            onClick={() => onSelectLayoutStyle('editorial')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              layoutStyle === 'editorial'
                ? 'bg-white text-blue-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Magazine Editorial
          </button>
          <button
            type="button"
            onClick={() => onSelectLayoutStyle('journal')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              layoutStyle === 'journal'
                ? 'bg-white text-blue-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Science Encyclopedia
          </button>
          <button
            type="button"
            onClick={() => onSelectLayoutStyle('dossier')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              layoutStyle === 'dossier'
                ? 'bg-white text-blue-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Explorer Dossier
          </button>
        </div>

        {/* Right: Actions & Error Pill */}
        <div className="flex items-center gap-2">
          {/* Spelling & Grammar Error Indicator Pill */}
          <button
            type="button"
            onClick={onOpenInspector}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              totalIssues > 0
                ? 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100 shadow-2xs'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
            }`}
            title="Open Spelling & Grammar Proofreading Panel"
          >
            {totalIssues > 0 ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span>
                  {spellingCount > 0 && `${spellingCount} Spelling`}
                  {spellingCount > 0 && grammarCount > 0 && ' • '}
                  {grammarCount > 0 && `${grammarCount} Grammar`}
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Grammar & Spelling Clean</span>
              </>
            )}
          </button>

          {/* Download Direct PDF */}
          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={isDownloadingPdf}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 transition-colors"
            title="Download PDF directly to file"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>{isDownloadingPdf ? 'Generating...' : 'Download PDF'}</span>
          </button>

          {/* Print / Save to PDF Primary Action */}
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-lg shadow-sm hover:shadow transition-all"
            title="Print or Save clean PDF document"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Sub-bar: View Modes & Reset */}
      <div className="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[11px] font-semibold text-slate-500 mr-2">
              Workspace View:
            </span>
            <button
              type="button"
              onClick={() => onSelectViewMode('split')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors ${
                viewMode === 'split'
                  ? 'bg-white text-slate-900 font-bold border border-slate-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3 h-3" />
              Split Editor & Preview
            </button>
            <button
              type="button"
              onClick={() => onSelectViewMode('edit')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors ${
                viewMode === 'edit'
                  ? 'bg-white text-slate-900 font-bold border border-slate-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-3 h-3" />
              Edit Form Only
            </button>
            <button
              type="button"
              onClick={() => onSelectViewMode('preview')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors ${
                viewMode === 'preview'
                  ? 'bg-white text-slate-900 font-bold border border-slate-300 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3 h-3" />
              Document Sheet Preview
            </button>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-600 font-medium transition-colors"
            title="Reset all inputs back to empty state"
          >
            <RotateCcw className="w-3 h-3" />
            Clear / Start Fresh
          </button>
        </div>
      </div>
    </header>
  );
};
