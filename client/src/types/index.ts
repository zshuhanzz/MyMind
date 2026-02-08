export interface User {
  id: string;
  email: string | null;
  displayName: string;
  avatarUrl: string | null;
  isAnonymous: boolean;
  onboardingComplete: boolean;
  timezone: string;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  rating: number;
  emotionTags: string[];
  note: string | null;
  source: 'check_in' | 'manual' | 'chat';
  recordedAt: string;
}

export interface CheckIn {
  id: string;
  userId: string;
  moodEntryId: string | null;
  status: 'pending' | 'completed' | 'skipped' | 'expired';
  promptedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface CheckInSchedule {
  id: string;
  frequency: 'daily' | 'twice_daily' | 'weekly' | 'custom';
  cronExpression: string | null;
  preferredTimes: string[];
  daysOfWeek: number[];
  notifyEmail: boolean;
  notifyPush: boolean;
  isActive: boolean;
}

export interface Conversation {
  id: string;
  title: string | null;
  summary: string | null;
  moodAtStart: number | null;
  moodAtEnd: number | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  isCrisisFlagged: boolean;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  title: string | null;
  content: string;
  moodEntryId: string | null;
  tags: string[];
  isFavorite: boolean;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmotionTag {
  id: number;
  name: string;
  category: 'positive' | 'negative' | 'neutral';
  emoji: string;
  sortOrder: number;
}

export interface CrisisResource {
  name: string;
  action: string;
  url: string | null;
  available: string;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  pushEnabled: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
}

export interface DashboardSummary {
  currentStreak: number;
  pendingCheckIn: CheckIn | null;
  recentMoods: MoodEntry[];
  weeklyAverage: number | null;
  topEmotions: { name: string; count: number }[];
}

export interface MoodTrend {
  date: string;
  avgRating: number;
  entries: number;
}

export interface Insight {
  id: string;
  text: string;
  type: 'pattern' | 'encouragement' | 'observation';
  createdAt: string;
}
