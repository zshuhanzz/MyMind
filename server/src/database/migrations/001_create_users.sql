CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email               VARCHAR(255) UNIQUE,
    password_hash       VARCHAR(255),
    display_name        VARCHAR(100) NOT NULL,
    avatar_url          VARCHAR(500),
    is_anonymous        BOOLEAN DEFAULT FALSE,
    anonymous_token     VARCHAR(255) UNIQUE,
    onboarding_complete BOOLEAN DEFAULT FALSE,
    timezone            VARCHAR(50) DEFAULT 'UTC',
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),
    last_active_at      TIMESTAMPTZ DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX idx_users_anonymous_token ON users(anonymous_token) WHERE anonymous_token IS NOT NULL;
