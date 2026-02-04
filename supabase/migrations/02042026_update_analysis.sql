-- Drop old tables
DROP TABLE IF EXISTS analysis_result;
DROP TABLE IF EXISTS analysis_run;

-- Create simple analysis table
CREATE TABLE analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, profile_id)
);

-- Enable RLS
ALTER TABLE analysis ENABLE ROW LEVEL SECURITY;

-- Policy: users can read/write their own analyses
CREATE POLICY "Users can manage their own analyses"
ON analysis FOR ALL
USING (
  job_id IN (SELECT id FROM jobs WHERE user_id = auth.uid())
);