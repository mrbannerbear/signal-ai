CREATE TYPE analysis_status AS ENUM ('queued', 'running', 'completed', 'failed');
CREATE type analysis_section AS ENUM ('summary', 'skills', 'gaps', 'seniority', 'location', 'suggestions');

CREATE TABLE analysis_run (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    status analysis_status NOT NULL DEFAULT 'queued',
    created_at TIMESTAMPTZ DEFAULT now(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- 6 records per analysis run, one for each section. This is to track progress of each section which is important for streaming UI.
-- Also this allows users to see partial results if some sections fail.
CREATE TABLE analysis_result (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_run_id UUID REFERENCES analysis_run(id) ON DELETE CASCADE,
    section analysis_section NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_analysis_run_job_status ON analysis_run(job_id, status);
CREATE INDEX idx_analysis_result_run_section ON analysis_result(analysis_run_id, section);

CREATE UNIQUE INDEX unique_active_analysis
ON analysis_run (user_id, job_id, profile_id)
WHERE status IN ('queued', 'running');

CREATE POLICY "analysis_run_select_own"
ON analysis_run
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "analysis_run_insert_own"
ON analysis_run
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "analysis_run_update_own"
ON analysis_run
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "analysis_result_select_own"
ON analysis_result
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM analysis_run ar
    WHERE ar.id = analysis_result.analysis_run_id
      AND ar.user_id = auth.uid()
  )
);

CREATE POLICY "analysis_result_select_own"
ON analysis_result
FOR SELECT
USING (
  analysis_run_id IN (
    SELECT id FROM analysis_run WHERE user_id = auth.uid()
  )
);

CREATE POLICY "analysis_result_insert_own"
ON analysis_result
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM analysis_run ar
    WHERE ar.id = analysis_result.analysis_run_id
      AND ar.user_id = auth.uid()
  )
);