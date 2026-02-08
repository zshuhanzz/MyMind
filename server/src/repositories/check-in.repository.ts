import { query } from '../config/database.js';
import type { CheckInRow } from '../types/index.js';

export const checkInRepository = {
  async create(data: {
    userId: string;
    moodEntryId?: string;
    scheduleId?: string;
    status?: string;
  }): Promise<CheckInRow> {
    const { rows } = await query<CheckInRow>(
      `INSERT INTO check_ins (user_id, mood_entry_id, schedule_id, status, completed_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        data.userId,
        data.moodEntryId || null,
        data.scheduleId || null,
        data.status || 'completed',
        data.status === 'completed' || !data.status ? new Date() : null,
      ]
    );
    return rows[0];
  },

  async findByUser(userId: string, limit = 30, offset = 0): Promise<CheckInRow[]> {
    const { rows } = await query<CheckInRow>(
      `SELECT * FROM check_ins WHERE user_id = $1
       ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return rows;
  },

  async findPending(userId: string): Promise<CheckInRow | null> {
    const { rows } = await query<CheckInRow>(
      `SELECT * FROM check_ins WHERE user_id = $1 AND status = 'pending'
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
    return rows[0] || null;
  },

  async complete(id: string, moodEntryId: string): Promise<CheckInRow | null> {
    const { rows } = await query<CheckInRow>(
      `UPDATE check_ins SET status = 'completed', mood_entry_id = $1, completed_at = NOW()
       WHERE id = $2 RETURNING *`,
      [moodEntryId, id]
    );
    return rows[0] || null;
  },

  async getStreak(userId: string): Promise<number> {
    const { rows } = await query(
      `WITH daily_checkins AS (
         SELECT DISTINCT DATE(completed_at AT TIME ZONE 'UTC') as check_date
         FROM check_ins
         WHERE user_id = $1 AND status = 'completed'
         ORDER BY check_date DESC
       ),
       numbered AS (
         SELECT check_date,
                check_date - (ROW_NUMBER() OVER (ORDER BY check_date DESC))::int * INTERVAL '1 day' as grp
         FROM daily_checkins
       )
       SELECT COUNT(*)::int as streak
       FROM numbered
       WHERE grp = (SELECT grp FROM numbered LIMIT 1)`,
      [userId]
    );
    return rows[0]?.streak || 0;
  },
};
