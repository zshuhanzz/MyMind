CREATE TABLE mood_entries (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating          SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 10),
    emotion_tags    TEXT[] DEFAULT '{}',
    note            TEXT,
    source          VARCHAR(20) DEFAULT 'check_in',
    recorded_at     TIMESTAMPTZ DEFAULT NOW(),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mood_entries_user_date ON mood_entries(user_id, recorded_at DESC);
CREATE INDEX idx_mood_entries_user_rating ON mood_entries(user_id, rating);
