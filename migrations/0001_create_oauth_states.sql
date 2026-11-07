-- Migration number: 0001 	 2026-11-07T11:14:57.630Z
CREATE TABLE oauth_states (
    state TEXT PRIMARY KEY,
    expires_at TEXT NOT NULL
);
