import { query } from '../config/database.js';
import type { MessageRow } from '../types/index.js';

export const messageRepository = {
  async create(data: {
    conversationId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    isCrisisFlagged?: boolean;
    metadata?: Record<string, any>;
  }): Promise<MessageRow> {
    const { rows } = await query<MessageRow>(
      `INSERT INTO messages (conversation_id, role, content, is_crisis_flagged, metadata)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        data.conversationId,
        data.role,
        data.content,
        data.isCrisisFlagged || false,
        JSON.stringify(data.metadata || {}),
      ]
    );
    return rows[0];
  },

  async findByConversation(conversationId: string, limit = 50, offset = 0): Promise<MessageRow[]> {
    const { rows } = await query<MessageRow>(
      `SELECT * FROM messages WHERE conversation_id = $1
       ORDER BY created_at ASC LIMIT $2 OFFSET $3`,
      [conversationId, limit, offset]
    );
    return rows;
  },

  async getRecent(conversationId: string, limit = 20): Promise<MessageRow[]> {
    const { rows } = await query<MessageRow>(
      `SELECT * FROM (
         SELECT * FROM messages WHERE conversation_id = $1
         ORDER BY created_at DESC LIMIT $2
       ) sub ORDER BY created_at ASC`,
      [conversationId, limit]
    );
    return rows;
  },

  async countByConversation(conversationId: string): Promise<number> {
    const { rows } = await query(
      'SELECT COUNT(*)::int as count FROM messages WHERE conversation_id = $1',
      [conversationId]
    );
    return rows[0].count;
  },
};
