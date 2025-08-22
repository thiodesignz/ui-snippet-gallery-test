CREATE TABLE views (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT,
  snippet_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_views_snippet_id ON views(snippet_id);
CREATE INDEX idx_views_user_id ON views(user_id);
