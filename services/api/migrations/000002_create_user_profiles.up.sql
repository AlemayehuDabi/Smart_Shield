-- Onboarding-quiz data lives in a 1:1 profile table rather than on `users`,
-- keeping auth-critical columns lean and letting the profile evolve independently.
CREATE TYPE risk_tolerance AS ENUM ('conservative', 'moderate', 'aggressive');
CREATE TYPE experience_level AS ENUM ('beginner', 'intermediate', 'advanced');

CREATE TABLE user_profiles (
    user_id           UUID PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    risk_tolerance    risk_tolerance,
    experience_level  experience_level,
    preferred_markets TEXT[] NOT NULL DEFAULT '{}',
    onboarded         BOOLEAN NOT NULL DEFAULT false,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
