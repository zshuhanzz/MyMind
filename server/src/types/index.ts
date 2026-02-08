export interface UserRow {
  id: string;
  email: string | null;
  password_hash: string | null;
  display_name: string;
  avatar_url: string | null;
  is_anonymous: boolean;
  anonymous_token: string | null;
  onboarding_complete: boolean;
  timezone: string;
  created_at: Date;
  updated_at: Date;
  last_active_at: Date;
  deleted_at: Date | null;
}

export interface MoodEntryRow {
  id: string;
  user_id: string;
  rating: number;
  emotion_tags: string[];
  note: string | null;
  source: string;
  recorded_at: Date;
  created_at: Date;
}

export interface CheckInRow {
  id: string;
  user_id: string;
  mood_entry_id: string | null;
  schedule_id: string | null;
  status: string;
  prompted_at: Date | null;
  completed_at: Date | null;
  created_at: Date;
}

export interface ConversationRow {
  id: string;
  user_id: string;
  title: string | null;
  summary: string | null;
  mood_at_start: number | null;
  mood_at_end: number | null;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  is_crisis_flagged: boolean;
  metadata: Record<string, any>;
  created_at: Date;
}

export interface JournalEntryRow {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  mood_entry_id: string | null;
  tags: string[];
  is_favorite: boolean;
  word_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface JwtPayload {
  userId: string;
  isAnonymous: boolean;
}
