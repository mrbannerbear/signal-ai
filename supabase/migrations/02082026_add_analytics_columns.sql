ALTER TABLE analysis
  ADD COLUMN IF NOT EXISTS analysis_summary TEXT,
  ADD COLUMN IF NOT EXISTS overall_fit_score INTEGER,
  ADD COLUMN IF NOT EXISTS overall_fit_label TEXT,
  ADD COLUMN IF NOT EXISTS risk_level TEXT,
  ADD COLUMN IF NOT EXISTS confidence INTEGER,
  ADD COLUMN IF NOT EXISTS dimension_scores JSONB,
  ADD COLUMN IF NOT EXISTS top_strengths JSONB,
  ADD COLUMN IF NOT EXISTS top_weaknesses JSONB;

CREATE INDEX IF NOT EXISTS idx_analysis_overall_fit_score ON analysis(overall_fit_score);
CREATE INDEX IF NOT EXISTS idx_analysis_overall_fit_label ON analysis(overall_fit_label);
CREATE INDEX IF NOT EXISTS idx_analysis_risk_level ON analysis(risk_level);
CREATE INDEX IF NOT EXISTS idx_analysis_job_id ON analysis(job_id);
CREATE INDEX IF NOT EXISTS idx_analysis_profile_id ON analysis(profile_id);
CREATE INDEX IF NOT EXISTS idx_analysis_job_fit_score ON analysis(job_id, overall_fit_score DESC);

