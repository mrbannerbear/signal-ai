CREATE TABLE IF NOT EXISTS user_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  overall_summary TEXT,
  aggregated_strengths TEXT[],
  aggregated_weaknesses TEXT[],
  average_fit_score NUMERIC(5,2),
  analysis_count INTEGER DEFAULT 0,
  last_analysis_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own insights" ON user_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insights" ON user_insights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insights" ON user_insights
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own insights" ON user_insights
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_user_insights_user_id ON user_insights(user_id);

CREATE OR REPLACE FUNCTION update_user_insights_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_insights_updated_at
  BEFORE UPDATE ON user_insights
  FOR EACH ROW
  EXECUTE FUNCTION update_user_insights_updated_at();
