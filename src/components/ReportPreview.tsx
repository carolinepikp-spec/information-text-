import React from 'react';
import { ReportData, LayoutStyle } from '../types';
import { Image as ImageIcon, BookOpen, User, Calendar, Award } from 'lucide-react';

interface ReportPreviewProps {
  report: ReportData;
  layoutStyle: LayoutStyle;
  zoom?: number;
  highlightIssues?: boolean;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({
  report,
  layoutStyle,
  zoom = 100,
}) => {
  const containerStyle: React.CSSProperties = {
    transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
    transformOrigin: 'top center',
    transition: 'transform 0.2s ease',
  };

  return (
    <div className="w-full flex justify-center p-2 sm:p-6 overflow-x-auto">
      <div
        id="printable-report-document"
        style={containerStyle}
        className="print-sheet bg-white text-slate-800 shadow-2xl rounded-sm w-[210mm] min-h-[297mm] p-[16mm] transition-all duration-300 relative"
      >
        {layoutStyle === 'editorial' && <EditorialLayout report={report} />}
        {layoutStyle === 'journal' && <JournalLayout report={report} />}
        {layoutStyle === 'dossier' && <DossierLayout report={report} />}
      </div>
    </div>
  );
};

// ==========================================
// 1. EDITORIAL LAYOUT (Magazine Style)
// ==========================================
const EditorialLayout: React.FC<{ report: ReportData }> = ({ report }) => {
  return (
    <div className="font-editorial text-slate-800 flex flex-col min-h-full justify-between">
      <div>
        {/* Top Accent Stripe */}
        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 rounded-full mb-6" />

        {/* Category Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
            {report.categoryTag || 'STUDENT INFORMATION REPORT'}
          </span>
          <span className="text-xs text-slate-400 font-medium tracking-wide">
            INFO-REPORT LAYOUT
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
            {report.title || (
              <span className="text-slate-300 italic font-normal">[Report Title]</span>
            )}
          </h1>
          {report.subtitle && (
            <p className="text-lg text-slate-600 font-medium leading-snug">
              {report.subtitle}
            </p>
          )}
        </div>

        {/* Author Byline Bar */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 bg-slate-50 border border-slate-200/80 rounded-lg p-3 mb-8">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>Author:</span>
            <span className="text-blue-700 font-bold">
              {report.author || <span className="text-slate-300 italic">[Student Name]</span>}
            </span>
          </div>
          {report.gradeOrClass && (
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-slate-500" />
              <span>Class / Grade:</span>
              <span className="font-semibold text-slate-700">{report.gradeOrClass}</span>
            </div>
          )}
          {report.date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Date:</span>
              <span className="font-semibold text-slate-700">{report.date}</span>
            </div>
          )}
        </div>

        {/* 2. INTRODUCTION */}
        <div className="mb-8 avoid-break">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
            Introduction
          </h2>
          <div className="bg-blue-50/40 border-l-4 border-blue-600 p-4 rounded-r-lg">
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {report.introduction || (
                <span className="text-slate-300 italic font-sans">[Introduction text will appear here...]</span>
              )}
            </p>
          </div>
        </div>

        {/* 3. SUBHEADINGS WITH PARAGRAPH BLOCKS */}
        {report.sections.map((sec, index) => (
          <div key={sec.id || index} className="mb-8 avoid-break">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-1.5 mb-3 flex items-center justify-between">
              <span>
                {sec.heading || (
                  <span className="text-slate-300 italic font-normal">
                    [Subheading {index + 1}]
                  </span>
                )}
              </span>
              <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                Section {index + 1}
              </span>
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {sec.content || (
                <span className="text-slate-300 italic">
                  [Section paragraph block content...]
                </span>
              )}
            </p>
          </div>
        ))}

        {/* 5. 2 PICTURES COLUMN WITH CAPTION */}
        <div className="mb-8 avoid-break">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
            Visual Evidence & Illustrations (2-Column Showcase)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {report.pictures.map((pic, idx) => (
              <div
                key={pic.id || idx}
                className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex flex-col"
              >
                <div className="w-full h-44 bg-slate-100 flex items-center justify-center overflow-hidden relative">
                  {pic.url ? (
                    <img
                      src={pic.url}
                      alt={pic.caption || `Picture ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center text-slate-400">
                      <ImageIcon className="w-8 h-8 mb-1.5 stroke-1" />
                      <span className="text-xs font-medium">Picture {idx + 1}</span>
                      <span className="text-[10px] text-slate-300">Insert image in editor</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    Photo {idx + 1}
                  </span>
                </div>
                <div className="p-3 bg-white border-t border-slate-200 flex-1">
                  <p className="text-xs text-slate-600 italic leading-snug">
                    {pic.caption || (
                      <span className="text-slate-300 not-italic">
                        [Caption for Picture {idx + 1} will appear here]
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. CONCLUSION SECTION */}
        <div className="mb-8 avoid-break">
          <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/70 border border-indigo-100 rounded-xl p-5">
            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              Conclusion
            </h3>
            <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
              {report.conclusion || (
                <span className="text-slate-300 italic">
                  [Conclusion section and summary thoughts will appear here...]
                </span>
              )}
            </p>
          </div>
        </div>

        {/* 6. GLOSSARY SECTION */}
        <div className="mb-8 avoid-break">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              Glossary of Key Terms
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.glossary.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-white border border-slate-200/90 rounded-md p-2.5 shadow-xs"
                >
                  <span className="text-xs font-bold text-blue-900 block mb-0.5">
                    {item.term || (
                      <span className="text-slate-300 italic font-normal">
                        [Term {idx + 1}]
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-slate-600 leading-normal block">
                    {item.definition || (
                      <span className="text-slate-300 italic font-normal">
                        [Definition will appear here]
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-400 avoid-break">
        <span>Information Report • {report.author || 'Student Work'}</span>
        <span>Page 1</span>
      </div>
    </div>
  );
};

// ==========================================
// 2. JOURNAL LAYOUT (Scientific Encyclopedia)
// ==========================================
const JournalLayout: React.FC<{ report: ReportData }> = ({ report }) => {
  return (
    <div className="font-classic-serif text-slate-900 flex flex-col min-h-full justify-between">
      <div>
        {/* Academic Double Rule Header */}
        <div className="border-t-2 border-b-2 border-slate-900 py-4 mb-8 text-center">
          <span className="text-[10px] tracking-widest font-sans uppercase font-bold text-slate-500 block mb-1">
            {report.categoryTag || 'SCIENTIFIC & HISTORICAL INFORMATION MONOGRAPH'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-display-serif font-bold text-slate-950 tracking-normal leading-tight mb-3">
            {report.title || (
              <span className="text-slate-300 italic font-normal">[Title of Report]</span>
            )}
          </h1>
          {report.subtitle && (
            <p className="text-base italic text-slate-700 max-w-xl mx-auto mb-2 font-normal">
              {report.subtitle}
            </p>
          )}
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs font-sans text-slate-600 mt-2">
            <span>
              Author:{' '}
              <strong className="text-slate-900">
                {report.author || '[Author Name]'}
              </strong>
            </span>
            {report.gradeOrClass && <span>• Grade: {report.gradeOrClass}</span>}
            {report.date && <span>• Date: {report.date}</span>}
          </div>
        </div>

        {/* 1. INTRODUCTION */}
        <div className="mb-8 avoid-break">
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 border-b border-slate-900 pb-1 mb-3">
            1.0 INTRODUCTION
          </h2>
          <p className="text-sm leading-relaxed text-slate-800 text-justify whitespace-pre-wrap first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:text-slate-950">
            {report.introduction || (
              <span className="text-slate-300 italic">[Introduction text...]</span>
            )}
          </p>
        </div>

        {/* 2. SUBHEADINGS & PARAGRAPHS */}
        {report.sections.map((sec, index) => (
          <div key={sec.id || index} className="mb-8 avoid-break">
            <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-3">
              {2 + index}.0{' '}
              {sec.heading ? (
                sec.heading.toUpperCase()
              ) : (
                <span className="text-slate-300 italic normal-case">
                  [Section {index + 1} Subheading]
                </span>
              )}
            </h3>
            <p className="text-sm leading-relaxed text-slate-800 text-justify whitespace-pre-wrap">
              {sec.content || (
                <span className="text-slate-300 italic">
                  [Section paragraph content...]
                </span>
              )}
            </p>
          </div>
        ))}

        {/* 5. 2 PICTURES COLUMN WITH CAPTION */}
        <div className="mb-8 avoid-break border-t border-b border-slate-200 py-4 my-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {report.pictures.map((pic, idx) => (
              <div key={pic.id || idx} className="flex flex-col items-center">
                <div className="w-full h-44 border border-slate-800 bg-slate-50 flex items-center justify-center p-1 overflow-hidden">
                  {pic.url ? (
                    <img
                      src={pic.url}
                      alt={pic.caption || `Figure ${idx + 1}`}
                      className="w-full h-full object-cover grayscale-25"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                      <ImageIcon className="w-8 h-8 stroke-1 mb-1" />
                      <span className="text-xs font-sans font-semibold">Figure {idx + 1}</span>
                      <span className="text-[10px] text-slate-400 font-sans">No image attached</span>
                    </div>
                  )}
                </div>
                <div className="w-full mt-2 text-center">
                  <p className="text-xs text-slate-700 italic">
                    <strong className="not-italic font-sans font-bold mr-1">
                      Figure {idx + 1}:
                    </strong>
                    {pic.caption || (
                      <span className="text-slate-300">[Descriptive scientific caption]</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. CONCLUSION */}
        <div className="mb-8 avoid-break">
          <h2 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 border-b border-slate-900 pb-1 mb-3">
            {2 + report.sections.length}.0 CONCLUSION
          </h2>
          <p className="text-sm leading-relaxed text-slate-800 text-justify whitespace-pre-wrap">
            {report.conclusion || (
              <span className="text-slate-300 italic">[Concluding summary...]</span>
            )}
          </p>
        </div>

        {/* 6. GLOSSARY SECTION (Classic Dictionary Style) */}
        <div className="mb-8 avoid-break bg-slate-50 border border-slate-300 p-4">
          <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" />
            GLOSSARY OF SPECIALIZED VOCABULARY
          </h3>
          <div className="space-y-2">
            {report.glossary.map((item, idx) => (
              <div key={item.id || idx} className="text-xs text-slate-800 leading-normal pl-4 -indent-4">
                <span className="font-bold text-slate-950 font-sans">{item.term || `[Term ${idx + 1}]`}</span>
                <span className="mx-1 text-slate-400">—</span>
                <span className="italic">{item.definition || `[Definition text]`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[10px] font-sans text-slate-500 avoid-break uppercase">
        <span>Academic Monograph Series</span>
        <span>Documentation Archive</span>
      </div>
    </div>
  );
};

// ==========================================
// 3. DOSSIER LAYOUT (Modern Contemporary Brief)
// ==========================================
const DossierLayout: React.FC<{ report: ReportData }> = ({ report }) => {
  return (
    <div className="font-editorial text-slate-800 flex flex-col min-h-full justify-between">
      <div>
        {/* Header Block with Slate Accent */}
        <div className="bg-slate-900 text-white p-6 rounded-xl mb-6 avoid-break">
          <div className="flex items-center justify-between text-xs font-mono text-teal-300 tracking-wider uppercase mb-2">
            <span>{report.categoryTag || 'FIELD INFORMATION REPORT'}</span>
            <span>FORMAT: DOSSIER</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
            {report.title || (
              <span className="text-slate-500 italic font-normal">[Information Report Title]</span>
            )}
          </h1>
          {report.subtitle && (
            <p className="text-slate-300 text-sm mb-4">{report.subtitle}</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-700/80 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Prepared By</span>
              <span className="font-semibold text-white">
                {report.author || <span className="text-slate-500">[Student Name]</span>}
              </span>
            </div>
            {report.gradeOrClass && (
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Classification</span>
                <span className="font-semibold text-white">{report.gradeOrClass}</span>
              </div>
            )}
            {report.date && (
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Filing Date</span>
                <span className="font-semibold text-white">{report.date}</span>
              </div>
            )}
          </div>
        </div>

        {/* 1. INTRODUCTION */}
        <div className="mb-6 avoid-break">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-4 bg-teal-500 rounded-xs"></span>
            <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-700">
              Overview & Background
            </h2>
          </div>
          <div className="p-4 bg-teal-50/50 border border-teal-200/60 rounded-lg">
            <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
              {report.introduction || (
                <span className="text-slate-300 italic">[Introduction paragraph...]</span>
              )}
            </p>
          </div>
        </div>

        {/* 2. SUBHEADINGS & PARAGRAPHS */}
        {report.sections.map((sec, index) => (
          <div key={sec.id || index} className="mb-6 avoid-break">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-4 bg-slate-800 rounded-xs"></span>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                {sec.heading || (
                  <span className="text-slate-300 italic font-normal">
                    [Subheading {index + 1}]
                  </span>
                )}
              </h3>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {sec.content || (
                  <span className="text-slate-300 italic">
                    [Body paragraph text...]
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}

        {/* 5. 2 PICTURES COLUMN WITH CAPTION */}
        <div className="mb-6 avoid-break">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-4 bg-indigo-500 rounded-xs"></span>
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-700">
              Field Imagery & Exhibits
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {report.pictures.map((pic, idx) => (
              <div
                key={pic.id || idx}
                className="border border-slate-300 rounded-lg overflow-hidden bg-slate-50"
              >
                <div className="relative h-44 w-full bg-slate-200 flex items-center justify-center">
                  {pic.url ? (
                    <img
                      src={pic.url}
                      alt={pic.caption || `Exhibit ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 p-4">
                      <ImageIcon className="w-8 h-8 mb-1 stroke-1" />
                      <span className="text-xs font-mono">EXHIBIT {idx === 0 ? 'A' : 'B'}</span>
                    </div>
                  )}
                  <span className="absolute bottom-2 right-2 bg-black/75 text-teal-300 font-mono text-[10px] px-2 py-0.5 rounded">
                    REF 0{idx + 1}
                  </span>
                </div>
                <div className="p-2.5 bg-slate-100 border-t border-slate-300">
                  <p className="text-xs font-mono text-slate-700 leading-tight">
                    {pic.caption || (
                      <span className="text-slate-400 italic">
                        [Caption for exhibit {idx === 0 ? 'A' : 'B'}]
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. CONCLUSION */}
        <div className="mb-6 avoid-break">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-4 bg-emerald-500 rounded-xs"></span>
            <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-700">
              Synthesis & Conclusion
            </h2>
          </div>
          <div className="p-4 bg-emerald-50/40 border border-emerald-200/60 rounded-lg">
            <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
              {report.conclusion || (
                <span className="text-slate-300 italic">
                  [Conclusion and closing statements...]
                </span>
              )}
            </p>
          </div>
        </div>

        {/* 6. GLOSSARY SECTION */}
        <div className="mb-6 avoid-break">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-4 bg-amber-500 rounded-xs"></span>
            <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-700">
              Technical Terms & Definitions
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {report.glossary.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white border-l-3 border-amber-500 border-y border-r border-slate-200 p-2.5 rounded-r-md shadow-2xs"
              >
                <span className="text-xs font-mono font-bold text-slate-900 block uppercase">
                  {item.term || `[Term ${idx + 1}]`}
                </span>
                <span className="text-xs text-slate-600 block mt-0.5 leading-snug">
                  {item.definition || `[Definition]`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-300 flex justify-between items-center text-[10px] font-mono text-slate-500 avoid-break">
        <span>SECURITY: UNCLASSIFIED / STUDENT PORTFOLIO</span>
        <span>PRINT READY DOCUMENT</span>
      </div>
    </div>
  );
};
