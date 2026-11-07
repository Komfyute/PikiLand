-- Migration number: 0002 	 2026-11-07T13:49:51.429Z
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY,
    github_access_token TEXT NOT NULL,
    expires_at TEXT NOT NULL
);
