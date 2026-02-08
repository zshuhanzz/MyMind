CREATE TABLE notification_settings (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_enabled       BOOLEAN DEFAULT FALSE,
    push_enabled        BOOLEAN DEFAULT TRUE,
    push_subscription   JSONB,
    quiet_hours_start   TIME,
    quiet_hours_end     TIME,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);
