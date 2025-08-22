CREATE TABLE likes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL,
  snippet_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, snippet_id)
);

CREATE INDEX idx_likes_snippet_id ON likes(snippet_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
