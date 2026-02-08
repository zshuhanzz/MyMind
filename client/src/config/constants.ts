import type { CrisisResource } from '../types';

export const APP_NAME = 'MindBridge';

export const CRISIS_RESOURCES: CrisisResource[] = [
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

export const MOOD_LABELS: Record<number, string> = {
  1:  'Really struggling',
  2:  'Very low',
  3:  'Not great',
  4:  'A bit down',
  5:  'Okay',
  6:  'Decent',
  7:  'Pretty good',
  8:  'Good',
  9:  'Great',
  10: 'Wonderful',
};

export const MOOD_COLORS: Record<string, string> = {
  low:    '#FFE4E9',
  medium: '#FFF8E1',
  high:   '#E8F5E9',
};
