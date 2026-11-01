export type LayoutStyle = 'editorial' | 'journal' | 'dossier';

export interface SubheadingSection {
  id: string;
  heading: string;
  content: string;
}

export interface PictureItem {
  id: string;
  url: string;
  caption: string;
}

export interface GlossaryItem {
  id: string;
  term: string;
  definition: string;
}

export interface ReportData {
  title: string;
  subtitle: string;
  author: string;
  gradeOrClass: string;
  date: string;
  categoryTag: string;
  introduction: string;
  sections: SubheadingSection[];
  pictures: [PictureItem, PictureItem];
  conclusion: string;
  glossary: GlossaryItem[];
}

export interface TextIssue {
  id: string;
  fieldKey: string;
  sectionTitle: string;
  type: 'spelling' | 'grammar' | 'punctuation';
  original: string;
  suggestion: string;
  explanation: string;
  index: number;
}

export const EMPTY_REPORT: ReportData = {
  title: '',
  subtitle: '',
  author: '',
  gradeOrClass: '',
  date: '',
  categoryTag: '',
  introduction: '',
  sections: [
    { id: 'sec-1', heading: '', content: '' },
    { id: 'sec-2', heading: '', content: '' },
  ],
  pictures: [
    { id: 'pic-1', url: '', caption: '' },
    { id: 'pic-2', url: '', caption: '' },
  ],
  conclusion: '',
  glossary: [
    { id: 'glo-1', term: '', definition: '' },
    { id: 'glo-2', term: '', definition: '' },
  ],
};
