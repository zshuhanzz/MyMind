import type { EmotionTag } from '../types';

export const EMOTIONS: EmotionTag[] = [
  { id: 1,  name: 'happy',       category: 'positive', emoji: '😊', sortOrder: 1 },
  { id: 2,  name: 'grateful',    category: 'positive', emoji: '🙏', sortOrder: 2 },
  { id: 3,  name: 'calm',        category: 'positive', emoji: '😌', sortOrder: 3 },
  { id: 4,  name: 'hopeful',     category: 'positive', emoji: '🌱', sortOrder: 4 },
  { id: 5,  name: 'energetic',   category: 'positive', emoji: '⚡', sortOrder: 5 },
  { id: 6,  name: 'loved',       category: 'positive', emoji: '💜', sortOrder: 6 },
  { id: 7,  name: 'anxious',     category: 'negative', emoji: '😰', sortOrder: 7 },
  { id: 8,  name: 'sad',         category: 'negative', emoji: '😢', sortOrder: 8 },
  { id: 9,  name: 'angry',       category: 'negative', emoji: '😤', sortOrder: 9 },
  { id: 10, name: 'overwhelmed', category: 'negative', emoji: '🌊', sortOrder: 10 },
  { id: 11, name: 'lonely',      category: 'negative', emoji: '🫂', sortOrder: 11 },
  { id: 12, name: 'exhausted',   category: 'negative', emoji: '😮‍💨', sortOrder: 12 },
  { id: 13, name: 'numb',        category: 'neutral',  emoji: '😶', sortOrder: 13 },
  { id: 14, name: 'confused',    category: 'neutral',  emoji: '🤔', sortOrder: 14 },
  { id: 15, name: 'restless',    category: 'neutral',  emoji: '🔄', sortOrder: 15 },
  { id: 16, name: 'bored',       category: 'neutral',  emoji: '😐', sortOrder: 16 },
];
