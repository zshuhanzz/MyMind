import { query } from '../config/database.js';
import type { MoodEntryRow } from '../types/index.js';

export const moodEntryRepository = {
  async create(data: {
    userId: string;
    rating: number;
    emotionTags: string[];
    note?: string;
    source?: string;
  }): Promise<MoodEntryRow> {
    const { rows } = await query<MoodEntryRow>(
      `INSERT INTO mood_entries (user_id, rating, emotion_tags, note, source)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [data.userId, data.rating, data.emotionTags, data.note || null, data.source || 'check_in']
    );
    return rows[0];
  },

  async findByUser(userId: string, limit = 30, offset = 0): Promise<MoodEntryRow[]> {
    const { rows } = await query<MoodEntryRow>(
      `SELECT * FROM mood_entries WHERE user_id = $1
       ORDER BY recorded_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return rows;
  },

  async getTrends(userId: string, days: number): Promise<{ date: string; avg_rating: number; count: number }[]> {
    const { rows } = await query(
      `SELECT
         DATE(recorded_at AT TIME ZONE 'UTC') as date,
         ROUND(AVG(rating)::numeric, 1)::float as avg_rating,
         COUNT(*)::int as count
       FROM mood_entries
       WHERE user_id = $1 AND recorded_at >= NOW() - INTERVAL '1 day' * $2
       GROUP BY DATE(recorded_at AT TIME ZONE 'UTC')
       ORDER BY date ASC`,
      [userId, days]
    );
    return rows;
  },

  async getEmotionBreakdown(userId: string, days: number): Promise<{ emotion: string; count: number }[]> {
    const { rows } = await query(
      `SELECT unnest(emotion_tags) as emotion, COUNT(*)::int as count
       FROM mood_entries
       WHERE user_id = $1 AND recorded_at >= NOW() - INTERVAL '1 day' * $2
       GROUP BY emotion
       ORDER BY count DESC`,
      [userId, days]
    );
    return rows;
  },

  async getLatest(userId: string): Promise<MoodEntryRow | null> {
    const { rows } = await query<MoodEntryRow>(
      `SELECT * FROM mood_entries WHERE user_id = $1 ORDER BY recorded_at DESC LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  },

  async getWeeklyAverage(userId: string): Promise<number | null> {
    const { rows } = await query(
      `SELECT ROUND(AVG(rating)::numeric, 1)::float as avg
       FROM mood_entries
       WHERE user_id = $1 AND recorded_at >= NOW() - INTERVAL '7 days'`,
      [userId]
    );
    return rows[0]?.avg || null;
  },
};
