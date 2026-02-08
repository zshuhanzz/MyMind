import { query } from '../config/database.js';
import type { UserRow } from '../types/index.js';

export const userRepository = {
  async findById(id: string): Promise<UserRow | null> {
    const { rows } = await query<UserRow>(
      'SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    return rows[0] || null;
  },

  async findByEmail(email: string): Promise<UserRow | null> {
    const { rows } = await query<UserRow>(
      'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL',
      [email]
    );
    return rows[0] || null;
  },

  async findByAnonymousToken(token: string): Promise<UserRow | null> {
    const { rows } = await query<UserRow>(
      'SELECT * FROM users WHERE anonymous_token = $1 AND deleted_at IS NULL',
      [token]
    );
    return rows[0] || null;
  },

  async create(data: {
    email?: string;
    passwordHash?: string;
    displayName: string;
    isAnonymous?: boolean;
    anonymousToken?: string;
  }): Promise<UserRow> {
    const { rows } = await query<UserRow>(
      `INSERT INTO users (email, password_hash, display_name, is_anonymous, anonymous_token)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        data.email || null,
        data.passwordHash || null,
        data.displayName,
        data.isAnonymous || false,
        data.anonymousToken || null,
      ]
    );
    return rows[0];
  },

  async update(id: string, data: Partial<{
    displayName: string;
    email: string;
    passwordHash: string;
    avatarUrl: string;
    timezone: string;
    onboardingComplete: boolean;
    isAnonymous: boolean;
    anonymousToken: string | null;
  }>): Promise<UserRow | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.displayName !== undefined) { fields.push(`display_name = $${idx++}`); values.push(data.displayName); }
    if (data.email !== undefined) { fields.push(`email = $${idx++}`); values.push(data.email); }
    if (data.passwordHash !== undefined) { fields.push(`password_hash = $${idx++}`); values.push(data.passwordHash); }
    if (data.avatarUrl !== undefined) { fields.push(`avatar_url = $${idx++}`); values.push(data.avatarUrl); }
    if (data.timezone !== undefined) { fields.push(`timezone = $${idx++}`); values.push(data.timezone); }
    if (data.onboardingComplete !== undefined) { fields.push(`onboarding_complete = $${idx++}`); values.push(data.onboardingComplete); }
    if (data.isAnonymous !== undefined) { fields.push(`is_anonymous = $${idx++}`); values.push(data.isAnonymous); }
    if (data.anonymousToken !== undefined) { fields.push(`anonymous_token = $${idx++}`); values.push(data.anonymousToken); }

    if (fields.length === 0) return this.findById(id);

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const { rows } = await query<UserRow>(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} AND deleted_at IS NULL RETURNING *`,
      values
    );
    return rows[0] || null;
  },

  async updateLastActive(id: string): Promise<void> {
    await query('UPDATE users SET last_active_at = NOW() WHERE id = $1', [id]);
  },

  async softDelete(id: string): Promise<void> {
    await query('UPDATE users SET deleted_at = NOW() WHERE id = $1', [id]);
  },
};
