CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending Approval',
  participation_type TEXT NOT NULL,
  team_name TEXT,
  participant_name TEXT NOT NULL,
  participant_email TEXT NOT NULL,
  participant_phone TEXT NOT NULL,
  school TEXT,
  city TEXT,
  members_json TEXT NOT NULL,
  events_json TEXT NOT NULL,
  message TEXT
);

CREATE TABLE IF NOT EXISTS help_tickets (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  reply TEXT
);

CREATE TABLE IF NOT EXISTS authors (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
