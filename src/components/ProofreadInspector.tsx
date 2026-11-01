import React, { useState } from 'react';
import { TextIssue, ReportData } from '../types';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  SpellCheck,
  X,
  ArrowRight,
  RefreshCw,
  Info,
} from 'lucide-react';

interface ProofreadInspectorProps {
  issues: TextIssue[];
  report: ReportData;
  onApplyFix: (issue: TextIssue) => void;
  onClose: () => void;
  onAddAiIssues?: (issues: TextIssue[]) => void;
}

export const ProofreadInspector: React.FC<ProofreadInspectorProps> = ({
  issues,
  report,
  onApplyFix,
  onClose,
  onAddAiIssues,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'spelling' | 'grammar'>('all');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const spellingIssues = issues.filter((i) => i.type === 'spelling');
  const grammarIssues = issues.filter((i) => i.type === 'grammar' || i.type === 'punctuation');

  const filteredIssues =
    activeTab === 'spelling'
      ? spellingIssues
      : activeTab === 'grammar'
      ? grammarIssues
      : issues;

  const handleRunAiProofread = async () => {
    setAiLoading(true);
    setAiMessage(null);
    try {
      // Aggregate student text blocks to inspect
      const textToReview = [
        report.title ? `Title: ${report.title}` : '',
        report.introduction ? `Introduction: ${report.introduction}` : '',
        ...report.sections.map((s, idx) => `Section ${idx + 1}: ${s.heading}\n${s.content}`),
        report.conclusion ? `Conclusion: ${report.conclusion}` : '',
      ]
        .filter(Boolean)
        .join('\n\n');

      if (!textToReview.trim()) {
        setAiMessage('Please write some content first before running the AI proofreader.');
        setAiLoading(false);
        return;
      }

      const res = await fetch('/api/proofread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToReview,
          sectionName: report.title || 'Information Text Report',
        }),
      });

      if (!res.ok) {
        throw new Error('AI service response error');
      }

      const data = await res.json();
      if (data.issues && Array.isArray(data.issues) && data.issues.length > 0) {
        const formatted: TextIssue[] = data.issues.map((iss: any, index: number) => ({
          id: `ai-issue-${Date.now()}-${index}`,
          fieldKey: 'introduction', // Default target or match best
          sectionTitle: 'AI Proofreader Note',
          type: iss.type === 'spelling' ? 'spelling' : 'grammar',
          original: iss.original || '',
          suggestion: iss.suggestion || '',
          explanation: iss.explanation || 'Suggested improvement',
          index: index,
        }));
        onAddAiIssues?.(formatted);
        setAiMessage(`AI found ${formatted.length} recommendations to review.`);
      } else {
        setAiMessage('Great job! The AI proofreader found no major grammar or spelling issues.');
      }
    } catch (err: any) {
      setAiMessage('Could not connect to deep AI service. Offline rules are actively scanning.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="bg-white border-l border-slate-200 w-full sm:w-96 flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 text-blue-700 rounded-md">
            <SpellCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Proofreading Assistant
            </h3>
            <p className="text-[11px] text-slate-500">
              Spelling & Grammar error indicators
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 px-3 bg-slate-50/50 text-xs font-medium">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2 px-3 border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All ({issues.length})
        </button>
        <button
          onClick={() => setActiveTab('spelling')}
          className={`py-2 px-3 border-b-2 transition-colors ${
            activeTab === 'spelling'
              ? 'border-rose-600 text-rose-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Spelling ({spellingIssues.length})
        </button>
        <button
          onClick={() => setActiveTab('grammar')}
          className={`py-2 px-3 border-b-2 transition-colors ${
            activeTab === 'grammar'
              ? 'border-amber-600 text-amber-600 font-semibold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Grammar ({grammarIssues.length})
        </button>
      </div>

      {/* Deep AI Check Trigger */}
      <div className="p-3 bg-indigo-50/60 border-b border-indigo-100 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-indigo-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Deep AI Grammar Scanner
          </span>
          <button
            onClick={handleRunAiProofread}
            disabled={aiLoading}
            className="text-xs bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium px-2.5 py-1 rounded shadow-xs flex items-center gap-1 transition-colors"
          >
            {aiLoading ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                Scanning...
              </>
            ) : (
              'Run Scan'
            )}
          </button>
        </div>
        {aiMessage && (
          <p className="text-[11px] text-indigo-800 bg-white/80 p-2 rounded border border-indigo-200">
            {aiMessage}
          </p>
        )}
      </div>

      {/* Issues List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredIssues.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">
              No Issues Detected!
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your text appears clean of standard spelling and grammar flags. Keep
              writing and indicators will appear automatically if needed.
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className={`p-3 rounded-lg border text-xs transition-shadow ${
                issue.type === 'spelling'
                  ? 'border-rose-200 bg-rose-50/40 hover:border-rose-300'
                  : 'border-amber-200 bg-amber-50/40 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    issue.type === 'spelling'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {issue.type}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {issue.sectionTitle}
                </span>
              </div>

              {/* Diff / Correction */}
              <div className="flex items-center gap-2 font-mono text-xs my-2 bg-white p-2 rounded border border-slate-200">
                <span className="text-rose-600 line-through bg-rose-50 px-1 py-0.5 rounded">
                  {issue.original}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-emerald-700 font-bold bg-emerald-50 px-1 py-0.5 rounded">
                  {issue.suggestion}
                </span>
              </div>

              <p className="text-slate-600 text-[11px] mb-2 leading-relaxed">
                {issue.explanation}
              </p>

              <button
                onClick={() => onApplyFix(issue)}
                className="w-full py-1.5 px-3 bg-white hover:bg-slate-50 text-slate-800 font-semibold border border-slate-300 rounded shadow-2xs text-xs flex items-center justify-center gap-1.5 hover:border-blue-500 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Apply Fix: "{issue.suggestion}"
              </button>
            </div>
          ))
        )}
      </div>

      {/* Helpful Student Tip Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
        <span>
          Information reports should use clear factual language, proper
          subheadings, and accurate vocabulary definitions.
        </span>
      </div>
    </div>
  );
};
