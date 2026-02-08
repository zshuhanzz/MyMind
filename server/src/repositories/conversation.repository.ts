import { query } from '../config/database.js';
import type { ConversationRow } from '../types/index.js';

export const conversationRepository = {
  async create(userId: string, title?: string): Promise<ConversationRow> {
    const { rows } = await query<ConversationRow>(
      `INSERT INTO conversations (user_id, title) VALUES ($1, $2) RETURNING *`,
      [userId, title || null]
    );
    return rows[0];
  },

  async findById(id: string): Promise<ConversationRow | null> {
    const { rows } = await query<ConversationRow>(
      'SELECT * FROM conversations WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async findByUser(userId: string, limit = 20, offset = 0): Promise<ConversationRow[]> {
    const { rows } = await query<ConversationRow>(
      `SELECT * FROM conversations WHERE user_id = $1 AND is_archived = false
       ORDER BY updated_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return rows;
  },

  async updateTitle(id: string, title: string): Promise<void> {
    await query(
      'UPDATE conversations SET title = $1, updated_at = NOW() WHERE id = $2',
      [title, id]
    );
  },

  async updateMood(id: string, field: 'mood_at_start' | 'mood_at_end', mood: number): Promise<void> {
    await query(
      `UPDATE conversations SET ${field} = $1, updated_at = NOW() WHERE id = $2`,
      [mood, id]
    );
  },

  async archive(id: string): Promise<void> {
    await query('UPDATE conversations SET is_archived = true, updated_at = NOW() WHERE id = $1', [id]);
  },

  async updateTimestamp(id: string): Promise<void> {
    await query('UPDATE conversations SET updated_at = NOW() WHERE id = $1', [id]);
  },
};
