CREATE TABLE check_in_schedules (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    frequency       VARCHAR(20) NOT NULL DEFAULT 'daily',
    cron_expression VARCHAR(100),
    preferred_times TIME[] DEFAULT '{09:00}',
    days_of_week    SMALLINT[] DEFAULT '{1,2,3,4,5,6,7}',
    notify_email    BOOLEAN DEFAULT FALSE,
    notify_push     BOOLEAN DEFAULT TRUE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE check_ins (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mood_entry_id   UUID REFERENCES mood_entries(id),
    schedule_id     UUID REFERENCES check_in_schedules(id),
    status          VARCHAR(20) DEFAULT 'pending',
    prompted_at     TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_check_ins_user_status ON check_ins(user_id, status);
CREATE INDEX idx_check_in_schedules_active ON check_in_schedules(is_active) WHERE is_active = TRUE;
