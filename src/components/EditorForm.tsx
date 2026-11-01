import React from 'react';
import { ReportData, TextIssue } from '../types';
import { ImageUploader } from './ImageUploader';
import {
  FileText,
  BookOpen,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  AlertCircle,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

interface EditorFormProps {
  report: ReportData;
  onChange: (updated: ReportData) => void;
  issues: TextIssue[];
  onOpenInspector: () => void;
}

export const EditorForm: React.FC<EditorFormProps> = ({
  report,
  onChange,
  issues,
  onOpenInspector,
}) => {
  // Count issues per field
  const getIssuesForField = (fieldPrefix: string): TextIssue[] => {
    return issues.filter((iss) => iss.fieldKey.startsWith(fieldPrefix));
  };

  const handleUpdate = <K extends keyof ReportData>(key: K, value: ReportData[K]) => {
    onChange({
      ...report,
      [key]: value,
    });
  };

  // Subheading handlers
  const handleAddSection = () => {
    const newSection = {
      id: `sec-${Date.now()}`,
      heading: '',
      content: '',
    };
    handleUpdate('sections', [...report.sections, newSection]);
  };

  const handleRemoveSection = (index: number) => {
    if (report.sections.length <= 1) return;
    const updated = report.sections.filter((_, i) => i !== index);
    handleUpdate('sections', updated);
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= report.sections.length) return;
    const updated = [...report.sections];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    handleUpdate('sections', updated);
  };

  const handleSectionHeadingChange = (index: number, val: string) => {
    const updated = [...report.sections];
    updated[index] = { ...updated[index], heading: val };
    handleUpdate('sections', updated);
  };

  const handleSectionContentChange = (index: number, val: string) => {
    const updated = [...report.sections];
    updated[index] = { ...updated[index], content: val };
    handleUpdate('sections', updated);
  };

  // Glossary handlers
  const handleAddGlossaryTerm = () => {
    const newItem = {
      id: `glo-${Date.now()}`,
      term: '',
      definition: '',
    };
    handleUpdate('glossary', [...report.glossary, newItem]);
  };

  const handleRemoveGlossaryTerm = (index: number) => {
    if (report.glossary.length <= 1) return;
    const updated = report.glossary.filter((_, i) => i !== index);
    handleUpdate('glossary', updated);
  };

  const handleGlossaryChange = (index: number, field: 'term' | 'definition', val: string) => {
    const updated = [...report.glossary];
    updated[index] = { ...updated[index], [field]: val };
    handleUpdate('glossary', updated);
  };

  // Render error badge component
  const renderErrorIndicator = (fieldKey: string) => {
    const fieldIssues = getIssuesForField(fieldKey);
    if (fieldIssues.length === 0) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          <CheckCircle className="w-3 h-3" />
          Clean
        </span>
      );
    }
    const spellingCount = fieldIssues.filter((i) => i.type === 'spelling').length;
    const grammarCount = fieldIssues.filter(
      (i) => i.type === 'grammar' || i.type === 'punctuation'
    ).length;

    return (
      <button
        type="button"
        onClick={onOpenInspector}
        className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
        title="Click to view and fix errors"
      >
        <AlertCircle className="w-3 h-3 text-rose-600" />
        {spellingCount > 0 && <span>{spellingCount} spelling</span>}
        {spellingCount > 0 && grammarCount > 0 && <span>•</span>}
        {grammarCount > 0 && <span>{grammarCount} grammar</span>}
      </button>
    );
  };

  const picIssues0 = issues.filter((i) => i.fieldKey === 'pic-caption-0').length;
  const picIssues1 = issues.filter((i) => i.fieldKey === 'pic-caption-1').length;

  return (
    <div className="space-y-6 pb-12">
      {/* SECTION 1: TITLE & METADATA */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h2 className="text-base font-bold text-slate-800">
              Title & Report Details
            </h2>
          </div>
          {renderErrorIndicator('title')}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Information Report Title *
            </label>
            <input
              type="text"
              spellCheck="true"
              placeholder="Enter your information text title..."
              value={report.title}
              onChange={(e) => handleUpdate('title', e.target.value)}
              className="w-full text-base font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subtitle / Overview Tagline (Optional)
            </label>
            <input
              type="text"
              spellCheck="true"
              placeholder="Enter an optional descriptive subtitle..."
              value={report.subtitle}
              onChange={(e) => handleUpdate('subtitle', e.target.value)}
              className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Student Author Name
              </label>
              <input
                type="text"
                placeholder="Student name..."
                value={report.author}
                onChange={(e) => handleUpdate('author', e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Class / Grade
              </label>
              <input
                type="text"
                placeholder="e.g., Grade 6, Class 5B..."
                value={report.gradeOrClass}
                onChange={(e) => handleUpdate('gradeOrClass', e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Report Date
              </label>
              <input
                type="text"
                placeholder="e.g., October 31, 2026..."
                value={report.date}
                onChange={(e) => handleUpdate('date', e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Category / Topic Header Badge
            </label>
            <input
              type="text"
              placeholder="e.g., SCIENCE REPORT, GEOGRAPHY, HISTORICAL STUDY..."
              value={report.categoryTag}
              onChange={(e) => handleUpdate('categoryTag', e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-blue-500"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: INTRODUCTION */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h2 className="text-base font-bold text-slate-800">Introduction</h2>
          </div>
          {renderErrorIndicator('introduction')}
        </div>

        <p className="text-xs text-slate-500 mb-2">
          Introduce your subject with a clear definition, general classification,
          and brief overview of what this report presents.
        </p>

        <textarea
          rows={4}
          spellCheck="true"
          placeholder="Write your introduction paragraph here..."
          value={report.introduction}
          onChange={(e) => handleUpdate('introduction', e.target.value)}
          className="w-full text-sm leading-relaxed p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y"
        />

        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
          <span>Introduction Section</span>
          <span>
            {report.introduction.trim()
              ? report.introduction.trim().split(/\s+/).length
              : 0}{' '}
            words
          </span>
        </div>
      </section>

      {/* SECTION 3: SUBHEADINGS WITH PARAGRAPH BLOCKS */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              3
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Subheadings with Paragraph Blocks
              </h2>
              <p className="text-xs text-slate-500">
                Organize distinct sub-topics with their own heading and descriptive paragraph.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddSection}
            className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Subheading
          </button>
        </div>

        <div className="space-y-5">
          {report.sections.map((sec, idx) => {
            const headingIssues = getIssuesForField(`sec-heading-${sec.id}`);
            const contentIssues = getIssuesForField(`sec-content-${sec.id}`);
            const totalIssues = headingIssues.length + contentIssues.length;

            return (
              <div
                key={sec.id}
                className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 relative transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      Section {idx + 1}
                    </span>
                    {totalIssues > 0 && (
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                        {totalIssues} issue{totalIssues > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveSection(idx, 'up')}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-400 rounded"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === report.sections.length - 1}
                      onClick={() => handleMoveSection(idx, 'down')}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-400 rounded"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    {report.sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(idx)}
                        className="p-1 text-rose-500 hover:text-rose-700 rounded ml-1"
                        title="Delete section"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subheading Title
                    </label>
                    <input
                      type="text"
                      spellCheck="true"
                      placeholder={`Enter subheading title for section ${idx + 1}...`}
                      value={sec.heading}
                      onChange={(e) => handleSectionHeadingChange(idx, e.target.value)}
                      className="w-full text-sm font-semibold px-3 py-1.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Paragraph Block
                    </label>
                    <textarea
                      rows={4}
                      spellCheck="true"
                      placeholder={`Write factual paragraph block for this subheading...`}
                      value={sec.content}
                      onChange={(e) => handleSectionContentChange(idx, e.target.value)}
                      className="w-full text-sm leading-relaxed p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-y"
                    />
                    <div className="flex justify-end text-[10px] text-slate-400 mt-1">
                      <span>
                        {sec.content.trim()
                          ? sec.content.trim().split(/\s+/).length
                          : 0}{' '}
                        words
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: 2 PICTURES COLUMN WITH CAPTION */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              5
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                2 Pictures Column with Caption
              </h2>
              <p className="text-xs text-slate-500">
                Upload 2 illustrations or diagrams with descriptive student captions.
              </p>
            </div>
          </div>
          {(picIssues0 > 0 || picIssues1 > 0) && (
            <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              {picIssues0 + picIssues1} caption issue
              {picIssues0 + picIssues1 > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <ImageUploader
          pictures={report.pictures}
          onChange={(pics) => handleUpdate('pictures', pics)}
          errorCounts={[picIssues0, picIssues1]}
        />
      </section>

      {/* SECTION 4: CONCLUSION SECTION */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              4
            </span>
            <h2 className="text-base font-bold text-slate-800">
              Conclusion Section
            </h2>
          </div>
          {renderErrorIndicator('conclusion')}
        </div>

        <p className="text-xs text-slate-500 mb-2">
          Summarize the main points of your information text, highlight key
          discoveries, and provide closing remarks.
        </p>

        <textarea
          rows={4}
          spellCheck="true"
          placeholder="Write your conclusion section here..."
          value={report.conclusion}
          onChange={(e) => handleUpdate('conclusion', e.target.value)}
          className="w-full text-sm leading-relaxed p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-y"
        />

        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
          <span>Conclusion Section</span>
          <span>
            {report.conclusion.trim()
              ? report.conclusion.trim().split(/\s+/).length
              : 0}{' '}
            words
          </span>
        </div>
      </section>

      {/* SECTION 6: GLOSSARY SECTION */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              6
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Glossary Section
              </h2>
              <p className="text-xs text-slate-500">
                Define specialized technical words and subject-specific vocabulary.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddGlossaryTerm}
            className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Term
          </button>
        </div>

        <div className="space-y-3">
          {report.glossary.map((item, idx) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200"
            >
              <div className="w-full sm:w-1/3">
                <input
                  type="text"
                  spellCheck="true"
                  placeholder={`Term ${idx + 1}...`}
                  value={item.term}
                  onChange={(e) => handleGlossaryChange(idx, 'term', e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="w-full sm:flex-1">
                <input
                  type="text"
                  spellCheck="true"
                  placeholder={`Definition for term ${idx + 1}...`}
                  value={item.definition}
                  onChange={(e) =>
                    handleGlossaryChange(idx, 'definition', e.target.value)
                  }
                  className="w-full text-xs text-slate-700 bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              {report.glossary.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveGlossaryTerm(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded self-end sm:self-center"
                  title="Remove term"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
