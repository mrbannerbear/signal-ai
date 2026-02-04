ALTER TABLE analysis_result
ADD CONSTRAINT analysis_result_run_section_unique UNIQUE (analysis_run_id, section);
