CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  google_id VARCHAR(255) UNIQUE,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  wpm INTEGER NOT NULL,
  accuracy DECIMAL(5,2) NOT NULL,
  test_type VARCHAR(20) NOT NULL, -- 'time', 'words', 'quote'
  duration INTEGER NOT NULL, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_tracking (
  id SERIAL PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL,
  test_count INTEGER DEFAULT 1,
  last_test_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(ip_address, last_test_at::date)
);

CREATE TABLE IF NOT EXISTS quotes (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  author VARCHAR(100),
  submitted_by INTEGER REFERENCES users(id),
  votes INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
