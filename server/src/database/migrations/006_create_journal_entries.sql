CREATE TABLE journal_entries (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(300),
    content         TEXT NOT NULL,
    mood_entry_id   UUID REFERENCES mood_entries(id),
    tags            TEXT[] DEFAULT '{}',
    is_favorite     BOOLEAN DEFAULT FALSE,
    word_count      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_journal_user_date ON journal_entries(user_id, created_at DESC);
