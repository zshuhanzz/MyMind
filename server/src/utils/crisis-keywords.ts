export interface CrisisAssessment {
  detected: boolean;
  severity: 'high' | 'medium' | 'low' | 'none';
  trigger: 'keyword' | null;
  pattern: string | null;
}

export const CRISIS_PATTERNS = {
  high_severity: [
    /\b(kill|end)\s+(my\s*self|my\s*life)\b/i,
    /\bsuicid(e|al)\b/i,
    /\bwant\s+to\s+die\b/i,
    /\bend\s+it\s+all\b/i,
    /\bnot\s+worth\s+living\b/i,
    /\bbetter\s+off\s+(dead|without\s+me)\b/i,
    /\bplan\s+to\s+(hurt|harm|kill)\b/i,
    /\bno\s+reason\s+to\s+live\b/i,
    /\bsay(ing)?\s+goodbye\b/i,
  ],
  medium_severity: [
    /\bself[\s-]?harm\b/i,
    /\bcutting\s+(my\s*self|myself)\b/i,
    /\bhurt\s+(my\s*self|myself)\b/i,
    /\bdon'?t\s+want\s+to\s+be\s+here\b/i,
    /\bwhat'?s\s+the\s+point\b/i,
    /\bgive\s+up\b/i,
    /\bcan'?t\s+(go|keep|do)\s+on\b/i,
    /\bnobody\s+(cares|would\s+miss)\b/i,
    /\boverdos(e|ing)\b/i,
  ],
  low_severity: [
    /\bhopeless\b/i,
    /\bworthless\b/i,
    /\btrapped\b/i,
    /\bburden\b/i,
    /\bdisappear\b/i,
    /\bempty\s+inside\b/i,
  ],
};

export const CRISIS_RESOURCES = [
  {
    name: '988 Suicide & Crisis Lifeline',
    action: 'Call or text 988',
    url: 'https://988lifeline.org',
    available: '24/7',
  },
  {
    name: 'Crisis Text Line',
    action: 'Text HOME to 741741',
    url: 'https://www.crisistextline.org',
    available: '24/7',
  },
  {
    name: 'International Association for Suicide Prevention',
    action: "Find your country's helpline",
    url: 'https://www.iasp.info/resources/Crisis_Centres/',
    available: 'Varies by country',
  },
  {
    name: 'Emergency Services',
    action: 'Call 911 (US) or your local emergency number',
    url: null,
    available: '24/7',
  },
];
