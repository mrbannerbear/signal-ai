CREATE TYPE employment_type AS ENUM ('Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship');
CREATE TYPE experience_level AS ENUM ('Entry', 'Mid', 'Senior', 'Director', 'Executive');
CREATE TYPE application_status AS ENUM ('Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected');

CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  company_description TEXT,
  location TEXT NOT NULL,
  
  employment_type employment_type DEFAULT 'Full-time',
  experience_level experience_level DEFAULT 'Mid',
  compensation TEXT,
  posted_date DATE,
  
  description TEXT NOT NULL,
  responsibilities TEXT NOT NULL,
  requirements TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}' NOT NULL,
  other_benefits TEXT,

  status application_status DEFAULT 'Saved',
  match_score INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own jobs" ON jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own jobs" ON jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own jobs" ON jobs FOR DELETE USING (auth.uid() = user_id);