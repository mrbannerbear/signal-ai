ALTER TABLE resumes
ADD COLUMN is_analyzed BOOLEAN DEFAULT FALSE,
ADD COLUMN has_applied BOOLEAN DEFAULT FALSE;

UPDATE resumes
SET is_analyzed = FALSE,
    has_applied = FALSE
WHERE is_analyzed IS NULL
   OR has_applied IS NULL;
