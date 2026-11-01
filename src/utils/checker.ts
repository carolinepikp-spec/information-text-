import { ReportData, TextIssue } from '../types';

// Curated dictionary of high-frequency student spelling mistakes and typos
const COMMON_SPELLING_MISTAKES: Record<string, string> = {
  // Frequent student typos & letter swaps
  'teh': 'the',
  'taht': 'that',
  'thier': 'their',
  'recieve': 'receive',
  'recieved': 'received',
  'recieving': 'receiving',
  'seperate': 'separate',
  'seperated': 'separated',
  'definately': 'definitely',
  'definitly': 'definitely',
  'untill': 'until',
  'tommorrow': 'tomorrow',
  'tomorow': 'tomorrow',
  'enviroment': 'environment',
  'goverment': 'government',
  'occured': 'occurred',
  'occuring': 'occurring',
  'neccessary': 'necessary',
  'necesary': 'necessary',
  'alot': 'a lot',
  'truely': 'truly',
  'beleive': 'believe',
  'beleived': 'believed',
  'acheive': 'achieve',
  'acheived': 'achieved',
  'wierd': 'weird',
  'freind': 'friend',
  'freinds': 'friends',
  'wich': 'which',
  'diffrent': 'different',
  'intresting': 'interesting',
  'disapear': 'disappear',
  'disapeared': 'disappeared',
  'finaly': 'finally',
  'realy': 'really',
  'begining': 'beginning',
  'priviledge': 'privilege',
  'suprise': 'surprise',
  'suprised': 'surprised',
  'succesful': 'successful',
  'completly': 'completely',
  'immediatly': 'immediately',
  'basicly': 'basically',
  'fourty': 'forty',
  'writting': 'writing',
  'writen': 'written',
  'peice': 'piece',
  'peices': 'pieces',
  'colum': 'column',
  'lenght': 'length',
  'heigth': 'height',
  'strenght': 'strength',
  'temprature': 'temperature',
  'tempature': 'temperature',
  'drammatic': 'dramatic',
  'drammatically': 'dramatically',
  'existance': 'existence',
  'existense': 'existence',
  'knowlege': 'knowledge',
  'knowlegeable': 'knowledgeable',
  'grammer': 'grammar',
  'speach': 'speech',
  'adress': 'address',
  'accommadate': 'accommodate',
  'acommodate': 'accommodate',
  'accidentaly': 'accidentally',
  'agressive': 'aggressive',
  'arguement': 'argument',
  'calender': 'calendar',
  'catagory': 'category',
  'cemetary': 'cemetery',
  'definate': 'definite',
  'embarass': 'embarrass',
  'embarassed': 'embarrassed',
  'foriegn': 'foreign',
  'guarentee': 'guarantee',
  'harrass': 'harass',
  'hygeine': 'hygiene',
  'independant': 'independent',
  'inteligent': 'intelligent',
  'lightening': 'lightning',
  'millenium': 'millennium',
  'minature': 'miniature',
  'mispell': 'misspell',
  'mispelled': 'misspelled',
  'noticable': 'noticeable',
  'paralell': 'parallel',
  'parrallel': 'parallel',
  'posession': 'possession',
  'pronounciation': 'pronunciation',
  'reccomend': 'recommend',
  'recomend': 'recommend',
  'relevent': 'relevant',
  'relavent': 'relevant',
  'rythm': 'rhythm',
  'similiar': 'similar',
  'succede': 'succeed',
  'supercede': 'supersede',
  'tendancy': 'tendency',
  'thourogh': 'thorough',
  'thourough': 'thorough',
  'tomatos': 'tomatoes',
  'potatos': 'potatoes',
  'vaccum': 'vacuum',
  'vacume': 'vacuum',
  'weather': 'whether', // Checked with context if desired
  'wether': 'whether',
};

// Common student grammar phrases
const GRAMMAR_PHRASE_PATTERNS: Array<{
  regex: RegExp;
  suggestion: string;
  explanation: string;
}> = [
  {
    regex: /\bcould\s+of\b/gi,
    suggestion: 'could have',
    explanation: 'Use "could have" instead of "could of".',
  },
  {
    regex: /\bshould\s+of\b/gi,
    suggestion: 'should have',
    explanation: 'Use "should have" instead of "should of".',
  },
  {
    regex: /\bwould\s+of\b/gi,
    suggestion: 'would have',
    explanation: 'Use "would have" instead of "would of".',
  },
  {
    regex: /\bmust\s+of\b/gi,
    suggestion: 'must have',
    explanation: 'Use "must have" instead of "must of".',
  },
  {
    regex: /\ba\s+lot\s+of\s+times\b/gi,
    suggestion: 'often',
    explanation: 'Consider using "often" or "frequently" for formal information text.',
  },
  {
    regex: /\btheir\s+(is|are|was|were)\b/gi,
    suggestion: 'there $1',
    explanation: 'Use "there" when referring to existence or location ("there is/are").',
  },
  {
    regex: /\byour\s+welcome\b/gi,
    suggestion: "you're welcome",
    explanation: 'Use "you\'re welcome" (short for "you are welcome").',
  },
  {
    regex: /\bits\s+(a|an|the|very|important|found|known)\b/gi,
    suggestion: "it's $1",
    explanation: 'If you mean "it is", write "it\'s". Use "its" only for possession.',
  },
];

// Scan a single piece of text for spelling, grammar, and punctuation issues
export function checkFieldText(
  text: string,
  fieldKey: string,
  sectionTitle: string
): TextIssue[] {
  if (!text || !text.trim()) return [];

  const issues: TextIssue[] = [];

  // 1. Check Repeated Words (e.g., "the the", "in in", "is is")
  const repeatedWordsRegex = /\b([a-zA-Z]{2,})\s+\1\b/gi;
  let match: RegExpExecArray | null;
  while ((match = repeatedWordsRegex.exec(text)) !== null) {
    issues.push({
      id: `${fieldKey}-repeat-${match.index}`,
      fieldKey,
      sectionTitle,
      type: 'grammar',
      original: match[0],
      suggestion: match[1],
      explanation: `Repeated word "${match[1]}". Consider removing the duplicate.`,
      index: match.index,
    });
  }

  // 2. Check Grammar Phrases
  for (const rule of GRAMMAR_PHRASE_PATTERNS) {
    const r = new RegExp(rule.regex);
    let phraseMatch: RegExpExecArray | null;
    while ((phraseMatch = r.exec(text)) !== null) {
      let resolvedSuggestion = rule.suggestion;
      if (resolvedSuggestion.includes('$1') && phraseMatch[1]) {
        resolvedSuggestion = resolvedSuggestion.replace('$1', phraseMatch[1]);
      }
      issues.push({
        id: `${fieldKey}-grammar-${phraseMatch.index}`,
        fieldKey,
        sectionTitle,
        type: 'grammar',
        original: phraseMatch[0],
        suggestion: resolvedSuggestion,
        explanation: rule.explanation,
        index: phraseMatch.index,
      });
    }
  }

  // 3. Check Standalone Lowercase 'i'
  const standaloneIRegex = /(^|[^\w])i([^\w]|$)/g;
  let iMatch: RegExpExecArray | null;
  while ((iMatch = standaloneIRegex.exec(text)) !== null) {
    const offset = iMatch[0].indexOf('i');
    const actualIndex = iMatch.index + offset;
    issues.push({
      id: `${fieldKey}-i-${actualIndex}`,
      fieldKey,
      sectionTitle,
      type: 'grammar',
      original: 'i',
      suggestion: 'I',
      explanation: 'The pronoun "I" should always be capitalized.',
      index: actualIndex,
    });
  }

  // 4. Check Sentence Capitalization after [.!?]
  const sentenceStartRegex = /([.!?]\s+)([a-z])/g;
  let sentMatch: RegExpExecArray | null;
  while ((sentMatch = sentenceStartRegex.exec(text)) !== null) {
    const punctPrefix = sentMatch[1];
    const lowerLetter = sentMatch[2];
    const letterIndex = sentMatch.index + punctPrefix.length;
    issues.push({
      id: `${fieldKey}-cap-${letterIndex}`,
      fieldKey,
      sectionTitle,
      type: 'grammar',
      original: lowerLetter,
      suggestion: lowerLetter.toUpperCase(),
      explanation: 'Sentences must begin with a capital letter.',
      index: letterIndex,
    });
  }

  // Check first character of text if it's a lowercase letter
  const firstLetterMatch = text.match(/^\s*([a-z])/);
  if (firstLetterMatch && firstLetterMatch[1]) {
    const letterIndex = text.indexOf(firstLetterMatch[1]);
    issues.push({
      id: `${fieldKey}-startcap-${letterIndex}`,
      fieldKey,
      sectionTitle,
      type: 'grammar',
      original: firstLetterMatch[1],
      suggestion: firstLetterMatch[1].toUpperCase(),
      explanation: 'The opening word should begin with a capital letter.',
      index: letterIndex,
    });
  }

  // 5. Punctuation spacing checks (e.g., "words,words" or double punctuation like "..")
  const missingSpaceRegex = /([a-zA-Z])([,;:?!])([a-zA-Z])/g;
  let spaceMatch: RegExpExecArray | null;
  while ((spaceMatch = repeatedWordsRegex.exec(text), spaceMatch = missingSpaceRegex.exec(text)) !== null) {
    const orig = spaceMatch[0];
    const repl = `${spaceMatch[1]}${spaceMatch[2]} ${spaceMatch[3]}`;
    issues.push({
      id: `${fieldKey}-punct-${spaceMatch.index}`,
      fieldKey,
      sectionTitle,
      type: 'punctuation',
      original: orig,
      suggestion: repl,
      explanation: `Add a space after punctuation mark "${spaceMatch[2]}".`,
      index: spaceMatch.index,
    });
  }

  // 6. Common Student Spelling Checks
  // Split words by non-word boundaries
  const wordRegex = /\b([a-zA-Z]+)\b/g;
  let wordMatch: RegExpExecArray | null;
  while ((wordMatch = wordRegex.exec(text)) !== null) {
    const word = wordMatch[1];
    const lowerWord = word.toLowerCase();

    if (COMMON_SPELLING_MISTAKES[lowerWord]) {
      let replacement = COMMON_SPELLING_MISTAKES[lowerWord];
      // Preserve uppercase if original word was capitalized
      if (word[0] === word[0].toUpperCase()) {
        replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
      }

      // Avoid duplicates if already caught by repeat words
      const alreadyCaught = issues.some(
        iss => iss.index === wordMatch!.index && iss.type === 'spelling'
      );

      if (!alreadyCaught) {
        issues.push({
          id: `${fieldKey}-spell-${wordMatch.index}`,
          fieldKey,
          sectionTitle,
          type: 'spelling',
          original: word,
          suggestion: replacement,
          explanation: `Common misspelling: "${word}" is usually spelled "${replacement}".`,
          index: wordMatch.index,
        });
      }
    }
  }

  // Sort issues by index
  return issues.sort((a, b) => a.index - b.index);
}

// Check all fields of the report
export function checkEntireReport(report: ReportData): TextIssue[] {
  const allIssues: TextIssue[] = [];

  // Title
  if (report.title) {
    allIssues.push(...checkFieldText(report.title, 'title', 'Title'));
  }
  if (report.subtitle) {
    allIssues.push(...checkFieldText(report.subtitle, 'subtitle', 'Subtitle'));
  }

  // Introduction
  if (report.introduction) {
    allIssues.push(...checkFieldText(report.introduction, 'introduction', 'Introduction'));
  }

  // Subheading Sections
  report.sections.forEach((sec, idx) => {
    if (sec.heading) {
      allIssues.push(...checkFieldText(sec.heading, `sec-heading-${sec.id}`, `Section ${idx + 1} Heading`));
    }
    if (sec.content) {
      allIssues.push(...checkFieldText(sec.content, `sec-content-${sec.id}`, `Section ${idx + 1} Body`));
    }
  });

  // Pictures captions
  report.pictures.forEach((pic, idx) => {
    if (pic.caption) {
      allIssues.push(...checkFieldText(pic.caption, `pic-caption-${idx}`, `Picture ${idx + 1} Caption`));
    }
  });

  // Conclusion
  if (report.conclusion) {
    allIssues.push(...checkFieldText(report.conclusion, 'conclusion', 'Conclusion'));
  }

  // Glossary
  report.glossary.forEach((item, idx) => {
    if (item.term) {
      allIssues.push(...checkFieldText(item.term, `glo-term-${idx}`, `Glossary Term ${idx + 1}`));
    }
    if (item.definition) {
      allIssues.push(...checkFieldText(item.definition, `glo-def-${idx}`, `Glossary Definition ${idx + 1}`));
    }
  });

  return allIssues;
}

// Apply an automatic fix for a detected issue to the report state
export function applyFixToReport(report: ReportData, issue: TextIssue): ReportData {
  const replaceInText = (str: string, orig: string, repl: string): string => {
    // Replace first exact or case-insensitive occurrence
    const idx = str.indexOf(orig);
    if (idx !== -1) {
      return str.slice(0, idx) + repl + str.slice(idx + orig.length);
    }
    const regex = new RegExp(orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    return str.replace(regex, repl);
  };

  const updated: ReportData = JSON.parse(JSON.stringify(report));

  if (issue.fieldKey === 'title') {
    updated.title = replaceInText(updated.title, issue.original, issue.suggestion);
  } else if (issue.fieldKey === 'subtitle') {
    updated.subtitle = replaceInText(updated.subtitle, issue.original, issue.suggestion);
  } else if (issue.fieldKey === 'introduction') {
    updated.introduction = replaceInText(updated.introduction, issue.original, issue.suggestion);
  } else if (issue.fieldKey.startsWith('sec-heading-')) {
    const secId = issue.fieldKey.replace('sec-heading-', '');
    const s = updated.sections.find(sec => sec.id === secId);
    if (s) s.heading = replaceInText(s.heading, issue.original, issue.suggestion);
  } else if (issue.fieldKey.startsWith('sec-content-')) {
    const secId = issue.fieldKey.replace('sec-content-', '');
    const s = updated.sections.find(sec => sec.id === secId);
    if (s) s.content = replaceInText(s.content, issue.original, issue.suggestion);
  } else if (issue.fieldKey.startsWith('pic-caption-')) {
    const picIdx = parseInt(issue.fieldKey.replace('pic-caption-', ''), 10);
    if (updated.pictures[picIdx]) {
      updated.pictures[picIdx].caption = replaceInText(
        updated.pictures[picIdx].caption,
        issue.original,
        issue.suggestion
      );
    }
  } else if (issue.fieldKey === 'conclusion') {
    updated.conclusion = replaceInText(updated.conclusion, issue.original, issue.suggestion);
  } else if (issue.fieldKey.startsWith('glo-term-')) {
    const gloIdx = parseInt(issue.fieldKey.replace('glo-term-', ''), 10);
    if (updated.glossary[gloIdx]) {
      updated.glossary[gloIdx].term = replaceInText(
        updated.glossary[gloIdx].term,
        issue.original,
        issue.suggestion
      );
    }
  } else if (issue.fieldKey.startsWith('glo-def-')) {
    const gloIdx = parseInt(issue.fieldKey.replace('glo-def-', ''), 10);
    if (updated.glossary[gloIdx]) {
      updated.glossary[gloIdx].definition = replaceInText(
        updated.glossary[gloIdx].definition,
        issue.original,
        issue.suggestion
      );
    }
  }

  return updated;
}
