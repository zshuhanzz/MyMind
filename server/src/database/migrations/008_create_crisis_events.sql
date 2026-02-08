CREATE TABLE crisis_events (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_id      UUID REFERENCES messages(id),
    trigger_type    VARCHAR(30) NOT NULL,
    trigger_details JSONB,
    resources_shown TEXT[] DEFAULT '{}',
    acknowledged    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crisis_events_user ON crisis_events(user_id, created_at DESC);
