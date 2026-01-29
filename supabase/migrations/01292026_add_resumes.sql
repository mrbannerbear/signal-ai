CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_hash TEXT NOT NULL,
  file_name TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_resumes_user_hash ON resumes(user_id, file_hash);
CREATE INDEX idx_resumes_created_at ON resumes(created_at);

ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see and create their own resumes"
ON resumes
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
