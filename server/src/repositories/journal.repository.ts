import { query } from '../config/database.js';
import type { JournalEntryRow } from '../types/index.js';

export const journalRepository = {
  async create(data: {
    userId: string;
    title?: string;
    content: string;
    tags?: string[];
    moodEntryId?: string;
  }): Promise<JournalEntryRow> {
    const wordCount = data.content.split(/\s+/).filter(Boolean).length;
    const { rows } = await query<JournalEntryRow>(
      `INSERT INTO journal_entries (user_id, title, content, tags, mood_entry_id, word_count)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.userId, data.title || null, data.content, data.tags || [], data.moodEntryId || null, wordCount]
    );
    return rows[0];
  },

  async findById(id: string): Promise<JournalEntryRow | null> {
    const { rows } = await query<JournalEntryRow>(
      'SELECT * FROM journal_entries WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async findByUser(userId: string, limit = 20, offset = 0, search?: string): Promise<JournalEntryRow[]> {
    if (search) {
      const { rows } = await query<JournalEntryRow>(
        `SELECT * FROM journal_entries
         WHERE user_id = $1 AND (title ILIKE $4 OR content ILIKE $4)
         ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
        [userId, limit, offset, `%${search}%`]
      );
      return rows;
    }
    const { rows } = await query<JournalEntryRow>(
      `SELECT * FROM journal_entries WHERE user_id = $1
       ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return rows;
  },

  async update(id: string, data: {
    title?: string;
    content?: string;
    tags?: string[];
  }): Promise<JournalEntryRow | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.title !== undefined) { fields.push(`title = $${idx++}`); values.push(data.title); }
    if (data.content !== undefined) {
      fields.push(`content = $${idx++}`);
      values.push(data.content);
      fields.push(`word_count = $${idx++}`);
      values.push(data.content.split(/\s+/).filter(Boolean).length);
    }
    if (data.tags !== undefined) { fields.push(`tags = $${idx++}`); values.push(data.tags); }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = NOW()');
    values.push(id);

    const { rows } = await query<JournalEntryRow>(
      `UPDATE journal_entries SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0] || null;
  },

  async toggleFavorite(id: string): Promise<JournalEntryRow | null> {
    const { rows } = await query<JournalEntryRow>(
      `UPDATE journal_entries SET is_favorite = NOT is_favorite, updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );
    return rows[0] || null;
  },

  async delete(id: string): Promise<void> {
    await query('DELETE FROM journal_entries WHERE id = $1', [id]);
  },
};
